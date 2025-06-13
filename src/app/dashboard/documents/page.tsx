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
import { Checkbox } from '@/components/ui/checkbox';
import { FileText, Search, Filter } from 'lucide-react';
import { Label } from '@/components/ui/label';

// Mock data for documents
const documents = [
  {
    id: '1',
    claimId: 'CLM-001',
    clientName: 'John Doe',
    documentType: 'POLICY_DOCUMENT',
    status: 'PENDING',
    uploadedAt: '2024-03-15 10:30',
    verifiedBy: null,
    verificationDate: null,
  },
  {
    id: '2',
    claimId: 'CLM-002',
    clientName: 'Jane Smith',
    documentType: 'IDENTITY_PROOF',
    status: 'VERIFIED',
    uploadedAt: '2024-03-15 09:15',
    verifiedBy: 'Admin User',
    verificationDate: '2024-03-15 11:20',
  },
  {
    id: '3',
    claimId: 'CLM-003',
    clientName: 'Bob Wilson',
    documentType: 'MEDICAL_REPORT',
    status: 'REJECTED',
    uploadedAt: '2024-03-14 16:45',
    verifiedBy: 'Admin User',
    verificationDate: '2024-03-15 09:30',
  },
];

const documentTypes = [
  'POLICY_DOCUMENT',
  'IDENTITY_PROOF',
  'MEDICAL_REPORT',
  'PROOF_OF_LOSS',
  'PAYMENT_RECEIPT',
];

const statusColors = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  VERIFIED: 'bg-green-100 text-green-800',
  REJECTED: 'bg-red-100 text-red-800',
};

export default function DocumentsPage() {
  const router = useRouter();
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [documentType, setDocumentType] = useState<string>('all');
  const [status, setStatus] = useState<string>('all');

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedDocuments(documents.map((doc) => doc.id));
    } else {
      setSelectedDocuments([]);
    }
  };

  const handleSelectDocument = (documentId: string, checked: boolean) => {
    if (checked) {
      setSelectedDocuments([...selectedDocuments, documentId]);
    } else {
      setSelectedDocuments(selectedDocuments.filter((id) => id !== documentId));
    }
  };

  const handleBatchVerify = () => {
    // Handle batch verification
    console.log('Batch verify:', selectedDocuments);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">Documents</h1>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 w-full sm:w-64"
            />
          </div>
          <Select value={documentType} onValueChange={setDocumentType}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Document Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {documentTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type.replace(/_/g, ' ')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="VERIFIED">Verified</SelectItem>
              <SelectItem value="REJECTED">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>Documents Pending Verification</CardTitle>
            {selectedDocuments.length > 0 && (
              <Button onClick={handleBatchVerify}>
                Verify Selected ({selectedDocuments.length})
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-2 border-b pb-4">
              <Checkbox
                id="select-all"
                checked={selectedDocuments.length === documents.length}
                onCheckedChange={handleSelectAll}
              />
              <Label htmlFor="select-all" className="text-sm font-medium">
                Select All
              </Label>
            </div>
            {documents.map((document) => (
              <div
                key={document.id}
                className="flex flex-col gap-4 p-4 border rounded-lg sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-start gap-4">
                  <Checkbox
                    id={`document-${document.id}`}
                    checked={selectedDocuments.includes(document.id)}
                    onCheckedChange={(checked) =>
                      handleSelectDocument(document.id, checked as boolean)
                    }
                  />
                  <div className="space-y-1">
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-2">
                      <span className="font-medium">{document.documentType.replace(/_/g, ' ')}</span>
                      <Badge
                        className={statusColors[document.status as keyof typeof statusColors]}
                      >
                        {document.status}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Claim ID: {document.claimId}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Client: {document.clientName}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                  <div className="text-sm">
                    <span className="text-muted-foreground">Uploaded: </span>
                    {document.uploadedAt}
                  </div>
                  {document.verifiedBy && (
                    <div className="text-sm">
                      <span className="text-muted-foreground">Verified by: </span>
                      {document.verifiedBy}
                    </div>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(`/dashboard/documents/${document.id}`)}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    View
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 