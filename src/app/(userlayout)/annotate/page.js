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
          const editedLines = taskData.editedContent?.split("\n") || [];

          const parsedSource = [];
          const parsedTarget = [];
          const savedRowsMap = {};

          rawLines.forEach((line, idx) => {
            const parts = line.split("\t");
            const source = parts[0]?.trim() || "";
            const originalTarget = parts[1]?.trim() || "";
            const edited = editedLines[idx]?.trim();

            parsedSource.push(source);
            parsedTarget.push(edited || originalTarget);

            if (edited && edited !== originalTarget) {
              savedRowsMap[idx] = true;
            } else {
              savedRowsMap[idx] = false;
            }
          });

          setSourceLines(parsedSource);
          setTranslatedLines(parsedTarget);
          setSavedRows(savedRowsMap);
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
  const autoTranslateBing = () => {
    const selectedText = window.getSelection().toString().trim();

    if (!selectedText) {
      alert("Please select some text to translate.");
      return;
    }

    if (!sourceCode || !targetCode) {
      alert("Missing source or target language codes.");
      return;
    }

    // Bing Translate uses a slightly different URL structure
    const url = `https://www.bing.com/translator?from=${sourceCode}&to=${targetCode}&text=${encodeURIComponent(
      selectedText
    )}`;

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

  const handleRowSave = async (index) => {
    try {
      const updatedLine = translatedLines[index];
      const updatedLines = [...translatedLines];
      updatedLines[index] = updatedLine;
      const updatedText = updatedLines.join("\n");

      const res = await fetch(`/api/tasks?id=${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          editedContent: updatedText,
          currentStatus: "Editing",
        }),
      });

      if (res.ok) {
        setSavedRows((prev) => ({ ...prev, [index]: true }));
        console.log(`Row ${index + 1} saved.`);
      } else {
        console.error("Failed to save row:", await res.text());
      }
    } catch (error) {
      console.error("Save row error:", error);
    }
  };
  const saveProgress = async () => {
    try {
      setIsSaving(true);
      const editedContent = translatedLines.join("\n");

      const res = await fetch(`/api/tasks?id=${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          editedContent,
          currentStatus: "Under editing",
        }),
      });

      if (res.ok) {
        alert("All progress saved!");
        // Mark all rows as saved (green tick)
        const allSaved = {};
        translatedLines.forEach((_, i) => (allSaved[i] = true));
        setSavedRows(allSaved);
      } else {
        console.error("Save error:", await res.text());
      }
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
          onClick={autoTranslateBing}
          className="bg-gradient-to-r from-[#0891B2] to-[#0F4C75] text-white"
        >
          BMT
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

                    // Mark row as unsaved
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
                    onClick={() => handleRowSave(index)}
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
      {task.taskType === "Headings" && (
        <p>📑 Headings Annotation UI Goes Here</p>
      )}

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
