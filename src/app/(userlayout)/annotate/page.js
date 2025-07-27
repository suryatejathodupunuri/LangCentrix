"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Check } from "lucide-react";

export default function AnnotatePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const taskId = searchParams.get("id");

  const [task, setTask] = useState(null);
  const [sourceLines, setSourceLines] = useState([]);
  const [translatedLines, setTranslatedLines] = useState([]);
  const [editedRows, setEditedRows] = useState({});
  const [savedRows, setSavedRows] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [sourceLang, setSourceLang] = useState("Source");
  const [targetLang, setTargetLang] = useState("Target");
  const [sourceCode, setSourceCode] = useState("");
  const [targetCode, setTargetCode] = useState("");

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const res = await fetch(`/api/tasks?id=${taskId}`);
        const data = await res.json();
        const taskData = data.tasks?.[0];
        if (taskData) {
          setTask(taskData);
          setSourceLang(taskData.sourceLang || "Source");
          setTargetLang(taskData.targetLang || "Target");

          const rawLines = taskData.sourceContent?.split("\n") || [];
          const edited = taskData.editedContent?.split("\n") || [];

          const parsedSource = [];
          const parsedTarget = [];

          rawLines.forEach((line, idx) => {
            const parts = line.split("\t");
            if (parts.length >= 2) {
              parsedSource.push(parts[0].trim());
              parsedTarget.push(parts[1].trim());
            } else {
              parsedSource.push(line.trim());
              parsedTarget.push(edited[idx] || "");
            }
          });

          setSourceLines(parsedSource);
          setTranslatedLines(parsedTarget);
          setSourceCode(mapLangToISO(taskData.sourceLang));
          setTargetCode(mapLangToISO(taskData.targetLang));
        }
      } catch (err) {
        console.error("Failed to fetch task:", err);
      }
    };
    if (taskId) fetchTask();
  }, [taskId]);

  const mapLangToISO = (lang) => {
    const map = {
      english: "en",
      tamil: "ta",
      telugu: "te",
      hindi: "hi",
      malayalam: "ml",
      kannada: "kn",
      bengali: "bn",
      marathi: "mr",
    };
    return map[lang?.toLowerCase()] || lang?.toLowerCase();
  };

  const autoTranslate = () => {
    const selectedText = window.getSelection().toString().trim();

    if (!selectedText) {
      alert("Please select some text to translate.");
      return;
    }

    if (!sourceCode || !targetCode) {
      alert("Missing source or target language codes.");
      return;
    }

    const url = `https://translate.google.com/?sl=${sourceCode}&tl=${targetCode}&text=${encodeURIComponent(
      selectedText
    )}&op=translate`;

    const width = 800;
    const height = 600;
    const left = (window.innerWidth - width) / 2;
    const top = (window.innerHeight - height) / 2;

    window.open(
      url,
      "_blank",
      `width=${width},height=${height},top=${top},left=${left},resizable=yes,scrollbars=yes`
    );
  };

  const saveProgress = async () => {
    try {
      setIsSaving(true);
      const editedContent = translatedLines.join("\n");
      await fetch(`/api/tasks?id=${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          editedContent,
          currentStatus: "Under editing",
        }),
      });
      alert("Progress saved!");
    } catch (error) {
      console.error("Save error:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const finishTask = async () => {
    try {
      const editedContent = translatedLines.join("\n");
      await fetch(`/api/tasks?id=${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          editedContent,
          currentStatus: "Finished",
        }),
      });
      router.push("/EditorTask");
    } catch (error) {
      console.error("Finish error:", error);
    }
  };

  if (!task) return <p className="p-10">Loading...</p>;

  return (
    <Card className="p-6 mt-20 mx-4 bg-gray-100">
      <div className="flex justify-end gap-2">
        <Button
          onClick={autoTranslate}
          className="mb-4 bg-gradient-to-r from-[#0891B2] to-[#0F4C75] text-white"
        >
          GMT
        </Button>
        <Button
          onClick={saveProgress}
          className="mb-4 bg-gradient-to-r from-[#0891B2] to-[#0F4C75] text-white"
        >
          {isSaving ? "Saving..." : "Save"}
        </Button>
      </div>

      <h2 className="text-lg font-bold mb-4 text-black">
        Annotating Task: {task.taskId} ({task.taskType})
      </h2>

      {task.taskType === "Translation" && (
        <Table className="text-gray-400 w-full table-auto border border-gray-400">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[3%] text-black">S.No</TableHead>
              <TableHead className="w-[45%] text-black text-center border-l border-gray-400">
                {sourceLang}
              </TableHead>
              <TableHead className="w-[45%] text-black text-center border-l border-gray-400">
                {targetLang}
              </TableHead>
              <TableHead className="text-black text-center border-l border-gray-400"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sourceLines.map((line, index) => (
              <TableRow key={index}>
                <TableCell className="text-center text-black">
                  {index + 1}
                </TableCell>
                <TableCell className="whitespace-pre-line border-l border-gray-400 text-black">
                  {line}
                </TableCell>
                <TableCell
  className="whitespace-pre-line border-l border-gray-400 text-black"
  contentEditable
  suppressContentEditableWarning
  onInput={(e) => {
    const newText = e.currentTarget.innerText;

    // Update the local state for live preview
    const newLines = [...translatedLines];
    newLines[index] = newText;

    // Mark this row as edited and unsaved (tick turns gray)
    setSavedRows((prev) => ({ ...prev, [index]: false }));
  }}
  onBlur={(e) => {
    const newText = e.currentTarget.innerText.trim();
    if (newText !== translatedLines[index]) {
      const newLines = [...translatedLines];
      newLines[index] = newText;
      setTranslatedLines(newLines);
    }
  }}
>
  {translatedLines[index]}
</TableCell>

<TableCell className="text-center border-l border-gray-400">
  <button
    onClick={() => {
      setSavedRows((prev) => ({ ...prev, [index]: true }));
    }}
    className={`text-xl ${
      savedRows[index] ? "text-green-700" : "text-gray-400"
    }`}
  >
    <Check />
  </button>
</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {task.taskType === "NER" && <p>🔍 NER Annotation UI Goes Here</p>}
      {task.taskType === "Headings" && <p>📑 Headings Annotation UI Goes Here</p>}

      <div className="mt-4 flex gap-4">
        <Button onClick={saveProgress} variant="outline">
          Save
        </Button>
        <Button variant="outline" onClick={finishTask}>
          Finish
        </Button>
      </div>
    </Card>
  );
}
