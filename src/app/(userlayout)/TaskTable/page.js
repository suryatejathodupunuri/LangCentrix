"use client";

import { useState, useEffect } from "react";
import jsPDF from "jspdf";
import { Card } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { format } from "date-fns";
import {
  Trash2,
  CheckCircle,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Download,
} from "lucide-react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "../../../components/ui/table";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "../../../components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../../../components/ui/dialog";
import { Checkbox } from "../../../components/ui/checkbox";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../../components/ui/select";

export default function TaskTablePage() {
  const [tasks, setTasks] = useState([]);
  const [deletedTasks, setDeletedTasks] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [viewDeleted, setViewDeleted] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [deletedTotalTasks, setDeletedTotalTasks] = useState(0);
  const [formData, setFormData] = useState({
    description: "",
    priority: "",
    project: "",
    taskType: "",
    assignTo: "",
  });
  const [userEmails, setUserEmails] = useState([]);
  const [page, setPage] = useState(1);
  const [totalTasks, setTotalTasks] = useState(0);
  const limit = 10;

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return format(new Date(dateString), "dd-MMM-yy");
  };
  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";
    return format(new Date(dateString), "dd-MMM-yy hh:mm a"); // Date + Time
  };

const fetchTasks = async (pageNumber = 1) => {
  const res = await fetch(`/api/tasks?page=${pageNumber}&limit=${limit}`);
  const data = await res.json();

  // Sort tasks by createdAt DESC (newest first)
  const sorted = (data.tasks || []).sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  setTasks(sorted);
  setTotalTasks(data.total || 0);
  setPage(pageNumber);
};

// Fetch user emails
const fetchUsers = async () => {
  const res = await fetch("/api/users"); // Endpoint to return users
  const data = await res.json();
  setUserEmails(data.map((user) => user.email));
};

