'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Benchmark, Metric } from '@/lib/types/analytics';
import { ArrowUp, ArrowDown, Minus, Download, RefreshCw } from 'lucide-react';

// Mock data - replace with API calls
const mockMetrics: Metric[] = [
  {
    id: '1',
    name: 'Average Processing Time',
    description: 'Average time to process a claim',
    value: 2.5,
    previousValue: 3.0,
    change: -0.5,
    changeType: 'decrease',
    unit: 'days',
    category: 'Performance',
    timestamp: '2024-03-15T10:00:00Z',
  },
  {
    id: '2',
    name: 'Approval Rate',
    description: 'Percentage of claims approved',
    value: 85,
    previousValue: 82,
    change: 3,
    changeType: 'increase',
    unit: '%',
    category: 'Efficiency',
    timestamp: '2024-03-15T10:00:00Z',
  },
];

const mockBenchmarks: Benchmark[] = [
  {
    id: '1',
    name: 'Processing Time Target',
    description: 'Target processing time for standard claims',
    value: 3.0,
    target: 3.0,
    actual: 2.5,
    variance: -0.5,
    status: 'above',
    category: 'Performance',
    timestamp: '2024-03-15T10:00:00Z',
  },
  {
    id: '2',
    name: 'Approval Rate Target',
    description: 'Target approval rate for claims',
    value: 90,
    target: 90,
    actual: 85,
    variance: -5,
    status: 'below',
    category: 'Efficiency',
    timestamp: '2024-03-15T10:00:00Z',
  },
];

const statusColors = {
  above: 'bg-green-100 text-green-800',
  below: 'bg-red-100 text-red-800',
  meeting: 'bg-blue-100 text-blue-800',
};

const changeIcons = {
  increase: <ArrowUp className="h-4 w-4 text-green-600" />,
  decrease: <ArrowDown className="h-4 w-4 text-red-600" />,
  neutral: <Minus className="h-4 w-4 text-gray-600" />,
};

export default function BenchmarksPage() {
  const [metrics, setMetrics] = useState<Metric[]>(mockMetrics);
  const [benchmarks, setBenchmarks] = useState<Benchmark[]>(mockBenchmarks);

  const handleRefresh = async () => {
    // TODO: Implement API call to refresh data
    // For now, just simulate a refresh
    await new Promise((resolve) => setTimeout(resolve, 1000));
  };

  const handleExport = async (format: 'pdf' | 'excel' | 'csv') => {
    // TODO: Implement export functionality
    console.log(`Exporting to ${format}...`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Performance Benchmarks</h1>
          <p className="text-muted-foreground">
            Track and compare performance metrics against targets
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" onClick={() => handleExport('pdf')}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {metrics.map((metric) => (
          <Card key={metric.id}>
            <CardHeader>
              <CardTitle className="text-lg">{metric.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-bold">
                    {metric.value}
                    {metric.unit}
                  </span>
                  <div className="flex items-center gap-1">
                    {changeIcons[metric.changeType]}
                    <span
                      className={
                        metric.changeType === 'increase'
                          ? 'text-green-600'
                          : metric.changeType === 'decrease'
                          ? 'text-red-600'
                          : 'text-gray-600'
                      }
                    >
                      {Math.abs(metric.change)}
                      {metric.unit}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  {metric.description}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Benchmark Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {benchmarks.map((benchmark) => (
              <div
                key={benchmark.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{benchmark.name}</h3>
                    <Badge
                      className={
                        statusColors[benchmark.status as keyof typeof statusColors]
                      }
                    >
                      {benchmark.status.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {benchmark.description}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-medium">
                    {benchmark.actual} / {benchmark.target}
                  </div>
                  <div
                    className={`text-sm ${
                      benchmark.variance < 0
                        ? 'text-red-600'
                        : benchmark.variance > 0
                        ? 'text-green-600'
                        : 'text-gray-600'
                    }`}
                  >
                    {benchmark.variance > 0 ? '+' : ''}
                    {benchmark.variance} variance
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 