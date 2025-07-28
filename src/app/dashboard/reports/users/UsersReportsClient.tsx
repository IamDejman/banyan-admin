"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import type { UsersReport } from "@/lib/types/report";
import type { DateRange } from "react-day-picker";

const mockUsersReport: UsersReport = {
  totalUsers: 1247,
  activeUsers: 892,
  newUsers: 45,
  usersByRole: {
    "admin": 12,
    "agent": 156,
    "customer": 1079,
  },
  usersByStatus: {
    "active": 892,
    "inactive": 234,
    "suspended": 121,
  },
  userActivity: [
    { date: "2024-01-14", activeUsers: 234 },
    { date: "2024-01-15", activeUsers: 245 },
    { date: "2024-01-16", activeUsers: 267 },
    { date: "2024-01-17", activeUsers: 289 },
    { date: "2024-01-18", activeUsers: 312 },
    { date: "2024-01-19", activeUsers: 298 },
    { date: "2024-01-20", activeUsers: 267 },
  ],
  topAgents: [
    { name: "Alice Johnson", claimsProcessed: 45, rating: 4.8 },
    { name: "Bob Wilson", claimsProcessed: 38, rating: 4.6 },
    { name: "Carol Davis", claimsProcessed: 42, rating: 4.7 },
    { name: "David Brown", claimsProcessed: 35, rating: 4.5 },
    { name: "Eva Garcia", claimsProcessed: 31, rating: 4.4 },
  ],
};

type ChartDataPoint = {
  name: string;
  value: number;
};

type TimeSeriesDataPoint = {
  date: string;
  value: number;
};

export default function UsersReportsClient() {
  const [report] = useState<UsersReport>(mockUsersReport);
  const [period, setPeriod] = useState<string>("weekly");
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(new Date().getFullYear(), 0, 1),
    to: new Date(),
  });

  function handleExport() {
    // Export functionality
    console.log("Exporting users report...");
  }

  function getRoleColor(role: string) {
    switch (role) {
      case "admin": return "destructive";
      case "agent": return "default";
      case "customer": return "secondary";
      default: return "outline";
    }
  }

  function getStatusColor(status: string) {
    switch (status) {
      case "active": return "default";
      case "inactive": return "secondary";
      case "suspended": return "destructive";
      default: return "outline";
    }
  }

  const usersByRoleData: ChartDataPoint[] = Object.entries(report.usersByRole).map(([name, value]) => ({
    name,
    value,
  }));

  const usersByStatusData: ChartDataPoint[] = Object.entries(report.usersByStatus).map(([name, value]) => ({
    name,
    value,
  }));

  const userActivityData: TimeSeriesDataPoint[] = report.userActivity.map(({ date, activeUsers }) => ({
    date,
    value: activeUsers,
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Users Reports</h2>
        <Button onClick={handleExport}>Export Report</Button>
      </div>

      <div className="flex gap-4 items-center flex-wrap">
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="quarterly">Quarterly</SelectItem>
          </SelectContent>
        </Select>
        <DateRangePicker
          date={dateRange}
          onDateChange={setDateRange}
        />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Users</p>
              <p className="text-2xl font-bold">{report.totalUsers.toLocaleString()}</p>
            </div>
            <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 text-sm font-bold">👥</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Active Users</p>
              <p className="text-2xl font-bold text-green-600">{report.activeUsers.toLocaleString()}</p>
            </div>
            <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-600 text-sm font-bold">✅</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">New Users</p>
              <p className="text-2xl font-bold text-blue-600">{report.newUsers.toLocaleString()}</p>
            </div>
            <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 text-sm font-bold">➕</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Engagement Rate</p>
              <p className="text-2xl font-bold">{Math.round((report.activeUsers / report.totalUsers) * 100)}%</p>
            </div>
            <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
              <span className="text-purple-600 text-sm font-bold">📊</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Users by Role */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Users by Role</h3>
          <div className="space-y-3">
            {usersByRoleData.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant={getRoleColor(item.name)}>
                    {item.name}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${(item.value / Math.max(...usersByRoleData.map(d => d.value))) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground w-12 text-right">{item.value}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Users by Status */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Users by Status</h3>
          <div className="space-y-3">
            {usersByStatusData.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant={getStatusColor(item.name)}>
                    {item.name}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: `${(item.value / Math.max(...usersByStatusData.map(d => d.value))) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground w-12 text-right">{item.value}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* User Activity Trend */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">User Activity Trend (Last 7 Days)</h3>
        <div className="flex items-end gap-2 h-32">
          {userActivityData.map((item) => (
            <div key={item.date} className="flex-1 flex flex-col items-center">
              <div
                className="w-full bg-blue-600 rounded-t"
                style={{ height: `${(item.value / Math.max(...userActivityData.map(d => d.value))) * 100}%` }}
              />
              <span className="text-xs text-muted-foreground mt-1">
                {new Date(item.date).toLocaleDateString([], { month: 'short', day: 'numeric' })}
              </span>
            </div>
          ))}
        </div>
      </Card>

      {/* Top Agents */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Top Performing Agents</h3>
        <div className="space-y-3">
          {report.topAgents.map((agent, index) => (
            <div key={agent.name} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-muted-foreground w-6">#{index + 1}</span>
                <div>
                  <div className="font-medium">{agent.name}</div>
                  <div className="text-xs text-muted-foreground">Rating: {agent.rating} ⭐</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{ width: `${(agent.claimsProcessed / Math.max(...report.topAgents.map(a => a.claimsProcessed))) * 100}%` }}
                  />
                </div>
                <span className="text-sm text-muted-foreground w-12 text-right">{agent.claimsProcessed}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
} 