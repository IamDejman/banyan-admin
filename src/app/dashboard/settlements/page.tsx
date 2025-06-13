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
import { FileText, Search, Calculator, AlertCircle, CheckCircle2 } from 'lucide-react';

// Mock data for claims ready for offer
const claimsReadyForOffer = [
  {
    id: '1',
    claimId: 'CLM-001',
    clientName: 'John Doe',
    type: 'MEDICAL_CLAIM',
    assessedValue: 5000,
    status: 'READY_FOR_OFFER',
    lastUpdated: '2024-03-15 10:30',
  },
  {
    id: '2',
    claimId: 'CLM-002',
    clientName: 'Jane Smith',
    type: 'PROPERTY_CLAIM',
    assessedValue: 15000,
    status: 'READY_FOR_OFFER',
    lastUpdated: '2024-03-15 09:15',
  },
];

// Mock data for settlement offers
const settlementOffers = [
  {
    id: '1',
    claimId: 'CLM-003',
    clientName: 'Mike Johnson',
    type: 'MEDICAL_CLAIM',
    offerAmount: 7500,
    status: 'PENDING_APPROVAL',
    createdBy: 'John Manager',
    createdAt: '2024-03-15 11:30',
  },
  {
    id: '2',
    claimId: 'CLM-004',
    clientName: 'Sarah Wilson',
    type: 'PROPERTY_CLAIM',
    offerAmount: 12000,
    status: 'APPROVED',
    createdBy: 'Jane Manager',
    createdAt: '2024-03-15 10:15',
  },
];

const statusColors = {
  READY_FOR_OFFER: 'bg-blue-100 text-blue-800',
  PENDING_APPROVAL: 'bg-yellow-100 text-yellow-800',
  APPROVED: 'bg-green-100 text-green-800',
  REJECTED: 'bg-red-100 text-red-800',
  ACCEPTED: 'bg-green-100 text-green-800',
  DECLINED: 'bg-red-100 text-red-800',
};

export default function SettlementsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('claims');
  const [searchQuery, setSearchQuery] = useState('');
  const [claimType, setClaimType] = useState<string>('all');
  const [offerStatus, setOfferStatus] = useState<string>('all');

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">Settlement Offers Management</h1>
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
          {activeTab === 'claims' ? (
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
            <Select value={offerStatus} onValueChange={setOfferStatus}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Offer Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="PENDING_APPROVAL">Pending Approval</SelectItem>
                <SelectItem value="APPROVED">Approved</SelectItem>
                <SelectItem value="REJECTED">Rejected</SelectItem>
                <SelectItem value="ACCEPTED">Accepted</SelectItem>
                <SelectItem value="DECLINED">Declined</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="claims">Claims Ready for Offer</TabsTrigger>
          <TabsTrigger value="offers">Settlement Offers</TabsTrigger>
        </TabsList>

        <TabsContent value="claims" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <CardTitle>Claims Ready for Offer</CardTitle>
                <Button onClick={() => router.push('/dashboard/settlements/new')}>
                  Create Offer
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {claimsReadyForOffer.map((claim) => (
                  <div
                    key={claim.id}
                    className="flex flex-col gap-4 p-4 border rounded-lg sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="space-y-1">
                      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-2">
                        <span className="font-medium">
                          {claim.type.replace(/_/g, ' ')}
                        </span>
                        <Badge
                          className={statusColors[claim.status as keyof typeof statusColors]}
                        >
                          {claim.status.replace(/_/g, ' ')}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Claim ID: {claim.claimId}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Client: {claim.clientName}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 sm:items-end">
                      <div className="text-sm">
                        <span className="text-muted-foreground">Assessed Value: </span>
                        ${claim.assessedValue.toLocaleString()}
                      </div>
                      <div className="text-sm">
                        <span className="text-muted-foreground">Last Updated: </span>
                        {claim.lastUpdated}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          router.push(`/dashboard/settlements/new?claimId=${claim.claimId}`)
                        }
                      >
                        <Calculator className="h-4 w-4 mr-2" />
                        Create Offer
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="offers" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <CardTitle>Settlement Offers</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {settlementOffers.map((offer) => (
                  <div
                    key={offer.id}
                    className="flex flex-col gap-4 p-4 border rounded-lg sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="space-y-1">
                      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-2">
                        <span className="font-medium">
                          {offer.type.replace(/_/g, ' ')}
                        </span>
                        <Badge
                          className={statusColors[offer.status as keyof typeof statusColors]}
                        >
                          {offer.status.replace(/_/g, ' ')}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Claim ID: {offer.claimId}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Client: {offer.clientName}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 sm:items-end">
                      <div className="text-sm">
                        <span className="text-muted-foreground">Offer Amount: </span>
                        ${offer.offerAmount.toLocaleString()}
                      </div>
                      <div className="text-sm">
                        <span className="text-muted-foreground">Created by: </span>
                        {offer.createdBy}
                      </div>
                      <div className="text-sm">
                        <span className="text-muted-foreground">Created at: </span>
                        {offer.createdAt}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            router.push(`/dashboard/settlements/${offer.id}`)
                          }
                        >
                          <FileText className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                        {offer.status === 'APPROVED' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              router.push(`/dashboard/settlements/${offer.id}/present`)
                            }
                          >
                            <CheckCircle2 className="h-4 w-4 mr-2" />
                            Present to Client
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