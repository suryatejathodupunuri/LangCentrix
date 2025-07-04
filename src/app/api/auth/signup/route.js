import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    const { name, email, password } = await request.json();

    // Basic validation
    if (!name || !email || !password) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: 'An account with this email already exists' }, { status: 409 });
    }

    // Check if signup request already exists
    const existingRequest = await prisma.signupRequest.findUnique({ where: { email } });
    if (existingRequest) {
      return NextResponse.json({ error: 'Signup request already submitted' }, { status: 409 });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new signup request
    await prisma.signupRequest.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return NextResponse.json(
      { message: 'Signup request submitted. Awaiting admin approval.' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Signup request error:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
