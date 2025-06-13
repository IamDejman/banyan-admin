'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  Cpu,
  HardDrive,
  Network,
  Clock,
  Activity,
  AlertCircle,
} from 'lucide-react';

// Mock data for system metrics
const systemMetrics = {
  cpu: {
    current: 45,
    history: [
      { time: '00:00', usage: 35 },
      { time: '04:00', usage: 40 },
      { time: '08:00', usage: 45 },
      { time: '12:00', usage: 50 },
      { time: '16:00', usage: 45 },
      { time: '20:00', usage: 40 },
    ],
  },
  memory: {
    current: 60,
    history: [
      { time: '00:00', usage: 55 },
      { time: '04:00', usage: 58 },
      { time: '08:00', usage: 60 },
      { time: '12:00', usage: 62 },
      { time: '16:00', usage: 60 },
      { time: '20:00', usage: 58 },
    ],
  },
  storage: {
    current: 75,
    history: [
      { time: '00:00', usage: 70 },
      { time: '04:00', usage: 72 },
      { time: '08:00', usage: 73 },
      { time: '12:00', usage: 74 },
      { time: '16:00', usage: 75 },
      { time: '20:00', usage: 75 },
    ],
  },
  network: {
    current: 30,
    history: [
      { time: '00:00', usage: 25 },
      { time: '04:00', usage: 28 },
      { time: '08:00', usage: 30 },
      { time: '12:00', usage: 35 },
      { time: '16:00', usage: 30 },
      { time: '20:00', usage: 28 },
    ],
  },
};

// Mock data for performance metrics
const performanceMetrics = {
  responseTime: {
    current: 250,
    history: [
      { time: '00:00', ms: 200 },
      { time: '04:00', ms: 220 },
      { time: '08:00', ms: 250 },
      { time: '12:00', ms: 280 },
      { time: '16:00', ms: 250 },
      { time: '20:00', ms: 220 },
    ],
  },
  throughput: {
    current: 1200,
    history: [
      { time: '00:00', requests: 1000 },
      { time: '04:00', requests: 1100 },
      { time: '08:00', requests: 1200 },
      { time: '12:00', requests: 1300 },
      { time: '16:00', requests: 1200 },
      { time: '20:00', requests: 1100 },
    ],
  },
  errorRate: {
    current: 0.5,
    history: [
      { time: '00:00', rate: 0.3 },
      { time: '04:00', rate: 0.4 },
      { time: '08:00', rate: 0.5 },
      { time: '12:00', rate: 0.6 },
      { time: '16:00', rate: 0.5 },
      { time: '20:00', rate: 0.4 },
    ],
  },
};

const getStatusColor = (value: number, type: string) => {
  if (type === 'errorRate') {
    if (value < 0.5) return 'bg-green-100 text-green-800';
    if (value < 1) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  }
  if (value < 60) return 'bg-green-100 text-green-800';
  if (value < 80) return 'bg-yellow-100 text-yellow-800';
  return 'bg-red-100 text-red-800';
};

export default function PerformancePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Performance Monitoring</h1>
        <p className="text-muted-foreground">
          Monitor system performance and resource utilization
        </p>
      </div>

      <Tabs defaultValue="system" className="space-y-4">
        <TabsList>
          <TabsTrigger value="system">System Metrics</TabsTrigger>
          <TabsTrigger value="performance">Performance Metrics</TabsTrigger>
        </TabsList>

        <TabsContent value="system" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">CPU Usage</CardTitle>
                <Cpu className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{systemMetrics.cpu.current}%</div>
                <Progress value={systemMetrics.cpu.current} className="mt-2" />
                <div className="h-[200px] mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={systemMetrics.cpu.history}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="usage"
                        stroke="#8884d8"
                        name="CPU Usage (%)"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Memory Usage</CardTitle>
                <HardDrive className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{systemMetrics.memory.current}%</div>
                <Progress value={systemMetrics.memory.current} className="mt-2" />
                <div className="h-[200px] mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={systemMetrics.memory.history}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="usage"
                        stroke="#82ca9d"
                        name="Memory Usage (%)"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Storage Usage</CardTitle>
                <HardDrive className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{systemMetrics.storage.current}%</div>
                <Progress value={systemMetrics.storage.current} className="mt-2" />
                <div className="h-[200px] mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={systemMetrics.storage.history}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="usage"
                        stroke="#ffc658"
                        name="Storage Usage (%)"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Network Usage</CardTitle>
                <Network className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{systemMetrics.network.current}%</div>
                <Progress value={systemMetrics.network.current} className="mt-2" />
                <div className="h-[200px] mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={systemMetrics.network.history}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="usage"
                        stroke="#ff8042"
                        name="Network Usage (%)"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Response Time</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {performanceMetrics.responseTime.current}ms
                </div>
                <div className="h-[200px] mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={performanceMetrics.responseTime.history}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="ms"
                        stroke="#8884d8"
                        name="Response Time (ms)"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Throughput</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {performanceMetrics.throughput.current} req/s
                </div>
                <div className="h-[200px] mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={performanceMetrics.throughput.history}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="requests"
                        stroke="#82ca9d"
                        name="Requests per Second"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {performanceMetrics.errorRate.current}%
                </div>
                <div className="h-[200px] mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={performanceMetrics.errorRate.history}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="rate"
                        stroke="#ff8042"
                        name="Error Rate (%)"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 