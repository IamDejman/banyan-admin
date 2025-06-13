'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { Download, ArrowLeft, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Mock data for audit logs
const auditLogs = [
  {
    id: 1,
    timestamp: '2024-03-15 14:30:22',
    user: 'John Doe',
    action: 'Created Claim',
    details: 'Created new claim #CLM-2024-001',
    entity: 'Claim',
    entityId: 'CLM-2024-001',
  },
  {
    id: 2,
    timestamp: '2024-03-15 14:35:45',
    user: 'Jane Smith',
    action: 'Updated Claim',
    details: 'Updated claim status to Under Review',
    entity: 'Claim',
    entityId: 'CLM-2024-001',
  },
  {
    id: 3,
    timestamp: '2024-03-15 15:20:10',
    user: 'Mike Johnson',
    action: 'Created Settlement',
    details: 'Created settlement for claim #CLM-2024-001',
    entity: 'Settlement',
    entityId: 'SET-2024-001',
  },
  {
    id: 4,
    timestamp: '2024-03-15 16:05:33',
    user: 'Sarah Wilson',
    action: 'Approved Settlement',
    details: 'Approved settlement #SET-2024-001',
    entity: 'Settlement',
    entityId: 'SET-2024-001',
  },
  {
    id: 5,
    timestamp: '2024-03-15 16:30:15',
    user: 'John Doe',
    action: 'Processed Payment',
    details: 'Processed payment for settlement #SET-2024-001',
    entity: 'Payment',
    entityId: 'PAY-2024-001',
  },
];

// Mock data for activity types
const activityTypes = [
  'All Activities',
  'Claim Activities',
  'Settlement Activities',
  'Payment Activities',
  'User Activities',
];

export default function AuditTrailPage() {
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
            <h1 className="text-3xl font-bold tracking-tight">Audit Trail</h1>
            <p className="text-muted-foreground">
              Detailed log of all system activities and changes
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <DateRangePicker />
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Export Log
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Activity Type</label>
              <Select defaultValue="all">
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select activity type" />
                </SelectTrigger>
                <SelectContent>
                  {activityTypes.map((type) => (
                    <SelectItem key={type} value={type.toLowerCase().replace(' ', '-')}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">User</label>
              <Input placeholder="Search by user" className="w-full" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Entity ID</label>
              <Input placeholder="Search by ID" className="w-full" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Action</label>
              <Input placeholder="Search by action" className="w-full" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Audit Logs */}
      <Card>
        <CardHeader>
          <CardTitle>Activity Log</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {auditLogs.map((log) => (
              <div
                key={log.id}
                className="flex flex-col gap-2 p-4 border rounded-lg"
              >
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-2">
                    <span className="text-sm font-medium">{log.action}</span>
                    <span className="text-xs text-muted-foreground">
                      by {log.user}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {log.timestamp}
                  </span>
                </div>
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm">{log.details}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {log.entity}
                    </span>
                    <span className="text-xs font-medium">{log.entityId}</span>
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