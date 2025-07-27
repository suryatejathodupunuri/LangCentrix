"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Textarea } from "../../../components/ui/textarea";
import { Label } from "../../../components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "../../../components/ui/select";

export default function TaskForm() {
  const [formData, setFormData] = useState({
    projectId: "",
    taskType: "",
    assignTo: "",
    taskLabel: "",
    priority: "Medium",
    sourceFile: null,
    secondFile: null,
    sourceLang: "",
    targetLang: "",
    description: "",
    expectedFinishDate: "",
    domain: "general",
  });
  const [userEmails, setUserEmails] = useState([]);
  const [projects, setProjects] = useState([]);

  // Fetch user emails when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user emails
        const emailRes = await fetch("/api/users/emails");
        const emailData = await emailRes.json();
        setUserEmails(Array.isArray(emailData) ? emailData : []);

        // Fetch project names
        const projectRes = await fetch("/api/projects");
        const data = await projectRes.json();
        setProjects(Array.isArray(data.projects) ? data.projects : []);
      } catch (error) {
        console.error("Error fetching emails or projects:", error);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };
  const { data: session } = useSession();
  const currentUser = session?.user;
  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();

    // Add all form fields
    Object.entries(formData).forEach(([key, value]) => {
      if (value) form.append(key, value);
    });

    form.append("createdBy", currentUser?.name || "Unknown");
    form.append("createdByRole", currentUser?.role || "Unknown");

    const res = await fetch("/api/tasks", {
      method: "POST",
      body: form,
    });

    if (res.ok) {
      alert("Task created successfully");
    } else {
      alert("Failed to create task");
    }
  };

  return (
    <div className="flex p-8 justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white/95 shadow-2xl rounded-2xl p-12 w-3xl max-w-5xl overflow-auto ml-14 mt-10 backdrop-blur-xl border-0 "
      >
        <h1 className="text-3xl mb-8 font-bold text-[#0F4C75]">Create Task</h1>

        {/* Project */}
        <div className="mb-4">
          <Label className="text-sm font-bold text-[#0F4C75] uppercase tracking-wider">
            Project
          </Label>
          <Select
            value={formData.projectId}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, projectId: value }))
            }
          >
            <SelectTrigger className="w-full border-2 border-[#0891B2]/20 focus:border-[#0891B2] rounded-xl p-4 bg-gradient-to-r from-[#F0F9FF] to-white transition-all duration-300 focus:shadow-lg text-[#1E293B] placeholder-[#1E293B]/50">
              <SelectValue placeholder="Select a project" />
            </SelectTrigger>
            <SelectContent className="bg-white border-slate-200 rounded-lg">
              {projects.map((project) => (
                <SelectItem
                  key={project.id}
                  value={project.id}
                  className="text-slate-700 hover:bg-sky-50 cursor-pointer"
                >
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Task Type */}
        <div className="mb-4">
          <Label className="text-sm font-bold text-[#0F4C75] uppercase tracking-wider">
            Task Type
          </Label>
          <Select
            value={formData.taskType}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, taskType: value }))
            }
          >
            <SelectTrigger className="w-full border-2 border-[#0891B2]/20 focus:border-[#0891B2] rounded-xl p-4 bg-gradient-to-r from-[#F0F9FF] to-white transition-all duration-300 focus:shadow-lg text-[#1E293B] placeholder-[#1E293B]/50">
              <SelectValue placeholder="Select task type" />
            </SelectTrigger>
            <SelectContent className="bg-white border-slate-200 rounded-lg">
              <SelectItem
                value="Translation"
                className="text-slate-700 hover:bg-sky-50 cursor-pointer"
              >
                Translation
              </SelectItem>
              <SelectItem
                value="NER"
                className="text-slate-700 hover:bg-sky-50 cursor-pointer"
              >
                NER
              </SelectItem>
              <SelectItem
                value="Headline"
                className="text-slate-700 hover:bg-sky-50 cursor-pointer"
              >
                Headline
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Assign To */}
        <div className="mb-4">
          <Label className="text-sm font-bold text-[#0F4C75] uppercase tracking-wider">
            Assign To (Email)
          </Label>
          <Select
            value={formData.assignTo}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, assignTo: value }))
            }
          >
            <SelectTrigger className="w-full border-2 border-[#0891B2]/20 focus:border-[#0891B2] rounded-xl p-4 bg-gradient-to-r from-[#F0F9FF] to-white transition-all duration-300 focus:shadow-lg text-[#1E293B] placeholder-[#1E293B]/50">
              <SelectValue placeholder="Select user email" />
            </SelectTrigger>
            <SelectContent className="bg-white border-slate-200 rounded-lg">
              {userEmails.map((user) => (
                <SelectItem
                  key={user.email}
                  value={user.email}
                  className="text-slate-700 hover:bg-sky-50 cursor-pointer"
                >
                  {user.email}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Task Label */}
        <div className="mb-4">
          <Label className="text-sm font-bold text-[#0F4C75] uppercase tracking-wider">
            Task Label
          </Label>
                    <Select
            value={formData.taskLabel}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, taskLabel: value }))
            }
          >
            <SelectTrigger className="w-full border-2 border-[#0891B2]/20 focus:border-[#0891B2] rounded-xl p-4 bg-gradient-to-r from-[#F0F9FF] to-white transition-all duration-300 focus:shadow-lg text-[#1E293B] placeholder-[#1E293B]/50">
              <SelectValue placeholder="Select task label" />
            </SelectTrigger>
            <SelectContent className="bg-white border-slate-200 rounded-lg">
              <SelectItem
                value="Editing"
                className="text-slate-700 hover:bg-sky-50 cursor-pointer"
              >
                Editing
              </SelectItem>
              <SelectItem
                value="Review"
                className="text-slate-700 hover:bg-sky-50 cursor-pointer"
              >
                Review
              </SelectItem>
              <SelectItem
                value="Proofread"
                className="text-slate-700 hover:bg-sky-50 cursor-pointer"
              >
                Proofread
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Domain */}
        <div className="mb-4">
          <Label className="text-sm font-bold text-[#0F4C75] uppercase tracking-wider">
            Domain<span className="text-red-500 ml-1">*</span>
          </Label>
          <Select
            value={formData.domain}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, domain: value }))
            }
          >
            <SelectTrigger className="w-full border-2 border-[#0891B2]/20 focus:border-[#0891B2] rounded-xl p-4 bg-gradient-to-r from-[#F0F9FF] to-white transition-all duration-300 focus:shadow-lg text-[#1E293B] placeholder-[#1E293B]/50">
              <SelectValue placeholder="Select domain" />
            </SelectTrigger>
            <SelectContent className="bg-white border-slate-200 rounded-lg">
              {["news", "science and tech", "general", "governance"].map(
                (d) => (
                  <SelectItem
                    key={d}
                    value={d}
                    className="text-slate-700 hover:bg-sky-50 cursor-pointer capitalize"
                  >
                    {d}
                  </SelectItem>
                )
              )}
            </SelectContent>
          </Select>
        </div>

        {/* Source File */}
        <div className="mb-4">
          <Label className="text-sm font-bold text-[#0F4C75] uppercase tracking-wider">
            Source File<span className="text-red-500 ml-1">*</span>
          </Label>
          <Input
            type="file"
            name="sourceFile"
            onChange={handleChange}
            required
            className="w-full border-2 border-[#0891B2]/20 focus:border-[#0891B2] rounded-xl p-1 bg-gradient-to-r from-[#F0F9FF] to-white transition-all duration-300 focus:shadow-lg text-[#1E293B] placeholder-[#1E293B]/50"
          />
        </div>

        {/* Second File */}
        {formData.taskType === "Translation" && (
          <div className="mb-4">
            <Label className="text-sm font-bold text-[#0F4C75] uppercase tracking-wider">
              Second File (Translation)
            </Label>
            <Input
              type="file"
              name="secondFile"
              onChange={handleChange}
              className="w-full  border-2 border-[#0891B2]/20 focus:border-[#0891B2] rounded-xl p-1 bg-gradient-to-r from-[#F0F9FF] to-white transition-all duration-300 focus:shadow-lg text-[#1E293B] placeholder-[#1E293B]/50"
            />
          </div>
        )}

        {/* Source Lang */}
        <div className="mb-4">
          <Label className="text-sm font-bold text-[#0F4C75] uppercase tracking-wider">
            Language - Source
          </Label>
          <Input
            name="sourceLang"
            onChange={handleChange}
            className="w-full border-2 border-[#0891B2]/20 focus:border-[#0891B2] rounded-xl p-4 bg-gradient-to-r from-[#F0F9FF] to-white transition-all duration-300 focus:shadow-lg text-[#1E293B] placeholder-[#1E293B]/50"
            placeholder="Enter source language"
          />
        </div>

        {/* Target Lang */}
        <div className="mb-4">
          <Label className="text-sm font-bold text-[#0F4C75] uppercase tracking-wider">
            Language - Target
          </Label>
          <Input
            name="targetLang"
            onChange={handleChange}
            className="w-full border-2 border-[#0891B2]/20 focus:border-[#0891B2] rounded-xl p-4 bg-gradient-to-r from-[#F0F9FF] to-white transition-all duration-300 focus:shadow-lg text-[#1E293B] placeholder-[#1E293B]/50"
            placeholder="Enter target language"
          />
        </div>

        {/* Description */}
        <div className="mb-4">
          <Label className="text-sm font-bold text-[#0F4C75] uppercase tracking-wider">
            Description<span className="text-red-500 ml-1">*</span>
          </Label>
          <Textarea
            name="description"
            onChange={handleChange}
            required
            className="w-full border-2 border-[#0891B2]/20 focus:border-[#0891B2] rounded-xl p-4 bg-gradient-to-r from-[#F0F9FF] to-white transition-all duration-300 focus:shadow-lg text-[#1E293B] placeholder-[#1E293B]/50"
            placeholder="Enter task description..."
          />
        </div>

        {/* Expected Finish Date */}
        <div className="mb-4">
          <Label className="text-sm font-bold text-[#0F4C75] uppercase tracking-wider">
            Expected Finish Date
          </Label>
          <Input
            type="date"
            name="expectedFinishDate"
            onChange={handleChange}
            className="w-full border-2 border-[#0891B2]/20 focus:border-[#0891B2] rounded-xl p-4 bg-gradient-to-r from-[#F0F9FF] to-white transition-all duration-300 focus:shadow-lg text-[#1E293B] placeholder-[#1E293B]/50"
          />
        </div>

        {/* Priority */}
        <div className="mb-4">
          <Label className="text-sm font-bold text-[#0F4C75] uppercase tracking-wider">
            Priority
          </Label>
          <Select
            value={formData.priority}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, priority: value }))
            }
          >
            <SelectTrigger className="w-full border-2 border-[#0891B2]/20 focus:border-[#0891B2] rounded-xl p-4 bg-gradient-to-r from-[#F0F9FF] to-white transition-all duration-300 focus:shadow-lg text-[#1E293B] placeholder-[#1E293B]/50">
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent className="bg-white border-slate-200 rounded-lg">
              {["High", "Medium", "Low"].map((p) => (
                <SelectItem
                  key={p}
                  value={p}
                  className="text-slate-700 hover:bg-sky-50 cursor-pointer"
                >
                  <span
                    className={`inline-block w-3 h-3 rounded-full mr-2 ${
                      p === "High"
                        ? "bg-red-500"
                        : p === "Medium"
                        ? "bg-yellow-500"
                        : "bg-green-500"
                    }`}
                  ></span>
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex justify-center">
          <Button
            type="submit"
            className="px-6 py-3 rounded-xl font-bold transition-all duration-300 hover:scale-105 bg-gradient-to-r from-[#0891B2] to-[#0F4C75] text-white border-0 shadow-lg hover:shadow-xl"
          >
            Create Task
          </Button>
        </div>
      </form>
    </div>
  );
}
