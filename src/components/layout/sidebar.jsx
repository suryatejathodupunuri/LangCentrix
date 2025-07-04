"use client";

import {
  Settings,
  HelpCircle,
  Users,
  PlusCircle,
  ChevronDown,
  ChevronUp,
  Briefcase,
  ListChecks,
  LayoutDashboard,
  ListTodo
} from "lucide-react";
import clsx from "clsx";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useState } from "react";

const sidebarItems = [
  { name: "Dashboard", href: "/dashboard", icon: <LayoutDashboard className="h-4 w-4 mr-3" /> },
];

export default function Sidebar({ isOpen }) {
  const { data: session } = useSession();
  const user = session?.user;
  const pathname = usePathname();
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Check if current path is under users dropdown
  const isUsersSubMenuActive = 
    pathname === "/manageusers" || 
    pathname === "/approveusers" || 
    pathname === "/UserCreation";

  return (
    <>
      {/* Overlay for mobile */}
      <div
        className={clsx(
          "fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity duration-300 lg:hidden",
          {
            "opacity-0 pointer-events-none": !isOpen,
            "opacity-100": isOpen,
          }
        )}
      />

      {/* Sidebar */}
      <aside
        className={clsx(
          "fixed z-40 top-0 left-0 h-full w-72 bg-white border-r border-gray-200 shadow-xl transform transition-transform duration-300",
          "lg:transform-none lg:translate-x-0",
          {
            "-translate-x-full lg:translate-x-0": !isOpen,
            "translate-x-0": isOpen,
          }
        )}
      >
        {/* Menu Label */}
        <div className="px-6 py-6 pt-12">
          <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
            Main Menu
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-1">
          {sidebarItems.map((item, index) => (
            <a
              key={index}
              href={item.href}
              className={clsx(
                "flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200",
                pathname === item.href
                  ? "bg-gradient-to-r from-black to-gray-800 text-white shadow-lg shadow-gray-500/25"
                  : "text-slate-700 hover:bg-gray-100 hover:text-slate-800 hover:scale-105"
              )}
            >
              {item.icon}
              <span className="flex-1">{item.name}</span>
            </a>
          ))}

          {/* Admin-only: Users Dropdown */}
          {user?.role === "Admin" && (
            <div>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className={clsx(
                  "flex items-center w-full px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200",
                  isUsersSubMenuActive
                    ? "bg-gradient-to-r from-black to-gray-800 text-white shadow-lg shadow-gray-500/25"
                    : "text-slate-700 hover:bg-gray-100 hover:text-slate-800 hover:scale-105"
                )}
              >
                <Users className="h-4 w-4 mr-3" />
                <span className="flex-1 text-left">Users</span>
                {showUserMenu ? (
                  <ChevronUp className="h-4 w-4 text-slate-500" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-slate-500" />
                )}
              </button>

              {showUserMenu && (
                <div className="ml-8 space-y-1 mt-1">
                  <a
                    href="/manageusers"
                    className={clsx(
                      "block px-3 py-2 text-sm rounded-lg transition-all duration-150",
                      pathname === "/manageusers"
                        ? "bg-gray-800 text-white"
                        : "text-slate-700 hover:bg-gray-100 hover:text-slate-800"
                    )}
                  >
                    Manage Users
                  </a>
                  <a
                    href="/approveusers"
                    className={clsx(
                      "block px-3 py-2 text-sm rounded-lg transition-all duration-150",
                      pathname === "/approveusers"
                        ? "bg-gray-800 text-white"
                        : "text-slate-700 hover:bg-gray-100 hover:text-slate-800"
                    )}
                  >
                    Approve Users
                  </a>
                  <a
                    href="/UserCreation"
                    className={clsx(
                      "block px-3 py-2 text-sm rounded-lg transition-all duration-150",
                      pathname === "/UserCreation"
                        ? "bg-gray-800 text-white"
                        : "text-slate-700 hover:bg-gray-100 hover:text-slate-800"
                    )}
                  >
                    Create User
                  </a>
                </div>
              )}
            </div>
          )}

          {/* Projects - Only for Admin & Manager */}
          {(user?.role === "Admin" || user?.role === "Manager") && (
            <a
              href="/Projects"
              className={clsx(
                "flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200",
                pathname === "/Projects"
                  ? "bg-gradient-to-r from-black to-gray-800 text-white shadow-lg shadow-gray-500/25"
                  : "text-slate-700 hover:bg-gray-100 hover:text-slate-800 hover:scale-105"
              )}
            >
              <Briefcase className="h-4 w-4 mr-3" />
              <span className="flex-1">Projects</span>
            </a>
          )}

          {/* My Tasks - Only for Admin & Manager */}
          {(user?.role === "Admin" || user?.role === "Manager") && (
            <a
              href="/TaskTable"
              className={clsx(
                "flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200",
                pathname === "/TaskTable"
                  ? "bg-gradient-to-r from-black to-gray-800 text-white shadow-lg shadow-gray-500/25"
                  : "text-slate-700 hover:bg-gray-100 hover:text-slate-800 hover:scale-105"
              )}
            >
              <ListChecks className="h-4 w-4 mr-3" />
              <span className="flex-1">My Tasks</span>
            </a>
          )}

          {/* Manager & Admin only: Create Task */}
          {(user?.role === "Manager" || user?.role === "Admin") && (
            <a
              href="/createtask"
              className={clsx(
                "flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200",
                pathname === "/createtask"
                  ? "bg-gradient-to-r from-black to-gray-800 text-white shadow-lg shadow-gray-500/25"
                  : "text-slate-700 hover:bg-gray-100 hover:text-slate-800 hover:scale-105"
              )}
            >
              <PlusCircle className="h-4 w-4 mr-3" />
              <span className="flex-1">Create Task</span>
            </a>
          )}

          {/* Editor-only: Assigned Tasks */}
          {user?.role === "Editor" && (
            <a
              href="/EditorTask"
              className={clsx(
                "flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200",
                pathname === "/EditorTask"
                  ? "bg-gradient-to-r from-black to-gray-800 text-white shadow-lg shadow-gray-500/25"
                  : "text-slate-700 hover:bg-gray-100 hover:text-slate-800 hover:scale-105"
              )}
            >
              <ListTodo className="h-4 w-4 mr-3" />
              <span className="flex-1">Tasks</span>
            </a>
          )}
        </nav>

        {/* Empty Space */}
        <div className="p-4 m-4"></div>

        {/* Bottom Menu */}
        <div className="border-t border-gray-100 p-4 space-y-1">
          <a
            href="#"
            className="flex items-center px-3 py-2.5 text-sm text-slate-700 rounded-lg hover:bg-gray-100 transition-colors duration-150"
          >
            <Settings className="h-4 w-4 mr-3 text-slate-500" />
            Settings
          </a>
          <a
            href="#"
            className="flex items-center px-3 py-2.5 text-sm text-slate-700 rounded-lg hover:bg-gray-100 transition-colors duration-150"
          >
            <HelpCircle className="h-4 w-4 mr-3 text-slate-500" />
            Help & Support
          </a>
        </div>
      </aside>
    </>
  );
}