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
import { ArrowLeft, Calculator, FileText, AlertCircle } from 'lucide-react';

// Mock data for claim assessment
const claimAssessment = {
  id: '1',
  claimId: 'CLM-001',
  clientName: 'John Doe',
  type: 'MEDICAL_CLAIM',
  status: 'PENDING_ASSESSMENT',
  amount: 5000,
  description: 'Medical treatment for injuries sustained in an accident',
  documents: [
    {
      id: '1',
      name: 'Medical Report.pdf',
      type: 'MEDICAL_REPORT',
      status: 'VERIFIED',
    },
    {
      id: '2',
      name: 'Hospital Bill.pdf',
      type: 'BILL',
      status: 'PENDING',
    },
  ],
};

export default function ClaimAssessmentPage() {
  const router = useRouter();
  const [assessment, setAssessment] = useState({
    assessedValue: '',
    notes: '',
    calculation: {
      baseAmount: '',
      deductions: '',
      adjustments: '',
    },
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleCalculate = () => {
    const baseAmount = parseFloat(assessment.calculation.baseAmount) || 0;
    const deductions = parseFloat(assessment.calculation.deductions) || 0;
    const adjustments = parseFloat(assessment.calculation.adjustments) || 0;
    const total = baseAmount - deductions + adjustments;
    setAssessment((prev) => ({ ...prev, assessedValue: total.toString() }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      // Handle assessment submission
      await submitAssessment();
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
          <h1 className="text-2xl font-bold">Claim Assessment</h1>
          <p className="text-sm text-muted-foreground">
            Assess claim value and provide supporting evidence
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
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Claim ID</span>
                <span className="font-medium">{claimAssessment.claimId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Client</span>
                <span className="font-medium">{claimAssessment.clientName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Type</span>
                <span className="font-medium">
                  {claimAssessment.type.replace(/_/g, ' ')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <Badge
                  className={
                    claimAssessment.status === 'PENDING_ASSESSMENT'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-green-100 text-green-800'
                  }
                >
                  {claimAssessment.status.replace(/_/g, ' ')}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Claimed Amount</span>
                <span className="font-medium">
                  ${claimAssessment.amount.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <p className="text-sm">{claimAssessment.description}</p>
            </div>

            <div className="space-y-2">
              <Label>Supporting Documents</Label>
              <div className="space-y-2">
                {claimAssessment.documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-2 border rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{doc.name}</span>
                    </div>
                    <Badge
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
            <CardTitle>Valuation Calculator</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Base Amount</Label>
                <Input
                  type="number"
                  value={assessment.calculation.baseAmount}
                  onChange={(e) =>
                    setAssessment((prev) => ({
                      ...prev,
                      calculation: {
                        ...prev.calculation,
                        baseAmount: e.target.value,
                      },
                    }))
                  }
                  placeholder="Enter base amount"
                />
              </div>

              <div className="space-y-2">
                <Label>Deductions</Label>
                <Input
                  type="number"
                  value={assessment.calculation.deductions}
                  onChange={(e) =>
                    setAssessment((prev) => ({
                      ...prev,
                      calculation: {
                        ...prev.calculation,
                        deductions: e.target.value,
                      },
                    }))
                  }
                  placeholder="Enter deductions"
                />
              </div>

              <div className="space-y-2">
                <Label>Adjustments</Label>
                <Input
                  type="number"
                  value={assessment.calculation.adjustments}
                  onChange={(e) =>
                    setAssessment((prev) => ({
                      ...prev,
                      calculation: {
                        ...prev.calculation,
                        adjustments: e.target.value,
                      },
                    }))
                  }
                  placeholder="Enter adjustments"
                />
              </div>

              <Button
                className="w-full"
                onClick={handleCalculate}
                disabled={
                  !assessment.calculation.baseAmount &&
                  !assessment.calculation.deductions &&
                  !assessment.calculation.adjustments
                }
              >
                <Calculator className="h-4 w-4 mr-2" />
                Calculate
              </Button>

              {assessment.assessedValue && (
                <Alert>
                  <AlertDescription className="flex items-center justify-between">
                    <span>Assessed Value:</span>
                    <span className="font-bold">
                      ${parseFloat(assessment.assessedValue).toLocaleString()}
                    </span>
                  </AlertDescription>
                </Alert>
              )}
            </div>

            <div className="space-y-2">
              <Label>Assessment Notes</Label>
              <Textarea
                value={assessment.notes}
                onChange={(e) =>
                  setAssessment((prev) => ({ ...prev, notes: e.target.value }))
                }
                placeholder="Enter assessment notes and justification"
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
                disabled={!assessment.assessedValue || !assessment.notes || isLoading}
              >
                {isLoading ? 'Submitting...' : 'Submit Assessment'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 