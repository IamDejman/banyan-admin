"use client";
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import type { SystemReport } from "@/lib/types/report";
import type { DateRange } from "react-day-picker";

const mockSystemReport: SystemReport = {
  systemHealth: "healthy",
  activeUsers: 156,
  totalStorage: 2048,
  usedStorage: 1234,
  databaseConnections: 45,
  lastBackup: "2024-01-20T02:00:00Z",
  systemAlerts: [
    { severity: "low", message: "Database backup completed successfully", timestamp: "2024-01-20T02:00:00Z" },
    { severity: "medium", message: "High memory usage detected", timestamp: "2024-01-20T01:30:00Z" },
    { severity: "low", message: "System maintenance scheduled", timestamp: "2024-01-19T23:00:00Z" },
    { severity: "high", message: "Database connection pool reaching limit", timestamp: "2024-01-19T22:15:00Z" },
  ],
};

type ChartDataPoint = {
  name: string;
  value: number;
};

type AlertDataPoint = {
  severity: "low" | "medium" | "high";
  message: string;
  timestamp: string;
};

export default function SystemReportsClient() {
  const [report] = useState<SystemReport>(mockSystemReport);
  const [period, setPeriod] = useState<string>("daily");
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(new Date().getFullYear(), 0, 1),
    to: new Date(),
  });


  function getHealthColor(health: string) {
    switch (health) {
      case "healthy": return "default";
      case "warning": return "secondary";
      case "critical": return "destructive";
      default: return "outline";
    }
  }

  function getAlertColor(severity: string) {
    switch (severity) {
      case "low": return "default";
      case "medium": return "secondary";
      case "high": return "destructive";
      default: return "outline";
    }
  }

  const storageData: ChartDataPoint[] = [
    { name: "Used", value: report.usedStorage },
    { name: "Available", value: report.totalStorage - report.usedStorage },
  ];

  const alertsBySeverity: ChartDataPoint[] = report.systemAlerts.reduce((acc, alert) => {
    const existing = acc.find(item => item.name === alert.severity);
    if (existing) {
      existing.value++;
    } else {
      acc.push({ name: alert.severity, value: 1 });
    }
    return acc;
  }, [] as ChartDataPoint[]);

  const alertsData: AlertDataPoint[] = report.systemAlerts;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">System Reports</h2>
      </div>

      <div className="flex gap-4 items-center flex-wrap">
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="hourly">Hourly</SelectItem>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
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
              <p className="text-sm font-medium text-muted-foreground">System Health</p>
              <p className="text-2xl font-bold">{report.systemHealth}</p>
            </div>
            <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-600 text-sm font-bold">🟢</span>
            </div>
          </div>
          <Badge variant={getHealthColor(report.systemHealth)} className="mt-2">
            {report.systemHealth === "healthy" ? "All Systems Operational" : 
             report.systemHealth === "warning" ? "Minor Issues Detected" : "Critical Issues"}
          </Badge>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Active Users</p>
              <p className="text-2xl font-bold">{report.activeUsers}</p>
            </div>
            <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 text-sm font-bold">👥</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Storage Usage</p>
              <p className="text-2xl font-bold">{Math.round((report.usedStorage / report.totalStorage) * 100)}%</p>
            </div>
            <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
              <span className="text-purple-600 text-sm font-bold">💾</span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {report.usedStorage}GB / {report.totalStorage}GB
          </p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">DB Connections</p>
              <p className="text-2xl font-bold">{report.databaseConnections}</p>
            </div>
            <div className="h-8 w-8 bg-orange-100 rounded-full flex items-center justify-center">
              <span className="text-orange-600 text-sm font-bold">🔗</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Storage Usage */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Storage Usage</h3>
          <div className="space-y-3">
            {storageData.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <span className="text-sm font-medium">{item.name}</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${item.name === "Used" ? "bg-blue-600" : "bg-gray-400"}`}
                      style={{ width: `${(item.value / report.totalStorage) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground w-16 text-right">{item.value}GB</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Alerts by Severity */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Alerts by Severity</h3>
          <div className="space-y-3">
            {alertsBySeverity.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant={getAlertColor(item.name)}>
                    {item.name}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-red-600 h-2 rounded-full"
                      style={{ width: `${(item.value / Math.max(...alertsBySeverity.map(d => d.value))) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground w-12 text-right">{item.value}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* System Alerts */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Recent System Alerts</h3>
        <div className="space-y-3">
          {alertsData.map((alert, index) => (
            <div key={index} className="flex items-start justify-between p-3 border rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant={getAlertColor(alert.severity)}>
                    {alert.severity}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {new Date(alert.timestamp).toLocaleString()}
                  </span>
                </div>
                <p className="text-sm">{alert.message}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* System Information */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">System Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <span className="font-medium">Last Backup:</span>
            <div className="text-sm text-muted-foreground">
              {new Date(report.lastBackup).toLocaleString()}
            </div>
          </div>
          <div>
            <span className="font-medium">Backup Status:</span>
            <div className="text-sm text-green-600">✅ Successful</div>
          </div>
          <div>
            <span className="font-medium">System Version:</span>
            <div className="text-sm text-muted-foreground">v2.1.0</div>
          </div>
          <div>
            <span className="font-medium">Uptime:</span>
            <div className="text-sm text-muted-foreground">99.8%</div>
          </div>
        </div>
      </Card>
    </div>
  );
} 