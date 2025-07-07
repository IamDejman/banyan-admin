'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  Filter,
} from 'lucide-react';

// Mock data for counter offers
const counterOffers = [
  {
    id: '1',
    claimId: 'CLM-001',
    clientName: 'John Doe',
    type: 'MEDICAL_CLAIM',
    originalAmount: 7500,
    counterAmount: 8500,
    status: 'PENDING_REVIEW',
    presentedAt: '2024-03-15 10:30',
    dueDate: '2024-03-22 10:30',
  },
  {
    id: '2',
    claimId: 'CLM-002',
    clientName: 'Jane Smith',
    type: 'PROPERTY_CLAIM',
    originalAmount: 12000,
    counterAmount: 15000,
    status: 'PENDING_REVIEW',
    presentedAt: '2024-03-14 09:15',
    dueDate: '2024-03-21 09:15',
  },
  {
    id: '3',
    claimId: 'CLM-003',
    clientName: 'Mike Johnson',
    type: 'MEDICAL_CLAIM',
    originalAmount: 5000,
    counterAmount: 5500,
    status: 'PENDING_REVIEW',
    presentedAt: '2024-03-15 11:30',
    dueDate: '2024-03-22 11:30',
  },
];

// Response templates
const responseTemplates = [
  {
    id: '1',
    name: 'Standard Acceptance',
    template: 'We accept your counter offer of ${amount}. The settlement will be processed according to the agreed terms.',
  },
  {
    id: '2',
    name: 'Standard Rejection',
    template: 'We regret to inform you that we cannot accept the counter offer of ${amount}. We would like to propose a different amount.',
  },
  {
    id: '3',
    name: 'Negotiation Request',
    template: 'Thank you for your counter offer of ${amount}. We would like to discuss this further and propose a middle ground.',
  },
];

export default function BulkResponsePage() {
  const router = useRouter();
  const [selectedOffers, setSelectedOffers] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState('');
  const [responseType] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [responseNotes, setResponseNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState<{ [key: string]: number }>({});
  const [isLoading, setIsLoading] = useState('');

  const handleSelectAll = () => {
    if (selectedOffers.length === counterOffers.length) {
      setSelectedOffers([]);
    } else {
      setSelectedOffers(counterOffers.map((offer) => offer.id));
    }
  };

  const handleSelectOffer = (id: string) => {
    setSelectedOffers((prev) =>
      prev.includes(id)
        ? prev.filter((offerId) => offerId !== id)
        : [...prev, id]
    );
  };

  const handleProcess = async () => {
    setIsProcessing(true);
    // Simulate processing progress
    for (const offerId of selectedOffers) {
      setProgress((prev) => ({ ...prev, [offerId]: 0 }));
      for (let i = 0; i <= 100; i += 10) {
        await new Promise((resolve) => setTimeout(resolve, 100));
        setProgress((prev) => ({ ...prev, [offerId]: i }));
      }
    }
    setIsProcessing(false);
    router.push('/dashboard/settlements/responses');
  };

  const handleResponse = async (type: string) => {
    setIsLoading(type);
    try {
      // Simulate response sending (replace with real API call)
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } finally {
      setIsLoading('');
    }
  };

  const filteredOffers = selectedType
    ? counterOffers.filter((offer) => offer.type === selectedType)
    : counterOffers;

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
          <h1 className="text-2xl font-bold">Bulk Counter-Offer Response</h1>
          <p className="text-muted-foreground">
            Process multiple counter-offers at once
          </p>
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Counter-Offer Selection</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="select-all"
                  checked={selectedOffers.length === counterOffers.length}
                  onCheckedChange={handleSelectAll}
                />
                <Label htmlFor="select-all">Select All</Label>
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <select
                  className="text-sm border rounded-md px-2 py-1"
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                >
                  <option value="">All Types</option>
                  <option value="MEDICAL_CLAIM">Medical Claim</option>
                  <option value="PROPERTY_CLAIM">Property Claim</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              {filteredOffers.map((offer) => (
                <div
                  key={offer.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <Checkbox
                      id={offer.id}
                      checked={selectedOffers.includes(offer.id)}
                      onCheckedChange={() => handleSelectOffer(offer.id)}
                    />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{offer.type.replace(/_/g, ' ')}</span>
                        <Badge variant="outline">{offer.status.replace(/_/g, ' ')}</Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Claim ID: {offer.claimId} • Client: {offer.clientName}
                      </div>
                      <div className="text-sm">
                        Original: ${offer.originalAmount.toLocaleString()} • Counter: ${offer.counterAmount.toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{offer.dueDate}</span>
                    </div>
                    {progress[offer.id] !== undefined && (
                      <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary transition-all"
                          style={{
                            width: `${progress[offer.id]}%`,
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {selectedOffers.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Response Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Response Type</Label>
                <div className="flex gap-2">
                  <Button
                    variant={responseType === 'ACCEPT' ? 'default' : 'outline'}
                    className="flex-1"
                    onClick={() => handleResponse('ACCEPT')}
                    disabled={isLoading === 'ACCEPT'}
                  >
                    {isLoading === 'ACCEPT' ? 'Accepting...' : (<><CheckCircle2 className="h-4 w-4 mr-2" />Accept</>)}
                  </Button>
                  <Button
                    variant={responseType === 'REJECT' ? 'default' : 'outline'}
                    className="flex-1"
                    onClick={() => handleResponse('REJECT')}
                    disabled={isLoading === 'REJECT'}
                  >
                    {isLoading === 'REJECT' ? 'Rejecting...' : (<><XCircle className="h-4 w-4 mr-2" />Reject</>)}
                  </Button>
                  <Button
                    variant={responseType === 'COUNTER' ? 'default' : 'outline'}
                    className="flex-1"
                    onClick={() => handleResponse('COUNTER')}
                    disabled={isLoading === 'COUNTER'}
                  >
                    {isLoading === 'COUNTER' ? 'Countering...' : (<><AlertCircle className="h-4 w-4 mr-2" />Counter</>)}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Response Template</Label>
                <select
                  className="w-full p-2 border rounded-md"
                  value={selectedTemplate}
                  onChange={(e) => {
                    setSelectedTemplate(e.target.value);
                    const template = responseTemplates.find((t) => t.id === e.target.value);
                    if (template) {
                      setResponseNotes(template.template);
                    }
                  }}
                >
                  <option value="">Select a template</option>
                  {responseTemplates.map((template) => (
                    <option key={template.id} value={template.id}>
                      {template.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label>Response Notes</Label>
                <Textarea
                  value={responseNotes}
                  onChange={(e) => setResponseNotes(e.target.value)}
                  placeholder="Enter response notes..."
                  rows={4}
                />
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => router.back()}
                  disabled={isProcessing}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1"
                  disabled={!responseType || !responseNotes || isProcessing}
                  onClick={handleProcess}
                >
                  {isProcessing ? 'Processing...' : 'Process Responses'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
} 