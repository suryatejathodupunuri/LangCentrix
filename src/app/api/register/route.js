// app/api/register/route.js

import { prisma } from "../../../lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, password, confirmPassword, role } = body;

    // Validate
    if (!name || !email || !password || !confirmPassword || !role) {
      return new Response(JSON.stringify({ error: "All fields are required" }), { status: 400 });
    }

    if (password !== confirmPassword) {
      return new Response(JSON.stringify({ error: "Passwords do not match" }), { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return new Response(JSON.stringify({ error: "Email already exists" }), { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      },
    });

    return new Response(JSON.stringify({ message: "User registered successfully" }), { status: 201 });
  } catch (error) {
    console.error("Register error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
}
