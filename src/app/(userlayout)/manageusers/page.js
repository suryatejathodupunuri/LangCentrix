"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState, useRef } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function ManageUsersPage() {
  const { data: session, status } = useSession();
  const user = session?.user;

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchField, setSearchField] = useState("name"); // 'name', 'email', or 'role'
  const [processing, setProcessing] = useState(false);
  const searchInputRef = useRef(null);

  const roles = ["Manager", "Editor", "Reviewer"]; // Admin not editable

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch("/api/users");
        const data = await res.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);

  const handleUserUpdate = async (userId, updatedUser) => {
    setProcessing(true);
    try {
      const res = await fetch(`/api/users/${userId}/role`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedUser),
      });

      if (!res.ok) throw new Error("Update failed");

      const updated = await res.json();

      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId
            ? { ...u, ...updated, updatedRole: undefined, password: "" }
            : u
        )
      );

      // Toast notification
      showNotification("User updated successfully", true);
    } catch (err) {
      console.error(err);
      showNotification("Error updating user", false);
    } finally {
      setProcessing(false);
    }
  };

  const handleUserDelete = async (userId) => {
    if (
      !confirm(
        "Are you sure you want to delete this user? This action cannot be undone."
      )
    ) {
      return;
    }

    setProcessing(true);
    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Delete failed");

      setUsers((prev) => prev.filter((u) => u.id !== userId));
      showNotification("User deleted successfully", true);
    } catch (err) {
      console.error(err);
      showNotification("Error deleting user", false);
    } finally {
      setProcessing(false);
    }
  };

  const showNotification = (message, isSuccess) => {
    const notification = document.createElement("div");
    notification.className = `fixed top-20 right-4 ${
      isSuccess ? "bg-green-600" : "bg-red-600"
    } text-white px-4 py-2 rounded-md shadow-lg flex items-center animate-fade-in z-50 border border-gray-200`;
    notification.innerHTML = `
      <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
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

  const clearSearch = () => {
    setSearchTerm("");
    searchInputRef.current.focus();
  };

  const togglePasswordVisibility = (e) => {
    const input = e.currentTarget.previousElementSibling;
    const type =
      input.getAttribute("type") === "password" ? "text" : "password";
    input.setAttribute("type", type);
    e.currentTarget.querySelector("svg").classList.toggle("text-gray-400");
    e.currentTarget.querySelector("svg").classList.toggle("text-gray-600");
  };

  if (status === "loading" || loading)
    return (
      <div className="flex items-center justify-center h-[calc(100vh-64px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-400"></div>
      </div>
    );

  if (!user || user.role?.toLowerCase() !== "admin")
    return (
      <div className="flex items-center justify-center h-[calc(100vh-64px)]">
        <div className="bg-white border border-gray-300 text-gray-800 px-6 py-4 rounded-md shadow-sm max-w-md">
          <strong className="font-bold">Access Denied</strong>
          <span className="block mt-1">
            You don't have permission to view this page.
          </span>
        </div>
      </div>
    );

  const filteredUsers = (userList) => {
    return userList.filter((u) => {
      if (!searchTerm) return true;
      const value = u[searchField]?.toString().toLowerCase() || "";
      return value.includes(searchTerm.toLowerCase());
    });
  };

  const shouldShowTable = (roleKey) => {
    if (!searchTerm) return true;
    const filtered = users.filter(
      (u) => u.role?.toLowerCase() === roleKey.toLowerCase()
    );
    return filteredUsers(filtered).length > 0;
  };

  const renderTable = (title, roleKey) => {
    const filtered = users.filter(
      (u) => u.role?.toLowerCase() === roleKey.toLowerCase()
    );
    const displayedUsers = filteredUsers(filtered);

    if (!shouldShowTable(roleKey)) return null;

    return (
      <div className="mb-12">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            {title}{" "}
            <span className="text-gray-500 font-normal">
              ({displayedUsers.length})
            </span>
          </h2>
        </div>
        {displayedUsers.length === 0 ? (
          <div className="bg-white rounded-lg p-6 text-center text-gray-500 border border-gray-200 shadow-sm">
            No {title.toLowerCase()} match your search criteria
          </div>
        ) : (
          <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-sm">
            <Table className="w-full">
              <TableHeader className="bg-gradient-to-r from-[#0F4C75] via-[#3282B8] to-[#0891B2] text-white text-center uppercase font-semibold">
                <TableRow>
                  <TableHead className="px-16 py-4 text-white">User</TableHead>
                  <TableHead className="px-6 py-4 text-white">Email</TableHead>
                  <TableHead className="px-6 py-4 text-white">Status</TableHead>
                  <TableHead className="px-6 py-4 text-white">
                    Last Login
                  </TableHead>
                  <TableHead className="px-10 py-4 text-white">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayedUsers.map((u) => (
                  <TableRow key={u.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-r from-[#0F4C75] via-[#3282B8] to-[#0891B2] rounded-full flex items-center justify-center text-white font-semibold border border-gray-200">
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="ml-4">
                          <div className="flex items-center">
                            <input
                              type="text"
                              value={u.name}
                              onChange={(e) =>
                                setUsers((prev) =>
                                  prev.map((usr) =>
                                    usr.id === u.id
                                      ? { ...usr, name: e.target.value }
                                      : usr
                                  )
                                )
                              }
                              className={`text-sm font-medium text-gray-900 bg-transparent border-b ${
                                roleKey === "Admin"
                                  ? "border-transparent"
                                  : "border-gray-200"
                              } focus:outline-none focus:border-black`}
                              readOnly={roleKey === "Admin"}
                            />
                            {roleKey !== "Admin" && (
                              <button className="ml-2 text-gray-500 hover:text-black">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-4 w-4"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                                  />
                                </svg>
                              </button>
                            )}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {u.role}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <input
                          type="email"
                          value={u.email}
                          onChange={(e) =>
                            setUsers((prev) =>
                              prev.map((usr) =>
                                usr.id === u.id
                                  ? { ...usr, email: e.target.value }
                                  : usr
                              )
                            )
                          }
                          className={`text-sm text-gray-900 bg-transparent border-b ${
                            roleKey === "Admin"
                              ? "border-transparent"
                              : "border-gray-200"
                          } focus:outline-none focus:border-black`}
                          readOnly={roleKey === "Admin"}
                        />
                        {roleKey !== "Admin" && (
                          <button className="ml-2 text-gray-500 hover:text-black">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                              />
                            </svg>
                          </button>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          u.isActive
                            ? "bg-gray-100 text-green-400 border border-green-400"
                            : "bg-gray-100 text-gray-500 border border-gray-200"
                        }`}
                      >
                        <div className="w-2 h-2 mt-1.5 mr-1 bg-green-400 rounded-full animate-pulse"></div>
                        {u.isActive ? "Active" : "Inactive"}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {u.lastLogin
                        ? new Date(u.lastLogin).toLocaleString()
                        : "Never"}
                    </TableCell>
                    <TableCell className="text-sm font-medium px-10">
                      {u.role === "Admin" ? (
                        <span className="text-gray-400 text-xs">
                          Fixed role
                        </span>
                      ) : (
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <select
                              className="text-gray-800 border border-gray-200 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-black w-full"
                              value={u.updatedRole || u.role}
                              onChange={(e) => {
                                const newRole = e.target.value;
                                setUsers((prev) =>
                                  prev.map((usr) =>
                                    usr.id === u.id
                                      ? { ...usr, updatedRole: newRole }
                                      : usr
                                  )
                                );
                              }}
                            >
                              {roles.map((r) => (
                                <option key={r} value={r}>
                                  {r}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="relative flex items-center">
                            <input
                              type="password"
                              placeholder="New Password"
                              value={u.password || ""}
                              onChange={(e) =>
                                setUsers((prev) =>
                                  prev.map((usr) =>
                                    usr.id === u.id
                                      ? { ...usr, password: e.target.value }
                                      : usr
                                  )
                                )
                              }
                              className="text-gray-800 border border-gray-200 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-black w-full"
                            />
                            <button
                              onClick={togglePasswordVisibility}
                              className="absolute right-2 text-gray-400 hover:text-gray-600 focus:outline-none"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                />
                              </svg>
                            </button>
                          </div>
                          <button
                            onClick={() =>
                              handleUserUpdate(u.id, {
                                name: u.name,
                                email: u.email,
                                role: u.updatedRole || u.role,
                                ...(u.password && { password: u.password }),
                              })
                            }
                            disabled={processing}
                            className={`bg-gradient-to-r from-[#0891B2] to-[#0F4C75] text-white px-3 py-1.5 rounded-md text-sm transition-colors duration-200 shadow-sm flex items-center justify-center ${
                              processing ? "opacity-70 cursor-not-allowed" : ""
                            }`}
                          >
                            {processing ? (
                              <>
                                <svg
                                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                >
                                  <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                  ></circle>
                                  <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                  ></path>
                                </svg>
                                Saving...
                              </>
                            ) : (
                              "Save Changes"
                            )}
                          </button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-6 max-w-7xl mx-auto mt-16">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
        <p className="text-gray-600 mt-1">Manage user roles and permissions</p>

        {/* Search Bar */}
        <div className="mt-6 mb-8 bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search users..."
                className="block w-full pl-10 pr-10 py-2 border border-gray-200 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-black sm:text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  <svg
                    className="h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              )}
            </div>
            <div className="flex-shrink-0">
              <select
                className="text-gray-500 block w-full pl-3 pr-10 py-2 text-base border border-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-black sm:text-sm rounded-md"
                value={searchField}
                onChange={(e) => setSearchField(e.target.value)}
              >
                <option value="name">Search by Name</option>
                <option value="email">Search by Email</option>
                <option value="role">Search by Role</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {shouldShowTable("Admin") && renderTable("Admins", "Admin")}
      {shouldShowTable("Manager") && renderTable("Managers", "Manager")}
      {shouldShowTable("Editor") && renderTable("Editors", "Editor")}
      {shouldShowTable("Reviewer") && renderTable("Reviewers", "Reviewer")}

      {searchTerm &&
        !shouldShowTable("Admin") &&
        !shouldShowTable("Manager") &&
        !shouldShowTable("Editor") &&
        !shouldShowTable("Reviewer") && (
          <div className="bg-white rounded-lg p-8 text-center border border-gray-200 shadow-sm">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No users found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search criteria
            </p>
          </div>
        )}

      <style jsx global>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fade-out {
          from {
            opacity: 1;
            transform: translateY(0);
          }
          to {
            opacity: 0;
            transform: translateY(10px);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
        .animate-fade-out {
          animation: fade-out 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
