import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(req, context) {
  const { params } = context;
  const id = params.id;

  try {
    await prisma.clientProject.deleteMany({
      where: {
        projectId: id,
      },
    });

    await prisma.project.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Project deleted" });
  } catch (error) {
    console.error("Error deleting project:", error);
    return NextResponse.json(
      { error: "Failed to delete project" },
      { status: 500 }
    );
  }
}
