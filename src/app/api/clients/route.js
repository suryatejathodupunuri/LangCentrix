import { NextResponse } from "next/server";
import {prisma} from "../../../lib/prisma";

// GET all clients with projects
export async function GET() {
  try {
    const clients = await prisma.client.findMany({
      include: {
        projects: {
          include: {
            project: true,
          },
        },
      },
    });

    return NextResponse.json(clients);
  } catch (error) {
    console.error("Error fetching clients:", error);
    return NextResponse.json({ error: "Failed to fetch clients" }, { status: 500 });
  }
}

// POST a new client
export async function POST(req) {
  try {
    const body = await req.json();

    const newClient = await prisma.client.create({
      data: {
        name: body.name,
        email: body.email,
        phone: body.phone,
        address: body.address,
      },
    });

    return Response.json(newClient);
  } catch (error) {
    console.error("Error creating client:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
