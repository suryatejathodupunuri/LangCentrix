'use client';

import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/sidebar';
import clsx from "clsx";

export default function UserLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

 const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  const simulateAction = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="flex h-screen flex-col">
      
      {/* Navbar */}
      <Navbar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar isOpen={isSidebarOpen} />

        {/* Main content */}
        <main  className={clsx(
      "transition-all duration-300 bg-white",
      isSidebarOpen ? "ml-72" : "ml-16",
      "w-full p-6"
    )}>
      
          {children}
        </main>
      </div>
    </div>
  );
}
