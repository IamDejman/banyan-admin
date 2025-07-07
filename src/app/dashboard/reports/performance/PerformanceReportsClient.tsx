"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import type { PerformanceReport } from "@/lib/types/report";
import type { DateRange } from "react-day-picker";

const mockPerformanceReport: PerformanceReport = {
  systemUptime: 99.8,
  averageResponseTime: 245,
  errorRate: 0.2,
  throughput: 1250,
  performanceByHour: [
    { hour: 0, requests: 45 },
    { hour: 1, requests: 32 },
    { hour: 2, requests: 28 },
    { hour: 3, requests: 25 },
    { hour: 4, requests: 30 },
    { hour: 5, requests: 35 },
    { hour: 6, requests: 42 },
    { hour: 7, requests: 78 },
    { hour: 8, requests: 125 },
    { hour: 9, requests: 156 },
    { hour: 10, requests: 189 },
    { hour: 11, requests: 234 },
    { hour: 12, requests: 267 },
    { hour: 13, requests: 245 },
    { hour: 14, requests: 289 },
    { hour: 15, requests: 312 },
    { hour: 16, requests: 298 },
    { hour: 17, requests: 267 },
    { hour: 18, requests: 234 },
    { hour: 19, requests: 189 },
    { hour: 20, requests: 156 },
    { hour: 21, requests: 123 },
    { hour: 22, requests: 89 },
    { hour: 23, requests: 67 },
  ],
  topPerformingAgents: [
    { name: "Alice Johnson", performance: 98.5 },
    { name: "Bob Wilson", performance: 96.2 },
    { name: "Carol Davis", performance: 94.8 },
    { name: "David Brown", performance: 93.1 },
    { name: "Eva Garcia", performance: 91.7 },
  ],
  systemLoad: [
    { timestamp: "2024-01-20T00:00:00Z", load: 23 },
    { timestamp: "2024-01-20T04:00:00Z", load: 18 },
    { timestamp: "2024-01-20T08:00:00Z", load: 45 },
    { timestamp: "2024-01-20T12:00:00Z", load: 67 },
    { timestamp: "2024-01-20T16:00:00Z", load: 78 },
    { timestamp: "2024-01-20T20:00:00Z", load: 56 },
  ],
};

type ChartDataPoint = {
  name: string;
  value: number;
};

type TimeSeriesDataPoint = {
  timestamp: string;
  value: number;
};

export default function PerformanceReportsClient() {
  const [report] = useState<PerformanceReport>(mockPerformanceReport);
  const [period, setPeriod] = useState<string>("daily");
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(new Date().getFullYear(), 0, 1),
    to: new Date(),
  });

  function handleExport() {
    // Mock export functionality
    console.log("Exporting performance report...");
  }

  function getPerformanceColor(performance: number) {
    if (performance >= 95) return "default";
    if (performance >= 90) return "secondary";
    if (performance >= 80) return "outline";
    return "destructive";
  }

  const performanceByHourData: ChartDataPoint[] = report.performanceByHour.map(({ hour, requests }) => ({
    name: `${hour}:00`,
    value: requests,
  }));

  const topAgentsData: ChartDataPoint[] = report.topPerformingAgents.map(({ name, performance }) => ({
    name,
    value: performance,
  }));

  const systemLoadData: TimeSeriesDataPoint[] = report.systemLoad.map(({ timestamp, load }) => ({
    timestamp,
    value: load,
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Performance Reports</h2>
        <Button onClick={handleExport}>Export Report</Button>
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
              <p className="text-sm font-medium text-muted-foreground">System Uptime</p>
              <p className="text-2xl font-bold text-green-600">{report.systemUptime}%</p>
            </div>
            <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-600 text-sm font-bold">🟢</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Avg Response Time</p>
              <p className="text-2xl font-bold">{report.averageResponseTime}ms</p>
            </div>
            <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 text-sm font-bold">⚡</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Error Rate</p>
              <p className="text-2xl font-bold text-red-600">{report.errorRate}%</p>
            </div>
            <div className="h-8 w-8 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-red-600 text-sm font-bold">⚠️</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Throughput</p>
              <p className="text-2xl font-bold">{report.throughput.toLocaleString()}/min</p>
            </div>
            <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
              <span className="text-purple-600 text-sm font-bold">📈</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance by Hour */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Performance by Hour</h3>
          <div className="flex items-end gap-1 h-32">
            {performanceByHourData.map((item) => (
              <div key={item.name} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full bg-blue-600 rounded-t"
                  style={{ height: `${(item.value / Math.max(...performanceByHourData.map(d => d.value))) * 100}%` }}
                />
                <span className="text-xs text-muted-foreground mt-1">{item.name}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Top Performing Agents */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Top Performing Agents</h3>
          <div className="space-y-3">
            {topAgentsData.map((item, index) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-muted-foreground w-6">#{index + 1}</span>
                  <span className="font-medium">{item.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: `${item.value}%` }}
                    />
                  </div>
                  <Badge variant={getPerformanceColor(item.value)} className="w-16 text-center">
                    {item.value}%
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* System Load Trend */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">System Load Trend</h3>
        <div className="flex items-end gap-2 h-32">
          {systemLoadData.map((item) => (
            <div key={item.timestamp} className="flex-1 flex flex-col items-center">
              <div
                className="w-full bg-purple-600 rounded-t"
                style={{ height: `${(item.value / Math.max(...systemLoadData.map(d => d.value))) * 100}%` }}
              />
              <span className="text-xs text-muted-foreground mt-1">
                {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
} 