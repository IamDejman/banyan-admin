'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { MessageSquare, CheckCircle, X } from 'lucide-react';

const mockOffers = [
  {
    id: 'OFFER-003',
    claimId: 'CLAIM-103',
    client: 'Client X',
    status: 'PENDING RESPONSE',
    expiry: '2024-06-10',
    counterOffer: null,
  },
  {
    id: 'OFFER-004',
    claimId: 'CLAIM-104',
    client: 'Client Y',
    status: 'COUNTER-OFFER',
    expiry: '2024-06-12',
    counterOffer: { amount: 9000, reason: 'Requesting higher compensation' },
  },
];

export default function ManageOffersPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const [response, setResponse] = useState('');

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Manage Offers & Responses</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Offer ID</TableHead>
                <TableHead>Claim ID</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Expiry</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockOffers.map((offer) => (
                <TableRow key={offer.id}>
                  <TableCell>{offer.id}</TableCell>
                  <TableCell>{offer.claimId}</TableCell>
                  <TableCell>{offer.client}</TableCell>
                  <TableCell><Badge>{offer.status}</Badge></TableCell>
                  <TableCell>{offer.expiry}</TableCell>
                  <TableCell>
                    <Button size="sm" variant="outline" onClick={() => setSelected(offer.id)}>Review</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {selected && (() => {
        const offer = mockOffers.find(o => o.id === selected);
        if (!offer) return null;
        return (
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Review Offer {offer.id}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-8">
                <div>
                  <div className="font-semibold">Status</div>
                  <div>{offer.status}</div>
                </div>
                <div>
                  <div className="font-semibold">Expiry</div>
                  <div>{offer.expiry}</div>
                </div>
              </div>
              {offer.counterOffer ? (
                <div className="bg-yellow-50 p-3 rounded">
                  <div className="font-semibold flex items-center gap-2"><MessageSquare className="h-4 w-4" /> Counter-Offer</div>
                  <div>Amount: ${offer.counterOffer.amount.toLocaleString()}</div>
                  <div>Reason: {offer.counterOffer.reason}</div>
                  <div className="mt-2">
                    <Textarea value={response} onChange={e => setResponse(e.target.value)} placeholder="Respond to counter-offer..." />
                  </div>
                  <div className="flex gap-2 mt-2">
                    <Button variant="default" size="sm"><CheckCircle className="h-4 w-4 mr-1" /> Accept</Button>
                    <Button variant="destructive" size="sm"><X className="h-4 w-4 mr-1" /> Reject</Button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Button variant="default" size="sm"><CheckCircle className="h-4 w-4 mr-1" /> Mark as Accepted</Button>
                  <Button variant="destructive" size="sm"><X className="h-4 w-4 mr-1" /> Mark as Rejected</Button>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })()}
    </div>
  );
} 