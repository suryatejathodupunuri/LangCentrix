import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyPassword, hashPassword } from '@/lib/auth';

export async function PUT(req, context) {
  const { id } = context.params;
  const { currentPassword, newPassword, reenterNewPassword } = await req.json();

  if (!currentPassword || !newPassword || !reenterNewPassword) {
    return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
  }

  if (newPassword !== reenterNewPassword) {
    return NextResponse.json({ error: 'New passwords do not match' }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const isMatch = await verifyPassword(currentPassword, user.password);

    if (!isMatch) {
      return NextResponse.json({ error: 'Current password is incorrect' }, { status: 401 });
    }

    const hashedNewPassword = await hashPassword(newPassword);

    await prisma.user.update({
      where: { id },
      data: {
        password: hashedNewPassword,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error('Error changing password:', err);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
