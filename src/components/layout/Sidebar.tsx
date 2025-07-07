'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import { ChevronRight } from 'lucide-react';

// Sidebar navigation structure
const navigationSections = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    items: [],
  },
  {
    name: 'Claims',
    href: '/dashboard/claims',
    items: [],
  },
  {
    name: 'Documents',
    href: '/dashboard/documents',
    items: [],
  },
  {
    name: 'Assessments',
    href: '/dashboard/assessments',
    items: [],
  },
  {
    name: 'Settlements',
    href: '/dashboard/settlements',
    items: [],
  },
  // --- System Config ---
  {
    name: 'System Config',
    items: [
      {
        name: 'Insurers',
        href: '/dashboard/system-config/insurers',
      },
      {
        name: 'Claim Types',
        href: '/dashboard/system-config/claim-types',
      },
    ],
  },
  // --- User Management ---
  {
    name: 'User Management',
    items: [
      {
        name: 'Customers',
        href: '/dashboard/user-management/customers',
      },
      {
        name: 'Agents',
        href: '/dashboard/user-management/agents',
      },
      {
        name: 'Admins',
        href: '/dashboard/user-management/admins',
      },
      {
        name: 'Permissions',
        href: '/dashboard/user-management/permissions',
      },
    ],
  },
  // --- Reports ---
  {
    name: 'Reports',
    items: [
      {
        name: 'Claims Reports',
        href: '/dashboard/reports/claims',
      },
      {
        name: 'Performance Reports',
        href: '/dashboard/reports/performance',
      },
      {
        name: 'User Reports',
        href: '/dashboard/reports/users',
      },
      {
        name: 'System Reports',
        href: '/dashboard/reports/system',
      },
    ],
  },
  // --- Audit Logs ---
  {
    name: 'Audit Logs',
    items: [
      {
        name: 'Agent Activity',
        href: '/dashboard/audit-logs/agents',
      },
      {
        name: 'Admin Activity',
        href: '/dashboard/audit-logs/admins',
      },
    ],
  },
  // --- Admin/Settings ---
  {
    name: 'Admin',
    href: '/dashboard/admin',
    items: [],
  },
];

export function Sidebar({ collapsed = false }: { collapsed?: boolean }) {
  const [expandedSections, setExpandedSections] = React.useState<string[]>([]);
  const pathname = usePathname();

  const toggleSection = (sectionName: string) => {
    setExpandedSections(prev =>
      prev.includes(sectionName)
        ? prev.filter(name => name !== sectionName)
        : [...prev, sectionName]
    );
  };

  if (collapsed) {
    // When collapsed, render only an empty nav (no items, no text)
    return <nav className="h-full w-full bg-white border-r flex flex-col" />;
  }

  return (
    <nav className="h-full w-full bg-white border-r flex flex-col">
      <div className="flex flex-col gap-2 p-4">
        {navigationSections.map((section) => {
          const hasSubmenu = section.items && section.items.length > 0;
          const isExpanded = expandedSections.includes(section.name);
          return (
            <div key={section.name}>
              <div className="flex items-center">
                <Link
                  href={section.href || '#'}
                  className={`py-2 px-3 rounded hover:bg-gray-100 font-medium flex-1${pathname === section.href ? ' bg-primary text-primary-foreground' : ''}`}
                  onClick={() => hasSubmenu ? toggleSection(section.name) : undefined}
                >
                  {section.name}
                </Link>
                {/* Only show chevron if there is a submenu */}
                {hasSubmenu && (
                  <button
                    onClick={() => toggleSection(section.name)}
                    className="ml-2 focus:outline-none"
                  >
                    <ChevronRight size={16} className={`text-gray-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                  </button>
                )}
              </div>
              {hasSubmenu && isExpanded && (
                <div className="ml-7 mt-1 flex flex-col gap-1">
                  {section.items.map((item) => (
                    <Link key={item.name} href={item.href} className={`py-1 px-2 rounded hover:bg-gray-50 text-sm${pathname === item.href ? ' bg-primary text-primary-foreground' : ''}`}>
                      {item.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </nav>
  );
} 