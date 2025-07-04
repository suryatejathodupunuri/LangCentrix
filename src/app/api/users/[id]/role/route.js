import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';

export async function PUT(req, context) {
  // Await the context.params object
  const { id } = context.params;

  const { name, email, password, role } = await req.json();

  try {
    const dataToUpdate = {
      name,
      email,
      role,
      updatedAt: new Date(),
    };

    if (password && password.trim() !== '') {
      dataToUpdate.password = await hashPassword(password);
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: dataToUpdate,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        updatedAt: true,
        lastLogin: true,
        isActive: true,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (err) {
    console.error('Failed to update user:', err);
    return NextResponse.json({ error: 'Error updating user' }, { status: 500 });
  }
}

// New DELETE method
export async function DELETE(req, context) {
  const { id } = context.params;

  try {
    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('Failed to delete user:', err);
    return NextResponse.json({ error: 'Error deleting user' }, { status: 500 });
  }
}
