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
    project: "",
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
  const [projectNames, setProjectNames] = useState([]);

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
        const projectData = await projectRes.json();
        setProjectNames(Array.isArray(projectData) ? projectData : []);
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
    <div className="flex p-8">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-lg p-12 w-3xl max-w-5xl overflow-auto ml-14 mt-10"
      >
        <h1 className="text-2xl font-bold  mb-6 text-gray-800">Create Task</h1>

        {/* Project */}
        <div className="mb-4">
        <Select
          value={formData.project}
          onValueChange={(value) =>
            setFormData({ ...formData, project: value })
          }
        >
          <SelectTrigger className="w-full text-gray-600">
            <SelectValue placeholder="Select a project" />
          </SelectTrigger>
          <SelectContent className="bg-gray-200 text-gray-700">
            {projectNames.map((project) => (
              <SelectItem key={project.id} value={project.name}>
                {project.name}  
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        </div>

        {/* Task Type */}
        <div className="mb-4">
          <Label className="text-gray-600">Task Type</Label>
          <Select
            value={formData.taskType}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, taskType: value }))
            }
          >
            <SelectTrigger className="w-full text-gray-600">
              <SelectValue placeholder="Select task type" />
            </SelectTrigger>
            <SelectContent className="bg-gray-200 text-gray-700">
              <SelectItem value="Translation">Translation</SelectItem>
              <SelectItem value="NER">NER</SelectItem>
              <SelectItem value="Headline">Headline</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Assign To */}
        <div className="mb-4">
          <Label className="text-gray-600">Assign To (Email)</Label>
          <Select
            value={formData.assignTo}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, assignTo: value }))
            }
          >
            <SelectTrigger className="w-full text-gray-600">
              <SelectValue placeholder="Select user email" />
            </SelectTrigger>
            <SelectContent className="bg-gray-200 text-gray-700">
              {userEmails.map((user) => (
                <SelectItem key={user.email} value={user.email}>
                  {user.email}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Task Label */}
        <div className="mb-4">
          <Label className="text-gray-600">Task Label</Label>
          <Input
            name="taskLabel"
            onChange={handleChange}
            required
            className="w-full text-gray-600"
          />
        </div>

        {/* Domain */}
        <div className="mb-4">
          <Label className="text-gray-600">
            Domain<span className="text-red-600">*</span>
          </Label>
          <Select
            value={formData.domain}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, domain: value }))
            }
          >
            <SelectTrigger className="w-full text-gray-600">
              <SelectValue placeholder="Select domain" />
            </SelectTrigger>
            <SelectContent>
              {["news", "science and tech", "general", "governance"].map(
                (d) => (
                  <SelectItem key={d} value={d}>
                    {d}
                  </SelectItem>
                )
              )}
            </SelectContent>
          </Select>
        </div>

        {/* Source File */}
        <div className="mb-4">
          <Label className="text-gray-600">
            Source File<span className="text-red-600">*</span>
          </Label>
          <Input
            type="file"
            name="sourceFile"
            onChange={handleChange}
            required
            className="w-full text-gray-600"
          />
        </div>

        {/* Second File */}
        {formData.taskType === "Translation" && (
          <div className="mb-4">
            <Label className="text-gray-600">Second File (Translation)</Label>
            <Input
              type="file"
              name="secondFile"
              onChange={handleChange}
              required
              className="w-full text-gray-600"
            />
          </div>
        )}

        {/* Source Lang */}
        <div className="mb-4">
          <Label className="text-gray-600">Language - Source</Label>
          <Input
            name="sourceLang"
            onChange={handleChange}
            className="w-full text-gray-600"
          />
        </div>

        {/* Target Lang */}
        <div className="mb-4">
          <Label className="text-gray-600">Language - Target</Label>
          <Input
            name="targetLang"
            onChange={handleChange}
            className="w-full text-gray-600"
          />
        </div>

        {/* Description */}
        <div className="mb-4">
          <Label className="text-gray-600">
            Description<span className="text-red-600">*</span>
          </Label>
          <Textarea
            name="description"
            onChange={handleChange}
            required
            className="w-full text-gray-600"
          />
        </div>

        {/* Expected Finish Date */}
        <div className="mb-4">
          <Label className="text-gray-600">Expected Finish Date</Label>
          <Input
            type="date"
            name="expectedFinishDate"
            onChange={handleChange}
            className="w-full text-gray-600"
          />
        </div>

        {/* Priority */}
        <div className="mb-4">
          <Label className="text-gray-600">Priority</Label>
          <Select
            value={formData.priority}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, priority: value }))
            }
          >
            <SelectTrigger className="w-full text-gray-600">
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent className="bg-gray-200 text-gray-700">
              {["High", "Medium", "Low"].map((p) => (
                <SelectItem key={p} value={p}>
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex justify-center">
          <Button
            type="submit"
            className="bg-black text-white hover:bg-gray-400"
          >
            Create Task
          </Button>
        </div>
      </form>
    </div>
  );
}
