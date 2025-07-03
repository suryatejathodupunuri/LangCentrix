import { writeFile, mkdir } from "fs/promises";
import path from "path";
import {prisma} from "../../../lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-config";

function generateTimestamp() {
  return new Date().toISOString().replace(/[-T:.Z]/g, "").slice(0, 14);
}

async function generateTaskId() {
  const count = await prisma.task.count(); 
  const timestamp = generateTimestamp();
  return `${count + 1}-${timestamp}`;
}

// GET: List tasks
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;

    const total = await prisma.task.count({
      where: { Delete_Flag: false },
    });

  const tasks = await prisma.task.findMany({
  where: { Delete_Flag: false },
  skip: (page - 1) * limit,
  take: limit,
  orderBy: {
    updatedAt: "desc",
  },
});

    return Response.json({ total, tasks });
  } catch (error) {
    console.error("GET /api/tasks error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

// POST: Create a new task
export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    const createdBy = session?.user?.email || "unknown";
    const createdByRole = session?.user?.role || "guest";

    const formData = await req.formData();
    const taskId = await generateTaskId();

    const fields = {
      project: formData.get("project"),
      taskType: formData.get("taskType"),
      assignTo: formData.get("assignTo"),
      taskLabel: formData.get("taskLabel"),
      priority: formData.get("priority"),
      sourceLang: formData.get("sourceLang"),
      targetLang: formData.get("targetLang"),
      description: formData.get("description"),
      expectedFinishDate: formData.get("expectedFinishDate"),
      domain: formData.get("domain"),
    };

    let sourceFileName = null;
    let wordCount = 0;
    const sourceFile = formData.get("sourceFile");

    if (sourceFile && typeof sourceFile.name === "string" && sourceFile.size > 0) {
      const uploadDir = path.join(process.cwd(), "public", "uploads");
      await mkdir(uploadDir, { recursive: true });

      const buffer = Buffer.from(await sourceFile.arrayBuffer());
      const text = buffer.toString("utf-8").trim();
      wordCount = text ? text.split(/\s+/).length : 0;

      sourceFileName = sourceFile.name;
      const filePath = path.join(uploadDir, sourceFileName);
      await writeFile(filePath, buffer);
    }

    const newTask = await prisma.task.create({
      data: {
        taskId,
        ...fields,
        expectedFinishDate: fields.expectedFinishDate
          ? new Date(fields.expectedFinishDate)
          : null,
        createdBy,
        createdByRole,
        sourceFile: sourceFileName,
        currentStatus: "Created",
      },
    });

    return Response.json(newTask);
  } catch (error) {
    console.error("POST /api/tasks error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

// PATCH: Update a task
export async function PATCH(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const data = await req.json();

  if (!id) {
    return Response.json({ error: "Task ID is required" }, { status: 400 });
  }

  const updated = await prisma.task.update({
    where: { id },
    data: { ...data, statusUpdatedAt: new Date() },
  });

  return Response.json(updated);
}


// DELETE: Soft delete a task
export async function DELETE(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return Response.json({ error: "Missing ID" }, { status: 400 });
  }

  try {
    const updated = await prisma.task.update({
      where: { id },
      data: { Delete_Flag: true },
    });

    return Response.json(updated);
  } catch (error) {
    console.error("Error deleting task:", error);
    return Response.json({ error: "Failed to delete task" }, { status: 500 });
  }
}
