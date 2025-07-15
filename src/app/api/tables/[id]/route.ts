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

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await authenticate(req);
  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  const { id } = params;
  try {
    const table = await prisma.table.findFirst({
      where: { id, userId: user.id },
      include: { orders: true, reservations: true },
    });
    if (!table) {
      return NextResponse.json({ message: 'Table not found' }, { status: 404 });
    }
    return NextResponse.json({ table });
  } catch (error) {
    console.error('Get table error:', error);
    return NextResponse.json({ message: 'Error fetching table' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await authenticate(req);
  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  const { id } = params;
  const body = await req.json();
  const updateData: any = { ...body };
  if (updateData.tableNumber) updateData.tableNumber = parseInt(updateData.tableNumber);
  if (updateData.capacity) updateData.capacity = parseInt(updateData.capacity);
  if (updateData.xPosition !== undefined) updateData.xPosition = parseFloat(updateData.xPosition);
  if (updateData.yPosition !== undefined) updateData.yPosition = parseFloat(updateData.yPosition);
  try {
    const result = await prisma.table.updateMany({ where: { id, userId: user.id }, data: updateData });
    if (result.count === 0) {
      return NextResponse.json({ message: 'Table not found' }, { status: 404 });
    }
    const updatedTable = await prisma.table.findUnique({ where: { id } });
    return NextResponse.json({ message: 'Table updated successfully', table: updatedTable });
  } catch (error) {
    console.error('Update table error:', error);
    return NextResponse.json({ message: 'Error updating table' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await authenticate(req);
  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  const { id } = params;
  try {
    const result = await prisma.table.deleteMany({ where: { id, userId: user.id } });
    if (result.count === 0) {
      return NextResponse.json({ message: 'Table not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Table deleted successfully' });
  } catch (error) {
    console.error('Delete table error:', error);
    return NextResponse.json({ message: 'Error deleting table' }, { status: 500 });
  }
} 