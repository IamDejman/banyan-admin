'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle, X } from 'lucide-react';
import { Label } from '@/components/ui/label';

const mockOffers = [
  {
    id: 'OFFER-001',
    claimId: 'CLAIM-101',
    assessment: 10000,
    offer: 9500,
    status: 'PENDING',
    createdBy: 'Agent A',
    createdAt: '2024-06-01',
    history: [
      { action: 'Created', by: 'Agent A', date: '2024-06-01' },
    ],
  },
  {
    id: 'OFFER-002',
    claimId: 'CLAIM-102',
    assessment: 15000,
    offer: 14000,
    status: 'PENDING',
    createdBy: 'Agent B',
    createdAt: '2024-06-02',
    history: [
      { action: 'Created', by: 'Agent B', date: '2024-06-02' },
    ],
  },
];

export default function ApproveOffersPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const [comment, setComment] = useState('');

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Approve Settlement Offers</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Offer ID</TableHead>
                <TableHead>Claim ID</TableHead>
                <TableHead>Assessment</TableHead>
                <TableHead>Offer</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockOffers.map((offer) => (
                <TableRow key={offer.id}>
                  <TableCell>{offer.id}</TableCell>
                  <TableCell>{offer.claimId}</TableCell>
                  <TableCell>₦{offer.assessment.toLocaleString()}</TableCell>
                  <TableCell>₦{offer.offer.toLocaleString()}</TableCell>
                  <TableCell><Badge>{offer.status}</Badge></TableCell>
                  <TableCell>
                    <Button size="sm" variant="outline" onClick={() => setSelected(offer.id)}>Review</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {selected && (
        <Card>
          <CardHeader>
            <CardTitle>Review Offer {selected}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {(() => {
              const offer = mockOffers.find(o => o.id === selected);
              if (!offer) return null;
              return (
                <>
                  <div className="flex gap-8">
                    <div>
                      <div className="font-semibold">Assessment</div>
                      <div>₦{offer.assessment.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="font-semibold">Offer</div>
                      <div>₦{offer.offer.toLocaleString()}</div>
                    </div>
                  </div>
                  <div>
                    <Label>Comment</Label>
                    <Textarea value={comment} onChange={e => setComment(e.target.value)} rows={3} />
                  </div>
                  <div className="flex gap-2">
                    <Button variant="default" size="sm"><CheckCircle className="h-4 w-4 mr-1" /> Approve</Button>
                    <Button variant="destructive" size="sm"><X className="h-4 w-4 mr-1" /> Reject</Button>
                  </div>
                  <div>
                    <div className="font-semibold mt-4">Approval History</div>
                    <ul className="text-xs text-muted-foreground">
                      {offer.history.map((h, idx) => (
                        <li key={idx}>{h.date}: {h.action} by {h.by}</li>
                      ))}
                    </ul>
                  </div>
                </>
              );
            })()}
          </CardContent>
        </Card>
      )}
    </div>
  );
} 