"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Pencil, Trash2 } from "lucide-react";

export default function ClientsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const [clients, setClients] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editClientId, setEditClientId] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    const res = await fetch("/api/clients");
    const data = await res.json();
    setClients(Array.isArray(data) ? data : []);
  };

  const handleAddClient = async () => {
    const method = isEditMode ? "PUT" : "POST";
    const endpoint = isEditMode
      ? `/api/clients/${editClientId}`
      : "/api/clients";

    const res = await fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      setFormData({ name: "", email: "", phone: "", address: "" });
      setShowForm(false);
      setIsEditMode(false);
      setEditClientId(null);
      fetchClients();
    }
  };

  const handleEdit = (client) => {
    setFormData({
      name: client.name,
      email: client.email,
      phone: client.phone,
      address: client.address,
    });
    setEditClientId(client.id);
    setIsEditMode(true);
    setShowForm(true);
  };
  const handleDeleteClient = async () => {
    if (!clientToDelete) return;

    try {
      const res = await fetch(`/api/clients/${clientToDelete.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        fetchClients();
        setDeleteDialogOpen(false);
        setClientToDelete(null);
      } else {
        console.error("Failed to delete client.");
      }
    } catch (error) {
      console.error("Error deleting client:", error);
    }
  };

  return (
    <div className="m-0 p-0 w-full">
      {/* Top Tabs */}
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

      <Card className="p-4 mb-6 shadow-xl border w-full bg-gray-50">
        <div className="flex gap-4 mb-10">
          <h1 className="text-xl font-semibold text-gray-900">Clients</h1>
          <div className="ml-auto">
            <Button
              onClick={() => {
                setShowForm(true);
                setIsEditMode(false);
                setFormData({ name: "", email: "", phone: "", address: "" });
              }}
              className="bg-black text-white"
            >
              + Add Client
            </Button>
          </div>
        </div>

        {/* Client List */}
        {clients.map((client) => (
          <Card key={client.id} className="p-4 mb-6 shadow-xl border bg-white">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                {client.name}
              </h2>
              <div className="flex gap-2">
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-gray-600 border-gray-600 hover:bg-gray-100"
                  onClick={() => handleEdit(client)} // 👈 handle edit
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-gray-600 border-gray-600 hover:bg-gray-100"
                  onClick={() => {
                    setClientToDelete(client);
                    setDeleteDialogOpen(true);
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="text-sm text-gray-700">
              <div>Email: {client.email}</div>
              <div>Phone: {client.phone}</div>
              <div>Address: {client.address}</div>
            </div>
            <div className="border-t pt-4 text-gray-300">
              {client.projects?.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">
                    Projects
                  </h3>
                  <ul className="list-disc list-inside text-gray-700">
                    {client.projects.map((p) => (
                      <li key={p.project.id}>{p.project.name}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </Card>
        ))}

        {/* Add/Edit Client Dialog */}
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {isEditMode ? "Edit Client" : "Add Client"}
              </DialogTitle>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="space-y-1">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
              <Button variant="outline" onClick={handleAddClient}>
                {isEditMode ? "Update" : "Add"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        {/* delete client */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Delete</DialogTitle>
            </DialogHeader>
            <div className="text-sm text-gray-700">
              Are you sure you want to delete{" "}
              <strong>{clientToDelete?.name}</strong>? This action cannot be
              undone.
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setDeleteDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button variant="outline" onClick={handleDeleteClient}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Card>
    </div>
  );
}
