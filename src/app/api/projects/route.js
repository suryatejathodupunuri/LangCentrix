import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET: Fetch paginated projects with client info
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "5", 10);
    const skip = (page - 1) * limit;

    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        skip,
        take: limit,
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
      }),
      prisma.project.count(),
    ]);

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

    return NextResponse.json({ projects: formatted, total });
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
