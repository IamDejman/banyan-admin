'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Search,
  Eye,
  X,
  FileText
} from 'lucide-react';
import { listDocuments } from '@/app/services/dashboard';
import { formatDate } from '@/lib/utils/text-formatting';

// Define proper types for documents
interface Document {
  id: string | number;
  document_type: string;
  claim_id: string | number;
  client: string;
  document_uploaded: boolean;
  file_type: string;
  file_size?: string;
  document_url?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

interface ModalState {
  isOpen: boolean;
  document: Document | null;
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [viewModal, setViewModal] = useState<ModalState>({ isOpen: false, document: null });
  const [search, setSearch] = useState("");
  const [fileTypeFilter, setFileTypeFilter] = useState("all");
  const [availableFileTypes, setAvailableFileTypes] = useState<string[]>([]);

  const filteredDocuments = documents.filter((doc: Document) => {
    const matchesSearch =
      (doc.document_type || 'N/A').toLowerCase().includes(search.toLowerCase()) ||
      (doc.claim_id || 'N/A').toString().toLowerCase().includes(search.toLowerCase()) ||
      (doc.client || 'N/A').toLowerCase().includes(search.toLowerCase());

    const matchesFileType = fileTypeFilter === "all" || (doc.file_type || '').toLowerCase() === fileTypeFilter.toLowerCase();

    return matchesSearch && matchesFileType;
  });

  const handleViewDocument = (doc: Document) => {
    if (doc.document_url) {
      // Open document in new tab
      window.open(doc.document_url, '_blank');
    } else {
      // Show modal if no direct URL
      setViewModal({ isOpen: true, document: doc });
    }
  };

