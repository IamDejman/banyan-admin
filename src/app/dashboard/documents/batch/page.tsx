'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  FileText,
  Clock,
  User,
  AlertCircle,
  Check,
  Filter,
} from 'lucide-react';

// Mock data for documents
const documents = [
  {
    id: 'DOC-001',
    claimId: 'CLM-001',
    name: 'Medical Report.pdf',
    type: 'MEDICAL_REPORT',
    status: 'PENDING_VERIFICATION',
    uploadedAt: '2024-03-15 10:00',
    uploadedBy: 'John Doe',
    size: '2.5 MB',
    pages: 5,
  },
  {
    id: 'DOC-002',
    claimId: 'CLM-001',
    name: 'Police Report.pdf',
    type: 'POLICE_REPORT',
    status: 'PENDING_VERIFICATION',
    uploadedAt: '2024-03-15 10:30',
    uploadedBy: 'John Doe',
    size: '1.8 MB',
    pages: 3,
  },
  {
    id: 'DOC-003',
    claimId: 'CLM-002',
    name: 'Insurance Policy.pdf',
    type: 'INSURANCE_POLICY',
    status: 'PENDING_VERIFICATION',
    uploadedAt: '2024-03-15 11:00',
    uploadedBy: 'Jane Smith',
    size: '3.2 MB',
    pages: 8,
  },
];

// Mock data for document types
const documentTypes = [
  'MEDICAL_REPORT',
  'POLICE_REPORT',
  'INSURANCE_POLICY',
  'IDENTIFICATION',
  'PROOF_OF_LOSS',
  'ESTIMATE',
  'INVOICE',
  'OTHER',
];

export default function BatchVerificationPage() {
  const router = useRouter();
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationProgress, setVerificationProgress] = useState<{ [key: string]: number }>({});

  const handleSelectAll = () => {
    if (selectedDocuments.length === documents.length) {
      setSelectedDocuments([]);
    } else {
      setSelectedDocuments(documents.map((doc) => doc.id));
    }
  };

  const handleSelectDocument = (id: string) => {
    setSelectedDocuments((prev) =>
      prev.includes(id)
        ? prev.filter((docId) => docId !== id)
        : [...prev, id]
    );
  };

  const handleVerify = async () => {
    setIsVerifying(true);
    // Simulate verification progress
    for (const docId of selectedDocuments) {
      setVerificationProgress((prev) => ({ ...prev, [docId]: 0 }));
      for (let i = 0; i <= 100; i += 10) {
        await new Promise((resolve) => setTimeout(resolve, 100));
        setVerificationProgress((prev) => ({ ...prev, [docId]: i }));
      }
    }
    setIsVerifying(false);
    router.push('/dashboard/documents');
  };

  const filteredDocuments = selectedType
    ? documents.filter((doc) => doc.type === selectedType)
    : documents;

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
          <h1 className="text-2xl font-bold">Batch Document Verification</h1>
          <p className="text-muted-foreground">
            Verify multiple documents at once
          </p>
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Document Selection</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="select-all"
                  checked={selectedDocuments.length === documents.length}
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
                  {documentTypes.map((type) => (
                    <option key={type} value={type}>
                      {type.replace(/_/g, ' ')}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              {filteredDocuments.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <Checkbox
                      id={doc.id}
                      checked={selectedDocuments.includes(doc.id)}
                      onCheckedChange={() => handleSelectDocument(doc.id)}
                    />
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <div className="space-y-1">
                        <p className="text-sm font-medium">{doc.name}</p>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{doc.type.replace(/_/g, ' ')}</Badge>
                          <span className="text-xs text-muted-foreground">
                            {doc.size} • {doc.pages} pages
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{doc.uploadedBy}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{doc.uploadedAt}</span>
                    </div>
                    {verificationProgress[doc.id] !== undefined && (
                      <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary transition-all"
                          style={{
                            width: `${verificationProgress[doc.id]}%`,
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

        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => router.back()}
            disabled={isVerifying}
          >
            <XCircle className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button
            className="flex-1"
            disabled={selectedDocuments.length === 0 || isVerifying}
            onClick={handleVerify}
          >
            <CheckCircle2 className="h-4 w-4 mr-2" />
            {isVerifying ? 'Verifying...' : 'Verify Selected Documents'}
          </Button>
        </div>
      </div>
    </div>
  );
} 