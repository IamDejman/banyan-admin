'use client';

import { ReactNode } from 'react';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <div className="w-64 bg-white shadow-sm">
          {/* Sidebar content */}
          <nav className="p-4">
            <ul>
              <li className="mb-2">
                <a href="/dashboard" className="block p-2 hover:bg-gray-100 rounded">
                  Dashboard
                </a>
              </li>
              <li className="mb-2">
                <a href="/dashboard/claims" className="block p-2 hover:bg-gray-100 rounded">
                  Claims
                </a>
              </li>
            </ul>
          </nav>
        </div>
        <div className="flex-1">
          <header className="bg-white shadow-sm">
            <div className="px-6 py-4">
              <h1 className="text-xl font-semibold">Claims Management</h1>
            </div>
          </header>
          <main className="p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
} 