'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  FileText,
  Clock,
  User,
  Building,
  DollarSign,
  MessageSquare,
  History,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowLeft,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';

// Mock data
const claimDetails = {
  id: 'CLM-001',
  clientName: 'John Doe',
  submissionDate: '2024-03-15',
  status: 'PENDING',
  type: 'AUTO',
  priority: 'HIGH',
  assignedTo: 'Sarah Wilson',
  documentCompletion: 75,
  lastUpdated: '2024-03-15 14:30',
  description: 'Vehicle damage from collision with another car',
  amount: 5000,
  documents: [
    { id: 1, name: 'Accident Report', status: 'VERIFIED', uploadedAt: '2024-03-15 10:00' },
    { id: 2, name: 'Vehicle Photos', status: 'PENDING', uploadedAt: '2024-03-15 10:05' },
    { id: 3, name: 'Insurance Policy', status: 'VERIFIED', uploadedAt: '2024-03-15 10:10' },
    { id: 4, name: 'Repair Estimate', status: 'NEEDS_REVIEW', uploadedAt: '2024-03-15 11:00' },
  ],
  timeline: [
    { id: 1, action: 'Claim Submitted', timestamp: '2024-03-15 10:00', user: 'John Doe' },
    { id: 2, action: 'Documents Uploaded', timestamp: '2024-03-15 11:00', user: 'John Doe' },
    { id: 3, action: 'Assigned to Agent', timestamp: '2024-03-15 12:00', user: 'System' },
    { id: 4, action: 'Initial Review Started', timestamp: '2024-03-15 14:30', user: 'Sarah Wilson' },
  ],
  communications: [
    { id: 1, type: 'EMAIL', subject: 'Claim Submission Confirmation', timestamp: '2024-03-15 10:01', status: 'SENT' },
    { id: 2, type: 'SMS', subject: 'Document Upload Reminder', timestamp: '2024-03-15 11:30', status: 'SENT' },
  ],
};

const statusColors = {
  PENDING: 'bg-yellow-500',
  IN_REVIEW: 'bg-blue-500',
  APPROVED: 'bg-green-500',
  REJECTED: 'bg-red-500',
};

const documentStatusColors = {
  VERIFIED: 'bg-green-500',
  PENDING: 'bg-yellow-500',
  NEEDS_REVIEW: 'bg-red-500',
};

const priorityColors = {
  LOW: 'bg-blue-500',
  MEDIUM: 'bg-yellow-500',
  HIGH: 'bg-red-500',
};

export default function ClaimDetailsPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState('overview');
  const router = useRouter();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Claim Details</h1>
            <p className="text-muted-foreground">Claim ID: {claimDetails.id}</p>
          </div>
        </div>
        <Button onClick={() => router.push(`/dashboard/claims/${params.id}/review`)}>
          Review Claim
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Claim Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>Client Name</Label>
                <p className="text-sm">{claimDetails.clientName}</p>
              </div>
              <div>
                <Label>Claim Type</Label>
                <p className="text-sm">{claimDetails.type}</p>
              </div>
              <div>
                <Label>Status</Label>
                <Badge
                  className={cn(
                    'capitalize',
                    statusColors[claimDetails.status as keyof typeof statusColors]
                  )}
                >
                  {claimDetails.status.toLowerCase().replace('_', ' ')}
                </Badge>
              </div>
              <div>
                <Label>Priority</Label>
                <Badge
                  variant="secondary"
                  className={cn(
                    'capitalize',
                    priorityColors[claimDetails.priority as keyof typeof priorityColors]
                  )}
                >
                  {claimDetails.priority.toLowerCase()}
                </Badge>
              </div>
              <div>
                <Label>Amount</Label>
                <p className="text-sm">${claimDetails.amount.toLocaleString()}</p>
              </div>
              <div>
                <Label>Assigned To</Label>
                <p className="text-sm">{claimDetails.assignedTo}</p>
              </div>
            </div>
            <div>
              <Label>Description</Label>
              <p className="text-sm">{claimDetails.description}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Document Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {claimDetails.documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <span className="text-sm">{doc.name}</span>
                  <Badge
                    variant="secondary"
                    className={
                      doc.status === 'VERIFIED'
                        ? 'bg-green-500'
                        : doc.status === 'PENDING'
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                    }
                  >
                    {doc.status.replace('_', ' ')}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {claimDetails.timeline.map((event, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  {index !== claimDetails.timeline.length - 1 && (
                    <div className="w-0.5 h-full bg-border" />
                  )}
                </div>
                <div className="flex-1 pb-4">
                  <p className="text-sm font-medium">{event.action}</p>
                  <p className="text-sm text-muted-foreground">
                    {event.timestamp}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Communications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {claimDetails.communications.map((comm, index) => (
              <div
                key={index}
                className="flex flex-col gap-2 p-4 border rounded-lg"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <MessageSquare className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{comm.type}</p>
                      <p className="text-xs text-muted-foreground">
                        {comm.timestamp}
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary">{comm.status}</Badge>
                </div>
                <p className="text-sm">{comm.subject}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 