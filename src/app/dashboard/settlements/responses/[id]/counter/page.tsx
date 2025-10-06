'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';

// Mock data for counter offer
const counterOffer = {
  id: '1',
  claimId: 'CLM-002',
  clientName: 'Jane Smith',
  type: 'PROPERTY_CLAIM',
  originalAmount: 12000,
  counterAmount: 15000,
  clientNotes: 'The damage assessment shows higher repair costs than initially estimated.',
  status: 'PENDING_REVIEW',
  presentedAt: '2024-03-14 09:15',
};

// Add after the mock data for counter offer
const analysisData = {
  difference: counterOffer.counterAmount - counterOffer.originalAmount,
  percentageChange: ((counterOffer.counterAmount - counterOffer.originalAmount) / counterOffer.originalAmount) * 100,
  marketRate: {
    min: counterOffer.originalAmount * 0.8,
    max: counterOffer.originalAmount * 1.2,
    average: counterOffer.originalAmount * 1.1,
  },
  historicalData: [
    { date: '2024-02', amount: 11000 },
    { date: '2024-01', amount: 10500 },
    { date: '2023-12', amount: 10000 },
  ],
  recommendation: {
    action: counterOffer.counterAmount <= counterOffer.originalAmount * 1.2 ? 'ACCEPT' : 'COUNTER',
    suggestedAmount: counterOffer.originalAmount * 1.15,
    reasoning: counterOffer.counterAmount <= counterOffer.originalAmount * 1.2
      ? 'Counter offer is within acceptable range based on market rates and historical data.'
      : 'Counter offer exceeds typical market rates. Consider negotiating a lower amount.',
  },
};

export default function CounterOfferPage() {
  const router = useRouter();
  const [response, setResponse] = useState({
    status: '',
    notes: '',
    newAmount: counterOffer.counterAmount,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    router.push('/dashboard/settlements/responses');
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
          <h1 className="text-2xl font-bold">Review Counter Offer</h1>
          <p className="text-muted-foreground">
            Review and respond to client&apos;s counter offer
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Counter Offer Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Claim ID</span>
                <span className="text-sm">{counterOffer.claimId}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Client</span>
                <span className="text-sm">{counterOffer.clientName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Type</span>
                <span className="text-sm">
                  {counterOffer.type.replace(/_/g, ' ')}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Status</span>
                <Badge className="bg-blue-100 text-blue-800">
                  {counterOffer.status.replace(/_/g, ' ')}
                </Badge>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Original Offer</span>
                <span className="text-sm">
                  ₦{counterOffer.originalAmount.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Counter Offer</span>
                <span className="text-sm">
                  ₦{counterOffer.counterAmount.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Difference</span>
                <span className="text-sm">
                  ${(
                    counterOffer.counterAmount - counterOffer.originalAmount
                  ).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Client&apos;s Notes</Label>
              <div className="rounded-md border p-3 text-sm">
                {counterOffer.clientNotes}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Presented</span>
                <span className="text-sm">{counterOffer.presentedAt}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Offer Analysis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Difference</span>
                <span className={`text-sm ${analysisData.difference > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  ${analysisData.difference.toLocaleString()} ({analysisData.percentageChange.toFixed(1)}%)
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Market Rate Range</span>
                <span className="text-sm">
                  ${analysisData.marketRate.min.toLocaleString()} - ${analysisData.marketRate.max.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Average Market Rate</span>
                <span className="text-sm">
                  ${analysisData.marketRate.average.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Historical Data</Label>
              <div className="space-y-1">
                {analysisData.historicalData.map((data) => (
                  <div key={data.date} className="flex items-center justify-between text-sm">
                    <span>{data.date}</span>
                    <span>₦{data.amount.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Recommendation</Label>
              <div className="p-3 border rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Suggested Action</span>
                  <Badge className={analysisData.recommendation.action === 'ACCEPT' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                    {analysisData.recommendation.action}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Suggested Amount</span>
                  <span className="text-sm">
                    ₦{analysisData.recommendation.suggestedAmount.toLocaleString()}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {analysisData.recommendation.reasoning}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Response</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Response Type</Label>
              <div className="flex gap-2">
                <Button
                  variant={response.status === 'ACCEPT' ? 'default' : 'outline'}
                  className="flex-1"
                  onClick={() => setResponse({ ...response, status: 'ACCEPT' })}
                >
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Accept
                </Button>
                <Button
                  variant={response.status === 'REJECT' ? 'default' : 'outline'}
                  className="flex-1"
                  onClick={() => setResponse({ ...response, status: 'REJECT' })}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject
                </Button>
                <Button
                  variant={response.status === 'COUNTER' ? 'default' : 'outline'}
                  className="flex-1"
                  onClick={() => setResponse({ ...response, status: 'COUNTER' })}
                >
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Counter
                </Button>
              </div>
            </div>

            {response.status === 'COUNTER' && (
              <div className="space-y-2">
                <Label>New Offer Amount</Label>
                <Input
                  type="number"
                  value={response.newAmount}
                  onChange={(e) =>
                    setResponse({ ...response, newAmount: Number(e.target.value) })
                  }
                />
              </div>
            )}

            <div className="space-y-2">
              <Label>Response Notes</Label>
              <Textarea
                placeholder="Enter your response notes..."
                value={response.notes}
                onChange={(e) =>
                  setResponse({ ...response, notes: e.target.value })
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
                disabled={!response.status || !response.notes || isSubmitting}
                onClick={handleSubmit}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Response'}
              </Button>
            </div>

            {response.status && (
              <Alert>
                <AlertDescription>
                  This will generate a new settlement document and notify the
                  client of your response.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 