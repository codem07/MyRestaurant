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
    const order = await prisma.order.findFirst({
      where: { id, userId: user.id },
      include: { table: true },
    });
    if (!order) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }
    return NextResponse.json({ order });
  } catch (error) {
    console.error('Get order error:', error);
    return NextResponse.json({ message: 'Error fetching order' }, { status: 500 });
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
  if (updateData.subtotal) updateData.subtotal = parseFloat(updateData.subtotal);
  if (updateData.tax) updateData.tax = parseFloat(updateData.tax);
  if (updateData.tip) updateData.tip = parseFloat(updateData.tip);
  if (updateData.total) updateData.total = parseFloat(updateData.total);
  try {
    const result = await prisma.order.updateMany({ where: { id, userId: user.id }, data: updateData });
    if (result.count === 0) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }
    const updatedOrder = await prisma.order.findUnique({
      where: { id },
      include: { table: true },
    });
    return NextResponse.json({ message: 'Order updated successfully', order: updatedOrder });
  } catch (error) {
    console.error('Update order error:', error);
    return NextResponse.json({ message: 'Error updating order' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await authenticate(req);
  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  const { id } = params;
  try {
    const result = await prisma.order.deleteMany({ where: { id, userId: user.id } });
    if (result.count === 0) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Delete order error:', error);
    return NextResponse.json({ message: 'Error deleting order' }, { status: 500 });
  }
} 