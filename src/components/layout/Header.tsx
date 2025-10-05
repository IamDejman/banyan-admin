'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Menu, Search, User } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { useAuth } from '@/lib/providers/auth-provider';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Workflow section mapping for breadcrumbs
const workflowSections = {
  '/dashboard/claims': { section: 'Claims Review', page: 'All Claims' },
  '/dashboard/documents': { section: 'Document Management', page: 'Document Library' },
  '/dashboard/documents/upload': { section: 'Document Management', page: 'Upload Documents' },
  '/dashboard/assessments': { section: 'Assessment & Valuation', page: 'Assessments' },
  '/dashboard/assessments/requests': { section: 'Assessment & Valuation', page: 'Assessment Requests' },
  '/dashboard/settlements': { section: 'Settlement Management', page: 'Settlements' },
  '/dashboard/settlements/new': { section: 'Settlement Management', page: 'New Settlement' },
  '/dashboard/settlements/responses': { section: 'Settlement Management', page: 'Settlement Responses' },
  '/dashboard/admin': { section: 'Administration', page: 'User Management' },
};

export function Header() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const currentSection = workflowSections[pathname as keyof typeof workflowSections];
  const isDashboard = pathname === '/dashboard';

  return (
    <>
      <header className="bg-white border-b px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu size={20} />
            </Button>

            {/* Breadcrumbs */}
            <div className="hidden md:flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Dashboard</span>
              {!isDashboard && currentSection && (
                <>
                  <span className="text-muted-foreground">/</span>
                  <span className="text-primary font-medium">{currentSection.section}</span>
                  <span className="text-muted-foreground">/</span>
                  <span className="text-foreground">{currentSection.page}</span>
                </>
              )}
              {!isDashboard && !currentSection && (
                <>
                  <span className="text-muted-foreground">/</span>
                  <span className="text-foreground">Page</span>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="hidden md:flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2">
              <Search size={16} className="text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by client name or claim ID..."
                className="bg-transparent border-none outline-none text-sm w-64"
              />
            </div>

            {/* User Menu */}
            <div className="flex items-center gap-2">
              <div className="hidden md:block text-right">
                <p className="text-sm font-medium">{user?.name}</p>
                <p className="text-xs text-muted-foreground">{user?.role}</p>
              </div>
              <Button variant="ghost" size="icon">
                <User size={20} />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsSidebarOpen(false)} />
          <div className="fixed left-0 top-0 h-full w-64 bg-white">
            <Sidebar />
          </div>
        </div>
      )}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <User className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem>Settings</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => logout()}>
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
} 