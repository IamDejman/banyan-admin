'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowLeft, Clock, User } from 'lucide-react';

// Mock data for claim and status history
const claim = {
  id: 'CLM-001',
  clientName: 'John Doe',
  type: 'MEDICAL_CLAIM',
  currentStatus: 'UNDER_REVIEW',
  description: 'Medical claim for emergency room visit',
};

const statusHistory = [
  {
    id: '1',
    status: 'RECEIVED',
    notes: 'Initial claim received',
    changedBy: 'System',
    changedAt: '2024-03-15 10:00',
  },
  {
    id: '2',
    status: 'UNDER_REVIEW',
    notes: 'Claim assigned for review',
    changedBy: 'Alice Johnson',
    changedAt: '2024-03-15 11:30',
  },
];

const availableStatuses = [
  'RECEIVED',
  'UNDER_REVIEW',
  'PENDING_DOCUMENTS',
  'DOCUMENTS_RECEIVED',
  'ASSESSMENT_COMPLETE',
  'OFFER_PENDING',
  'OFFER_ACCEPTED',
  'OFFER_REJECTED',
  'SETTLEMENT_PENDING',
  'SETTLEMENT_COMPLETE',
  'CLOSED',
];

const statusColors = {
  RECEIVED: 'bg-blue-100 text-blue-800',
  UNDER_REVIEW: 'bg-yellow-100 text-yellow-800',
  PENDING_DOCUMENTS: 'bg-orange-100 text-orange-800',
  DOCUMENTS_RECEIVED: 'bg-green-100 text-green-800',
  ASSESSMENT_COMPLETE: 'bg-purple-100 text-purple-800',
  OFFER_PENDING: 'bg-indigo-100 text-indigo-800',
  OFFER_ACCEPTED: 'bg-green-100 text-green-800',
  OFFER_REJECTED: 'bg-red-100 text-red-800',
  SETTLEMENT_PENDING: 'bg-yellow-100 text-yellow-800',
  SETTLEMENT_COMPLETE: 'bg-green-100 text-green-800',
  CLOSED: 'bg-gray-100 text-gray-800',
};

export default function StatusUpdatePage() {
  const router = useRouter();
  const [update, setUpdate] = useState({
    status: '',
    notes: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    router.push(`/dashboard/claims/${claim.id}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Update Claim Status</h1>
          <p className="text-muted-foreground">
            Update the status of this claim
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Claim Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Claim ID</span>
                <span className="text-sm">{claim.id}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Client</span>
                <span className="text-sm">{claim.clientName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Type</span>
                <span className="text-sm">
                  {claim.type.replace(/_/g, ' ')}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Current Status</span>
                <Badge
                  className={
                    statusColors[claim.currentStatus as keyof typeof statusColors]
                  }
                >
                  {claim.currentStatus.replace(/_/g, ' ')}
                </Badge>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <div className="rounded-md border p-3 text-sm">
                {claim.description}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status Update</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>New Status</Label>
              <Select
                value={update.status}
                onValueChange={(value) =>
                  setUpdate({ ...update, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select new status" />
                </SelectTrigger>
                <SelectContent>
                  {availableStatuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      <div className="flex items-center gap-2">
                        <Badge
                          className={
                            statusColors[status as keyof typeof statusColors]
                          }
                        >
                          {status.replace(/_/g, ' ')}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Update Notes</Label>
              <Textarea
                placeholder="Enter notes about this status update..."
                value={update.notes}
                onChange={(e) =>
                  setUpdate({ ...update, notes: e.target.value })
                }
              />
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button
                className="flex-1"
                disabled={!update.status || !update.notes || isSubmitting}
                onClick={handleSubmit}
              >
                {isSubmitting ? 'Updating...' : 'Update Status'}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Status History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {statusHistory.map((history) => (
                <div
                  key={history.id}
                  className="flex flex-col gap-2 p-4 border rounded-lg"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">
                        {history.changedAt}
                      </span>
                    </div>
                    <Badge
                      className={
                        statusColors[history.status as keyof typeof statusColors]
                      }
                    >
                      {history.status.replace(/_/g, ' ')}
                    </Badge>
                  </div>
                  <div className="text-sm">{history.notes}</div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="h-4 w-4" />
                    Changed by {history.changedBy}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 