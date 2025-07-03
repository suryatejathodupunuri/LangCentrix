import {prisma} from "../../../../lib/prisma";

export async function GET() {
  try {
    const deletedTasks = await prisma.task.findMany({
      where: { Delete_Flag: true },
      orderBy: { updatedAt: "desc" },
    });

    return Response.json(deletedTasks);
  } catch (error) {
    console.error("Error fetching deleted tasks:", error);
    return Response.json([], { status: 500 }); 
  }
}


