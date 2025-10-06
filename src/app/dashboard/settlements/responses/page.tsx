'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Search, MessageSquare, AlertCircle, CheckCircle2 } from 'lucide-react';

// Mock data for pending responses
const pendingResponses = [
  {
    id: '1',
    claimId: 'CLM-001',
    clientName: 'John Doe',
    type: 'MEDICAL_CLAIM',
    offerAmount: 7500,
    status: 'PENDING_RESPONSE',
    presentedAt: '2024-03-15 10:30',
  },
  {
    id: '2',
    claimId: 'CLM-002',
    clientName: 'Jane Smith',
    type: 'PROPERTY_CLAIM',
    offerAmount: 12000,
    status: 'COUNTER_OFFER',
    presentedAt: '2024-03-14 09:15',
    counterOfferAmount: 15000,
  },
];

// Mock data for settlements
const settlements = [
  {
    id: '1',
    claimId: 'CLM-003',
    clientName: 'Mike Johnson',
    type: 'MEDICAL_CLAIM',
    amount: 8500,
    status: 'PENDING_PAYMENT',
    acceptedAt: '2024-03-15 11:30',
    documents: ['Settlement Agreement', 'Release Form'],
  },
  {
    id: '2',
    claimId: 'CLM-004',
    clientName: 'Sarah Wilson',
    type: 'PROPERTY_CLAIM',
    amount: 15000,
    status: 'COMPLETED',
    acceptedAt: '2024-03-15 10:15',
    completedAt: '2024-03-16 14:30',
    documents: ['Settlement Agreement', 'Release Form', 'Payment Confirmation'],
  },
];

const statusColors = {
  PENDING_RESPONSE: 'bg-yellow-100 text-yellow-800',
  COUNTER_OFFER: 'bg-blue-100 text-blue-800',
  PENDING_PAYMENT: 'bg-purple-100 text-purple-800',
  COMPLETED: 'bg-green-100 text-green-800',
  DECLINED: 'bg-red-100 text-red-800',
};

export default function ResponsesPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('responses');
  const [searchQuery, setSearchQuery] = useState('');
  const [claimType, setClaimType] = useState<string>('all');
  const [settlementStatus, setSettlementStatus] = useState<string>('all');

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">Offer Response & Settlement</h1>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 w-full sm:w-64"
            />
          </div>
          {activeTab === 'responses' ? (
            <Select value={claimType} onValueChange={setClaimType}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Claim Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="MEDICAL_CLAIM">Medical Claim</SelectItem>
                <SelectItem value="PROPERTY_CLAIM">Property Claim</SelectItem>
              </SelectContent>
            </Select>
          ) : (
            <Select value={settlementStatus} onValueChange={setSettlementStatus}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="PENDING_PAYMENT">Pending Payment</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="responses">Pending Responses</TabsTrigger>
          <TabsTrigger value="settlements">Settlements</TabsTrigger>
        </TabsList>

        <TabsContent value="responses" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <CardTitle>Pending Responses</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingResponses.map((response) => (
                  <div
                    key={response.id}
                    className="flex flex-col gap-4 p-4 border rounded-lg sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="space-y-1">
                      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-2">
                        <span className="font-medium">
                          {response.type.replace(/_/g, ' ')}
                        </span>
                        <Badge
                          className={statusColors[response.status as keyof typeof statusColors]}
                        >
                          {response.status.replace(/_/g, ' ')}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Claim ID: {response.claimId}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Client: {response.clientName}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 sm:items-end">
                      <div className="text-sm">
                                        <span className="text-muted-foreground">Offer Amount: </span>
                ₦{response.offerAmount.toLocaleString()}
                      </div>
                      {response.status === 'COUNTER_OFFER' && response.counterOfferAmount && (
                        <div className="text-sm">
                          <span className="text-muted-foreground">
                            Counter Offer Amount:{' '}
                          </span>
                          ₦{response.counterOfferAmount.toLocaleString()}
                        </div>
                      )}
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            router.push(`/dashboard/settlements/responses/${response.id}`)
                          }
                        >
                          <MessageSquare className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                        {response.status === 'COUNTER_OFFER' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              router.push(
                                `/dashboard/settlements/responses/${response.id}/counter`
                              )
                            }
                          >
                            <AlertCircle className="h-4 w-4 mr-2" />
                            Review Counter
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settlements" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <CardTitle>Settlements</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {settlements.map((settlement) => (
                  <div
                    key={settlement.id}
                    className="flex flex-col gap-4 p-4 border rounded-lg sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="space-y-1">
                      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-2">
                        <span className="font-medium">
                          {settlement.type.replace(/_/g, ' ')}
                        </span>
                        <Badge
                          className={
                            statusColors[settlement.status as keyof typeof statusColors]
                          }
                        >
                          {settlement.status.replace(/_/g, ' ')}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Claim ID: {settlement.claimId}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Client: {settlement.clientName}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 sm:items-end">
                      <div className="text-sm">
                        <span className="text-muted-foreground">Amount: </span>
                        ₦{settlement.amount.toLocaleString()}
                      </div>
                      <div className="text-sm">
                        <span className="text-muted-foreground">Accepted: </span>
                        {settlement.acceptedAt}
                      </div>
                      {settlement.status === 'COMPLETED' && (
                        <div className="text-sm">
                          <span className="text-muted-foreground">Completed: </span>
                          {settlement.completedAt}
                        </div>
                      )}
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            router.push(`/dashboard/settlements/${settlement.id}`)
                          }
                        >
                          <FileText className="h-4 w-4 mr-2" />
                          View Documents
                        </Button>
                        {settlement.status === 'PENDING_PAYMENT' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              router.push(
                                `/dashboard/settlements/${settlement.id}/payment`
                              )
                            }
                          >
                            <CheckCircle2 className="h-4 w-4 mr-2" />
                            Process Payment
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 