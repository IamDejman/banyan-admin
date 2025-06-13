'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ArrowLeft,
  Upload,
  FileText,
  X,
  CheckCircle2,
  AlertCircle,
  Plus,
} from 'lucide-react';

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

// Mock data for claims
const claims = [
  {
    id: 'CLM-001',
    clientName: 'John Doe',
    type: 'MEDICAL',
    status: 'PENDING',
  },
  {
    id: 'CLM-002',
    clientName: 'Jane Smith',
    type: 'PROPERTY',
    status: 'PENDING',
  },
];

export default function DocumentUploadPage() {
  const router = useRouter();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [selectedClaim, setSelectedClaim] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files);
      setSelectedFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    setIsUploading(true);
    // Simulate file upload progress
    for (const file of selectedFiles) {
      setUploadProgress((prev) => ({ ...prev, [file.name]: 0 }));
      for (let i = 0; i <= 100; i += 10) {
        await new Promise((resolve) => setTimeout(resolve, 100));
        setUploadProgress((prev) => ({ ...prev, [file.name]: i }));
      }
    }
    setIsUploading(false);
    router.push('/dashboard/documents');
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
          <h1 className="text-2xl font-bold">Upload Documents</h1>
          <p className="text-muted-foreground">
            Upload and manage documents for claims
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Upload Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Select Claim</Label>
              <Select
                value={selectedClaim}
                onValueChange={setSelectedClaim}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a claim" />
                </SelectTrigger>
                <SelectContent>
                  {claims.map((claim) => (
                    <SelectItem key={claim.id} value={claim.id}>
                      <div className="flex flex-col">
                        <span>{claim.id}</span>
                        <span className="text-xs text-muted-foreground">
                          {claim.clientName} - {claim.type}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Document Type</Label>
              <Select
                value={selectedType}
                onValueChange={setSelectedType}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select document type" />
                </SelectTrigger>
                <SelectContent>
                  {documentTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type.replace(/_/g, ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Upload Files</Label>
              <div className="border-2 border-dashed rounded-lg p-6">
                <div className="flex flex-col items-center justify-center gap-2">
                  <Upload className="h-8 w-8 text-muted-foreground" />
                  <div className="text-center">
                    <p className="text-sm font-medium">
                      Drag and drop files here
                    </p>
                    <p className="text-xs text-muted-foreground">
                      or click to browse
                    </p>
                  </div>
                  <Input
                    type="file"
                    multiple
                    className="hidden"
                    onChange={handleFileSelect}
                    id="file-upload"
                  />
                  <Button
                    variant="outline"
                    onClick={() => document.getElementById('file-upload')?.click()}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Select Files
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Selected Files</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedFiles.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-sm text-muted-foreground">
                  No files selected
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {selectedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <div className="space-y-1">
                        <p className="text-sm font-medium">{file.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {uploadProgress[file.name] !== undefined && (
                        <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary transition-all"
                            style={{
                              width: `${uploadProgress[file.name]}%`,
                            }}
                          />
                        </div>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveFile(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => router.back()}
                disabled={isUploading}
              >
                Cancel
              </Button>
              <Button
                className="flex-1"
                disabled={
                  !selectedClaim ||
                  !selectedType ||
                  selectedFiles.length === 0 ||
                  isUploading
                }
                onClick={handleUpload}
              >
                <Upload className="h-4 w-4 mr-2" />
                {isUploading ? 'Uploading...' : 'Upload Documents'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 