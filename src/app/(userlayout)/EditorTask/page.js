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
      const res = await fetch(`/api/tasks/assigned?page=${pageNumber}&limit=${limit}`);
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

  const formatDateTime = (date) =>
    date ? format(new Date(date), "dd-MMM-yyyy hh:mm a") : "N/A";

  return (
    <Card className="p-2  shadow-lg bg-gray-100 w-full">
      <h2 className="text-xl font-bold mb-4">My Tasks</h2>
      <Table className="w-full text-black border-separate border-spacing-y-3">
        <TableHeader>
          <TableRow className="text-xs text-gray-700 uppercase bg-white shadow-md rounded-md hover:shadow-lg">
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
              <TableHead key={i} className="text-center text-black">
                {head}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody className="text-black">
          {tasks.map((task) => (
            <TableRow
              key={task.id}
              className="bg-white shadow-md rounded-md hover:shadow-lg"
            >
              <TableCell className="text-center py-5">{task.taskId}</TableCell>
              <TableCell className="text-center py-5">{task.sourceFile}</TableCell>
              <TableCell className="text-center py-5">{task.description}</TableCell>
              <TableCell className="text-center py-5">{task.priority}</TableCell>
              <TableCell className="text-center py-5">{task.taskType}</TableCell>
              <TableCell className="text-center py-5">{task.taskLabel}</TableCell>
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
                  onClick={async () => {
                    // Mark task as "Under editing"
                    await fetch(`/api/tasks?id=${task.id}`, {
                      method: "PATCH",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ currentStatus: "Under editing" }),
                    });

                    // Go to annotation page
                    router.push(`/annotate?id=${task.id}`);
                  }}
                >
                  <Pencil className="w-4 h-4 mr-1" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex justify-between items-center mt-4">
        {totalTasks === 0 ? (
          <p className="text-sm text-gray-500 mt-2">No tasks found.</p>
        ) : (
          <p className="text-sm text-gray-500 mt-2">
            Showing {tasks.length} of {totalTasks} task{totalTasks !== 1 ? "s" : ""}
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

          <span className="text-sm text-gray-500">{`Page ${page} of ${Math.ceil(
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
