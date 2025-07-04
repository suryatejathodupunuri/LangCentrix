"use client";

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
    role: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
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
        showNotification(data.error || "Something went wrong", false);
      } else {
        showNotification(data.message, true);
        setForm({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
          role: "",
        });
      }
    } catch (err) {
      console.error(err);
      showNotification("Request failed", false);
    }
  };

  const showNotification = (message, isSuccess) => {
    const notification = document.createElement("div");
    notification.className = `fixed top-20 right-4 bg-black text-white px-4 py-2 rounded-md shadow-lg flex items-center animate-fade-in z-50 border ${
      isSuccess ? "border-gray-200" : "border-gray-200"
    }`;
    notification.innerHTML = `
      <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${
          isSuccess ? "M5 13l4 4L19 7" : "M6 18L18 6M6 6l12 12"
        }"></path>
      </svg>
      ${message}
    `;
    document.body.appendChild(notification);
    setTimeout(() => {
      notification.classList.remove("animate-fade-in");
      notification.classList.add("animate-fade-out");
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  };

  return (
    <div className="flex-1 px-16 py-10 ml-56 mt-20 bg-white text-black">
      <div className="max-w-2xl">
        <h1 className="text-2xl font-semibold mb-2">Create New User</h1>
        <p className="text-sm text-gray-600 mb-8">Add a new user to the system</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label className="text-sm font-medium">Full Name</Label>
            <Input
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              className="w-full mt-1 border border-black text-black bg-white focus:ring-black focus:border-black"
              required
            />
          </div>

          <div>
            <Label className="text-sm font-medium">Email</Label>
            <Input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="w-full mt-1 border border-black text-black bg-white focus:ring-black focus:border-black"
              required
            />
          </div>

          <div>
            <Label className="text-sm font-medium">Password</Label>
            <div className="relative">
              <Input
                name="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
                className="w-full mt-1 border border-black text-black bg-white focus:ring-black focus:border-black pr-10"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-black"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium">Confirm Password</Label>
            <div className="relative">
              <Input
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={form.confirmPassword}
                onChange={handleChange}
                className="w-full mt-1 border border-black text-black bg-white focus:ring-black focus:border-black pr-10"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-black"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium">Role</Label>
            <Select
              value={form.role}
              onValueChange={(value) => setForm({ ...form, role: value })}
            >
              <SelectTrigger className="w-full mt-1 border border-black text-black bg-white focus:ring-black focus:border-black">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-black text-black">
                <SelectItem value="Admin">Admin</SelectItem>
                <SelectItem value="Manager">Manager</SelectItem>
                <SelectItem value="Editor">Editor</SelectItem>
                <SelectItem value="Reviewer">Reviewer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-900 transition"
            >
              Create User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Icons
const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const EyeOffIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
  </svg>
);
