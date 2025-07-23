"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Plus,
  Users,
  FolderOpen,
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
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";

export default function AllProjectsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);
  const [page, setPage] = useState(1);
  const limit = 5;
  const [totalProjects, setTotalProjects] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    description: "",
    managerName: "",
    startDate: "",
    endDate: "",
    clientId: "",
  });

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch(`/api/projects?page=${page}&limit=${limit}`);
        const data = await res.json();
        setProjects(Array.isArray(data.projects) ? data.projects : []);
        setTotalProjects(data.total || 0); // total count from API
      } catch (err) {
        console.error("Failed to load projects:", err);
        setProjects([]);
      }
    };
    fetchProjects();
  }, [page]);

  // Fetch Clients (no pagination)
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await fetch("/api/clients");
        const data = await res.json();
        setClients(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch clients:", err);
        setClients([]);
      }
    };
    fetchClients();
  }, []);

  const handleEdit = (project) => {
    setFormData({
      id: project.id,
      name: project.name,
      description: project.description,
      managerName: project.managerName,
      startDate: project.Duration?.split(" - ")[0] || "",
      endDate: project.Duration?.split(" - ")[1] || "",
      clientId: clients.find((c) => c.name === project.clientName)?.id || "",
    });
    setShowForm(true);
  };

  const handleSaveProject = async () => {
    try {
      const method = formData.id ? "PUT" : "POST";
      const url = formData.id
        ? `/api/projects/${formData.id}`
        : "/api/projects";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const error = await res.json();
        console.error("Error saving project:", error?.error || "Unknown");
        return;
      }

      setFormData({
        id: "",
        name: "",
        description: "",
        managerName: "",
        startDate: "",
        endDate: "",
        clientId: "",
      });
      setShowForm(false);

      const updated = await fetch("/api/projects");
      const updatedData = await updated.json();
      setProjects(Array.isArray(updatedData) ? updatedData : []);
    } catch (err) {
      console.error("Error saving project:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project?"))
      return;
    try {
      await fetch(`/api/projects/${id}`, { method: "DELETE" });
      const updated = await fetch("/api/projects");
      const updatedData = await updated.json();
      setProjects(Array.isArray(updatedData) ? updatedData : []);
    } catch (err) {
      console.error("Error deleting project:", err);
    }
  };

  return (
    <div className="min-h-screen relative z-10 max-w-7xl mx-auto px-4 mt-16">
      {/* Top Navigation */}
      <div className="relative z-10 flex items-center mb-2 -ml-6 px-6 pt-6">
        <div className="flex gap-1 bg-white/80 backdrop-blur-xl rounded-2xl p-1.5 shadow-2xl border border-white/30">
          <Button
            variant="ghost"
            onClick={() => router.push("/clients")}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-500 hover:scale-105 flex items-center gap-2 ${
              pathname === "/clients"
                ? "bg-gradient-to-r from-[#0F4C75] to-[#3282B8] text-white shadow-lg shadow-[#0F4C75]/30"
                : "text-[#1E293B] hover:bg-white/60"
            }`}
          >
            <Users className="w-4 h-4" />
            Clients
          </Button>

          <Button
            variant="ghost"
            onClick={() => router.push("/Projects")}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-500 hover:scale-105 flex items-center gap-2 ${
              pathname === "/Projects"
                ? "bg-gradient-to-r from-[#0F4C75] to-[#3282B8] text-white shadow-lg shadow-[#0F4C75]/30"
                : "text-[#1E293B] hover:bg-white/60"
            }`}
          >
            <FolderOpen className="w-4 h-4" />
            All Projects
          </Button>
        </div>
      </div>

      {/* edit project */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="bg-white/95 backdrop-blur-xl border-0 shadow-2xl rounded-3xl max-w-md overflow-hidden">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-[#0F4C75]">
              {formData.id ? "Edit Project" : "Add New Project"}
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-1">
              <Label
                htmlFor="client"
                className="text-sm font-bold text-[#0F4C75] uppercase tracking-wider"
              >
                Client
              </Label>
              <Select
                value={formData.clientId}
                onValueChange={(value) =>
                  setFormData({ ...formData, clientId: value })
                }
              >
                <SelectTrigger className="w-full border-2 border-[#0891B2]/20 focus:border-[#0891B2] rounded-xl p-4 bg-gradient-to-r from-[#F0F9FF] to-white transition-all duration-300 focus:shadow-lg text-[#1E293B] placeholder-[#1E293B]/50">
                  <SelectValue placeholder="Select a client" />
                </SelectTrigger>
                <SelectContent className="bg-slate-50 text-gray-700">
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label
                htmlFor="name"
                className="text-sm font-bold text-[#0F4C75] uppercase tracking-wider"
              >
                Project Name
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="border-2 border-[#0891B2]/20 focus:border-[#0891B2] rounded-xl p-4 bg-gradient-to-r from-[#F0F9FF] to-white transition-all duration-300 focus:shadow-lg text-[#1E293B] placeholder-[#1E293B]/50"
                placeholder="Enter project name"
              />
            </div>

            <div className="space-y-1">
              <Label
                htmlFor="description"
                className="text-sm font-bold text-[#0F4C75] uppercase tracking-wider"
              >
                Description
              </Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="border-2 border-[#0891B2]/20 focus:border-[#0891B2] rounded-xl p-4 bg-gradient-to-r from-[#F0F9FF] to-white transition-all duration-300 focus:shadow-lg text-[#1E293B] placeholder-[#1E293B]/50"
                placeholder="Enter description"
              />
            </div>

            <div className="space-y-1">
              <Label
                htmlFor="manager"
                className="text-sm font-bold text-[#0F4C75] uppercase tracking-wider"
              >
                Manager Name
              </Label>
              <Input
                id="manager"
                value={formData.managerName}
                onChange={(e) =>
                  setFormData({ ...formData, managerName: e.target.value })
                }
                className="border-2 border-[#0891B2]/20 focus:border-[#0891B2] rounded-xl p-4 bg-gradient-to-r from-[#F0F9FF] to-white transition-all duration-300 focus:shadow-lg text-[#1E293B] placeholder-[#1E293B]/50"
                placeholder="Enter manager name"
              />
            </div>

            <div className="space-y-1">
              <Label
                htmlFor="startDate"
                className="text-sm font-bold text-[#0F4C75] uppercase tracking-wider"
              >
                Start Date
              </Label>
              <Input
                type="date"
                value={formData.startDate}
                onChange={(e) =>
                  setFormData({ ...formData, startDate: e.target.value })
                }
                className="border-2 border-[#0891B2]/20 focus:border-[#0891B2] rounded-xl p-4 bg-gradient-to-r from-[#F0F9FF] to-white transition-all duration-300 focus:shadow-lg text-[#1E293B] placeholder-[#1E293B]/50"
              />
            </div>

            <div className="space-y-1">
              <Label
                htmlFor="endDate"
                className="text-sm font-bold text-[#0F4C75] uppercase tracking-wider"
              >
                End Date
              </Label>
              <Input
                type="date"
                value={formData.endDate}
                onChange={(e) =>
                  setFormData({ ...formData, endDate: e.target.value })
                }
                className="border-2 border-[#0891B2]/20 focus:border-[#0891B2] rounded-xl p-4 bg-gradient-to-r from-[#F0F9FF] to-white transition-all duration-300 focus:shadow-lg text-[#1E293B] placeholder-[#1E293B]/50"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowForm(false)}
              className="px-6 py-3 rounded-xl font-bold transition-all duration-300 hover:scale-105 bg-white border-2 border-[#1E293B]/20 text-[#1E293B] hover:bg-[#1E293B]/5"
            >
              Cancel
            </Button>
            <Button
              variant="outline"
              onClick={handleSaveProject}
              className="px-6 py-3 rounded-xl font-bold transition-all duration-300 hover:scale-105 bg-gradient-to-r from-[#0891B2] to-[#0F4C75] text-white border-0 shadow-lg hover:shadow-xl"
            >
              {formData.id ? "Update" : "Add"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* delete project  */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <div>
            Are you sure you want to delete the project{" "}
            <strong>{projectToDelete?.name}</strong>? This action cannot be
            undone.
          </div>
          <DialogFooter className="pt-4">
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
            >
              Cancel
            </Button>
            <Button
              variant="outline"
              onClick={async () => {
                try {
                  const res = await fetch(
                    `/api/projects/${projectToDelete.id}`,
                    {
                      method: "DELETE",
                    }
                  );
                  if (res.ok) {
                    const updated = await fetch("/api/projects");
                    const updatedData = await updated.json();
                    setProjects(Array.isArray(updatedData) ? updatedData : []);
                    setShowDeleteDialog(false);
                    setProjectToDelete(null);
                  } else {
                    console.error("Failed to delete project.");
                  }
                } catch (err) {
                  console.error("Error deleting project:", err);
                }
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Card className="backdrop-blur-xl bg-white/90 border-0 shadow-2xl rounded-3xl overflow-hidden">
        <div className="bg-gradient-to-r from-[#0F4C75] via-[#3282B8] to-[#0891B2] p-8 relative overflow-hidden rounded-t-3xl -mt-6">
          <div className="relative flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="p-4 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 shadow-lg">
                <FolderOpen className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white">
                All Projects
              </h1>
            </div>
            <Button
              onClick={() => {
                setFormData({
                  id: "",
                  name: "",
                  description: "",
                  managerName: "",
                  startDate: "",
                  endDate: "",
                  clientId: "",
                });
                setShowForm(true);
              }}
              className="px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-110 bg-white text-[#0F4C75] border-0 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 group"
            >
              <Plus className="w-4 h-4" />
              Add Project
            </Button>
          </div>
        </div>

        <Table className="w-full text-black border-separate border-spacing-y-3">
          <TableHeader>
            <TableRow className="bg-[#3282B8] shadow-md rounded-lg">
              {[
                "Project",
                "Description",
                "Client",
                "Manager",
                "Duration",
                "Actions",
              ].map((head, i) => (
                <TableHead
                  key={i}
                  className="text-center px-4 py-4 uppercase font-bold text-white first:rounded-l-lg last:rounded-r-lg"
                >
                  {head}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map((project) => (
              <TableRow
                key={project.id}
                className="bg-white shadow-md rounded-r-lg rounded-l-lg hover:shadow-lg transition-all duration-200 hover:translate-y-1 hover:bg-sky-50"
              >
                <TableCell className="text-center py-4 pl-0 pr-4 relative text-[#1E293B] rounded-l-lg overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-[5px] rounded-l-full bg-[#0891B2] shadow-md shadow-[#0891B2]/30" />
                  <span className="font-medium">{project.name}</span>
                </TableCell>
                <TableCell className="text-center py-4">
                  {project.description}
                </TableCell>
                <TableCell className="text-center py-4 first:rounded-l-lg text-[#1E293B]">
                  <span className="font-medium">{project.clientName}</span>
                </TableCell>
                <TableCell className="text-center py-4">
                  {project.managerName}
                </TableCell>
                <TableCell className="text-center py-4">
                  {project.Duration}
                </TableCell>
                <TableCell className="text-center py-4">
                  <div className="flex justify-center gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="p-3 rounded-xl transition-all duration-300 hover:scale-125 bg-gradient-to-r from-[#0891B2]/10 to-[#3282B8]/10 hover:from-[#0891B2]/20 hover:to-[#3282B8]/20 text-[#0F4C75] border border-[#0891B2]/20 shadow-md hover:shadow-lg"
                      onClick={() => handleEdit(project)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setProjectToDelete(project);
                        setShowDeleteDialog(true);
                      }}
                      className="p-3 rounded-xl transition-all duration-300 hover:scale-125 bg-gradient-to-r from-red-50 to-rose-50 hover:from-red-100 hover:to-rose-100 text-red-600 border border-red-200 shadow-md hover:shadow-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="flex justify-between items-center mt-8 pt-4 border-t border-[#3282B8]">
          <p className="text-sm font-medium text-[#1E293B]">
            Showing {projects.length} of {totalProjects} project
            {totalProjects !== 1 ? "s" : ""}
          </p>

          <div className="flex items-center gap-2">
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

            <span className="text-sm font-medium px-3 py-2 rounded-md text-[#0F4C75] bg-[#F0F9FF]">
              Page {page} of {Math.ceil(totalProjects / limit) || 1}
            </span>

            <Button
              variant="ghost"
              disabled={page * limit >= totalProjects}
              onClick={() => setPage((prev) => prev + 1)}
              className={`
    px-3 py-2 transition-all duration-200 
    ${
      page * limit >= totalProjects
        ? "text-gray-400 cursor-not-allowed"
        : "text-[#9CA3AF] hover:text-[#0891B2]"
    }
  `}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
