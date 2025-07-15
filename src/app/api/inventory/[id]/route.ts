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
    const item = await prisma.inventory.findFirst({ where: { id, userId: user.id } });
    if (!item) {
      return NextResponse.json({ message: 'Inventory item not found' }, { status: 404 });
    }
    return NextResponse.json({ item });
  } catch (error) {
    console.error('Get inventory item error:', error);
    return NextResponse.json({ message: 'Error fetching inventory item' }, { status: 500 });
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
  if (updateData.currentStock) updateData.currentStock = parseFloat(updateData.currentStock);
  if (updateData.minStock) updateData.minStock = parseFloat(updateData.minStock);
  if (updateData.costPerUnit) updateData.costPerUnit = parseFloat(updateData.costPerUnit);
  if (updateData.lastRestocked) updateData.lastRestocked = new Date(updateData.lastRestocked);
  if (updateData.expiryDate) updateData.expiryDate = new Date(updateData.expiryDate);
  try {
    const result = await prisma.inventory.updateMany({ where: { id, userId: user.id }, data: updateData });
    if (result.count === 0) {
      return NextResponse.json({ message: 'Inventory item not found' }, { status: 404 });
    }
    const updatedItem = await prisma.inventory.findUnique({ where: { id } });
    return NextResponse.json({ message: 'Inventory item updated successfully', item: updatedItem });
  } catch (error) {
    console.error('Update inventory error:', error);
    return NextResponse.json({ message: 'Error updating inventory item' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await authenticate(req);
  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  const { id } = params;
  try {
    const result = await prisma.inventory.deleteMany({ where: { id, userId: user.id } });
    if (result.count === 0) {
      return NextResponse.json({ message: 'Inventory item not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Inventory item deleted successfully' });
  } catch (error) {
    console.error('Delete inventory error:', error);
    return NextResponse.json({ message: 'Error deleting inventory item' }, { status: 500 });
  }
} 