'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, FileImage, Search, Filter, ChevronUp, ChevronDown, User, Eye, X, Download, MessageSquare, CheckSquare, Clock, Calendar, AlertCircle } from 'lucide-react';
import Link from 'next/link';

// Mock data for demonstration
const mockDocuments = [
  {
    id: 'DOC-001',
    claimId: 'CLM-001',
    clientName: 'John Smith',
    documentType: 'Police Report',
    submissionDate: '2024-01-15',
    status: 'Pending Verification',
    priority: 'High',
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
    priority: 'Medium',
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
    priority: 'High',
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
    priority: 'Low',
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
    priority: 'High',
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
    icon: Clock,
    description: 'Requires verification',
    trend: '+12 from yesterday',
    trendUp: true,
  },
  {
    title: 'Documents by Claim Type',
    value: 'Property',
    icon: FileText,
    description: 'Most common type',
    trend: '45% of total',
    trendUp: true,
  },
  {
    title: 'Average Verification Time',
    value: '1.8 days',
    icon: Calendar,
    description: 'Last 30 days',
    trend: '-0.3 days',
    trendUp: false,
  },
  {
    title: 'Rejection Rate',
    value: '8.5%',
    icon: AlertCircle,
    description: 'By document type',
    trend: '-2.1%',
    trendUp: false,
  },
];

const documentTypes = [
  { label: 'Property Damage', value: 'property', count: 45, avgTime: '1.2 days' },
  { label: 'Auto Accident', value: 'auto', count: 38, avgTime: '1.8 days' },
  { label: 'Medical', value: 'medical', count: 28, avgTime: '2.1 days' },
  { label: 'Liability', value: 'liability', count: 25, avgTime: '1.5 days' },
];

const rejectionReasons = [
  'Document is illegible',
  'Missing required information',
  'Document is outdated',
  'Wrong document type submitted',
  'Document is incomplete',
  'Poor quality scan',
  'Document not relevant to claim',
  'Duplicate submission',
];

