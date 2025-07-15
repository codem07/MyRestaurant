import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
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
  const { pathname } = req.nextUrl;
  if (pathname.endsWith('/profile')) {
    const user = await authenticate(req);
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    try {
      const userProfile = await prisma.user.findUnique({
        where: { id: user.id },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          restaurantName: true,
          phone: true,
          restaurantAddress: true,
          subscriptionPlan: true,
          subscriptionStatus: true,
          subscriptionExpiresAt: true,
          createdAt: true,
        },
      });
      return NextResponse.json({ user: userProfile });
    } catch (error) {
      console.error('Get profile error:', error);
      return NextResponse.json({ message: 'Error fetching profile' }, { status: 500 });
    }
  }
  return NextResponse.json({ message: 'Not found' }, { status: 404 });
}

export async function PUT(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const user = await authenticate(req);
  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  const body = await req.json();

  // Update profile
  if (pathname.endsWith('/profile')) {
    const { firstName, lastName, restaurantName, phone, address } = body;
    if (!firstName || !lastName || !restaurantName) {
      return NextResponse.json({ message: 'Invalid input' }, { status: 400 });
    }
    try {
      const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: {
          firstName,
          lastName,
          restaurantName,
          phone,
          restaurantAddress: address,
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          restaurantName: true,
          phone: true,
          restaurantAddress: true,
        },
      });
      return NextResponse.json({ message: 'Profile updated successfully', user: updatedUser });
    } catch (error) {
      console.error('Profile update error:', error);
      return NextResponse.json({ message: 'Error updating profile' }, { status: 500 });
    }
  }

  // Change password
  if (pathname.endsWith('/password')) {
    const { currentPassword, newPassword } = body;
    if (!currentPassword || !newPassword || newPassword.length < 6) {
      return NextResponse.json({ message: 'Invalid input' }, { status: 400 });
    }
    try {
      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isCurrentPasswordValid) {
        return NextResponse.json({ message: 'Current password is incorrect' }, { status: 400 });
      }
      const hashedNewPassword = await bcrypt.hash(newPassword, 12);
      await prisma.user.update({
        where: { id: user.id },
        data: { password: hashedNewPassword },
      });
      return NextResponse.json({ message: 'Password updated successfully' });
    } catch (error) {
      console.error('Password update error:', error);
      return NextResponse.json({ message: 'Error updating password' }, { status: 500 });
    }
  }

  return NextResponse.json({ message: 'Not found' }, { status: 404 });
} 