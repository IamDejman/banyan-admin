'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, Calculator, AlertCircle } from 'lucide-react';

// Mock data for claim
const claim = {
  id: 'CLM-001',
  clientName: 'John Doe',
  type: 'MEDICAL_CLAIM',
  assessedValue: 5000,
  description: 'Medical treatment for injuries sustained in an accident',
};

// Fee structure configuration
const feeStructure = {
  baseFee: 0.1, // 10% base fee
  additionalFees: {
    medical: 0.05, // 5% additional for medical claims
    property: 0.03, // 3% additional for property claims
  },
  minimumFee: 100,
  maximumFee: 1000,
};

export default function NewSettlementPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const claimId = searchParams.get('claimId');

  const [offer, setOffer] = useState({
    amount: '',
    notes: '',
    paymentTerms: 'IMMEDIATE',
    feeStructure: {
      baseFee: 0,
      additionalFee: 0,
      totalFee: 0,
      netAmount: 0,
    },
  });

  useEffect(() => {
    if (offer.amount) {
      const amount = parseFloat(offer.amount);
      const baseFee = amount * feeStructure.baseFee;
      const additionalFee =
        amount *
        (claim.type === 'MEDICAL_CLAIM'
          ? feeStructure.additionalFees.medical
          : feeStructure.additionalFees.property);
      const totalFee = Math.min(
        Math.max(baseFee + additionalFee, feeStructure.minimumFee),
        feeStructure.maximumFee
      );

      setOffer((prev) => ({
        ...prev,
        feeStructure: {
          baseFee,
          additionalFee,
          totalFee,
          netAmount: amount - totalFee,
        },
      }));
    }
  }, [offer.amount]);

  const handleSubmit = () => {
    // Handle offer submission
    router.push('/dashboard/settlements');
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
          <h1 className="text-2xl font-bold">Create Settlement Offer</h1>
          <p className="text-sm text-muted-foreground">
            Create a new settlement offer with fee calculation
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
                <span className="font-medium">{claim.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Client</span>
                <span className="font-medium">{claim.clientName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Type</span>
                <span className="font-medium">
                  {claim.type.replace(/_/g, ' ')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Assessed Value
                </span>
                <span className="font-medium">
                  ${claim.assessedValue.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <p className="text-sm">{claim.description}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Offer Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Offer Amount</Label>
              <Input
                type="number"
                value={offer.amount}
                onChange={(e) =>
                  setOffer((prev) => ({ ...prev, amount: e.target.value }))
                }
                placeholder="Enter offer amount"
              />
            </div>

            {offer.amount && (
              <div className="space-y-2">
                <Label>Fee Structure</Label>
                <div className="space-y-2 p-4 border rounded-lg">
                  <div className="flex justify-between">
                    <span className="text-sm">Base Fee (10%)</span>
                    <span className="text-sm">
                      ${offer.feeStructure.baseFee.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">
                      Additional Fee (
                      {claim.type === 'MEDICAL_CLAIM' ? '5%' : '3%'})
                    </span>
                    <span className="text-sm">
                      ${offer.feeStructure.additionalFee.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span>Total Fee</span>
                    <span>
                      ${offer.feeStructure.totalFee.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span>Net Amount</span>
                    <span>
                      ${offer.feeStructure.netAmount.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label>Payment Terms</Label>
              <select
                value={offer.paymentTerms}
                onChange={(e) =>
                  setOffer((prev) => ({ ...prev, paymentTerms: e.target.value }))
                }
                className="w-full p-2 border rounded-md"
              >
                <option value="IMMEDIATE">Immediate Payment</option>
                <option value="INSTALLMENTS">Installments</option>
                <option value="DEFERRED">Deferred Payment</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea
                value={offer.notes}
                onChange={(e) =>
                  setOffer((prev) => ({ ...prev, notes: e.target.value }))
                }
                placeholder="Enter offer notes and justification"
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
                disabled={!offer.amount || !offer.notes}
              >
                Submit Offer
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 