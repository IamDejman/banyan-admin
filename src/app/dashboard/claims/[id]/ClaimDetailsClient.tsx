'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  User, 
  Calendar, 
  FileText, 
  DollarSign,
  CheckCircle,
  AlertCircle,
  Clock,
  Download,
  Eye,
  Edit
} from 'lucide-react';

interface ClaimDetailsClientProps {
  claimId: string;
}

// Mock claim data
const mockClaimData = {
  id: 'CLM-001',
  clientName: 'John Smith',
  clientEmail: 'john.smith@email.com',
  clientPhone: '+234 801 234 5678',
  submissionDate: '2024-01-15',
  claimType: 'Property Damage',
  status: 'Pending Review',
  documentStatus: 85,
  estimatedValue: 25000,
  description: 'Water damage to living room ceiling and walls due to roof leak during heavy rainfall.',
  documents: [
    { id: 'doc1', name: 'Property Photos', type: 'image', size: '2.3 MB', uploaded: '2024-01-15' },
    { id: 'doc2', name: 'Damage Assessment Report', type: 'pdf', size: '1.1 MB', uploaded: '2024-01-15' },
    { id: 'doc3', name: 'Insurance Policy', type: 'pdf', size: '3.2 MB', uploaded: '2024-01-14' },
  ],
  timeline: [
    { date: '2024-01-15', action: 'Claim Submitted', description: 'Initial claim filed by client' },
    { date: '2024-01-15', action: 'Documents Uploaded', description: 'Supporting documents provided' },
    { date: '2024-01-16', action: 'Under Review', description: 'Claim assigned for review' },
  ]
};

export default function ClaimDetailsClient({ claimId }: ClaimDetailsClientProps) {
  const [activeTab, setActiveTab] = useState('overview');

  function getStatusColor(status: string) {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      approved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
      processing: "bg-blue-100 text-blue-800",
    };
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800";
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Claim Details</h1>
          <p className="text-muted-foreground">Claim ID: {claimId}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Badge className={getStatusColor(mockClaimData.status)}>
              {mockClaimData.status}
            </Badge>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Document Status</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockClaimData.documentStatus}%</div>
            <Progress value={mockClaimData.documentStatus} className="h-2 mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estimated Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦{mockClaimData.estimatedValue.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Days Since Submission</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="actions">Actions</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Client Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{mockClaimData.clientName}</p>
                    <p className="text-sm text-muted-foreground">{mockClaimData.clientEmail}</p>
                    <p className="text-sm text-muted-foreground">{mockClaimData.clientPhone}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Claim Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Claim Type:</span>
                    <span className="text-sm">{mockClaimData.claimType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Submission Date:</span>
                    <span className="text-sm">{mockClaimData.submissionDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Estimated Value:</span>
                    <span className="text-sm">₦{mockClaimData.estimatedValue.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{mockClaimData.description}</p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Uploaded Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockClaimData.documents.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{doc.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {doc.type.toUpperCase()} • {doc.size} • Uploaded {doc.uploaded}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Timeline Tab */}
        <TabsContent value="timeline" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Claim Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockClaimData.timeline.map((event, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 bg-primary rounded-full"></div>
                      {index < mockClaimData.timeline.length - 1 && (
                        <div className="w-0.5 h-8 bg-gray-200 mt-1"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{event.action}</p>
                      <p className="text-sm text-muted-foreground">{event.description}</p>
                      <p className="text-xs text-muted-foreground">{event.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Actions Tab */}
        <TabsContent value="actions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Available Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <Button className="w-full" variant="outline">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve Claim
                </Button>
                <Button className="w-full" variant="outline">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Request More Info
                </Button>
                <Button className="w-full" variant="outline">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Claim
                </Button>
                <Button className="w-full" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export Details
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 