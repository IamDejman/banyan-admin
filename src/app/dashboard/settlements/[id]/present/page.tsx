'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, CheckCircle2, XCircle, MessageSquare } from 'lucide-react';

// Mock data for settlement offer
const settlementOffer = {
  id: '1',
  claimId: 'CLM-001',
  clientName: 'John Doe',
  type: 'MEDICAL_CLAIM',
  offerAmount: 7500,
  feeStructure: {
    baseFee: 750,
    additionalFee: 375,
    totalFee: 1125,
    netAmount: 6375,
  },
  paymentTerms: 'IMMEDIATE',
  notes: 'This offer is based on the medical assessment and treatment costs.',
  status: 'APPROVED',
  createdBy: 'John Manager',
  createdAt: '2024-03-15 11:30',
};

export default function PresentOfferPage() {
  const router = useRouter();
  const [clientResponse, setClientResponse] = useState({
    status: '',
    notes: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleAccept = () => {
    setClientResponse((prev) => ({ ...prev, status: 'ACCEPTED' }));
  };

  const handleDecline = () => {
    setClientResponse((prev) => ({ ...prev, status: 'DECLINED' }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      // Handle response submission
      await submitResponse();
      router.push('/dashboard/settlements');
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
          onClick={() => router.push('/dashboard/settlements')}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Present Offer to Client</h1>
          <p className="text-sm text-muted-foreground">
            Present the settlement offer and collect client response
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Offer Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Claim ID</span>
                <span className="font-medium">{settlementOffer.claimId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Client</span>
                <span className="font-medium">{settlementOffer.clientName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Type</span>
                <span className="font-medium">
                  {settlementOffer.type.replace(/_/g, ' ')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <Badge className="bg-green-100 text-green-800">
                  {settlementOffer.status}
                </Badge>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Offer Amount</Label>
              <div className="p-4 border rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Base Fee (10%)</span>
                  <span className="text-sm">
                    ${settlementOffer.feeStructure.baseFee.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Additional Fee (5%)</span>
                  <span className="text-sm">
                    ${settlementOffer.feeStructure.additionalFee.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>Total Fee</span>
                  <span>
                    ${settlementOffer.feeStructure.totalFee.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>Net Amount</span>
                  <span>
                    ${settlementOffer.feeStructure.netAmount.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Payment Terms</Label>
              <p className="text-sm">
                {settlementOffer.paymentTerms.replace(/_/g, ' ')}
              </p>
            </div>

            <div className="space-y-2">
              <Label>Notes</Label>
              <p className="text-sm">{settlementOffer.notes}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Client Response</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {clientResponse.status ? (
              <Alert
                className={
                  clientResponse.status === 'ACCEPTED'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }
              >
                <AlertDescription className="flex items-center gap-2">
                  {clientResponse.status === 'ACCEPTED' ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    <XCircle className="h-4 w-4" />
                  )}
                  Offer {clientResponse.status.toLowerCase()}
                </AlertDescription>
              </Alert>
            ) : (
              <div className="flex gap-2">
                <Button
                  className="flex-1"
                  onClick={handleAccept}
                  variant="outline"
                >
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Accept Offer
                </Button>
                <Button
                  className="flex-1"
                  onClick={handleDecline}
                  variant="outline"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Decline Offer
                </Button>
              </div>
            )}

            <div className="space-y-2">
              <Label>Response Notes</Label>
              <Textarea
                value={clientResponse.notes}
                onChange={(e) =>
                  setClientResponse((prev) => ({ ...prev, notes: e.target.value }))
                }
                placeholder="Enter client's response notes"
                rows={4}
              />
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => router.push('/dashboard/settlements')}
              >
                Cancel
              </Button>
              <Button
                className="flex-1"
                onClick={handleSubmit}
                disabled={!clientResponse.status || !clientResponse.notes || isLoading}
              >
                {isLoading ? 'Submitting...' : 'Submit Response'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 