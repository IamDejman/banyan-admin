'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  Download,
  Eye,
  CheckSquare,
  X,
  MessageSquare,
  FileText,
  Clock,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { getDocumentStatistics, updateDocument, listDocuments } from '@/app/services/dashboard';
import { useToast } from '@/components/ui/use-toast';

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

interface DocumentStats {
  total_pending_documents: number;
  total_pending_documents_percentage: number;
  documents_by_claim_type: number;
  documents_by_claim_type_percentage: number;
  average_verification_time: number;
  average_verification_time_percentage: number;
  rejection_rate: number;
  rejection_rate_percentage: number;
}

interface ModalState {
  isOpen: boolean;
  document: Document | null;
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [viewModal, setViewModal] = useState<ModalState>({ isOpen: false, document: null });
  const [approveModal, setApproveModal] = useState<ModalState>({ isOpen: false, document: null });
  const [rejectModal, setRejectModal] = useState<ModalState>({ isOpen: false, document: null });
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [fileTypeFilter, setFileTypeFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [documentStats, setDocumentStats] = useState<DocumentStats>({
    total_pending_documents: 0,
    total_pending_documents_percentage: 0,
    documents_by_claim_type: 0,
    documents_by_claim_type_percentage: 0,
    average_verification_time: 0,
    average_verification_time_percentage: 0,
    rejection_rate: 0,
    rejection_rate_percentage: 0
  });

  const filteredDocuments = documents.filter((doc: Document) => {
    const matchesSearch =
      (doc.document_type || 'N/A').toLowerCase().includes(search.toLowerCase()) ||
      (doc.claim_id || 'N/A').toString().toLowerCase().includes(search.toLowerCase()) ||
      (doc.client || 'N/A').toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === "all" || (doc.document_uploaded ? "uploaded" : "pending") === statusFilter;
    const matchesFileType = fileTypeFilter === "all" || (doc.file_type || '').toLowerCase() === fileTypeFilter.toLowerCase();

    return matchesSearch && matchesStatus && matchesFileType;
  });

  const handleViewDocument = (doc: Document) => {
    setSelectedDocument(doc);
    setViewModal({ isOpen: true, document: doc });
  };

  const handleApproveDocument = (doc: Document) => {
    setSelectedDocument(doc);
    setApproveModal({ isOpen: true, document: doc });
  };

  const handleRejectDocument = (doc: Document) => {
    setSelectedDocument(doc);
    setRejectModal({ isOpen: true, document: doc });
  };

  const confirmApprove = () => {
    if (selectedDocument) {
      console.log('Approving document:', selectedDocument.id);
      setIsLoading(true);

      // Call the updateDocument API to approve the document
      updateDocument(selectedDocument.id.toString(), 'approve')
        .then((response) => {
          console.log('Document approved successfully:', response);
          // Update the local state to reflect the change
          setDocuments(prevDocs =>
            prevDocs.map(doc =>
              doc.id === selectedDocument.id
                ? { ...doc, status: 'approved' }
                : doc
            )
          );
          setApproveModal({ isOpen: false, document: null });
          setSelectedDocument(null);
          toast({
            title: 'Document approved successfully',
            description: 'Document approved successfully',
            variant: 'default'
          });
        })
        .catch((error) => {
          console.error('Error approving document:', error?.response?.data?.message);
          toast({
            title: 'Error approving document',
            description: error?.response?.data?.message,
            variant: 'destructive'
          });
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  const confirmReject = () => {
    if (selectedDocument) {
      console.log('Rejecting document:', selectedDocument.id);

      // Call the updateDocument API to reject the document
      updateDocument(selectedDocument.id.toString(), 'reject')
        .then((response) => {
          console.log('Document rejected successfully:', response);
          // Update the local state to reflect the change
          setDocuments(prevDocs =>
            prevDocs.map(doc =>
              doc.id === selectedDocument.id
                ? { ...doc, status: 'rejected' }
                : doc
            )
          );
          setRejectModal({ isOpen: false, document: null });
          setSelectedDocument(null);
          toast({
            title: 'Document rejected successfully',
            description: 'Document rejected successfully',
            variant: 'default'
          });
        })
        .catch((error) => {
          console.error('Error rejecting document:', error?.response?.data?.message);
          // You might want to show an error toast here
          toast({
            title: 'Error rejecting document',
            description: error.message,
            variant: 'destructive'
          });
        })
        .finally(() => {
          setIsLoading(false);
        });
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

  const getStatusColor = (documentUploaded: boolean) => {
    if (documentUploaded) {
      return "bg-green-100 text-green-800";
    } else {
      return "bg-yellow-100 text-yellow-800";
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
    return new Date(createdAt).toLocaleDateString();
  };

  const getAssignedTo = () => {
    return "N/A"; // API doesn't provide assigned user
  };

  const getVerificationTime = (createdAt: string, updatedAt: string) => {
    if (!createdAt || !updatedAt) return "N/A";
    const created = new Date(createdAt);
    const updated = new Date(updatedAt);
    const diffTime = Math.abs(updated.getTime() - created.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} days`;
  };

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'Clock':
        return <Clock className="h-4 w-4 text-muted-foreground" />;
      case 'FileText':
        return <FileText className="h-4 w-4 text-muted-foreground" />;
      case 'Calendar':
        return <Calendar className="h-4 w-4 text-muted-foreground" />;
      case 'AlertCircle':
        return <AlertCircle className="h-4 w-4 text-muted-foreground" />;
      default:
        return <FileText className="h-4 w-4 text-muted-foreground" />;
    }
  };

  useEffect(() => {
    console.log("fetching document statistics__");
    getDocumentStatistics().then((res) => {
      console.log(res, "res__");
      // Handle the response - it might be an array with the first element being the data
      const statsData = Array.isArray(res) ? res[0] : res;
      if (statsData) {
        // Use the original percentage values from API
        setDocumentStats({
          total_pending_documents: statsData.total_pending_documents || 0,
          total_pending_documents_percentage: statsData.total_pending_documents_percentage || 0,
          documents_by_claim_type: statsData.documents_by_claim_type || 0,
          documents_by_claim_type_percentage: statsData.documents_by_claim_type_percentage || 0,
          average_verification_time: statsData.average_verification_time || 0,
          average_verification_time_percentage: statsData.average_verification_time_percentage || 0,
          rejection_rate: statsData.rejection_rate || 0,
          rejection_rate_percentage: statsData.rejection_rate_percentage || 0
        });
      }
    });
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
      setDocuments(documentsData);
    });
  }, []);

  // Generate quickStats from API data
  const quickStats = [
    {
      title: 'Total Pending Documents',
      value: documentStats.total_pending_documents.toString(),
      icon: 'Clock',
      description: 'Requires verification',
      trend: `+${documentStats.total_pending_documents_percentage}% from yesterday`,
      trendUp: documentStats.total_pending_documents_percentage > 0,
    },
    {
      title: 'Documents by Claim Type',
      value: documentStats.documents_by_claim_type.toString(),
      icon: 'FileText',
      description: 'Most common type',
      trend: `${documentStats.documents_by_claim_type_percentage}% of total`,
      trendUp: documentStats.documents_by_claim_type_percentage > 0,
    },
    {
      title: 'Average Verification Time',
      value: `${documentStats.average_verification_time} days`,
      icon: 'Calendar',
      description: 'Last 30 days',
      trend: `${documentStats.average_verification_time_percentage > 0 ? '+' : ''}${documentStats.average_verification_time_percentage}%`,
      trendUp: documentStats.average_verification_time_percentage < 0,
    },
    {
      title: 'Rejection Rate',
      value: `${documentStats.rejection_rate}%`,
      icon: 'AlertCircle',
      description: 'By document type',
      trend: `${documentStats.rejection_rate_percentage > 0 ? '+' : ''}${documentStats.rejection_rate_percentage}%`,
      trendUp: documentStats.rejection_rate_percentage < 0,
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Documents</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {quickStats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">
                {stat.title}
              </CardTitle>
              {getIconComponent(stat.icon)}
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
                <div className={`flex items-center text-xs ${stat.trendUp ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.trend}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Pending Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:gap-4">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by type, claim ID, or client..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8 w-full lg:w-64"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full lg:w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="uploaded">Uploaded</SelectItem>
                  <SelectItem value="pending">Pending Upload</SelectItem>
                </SelectContent>
              </Select>
              <Select value={fileTypeFilter} onValueChange={setFileTypeFilter}>
                <SelectTrigger className="w-full lg:w-40">
                  <SelectValue placeholder="File Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="doc">DOC</SelectItem>
                  <SelectItem value="docx">DOCX</SelectItem>
                  <SelectItem value="jpg">JPG</SelectItem>
                  <SelectItem value="png">PNG</SelectItem>
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
                  <TableHead className="w-20 sm:w-auto">Document ID</TableHead>
                  <TableHead className="hidden sm:table-cell">Claim ID</TableHead>
                  <TableHead className="hidden md:table-cell">Client</TableHead>
                  <TableHead className="hidden sm:table-cell">Document Type</TableHead>
                  <TableHead className="hidden lg:table-cell">Submission Date</TableHead>
                  <TableHead className="hidden sm:table-cell">Document Status</TableHead>
                  <TableHead className="hidden md:table-cell">File Type</TableHead>
                  <TableHead className="hidden lg:table-cell">Size</TableHead>
                  <TableHead className="w-20 sm:w-auto">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDocuments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8">
                      <div className="text-center">
                        <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">No documents found</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredDocuments.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell className="font-medium text-xs sm:text-sm">{doc.id}</TableCell>
                      <TableCell className="hidden sm:table-cell">{doc.claim_id}</TableCell>
                      <TableCell className="hidden md:table-cell">{doc.client || "N/A"}</TableCell>
                      <TableCell className="hidden sm:table-cell">{doc.document_type}</TableCell>
                      <TableCell className="hidden lg:table-cell">{getSubmissionDate(doc.created_at || '')}</TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <Badge className={getStatusColor(doc.document_uploaded)}>
                          {doc.document_uploaded ? "Uploaded" : "Pending Upload"}
                        </Badge>
                        {doc.status && (
                          <Badge className={`ml-2 ${doc.status === 'approved' ? 'bg-green-100 text-green-800' : doc.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}>
                            {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="flex items-center gap-2">
                          {getFileTypeIcon(doc.file_type || null)}
                          <span className="text-xs uppercase">{getFileType(doc.file_type || null)}</span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-xs">{getFileSize(doc.file_size || null)}</TableCell>
                      <TableCell>
                        <div className="flex gap-1 sm:gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handleViewDocument(doc)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700" onClick={() => handleApproveDocument(doc)}>
                            <CheckSquare className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700" onClick={() => handleRejectDocument(doc)}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
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
                  <span className="font-medium text-sm">{doc.id}</span>
                  <div className="flex gap-2">
                    <Badge className={getStatusColor(doc.document_uploaded)}>
                      {doc.document_uploaded ? "Uploaded" : "Pending Upload"}
                    </Badge>
                    {doc.status && (
                      <Badge className={doc.status === 'approved' ? 'bg-green-100 text-green-800' : doc.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}>
                        {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Claim:</span>
                    <span>{doc.claim_id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Client:</span>
                    <span>{doc.client || "N/A"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type:</span>
                    <span>{doc.document_type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">File:</span>
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
                  <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700 flex-1" onClick={() => handleApproveDocument(doc)}>
                    <CheckSquare className="h-4 w-4 mr-1" />
                    Approve
                  </Button>
                  <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 flex-1" onClick={() => handleRejectDocument(doc)}>
                    <X className="h-4 w-4 mr-1" />
                    Reject
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
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Verification Time:</span>
                    <span>{getVerificationTime(viewModal.document.created_at || '', viewModal.document.updated_at || '')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Assigned To:</span>
                    <span>{getAssignedTo()}</span>
                  </div>
                </div>
              </div>

              {/* Document Preview */}
              <div className="space-y-4">
                <h4 className="font-semibold">Document Preview</h4>
                <div className="border rounded-lg p-4 bg-gray-50 min-h-[200px] sm:min-h-[300px] flex items-center justify-center">
                  <div className="text-center">
                    <FileText className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-sm text-muted-foreground">Document will open in new tab</p>
                    <p className="text-xs text-muted-foreground cursor-pointer" onClick={() => window.open(viewModal.document?.document_url || '', '_blank')}>Click to view full document</p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Add Note
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Approve Document Modal */}
      {approveModal.isOpen && approveModal.document && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-md mx-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Approve Document</h3>
              <Button variant="ghost" size="sm" onClick={() => setApproveModal({ isOpen: false, document: null })}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">Are you sure you want to approve this document?</p>
              <div className="bg-gray-50 p-3 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Document ID:</span>
                  <span className="text-sm">{approveModal.document.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Client:</span>
                  <span className="text-sm">{approveModal.document.client || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Document Type:</span>
                  <span className="text-sm">{approveModal.document.document_type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">File Type:</span>
                  <span className="text-sm">{getFileType(approveModal.document.file_type || null)}</span>
                </div>
              </div>

              <div className="flex gap-2 sm:gap-3 pt-4">
                <Button variant="outline" onClick={() => setApproveModal({ isOpen: false, document: null })} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={confirmApprove} className="flex-1" disabled={isLoading}>
                  <CheckSquare className="h-4 w-4 mr-2" />
                  {isLoading ? 'Approving...' : 'Approve Document'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reject Document Modal */}
      {rejectModal.isOpen && rejectModal.document && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-md mx-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Reject Document</h3>
              <Button variant="ghost" size="sm" onClick={() => setRejectModal({ isOpen: false, document: null })}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">Are you sure you want to reject this document?</p>
              <div className="bg-gray-50 p-3 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Document ID:</span>
                  <span className="text-sm">{rejectModal.document.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Client:</span>
                  <span className="text-sm">{rejectModal.document.client || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Document Type:</span>
                  <span className="text-sm">{rejectModal.document.document_type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">File Type:</span>
                  <span className="text-sm">{getFileType(rejectModal.document.file_type || null)}</span>
                </div>
              </div>

              <div className="flex gap-2 sm:gap-3 pt-4">
                <Button variant="outline" onClick={() => setRejectModal({ isOpen: false, document: null })} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={confirmReject} className="flex-1 bg-red-600 hover:bg-red-700" disabled={isLoading}>
                  <X className="h-4 w-4 mr-2" />
                  {isLoading ? 'Rejecting...' : 'Reject Document'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 