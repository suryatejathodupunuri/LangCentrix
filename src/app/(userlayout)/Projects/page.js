"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Pencil, Trash2 } from "lucide-react";
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
        const res = await fetch("/api/projects");
        const data = await res.json();
        setProjects(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load projects:", err);
        setProjects([]);
      }
    };
    fetchProjects();
  }, []);

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
    <div className="mt-20 m-0 p-0 w-full">
      <div className="flex items-center mb-0 ml-2">
      <div className="flex gap-4">
        <Button
          variant="ghost"
          onClick={() => router.push("/clients")}
          className={`text-black border-b-2 rounded-none font-medium ${
            pathname === "/clients" ? "border-black" : "border-transparent"
          }`}
        >
          Clients
        </Button>
        <Button
          variant="ghost"
          onClick={() => router.push("/Projects")}
          className={`text-black border-b-2 rounded-none ${
            pathname === "/Projects" ? "border-black" : "border-transparent"
          }`}
        >
          All Projects
        </Button>
      </div>
      </div>

      {/* edit project */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {formData.id ? "Edit Project" : "Add New Project"}
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-1">
              <Label htmlFor="client">Client</Label>
              <Select
                value={formData.clientId}
                onValueChange={(value) =>
                  setFormData({ ...formData, clientId: value })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a client" />
                </SelectTrigger>
                <SelectContent className="bg-gray-200 text-gray-700">
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label htmlFor="name">Project Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="manager">Manager Name</Label>
              <Input
                id="manager"
                value={formData.managerName}
                onChange={(e) =>
                  setFormData({ ...formData, managerName: e.target.value })
                }
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                type="date"
                value={formData.startDate}
                onChange={(e) =>
                  setFormData({ ...formData, startDate: e.target.value })
                }
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                type="date"
                value={formData.endDate}
                onChange={(e) =>
                  setFormData({ ...formData, endDate: e.target.value })
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
            <Button variant="outline" onClick={handleSaveProject}>
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

      <Card className="p-4 mb-6 shadow-xl border w-full bg-gray-100">
        <div className="flex gap-4 mb-6">
          <h1 className="text-xl font-semibold text-gray-900">All Projects</h1>
          <div className="ml-auto">
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
              className="bg-black text-white"
            >
              + Add project
            </Button>
          </div>
        </div>

        <Table className="w-full text-black border-separate border-spacing-y-3">
          <TableHeader>
            <TableRow className="bg-white shadow-md">
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
                  className="text-center px-2 py-4 text-black font-semibold"
                >
                  {head}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map((project) => (
              <TableRow key={project.id} className="bg-white shadow rounded hover:shadow-lg">
                <TableCell className="text-center py-4">
                  {project.name}
                </TableCell>
                <TableCell className="text-center py-4">
                  {project.description}
                </TableCell>
                <TableCell className="text-center py-4">
                  {project.clientName}
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
                      className="text-gray-600 border-gray-600 hover:bg-gray-100"
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
                      className="text-gray-600 border-gray-600 hover:bg-gray-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
