import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'changeme';

function getTokenFromHeader(req: NextRequest): string | null {
  const authHeader = req.headers.get('authorization');
  if (!authHeader) return null;
  return authHeader.replace('Bearer ', '');
}

async function authenticate(req: NextRequest) {
  const token = getTokenFromHeader(req);
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
    return user;
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  const user = await authenticate(req);
  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  try {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [todayOrders, todayRevenue, weeklyOrders, monthlyRevenue] = await Promise.all([
      prisma.order.count({
        where: { userId: user.id, createdAt: { gte: startOfDay } },
      }),
      prisma.order.aggregate({
        where: { userId: user.id, createdAt: { gte: startOfDay }, status: 'completed' },
        _sum: { total: true },
      }),
      prisma.order.count({
        where: { userId: user.id, createdAt: { gte: startOfWeek } },
      }),
      prisma.order.aggregate({
        where: { userId: user.id, createdAt: { gte: startOfMonth }, status: 'completed' },
        _sum: { total: true },
      }),
    ]);

    const allInventory = await prisma.inventory.findMany({ where: { userId: user.id } });
    const lowStockCount = allInventory.filter(item => item.currentStock <= item.minStock).length;

    const activeTables = await prisma.table.count({
      where: { userId: user.id, status: { not: 'available' } },
    });

    return NextResponse.json({
      todayOrders,
      todayRevenue: todayRevenue._sum.total || 0,
      weeklyOrders,
      monthlyRevenue: monthlyRevenue._sum.total || 0,
      lowStockItems: lowStockCount,
      activeTables,
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    return NextResponse.json({ message: 'Error fetching analytics' }, { status: 500 });
  }
} 