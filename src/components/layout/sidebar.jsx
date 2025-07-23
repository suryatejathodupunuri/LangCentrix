"use client";

import {
  Settings,
  HelpCircle,
  Users,
  PlusCircle,
  ChevronDown,
  ChevronUp,
  ListChecks,
  LayoutDashboard,
  ListTodo,
  Trash2,
  Building,
} from "lucide-react";
import clsx from "clsx";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useState } from "react";

const sidebarItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
];

export default function Sidebar({ isOpen }) {
  const { data: session } = useSession();
  const user = session?.user;
  const pathname = usePathname();
  const [showUserMenu, setShowUserMenu] = useState(false);

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
          "fixed z-40 top-0 left-0 h-full bg-white border-r border-gray-200 shadow-xl transition-all duration-300",
          isOpen ? "w-72" : "w-16"
        )}
      >
        {/* Menu Label */}
        {/* <div className="px-4 py-6 pt-20">
          {isOpen && (
            <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
              Main Menu
            </span>
          )}
        </div> */}

        {/* Navigation */}
        <nav className="flex-1 px-2 space-y-1 pt-24">
          {sidebarItems.map((item, index) => (
            <a
              key={index}
              href={item.href}
              className={clsx(
                "group relative flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200",
                pathname === item.href
                  ? "bg-gradient-to-r from-[#0F4C75] via-[#3282B8] to-[#0891B2] text-white shadow-lg shadow-gray-500/25"
                  : "text-slate-700 hover:bg-gray-100 hover:text-slate-800 hover:scale-105"
              )}
            >
              <item.icon className="h-5 w-5" />
              {isOpen && <span className="ml-3">{item.name}</span>}
              {!isOpen && (
                <div className="absolute left-16 top-1/2 -translate-y-1/2 bg-black text-white text-xs px-2 py-1 rounded-md whitespace-nowrap z-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  Dashboard
                </div>
              )}
            </a>
          ))}

          {/* Admin-only: Users Dropdown */}
          {user?.role === "Admin" && (
            <div>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className={clsx(
                  "group relative flex items-center w-full px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200",
                  isUsersSubMenuActive
                    ? "bg-gradient-to-r from-[#0F4C75] via-[#3282B8] to-[#0891B2] text-white shadow-lg shadow-gray-500/25"
                    : "text-slate-700 hover:bg-gray-100 hover:text-slate-800 hover:scale-105"
                )}
              >
                <Users className="h-5 w-5" />
                {isOpen && <span className="ml-3 flex-1 text-left">Users</span>}
                {isOpen &&
                  (showUserMenu ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  ))}
                  {!isOpen && (
                <div className="absolute left-16 top-1/2 -translate-y-1/2 bg-black text-white text-xs px-2 py-1 rounded-md whitespace-nowrap z-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  Users
                </div>
              )}
              </button>

              {showUserMenu && isOpen && (
                <div className="ml-8 space-y-1 mt-1">
                  <a
                    href="/manageusers"
                    className="text-slate-700 block px-3 py-2 text-sm rounded-lg hover:bg-gray-100"
                  >
                    Manage Users
                  </a>
                  <a
                    href="/approveusers"
                    className="text-slate-700 block px-3 py-2 text-sm rounded-lg hover:bg-gray-100"
                  >
                    Approve Users
                  </a>
                  <a
                    href="/UserCreation"
                    className="text-slate-700 block px-3 py-2 text-sm rounded-lg hover:bg-gray-100"
                  >
                    Create User
                  </a>
                </div>
              )}
            </div>
          )}

          {/* Clients - Only for Admin & Manager */}
          {(user?.role === "Admin" || user?.role === "Manager") && (
            <>
              <a
                href="/clients"
                className={clsx(
                  "group relative flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200",
                  pathname === "/clients"
                    ? "bg-gradient-to-r from-[#0F4C75] via-[#3282B8] to-[#0891B2] text-white shadow-lg shadow-gray-500/25"
                    : "text-slate-700 hover:bg-gray-100 hover:text-slate-800 hover:scale-105"
                )}
              >
                <Building className="w-5 h-5 text-muted-foreground" />
                {isOpen && <span className="ml-3">Clients</span>}
                {!isOpen && (
                <div className="absolute left-16 top-1/2 -translate-y-1/2 bg-black text-white text-xs px-2 py-1 rounded-md whitespace-nowrap z-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  Clients
                </div>
              )}
              </a>
              <a
                href="/TaskTable"
                className={clsx(
                  "group relative flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200",
                  pathname === "/TaskTable"
                    ? "bg-gradient-to-r from-[#0F4C75] via-[#3282B8] to-[#0891B2] text-white shadow-lg shadow-gray-500/25"
                    : "text-slate-700 hover:bg-gray-100 hover:text-slate-800 hover:scale-105"
                )}
              >
                <ListChecks className="h-5 w-5" />
                {isOpen && <span className="ml-3">My Tasks</span>}
                {!isOpen && (
                <div className="absolute left-16 top-1/2 -translate-y-1/2 bg-black text-white text-xs px-2 py-1 rounded-md whitespace-nowrap z-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  My Tasks
                </div>
              )}
              </a>
              <a
                href="/createtask"
                className={clsx(
                  "group relative flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200",
                  pathname === "/createtask"
                    ? "bg-gradient-to-r from-[#0F4C75] via-[#3282B8] to-[#0891B2] text-white shadow-lg shadow-gray-500/25"
                    : "text-slate-700 hover:bg-gray-100 hover:text-slate-800 hover:scale-105"
                )}
              >
                <PlusCircle className="h-5 w-5" />
                {isOpen && <span className="ml-3">Create Task</span>}
                {!isOpen && (
                <div className="absolute left-16 top-1/2 -translate-y-1/2 bg-black text-white text-xs px-2 py-1 rounded-md whitespace-nowrap z-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  Create Task
                </div>
              )}
              </a>
              <a
                href="/deleted-task"
                className={clsx(
                  "group relative flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200",
                  pathname === "/deleted-task"
                    ? "bg-gradient-to-r from-[#0F4C75] via-[#3282B8] to-[#0891B2] text-white shadow-lg shadow-gray-500/25"
                    : "text-slate-700 hover:bg-gray-100 hover:text-slate-800 hover:scale-105"
                )}
              >
                <Trash2 className="h-5 w-5" />
                {isOpen && <span className="ml-3">Deleted Task</span>}
                {!isOpen && (
                <div className="absolute left-16 top-1/2 -translate-y-1/2 bg-black text-white text-xs px-2 py-1 rounded-md whitespace-nowrap z-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  Deleted Task
                </div>
              )}
              </a>
            </>
          )}

          {/* Editor-only: Assigned Tasks */}
          {user?.role === "Editor" && (
            <a
              href="/EditorTask"
              className={clsx(
                "group relative flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200",
                pathname === "/EditorTask"
                  ? "bg-gradient-to-r from-[#0F4C75] via-[#3282B8] to-[#0891B2] text-white shadow-lg shadow-gray-500/25"
                  : "text-slate-700 hover:bg-gray-100 hover:text-slate-800 hover:scale-105"
              )}
            >
              <ListTodo className="h-5 w-5" />
              {isOpen && <span className="ml-3">Tasks</span>}
              {!isOpen && (
                <div className="absolute left-16 top-1/2 -translate-y-1/2 bg-black text-white text-xs px-2 py-1 rounded-md whitespace-nowrap z-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  Tasks
                </div>
              )}
            </a>
          )}
        </nav>

        {/* Empty Space */}
        <div className="p-4 m-4"></div>

        {/* Bottom Menu */}
        <div className="border-t border-gray-100 p-4 space-y-1">
          <a
            href="#"
            className={clsx(
              "group relative flex items-center text-slate-700 text-sm rounded-lg transition-colors duration-150",
              isOpen ? "px-3 py-2.5" : "justify-center p-1.5"
            )}
          >
            <Settings className="h-5 w-5 text-slate-700" />
            {isOpen && <span className="ml-3">Settings</span>}
            {!isOpen && (
                <div className="absolute left-16 top-1/2 -translate-y-1/2 bg-black text-white text-xs px-2 py-1 rounded-md whitespace-nowrap z-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  Settings
                </div>
              )}
          </a>
          <a
            href="#"
            className={clsx(
              "group relative flex items-center text-sm text-slate-700 rounded-lg transition-colors duration-150",
              isOpen ? "px-3 py-2.5" : "justify-center p-1.5"
            )}
          >
            <HelpCircle className="h-5 w-5 text-slate-700" />
            {isOpen && <span className="ml-3">Help & Support</span>}
            {!isOpen && (
                <div className="absolute left-16 top-1/2 -translate-y-1/2 bg-black text-white text-xs px-2 py-1 rounded-md whitespace-nowrap z-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  Help & Support
                </div>
              )}
          </a>
        </div>
      </aside>
    </>
  );
}
