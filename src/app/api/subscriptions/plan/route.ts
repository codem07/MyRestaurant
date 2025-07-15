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

export async function PUT(req: NextRequest) {
  const user = await authenticate(req);
  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  const { plan } = await req.json();
  if (!plan) {
    return NextResponse.json({ message: 'Invalid input' }, { status: 400 });
  }
  try {
    const expirationDate = new Date();
    expirationDate.setMonth(expirationDate.getMonth() + 1);
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        subscriptionPlan: plan,
        subscriptionStatus: 'active',
        subscriptionExpiresAt: expirationDate,
      },
      select: {
        subscriptionPlan: true,
        subscriptionStatus: true,
        subscriptionExpiresAt: true,
      },
    });
    return NextResponse.json({ message: 'Subscription updated successfully', subscription: updatedUser });
  } catch (error) {
    console.error('Update subscription error:', error);
    return NextResponse.json({ message: 'Error updating subscription' }, { status: 500 });
  }
} 