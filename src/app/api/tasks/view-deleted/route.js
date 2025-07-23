import { prisma } from "../../../../lib/prisma";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const skip = (page - 1) * limit;

  try {
    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        where: { Delete_Flag: true },
        skip,
        take: limit,
        orderBy: { updatedAt: "desc" },
        include: { project: true },
      }),
      prisma.task.count({ where: { Delete_Flag: true } }),
    ]);

    return Response.json({ tasks, total });
  } catch (error) {
    console.error("Error fetching deleted tasks:", error);
    return Response.json({ tasks: [], total: 0 }, { status: 500 });
  }
}


export async function PATCH(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return Response.json({ error: "Task ID is required" }, { status: 400 });
    }

    const restored = await prisma.task.update({
      where: { id },
      data: {
        Delete_Flag: false,
        updatedAt: new Date(),
      },
    });

    return Response.json(restored);
  } catch (error) {
    console.error("Error restoring task:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return Response.json({ error: "Task ID is required" }, { status: 400 });
    }

    await prisma.task.delete({
      where: { id },
    });

    return Response.json({ message: "Task permanently deleted" });
  } catch (error) {
    console.error("Error permanently deleting task:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
