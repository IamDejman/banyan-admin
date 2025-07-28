'use client';

import { useState } from 'react';
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


const mockDocuments = [
  {
    id: 'DOC-001',
    claimId: 'CLM-001',
    clientName: 'John Smith',
    documentType: 'Police Report',
    submissionDate: '2024-01-15',
    status: 'Pending Verification',
    documentSize: '2.3 MB',
    fileType: 'pdf',
    verificationTime: '2.1 days',
    assignedTo: 'Sarah Wilson',
  },
  {
    id: 'DOC-002',
    claimId: 'CLM-001',
    clientName: 'John Smith',
    documentType: 'Medical Records',
    submissionDate: '2024-01-14',
    status: 'Pending Verification',
    documentSize: '1.8 MB',
    fileType: 'pdf',
    verificationTime: '1.5 days',
    assignedTo: 'Mike Johnson',
  },
  {
    id: 'DOC-003',
    claimId: 'CLM-002',
    clientName: 'Sarah Johnson',
    documentType: 'Photos',
    submissionDate: '2024-01-13',
    status: 'Pending Verification',
    documentSize: '5.2 MB',
    fileType: 'image',
    verificationTime: '3.2 days',
    assignedTo: 'Unassigned',
  },
  {
    id: 'DOC-004',
    claimId: 'CLM-003',
    clientName: 'Mike Wilson',
    documentType: 'Insurance Policy',
    submissionDate: '2024-01-12',
    status: 'Pending Verification',
    documentSize: '0.8 MB',
    fileType: 'doc',
    verificationTime: '0.8 days',
    assignedTo: 'David Brown',
  },
  {
    id: 'DOC-005',
    claimId: 'CLM-004',
    clientName: 'Lisa Brown',
    documentType: 'Repair Estimates',
    submissionDate: '2024-01-11',
    status: 'Pending Verification',
    documentSize: '3.1 MB',
    fileType: 'pdf',
    verificationTime: '2.8 days',
    assignedTo: 'Unassigned',
  },
];

const quickStats = [
  {
    title: 'Total Pending Documents',
    value: '156',
    icon: 'Clock',
    description: 'Requires verification',
    trend: '+12 from yesterday',
    trendUp: true,
  },
  {
    title: 'Documents by Claim Type',
    value: 'Property',
    icon: 'FileText',
    description: 'Most common type',
    trend: '45% of total',
    trendUp: true,
  },
  {
    title: 'Average Verification Time',
    value: '1.8 days',
    icon: 'Calendar',
    description: 'Last 30 days',
    trend: '-0.3 days',
    trendUp: false,
  },
  {
    title: 'Rejection Rate',
    value: '8.5%',
    icon: 'AlertCircle',
    description: 'By document type',
    trend: '-2.1%',
    trendUp: false,
  },
];

