'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowLeft, FileText, Clock, Shield, XCircle, CheckCircle2 } from 'lucide-react';

// Mock data for settlement
const settlement = {
  id: 'SET-001',
  claimId: 'CLM-001',
  clientName: 'John Doe',
  type: 'MEDICAL',
  amount: 7500,
  status: 'PAYMENT_PENDING',
  acceptedAt: '2024-03-15 15:00',
  documents: [
    {
      id: 'DOC-001',
      name: 'Settlement Agreement.pdf',
      type: 'AGREEMENT',
      status: 'VERIFIED',
    },
    {
      id: 'DOC-002',
      name: 'Release Form.pdf',
      type: 'RELEASE',
      status: 'VERIFIED',
    },
  ],
};

// Mock data for payment methods
const paymentMethods = [
  {
    id: 'BANK_TRANSFER',
    name: 'Bank Transfer',
    description: 'Direct bank transfer to client account',
    processingTime: '1-2 business days',
  },
  {
    id: 'CHECK',
    name: 'Check',
    description: 'Physical check mailed to client address',
    processingTime: '3-5 business days',
  },
  {
    id: 'WIRE_TRANSFER',
    name: 'Wire Transfer',
    description: 'Same-day wire transfer to client account',
    processingTime: 'Same day',
  },
];

// Mock data for user role
const userRole = 'FINANCIAL_OFFICER';

interface SettlementPaymentClientProps {
  settlementId: string;
}

export default function SettlementPaymentClient({ settlementId }: SettlementPaymentClientProps) {
  const router = useRouter();
  console.log('Processing payment for settlement:', settlementId);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [paymentReference, setPaymentReference] = useState('');
  const [paymentAmount, setPaymentAmount] = useState(settlement.amount.toString());
  const [paymentNotes, setPaymentNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleProcessPayment = async () => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    router.push(`/dashboard/settlements/${settlement.id}`);
  };

  const handleCancel = () => {
    router.back();
  };

  if (userRole !== 'FINANCIAL_OFFICER') {
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
            <h1 className="text-2xl font-bold">Access Denied</h1>
            <p className="text-muted-foreground">
              You do not have permission to process payments
            </p>
          </div>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center justify-center text-center space-y-4">
              <Shield className="h-12 w-12 text-red-500" />
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Restricted Access</h3>
                <p className="text-sm text-muted-foreground">
                  Only Financial Officers can process payments. Please contact your
                  administrator for access.
                </p>
              </div>
              <Button onClick={() => router.back()}>Go Back</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

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
          <h1 className="text-2xl font-bold">Process Payment</h1>
          <p className="text-muted-foreground">
            Process payment for settlement {settlement.id}
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
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Accepted At</span>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{settlement.acceptedAt}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Required Documents</Label>
              <div className="space-y-2">
                {settlement.documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-2 bg-muted/50 rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{doc.name}</span>
                    </div>
                    <Badge
                      variant="secondary"
                      className={
                        doc.status === 'VERIFIED'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }
                    >
                      {doc.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Payment Method</Label>
              <Select
                value={paymentMethod}
                onValueChange={setPaymentMethod}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  {paymentMethods.map((method) => (
                    <SelectItem key={method.id} value={method.id}>
                      <div className="flex flex-col">
                        <span>{method.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {method.description}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Payment Reference</Label>
              <Input
                placeholder="Enter payment reference number"
                value={paymentReference}
                onChange={(e) => setPaymentReference(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Payment Amount</Label>
              <div className="relative">
                <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="number"
                  placeholder="0.00"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Payment Notes</Label>
              <Textarea
                placeholder="Enter any notes about the payment..."
                value={paymentNotes}
                onChange={(e) => setPaymentNotes(e.target.value)}
                rows={4}
              />
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                <XCircle className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button
                className="flex-1"
                disabled={
                  !paymentMethod ||
                  !paymentReference ||
                  !paymentAmount ||
                  isSubmitting
                }
                onClick={handleProcessPayment}
              >
                <CheckCircle2 className="h-4 w-4 mr-2" />
                {isSubmitting ? 'Processing...' : 'Process Payment'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 