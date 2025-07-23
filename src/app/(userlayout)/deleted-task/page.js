"use client";

import { useEffect, useState } from "react";
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "../../../components/ui/popover";
import { Checkbox } from "../../../components/ui/checkbox";
import { format } from "date-fns";
import { Trash2, RotateCcw, ChevronLeft, ChevronRight } from "lucide-react";

export default function DeletedTasksPage() {
  const [deletedTasks, setDeletedTasks] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);

  const [page, setPage] = useState(1);
  const limit = 10; // tasks per page
  const [totalTasks, setTotalTasks] = useState(0);

  useEffect(() => {
    const fetchDeleted = async () => {
      const res = await fetch(
        `/api/tasks/view-deleted?page=${page}&limit=${limit}`
      );
      const data = await res.json();
      setDeletedTasks(Array.isArray(data.tasks) ? data.tasks : []);
      setTotalTasks(data.total || 0);
    };

    fetchDeleted();
  }, [page]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return format(new Date(dateString), "dd-MMM-yy");
  };
  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";
    return format(new Date(dateString), "dd-MMM-yy hh:mm a"); // Date + Time
  };

  const toggleCheckbox = (taskId) => {
    setSelectedIds((prev) =>
      prev.includes(taskId)
        ? prev.filter((id) => id !== taskId)
        : [...prev, taskId]
    );
  };
  const handleRestore = async (id) => {
    const res = await fetch(`/api/tasks/view-deleted?id=${id}`, {
      method: "PATCH",
    });
    if (res.ok) {
      setDeletedTasks((prev) => prev.filter((task) => task.id !== id));
    }
  };

  const handlePermanentDelete = async (id) => {
    const confirmed = confirm("Are you sure?");
    if (!confirmed) return;

    const res = await fetch(`/api/tasks/view-deleted?id=${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setDeletedTasks((prev) => prev.filter((task) => task.id !== id));
    }
  };

  return (
    <Card className="p-2 w-full shadow-xl mt-2 bg-gray-100 overflow-y-auto">
      <h1 className="text-2xl font-semibold text-[#0F4C75]">Deleted Tasks</h1>
      <div className="flex gap-4 justify-end -mb-6 mr-4">
        <Button
          variant="outline"
          className="p-3 rounded-xl transition-all duration-300 hover:scale-125 bg-gradient-to-r from-[#0891B2]/10 to-[#3282B8]/10 hover:from-[#0891B2]/20 hover:to-[#3282B8]/20 text-[#0F4C75] border border-[#0891B2]/20 shadow-md hover:shadow-lg"
          size="sm"
          onClick={async () => {
            for (const id of selectedIds) {
              await handleRestore(id);
            }
          }}
          disabled={selectedIds.length === 0}
        >
          <RotateCcw className="w-4 h-4 mr-1 text-[#3282B8]"/>
          Restore
        </Button>
        <Button
          variant="destructive"
          className="p-2 hover:bg-rose-100  rounded-lg transition-all hover:scale-105 bg-transparent hover:text-red-600 duration-300 bg-gradient-to-r from-[#0891B2]/10 to-[#3282B8]/10 text-[#0F4C75] border border-[#0891B2]/20 shadow-md hover:shadow-lg"
          size="sm"
          onClick={async () => {
            const confirmed = confirm(
              "Are you sure you want to permanently delete selected tasks?"
            );
            if (!confirmed) return;
            for (const id of selectedIds) {
              await handlePermanentDelete(id);
            }
          }}
          disabled={selectedIds.length === 0}
        >
          <Trash2 className="w-4 h-4 mr-1" />
          Delete
        </Button>
      </div>

      <Table className="w-full text-black border-separate border-spacing-y-3">
        <TableHeader>
          <TableRow className="text-xs uppercase bg-[#3282B8] shadow-md rounded-md hover:shadow-lg transition duration-200">
            <TableHead className="text-center py-3"></TableHead>
            {[
              "Task ID",
              "File Name",
              "Description",
              "Project",
              "Priority",
              "Task Type",
              "Current Status",
              "Assigned To",
              "Modified At",
            ].map((head, i) => (
              <TableHead key={i} className="text-center px-2 py-4 text-white font-semibold">
                {head}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {deletedTasks.map((task) => (
            <TableRow
              key={task.id}
              className="bg-white shadow-md rounded-md hover:shadow-lg transition duration-200"
            >
              <TableCell className="text-center py-3">
                <Checkbox
                  checked={selectedIds.includes(task.id)}
                  onCheckedChange={() => toggleCheckbox(task.id)}
                />
              </TableCell>

              <TableCell className="text-center break-words">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="link"
                      className="text-blue-600 flex flex-col"
                    >
                      <span className="font-semibold">
                        {formatDate(task.createdAt)}
                      </span>
                      <span className="text-xs text-gray-500 break-all">
                        {task.taskId}
                      </span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-96 max-h-80 overflow-auto p-0 text-sm text-black bg-white border border-gray-300 rounded shadow-2xl">
                    <Table className="w-full">
                      <TableBody>
                        {[
                          ["Task Label", task.taskLabel],
                          ["Edited File", task.secondFile],
                          ["Created By", task.createdByRole],
                          ["Source Lang", task.sourceLang],
                          ["Target Lang", task.targetLang],
                          ["Iteration", task.currentIteration],
                        ].map(([label, value], i) => (
                          <TableRow key={i}>
                            <TableCell className="font-semibold p-2 text-center">
                              {label}
                            </TableCell>
                            <TableCell className="p-2 text-center break-words">
                              {value}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </PopoverContent>
                </Popover>
              </TableCell>

              <TableCell className="text-center break-words py-5">
                {task.sourceFile}
              </TableCell>
              <TableCell className="text-center break-words py-5">
                {task.description}
              </TableCell>
            <TableCell className="text-center break-words py-5">
  {task.project?.name || "—"}
</TableCell>
              <TableCell className="text-center py-5">
                {task.priority}
              </TableCell>
              <TableCell className="text-center py-5">
                {task.taskType}
              </TableCell>
              <TableCell className="text-center py-5">
                {task.currentStatus}
              </TableCell>
              <TableCell className="text-center py-5">
                {task.assignTo}
              </TableCell>

              <TableCell className="text-center text-xs text-gray-600">
                {task.statusUpdatedAt ? (
                  <div className="text-black font-medium">
                    {formatDateTime(task.statusUpdatedAt)}
                  </div>
                ) : task.updatedAt ? (
                  <div className="text-black font-medium">
                    {formatDateTime(task.updatedAt)}
                  </div>
                ) : (
                  <div className="text-gray-400">—</div>
                )}
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
            Showing {deletedTasks.length} of {totalTasks} task
            {totalTasks !== 1 ? "s" : ""}
          </p>
        )}

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            disabled={page === 1}
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            className="flex items-center gap-1 text-gray-700"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-sm text-gray-500">
            Page {page} of {Math.ceil(totalTasks / limit) || 1}
          </span>
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