export default function DocumentsPage() {
  const [documents] = useState(mockDocuments);
  const [selectedDocument, setSelectedDocument] = useState<typeof mockDocuments[0] | null>(null);
  const [viewModal, setViewModal] = useState<{ isOpen: boolean; document: typeof mockDocuments[0] | null }>({ isOpen: false, document: null });
  const [approveModal, setApproveModal] = useState<{ isOpen: boolean; document: typeof mockDocuments[0] | null }>({ isOpen: false, document: null });
  const [rejectModal, setRejectModal] = useState<{ isOpen: boolean; document: typeof mockDocuments[0] | null }>({ isOpen: false, document: null });
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [fileTypeFilter, setFileTypeFilter] = useState("all");

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = 
      doc.clientName.toLowerCase().includes(search.toLowerCase()) ||
      doc.documentType.toLowerCase().includes(search.toLowerCase()) ||
      doc.claimId.toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || doc.status === statusFilter;
    const matchesFileType = fileTypeFilter === "all" || doc.fileType === fileTypeFilter;
    
    return matchesSearch && matchesStatus && matchesFileType;
  });

  const handleViewDocument = (doc: typeof mockDocuments[0]) => {
    setSelectedDocument(doc);
    setViewModal({ isOpen: true, document: doc });
  };

  const handleApproveDocument = (doc: typeof mockDocuments[0]) => {
    setSelectedDocument(doc);
    setApproveModal({ isOpen: true, document: doc });
  };

  const handleRejectDocument = (doc: typeof mockDocuments[0]) => {
    setSelectedDocument(doc);
    setRejectModal({ isOpen: true, document: doc });
  };

  const confirmApprove = () => {
    if (selectedDocument) {
      console.log('Approving document:', selectedDocument.id);
      // In a real app, you'd update the document status in the database
      setApproveModal({ isOpen: false, document: null });
      setSelectedDocument(null);
    }
  };

  const confirmReject = () => {
    if (selectedDocument) {
      console.log('Rejecting document:', selectedDocument.id);
      // In a real app, you'd update the document status in the database
      setRejectModal({ isOpen: false, document: null });
      setSelectedDocument(null);
    }
  };

  const getFileTypeIcon = (fileType: string) => {
    switch (fileType) {
      case 'pdf':
        return <FileText className="h-4 w-4 text-red-500" />;
      case 'image':
        return <FileText className="h-4 w-4 text-blue-500" />;
      case 'doc':
        return <FileText className="h-4 w-4 text-blue-600" />;
      default:
        return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'Pending Verification': "bg-yellow-100 text-yellow-800",
      'Verified': "bg-green-100 text-green-800",
      'Rejected': "bg-red-100 text-red-800",
    };
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800";
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
                  placeholder="Search documents..."
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
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
              <Select value={fileTypeFilter} onValueChange={setFileTypeFilter}>
                <SelectTrigger className="w-full lg:w-40">
                  <SelectValue placeholder="File Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="image">Image</SelectItem>
                  <SelectItem value="doc">DOC</SelectItem>
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
                  <TableHead className="hidden sm:table-cell">Status</TableHead>
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
                      <TableCell className="hidden sm:table-cell">{doc.claimId}</TableCell>
                      <TableCell className="hidden md:table-cell">{doc.clientName}</TableCell>
                      <TableCell className="hidden sm:table-cell">{doc.documentType}</TableCell>
                      <TableCell className="hidden lg:table-cell">{doc.submissionDate}</TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <Badge className={getStatusColor(doc.status)}>
                          {doc.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="flex items-center gap-2">
                          {getFileTypeIcon(doc.fileType)}
                          <span className="text-xs uppercase">{doc.fileType}</span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-xs">{doc.documentSize}</TableCell>
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
                  <Badge className={getStatusColor(doc.status)}>
                    {doc.status}
                  </Badge>
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Claim:</span>
                    <span>{doc.claimId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Client:</span>
                    <span>{doc.clientName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type:</span>
                    <span>{doc.documentType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">File:</span>
                    <div className="flex items-center gap-1">
                      {getFileTypeIcon(doc.fileType)}
                      <span className="text-xs uppercase">{doc.fileType}</span>
                    </div>
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
                    <span>{viewModal.document.claimId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Client:</span>
                    <span>{viewModal.document.clientName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Document Type:</span>
                    <span>{viewModal.document.documentType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Submission Date:</span>
                    <span>{viewModal.document.submissionDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">File Size:</span>
                    <span>{viewModal.document.documentSize}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">File Type:</span>
                    <span>{viewModal.document.fileType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Assigned To:</span>
                    <span>{viewModal.document.assignedTo}</span>
                  </div>
                </div>
              </div>

              {/* Document Preview */}
              <div className="space-y-4">
                <h4 className="font-semibold">Document Preview</h4>
                <div className="border rounded-lg p-4 bg-gray-50 min-h-[200px] sm:min-h-[300px] flex items-center justify-center">
                  <div className="text-center">
                    <FileText className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-sm text-muted-foreground">Document preview will appear here</p>
                    <p className="text-xs text-muted-foreground">Click to view full document</p>
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
                  <span className="text-sm">{approveModal.document.clientName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Document Type:</span>
                  <span className="text-sm">{approveModal.document.documentType}</span>
                </div>
              </div>
              
              <div className="flex gap-2 sm:gap-3 pt-4">
                <Button variant="outline" onClick={() => setApproveModal({ isOpen: false, document: null })} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={confirmApprove} className="flex-1">
                  <CheckSquare className="h-4 w-4 mr-2" />
                  Approve Document
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
                  <span className="text-sm">{rejectModal.document.clientName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Document Type:</span>
                  <span className="text-sm">{rejectModal.document.documentType}</span>
                </div>
              </div>
              
              <div className="flex gap-2 sm:gap-3 pt-4">
                <Button variant="outline" onClick={() => setRejectModal({ isOpen: false, document: null })} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={confirmReject} className="flex-1 bg-red-600 hover:bg-red-700">
                  <X className="h-4 w-4 mr-2" />
                  Reject Document
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 