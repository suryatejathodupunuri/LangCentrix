"use client";

import { useState, useEffect } from "react";
import jsPDF from "jspdf";
import { Card } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { format } from "date-fns";
import {
  Trash2,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Download,
  ListChecks,
  FileText,
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
  const [currentTask, setCurrentTask] = useState(null);
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
    return format(new Date(dateString), "dd-MMM-yy hh:mm a"); 
  };

  const fetchTasks = async (pageNumber = 1) => {
    try {
      const res = await fetch(`/api/tasks?page=${pageNumber}&limit=${limit}`);
      if (!res.ok) throw new Error(`Failed to fetch tasks: ${res.statusText}`);

      const data = await res.json();
      console.log("Fetched tasks data:", data);

      const sorted = (data.tasks || []).sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      setTasks(sorted);
      setTotalTasks(data.total || 0);
      setPage(pageNumber);
    } catch (error) {
      console.error("Error fetching tasks:", error.message);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/users");
      if (!res.ok) throw new Error(`Failed to fetch users: ${res.statusText}`);

      const data = await res.json();
      console.log("Fetched user emails:", data);

      setUserEmails(data.map((user) => user.email));
    } catch (error) {
      console.error("Error fetching users:", error.message);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchUsers();
  }, []);


  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800 border-red-200";
      case "Medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Assigned":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Under editing":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "Finished":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "";
    }
  };
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
      const res = await fetch("/api/tasks/view-deleted");
      const data = await res.json();
      setDeletedTasks(Array.isArray(data) ? data : []);

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

    if (task.currentStatus === "Assigned") {
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

  return (
    <Card className="w-full shadow-xl mt-20 bg-gray-50 overflow-y-auto rounded-3xl">
      <div className="bg-gradient-to-r from-[#0F4C75] via-[#3282B8] to-[#0891B2] p-6 relative overflow-hidden rounded-t-3xl -mt-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4 ">
          <div className="p-4 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 shadow-lg mt-4">
            <ListChecks className="w-4 h-4 text-white"/>
          </div>
          <h1 className="text-4xl font-bold text-white mt-4">My Tasks</h1>
        </div>
        </div>
        </div>
        <div className="flex gap-4 justify-end -mb-8 mt-2 mr-4">
          <Button
            variant="ghost"
            className="p-2 hover:bg-rose-100  rounded-lg transition-all hover:scale-105 bg-transparent hover:text-red-600 duration-300 bg-gradient-to-r from-[#0891B2]/10 to-[#3282B8]/10 text-[#0F4C75] border border-[#0891B2]/20 shadow-md hover:shadow-lg"
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash2 className="w-5 h-5 mr-1"/> Delete
          </Button>
        
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
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const res = await fetch(`/api/tasks?id=${currentTask.id}`, {
                  method: "PATCH",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(formData),
                });

                const updated = await res.json();
                setTasks((prev) =>
                  prev.map((task) => (task.id === updated.id ? updated : task))
                );
                setShowEditDialog(false);
              }}
              className="space-y-4"
            >
              {/* Description Field */}
              <div>
                <label className="block text-sm font-medium">Description</label>
                <Input
                  value={formData.description ?? ""}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="text-slate-800"
                />
              </div>

              {/* Priority */}
              <div>
                <label className="block text-sm font-medium">Priority</label>
                <Select
                  value={formData.priority ?? ""}
                  onValueChange={(value) =>
                    setFormData({ ...formData, priority: value })
                  }
                >
                  <SelectTrigger className="w-full text-gray-800">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent className="bg-sky-50 text-slate-800">
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Project */}
              <div>
                <label className="block text-sm font-medium">Project</label>
                <Input
                  value={formData.project ?? ""}
                  onChange={(e) =>
                    setFormData({ ...formData, project: e.target.value })
                  }
                  className="text-gray-800"
                />
              </div>

              {/* Task Type */}
              <div>
                <label className="block text-sm font-medium">Task Type</label>
                <Input
                  value={formData.taskType ?? ""}
                  onChange={(e) =>
                    setFormData({ ...formData, taskType: e.target.value })
                  }
                  className="text-gray-800"
                />
              </div>

              {/* Assign To */}
              <div>
                <label className="block text-sm font-medium">Assign To</label>
                <Select
                  value={formData.assignTo || ""}
                  onValueChange={(value) =>
                    setFormData({ ...formData, assignTo: value })
                  }
                >
                  <SelectTrigger className="w-full text-gray-800">
                    <SelectValue placeholder="-- Select user --" />
                  </SelectTrigger>
                  <SelectContent className="bg-sky-50 text-slate-800">
                    {userEmails.map((email) => (
                      <SelectItem key={email} value={email}>
                        {email}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter>
                <Button type="submit" className="border">
                  Save
                </Button>
                <Button
                  className="border ml-2"
                  onClick={async () => {
                    const res = await fetch(`/api/tasks?id=${currentTask.id}`, {
                      method: "PATCH",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ currentStatus: "Finished" }),
                    });

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
            <Button variant="outline" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Table className="w-full text-black border-separate border-spacing-y-3">
        <TableHeader>
          <TableRow className="bg-[#3282B8]  shadow-md rounded-2xl">
            <TableHead className="text-center py-3 rounded-l-xl"></TableHead>  
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
                className="text-center px-4 py-4 font-semibold text-white last:rounded-r-xl"
              >
                {head}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {tasks.map((task) => (
            <TableRow
              key={task.id}
              className="bg-white shadow-md  hover:bg-sky-50 transition duration-200 hover:translate-y-1"
            >
              <TableCell className="text-center py-4 pl-2 pr-4 relative text-[#1E293B] rounded-l-lg overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-[5px] rounded-l-full bg-[#0891B2] shadow-md shadow-[#0891B2]/30" />
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
                      className="text-[#0891B2] flex flex-col"
                    >
                      <span className="font-semibold">
                        {formatDate(task.createdAt)}
                      </span>
                      <span className="text-xs text-gray-500 break-all">
                        {task.taskId}
                      </span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
                    <div className="w-96 bg-gradient-to-r from-[#0F4C75] via-[#3282B8] to-[#0891B2] p-4 text-white">
                    <h3 className="font-bold text-lg flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Task Details
              </h3>
              </div>
                    <Table className="w-full p-4 space-y-3 max-h-80 overflow-auto ">
                      <TableBody className="group hover:bg-gray-50 rounded-xl p-3 transition-colors duration-200">
                        {[
                          ["Task Label", task.taskLabel],
                          ["Edited File", task.secondFileName],
                          ["Created By", task.createdByRole],
                          ["Source Lang", task.sourceLang],
                          ["Target Lang", task.targetLang],
                          ["Iteration", task.currentIteration],
                        ].map(([label, value], i) => (
                          <TableRow key={i}>
                            <TableCell className="text-sm font-medium text-gray-600 mb-1 block">
                              {label}
                            </TableCell>
                            <TableCell className="font-semibold text-sm break-words text-[#1E293B]">
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
                {task.sourceFileName}
              </TableCell>
              <TableCell className="text-center break-words py-5">
                {task.description}
              </TableCell>
              <TableCell className="text-center break-words py-5">
                {task.project?.name || "—"}
              </TableCell>
              <TableCell className="text-center py-5 text-[#1E293B] font-medium">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(
                    task.priority
                  )}`}
                >
                  {task.priority}
                </span>
              </TableCell>
              <TableCell className="text-center py-5">
                {task.taskType}
              </TableCell>
              <TableCell className="text-center py-5">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    getStatusColor(task.currentStatus) || "border-none"
                  }`}
                >
                  {task.currentStatus}
                </span>
              </TableCell>
              <TableCell className="text-center py-5">
                {task.assignTo}
              </TableCell>

              <TableCell className="text-center text-xs text-[#1E293B]">
                {task.statusUpdatedAt ? (
                  <>
                    <div className="text-[#1E293B] font-medium">
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

              <TableCell className="text-center py-5 flex justify-center gap-2 rounded-r-2xl">
                <Button
                  variant="ghost"
                  onClick={() => handleTaskClick(task)}
                  className="p-3 rounded-xl transition-all duration-300 hover:scale-125 bg-gradient-to-r from-[#0891B2]/10 to-[#3282B8]/10 hover:from-[#0891B2]/20 hover:to-[#3282B8]/20 text-[#0F4C75] border border-[#0891B2]/20 shadow-md hover:shadow-lg"
                >
                  <Pencil className="w-4 h-4 text-[#3282B8]" />
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => downloadTaskAsPDF(task)}
                  className="p-3 rounded-xl transition-all duration-300 hover:scale-125 bg-gradient-to-r from-[#0891B2]/10 to-[#3282B8]/10 hover:from-[#0891B2]/20 hover:to-[#3282B8]/20 text-[#0F4C75] border border-[#0891B2]/20 shadow-md hover:shadow-lg"
                >
                  <Download className="w-4 h-4 text-[#3282B8]" />
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
            className={`
    px-3 py-2 transition-all duration-200 
    ${
      page === 1
        ? "text-gray-400 cursor-not-allowed"
        : "text-[#9CA3AF] hover:text-[#0891B2]"
    }
  `}
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
            className={`
    px-3 py-2 transition-all duration-200 
    ${
      page * limit >= totalTasks
        ? "text-gray-400 cursor-not-allowed "
        : "text-[#9CA3AF] hover:text-[#0891B2]"
    }
  `}
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
