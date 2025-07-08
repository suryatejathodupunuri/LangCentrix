import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET: Fetch all projects with client info
export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      include: {
        clients: {
          include: {
            client: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Flatten response structure for frontend
    const formatted = projects.map((project) => ({
      id: project.id,
      name: project.name,
      description: project.description,
      clientName: project.clients.map((c) => c.client.name).join(", "),
      managerName: project.managerName,
      Duration: `${project.startDate?.toISOString().slice(0, 10) ?? ""} - ${
        project.endDate?.toISOString().slice(0, 10) ?? ""
      }`,
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

// POST: Add a new project and connect it to a client
export async function POST(req) {
  try {
    const body = await req.json();
    const {
      name,
      description,
      managerName,
      startDate,
      endDate,
      clientId,
    } = body;

    if (!name || !clientId) {
      return NextResponse.json(
        { error: "Project name and client ID are required." },
        { status: 400 }
      );
    }

    const newProject = await prisma.project.create({
      data: {
        name,
        description,
        managerName,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        clients: {
          create: {
            client: {
              connect: { id: clientId },
            },
          },
        },
      },
    });

    return NextResponse.json(newProject);
  } catch (error) {
    console.error("POST /api/projects error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