export default function DocumentsPage() {
  const [sortField, setSortField] = useState<string>('submissionDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    dateRange: 'all',
    documentType: 'all',
    status: 'all',
    priority: 'all',
  });
  const [activeTab, setActiveTab] = useState('pending');

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleSelectDocument = (docId: string) => {
    setSelectedDocuments(prev => 
      prev.includes(docId) 
        ? prev.filter(id => id !== docId)
        : [...prev, docId]
    );
  };

  const handleSelectAll = () => {
    if (selectedDocuments.length === mockDocuments.length) {
      setSelectedDocuments([]);
    } else {
      setSelectedDocuments(mockDocuments.map(doc => doc.id));
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getFileTypeIcon = (fileType: string) => {
    switch (fileType) {
      case 'pdf': return <FileText className="h-4 w-4 text-red-500" />;
      case 'image': return <FileImage className="h-4 w-4 text-blue-500" />;
      case 'doc': return <FileText className="h-4 w-4 text-blue-600" />;
      default: return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Documents</h1>
          <p className="text-muted-foreground">
            Centralized document verification and management
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button size="sm">
            <CheckSquare className="h-4 w-4 mr-2" />
            Batch Verify
          </Button>
        </div>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {quickStats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
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

      {/* Documents by Type Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Documents by Claim Type</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {documentTypes.map((type) => (
              <div key={type.value} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">{type.label}</p>
                  <p className="text-sm text-muted-foreground">{type.count} documents</p>
                  <p className="text-xs text-muted-foreground">Avg: {type.avgTime}</p>
                </div>
                <div className="text-2xl font-bold text-primary">{type.count}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pending">Pending Verification</TabsTrigger>
          <TabsTrigger value="verify">Verify Documents</TabsTrigger>
          <TabsTrigger value="reject">Reject Documents</TabsTrigger>
        </TabsList>

        {/* Pending Verification Tab */}
        <TabsContent value="pending" className="space-y-4">
          {/* Filters and Search */}
          <Card>
            <CardHeader>
              <CardTitle>Pending Verification Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:gap-4">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search documents..."
                      className="pl-8 w-full lg:w-64"
                    />
                  </div>
                  <Select value={filters.dateRange} onValueChange={(value) => setFilters(prev => ({ ...prev, dateRange: value }))}>
                    <SelectTrigger className="w-full lg:w-40">
                      <SelectValue placeholder="Date Range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Time</SelectItem>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="week">This Week</SelectItem>
                      <SelectItem value="month">This Month</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filters.documentType} onValueChange={(value) => setFilters(prev => ({ ...prev, documentType: value }))}>
                    <SelectTrigger className="w-full lg:w-40">
                      <SelectValue placeholder="Document Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="police">Police Report</SelectItem>
                      <SelectItem value="medical">Medical Records</SelectItem>
                      <SelectItem value="photos">Photos</SelectItem>
                      <SelectItem value="policy">Insurance Policy</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filters.priority} onValueChange={(value) => setFilters(prev => ({ ...prev, priority: value }))}>
                    <SelectTrigger className="w-full lg:w-40">
                      <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Priorities</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    More Filters
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Documents Table */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <input
                        type="checkbox"
                        checked={selectedDocuments.length === mockDocuments.length}
                        onChange={handleSelectAll}
                        className="rounded"
                      />
                    </TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        onClick={() => handleSort('id')}
                        className="h-auto p-0 font-medium"
                      >
                        Document ID
                        {sortField === 'id' && (
                          sortDirection === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                        )}
                      </Button>
                    </TableHead>
                    <TableHead>Claim ID</TableHead>
                    <TableHead>Client Name</TableHead>
                    <TableHead>Document Type</TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        onClick={() => handleSort('submissionDate')}
                        className="h-auto p-0 font-medium"
                      >
                        Submission Date
                        {sortField === 'submissionDate' && (
                          sortDirection === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                        )}
                      </Button>
                    </TableHead>
                    <TableHead>File Info</TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        onClick={() => handleSort('priority')}
                        className="h-auto p-0 font-medium"
                      >
                        Priority
                        {sortField === 'priority' && (
                          sortDirection === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                        )}
                      </Button>
                    </TableHead>
                    <TableHead>Assigned To</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockDocuments.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell>
                        <input
                          type="checkbox"
                          checked={selectedDocuments.includes(doc.id)}
                          onChange={() => handleSelectDocument(doc.id)}
                          className="rounded"
                        />
                      </TableCell>
                      <TableCell className="font-medium">{doc.id}</TableCell>
                      <TableCell>
                        <Link href={`/dashboard/claims/${doc.claimId}`} className="text-blue-600 hover:underline">
                          {doc.claimId}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          {doc.clientName}
                        </div>
                      </TableCell>
                      <TableCell>{doc.documentType}</TableCell>
                      <TableCell>{doc.submissionDate}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getFileTypeIcon(doc.fileType)}
                          <span className="text-sm text-muted-foreground">{doc.documentSize}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getPriorityColor(doc.priority)}>
                          {doc.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {doc.assignedTo === 'Unassigned' ? (
                            <span className="text-orange-600">Unassigned</span>
                          ) : (
                            doc.assignedTo
                          )}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/dashboard/documents/verify/${doc.id}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/dashboard/documents/reject/${doc.id}`}>
                              <X className="h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Verify Documents Tab */}
        <TabsContent value="verify" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Document Verification Interface</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 lg:grid-cols-2">
                {/* Document Viewer */}
                <div className="space-y-4">
                  <div className="border rounded-lg p-4 bg-gray-50 min-h-[400px] flex items-center justify-center">
                    <div className="text-center">
                      <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-sm text-muted-foreground">Document preview will appear here</p>
                      <p className="text-xs text-muted-foreground">Click on a document to view</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                    <Button size="sm" variant="outline">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Add Note
                    </Button>
                  </div>
                </div>

                {/* Verification Checklist */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Verification Checklist</h3>
                  <div className="space-y-3">
                    {[
                      'Document is legible and complete',
                      'All required information is present',
                      'Document is relevant to the claim',
                      'Document is not outdated',
                      'Document matches the claim type',
                      'No duplicate submissions',
                    ].map((item, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <input type="checkbox" className="rounded" />
                        <span className="text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="space-y-3 pt-4">
                    <h4 className="font-medium">Notes & Comments</h4>
                    <textarea 
                      className="w-full p-3 border rounded-lg resize-none"
                      rows={4}
                      placeholder="Add verification notes..."
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-4">
                    <Button className="flex-1" variant="outline">
                      <X className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                    <Button className="flex-1">
                      <CheckSquare className="h-4 w-4 mr-2" />
                      Approve
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reject Documents Tab */}
        <TabsContent value="reject" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Document Rejection Interface</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 lg:grid-cols-2">
                {/* Document Info */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Document Information</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Document ID:</span>
                      <span>DOC-001</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Claim ID:</span>
                      <span>CLM-001</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Client:</span>
                      <span>John Smith</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Document Type:</span>
                      <span>Police Report</span>
                    </div>
                  </div>
                </div>

                {/* Rejection Form */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Rejection Details</h3>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium">Rejection Reason</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select rejection reason" />
                        </SelectTrigger>
                        <SelectContent>
                          {rejectionReasons.map((reason) => (
                            <SelectItem key={reason} value={reason.toLowerCase().replace(/\s+/g, '-')}>
                              {reason}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium">Custom Instructions</label>
                      <textarea 
                        className="w-full p-3 border rounded-lg resize-none"
                        rows={3}
                        placeholder="Provide specific instructions for the client..."
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium">Deadline</label>
                      <Input type="date" className="mt-1" />
                    </div>

                    <div className="pt-4">
                      <Button className="w-full">
                        <X className="h-4 w-4 mr-2" />
                        Reject Document
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Batch Actions */}
      {selectedDocuments.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {selectedDocuments.length} document(s) selected
              </p>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  Assign to Agent
                </Button>
                <Button variant="outline" size="sm">
                  Mark as Verified
                </Button>
                <Button size="sm">
                  Batch Process
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 