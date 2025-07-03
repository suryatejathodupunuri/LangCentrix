"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import ProjectFormModal from "./ProjectForm";

import { Card } from "../../../components/ui/card";

export default function ProjectListPage() {
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  // Fetch projects on load
  useEffect(() => {
    const fetchProjects = async () => {
      const res = await fetch("/api/projects");
      if (!res.ok) {
        console.error("API returned error", res.status);
        return;
      }
      const data = await res.json();
      setProjects(data);
    };
    fetchProjects();
  }, []);

  // Filter by search
  const filtered = projects.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex ">
      {/* <div className="flex flex-col flex-1 overflow-hidden"> */}

      <main className="p-2 overflow-auto w-full">
        <Card className="p-4 shadow-xl mb-34 bg-white overflow-x-auto w-3xl">
          <div className="bg-slate-100 p-3 rounded-t-xl">
            <h2 className="text-xl text-center font-bold text-black">
              Project List
            </h2>
          </div>

          {/* <Input
            placeholder="Search Projects"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mt-4 mb-4 text-black "
          /> */}

          <table className="min-w-full bg-white border">
            <thead>
              <tr className="border-b text-black">
                <th className="text-left p-2">Project Name</th>
                <th className="text-left p-2">Description</th>
                <th className="text-left p-2">Client Name</th>
                <th className="text-left p-2">Manager Name</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((project) => (
                <tr
                  key={project.id}
                  className="border-b hover:bg-gray-100 cursor-pointer"
                  onClick={() =>
                    (window.location.href = `/projects/${project.id}`)
                  }
                >
                  <td className="p-2 text-gray-700">{project.name}</td>
                  <td className="p-2 text-gray-700">{project.description}</td>
                  <td className="p-2 text-gray-700">{project.clientName}</td>
                  <td className="p-2 text-gray-700">{project.managerName}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <Button
            onClick={() => setShowModal(true)}
            className="mt-4 bg-black text-white w-28 ml-80"
          >
            Add Project
          </Button>

          {/* Popup Modal */}
          <ProjectFormModal
            open={showModal}
            onClose={() => setShowModal(false)}
            onProjectCreated={(newProject) => {
            setProjects((prev) => [...prev, newProject]);
            setShowModal(false);
            }}
          />
        </Card>
      </main>
    </div>
  );
}
