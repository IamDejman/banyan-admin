'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { NotificationType, NotificationAnalytics } from '@/lib/types/notification';
import { BarChart2, Mail, MessageSquare, Bell } from 'lucide-react';

// Mock data - replace with API calls
const mockAnalytics: Record<NotificationType, NotificationAnalytics> = {
  EMAIL: {
    totalSent: 1000,
    delivered: 980,
    failed: 20,
    opened: 750,
    clicked: 300,
    bounceRate: 2,
    openRate: 76.5,
    clickRate: 30.6,
  },
  SMS: {
    totalSent: 500,
    delivered: 490,
    failed: 10,
    opened: 400,
    clicked: 150,
    bounceRate: 2,
    openRate: 81.6,
    clickRate: 30.6,
  },
  PUSH: {
    totalSent: 200,
    delivered: 195,
    failed: 5,
    opened: 120,
    clicked: 60,
    bounceRate: 2.5,
    openRate: 61.5,
    clickRate: 30.8,
  },
};

interface NotificationAnalyticsProps {
  type: NotificationType;
}

export function NotificationAnalytics({ type }: NotificationAnalyticsProps) {
  const analytics = mockAnalytics[type];

  const typeIcons = {
    EMAIL: Mail,
    SMS: MessageSquare,
    PUSH: Bell,
  };

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sent</CardTitle>
            <BarChart2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalSent}</div>
            <p className="text-xs text-muted-foreground">
              {analytics.delivered} delivered, {analytics.failed} failed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Rate</CardTitle>
            <BarChart2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.openRate}%</div>
            <p className="text-xs text-muted-foreground">
              {analytics.opened} opened
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Click Rate</CardTitle>
            <BarChart2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.clickRate}%</div>
            <p className="text-xs text-muted-foreground">
              {analytics.clicked} clicked
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bounce Rate</CardTitle>
            <BarChart2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.bounceRate}%</div>
            <p className="text-xs text-muted-foreground">
              {analytics.failed} failed deliveries
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Performance by Type</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(mockAnalytics).map(([type, stats]) => {
              const Icon = typeIcons[type as NotificationType];
              return (
                <div
                  key={type}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg gap-4"
                >
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">
                      {type.charAt(0) + type.slice(1).toLowerCase()}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 sm:flex sm:items-center sm:gap-8">
                    <div className="text-center">
                      <div className="text-sm font-medium">
                        {stats.openRate}%
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Open Rate
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-medium">
                        {stats.clickRate}%
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Click Rate
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-medium">
                        {stats.bounceRate}%
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Bounce Rate
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 