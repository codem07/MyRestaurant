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
    const next24h = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const tables = await prisma.table.findMany({
      where: { userId: user.id },
      include: {
        orders: {
          where: { status: { in: ['pending', 'in-progress'] } },
        },
        reservations: {
          where: {
            reservationDate: { gte: now, lte: next24h },
            status: 'confirmed',
          },
        },
      },
      orderBy: { tableNumber: 'asc' },
    });
    return NextResponse.json({ tables });
  } catch (error) {
    console.error('Get tables error:', error);
    return NextResponse.json({ message: 'Error fetching tables' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const user = await authenticate(req);
  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  const body = await req.json();
  const { tableNumber, capacity } = body;
  if (!tableNumber || !capacity) {
    return NextResponse.json({ message: 'Invalid input' }, { status: 400 });
  }
  try {
    const table = await prisma.table.create({
      data: {
        ...body,
        userId: user.id,
        tableNumber: parseInt(tableNumber),
        capacity: parseInt(capacity),
        xPosition: body.xPosition ? parseFloat(body.xPosition) : 0,
        yPosition: body.yPosition ? parseFloat(body.yPosition) : 0,
      },
    });
    return NextResponse.json({ message: 'Table created successfully', table }, { status: 201 });
  } catch (error: any) {
    console.error('Create table error:', error);
    if (error.code === 'P2002') {
      return NextResponse.json({ message: 'Table number already exists' }, { status: 400 });
    }
    return NextResponse.json({ message: 'Error creating table' }, { status: 500 });
  }
} 