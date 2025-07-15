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
  const category = searchParams.get('category') || undefined;
  const search = searchParams.get('search') || undefined;
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const where: any = { userId: user.id };
  if (category) where.category = category;
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { supplier: { contains: search, mode: 'insensitive' } },
    ];
  }
  const skip = (page - 1) * limit;
  try {
    const [items, total] = await Promise.all([
      prisma.inventory.findMany({ where, skip, take: limit, orderBy: { updatedAt: 'desc' } }),
      prisma.inventory.count({ where }),
    ]);
    // Add status based on stock levels
    const itemsWithStatus = items.map(item => ({
      ...item,
      status: item.currentStock <= item.minStock ? 'low' : 'good',
    }));
    return NextResponse.json({
      items: itemsWithStatus,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get inventory error:', error);
    return NextResponse.json({ message: 'Error fetching inventory' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const user = await authenticate(req);
  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  const body = await req.json();
  const { name, currentStock, unit } = body;
  if (!name || typeof currentStock !== 'number' || !unit) {
    return NextResponse.json({ message: 'Invalid input' }, { status: 400 });
  }
  try {
    const item = await prisma.inventory.create({
      data: {
        ...body,
        userId: user.id,
        currentStock: typeof currentStock === 'string' ? parseFloat(currentStock) : currentStock,
        minStock: body.minStock ? (typeof body.minStock === 'string' ? parseFloat(body.minStock) : body.minStock) : 0,
        costPerUnit: body.costPerUnit ? (typeof body.costPerUnit === 'string' ? parseFloat(body.costPerUnit) : body.costPerUnit) : null,
        lastRestocked: body.lastRestocked ? new Date(body.lastRestocked) : null,
        expiryDate: body.expiryDate ? new Date(body.expiryDate) : null,
      },
    });
    return NextResponse.json({ message: 'Inventory item created successfully', item }, { status: 201 });
  } catch (error) {
    console.error('Create inventory error:', error);
    return NextResponse.json({ message: 'Error creating inventory item' }, { status: 500 });
  }
} 