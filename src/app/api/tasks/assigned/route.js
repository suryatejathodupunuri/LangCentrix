// src/app/api/tasks/assigned/route.js
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-config";
import {prisma} from "../../../../lib/prisma";

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    const userEmail = session.user.email;

    // Get page & limit from URL
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    // Validate user
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
    });

    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
      });
    }

    // Count total tasks assigned to this user
    const total = await prisma.task.count({
      where: {
        assignTo: user.email,
        Delete_Flag: false,
      },
    });

    // Fetch paginated tasks
    const tasks = await prisma.task.findMany({
      where: {
        assignTo: user.email,
        Delete_Flag: false,
      },
      orderBy: {
        updatedAt: "desc",
      },
      skip,
      take: limit,
    });

    return new Response(JSON.stringify({ tasks, total }), {
      status: 200,
    });
  } catch (err) {
    console.error("Error fetching assigned tasks:", err);
    return new Response(JSON.stringify({ error: "Server Error" }), {
      status: 500,
    });
  }
}