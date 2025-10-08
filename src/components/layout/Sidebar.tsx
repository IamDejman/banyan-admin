'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import { ChevronRight } from 'lucide-react';

// Sidebar navigation structure
const navigationSections = [
  {
    name: 'Claims Management',
    items: [
      {
        name: 'Claims',
        href: '/dashboard/claims',
      },
      {
        name: 'Assign Claims',
        href: '/dashboard/admin',
      },
      {
        name: 'Documents',
        href: '/dashboard/documents',
      },
    ],
  },
  // {
  //   name: 'Assessments',
  //   href: '/dashboard/assessments',
  //   items: [],
  // },
  {
    name: 'Settlements',
    items: [
      {
        name: 'Create Offers',
        href: '/dashboard/settlements/create-offers',
      },
      {
        name: 'Approve Offers',
        href: '/dashboard/settlements/approve-offers',
      },
      {
        name: 'Manage Offers',
        href: '/dashboard/settlements/manage-offers',
      },
    ],
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
      {
        name: 'Payment Configurations',
        href: '/dashboard/system-config/payment-configurations',
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
    href: '/dashboard/reports',
    items: [],
  },
  // --- Audit Logs ---
  {
    name: 'Audit Logs',
    href: '/dashboard/audit-logs',
    items: [],
  },
];

interface SidebarProps {
  collapsed?: boolean;
  onItemClick?: () => void;
}

export function Sidebar({ collapsed = false, onItemClick }: SidebarProps) {
  const [expandedSections, setExpandedSections] = React.useState<string[]>([]);
  const pathname = usePathname();

  // Auto-expand sections when pathname matches a submenu item
  React.useEffect(() => {
    const sectionsToExpand: string[] = [];
    
    navigationSections.forEach((section) => {
      if (section.items && section.items.length > 0) {
        // Check if any submenu item matches the current pathname
        const hasActiveSubmenu = section.items.some(item => pathname === item.href);
        if (hasActiveSubmenu) {
          sectionsToExpand.push(section.name);
        }
      }
    });
    
    if (sectionsToExpand.length > 0) {
      setExpandedSections(prev => {
        // Merge new sections with existing ones, removing duplicates
        const merged = [...new Set([...prev, ...sectionsToExpand])];
        return merged;
      });
    }
  }, [pathname]);

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
    <nav className="h-full w-full bg-white border-r flex flex-col z-50">
      <div className="flex flex-col gap-1 sm:gap-2 p-2 sm:p-4 overflow-y-auto">
        {navigationSections.map((section) => {
          const hasSubmenu = section.items && section.items.length > 0;
          const isExpanded = expandedSections.includes(section.name);
          return (
            <div key={section.name}>
              <div className="flex items-center">
                <Link
                  href={section.href || '#'}
                  className={`py-3 px-3 rounded-lg hover:bg-gray-100 font-medium flex-1 text-sm sm:text-base transition-all duration-200 ${pathname === section.href ? ' bg-primary text-primary-foreground shadow-sm' : 'text-gray-700 hover:text-gray-900'}`}
                  onClick={() => {
                    if (hasSubmenu) {
                      toggleSection(section.name);
                    } else {
                      onItemClick?.();
                    }
                  }}
                >
                  {section.name}
                </Link>
                {/* Only show chevron if there is a submenu */}
                {hasSubmenu && (
                  <button
                    onClick={() => toggleSection(section.name)}
                    className="ml-2 focus:outline-none p-1 rounded hover:bg-gray-100 transition-colors"
                  >
                    <ChevronRight size={16} className={`text-gray-500 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`} />
                  </button>
                )}
              </div>
              {hasSubmenu && isExpanded && (
                <div className="ml-4 mt-2 mb-2 border-l-2 border-gray-200 pl-4 flex flex-col gap-1">
                  {section.items.map((item) => (
                    <Link 
                      key={item.name} 
                      href={item.href} 
                      className={`py-2 px-3 rounded-md hover:bg-gray-50 text-xs sm:text-sm transition-all duration-200 ${pathname === item.href ? ' bg-primary text-primary-foreground shadow-sm' : 'text-gray-700 hover:text-gray-900'}`}
                      onClick={() => onItemClick?.()}
                    >
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