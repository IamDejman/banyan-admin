'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ClipboardList, BarChart, TrendingUp, Users } from 'lucide-react';

// Mock stats and data
const quickStats = [
  { title: 'Unassigned Claims', value: '7', icon: ClipboardList, description: 'Claims awaiting assignment', trend: '+2', trendUp: true },
  { title: 'Active Agents', value: '15', icon: Users, description: 'Agents currently active', trend: '+1', trendUp: true },
  { title: 'Overdue Claims', value: '2', icon: TrendingUp, description: 'Claims overdue for action', trend: '0', trendUp: false },
  { title: 'Status Types', value: '6', icon: BarChart, description: 'Configured claim statuses', trend: '+1', trendUp: true },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('assign');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Administration</h1>
        <p className="text-muted-foreground">Administrative functions and system management</p>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {quickStats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">{stat.description}</p>
                <div className={`flex items-center text-xs ${stat.trendUp ? 'text-green-600' : 'text-red-600'}`}>{stat.trend}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">System Administration</h1>
        <div className="flex gap-2">
          <Input
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-64"
          />
        </div>
      </div>

      {/* Tabbed Workflow */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="assign">Assign Claims</TabsTrigger>
          <TabsTrigger value="workload">Agent Workload</TabsTrigger>
          <TabsTrigger value="status">Status Management</TabsTrigger>
        </TabsList>

        <TabsContent value="assign">
          <Card>
            <CardHeader>
              <CardTitle>Claim Assignment</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Bulk assignment, workload visualization, audit trail */}
              <p className="text-muted-foreground">Bulk assignment of claims to agents, workload visualization, audit trail for assignments.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="workload">
          <Card>
            <CardHeader>
              <CardTitle>Agent Workload</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Agent workload analytics, rebalancing, performance */}
              <p className="text-muted-foreground">Agent workload analytics, rebalancing tools, performance tracking, and agent assignment history.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="status">
          <Card>
            <CardHeader>
              <CardTitle>Status Management</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Status configuration, analytics, audit trail */}
              <p className="text-muted-foreground">Status configuration tools, analytics for claim statuses, and audit trail for status changes.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 