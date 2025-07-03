"use client";

import React from "react";
import { useState } from "react";
import { Label } from "../../../components/ui/label";
import { Input } from "../../../components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "../../../components/ui/select";

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "undefined",
    acceptTerms: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Something went wrong");
    } else {
      alert(data.message);
      // Optional: redirect or clear form
    }
  } catch (err) {
    console.error(err);
    alert("Request failed");
  }
};

  return (
    <div className="flex  overflow-hidden bg-gray-100">
        {/* Page content */}
        <main className="w-full">
          <form
            onSubmit={handleSubmit}
            className="bg-white shadow-lg p-10 rounded-lg w-7xl max-w-5xl"
          >
            <h1 className="text-3xl font-bold text-black mb-8">Create User</h1>

            <div className="w-full max-w-md space-y-4">
              <div>
                <Label className="text-gray-400">Name</Label>
                <Input
                  name="name"
                  type="text"
                  placeholder="Enter your name"
                  onChange={handleChange}
                  value={form.name}
                  className="border rounded px-3 py-2 text-gray-700"
                  required
                />
              </div>

              <div>
                <Label className="text-gray-400">Email</Label>
                <Input
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  onChange={handleChange}
                  value={form.email}
                  className="border rounded px-3 py-2 text-gray-700"
                  required
                />
              </div>

              <div>
                <Label className="text-gray-400">Password</Label>
                <Input
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  onChange={handleChange}
                  value={form.password}
                  className="border rounded px-3 py-2 text-gray-700"
                  required
                />
              </div>

              <div>
                <Label className="text-gray-400">Retype Password</Label>
                <Input
                  name="confirmPassword"
                  type="password"
                  placeholder="Retype your password"
                  onChange={handleChange}
                  value={form.confirmPassword}
                  className="border rounded px-3 py-2 text-gray-700"
                  required
                />
              </div>
              <div>
                <Label className="text-gray-400">Role</Label>
                <Select
                  value={form.role}
                  onValueChange={(value) =>
                    setForm((prev) => ({ ...prev, role: value }))
                  }
                >
                  <SelectTrigger className="w-full border rounded px-3 py-2 text-gray-700">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Admin">Admin</SelectItem>
                    <SelectItem value="Manager">Manager</SelectItem>
                    <SelectItem value="Editor">Editor</SelectItem>
                    <SelectItem value="Reviewer">Reviewer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <button
                type="submit"
                className="w-full bg-black text-white py-2 rounded hover:bg-gray-800"
              >
                Create
              </button>
            </div>
          </form>
        </main>
      </div>
  );
}
