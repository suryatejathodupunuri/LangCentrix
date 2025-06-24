import { NextResponse } from 'next/server';
import { createUser } from '@/lib/userService';
import { signIn } from 'next-auth/react'; // Not used here but left untouched

export async function POST(request) {
  try {
    const { name, email, password } = await request.json();

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    // Inline replacement for isValidEmail
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!isEmailValid) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    // Inline replacement for isValidPassword
    const isPasswordValid = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password);
    if (!isPasswordValid) {
      return NextResponse.json(
        {
          error:
            'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number'
        },
        { status: 400 }
      );
    }

    // Create user
    const user = await createUser({ name, email, password });

    // Return success response
    return NextResponse.json(
      {
        message: 'User created successfully',
        user: {
          id: user.id || user._id,
          name: user.name,
          email: user.email
        }
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Signup error:', error);

    if (error.message === 'User already exists with this email') {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
