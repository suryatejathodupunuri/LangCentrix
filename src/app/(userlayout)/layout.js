'use client';

import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/sidebar';

export default function UserLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
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
      <Navbar toggleSidebar={toggleSidebar} />

      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar isOpen={isSidebarOpen} />

        {/* Main content */}
        <main className="flex-1 flex items-center justify-center bg-gray-50 p-6 pl-80">
          {children}
        </main>
      </div>
    </div>
  );
}
