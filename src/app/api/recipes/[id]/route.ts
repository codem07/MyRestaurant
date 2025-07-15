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
    const recipe = await prisma.recipe.findFirst({ where: { id, userId: user.id } });
    if (!recipe) {
      return NextResponse.json({ message: 'Recipe not found' }, { status: 404 });
    }
    return NextResponse.json({ recipe });
  } catch (error) {
    console.error('Get recipe error:', error);
    return NextResponse.json({ message: 'Error fetching recipe' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await authenticate(req);
  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  const { id } = params;
  const body = await req.json();
  try {
    const result = await prisma.recipe.updateMany({ where: { id, userId: user.id }, data: body });
    if (result.count === 0) {
      return NextResponse.json({ message: 'Recipe not found' }, { status: 404 });
    }
    const updatedRecipe = await prisma.recipe.findUnique({ where: { id } });
    return NextResponse.json({ message: 'Recipe updated successfully', recipe: updatedRecipe });
  } catch (error) {
    console.error('Update recipe error:', error);
    return NextResponse.json({ message: 'Error updating recipe' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await authenticate(req);
  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  const { id } = params;
  try {
    const result = await prisma.recipe.updateMany({ where: { id, userId: user.id }, data: { isActive: false } });
    if (result.count === 0) {
      return NextResponse.json({ message: 'Recipe not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Recipe deleted successfully' });
  } catch (error) {
    console.error('Delete recipe error:', error);
    return NextResponse.json({ message: 'Error deleting recipe' }, { status: 500 });
  }
} 