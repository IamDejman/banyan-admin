'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, CheckCircle } from 'lucide-react';
import { usePaymentMethods } from '@/hooks/usePaymentMethods';

export default function ProcessSettlementsPage() {
  const [finalized, setFinalized] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [completionNotes, setCompletionNotes] = useState('');
  
  // Use the payment methods hook
  const { paymentMethods, loading: paymentMethodsLoading, error: paymentMethodsError } = usePaymentMethods();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Process Settlement</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block font-medium mb-1">Finalization</label>
            <Button onClick={() => setFinalized(true)} disabled={finalized} variant="default">
              <FileText className="h-4 w-4 mr-1" /> {finalized ? 'Finalized' : 'Finalize Documents'}
            </Button>
          </div>
          <div>
            <label className="block font-medium mb-1">Payment Method</label>
            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
              <SelectTrigger>
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                {paymentMethodsLoading ? (
                  <SelectItem value="" disabled>Loading payment methods...</SelectItem>
                ) : paymentMethodsError ? (
                  <SelectItem value="" disabled>Error loading payment methods</SelectItem>
                ) : paymentMethods.length === 0 ? (
                  <SelectItem value="" disabled>No payment methods available</SelectItem>
                ) : (
                  paymentMethods.map((method) => (
                    <SelectItem key={method.id} value={method.code}>
                      <div className="flex flex-col">
                        <span>{method.name}</span>
                        {method.description && (
                          <span className="text-xs text-muted-foreground">
                            {method.description}
                          </span>
                        )}
                      </div>
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            <Input className="mt-2" placeholder="Transaction ID" value={transactionId} onChange={e => setTransactionId(e.target.value)} />
          </div>
          <div>
            <label className="block font-medium mb-1">Completion</label>
            <Textarea rows={3} placeholder="Completion notes..." value={completionNotes} onChange={e => setCompletionNotes(e.target.value)} />
            <Button className="mt-2" variant="default"><CheckCircle className="h-4 w-4 mr-1" /> Mark as Complete</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 