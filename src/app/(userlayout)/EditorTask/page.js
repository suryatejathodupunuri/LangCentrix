"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from "../../../components/ui/table";
import { format } from "date-fns";
import { Pencil, ChevronLeft, ChevronRight } from "lucide-react";

export default function EditorDashboard() {
  const [tasks, setTasks] = useState([]);
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [totalTasks, setTotalTasks] = useState(0);
  const limit = 10;

  const fetchTasks = async (pageNumber = 1) => {
    try {
      const res = await fetch(
        `/api/tasks/assigned?page=${pageNumber}&limit=${limit}`
      );
      const data = await res.json();

      const sorted = (data.tasks || []).sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      setTasks(sorted);
      setTotalTasks(data.total || 0);
      setPage(pageNumber);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    fetchTasks(1);
  }, []);

  const getAnnotationRoute = (task) => {
    switch (task.taskType) {
      case "Translation":
        return `/annotate/translation?id=${task.id}`;
      case "NER":
        return `/annotate/ner?id=${task.id}`;
      case "Headings":
        return `/annotate/headings?id=${task.id}`;
      default:
        return `/annotate?id=${task.id}`; // fallback
    }
  };

  const formatDateTime = (date) =>
    date ? format(new Date(date), "dd-MMM-yyyy hh:mm a") : "N/A";

  return (
    <Card className="p-2 mt-16 shadow-lg bg-gray-100 w-full">
      <h2 className="text-3xl font-bold mb-4 text-[#0F4C75]">My Tasks</h2>
      <Table className="w-full text-black border-separate border-spacing-y-3">
        <TableHeader>
          <TableRow className="text-xs uppercase bg-[#3282B8] shadow-md rounded-md hover:shadow-lg">
            {[
              "Task ID",
              "File Name",
              "Description",
              "Priority",
              "Type",
              "Label",
              "Status",
              "Modified",
              "Action",
            ].map((head, i) => (
              <TableHead
                key={i}
                className="px-4 py-4 text-center font-semibold text-white"
              >
                {head}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody className="text-black">
          {tasks.map((task) => (
            <TableRow
              key={task.id}
              className="bg-white shadow-md rounded-md hover:shadow-lg hover:bg-sky-50"
            >
              <TableCell className="text-center py-5">{task.taskId}</TableCell>
              <TableCell className="text-center py-5">
                {task.sourceFileName}
              </TableCell>
              <TableCell className="text-center py-5">
                {task.description}
              </TableCell>
              <TableCell className="text-center py-5">
                {task.priority}
              </TableCell>
              <TableCell className="text-center py-5">
                {task.taskType}
              </TableCell>
              <TableCell className="text-center py-5">
                {task.taskLabel}
              </TableCell>
              <TableCell className="text-center py-5">
                {task.currentStatus === "Created"
                  ? "Available For Editing"
                  : task.currentStatus}
              </TableCell>
              <TableCell className="text-center py-5">
                {formatDateTime(task.updatedAt)}
              </TableCell>
              <TableCell className="text-center py-5">
                <Button
                  size="sm"
                  variant="ghost"
                  className="p-3 rounded-xl transition-all duration-300 hover:scale-125 bg-gradient-to-r from-[#0891B2]/10 to-[#3282B8]/10 hover:from-[#0891B2]/20 hover:to-[#3282B8]/20 text-[#0F4C75] border border-[#0891B2]/20 shadow-md hover:shadow-lg"
                  onClick={async () => {
                    // Mark task as "Under editing"
                    await fetch(`/api/tasks?id=${task.id}`, {
                      method: "PATCH",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ currentStatus: "Under editing" }),
                    });

                    const route = getAnnotationRoute(task);
                    router.push(`/annotate?id=${task.id}`);
                  }}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex justify-between items-center mt-8 pt-4 border-t border-[#3282B8]">
        {totalTasks === 0 ? (
          <p className="text-sm text-gray-500 mt-2">No tasks found.</p>
        ) : (
          <p className="text-sm text-[#0F4C75] mt-2">
            Showing {tasks.length} of {totalTasks} task
            {totalTasks !== 1 ? "s" : ""}
          </p>
        )}
        <div className="flex items-center justify-between mt-4">
          <Button
            variant="ghost"
            disabled={page === 1}
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            className="flex items-center gap-1 text-gray-700"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>

          <span className="text-sm font-medium px-3 py-2 rounded-md text-[#0F4C75] bg-[#F0F9FF]">{`Page ${page} of ${Math.ceil(
            totalTasks / limit
          )}`}</span>
          <Button
            variant="ghost"
            disabled={page * limit >= totalTasks}
            onClick={() => setPage((prev) => prev + 1)}
            className="flex items-center gap-1 text-gray-700"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
