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
    const allInventory = await prisma.inventory.findMany({ where: { userId: user.id } });
    const lowStockItems = allInventory.filter(item => item.currentStock <= item.minStock);
    lowStockItems.sort((a, b) => a.currentStock - b.currentStock);
    return NextResponse.json({ items: lowStockItems });
   
  } catch (error) {
    console.error('Get low stock error:', error);
    return NextResponse.json({ message: 'Error fetching low stock items' }, { status: 500 });
  }
} 