"use client";

import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";

export default function ProjectForm({ open, onClose, onProjectCreated }) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    clientName: "",
    managerName: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (res.ok) {
      onProjectCreated(data);
    } else {
      alert(data.error || "Failed to create project");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogTitle>Add Project</DialogTitle>
        <DialogDescription>
          You can Add the project details below.
        </DialogDescription>
        {/* <h2 className="text-lg font-bold text-black mb-4">Add Project</h2> */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label className="text-white">Project Name</Label>
            <Input
              name="name"
              onChange={handleChange}
              required
              className="w-full text-gray-600"
            />
          </div>
          <div>
            <Label className="text-white">Description</Label>
            <Input
              name="description"
              onChange={handleChange}
              required
              className="w-full text-gray-600"
            />
          </div>
          <div>
            <Label className="text-white">Client Name</Label>
            <Input
              name="clientName"
              onChange={handleChange}
              required
              className="w-full text-gray-600"
            />
          </div>
          <div>
            <Label className="text-white">Manager Name</Label>
            <Input
              name="managerName"
              onChange={handleChange}
              required
              className="w-full text-gray-600"
            />
          </div>
          <Button type="submit" className="w-full bg-black text-white border">
            Create Project
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
