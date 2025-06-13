'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart2, User, CheckCircle2, AlertCircle } from 'lucide-react';

// Mock agent data
const agents = [
  {
    id: '1',
    name: 'Alice Johnson',
    email: 'alice@company.com',
    assigned: 12,
    open: 7,
    closed: 5,
    status: 'Active',
    avgResolution: 2.5,
    performance: 85,
  },
  {
    id: '2',
    name: 'Bob Smith',
    email: 'bob@company.com',
    assigned: 8,
    open: 2,
    closed: 6,
    status: 'Active',
    avgResolution: 1.8,
    performance: 92,
  },
  {
    id: '3',
    name: 'Carol Lee',
    email: 'carol@company.com',
    assigned: 15,
    open: 10,
    closed: 5,
    status: 'Inactive',
    avgResolution: 3.2,
    performance: 70,
  },
];

export default function AgentsPage() {
  const [activeTab, setActiveTab] = useState('list');

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">Agent Workload Management</h1>
      </div>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="list">Agent List</TabsTrigger>
          <TabsTrigger value="metrics">Performance Metrics</TabsTrigger>
        </TabsList>
        <TabsContent value="list" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Agents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {agents.map((agent) => (
                  <div
                    key={agent.id}
                    className="flex flex-col gap-2 p-4 border rounded-lg sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <User className="h-6 w-6 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{agent.name}</div>
                        <div className="text-xs text-muted-foreground">{agent.email}</div>
                        <Badge className={agent.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                          {agent.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1 sm:items-end">
                      <div className="text-sm">
                        Assigned: <span className="font-semibold">{agent.assigned}</span>
                      </div>
                      <div className="text-sm">
                        Open: <span className="font-semibold">{agent.open}</span>
                      </div>
                      <div className="text-sm">
                        Closed: <span className="font-semibold">{agent.closed}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        Avg. Resolution: <span className="font-semibold">{agent.avgResolution} days</span>
                      </div>
                      <div className="w-32">
                        <Progress value={agent.performance} />
                        <div className="text-xs text-muted-foreground text-right">{agent.performance}% performance</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="metrics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {agents.map((agent) => (
                  <div key={agent.id} className="p-4 border rounded-lg space-y-2">
                    <div className="flex items-center gap-2">
                      <BarChart2 className="h-5 w-5 text-muted-foreground" />
                      <span className="font-medium">{agent.name}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">Avg. Resolution: {agent.avgResolution} days</div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Closed: {agent.closed}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-yellow-600" />
                      <span className="text-sm">Open: {agent.open}</span>
                    </div>
                    <div className="w-full">
                      <Progress value={agent.performance} />
                      <div className="text-xs text-muted-foreground text-right">{agent.performance}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 