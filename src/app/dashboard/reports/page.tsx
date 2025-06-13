'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { Download, BarChart3, LineChart, PieChart, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

// Mock data for metrics
const metrics = [
  {
    title: 'Total Claims',
    value: '1,234',
    change: '+12.3%',
    trend: 'up',
  },
  {
    title: 'Total Settlements',
    value: '$2.5M',
    change: '+8.1%',
    trend: 'up',
  },
  {
    title: 'Average Processing Time',
    value: '4.2 days',
    change: '-1.5 days',
    trend: 'down',
  },
  {
    title: 'Approval Rate',
    value: '92%',
    change: '+2.3%',
    trend: 'up',
  },
];

// Mock data for report types
const reportTypes = [
  {
    id: 'claims-summary',
    title: 'Claims Summary',
    description: 'Overview of claims by status, type, and amount',
    icon: BarChart3,
  },
  {
    id: 'settlement-trends',
    title: 'Settlement Trends',
    description: 'Analysis of settlement patterns and processing times',
    icon: LineChart,
  },
  {
    id: 'payment-analysis',
    title: 'Payment Analysis',
    description: 'Breakdown of payment methods and processing times',
    icon: PieChart,
  },
  {
    id: 'audit-trail',
    title: 'Audit Trail',
    description: 'Detailed log of all system activities and changes',
    icon: FileText,
  },
];

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [selectedReport, setSelectedReport] = useState<string>('');

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
          <p className="text-muted-foreground">
            Generate and analyze reports for claims and settlements
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <DateRangePicker
            value={dateRange}
            onChange={setDateRange}
          />
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <Card key={metric.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {metric.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <p className={cn(
                'text-xs',
                metric.trend === 'up' ? 'text-green-500' : 'text-red-500'
              )}>
                {metric.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Report Types */}
      <div className="grid gap-4 md:grid-cols-2">
        {reportTypes.map((report) => (
          <Card
            key={report.id}
            className={cn(
              'cursor-pointer transition-colors hover:bg-muted/50',
              selectedReport === report.id && 'border-primary'
            )}
            onClick={() => setSelectedReport(report.id)}
          >
            <CardHeader>
              <div className="flex items-center gap-2">
                <report.icon className="h-5 w-5" />
                <CardTitle className="text-base sm:text-lg">{report.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {report.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Report Configuration */}
      {selectedReport && (
        <Card>
          <CardHeader>
            <CardTitle>Configure Report</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Report Format</label>
                <Select defaultValue="pdf">
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="excel">Excel</SelectItem>
                    <SelectItem value="csv">CSV</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Group By</label>
                <Select defaultValue="month">
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select grouping" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="day">Day</SelectItem>
                    <SelectItem value="week">Week</SelectItem>
                    <SelectItem value="month">Month</SelectItem>
                    <SelectItem value="quarter">Quarter</SelectItem>
                    <SelectItem value="year">Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
              <Button variant="outline" className="w-full sm:w-auto">Cancel</Button>
              <Button className="w-full sm:w-auto">
                <Download className="mr-2 h-4 w-4" />
                Generate Report
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 