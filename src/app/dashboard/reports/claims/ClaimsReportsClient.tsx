"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import type { ClaimsReport } from "@/lib/types/report";
import type { DateRange } from "react-day-picker";

const mockClaimsReport: ClaimsReport = {
  totalClaims: 1247,
  pendingClaims: 89,
  approvedClaims: 1023,
  rejectedClaims: 135,
  averageProcessingTime: 3.2,
  claimsByType: {
    "Auto": 456,
    "Property": 234,
    "Health": 189,
    "Life": 98,
    "Other": 270,
  },
  claimsByStatus: {
    "Pending": 89,
    "Under Review": 156,
    "Approved": 1023,
    "Rejected": 135,
    "On Hold": 45,
  },
  claimsByMonth: [
    { month: "Jan", count: 98 },
    { month: "Feb", count: 112 },
    { month: "Mar", count: 134 },
    { month: "Apr", count: 156 },
    { month: "May", count: 178 },
    { month: "Jun", count: 145 },
    { month: "Jul", count: 167 },
    { month: "Aug", count: 189 },
    { month: "Sep", count: 123 },
    { month: "Oct", count: 145 },
    { month: "Nov", count: 167 },
    { month: "Dec", count: 134 },
  ],
  topInsurers: [
    { name: "State Farm", count: 234 },
    { name: "Allstate", count: 189 },
    { name: "Progressive", count: 156 },
    { name: "Geico", count: 134 },
    { name: "Liberty Mutual", count: 98 },
  ],
};

type ChartDataPoint = {
  name: string;
  value: number;
};

export default function ClaimsReportsClient() {
  const [report] = useState<ClaimsReport>(mockClaimsReport);
  const [period, setPeriod] = useState<string>("monthly");
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(new Date().getFullYear(), 0, 1),
    to: new Date(),
  });

  function handleExport() {
    // Export functionality
    console.log("Exporting claims report...");
  }

  function getStatusColor(status: string) {
    switch (status) {
      case "Pending": return "secondary";
      case "Under Review": return "default";
      case "Approved": return "default";
      case "Rejected": return "destructive";
      case "On Hold": return "outline";
      default: return "outline";
    }
  }

  const claimsByTypeData: ChartDataPoint[] = Object.entries(report.claimsByType).map(([name, value]) => ({
    name,
    value,
  }));

  const claimsByStatusData: ChartDataPoint[] = Object.entries(report.claimsByStatus).map(([name, value]) => ({
    name,
    value,
  }));

  const claimsByMonthData: ChartDataPoint[] = report.claimsByMonth.map(({ month, count }) => ({
    name: month,
    value: count,
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Claims Reports</h2>
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
            <SelectItem value="yearly">Yearly</SelectItem>
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
              <p className="text-sm font-medium text-muted-foreground">Total Claims</p>
              <p className="text-2xl font-bold">{report.totalClaims.toLocaleString()}</p>
            </div>
            <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 text-sm font-bold">📊</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Pending Claims</p>
              <p className="text-2xl font-bold text-yellow-600">{report.pendingClaims.toLocaleString()}</p>
            </div>
            <div className="h-8 w-8 bg-yellow-100 rounded-full flex items-center justify-center">
              <span className="text-yellow-600 text-sm font-bold">⏳</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Approved Claims</p>
              <p className="text-2xl font-bold text-green-600">{report.approvedClaims.toLocaleString()}</p>
            </div>
            <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-600 text-sm font-bold">✅</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Avg Processing Time</p>
              <p className="text-2xl font-bold">{report.averageProcessingTime} days</p>
            </div>
            <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
              <span className="text-purple-600 text-sm font-bold">⏱️</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Claims by Type */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Claims by Type</h3>
          <div className="space-y-3">
            {claimsByTypeData.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <span className="text-sm font-medium">{item.name}</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${(item.value / Math.max(...claimsByTypeData.map(d => d.value))) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground w-12 text-right">{item.value}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Claims by Status */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Claims by Status</h3>
          <div className="space-y-3">
            {claimsByStatusData.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant={getStatusColor(item.name)}>{item.name}</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: `${(item.value / Math.max(...claimsByStatusData.map(d => d.value))) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground w-12 text-right">{item.value}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Monthly Trends */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Monthly Claims Trend</h3>
        <div className="flex items-end gap-2 h-32">
          {claimsByMonthData.map((item) => (
            <div key={item.name} className="flex-1 flex flex-col items-center">
              <div
                className="w-full bg-blue-600 rounded-t"
                style={{ height: `${(item.value / Math.max(...claimsByMonthData.map(d => d.value))) * 100}%` }}
              />
              <span className="text-xs text-muted-foreground mt-1">{item.name}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Top Insurers */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Top Insurers</h3>
        <div className="space-y-3">
          {report.topInsurers.map((insurer, index) => (
            <div key={insurer.name} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-muted-foreground w-6">#{index + 1}</span>
                <span className="font-medium">{insurer.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${(insurer.count / Math.max(...report.topInsurers.map(i => i.count))) * 100}%` }}
                  />
                </div>
                <span className="text-sm text-muted-foreground w-12 text-right">{insurer.count}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
} 