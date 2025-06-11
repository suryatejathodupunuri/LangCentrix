'use client';

import { Settings, HelpCircle } from 'lucide-react';
import clsx from 'clsx';

const sidebarItems = [
  { name: 'Dashboard', href: '/dashboard', isActive: true },
  { name: 'My Tasks', href: '#', isActive: false },
  { name: 'My Planner', href: '#', isActive: false },
  { name: 'Documents', href: '#', isActive: false },
  { name: 'Reviews', href: '#', isActive: false },
  { name: 'Deadlines', href: '#',  isActive: false },
];

export default function Sidebar({ isOpen }) {
  return (
    <>
      {/* Overlay for mobile screens */}
      <div
        className={clsx(
          'fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity duration-300 lg:hidden',
          {
            'opacity-0 pointer-events-none': !isOpen,
            'opacity-100': isOpen,
          }
        )}
      />

      {/* Sidebar Panel */}
      <aside
        className={clsx(
          'fixed z-40 top-0 left-0 h-full w-72 bg-white border-r border-gray-200 shadow-xl transform transition-transform duration-300',
          'lg:transform-none lg:translate-x-0',
          {
            '-translate-x-full lg:translate-x-0': !isOpen,
            'translate-x-0': isOpen,
          }
        )}
      >
        {/* Menu Label */}
        <div className="px-6 py-6 pt-12">
          <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
            Main Menu
          </span>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 space-y-1">
          {sidebarItems.map((item, index) => (
            <a
              key={index}
              href={item.href}
              className={clsx(
                'flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200',
                {
                  'bg-gradient-to-r from-black to-gray-800 text-white shadow-lg shadow-gray-500/25': item.isActive,
                  'text-slate-700 hover:bg-gray-100 hover:text-slate-800 hover:scale-105': !item.isActive,
                }
              )}
            >
              <span className="text-lg mr-3">{item.icon}</span>
              <span className="flex-1">{item.name}</span>
            </a>
          ))}
        </nav>

        {/* Empty Space (replaced Upgrade Section) */}
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