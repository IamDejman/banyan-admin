'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { Download, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

// Mock data for settlement trends
const settlementTrends = [
  { month: 'Jan', amount: 125000, count: 35, avgTime: 4.2 },
  { month: 'Feb', amount: 145000, count: 42, avgTime: 3.8 },
  { month: 'Mar', amount: 135000, count: 38, avgTime: 4.0 },
  { month: 'Apr', amount: 155000, count: 45, avgTime: 3.7 },
  { month: 'May', amount: 165000, count: 50, avgTime: 3.5 },
  { month: 'Jun', amount: 158000, count: 48, avgTime: 3.6 },
];

// Mock data for payment methods
const paymentMethods = [
  { method: 'Bank Transfer', count: 156, amount: 425000 },
  { method: 'Check', count: 89, amount: 245000 },
  { method: 'Wire Transfer', count: 45, amount: 125000 },
];

// Mock data for processing times
const processingTimes = [
  { range: '0-2 days', count: 45 },
  { range: '3-5 days', count: 89 },
  { range: '6-10 days', count: 42 },
  { range: '11+ days', count: 12 },
];

export default function SettlementTrendsPage() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Settlement Trends</h1>
            <p className="text-muted-foreground">
              Analysis of settlement patterns and processing times
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <DateRangePicker />
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Settlements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">258</div>
            <p className="text-xs text-muted-foreground">
              +8.3% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$883,000</div>
            <p className="text-xs text-muted-foreground">
              +12.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Settlement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$3,422</div>
            <p className="text-xs text-muted-foreground">
              +3.5% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Processing Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3.8 days</div>
            <p className="text-xs text-muted-foreground">
              -0.4 days from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Settlement Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {settlementTrends.map((item) => (
              <div key={item.month} className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between p-3 border rounded-lg">
                <div className="space-y-1">
                  <p className="text-sm font-medium">{item.month}</p>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      ${item.amount.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">Amount</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{item.count}</p>
                    <p className="text-xs text-muted-foreground">Count</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{item.avgTime} days</p>
                    <p className="text-xs text-muted-foreground">Avg Time</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Payment Methods */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Methods</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {paymentMethods.map((item) => (
              <div key={item.method} className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between p-3 border rounded-lg">
                <div className="space-y-1">
                  <p className="text-sm font-medium">{item.method}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.count} settlements
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">
                    ${item.amount.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {((item.amount / 883000) * 100).toFixed(1)}% of total
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Processing Times */}
      <Card>
        <CardHeader>
          <CardTitle>Processing Time Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {processingTimes.map((item) => (
              <div key={item.range} className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between p-3 border rounded-lg">
                <div className="space-y-1">
                  <p className="text-sm font-medium">{item.range}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{item.count}</p>
                  <p className="text-xs text-muted-foreground">
                    {((item.count / 188) * 100).toFixed(1)}% of total
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 