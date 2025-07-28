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
import { FileText, Search, Calculator, MessageSquare } from 'lucide-react';


const informationRequests = [
  {
    id: '1',
    claimId: 'CLM-001',
    clientName: 'John Doe',
    requestType: 'ADDITIONAL_DOCUMENTS',
    status: 'PENDING',
    requestedAt: '2024-03-15 10:30',
    dueDate: '2024-03-22 10:30',
    description: 'Please provide additional medical reports for the treatment period.',
  },
  {
    id: '2',
    claimId: 'CLM-002',
    clientName: 'Jane Smith',
    requestType: 'CLARIFICATION',
    status: 'RESPONDED',
    requestedAt: '2024-03-14 09:15',
    dueDate: '2024-03-21 09:15',
    description: 'Please clarify the circumstances of the incident.',
  },
];


const claimAssessments = [
  {
    id: '1',
    claimId: 'CLM-001',
    clientName: 'John Doe',
    status: 'PENDING_ASSESSMENT',
    type: 'MEDICAL_CLAIM',
    amount: 5000,
    assessedValue: null,
    lastUpdated: '2024-03-15 10:30',
  },
  {
    id: '2',
    claimId: 'CLM-002',
    clientName: 'Jane Smith',
    status: 'ASSESSED',
    type: 'PROPERTY_CLAIM',
    amount: 15000,
    assessedValue: 12000,
    lastUpdated: '2024-03-15 09:15',
  },
];

const statusColors = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  RESPONDED: 'bg-green-100 text-green-800',
  OVERDUE: 'bg-red-100 text-red-800',
  PENDING_ASSESSMENT: 'bg-yellow-100 text-yellow-800',
  ASSESSED: 'bg-green-100 text-green-800',
  REJECTED: 'bg-red-100 text-red-800',
};

export default function AssessmentsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('requests');
  const [searchQuery, setSearchQuery] = useState('');
  const [requestType, setRequestType] = useState<string>('all');
  const [claimType, setClaimType] = useState<string>('all');

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold">Assessments</h1>
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
          {activeTab === 'requests' ? (
            <Select value={requestType} onValueChange={setRequestType}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Request Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="ADDITIONAL_DOCUMENTS">Additional Documents</SelectItem>
                <SelectItem value="CLARIFICATION">Clarification</SelectItem>
              </SelectContent>
            </Select>
          ) : (
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
          )}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="requests">Information Requests</TabsTrigger>
          <TabsTrigger value="assessments">Claim Assessments</TabsTrigger>
        </TabsList>

        <TabsContent value="requests" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <CardTitle>Information Requests</CardTitle>
                <Button onClick={() => router.push('/dashboard/assessments/requests/new')}>
                  New Request
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {informationRequests.map((request) => (
                  <div
                    key={request.id}
                    className="flex flex-col gap-4 p-4 border rounded-lg sm:flex-row sm:items-start sm:justify-between"
                  >
                    <div className="space-y-1">
                      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-2">
                        <span className="font-medium">
                          {request.requestType.replace(/_/g, ' ')}
                        </span>
                        <Badge
                          className={statusColors[request.status as keyof typeof statusColors]}
                        >
                          {request.status}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Claim ID: {request.claimId}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Client: {request.clientName}
                      </div>
                      <div className="text-sm">{request.description}</div>
                    </div>
                    <div className="flex flex-col gap-2 sm:items-end">
                      <div className="text-sm">
                        <span className="text-muted-foreground">Requested: </span>
                        {request.requestedAt}
                      </div>
                      <div className="text-sm">
                        <span className="text-muted-foreground">Due: </span>
                        {request.dueDate}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          router.push(`/dashboard/assessments/requests/${request.id}`)
                        }
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assessments" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <CardTitle>Claim Assessments</CardTitle>
                <Button onClick={() => router.push('/dashboard/assessments/new')}>
                  New Assessment
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {claimAssessments.map((assessment) => (
                  <div
                    key={assessment.id}
                    className="flex flex-col gap-4 p-4 border rounded-lg sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="space-y-1">
                      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-2">
                        <span className="font-medium">
                          {assessment.type.replace(/_/g, ' ')}
                        </span>
                        <Badge
                          className={
                            statusColors[assessment.status as keyof typeof statusColors]
                          }
                        >
                          {assessment.status.replace(/_/g, ' ')}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Claim ID: {assessment.claimId}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Client: {assessment.clientName}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 sm:items-end">
                      <div className="text-sm">
                        <span className="text-muted-foreground">Claimed Amount: </span>
                        ₦{assessment.amount.toLocaleString()}
                      </div>
                      {assessment.assessedValue && (
                        <div className="text-sm">
                          <span className="text-muted-foreground">Assessed Value: </span>
                          ${assessment.assessedValue.toLocaleString()}
                        </div>
                      )}
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            router.push(`/dashboard/assessments/${assessment.id}`)
                          }
                        >
                          <Calculator className="h-4 w-4 mr-2" />
                          Assess
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            router.push(`/dashboard/assessments/${assessment.id}/evidence`)
                          }
                        >
                          <FileText className="h-4 w-4 mr-2" />
                          Evidence
                        </Button>
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