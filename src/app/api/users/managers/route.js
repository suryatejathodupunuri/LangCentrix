import { prisma } from "../../../../lib/prisma";

export async function GET() {
  try {
    const managers = await prisma.user.findMany({
      where: {
        isActive: true,
        role: "Manager",
      },
      select: {
        email: true,
      },
    });

    return new Response(JSON.stringify(managers), { status: 200 });
  } catch (error) {
    console.error("Failed to fetch manager emails:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch manager emails" }), {
      status: 500,
    });
  }
}
