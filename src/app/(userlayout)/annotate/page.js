"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function AnnotatePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const taskId = searchParams.get("id");

  const [task, setTask] = useState(null);
  const [sourceText, setSourceText] = useState("");
  const [editedContent, setEditedContent] = useState("");

  useEffect(() => {
    const fetchTask = async () => {
      const res = await fetch(`/api/tasks?id=${taskId}`);
      const data = await res.json();
      console.log("Fetched Task:", data);
      setTask(data.tasks?.[0]);
      setSourceText(data.tasks?.[0]?.sourceContent || "");
      setEditedContent(data.tasks?.[0]?.editedContent || "");
    };

    if (taskId) fetchTask();
  }, [taskId]);

  const saveProgress = async () => {
    await fetch(`/api/tasks?id=${taskId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        editedContent,
        currentStatus: "Under editing",
      }),
    });
    alert("Progress saved!");
  };

  const finishTask = async () => {
    await fetch(`/api/tasks?id=${taskId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        editedContent,
        currentStatus: "Finished",
      }),
    });
    router.push("/EditorTask");
  };

  if (!task) return <p className="p-10">Loading...</p>;

  return (
    <Card className="p-6 mt-20 mx-4 bg-gray-100">
      <h2 className="text-lg font-bold mb-4 text-black">
        Annotating Task: {task.taskId} ({task.taskType})
      </h2>

      {task.taskType === "Translation" && (
        <>
          <h3 className="font-semibold mb-2 text-black">Source Text</h3>
          <Textarea
            rows={10}
            className="w-full border-2 border-[#0891B2]/20 focus:border-[#0891B2] rounded-xl p-4 bg-gradient-to-r from-[#F0F9FF] to-white transition-all duration-300 focus:shadow-lg text-[#1E293B] placeholder-[#1E293B]/50"
            value={sourceText}
            readOnly
          />
          <h3 className="font-semibold mb-2 text-black">Translated Text</h3>
          <Textarea
            rows={10}
            className="w-full border-2 border-[#0891B2]/20 focus:border-[#0891B2] rounded-xl p-4 bg-gradient-to-r from-[#F0F9FF] to-white transition-all duration-300 focus:shadow-lg text-[#1E293B] placeholder-[#1E293B]/50 "
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
          />
        </>
      )}

      {task.taskType === "NER" && (
        <div>
          {/* Replace this with your custom NER component */}
          <p>🔍 NER Annotation UI Goes Here</p>
        </div>
      )}

      {task.taskType === "Headings" && (
        <div>
          {/* Replace this with your custom Headings UI */}
          <p>📑 Headings Annotation UI Goes Here</p>
        </div>
      )}

      <div className="mt-4 flex gap-4">
        <Button onClick={saveProgress} variant="outline">
          Save
        </Button>
        <Button variant="outline" onClick={finishTask}>Finish</Button>
      </div>
    </Card>
  );
}
