'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowLeft } from 'lucide-react';


const claims = [
  {
    id: 'CLM-001',
    clientName: 'John Doe',
    type: 'MEDICAL_CLAIM',
  },
  {
    id: 'CLM-002',
    clientName: 'Jane Smith',
    type: 'PROPERTY_CLAIM',
  },
];

export default function NewRequestPage() {
  const router = useRouter();
  const [request, setRequest] = useState({
    claimId: '',
    requestType: '',
    description: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      // Simulate request submission (replace with real API call)
      await new Promise((resolve) => setTimeout(resolve, 1000));
      router.push('/dashboard/assessments');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => router.push('/dashboard/assessments')}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">New Information Request</h1>
          <p className="text-sm text-muted-foreground">
            Request additional information from the client
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Request Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Select Claim</Label>
            <Select
              value={request.claimId}
              onValueChange={(value) =>
                setRequest((prev) => ({ ...prev, claimId: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a claim" />
              </SelectTrigger>
              <SelectContent>
                {claims.map((claim) => (
                  <SelectItem key={claim.id} value={claim.id}>
                    {claim.id} - {claim.clientName} ({claim.type.replace(/_/g, ' ')})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Request Type</Label>
            <Select
              value={request.requestType}
              onValueChange={(value) =>
                setRequest((prev) => ({ ...prev, requestType: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select request type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ADDITIONAL_DOCUMENTS">
                  Additional Documents
                </SelectItem>
                <SelectItem value="CLARIFICATION">Clarification</SelectItem>
                <SelectItem value="VERIFICATION">Verification</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={request.description}
              onChange={(e) =>
                setRequest((prev) => ({ ...prev, description: e.target.value }))
              }
              placeholder="Describe what information you need from the client"
              rows={4}
            />
          </div>


          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => router.push('/dashboard/assessments')}
            >
              Cancel
            </Button>
            <Button
              className="flex-1"
              onClick={handleSubmit}
              disabled={
                !request.claimId ||
                !request.requestType ||
                !request.description ||
                isLoading
              }
            >
              {isLoading ? 'Submitting...' : 'Submit Request'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 