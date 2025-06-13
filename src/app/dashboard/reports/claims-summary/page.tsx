'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { Download, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

// Mock data for claims by status
const claimsByStatus = [
  { status: 'Pending Review', count: 45, amount: 125000 },
  { status: 'Under Review', count: 28, amount: 75000 },
  { status: 'Approved', count: 156, amount: 425000 },
  { status: 'Rejected', count: 12, amount: 35000 },
  { status: 'Settled', count: 89, amount: 245000 },
];

// Mock data for claims by type
const claimsByType = [
  { type: 'Property Damage', count: 120, amount: 350000 },
  { type: 'Liability', count: 85, amount: 225000 },
  { type: 'Medical', count: 65, amount: 175000 },
  { type: 'Other', count: 45, amount: 125000 },
];

// Mock data for monthly trends
const monthlyTrends = [
  { month: 'Jan', claims: 45, settlements: 35 },
  { month: 'Feb', claims: 52, settlements: 42 },
  { month: 'Mar', claims: 48, settlements: 38 },
  { month: 'Apr', claims: 55, settlements: 45 },
  { month: 'May', claims: 62, settlements: 50 },
  { month: 'Jun', claims: 58, settlements: 48 },
];

export default function ClaimsSummaryPage() {
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
            <h1 className="text-3xl font-bold tracking-tight">Claims Summary Report</h1>
            <p className="text-muted-foreground">
              Detailed analysis of claims data and trends
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
            <CardTitle className="text-sm font-medium">Total Claims</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">330</div>
            <p className="text-xs text-muted-foreground">
              +12.3% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$905,000</div>
            <p className="text-xs text-muted-foreground">
              +8.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Claim</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$2,742</div>
            <p className="text-xs text-muted-foreground">
              -2.3% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Processing Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.2 days</div>
            <p className="text-xs text-muted-foreground">
              -0.5 days from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Claims by Status */}
      <Card>
        <CardHeader>
          <CardTitle>Claims by Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {claimsByStatus.map((item) => (
              <div key={item.status} className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between p-3 border rounded-lg">
                <div className="space-y-1">
                  <p className="text-sm font-medium">{item.status}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.count} claims
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">
                    ${item.amount.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {((item.amount / 905000) * 100).toFixed(1)}% of total
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Claims by Type */}
      <Card>
        <CardHeader>
          <CardTitle>Claims by Type</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {claimsByType.map((item) => (
              <div key={item.type} className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between p-3 border rounded-lg">
                <div className="space-y-1">
                  <p className="text-sm font-medium">{item.type}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.count} claims
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">
                    ${item.amount.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {((item.amount / 905000) * 100).toFixed(1)}% of total
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Monthly Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {monthlyTrends.map((item) => (
              <div key={item.month} className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between p-3 border rounded-lg">
                <div className="space-y-1">
                  <p className="text-sm font-medium">{item.month}</p>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
                  <div className="text-right">
                    <p className="text-sm font-medium">{item.claims}</p>
                    <p className="text-xs text-muted-foreground">Claims</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{item.settlements}</p>
                    <p className="text-xs text-muted-foreground">Settlements</p>
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