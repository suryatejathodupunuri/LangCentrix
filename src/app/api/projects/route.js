import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const projects = await prisma.Project.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        clientName: true,
        managerName: true,
      },
    });
    return Response.json(projects);
  } catch (error) {
    console.error("GET /api/projects error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}

export async function POST(req) {
  try {
    const data = await req.json();
    const { name, description, clientName, managerName } = data;

    const newProject = await prisma.Project.create({
      data: { name, description, clientName, managerName },
    });

    return Response.json(newProject);
  } catch (error) {
    console.error("POST /api/projects error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
