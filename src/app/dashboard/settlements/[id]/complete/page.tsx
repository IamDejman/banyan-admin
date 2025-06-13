'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  FileText,
  Clock,
  User,
  DollarSign,
  AlertCircle,
  Check,
} from 'lucide-react';

// Mock data for settlement
const settlement = {
  id: 'SET-001',
  claimId: 'CLM-001',
  clientName: 'John Doe',
  type: 'MEDICAL',
  amount: 7500,
  status: 'PAYMENT_PROCESSED',
  paymentDetails: {
    method: 'BANK_TRANSFER',
    reference: 'TRF-123456',
    processedAt: '2024-03-15 16:00',
    processedBy: 'Financial Officer',
  },
  documents: [
    {
      id: 'DOC-001',
      name: 'Settlement Agreement.pdf',
      type: 'AGREEMENT',
      status: 'VERIFIED',
      uploadedAt: '2024-03-15 14:00',
    },
    {
      id: 'DOC-002',
      name: 'Release Form.pdf',
      type: 'RELEASE',
      status: 'VERIFIED',
      uploadedAt: '2024-03-15 14:00',
    },
    {
      id: 'DOC-003',
      name: 'Payment Confirmation.pdf',
      type: 'PAYMENT',
      status: 'VERIFIED',
      uploadedAt: '2024-03-15 16:00',
    },
  ],
};

// Mock data for completion checklist
const completionChecklist = [
  {
    id: 'PAYMENT_VERIFIED',
    label: 'Payment has been processed and verified',
    description: 'Confirm that the payment has been successfully processed and verified',
    completed: true,
  },
  {
    id: 'DOCUMENTS_VERIFIED',
    label: 'All required documents are verified',
    description: 'Ensure all settlement documents are properly verified',
    completed: true,
  },
  {
    id: 'CLIENT_CONFIRMED',
    label: 'Client has confirmed receipt',
    description: 'Verify that the client has confirmed receipt of payment',
    completed: false,
  },
  {
    id: 'CASE_NOTES_COMPLETE',
    label: 'Case notes are complete',
    description: 'Ensure all case notes and documentation are up to date',
    completed: false,
  },
  {
    id: 'FINAL_REVIEW',
    label: 'Final review completed',
    description: 'Perform final review of all settlement details',
    completed: false,
  },
];

export default function SettlementCompletionPage() {
  const router = useRouter();
  const [checklist, setChecklist] = useState(completionChecklist);
  const [completionNotes, setCompletionNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChecklistChange = (id: string) => {
    setChecklist(
      checklist.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const handleComplete = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await completeSettlement();
      router.push(`/dashboard/settlements/${settlement.id}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  const completionProgress =
    (checklist.filter((item) => item.completed).length / checklist.length) * 100;

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
          <h1 className="text-2xl font-bold">Complete Settlement</h1>
          <p className="text-muted-foreground">
            Finalize settlement {settlement.id}
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

            <div className="space-y-2">
              <Label>Payment Details</Label>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Method</span>
                  <span className="text-sm">
                    {settlement.paymentDetails.method.replace(/_/g, ' ')}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Reference</span>
                  <span className="text-sm">{settlement.paymentDetails.reference}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Processed By</span>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{settlement.paymentDetails.processedBy}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Processed At</span>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{settlement.paymentDetails.processedAt}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Required Documents</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              {settlement.documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-2 bg-muted/50 rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <div className="space-y-1">
                      <span className="text-sm">{doc.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {doc.type.replace(/_/g, ' ')}
                      </span>
                    </div>
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
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Completion Checklist</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Completion Progress</span>
                <span className="text-sm">{completionProgress.toFixed(0)}%</span>
              </div>
              <Progress value={completionProgress} />
            </div>

            <div className="space-y-4">
              {checklist.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start gap-3 p-3 border rounded-lg"
                >
                  <Checkbox
                    id={item.id}
                    checked={item.completed}
                    onCheckedChange={() => handleChecklistChange(item.id)}
                  />
                  <div className="space-y-1">
                    <Label
                      htmlFor={item.id}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {item.label}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <Label>Completion Notes</Label>
              <Textarea
                placeholder="Enter any notes about the settlement completion..."
                value={completionNotes}
                onChange={(e) => setCompletionNotes(e.target.value)}
                rows={4}
              />
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={handleCancel}
                disabled={isLoading}
              >
                <XCircle className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button
                className="flex-1"
                onClick={handleComplete}
                disabled={!checklist.every((item) => item.completed) || !completionNotes || isLoading}
              >
                {isLoading ? 'Completing...' : 'Complete Settlement'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 