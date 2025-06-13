'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { Download, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

// Mock data for payment methods
const paymentMethods = [
  { method: 'Bank Transfer', count: 156, amount: 425000, avgTime: 3.2 },
  { method: 'Check', count: 89, amount: 245000, avgTime: 4.5 },
  { method: 'Wire Transfer', count: 45, amount: 125000, avgTime: 2.8 },
];

// Mock data for payment trends
const paymentTrends = [
  { month: 'Jan', bankTransfer: 35, check: 15, wireTransfer: 8 },
  { month: 'Feb', bankTransfer: 42, check: 18, wireTransfer: 10 },
  { month: 'Mar', bankTransfer: 38, check: 16, wireTransfer: 9 },
  { month: 'Apr', bankTransfer: 45, check: 20, wireTransfer: 12 },
  { month: 'May', bankTransfer: 50, check: 22, wireTransfer: 15 },
  { month: 'Jun', bankTransfer: 48, check: 21, wireTransfer: 14 },
];

// Mock data for processing times
const processingTimes = [
  { method: 'Bank Transfer', '0-2 days': 45, '3-5 days': 89, '6+ days': 22 },
  { method: 'Check', '0-2 days': 12, '3-5 days': 45, '6+ days': 32 },
  { method: 'Wire Transfer', '0-2 days': 35, '3-5 days': 8, '6+ days': 2 },
];

export default function PaymentAnalysisPage() {
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
            <h1 className="text-3xl font-bold tracking-tight">Payment Analysis</h1>
            <p className="text-muted-foreground">
              Detailed analysis of payment methods and processing times
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
            <CardTitle className="text-sm font-medium">Total Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">290</div>
            <p className="text-xs text-muted-foreground">
              +10.3% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$795,000</div>
            <p className="text-xs text-muted-foreground">
              +8.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Payment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$2,741</div>
            <p className="text-xs text-muted-foreground">
              -2.3% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Processing Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3.5 days</div>
            <p className="text-xs text-muted-foreground">
              -0.3 days from last month
            </p>
          </CardContent>
        </Card>
      </div>

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
                    {item.count} payments
                  </p>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      ${item.amount.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">Amount</p>
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

      {/* Monthly Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Payment Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {paymentTrends.map((item) => (
              <div key={item.month} className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between p-3 border rounded-lg">
                <div className="space-y-1">
                  <p className="text-sm font-medium">{item.month}</p>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
                  <div className="text-right">
                    <p className="text-sm font-medium">{item.bankTransfer}</p>
                    <p className="text-xs text-muted-foreground">Bank Transfer</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{item.check}</p>
                    <p className="text-xs text-muted-foreground">Check</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{item.wireTransfer}</p>
                    <p className="text-xs text-muted-foreground">Wire Transfer</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Processing Times */}
      <Card>
        <CardHeader>
          <CardTitle>Processing Time by Method</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {processingTimes.map((item) => (
              <div key={item.method} className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between p-3 border rounded-lg">
                <div className="space-y-1">
                  <p className="text-sm font-medium">{item.method}</p>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
                  <div className="text-right">
                    <p className="text-sm font-medium">{item['0-2 days']}</p>
                    <p className="text-xs text-muted-foreground">0-2 days</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{item['3-5 days']}</p>
                    <p className="text-xs text-muted-foreground">3-5 days</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{item['6+ days']}</p>
                    <p className="text-xs text-muted-foreground">6+ days</p>
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