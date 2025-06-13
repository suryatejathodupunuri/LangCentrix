"use client";

import { useState } from "react";
import { User, ChevronDown, LogOut, Menu } from "lucide-react";
import { signOut } from "next-auth/react";
import CONFIG from '../../../config.js';

export default function Navbar({ toggleSidebar }) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const userData = {
    name: "John Anderson",
    email: "john.anderson@company.com",
    role: "Project Manager",
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await signOut({ callbackUrl: '/login' }); // ✅ Uses NextAuth logout with redirect
    } catch (error) {
      console.error("Logout error:", error);
      setIsLoggingOut(false);
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm fixed w-full z-50">
      <div className="flex items-center justify-between h-20 px-6">
        {/* Left Section */}
        <div className="flex items-center space-x-5">
          {/* Sidebar Toggle */}
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-3 rounded-xl hover:bg-gray-100 transition-all duration-200 hover:scale-105 hover:shadow-md"
          >
            <Menu className="h-7 w-7 text-gray-700" />
          </button>

          {/* Brand Name */}
          <h2 className="text-2xl font-bold text-blue-400 tracking-tight">
            {CONFIG.APP_NAME}
          </h2>
        </div>

        {/* Right Section - Profile Only */}
        <div className="relative">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center space-x-4 p-3 rounded-xl hover:bg-gray-50 transition-all duration-200 hover:shadow-lg border border-transparent hover:border-gray-200"
            disabled={isLoggingOut}
          >
            <div className="w-11 h-11 bg-gradient-to-br from-black to-gray-800 rounded-full flex items-center justify-center shadow-lg ring-2 ring-gray-300">
              <User className="h-5 w-5 text-white" />
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-semibold text-slate-800">{userData.name}</p>
              <p className="text-xs text-slate-600 font-medium">{userData.role}</p>
            </div>
            <ChevronDown className={`h-5 w-5 text-slate-500 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Profile Dropdown Menu */}
          {isProfileOpen && (
            <div className="absolute top-full right-0 mt-3 w-80 bg-white border border-gray-200 rounded-2xl shadow-2xl z-50 overflow-hidden">
              {/* Profile Header */}
              <div className="p-5 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-100">
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-black to-gray-800 rounded-full flex items-center justify-center shadow-lg ring-3 ring-gray-300">
                    <User className="h-7 w-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-800">{userData.name}</h3>
                    <p className="text-sm text-slate-600 font-medium">{userData.email}</p>
                    <span className="inline-block px-3 py-1.5 mt-2 text-xs bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 rounded-full font-semibold shadow-sm">
                      {userData.role}
                    </span>
                  </div>
                </div>
              </div>

              {/* Logout Section */}
              <div className="border-t border-gray-100 p-3">
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-all duration-150 disabled:opacity-50 hover:shadow-md"
                >
                  <LogOut className="h-5 w-5" />
                  <span>{isLoggingOut ? 'Signing Out...' : 'Sign Out'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Overlay to close profile dropdown */}
      {isProfileOpen && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setIsProfileOpen(false)}
        />
      )}
    </nav>
  );
}
