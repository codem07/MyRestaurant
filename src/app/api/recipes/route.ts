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
  const difficulty = searchParams.get('difficulty') || undefined;
  const search = searchParams.get('search') || undefined;
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const where: any = {
    userId: user.id,
    isActive: true,
  };
  if (category) where.category = category;
  if (difficulty) where.difficulty = difficulty;
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
  }
  const skip = (page - 1) * limit;
  try {
    const [recipes, total] = await Promise.all([
      prisma.recipe.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
      prisma.recipe.count({ where }),
    ]);
    return NextResponse.json({
      recipes,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get recipes error:', error);
    return NextResponse.json({ message: 'Error fetching recipes' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const user = await authenticate(req);
  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  const body = await req.json();
  const { name, category, difficulty } = body;
  if (!name || !category || !difficulty) {
    return NextResponse.json({ message: 'Invalid input' }, { status: 400 });
  }
  try {
    const recipe = await prisma.recipe.create({
      data: {
        ...body,
        userId: user.id,
      },
    });
    return NextResponse.json({ message: 'Recipe created successfully', recipe }, { status: 201 });
  } catch (error) {
    console.error('Create recipe error:', error);
    return NextResponse.json({ message: 'Error creating recipe' }, { status: 500 });
  }
} 