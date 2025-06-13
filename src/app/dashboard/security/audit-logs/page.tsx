'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { AuditLog } from '@/lib/types/security';
import { History, Search, Shield, User } from 'lucide-react';

// Mock data - replace with API calls
const mockAuditLogs: AuditLog[] = [
  {
    id: '1',
    userId: 'user1',
    userName: 'John Doe',
    action: 'LOGIN',
    resource: 'auth',
    resourceId: 'session1',
    details: {
      success: true,
      method: 'password',
    },
    ipAddress: '192.168.1.1',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    timestamp: '2024-03-15T10:00:00Z',
  },
  {
    id: '2',
    userId: 'user2',
    userName: 'Jane Smith',
    action: 'UPDATE_ROLE',
    resource: 'roles',
    resourceId: 'role1',
    details: {
      changes: {
        permissions: ['ADDED: manage_users', 'REMOVED: view_reports'],
      },
    },
    ipAddress: '192.168.1.2',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    timestamp: '2024-03-15T09:30:00Z',
  },
];

const actionColors = {
  LOGIN: 'bg-blue-100 text-blue-800',
  LOGOUT: 'bg-gray-100 text-gray-800',
  CREATE: 'bg-green-100 text-green-800',
  UPDATE: 'bg-yellow-100 text-yellow-800',
  DELETE: 'bg-red-100 text-red-800',
  UPDATE_ROLE: 'bg-purple-100 text-purple-800',
  UPDATE_PERMISSION: 'bg-indigo-100 text-indigo-800',
};

export default function AuditLogsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(mockAuditLogs);

  const filteredLogs = auditLogs.filter(
    (log) =>
      log.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.resource.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Audit Logs</h1>
        <p className="text-muted-foreground">
          Track and monitor security-related activities
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Input
            placeholder="Search logs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredLogs.map((log) => (
              <div
                key={log.id}
                className="flex items-start justify-between p-4 border rounded-lg"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge
                      className={
                        actionColors[log.action as keyof typeof actionColors]
                      }
                    >
                      {log.action}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {new Date(log.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>{log.userName}</span>
                    <Shield className="h-4 w-4 text-muted-foreground ml-2" />
                    <span>{log.resource}</span>
                    {log.resourceId && (
                      <span className="text-muted-foreground">
                        (ID: {log.resourceId})
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    IP: {log.ipAddress}
                  </div>
                </div>
                <History className="h-4 w-4 text-muted-foreground" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 