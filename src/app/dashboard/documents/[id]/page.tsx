'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Upload,
  FileText,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Download,
  AlertCircle,
} from 'lucide-react';

// Mock data for document
const document = {
  id: 'DOC-001',
  claimId: 'CLM-001',
  name: 'Medical Report.pdf',
  type: 'MEDICAL_REPORT',
  status: 'PENDING_VERIFICATION',
  uploadedAt: '2024-03-15 10:00',
  uploadedBy: 'John Doe',
  size: '2.5 MB',
  pages: 5,
  verificationProgress: 60,
};

// Mock data for rejection reasons
const rejectionReasons = [
  'Document is illegible',
  'Document is incomplete',
  'Document is expired',
  'Document is not in required format',
  'Document is not properly signed',
  'Document is not properly dated',
  'Document is not properly notarized',
  'Document is not properly translated',
  'Document is not properly certified',
  'Other',
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

export default function DocumentVerificationPage() {
  const router = useRouter();
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [selectedReason, setSelectedReason] = useState('');
  const [rejectionNotes, setRejectionNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleVerify = async () => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    router.push(`/dashboard/claims/${document.claimId}`);
  };

  const handleReject = async () => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    router.push(`/dashboard/claims/${document.claimId}`);
  };

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
          <h1 className="text-2xl font-bold">Document Verification</h1>
          <p className="text-muted-foreground">
            Verify and manage document {document.id}
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Document Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Document ID</span>
                <span className="text-sm">{document.id}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Claim ID</span>
                <span className="text-sm">{document.claimId}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Name</span>
                <span className="text-sm">{document.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Type</span>
                <span className="text-sm">
                  {document.type.replace(/_/g, ' ')}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Status</span>
                <Badge
                  variant="secondary"
                  className={
                    document.status === 'PENDING_VERIFICATION'
                      ? 'bg-yellow-100 text-yellow-800'
                      : document.status === 'VERIFIED'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }
                >
                  {document.status.replace(/_/g, ' ')}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Uploaded By</span>
                <span className="text-sm">{document.uploadedBy}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Uploaded At</span>
                <span className="text-sm">{document.uploadedAt}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Size</span>
                <span className="text-sm">{document.size}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Pages</span>
                <span className="text-sm">{document.pages}</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Verification Progress</span>
                <span className="text-sm">{document.verificationProgress}%</span>
              </div>
              <Progress value={document.verificationProgress} />
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => router.back()}
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => router.back()}
              >
                <Upload className="h-4 w-4 mr-2" />
                Replace
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Document Viewer</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border rounded-lg p-4 bg-muted/50 h-[400px] flex items-center justify-center">
              <div className="text-center">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">
                  Document preview will be displayed here
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setZoom(Math.max(50, zoom - 10))}
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <span className="text-sm">{zoom}%</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setZoom(Math.min(200, zoom + 10))}
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setRotation((rotation + 90) % 360)}
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => router.back()}
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Verification Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Tabs defaultValue="verify">
              <TabsList>
                <TabsTrigger value="verify">Verify</TabsTrigger>
                <TabsTrigger value="reject">Reject</TabsTrigger>
              </TabsList>

              <TabsContent value="verify" className="space-y-4">
                <div className="space-y-2">
                  <Label>Verification Notes</Label>
                  <Textarea
                    placeholder="Enter any notes about the verification..."
                    rows={4}
                  />
                </div>
                <Button
                  className="w-full"
                  disabled={isSubmitting}
                  onClick={handleVerify}
                >
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  {isSubmitting ? 'Verifying...' : 'Verify Document'}
                </Button>
              </TabsContent>

              <TabsContent value="reject" className="space-y-4">
                <div className="space-y-2">
                  <Label>Rejection Reason</Label>
                  <Select
                    value={selectedReason}
                    onValueChange={setSelectedReason}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a reason" />
                    </SelectTrigger>
                    <SelectContent>
                      {rejectionReasons.map((reason) => (
                        <SelectItem key={reason} value={reason}>
                          {reason}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Rejection Notes</Label>
                  <Textarea
                    placeholder="Enter additional notes about the rejection..."
                    value={rejectionNotes}
                    onChange={(e) => setRejectionNotes(e.target.value)}
                    rows={4}
                  />
                </div>
                <Button
                  variant="destructive"
                  className="w-full"
                  disabled={!selectedReason || !rejectionNotes || isSubmitting}
                  onClick={handleReject}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  {isSubmitting ? 'Rejecting...' : 'Reject Document'}
                </Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 