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
  const status = searchParams.get('status') || undefined;
  const orderType = searchParams.get('orderType') || undefined;
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const where: any = { userId: user.id };
  if (status) where.status = status;
  if (orderType) where.orderType = orderType;
  const skip = (page - 1) * limit;
  try {
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: { table: true },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.order.count({ where }),
    ]);
    return NextResponse.json({
      orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get orders error:', error);
    return NextResponse.json({ message: 'Error fetching orders' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const user = await authenticate(req);
  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  const body = await req.json();
  const { items, subtotal, total } = body;
  if (!Array.isArray(items) || items.length === 0 || typeof subtotal !== 'number' || typeof total !== 'number') {
    return NextResponse.json({ message: 'Invalid input' }, { status: 400 });
  }
  try {
    const order = await prisma.order.create({
      data: {
        ...body,
        userId: user.id,
        subtotal: typeof subtotal === 'string' ? parseFloat(subtotal) : subtotal,
        tax: body.tax ? (typeof body.tax === 'string' ? parseFloat(body.tax) : body.tax) : 0,
        tip: body.tip ? (typeof body.tip === 'string' ? parseFloat(body.tip) : body.tip) : 0,
        total: typeof total === 'string' ? parseFloat(total) : total,
      },
      include: { table: true },
    });
    return NextResponse.json({ message: 'Order created successfully', order }, { status: 201 });
  } catch (error) {
    console.error('Create order error:', error);
    return NextResponse.json({ message: 'Error creating order' }, { status: 500 });
  }
} 