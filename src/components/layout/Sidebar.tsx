'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/lib/store/auth-store';
import {
  LayoutDashboard,
  FileText,
  FileCheck,
  MessageSquare,
  DollarSign,
  Settings,
  Users,
  BarChart,
  ChevronLeft,
  ChevronRight,
  User,
  X,
  CheckSquare,
} from 'lucide-react';
import { useAuth } from '@/lib/providers/auth-provider';
import { Button } from '@/components/ui/button';

const navigationItems = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    roles: ['CLAIMS_AGENT', 'MANAGER', 'FINANCIAL_OFFICER'],
  },
  {
    name: 'Claims',
    href: '/dashboard/claims',
    icon: FileText,
    roles: ['CLAIMS_AGENT', 'MANAGER', 'FINANCIAL_OFFICER'],
  },
  {
    name: 'Documents',
    href: '/dashboard/documents',
    icon: FileCheck,
    roles: ['CLAIMS_AGENT', 'MANAGER'],
  },
  {
    name: 'Communications',
    href: '/dashboard/communications',
    icon: MessageSquare,
    roles: ['CLAIMS_AGENT', 'MANAGER'],
  },
  {
    name: 'Settlements',
    href: '/dashboard/settlements',
    icon: DollarSign,
    roles: ['MANAGER', 'FINANCIAL_OFFICER'],
  },
  {
    name: 'Workflows',
    href: '/dashboard/workflows',
    icon: CheckSquare,
    roles: ['CLAIMS_AGENT', 'MANAGER', 'FINANCIAL_OFFICER'],
  },
  {
    name: 'Agents',
    href: '/dashboard/agents',
    icon: Users,
    roles: ['MANAGER'],
  },
  {
    name: 'Reports',
    href: '/dashboard/reports',
    icon: BarChart,
    roles: ['MANAGER', 'FINANCIAL_OFFICER'],
  },
  {
    name: 'Admin',
    href: '/dashboard/admin',
    icon: Settings,
    roles: ['MANAGER', 'FINANCIAL_OFFICER'],
  },
  {
    name: 'Settings',
    href: '/dashboard/settings',
    icon: Settings,
    roles: ['CLAIMS_AGENT', 'MANAGER', 'FINANCIAL_OFFICER'],
    subItems: [
      {
        name: 'General',
        href: '/dashboard/settings',
      },
      {
        name: 'Security',
        href: '/dashboard/security/settings',
      },
      {
        name: 'Company',
        href: '/dashboard/security/company',
      },
    ],
  },
];

interface SidebarProps {
  onClose?: () => void;
}

export function Sidebar({ onClose }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const { user } = useAuth();

  const filteredNavigation = navigationItems.filter((item) =>
    item.roles.includes(user?.role || '')
  );

  // Find the best match (longest href that matches the pathname)
  let bestMatchHref = '';
  filteredNavigation.forEach((item) => {
    if (
      pathname === item.href ||
      (item.href !== '/dashboard' && pathname.startsWith(item.href + '/'))
    ) {
      if (item.href.length > bestMatchHref.length) {
        bestMatchHref = item.href;
      }
    }
  });

  return (
    <aside
      className={cn(
        'flex flex-col h-screen bg-white border-r transition-all duration-300',
        isCollapsed ? 'w-20' : 'w-64'
      )}
    >
      <div className="flex items-center justify-between p-4 border-b">
        {!isCollapsed && <h1 className="text-xl font-bold">Banyan Admin</h1>}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg hover:bg-gray-100 hidden md:block"
          >
            {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
          {onClose && (
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={onClose}
            >
              <X size={20} />
            </Button>
          )}
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {filteredNavigation.map((item) => {
          const isActive = item.href === bestMatchHref;
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onClose}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-gray-100'
              )}
            >
              <item.icon size={20} />
              {!isCollapsed && <span>{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      {!isCollapsed && user && (
        <div className="p-4 border-t">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
              <User size={16} />
            </div>
            <div>
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-gray-500">{user.role}</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
} 