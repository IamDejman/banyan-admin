'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FileText, CheckCircle } from 'lucide-react';

export default function ProcessSettlementsPage() {
  const [finalized, setFinalized] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('bank');
  const [transactionId, setTransactionId] = useState('');
  const [completionNotes, setCompletionNotes] = useState('');

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
            <label className="block font-medium mb-1">Payment</label>
            <select className="w-full border rounded p-2" value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)}>
              <option value="bank">Bank Transfer</option>
              <option value="cheque">Cheque</option>
              <option value="cash">Cash</option>
            </select>
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