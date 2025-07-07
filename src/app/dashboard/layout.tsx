'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Menu, LogOut } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  // Always use mock admin name
  const adminName = 'Jane Doe';

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Navbar */}
      <nav className="w-full h-14 flex items-center justify-between bg-white border-b px-4 fixed top-0 left-0 z-50">
        <div className="flex items-center gap-3">
          <button
            className="p-2 rounded hover:bg-gray-100"
            onClick={() => setIsSidebarOpen((open) => !open)}
            aria-label={isSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            <Menu size={24} />
          </button>
          <span className="font-bold text-lg tracking-tight">Banyan Admin</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="font-medium text-sm">{adminName}</span>
          <button
            className="p-2 rounded hover:bg-gray-100"
            onClick={() => { /* mock logout */ }}
            aria-label="Logout"
          >
            <LogOut size={20} />
          </button>
        </div>
      </nav>
      <div className="flex flex-1 pt-14">
        {/* Sidebar */}
        <div className={`transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-20'} flex-shrink-0 relative`}>
          <Sidebar collapsed={!isSidebarOpen} />
        </div>
        {/* Main Content */}
        <div className="flex-1">
          <main className="p-6">{children}</main>
        </div>
      </div>
    </div>
  );
} 