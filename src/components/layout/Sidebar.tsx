'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/providers/auth-provider';
import {
  LayoutDashboard,
  FileText,
  MessageSquare,
  DollarSign,
  Settings,
  Users,
  ChevronLeft,
  ChevronRight,
  User,
  X,
  CheckSquare,
  Calculator,
  UserCheck,
  CheckCircle,
  Send,
  Eye,
  Clock,
  HelpCircle,
  FilePlus,
  ClipboardList,
  CreditCard,
  BarChart,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

// Only keep the six main workflow sections
const navigationSections = [
  {
    name: 'Claims Review',
    icon: CheckSquare,
    description: 'Handle initial claim processing and review workflow',
    roles: ['CLAIMS_AGENT', 'MANAGER', 'FINANCIAL_OFFICER'],
    items: [
      {
        name: 'Pending Review',
        href: '/dashboard/claims',
        icon: Clock,
        description: 'Claims pending review (Function 1)',
      },
      {
        name: 'Review Details',
        href: '/dashboard/claims/review',
        icon: Eye,
        description: 'Detailed claim review (Function 2)',
      },
      {
        name: 'Complete Review',
        href: '/dashboard/claims/complete',
        icon: CheckCircle,
        description: 'Complete claim review (Function 3)',
      },
    ],
  },
  {
    name: 'Documents',
    icon: FileText,
    description: 'Centralized document verification and management',
    roles: ['CLAIMS_AGENT', 'MANAGER'],
    items: [
      {
        name: 'Pending Verification',
        href: '/dashboard/documents',
        icon: Clock,
        description: 'Documents pending verification (Function 4)',
      },
      {
        name: 'Verify Documents',
        href: '/dashboard/documents/verify',
        icon: CheckSquare,
        description: 'Verify documents (Function 5)',
      },
      {
        name: 'Reject Documents',
        href: '/dashboard/documents/reject',
        icon: X,
        description: 'Reject documents (Function 6)',
      },
    ],
  },
  {
    name: 'Information Requests',
    icon: HelpCircle,
    description: 'Manage additional information gathering from clients',
    roles: ['CLAIMS_AGENT', 'MANAGER'],
    items: [
      {
        name: 'Request Documents',
        href: '/dashboard/information-requests',
        icon: FileText,
        description: 'Request documents from clients (Function 7)',
      },
      {
        name: 'Request Information',
        href: '/dashboard/information-requests/info',
        icon: HelpCircle,
        description: 'Request additional information (Function 8)',
      },
      {
        name: 'Review Responses',
        href: '/dashboard/information-requests/responses',
        icon: MessageSquare,
        description: 'Review client responses (Function 9)',
      },
    ],
  },
  {
    name: 'Assessment',
    icon: Calculator,
    description: 'Handle claim valuation and settlement recommendations',
    roles: ['CLAIMS_AGENT', 'MANAGER', 'FINANCIAL_OFFICER'],
    items: [
      {
        name: 'Submit Assessment',
        href: '/dashboard/assessment',
        icon: Calculator,
        description: 'Submit claim assessment (Function 10)',
      },
      {
        name: 'Ready for Offers',
        href: '/dashboard/assessment/offers',
        icon: DollarSign,
        description: 'Claims ready for offers (Function 11)',
      },
    ],
  },
  {
    name: 'Settlement Management',
    icon: DollarSign,
    description: 'Handle settlements and payments',
    roles: ['MANAGER', 'FINANCIAL_OFFICER'],
    items: [
      {
        name: 'Settlements',
        href: '/dashboard/settlements',
        icon: DollarSign,
        description: 'Complete settlement offer and payment workflow',
      },
      {
        name: 'Create Offers',
        href: '/dashboard/settlements/new',
        icon: FilePlus,
        description: 'Create settlement offers (Function 12)',
      },
      {
        name: 'Approve Offers',
        href: '/dashboard/settlements/approve',
        icon: CheckCircle,
        description: 'Approve settlement offers (Function 13)',
      },
      {
        name: 'Present Offers',
        href: '/dashboard/settlements/present',
        icon: Send,
        description: 'Present offers to clients (Function 14)',
      },
      {
        name: 'Manage Offers',
        href: '/dashboard/settlements/manage',
        icon: ClipboardList,
        description: 'Manage offers and responses (Functions 15-17)',
      },
      {
        name: 'Process Settlements',
        href: '/dashboard/settlements/process',
        icon: CreditCard,
        description: 'Process settlements and payments (Functions 18-20)',
      },
    ],
  },
  {
    name: 'Administration',
    icon: Settings,
    description: 'Administrative functions and system management',
    roles: ['MANAGER', 'FINANCIAL_OFFICER'],
    items: [
      {
        name: 'Assign Claims',
        href: '/dashboard/admin/assign',
        icon: UserCheck,
        description: 'Assign claims to agents (Function 21)',
      },
      {
        name: 'Agent Workload',
        href: '/dashboard/admin/workload',
        icon: Users,
        description: 'View and manage agent workload (Function 22)',
      },
      {
        name: 'Status Management',
        href: '/dashboard/admin/status',
        icon: BarChart,
        description: 'Manage claim statuses (Function 23)',
      },
    ],
  },
  {
    name: 'System Config',
    icon: Settings,
    description: 'Manage insurers and claim types',
    roles: ['ADMIN', 'SUPER_ADMIN'],
    items: [
      {
        name: 'Insurers',
        href: '/dashboard/system-config/insurers',
        icon: Settings,
        description: 'Manage insurers',
      },
      {
        name: 'Claim Types',
        href: '/dashboard/system-config/claim-types',
        icon: Settings,
        description: 'Manage claim types',
      },
    ],
  },
  {
    name: 'User Management',
    icon: Users,
    description: 'Manage all system users',
    roles: ['ADMIN', 'SUPER_ADMIN'],
    items: [
      {
        name: 'Customers',
        href: '/dashboard/user-management/customers',
        icon: Users,
        description: 'Manage customers',
      },
      {
        name: 'Agents',
        href: '/dashboard/user-management/agents',
        icon: Users,
        description: 'Manage agents',
      },
      {
        name: 'Admins',
        href: '/dashboard/user-management/admins',
        icon: Users,
        description: 'Manage admins',
      },
      {
        name: 'Permissions',
        href: '/dashboard/user-management/permissions',
        icon: Settings,
        description: 'Manage permissions',
      },
    ],
  },
  {
    name: 'Reports',
    icon: BarChart,
    description: 'Generate and view system reports',
    roles: ['ADMIN', 'SUPER_ADMIN'],
    items: [
      {
        name: 'Claims Reports',
        href: '/dashboard/reports/claims',
        icon: BarChart,
        description: 'Claims analytics',
      },
      {
        name: 'Performance Reports',
        href: '/dashboard/reports/performance',
        icon: BarChart,
        description: 'Performance analytics',
      },
      {
        name: 'User Reports',
        href: '/dashboard/reports/users',
        icon: BarChart,
        description: 'User analytics',
      },
      {
        name: 'System Reports',
        href: '/dashboard/reports/system',
        icon: BarChart,
        description: 'System analytics',
      },
    ],
  },
  {
    name: 'Audit Logs',
    icon: Clock,
    description: 'Track and monitor all system activities',
    roles: ['ADMIN', 'SUPER_ADMIN'],
    items: [
      {
        name: 'Agent Activity Logs',
        href: '/dashboard/audit-logs/agents',
        icon: Clock,
        description: 'Agent activity logs',
      },
      {
        name: 'Admin Activity Logs',
        href: '/dashboard/audit-logs/admins',
        icon: Clock,
        description: 'Admin activity logs',
      },
    ],
  },
];

interface SidebarProps {
  onClose?: () => void;
}

export function Sidebar({ onClose }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>(['Claims Review']); // Default expanded
  const pathname = usePathname();
  const { user } = useAuth();

  const filteredSections = navigationSections.filter((section) =>
    section.roles.includes(user?.role || '')
  );

  const toggleSection = (sectionName: string) => {
    setExpandedSections(prev =>
      prev.includes(sectionName)
        ? prev.filter(name => name !== sectionName)
        : [...prev, sectionName]
    );
  };

  // Find the best match for active state
  let bestMatchHref = '';
  filteredSections.forEach((section) => {
    section.items.forEach((item) => {
      if (
        pathname === item.href ||
        (item.href !== '/dashboard' && pathname.startsWith(item.href + '/'))
      ) {
        if (item.href.length > bestMatchHref.length) {
          bestMatchHref = item.href;
        }
      }
    });
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
        {/* Dashboard Link */}
        <Link
          href="/dashboard"
          onClick={onClose}
          className={cn(
            'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors mb-6',
            pathname === '/dashboard'
              ? 'bg-primary text-primary-foreground'
              : 'hover:bg-gray-100'
          )}
        >
          <LayoutDashboard size={20} />
          {!isCollapsed && <span>Dashboard</span>}
        </Link>

        {/* Workflow Sections */}
        {filteredSections.map((section) => {
          const isExpanded = expandedSections.includes(section.name);
          const hasActiveItem = section.items.some(item => 
            pathname === item.href || 
            (item.href !== '/dashboard' && pathname.startsWith(item.href + '/'))
          );

          return (
            <div key={section.name} className="space-y-1">
              {/* Section Header */}
              <button
                onClick={() => toggleSection(section.name)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors w-full text-left',
                  hasActiveItem ? 'bg-primary/10 text-primary' : 'hover:bg-gray-100'
                )}
              >
                <section.icon size={20} />
                {!isCollapsed && (
                  <>
                    <span className="flex-1">{section.name}</span>
                    <ChevronRight 
                      size={16} 
                      className={cn(
                        'transition-transform',
                        isExpanded ? 'rotate-90' : ''
                      )}
                    />
                  </>
                )}
              </button>

              {/* Section Items */}
              {isExpanded && !isCollapsed && (
                <div className="ml-8 space-y-1">
                  {section.items.map((item) => {
                    const isActive = item.href === bestMatchHref;
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={onClose}
                        className={cn(
                          'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm',
                          isActive
                            ? 'bg-primary text-primary-foreground'
                            : 'hover:bg-gray-100'
                        )}
                      >
                        <item.icon size={16} />
                        <span>{item.name}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
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