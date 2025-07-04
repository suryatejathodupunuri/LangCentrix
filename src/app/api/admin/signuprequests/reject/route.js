import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req) {
  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

    await prisma.signupRequest.delete({ where: { id } });

    return NextResponse.json({ message: 'Request rejected and deleted' });
  } catch (error) {
    console.error('Rejection error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
