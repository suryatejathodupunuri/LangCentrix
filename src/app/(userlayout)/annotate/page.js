"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Textarea } from "../../../components/ui/textarea";
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";

export default function AnnotateTaskPage() {
  const [task, setTask] = useState(null);
  const [content, setContent] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();
  const taskId = searchParams.get("id");

  useEffect(() => {
    const fetchTask = async () => {
      const res = await fetch(`/api/tasks?id=${taskId}`);
      const data = await res.json();
      setTask(data);
      if (data?.sourceFile) {
        const fileRes = await fetch(`/uploads/${data.sourceFile}`);
        const fileText = await fileRes.text();
        setContent(fileText);
      }
    };

    if (taskId) fetchTask();
  }, [taskId]);

  const saveProgress = async () => {
    await fetch(`/api/tasks?id=${task.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        editedContent: content,
        currentStatus: "Under editing",
      }),
    });
    alert("Saved!");
  };

  const finishTask = async () => {
    await fetch(`/api/tasks?id=${task.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        editedContent: content,
        currentStatus: "Finished",
      }),
    });
    router.push("/editor-dashboard");
  };

  if (!task) return <p className="p-10">Loading...</p>;

  return (
    <Card className="p-6 mt-20 mx-4">
      <h2 className="text-lg font-bold mb-4">
        Editing Task: {task.taskId} ({task.taskType})
      </h2>
      <Textarea
        rows={20}
        className="w-full"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <div className="mt-4 flex gap-4">
        <Button onClick={saveProgress} variant="outline">
          Save
        </Button>
        <Button
          onClick={async () => {
            await fetch(`/api/tasks?id=${taskId}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ currentStatus: "Finished" }),
            });

            router.push("/editor-dashboard"); // Return to dashboard
          }}
        >
          Finish
        </Button>
      </div>
    </Card>
  );
}
