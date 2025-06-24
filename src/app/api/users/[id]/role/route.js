import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(req, { params }) {
  const { id } = params;
  const { role } = await req.json();

  try {
    const updated = await prisma.user.update({
      where: { id },
      data: { role },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error('Failed to update user role:', err);
    return NextResponse.json({ error: 'Error updating role' }, { status: 500 });
  }
}
