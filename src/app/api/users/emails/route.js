
import { prisma } from "../../../../lib/prisma";

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      where: {
        isActive: true,
        role: { not: "Admin" },
      },
      select: { email: true },
    });

    return new Response(JSON.stringify(users), { status: 200 });
  } catch (error) {
    console.error("Failed to fetch user emails:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch emails" }), { status: 500 });
  }
}