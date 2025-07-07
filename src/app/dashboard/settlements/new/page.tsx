'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { DollarSign, Calendar as CalendarIcon } from 'lucide-react';

export default function CreateOfferPage() {
  const [assessmentValue, setAssessmentValue] = useState(10000);
  const [offerValue, setOfferValue] = useState(9500);
  const [expiry, setExpiry] = useState<Date | undefined>(undefined);
  const [fee, setFee] = useState(250);
  const [terms, setTerms] = useState('Standard settlement terms apply.');
  const [breakdown, setBreakdown] = useState([
    { label: 'Property Damage', value: 7000 },
    { label: 'Medical', value: 2000 },
    { label: 'Other', value: 1000 },
  ]);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Create Settlement Offer</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Assessment Value</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input type="number" value={assessmentValue} onChange={e => setAssessmentValue(Number(e.target.value))} className="pl-10" />
            </div>
          </div>
          <div>
            <Label>Offer Value</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input type="number" value={offerValue} onChange={e => setOfferValue(Number(e.target.value))} className="pl-10" />
            </div>
          </div>
          <div>
            <Label>Breakdown</Label>
            <div className="space-y-2">
              {breakdown.map((item, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <Input
                    className="w-1/2"
                    value={item.label}
                    onChange={e => {
                      const newBreakdown = [...breakdown];
                      newBreakdown[idx].label = e.target.value;
                      setBreakdown(newBreakdown);
                    }}
                  />
                  <Input
                    className="w-1/2"
                    type="number"
                    value={item.value}
                    onChange={e => {
                      const newBreakdown = [...breakdown];
                      newBreakdown[idx].value = Number(e.target.value);
                      setBreakdown(newBreakdown);
                    }}
                  />
                  <Button variant="ghost" size="icon" onClick={() => setBreakdown(breakdown.filter((_, i) => i !== idx))}>✕</Button>
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={() => setBreakdown([...breakdown, { label: '', value: 0 }])}>Add Item</Button>
            </div>
          </div>
          <div>
            <Label>Fee</Label>
            <Input type="number" value={fee} onChange={e => setFee(Number(e.target.value))} />
          </div>
          <div>
            <Label>Expiry Date</Label>
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
              <Calendar mode="single" selected={expiry} onSelect={setExpiry} />
            </div>
          </div>
          <div>
            <Label>Terms & Conditions</Label>
            <Textarea value={terms} onChange={e => setTerms(e.target.value)} rows={4} />
          </div>
          <Button>Create Offer</Button>
        </CardContent>
      </Card>
    </div>
  );
} 