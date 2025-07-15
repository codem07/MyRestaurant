import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

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
    jwt.verify(token, JWT_SECRET);
    return true;
  } catch {
    return false;
  }
}

export async function GET(req: NextRequest) {
  const isAuth = await authenticate(req);
  if (!isAuth) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  // Mock data for now
  const popularItems = [
    { name: 'Butter Chicken', orders: 45, revenue: 1350 },
    { name: 'Biryani', orders: 38, revenue: 1520 },
    { name: 'Masala Dosa', orders: 32, revenue: 960 },
    { name: 'Gulab Jamun', orders: 28, revenue: 560 },
    { name: 'Samosa', orders: 25, revenue: 375 },
  ];
  return NextResponse.json({ popularItems });
} 