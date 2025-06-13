'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Notification, NotificationType } from '@/lib/types/notification';
import { Plus, Mail, MessageSquare, Bell, BarChart2 } from 'lucide-react';

// Mock data - replace with API calls
const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'EMAIL',
    status: 'SENT',
    priority: 'HIGH',
    subject: 'Important System Update',
    content: 'We are performing system maintenance...',
    recipients: {
      type: 'ALL',
      ids: [],
    },
    sentAt: '2024-03-15T10:00:00Z',
    createdAt: '2024-03-15T09:00:00Z',
    createdBy: 'Admin',
    analytics: {
      totalRecipients: 1000,
      delivered: 980,
      failed: 20,
      opened: 750,
      clicked: 300,
      bounceRate: 2,
      openRate: 76.5,
      clickRate: 30.6,
    },
  },
  {
    id: '2',
    type: 'SMS',
    status: 'SCHEDULED',
    priority: 'MEDIUM',
    subject: 'Appointment Reminder',
    content: 'Your appointment is scheduled for tomorrow...',
    recipients: {
      type: 'GROUP',
      ids: ['group1'],
    },
    scheduledFor: '2024-03-16T09:00:00Z',
    createdAt: '2024-03-15T11:00:00Z',
    createdBy: 'Admin',
  },
];

const statusColors = {
  DRAFT: 'bg-gray-100 text-gray-800',
  SCHEDULED: 'bg-blue-100 text-blue-800',
  SENDING: 'bg-yellow-100 text-yellow-800',
  SENT: 'bg-green-100 text-green-800',
  FAILED: 'bg-red-100 text-red-800',
};

const typeIcons = {
  EMAIL: Mail,
  SMS: MessageSquare,
  PUSH: Bell,
};

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState<NotificationType>('EMAIL');
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);

  const handleCreateNotification = (type: NotificationType) => {
    // TODO: Implement navigation to notification composer
    console.log(`Create ${type} notification`);
  };

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Notifications</h1>
          <p className="text-muted-foreground">
            Manage and send notifications to users
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => handleCreateNotification(activeTab)} className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            New Notification
          </Button>
        </div>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sent</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Rate</CardTitle>
            <BarChart2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">76.5%</div>
            <p className="text-xs text-muted-foreground">
              +2.3% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Click Rate</CardTitle>
            <BarChart2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">30.6%</div>
            <p className="text-xs text-muted-foreground">
              +1.2% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as NotificationType)}>
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="EMAIL" className="flex-1 sm:flex-none">
            <Mail className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Email</span>
          </TabsTrigger>
          <TabsTrigger value="SMS" className="flex-1 sm:flex-none">
            <MessageSquare className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">SMS</span>
          </TabsTrigger>
          <TabsTrigger value="PUSH" className="flex-1 sm:flex-none">
            <Bell className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Push</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Notifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {notifications
                  .filter((n) => n.type === activeTab)
                  .map((notification) => {
                    const Icon = typeIcons[notification.type];
                    return (
                      <div
                        key={notification.id}
                        className="flex flex-col sm:flex-row sm:items-start justify-between p-4 border rounded-lg gap-4"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4 text-muted-foreground" />
                            <h3 className="font-medium">{notification.subject}</h3>
                            <Badge
                              className={
                                statusColors[
                                  notification.status as keyof typeof statusColors
                                ]
                              }
                            >
                              {notification.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {notification.content}
                          </p>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-muted-foreground">
                            <span>
                              Sent:{' '}
                              {new Date(
                                notification.sentAt || notification.createdAt
                              ).toLocaleString()}
                            </span>
                            {notification.analytics && (
                              <>
                                <span>
                                  Delivered: {notification.analytics.delivered}
                                </span>
                                <span>
                                  Opened: {notification.analytics.opened}
                                </span>
                                <span>
                                  Clicked: {notification.analytics.clicked}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 