'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, AlertCircle, Send } from 'lucide-react';

// Mock data
const claimDetails = {
  id: 'CLM-001',
  clientName: 'John Doe',
  type: 'AUTO',
  description: 'Vehicle damage from collision with another car',
  amount: 5000,
  documents: [
    { id: 1, name: 'Accident Report', status: 'VERIFIED' },
    { id: 2, name: 'Vehicle Photos', status: 'PENDING' },
    { id: 3, name: 'Insurance Policy', status: 'VERIFIED' },
    { id: 4, name: 'Repair Estimate', status: 'NEEDS_REVIEW' },
  ],
};

interface ClaimReviewClientProps {
  claimId: string;
}

export default function ClaimReviewClient({ claimId }: ClaimReviewClientProps) {
  const router = useRouter();
  const [outcome, setOutcome] = useState<string>('');
  const [notes, setNotes] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!outcome) {
      setError('Please select a review outcome');
      return;
    }

    if (!notes) {
      setError('Please provide review notes');
      return;
    }

    if (outcome === 'NEEDS_INFO' && !additionalInfo) {
      setError('Please specify what additional information is needed');
      return;
    }

    // For demo purposes, just go back to claim details
    router.push(`/dashboard/claims/${claimId}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Review Claim</h1>
          <p className="text-muted-foreground">
            Claim ID: {claimDetails.id}
          </p>
        </div>
        <Button variant="outline" onClick={() => router.back()}>
          Cancel
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
                <Label>Description</Label>
                <p className="text-sm">{claimDetails.description}</p>
              </div>
              <div>
                <Label>Amount</Label>
                <p className="text-sm">${claimDetails.amount.toLocaleString()}</p>
              </div>
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
          <CardTitle>Review Decision</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label>Review Outcome</Label>
              <Select value={outcome} onValueChange={setOutcome}>
                <SelectTrigger>
                  <SelectValue placeholder="Select outcome" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="APPROVED">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Approve Claim</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="REJECTED">
                    <div className="flex items-center gap-2">
                      <XCircle className="h-4 w-4 text-red-500" />
                      <span>Reject Claim</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="NEEDS_INFO">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-yellow-500" />
                      <span>Request Additional Information</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Review Notes</Label>
              <Textarea
                placeholder="Enter your review notes..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="min-h-[100px]"
              />
            </div>

            {outcome === 'NEEDS_INFO' && (
              <div className="space-y-2">
                <Label>Required Information</Label>
                <Textarea
                  placeholder="Specify what additional information is needed..."
                  value={additionalInfo}
                  onChange={(e) => setAdditionalInfo(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
            )}

            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit" className="gap-2">
                <Send className="h-4 w-4" />
                Submit Review
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 