  const getFileTypeIcon = (fileType: string | null) => {
    if (!fileType) {
      return <FileText className="h-4 w-4 text-gray-500" />;
    }

    const fileTypeLower = fileType.toLowerCase();
    switch (fileTypeLower) {
      case 'pdf':
        return <FileText className="h-4 w-4 text-red-500" />;
      case 'png':
      case 'jpg':
      case 'jpeg':
      case 'gif':
        return <FileText className="h-4 w-4 text-blue-500" />;
      case 'doc':
      case 'docx':
        return <FileText className="h-4 w-4 text-blue-600" />;
      default:
        return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  const getFileType = (fileType: string | null) => {
    if (!fileType) return "N/A";
    return fileType.toUpperCase();
  };

  const getFileSize = (fileSize: string | null) => {
    if (!fileSize) return "N/A";
    return fileSize;
  };

  const getSubmissionDate = (createdAt: string) => {
    if (!createdAt) return "N/A";
    return formatDate(createdAt);
  };

  // Extract unique file types from documents data
  const extractUniqueFileTypes = (documentsData: Document[]): string[] => {
    const fileTypeSet = new Set<string>();
    documentsData.forEach((doc: Document) => {
      if (doc.file_type) {
        fileTypeSet.add(doc.file_type.toLowerCase());
      }
    });
    return Array.from(fileTypeSet).sort();
  };

  useEffect(() => {
    listDocuments().then((res: unknown) => {
      console.log(res, "res__");
      // Handle the response - it might be an array with the first element being the data
      // or an object with a data property
      let documentsData: Document[] = [];
      if (Array.isArray(res)) {
        documentsData = res as Document[];
      } else if (res && typeof res === 'object' && 'data' in res) {
        documentsData = (res as { data?: Document[] }).data || [];
      }
      
      // Extract and set available file types from API response
      const uniqueFileTypes = extractUniqueFileTypes(documentsData);
      setAvailableFileTypes(uniqueFileTypes);
      
      setDocuments(documentsData);
    });
  }, []);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Documents</h1>
        </div>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:gap-4 flex-1">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by type, claim ID, or client..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8 w-full"
                />
              </div>
              <Select value={fileTypeFilter} onValueChange={setFileTypeFilter}>
                <SelectTrigger className="w-full lg:w-40">
                  <SelectValue placeholder="File Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {availableFileTypes.map((fileType) => (
                    <SelectItem key={fileType} value={fileType}>
                      {fileType.toUpperCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Documents Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-32">Claim ID</TableHead>
                  <TableHead>Document Type</TableHead>
                  <TableHead className="w-36">Client</TableHead>
                  <TableHead className="w-28">File Type</TableHead>
                  <TableHead className="w-20">Size</TableHead>
                  <TableHead className="w-28">Submission Date</TableHead>
                  <TableHead className="w-20">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDocuments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="text-center">
                        <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">No documents found</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredDocuments.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell className="font-medium text-sm">{doc.claim_id}</TableCell>
                      <TableCell className="text-sm max-w-48 truncate" title={doc.document_type}>
                        {doc.document_type}
                      </TableCell>
                      <TableCell className="text-sm truncate" title={doc.client || 'N/A'}>
                        {doc.client || 'N/A'}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getFileTypeIcon(doc.file_type || null)}
                          <span className="text-xs uppercase">{getFileType(doc.file_type || null)}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs">{getFileSize(doc.file_size || null)}</TableCell>
                      <TableCell className="text-xs">{getSubmissionDate(doc.created_at || '')}</TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleViewDocument(doc)}
                          className="h-8 w-8 p-0"
                          title="View Document"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Documents Cards */}
          <div className="sm:hidden space-y-3 p-4">
            {filteredDocuments.map((doc) => (
              <div key={doc.id} className="border rounded-lg p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm">Claim ID: {doc.claim_id}</span>
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Document Type:</span>
                    <span>{doc.document_type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Submission Date:</span>
                    <span>{getSubmissionDate(doc.created_at || '')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">File Type:</span>
                    <div className="flex items-center gap-1">
                      {getFileTypeIcon(doc.file_type || null)}
                      <span className="text-xs uppercase">{getFileType(doc.file_type || null)}</span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Size:</span>
                    <span>{getFileSize(doc.file_size || null)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <Button variant="ghost" size="sm" onClick={() => handleViewDocument(doc)} className="flex-1">
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* View Document Modal */}
      {viewModal.isOpen && viewModal.document && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-4xl mx-auto max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">View Document</h3>
              <Button variant="ghost" size="sm" onClick={() => setViewModal({ isOpen: false, document: null })}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              {/* Document Info */}
              <div className="space-y-4">
                <h4 className="font-semibold">Document Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Document ID:</span>
                    <span>{viewModal.document.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Claim ID:</span>
                    <span>{viewModal.document.claim_id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Client:</span>
                    <span>{viewModal.document.client || "N/A"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Document Type:</span>
                    <span>{viewModal.document.document_type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">File Type:</span>
                    <span>{getFileType(viewModal.document.file_type || null)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">File Size:</span>
                    <span>{getFileSize(viewModal.document.file_size || null)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Submission Date:</span>
                    <span>{getSubmissionDate(viewModal.document.created_at || '')}</span>
                  </div>
                </div>
              </div>

              {/* Document Preview */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">Document Preview</h4>
                  {viewModal.document?.document_url && (
                    <Button 
                      onClick={() => window.open(viewModal.document?.document_url || '', '_blank')}
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <Eye className="h-4 w-4" />
                      Open Document
                    </Button>
                  )}
                </div>
                <div className="border rounded-lg p-4 bg-gray-50 min-h-[200px] sm:min-h-[300px] flex items-center justify-center">
                  <div className="text-center">
                    <FileText className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-sm text-muted-foreground">
                      {viewModal.document?.document_url 
                        ? "Click 'Open Document' to view in new tab" 
                        : "Document preview not available"
                      }
                    </p>
                    {viewModal.document?.document_url && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => window.open(viewModal.document?.document_url || '', '_blank')}
                        className="mt-2"
                      >
                        View Full Document
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}