'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  Clock, 
  FileCheck, 
  MessageSquare, 
  Calculator, 
  DollarSign, 
  Settings,
  ArrowRight,
  TrendingUp
} from 'lucide-react';
import Link from 'next/link';

const stats = [
  {
    title: 'Total Claims',
    value: '1,234',
    icon: FileText,
    description: 'All time claims',
    trend: '+12%',
    trendUp: true,
  },
  {
    title: 'Pending Review',
    value: '42',
    icon: Clock,
    description: 'Requires attention',
    trend: '-5%',
    trendUp: false,
  },
  {
    title: 'Approved',
    value: '892',
    icon: FileCheck,
    description: 'This month',
    trend: '+8%',
    trendUp: true,
  },
  {
    title: 'Settlements',
    value: '156',
    icon: DollarSign,
    description: 'Active settlements',
    trend: '+15%',
    trendUp: true,
  },
];

const workflowSections = [
  {
    name: 'Claims Review',
    description: 'Review and process incoming claims',
    icon: FileText,
    href: '/dashboard/claims',
    color: 'bg-blue-500',
    stats: '42 pending',
  },
  {
    name: 'Document Management',
    description: 'Manage claim documents and files',
    icon: FileCheck,
    href: '/dashboard/documents',
    color: 'bg-green-500',
    stats: '1,234 documents',
  },
  {
    name: 'Information Requests',
    description: 'Communicate with claimants',
    icon: MessageSquare,
    href: '/dashboard/information-requests',
    color: 'bg-purple-500',
    stats: '23 active',
  },
  {
    name: 'Assessment & Valuation',
    description: 'Assess claims and determine values',
    icon: Calculator,
    href: '/dashboard/assessments',
    color: 'bg-orange-500',
    stats: '89 assessments',
  },
  {
    name: 'Settlement Management',
    description: 'Handle settlements and payments',
    icon: DollarSign,
    href: '/dashboard/settlements',
    color: 'bg-emerald-500',
    stats: '156 settlements',
  },
  {
    name: 'Administration',
    description: 'System administration and settings',
    icon: Settings,
    href: '/dashboard/admin',
    color: 'bg-gray-500',
    stats: '12 users',
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to your workflow-based claims management dashboard
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
                <div className={`flex items-center text-xs ${stat.trendUp ? 'text-green-600' : 'text-red-600'}`}>
                  <TrendingUp size={12} className="mr-1" />
                  {stat.trend}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Workflow Sections */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Workflow Sections</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {workflowSections.map((section) => (
            <Card key={section.name} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className={`p-2 rounded-lg ${section.color}`}>
                    <section.icon className="h-6 w-6 text-white" />
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </div>
                <CardTitle className="text-lg">{section.name}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {section.description}
                </p>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">
                    {section.stats}
                  </span>
                  <Button asChild variant="outline" size="sm">
                    <Link href={section.href}>
                      View
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Activity and Claims by Status */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { action: 'Claim #1234 was approved', time: '2 hours ago', type: 'approval' },
                { action: 'Document uploaded for Claim #1235', time: '3 hours ago', type: 'document' },
                { action: 'Settlement offer sent for Claim #1236', time: '4 hours ago', type: 'settlement' },
                { action: 'Assessment completed for Claim #1237', time: '5 hours ago', type: 'assessment' },
                { action: 'Notification sent to claimant', time: '6 hours ago', type: 'notification' },
              ].map((activity, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <div className={`h-2 w-2 rounded-full ${
                    activity.type === 'approval' ? 'bg-green-500' :
                    activity.type === 'document' ? 'bg-blue-500' :
                    activity.type === 'settlement' ? 'bg-emerald-500' :
                    activity.type === 'assessment' ? 'bg-orange-500' :
                    'bg-purple-500'
                  }`} />
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">
                      {activity.action}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Claims by Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { label: 'Pending Review', value: 42, color: 'bg-yellow-500' },
                { label: 'Under Assessment', value: 89, color: 'bg-blue-500' },
                { label: 'Approved', value: 892, color: 'bg-green-500' },
                { label: 'Settlement Pending', value: 156, color: 'bg-emerald-500' },
                { label: 'Rejected', value: 12, color: 'bg-red-500' },
              ].map((item) => (
                <div key={item.label} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{item.label}</span>
                    <span className="text-sm text-muted-foreground">
                      {item.value}
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div
                      className={`h-full rounded-full ${item.color}`}
                      style={{ width: `${(item.value / 1191) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Button asChild variant="outline" className="h-auto p-4 flex-col">
              <Link href="/dashboard/claims">
                <FileText className="h-6 w-6 mb-2" />
                <span>Review Claims</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto p-4 flex-col">
              <Link href="/dashboard/documents/upload">
                <FileCheck className="h-6 w-6 mb-2" />
                <span>Upload Documents</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto p-4 flex-col">
              <Link href="/dashboard/settlements/new">
                <DollarSign className="h-6 w-6 mb-2" />
                <span>Create Settlement</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto p-4 flex-col">
              <Link href="/dashboard/notifications/new">
                <MessageSquare className="h-6 w-6 mb-2" />
                <span>Send Notification</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 