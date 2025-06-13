'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Session } from '@/lib/types/security';
import { useToast } from '@/components/ui/use-toast';
import { Clock, LogOut, Search, User } from 'lucide-react';

// Mock data - replace with API calls
const mockSessions: Session[] = [
  {
    id: '1',
    userId: 'user1',
    userName: 'John Doe',
    email: 'john@example.com',
    role: 'Admin',
    lastActive: '2024-03-15T10:00:00Z',
    ipAddress: '192.168.1.1',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    status: 'ACTIVE',
    createdAt: '2024-03-15T09:00:00Z',
    expiresAt: '2024-03-15T11:00:00Z',
  },
  {
    id: '2',
    userId: 'user2',
    userName: 'Jane Smith',
    email: 'jane@example.com',
    role: 'Claims Manager',
    lastActive: '2024-03-15T09:30:00Z',
    ipAddress: '192.168.1.2',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    status: 'EXPIRED',
    createdAt: '2024-03-15T08:30:00Z',
    expiresAt: '2024-03-15T09:30:00Z',
  },
];

const statusColors = {
  ACTIVE: 'bg-green-100 text-green-800',
  EXPIRED: 'bg-gray-100 text-gray-800',
  TERMINATED: 'bg-red-100 text-red-800',
};

export default function SessionsPage() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [sessions, setSessions] = useState<Session[]>(mockSessions);

  const filteredSessions = sessions.filter(
    (session) =>
      session.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleTerminateSession = async (sessionId: string) => {
    try {
      // TODO: Implement API call to terminate session
      setSessions((prev) =>
        prev.map((session) =>
          session.id === sessionId
            ? { ...session, status: 'TERMINATED' }
            : session
        )
      );
      toast({
        title: 'Session terminated',
        description: 'The user session has been terminated successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to terminate session. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Session Management</h1>
        <p className="text-muted-foreground">
          Monitor and control user sessions
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Input
            placeholder="Search sessions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredSessions.map((session) => (
              <div
                key={session.id}
                className="flex items-start justify-between p-4 border rounded-lg"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{session.userName}</span>
                    <Badge
                      className={
                        statusColors[session.status as keyof typeof statusColors]
                      }
                    >
                      {session.status}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {session.email} • {session.role}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      Last active:{' '}
                      {new Date(session.lastActive).toLocaleString()}
                    </div>
                    <div>IP: {session.ipAddress}</div>
                  </div>
                </div>
                {session.status === 'ACTIVE' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleTerminateSession(session.id)}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Terminate
                  </Button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 