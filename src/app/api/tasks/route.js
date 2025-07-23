import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-config";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

// Helper to generate timestamp-based task ID
function generateTimestamp() {
  return new Date().toISOString().replace(/[-T:.Z]/g, "").slice(0, 14);
}

async function generateTaskId() {
  const count = await prisma.task.count();
  const timestamp = generateTimestamp();
  return `${count + 1}-${timestamp}`;
}

// GET: List tasks with file content
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
      orderBy: { updatedAt: "desc" },
      include: { project: true },
    });

    // Convert Buffer (or JSON-encoded string) to string content
    const tasksWithFileContent = tasks.map((task) => ({
      ...task,
      sourceContent: task.sourceFileContent
        ? Buffer.from(task.sourceFileContent).toString("utf-8")
        : "",
      editedContent: task.secondFileContent
        ? Buffer.from(task.secondFileContent).toString("utf-8")
        : "",
    }));

    return NextResponse.json({ total, tasks: tasksWithFileContent });
  } catch (error) {
    console.error("GET /api/tasks error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: Create new task
export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    const createdBy = session?.user?.email || "unknown";
    const createdByRole = session?.user?.role || "guest";

    const formData = await req.formData();
    const taskId = await generateTaskId();

    const rawProjectId = formData.get("projectId");
    let projectId = null;

    if (rawProjectId && typeof rawProjectId === "string") {
      try {
        projectId = new ObjectId(rawProjectId).toString();
      } catch (err) {
        console.warn("Invalid projectId format");
      }
    }

    const taskType = formData.get("taskType");
    const assignTo = formData.get("assignTo");
    const taskLabel = formData.get("taskLabel");
    const priority = formData.get("priority");
    const sourceLang = formData.get("sourceLang");
    const targetLang = formData.get("targetLang");
    const description = formData.get("description");
    const expectedFinishDate = formData.get("expectedFinishDate");
    const domain = formData.get("domain");

    const sourceFile = formData.get("sourceFile");
    const secondFile = formData.get("secondFile");

    let sourceFileName = null;
    let sourceFileContent = null;
    if (sourceFile && typeof sourceFile.name === "string") {
      sourceFileName = sourceFile.name;
      const buffer = await sourceFile.arrayBuffer();
      sourceFileContent = Buffer.from(buffer);
    }

    let secondFileName = null;
    let secondFileContent = null;
    if (secondFile && typeof secondFile.name === "string") {
      secondFileName = secondFile.name;
      const buffer = await secondFile.arrayBuffer();
      secondFileContent = Buffer.from(buffer);
    }

    const newTask = await prisma.task.create({
      data: {
        taskId,
        taskType,
        assignTo,
        taskLabel,
        priority,
        sourceLang,
        targetLang,
        description,
        domain,
        expectedFinishDate: expectedFinishDate
          ? new Date(expectedFinishDate)
          : null,
        createdBy,
        createdByRole,
        sourceFileName,
        sourceFileContent,
        secondFileName,
        secondFileContent,
        currentStatus: "Assigned",
        Delete_Flag: false,
        ...(projectId && {
          project: {
            connect: { id: projectId },
          },
        }),
      },
    });

    return NextResponse.json(newTask);
  } catch (error) {
    console.error("POST /api/tasks error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PATCH: Update task by ID
export async function PATCH(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const data = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Task ID is required" }, { status: 400 });
    }
    const { editedContent, currentStatus } = data;

    const updated = await prisma.task.update({
      where: { id },
      data: {
        editedContent: editedContent ?? undefined,
        currentStatus: currentStatus ?? undefined,
        statusUpdatedAt: new Date(),
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PATCH /api/tasks error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


// DELETE: Soft delete task
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing ID" }, { status: 400 });
    }

    const updated = await prisma.task.update({
      where: { id },
      data: { Delete_Flag: true },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error deleting task:", error);
    return NextResponse.json({ error: "Failed to delete task" }, { status: 500 });
  }
}
