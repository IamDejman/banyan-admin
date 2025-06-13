'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { BarChart2, TrendingUp, Users, FileText, CheckCircle2 } from 'lucide-react';

const metrics = [
  { label: 'Total Claims', value: 128, icon: FileText },
  { label: 'Claims in Review', value: 24, icon: TrendingUp },
  { label: 'Settlements Pending', value: 8, icon: CheckCircle2 },
  { label: 'Payments Processed', value: 56, icon: BarChart2 },
  { label: 'Agents', value: 6, icon: Users },
];

const workload = [
  { agent: 'Alice Johnson', open: 7, closed: 5 },
  { agent: 'Bob Smith', open: 2, closed: 6 },
  { agent: 'Carol Lee', open: 10, closed: 5 },
];

const trends = [
  { month: 'Jan', claims: 20, settlements: 5 },
  { month: 'Feb', claims: 18, settlements: 7 },
  { month: 'Mar', claims: 25, settlements: 8 },
  { month: 'Apr', claims: 22, settlements: 6 },
  { month: 'May', claims: 28, settlements: 9 },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      {/* Key Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {metrics.map((metric) => (
          <Card key={metric.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{metric.label}</CardTitle>
              <metric.icon className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Workload Visualization */}
      <Card>
        <CardHeader>
          <CardTitle>Agent Workload</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {workload.map((w) => (
              <div key={w.agent} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="font-medium">{w.agent}</div>
                <div className="flex gap-4">
                  <div className="text-sm">Open: <span className="font-semibold">{w.open}</span></div>
                  <div className="text-sm">Closed: <span className="font-semibold">{w.closed}</span></div>
                </div>
                <div className="w-32">
                  <Progress value={w.closed / (w.open + w.closed) * 100} />
                  <div className="text-xs text-muted-foreground text-right">{Math.round(w.closed / (w.open + w.closed) * 100)}% closed</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Trend Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
            {trends.map((t) => (
              <div key={t.month} className="flex flex-col items-center p-2 border rounded-md w-full">
                <div className="font-semibold">{t.month}</div>
                <div className="text-xs text-muted-foreground">Claims: {t.claims}</div>
                <div className="text-xs text-muted-foreground">Settlements: {t.settlements}</div>
                <div className="w-full mt-2">
                  <Progress value={t.settlements / t.claims * 100} />
                  <div className="text-xs text-muted-foreground text-right">{Math.round(t.settlements / t.claims * 100)}% settled</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 