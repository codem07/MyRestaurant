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
  const { searchParams } = req.nextUrl;
  const period = searchParams.get('period') || '7d';
  let dateFilter;
  const now = new Date();
  switch (period) {
    case '7d':
      dateFilter = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case '30d':
      dateFilter = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    case '90d':
      dateFilter = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      break;
    default:
      dateFilter = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  }
  try {
    // Prisma does not support GROUP BY DATE directly, so use $queryRaw
    const salesData = await prisma.$queryRawUnsafe<any[]>(
      `SELECT DATE(created_at) as date, COUNT(*) as orders, SUM(total) as revenue FROM orders WHERE user_id = ? AND created_at >= ? AND status = 'completed' GROUP BY DATE(created_at) ORDER BY date ASC`,
      user.id,
      dateFilter
    );
    return NextResponse.json({ salesData });
  } catch (error) {
    console.error('Get sales data error:', error);
    return NextResponse.json({ message: 'Error fetching sales data' }, { status: 500 });
  }
} 