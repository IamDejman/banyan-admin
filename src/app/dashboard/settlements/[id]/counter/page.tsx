'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Clock,
  User,
  FileText,
} from 'lucide-react';

// Mock data for settlement
const settlement = {
  id: 'SET-001',
  claimId: 'CLM-001',
  clientName: 'John Doe',
  type: 'MEDICAL',
  amount: 5000,
  status: 'COUNTER_OFFER_RECEIVED',
  originalOffer: {
    amount: 5000,
    notes: 'Initial settlement offer based on medical expenses',
    createdAt: '2024-03-15 10:00',
    createdBy: 'Admin User',
  },
  counterOffer: {
    amount: 7500,
    notes: 'Client requesting additional compensation for lost wages',
    createdAt: '2024-03-15 14:30',
    createdBy: 'John Doe',
  },
  analysis: {
    difference: 2500,
    percentageChange: 50,
    recommendedAction: 'ACCEPT',
    reasoning: 'The counter-offer is within acceptable range and includes valid additional expenses',
  },
};

export default function CounterOfferPage() {
  const router = useRouter();
  const [responseNotes, setResponseNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAccept = async () => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    router.push(`/dashboard/settlements/${settlement.id}`);
  };

  const handleReject = async () => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    router.push(`/dashboard/settlements/${settlement.id}`);
  };

  const handleNewOffer = async () => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    router.push(`/dashboard/settlements/${settlement.id}/offer`);
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
          <h1 className="text-2xl font-bold">Counter-Offer Management</h1>
          <p className="text-muted-foreground">
            Review and respond to counter-offer for settlement {settlement.id}
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Settlement Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Settlement ID</span>
                <span className="text-sm">{settlement.id}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Claim ID</span>
                <span className="text-sm">{settlement.claimId}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Client</span>
                <span className="text-sm">{settlement.clientName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Type</span>
                <span className="text-sm">{settlement.type}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Status</span>
                <Badge
                  variant="secondary"
                  className="bg-yellow-100 text-yellow-800"
                >
                  {settlement.status.replace(/_/g, ' ')}
                </Badge>
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
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-600">
                    +${settlement.analysis.difference}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Percentage Change</span>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-600">
                    +{settlement.analysis.percentageChange}%
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Recommended Action</span>
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-800"
                >
                  {settlement.analysis.recommendedAction}
                </Badge>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Analysis Reasoning</Label>
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm">{settlement.analysis.reasoning}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Offer Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Original Offer</h3>
                  <Badge variant="outline">Initial</Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Amount</span>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">
                        ${settlement.originalOffer.amount}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Created By</span>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{settlement.originalOffer.createdBy}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Created At</span>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{settlement.originalOffer.createdAt}</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Notes</Label>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm">{settlement.originalOffer.notes}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Counter Offer</h3>
                  <Badge variant="outline">Response</Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Amount</span>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">
                        ${settlement.counterOffer.amount}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Created By</span>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{settlement.counterOffer.createdBy}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Created At</span>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{settlement.counterOffer.createdAt}</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Notes</Label>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm">{settlement.counterOffer.notes}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Response Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Tabs defaultValue="accept">
              <TabsList>
                <TabsTrigger value="accept">Accept</TabsTrigger>
                <TabsTrigger value="reject">Reject</TabsTrigger>
                <TabsTrigger value="new">New Offer</TabsTrigger>
              </TabsList>

              <TabsContent value="accept" className="space-y-4">
                <div className="space-y-2">
                  <Label>Response Notes</Label>
                  <Textarea
                    placeholder="Enter any notes about accepting the counter-offer..."
                    value={responseNotes}
                    onChange={(e) => setResponseNotes(e.target.value)}
                    rows={4}
                  />
                </div>
                <Button
                  className="w-full"
                  disabled={isSubmitting}
                  onClick={handleAccept}
                >
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  {isSubmitting ? 'Accepting...' : 'Accept Counter-Offer'}
                </Button>
              </TabsContent>

              <TabsContent value="reject" className="space-y-4">
                <div className="space-y-2">
                  <Label>Rejection Notes</Label>
                  <Textarea
                    placeholder="Enter reason for rejecting the counter-offer..."
                    value={responseNotes}
                    onChange={(e) => setResponseNotes(e.target.value)}
                    rows={4}
                  />
                </div>
                <Button
                  variant="destructive"
                  className="w-full"
                  disabled={!responseNotes || isSubmitting}
                  onClick={handleReject}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  {isSubmitting ? 'Rejecting...' : 'Reject Counter-Offer'}
                </Button>
              </TabsContent>

              <TabsContent value="new" className="space-y-4">
                <div className="space-y-2">
                  <Label>New Offer Notes</Label>
                  <Textarea
                    placeholder="Enter notes for the new offer..."
                    value={responseNotes}
                    onChange={(e) => setResponseNotes(e.target.value)}
                    rows={4}
                  />
                </div>
                <Button
                  variant="outline"
                  className="w-full"
                  disabled={!responseNotes || isSubmitting}
                  onClick={handleNewOffer}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  {isSubmitting ? 'Creating...' : 'Create New Offer'}
                </Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 