// Run both fetches on component mount
useEffect(() => {
  fetchTasks();
  fetchUsers();
}, []);

  const toggleCheckbox = (taskId) => {
    setSelectedIds((prev) =>
      prev.includes(taskId)
        ? prev.filter((id) => id !== taskId)
        : [...prev, taskId]
    );
  };

  const handleDelete = async () => {
    try {
      await Promise.all(
        selectedIds.map((taskId) =>
          fetch(`/api/tasks?id=${taskId}`, {
            method: "DELETE",
          })
        )
      );

      // Remove deleted tasks from current list
      setTasks((prev) => prev.filter((task) => !selectedIds.includes(task.id)));

      // Optional: Refresh deleted tasks if viewing deleted
      if (viewDeleted) {
        const res = await fetch("/api/tasks/view-deleted");
        const data = await res.json();
        setDeletedTasks(Array.isArray(data) ? data : []);
      }

      setSelectedIds([]);
      setShowDeleteDialog(false);
    } catch (error) {
      console.error("Error deleting tasks:", error);
    }
  };

  const handleTaskClick = async (task) => {
    setCurrentTask(task);
    setFormData({
      description: task.description || "",
      priority: task.priority || "",
      project: task.project || "",
      taskType: task.taskType || "",
    });

    if (task.currentStatus === "Created") {
      const res = await fetch(`/api/tasks?id=${task.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentStatus: "Under editing" }),
      });

      if (res.ok) {
        const updated = await res.json();
        setTasks((prev) =>
          prev.map((t) => (t.id === updated.id ? updated : t))
        );
      }
    }

    setShowEditDialog(true);
  };
  const downloadTaskAsPDF = (task) => {
    const doc = new jsPDF();
    let y = 10;

    for (const [key, value] of Object.entries(task)) {
      doc.text(`${key}: ${value}`, 10, y);
      y += 10;
    }

    doc.save(`${task.taskId || "task"}-details.pdf`);
  };
  const displayTasks = viewDeleted ? deletedTasks : tasks;

  return (
    // <div className="flex w-full">
    //   <main className="w-full">
        <Card className="p-2 shadow-xl mt-20 bg-gray-100 overflow-y-auto">
          <div className="flex gap-4 justify-end -mb-4 mt-10 mr-4">
            {!viewDeleted ? (
              <>
                <Button
                  variant="ghost"
                  className="p-2 text-gray-600 hover:bg-gray-300"
                  onClick={() => setShowDeleteDialog(true)}
                >
                  <Trash2 className="w-5 h-5 mr-1" /> Delete
                </Button>
                <Button
                  variant="ghost"
                  className="p-2 text-gray-600 hover:bg-gray-300"
                  onClick={async () => {
                    const res = await fetch("/api/tasks/view-deleted");
                    const data = await res.json();
                    const tasksArray = Array.isArray(data) ? data : [];
                    setDeletedTasks(tasksArray);
                    setDeletedTotalTasks(tasksArray.length);
                    setViewDeleted(true);
                  }}
                >
                  <CheckCircle className="w-5 h-5 mr-1" /> View Deleted
                </Button>
              </>
            ) : (
              <Button
                variant="ghost"
                className="p-2 text-gray-600 hover:bg-gray-300"
                onClick={() => setViewDeleted(false)}
              >
                Back to Tasks
              </Button>
            )}
          </div>

          {/* Edit Dialog */}
          <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
            <DialogContent className="max-w-lg">
              <DialogTitle>Edit Task Metadata</DialogTitle>
              <DialogDescription>
                You can update metadata only if the task is not assigned to any
                user.
              </DialogDescription>

              {currentTask ? (
                !currentTask.assignTo ? (
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      const res = await fetch(
                        `/api/tasks?id=${currentTask.id}`,
                        {
                          method: "PATCH",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify(formData),
                        }
                      );

                      const updated = await res.json();
                      setTasks((prev) =>
                        prev.map((task) =>
                          task.id === updated.id ? updated : task
                        )
                      );
                      setShowEditDialog(false);
                    }}
                    className="space-y-4"
                  >
                    {/* Description */}
                    <div>
                      <label className="block text-sm font-medium">
                        Description
                      </label>
                      <Input
                        value={formData.description ?? ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            description: e.target.value,
                          })
                        }
                        className="text-gray-800"
                      />
                    </div>

                    {/* Priority */}
                    <div>
                      <label className="block text-sm font-medium">
                        Priority
                      </label>
                      <Select
                        value={formData.priority ?? ""}
                        onValueChange={(value) =>
                          setFormData({ ...formData, priority: value })
                        }
                      >
                        <SelectTrigger className="w-full text-gray-800">
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Low">Low</SelectItem>
                          <SelectItem value="Medium">Medium</SelectItem>
                          <SelectItem value="High">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Project */}
                    <div>
                      <label className="block text-sm font-medium">
                        Project
                      </label>
                      <Input
                        value={formData.project ?? ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            project: e.target.value,
                          })
                        }
                        className="text-gray-800"
                      />
                    </div>

                    {/* Task Type */}
                    <div>
                      <label className="block text-sm font-medium">
                        Task Type
                      </label>
                      <Input
                        value={formData.taskType ?? ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            taskType: e.target.value,
                          })
                        }
                        className="text-gray-800"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium">
                        Assign To
                      </label>
                      <select
                        value={formData.assignTo || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, assignTo: e.target.value })
                        }
                        className="w-full border rounded p-2 text-gray-800"
                        disabled={!!currentTask.assignTo} // disable if already assigned
                      >
                        <option value="">-- Select user --</option>
                        {userEmails.map((email) => (
                          <option key={email} value={email}>
                            {email}
                          </option>
                        ))}
                      </select>
                    </div>

                    <DialogFooter>
                      <Button type="submit" className="border">
                        Save
                      </Button>
                      <Button
                        className="border ml-2"
                        onClick={async () => {
                          const res = await fetch(
                            `/api/tasks?id=${currentTask.id}`,
                            {
                              method: "PATCH",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({
                                currentStatus: "Finished",
                              }),
                            }
                          );
                          if (res.ok) {
                            const updated = await res.json();
                            setTasks((prev) =>
                              prev.map((task) =>
                                task.id === updated.id ? updated : task
                              )
                            );
                            setShowEditDialog(false);
                          }
                        }}
                      >
                        Finish
                      </Button>
                    </DialogFooter>
                  </form>
                ) : (
                  <p className="text-red-500 text-sm font-medium">
                    This task is already assigned to a user. Editing is not
                    allowed.
                  </p>
                )
              ) : (
                <p className="text-gray-500 text-sm">No task selected.</p>
              )}
            </DialogContent>
          </Dialog>

          {/* delete */}
          <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <DialogContent className="max-w-md">
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete the selected tasks?
              </DialogDescription>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteDialog(false)}
                >
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleDelete}>
                  Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Table className="w-full text-black border-separate border-spacing-y-3">
            <TableHeader>
              <TableRow className="text-xs text-gray-700 uppercase bg-white shadow-md rounded-md hover:shadow-lg transition duration-200">
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
                  "Actions",
                ].map((head, i) => (
                  <TableHead
                    key={i}
                    className="text-center px-2 py-4 text-black"
                  >
                    {head}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>

            <TableBody>
              {displayTasks.map((task) => (
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
                    {task.project}
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
                      <>
                        <div className="text-black font-medium">
                          {formatDateTime(task.statusUpdatedAt)}
                        </div>
                      </>
                    ) : task.updatedAt ? (
                      <>
                        <div className="text-black font-medium">
                          {formatDateTime(task.updatedAt)}
                        </div>
                      </>
                    ) : (
                      <div className="text-gray-400">—</div>
                    )}
                  </TableCell>

                  <TableCell className="text-center py-5">
                    <Button
                      variant="ghost"
                      onClick={() => handleTaskClick(task)}
                    >
                      <Pencil className="w-4 h-4 text-gray-500" />
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => downloadTaskAsPDF(task)}
                    >
                      <Download className="w-4 h-4 text-gray-500" />
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
                Showing {viewDeleted ? deletedTasks.length : tasks.length} of{" "}
                {viewDeleted ? deletedTotalTasks : totalTasks} task
                {(viewDeleted ? deletedTotalTasks : totalTasks) !== 1
                  ? "s"
                  : ""}
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
    //   </main>
    // </div>
    // </div>
  );
}
