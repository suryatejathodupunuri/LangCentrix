import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function PUT(req, context) {
  const { id } = await context.params;
  const body = await req.json();

  try {
    const updatedClient = await prisma.client.update({
      where: { id },
      data: {
        name: body.name,
        email: body.email,
        phone: body.phone,
        address: body.address,
      },
    });

    return NextResponse.json(updatedClient);
  } catch (error) {
    console.error("Error updating client:", error);
    return NextResponse.json({ error: "Failed to update client" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  const { id } = params;

  try {
    await prisma.client.delete({ where: { id } });
    return NextResponse.json({ message: "Client deleted" });
  } catch (error) {
    console.error("Error deleting client:", error);
    return NextResponse.json({ error: "Failed to delete client" }, { status: 500 });
  }
}
