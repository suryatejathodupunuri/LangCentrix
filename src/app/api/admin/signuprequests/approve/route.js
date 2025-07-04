import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req) {
  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

    // Get the request
    const request = await prisma.signupRequest.findUnique({ where: { id } });
    if (!request) return NextResponse.json({ error: 'Signup request not found' }, { status: 404 });

    // Check if user already exists
    const existing = await prisma.user.findUnique({ where: { email: request.email } });
    if (existing) return NextResponse.json({ error: 'User already exists' }, { status: 409 });

    // Create user
    await prisma.user.create({
      data: {
        name: request.name,
        email: request.email,
        password: request.password, // already hashed
        role: 'Editor',
        isActive: true,
      },
    });

    // Delete the signup request
    await prisma.signupRequest.delete({ where: { id } });

    return NextResponse.json({ message: 'User approved successfully' });
  } catch (error) {
    console.error('Approval error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
