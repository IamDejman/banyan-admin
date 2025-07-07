'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { FileText, HelpCircle, Send, CalendarDays, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

// Mock data for demonstration
const mockRequests = [
  {
    id: 'REQ-001',
    claimId: 'CLM-001',
    clientName: 'John Smith',
    requestType: 'Document Request',
    documentType: 'Medical Records',
    status: 'Pending Response',
    priority: 'High',
    submissionDate: '2024-01-15',
    deadline: '2024-01-22',
    daysRemaining: 3,
    responseTime: '2.1 days',
    assignedTo: 'Sarah Wilson',
  },
  {
    id: 'REQ-002',
    claimId: 'CLM-002',
    clientName: 'Sarah Johnson',
    requestType: 'Information Request',
    documentType: 'Accident Details',
    status: 'Response Received',
    priority: 'Medium',
    submissionDate: '2024-01-14',
    deadline: '2024-01-21',
    daysRemaining: -1,
    responseTime: '1.8 days',
    assignedTo: 'Mike Johnson',
  },
  {
    id: 'REQ-003',
    claimId: 'CLM-003',
    clientName: 'Mike Wilson',
    requestType: 'Document Request',
    documentType: 'Police Report',
    status: 'Overdue',
    priority: 'High',
    submissionDate: '2024-01-10',
    deadline: '2024-01-17',
    daysRemaining: -3,
    responseTime: '5.2 days',
    assignedTo: 'David Brown',
  },
  {
    id: 'REQ-004',
    claimId: 'CLM-004',
    clientName: 'Lisa Brown',
    requestType: 'Information Request',
    documentType: 'Witness Statement',
    status: 'Pending Response',
    priority: 'Low',
    submissionDate: '2024-01-16',
    deadline: '2024-01-23',
    daysRemaining: 4,
    responseTime: '0.5 days',
    assignedTo: 'Unassigned',
  },
  {
    id: 'REQ-005',
    claimId: 'CLM-005',
    clientName: 'David Lee',
    requestType: 'Document Request',
    documentType: 'Repair Estimates',
    status: 'Response Received',
    priority: 'Medium',
    submissionDate: '2024-01-13',
    deadline: '2024-01-20',
    daysRemaining: 0,
    responseTime: '2.3 days',
    assignedTo: 'Sarah Wilson',
  },
];

const quickStats = [
  {
    title: 'Pending Document Requests',
    value: '23',
    icon: FileText,
    description: 'Awaiting client response',
    trend: '+3 from yesterday',
    trendUp: true,
  },
  {
    title: 'Pending Information Requests',
    value: '15',
    icon: HelpCircle,
    description: 'Additional info needed',
    trend: '+1 from yesterday',
    trendUp: true,
  },
  {
    title: 'Average Response Time',
    value: '2.1 days',
    icon: FileText,
    description: 'Last 30 days',
    trend: '-0.3 days',
    trendUp: false,
  },
  {
    title: 'Overdue Requests',
    value: '8',
    icon: AlertTriangle,
    description: 'Require immediate attention',
    trend: '+2',
    trendUp: true,
  },
];

const documentTypes = [
  { label: 'Medical Records', value: 'medical', template: 'Standard medical records request' },
  { label: 'Police Report', value: 'police', template: 'Official police report request' },
  { label: 'Repair Estimates', value: 'repair', template: 'Repair cost estimates request' },
  { label: 'Witness Statement', value: 'witness', template: 'Witness testimony request' },
  { label: 'Insurance Policy', value: 'policy', template: 'Insurance policy documentation' },
  { label: 'Photos', value: 'photos', template: 'Photographic evidence request' },
];

const requestReasons = [
  'Incomplete initial submission',
  'Additional evidence required',
  'Clarification needed',
  'Supporting documentation missing',
  'Third-party verification required',
  'Legal requirements',
  'Quality assessment',
  'Compliance verification',
];

const clientLanguageSuggestions = [
  'Please provide the requested documents to help us process your claim efficiently.',
  'We need this information to ensure your claim is handled properly.',
  'This documentation will help us reach a fair settlement.',
  'Your cooperation will help expedite the claims process.',
  'This information is required to complete your claim review.',
];

export default function InformationRequestsPage() {
  const [selectedRequests, setSelectedRequests] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    dateRange: 'all',
    requestType: 'all',
    status: 'all',
    priority: 'all',
  });
  const [activeTab, setActiveTab] = useState('documents');
  const [selectedDocumentType, setSelectedDocumentType] = useState('');
  const [selectedReason, setSelectedReason] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const [deadline, setDeadline] = useState('');

  const handleSelectRequest = (requestId: string) => {
    setSelectedRequests(prev => 
      prev.includes(requestId) 
        ? prev.filter(id => id !== requestId)
        : [...prev, requestId]
    );
  };

  const handleSelectAll = () => {
    if (selectedRequests.length === mockRequests.length) {
      setSelectedRequests([]);
    } else {
      setSelectedRequests(mockRequests.map(request => request.id));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending Response': return 'bg-yellow-100 text-yellow-800';
      case 'Response Received': return 'bg-green-100 text-green-800';
      case 'Overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDaysRemainingColor = (days: number) => {
    if (days < 0) return 'text-red-600';
    if (days <= 2) return 'text-orange-600';
    return 'text-green-600';
  };

  const handleDocumentTypeChange = (value: string) => {
    setSelectedDocumentType(value);
    const docType = documentTypes.find(dt => dt.value === value);
    if (docType) {
      setCustomMessage(docType.template);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Information Requests</h1>
          <p className="text-muted-foreground">
            Manage additional information gathering from clients
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <FileText className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button size="sm">
            <Send className="h-4 w-4 mr-2" />
            Send Reminders
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

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="documents">Request Documents</TabsTrigger>
          <TabsTrigger value="information">Request Information</TabsTrigger>
          <TabsTrigger value="responses">Review Responses</TabsTrigger>
        </TabsList>

        {/* Request Documents Tab */}
        <TabsContent value="documents" className="space-y-4">
          {/* Document Request Builder */}
          <Card>
            <CardHeader>
              <CardTitle>Document Request Builder</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 lg:grid-cols-2">
                {/* Standard Document Library */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Standard Document Types</h3>
                  <div className="space-y-3">
                    {documentTypes.map((docType) => (
                      <div key={docType.value} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                        <div>
                          <p className="font-medium">{docType.label}</p>
                          <p className="text-sm text-muted-foreground">{docType.template}</p>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDocumentTypeChange(docType.value)}
                        >
                          Use Template
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Custom Request Builder */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Custom Request Builder</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Document Type</label>
                      <Select value={selectedDocumentType} onValueChange={handleDocumentTypeChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select document type" />
                        </SelectTrigger>
                        <SelectContent>
                          {documentTypes.map((docType) => (
                            <SelectItem key={docType.value} value={docType.value}>
                              {docType.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium">Request Message</label>
                      <Textarea 
                        value={customMessage}
                        onChange={(e) => setCustomMessage(e.target.value)}
                        placeholder="Enter your request message..."
                        rows={4}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium">Deadline</label>
                      <Input 
                        type="date" 
                        value={deadline}
                        onChange={(e) => setDeadline(e.target.value)}
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <Button className="flex-1">
                        <Send className="h-4 w-4 mr-2" />
                        Send Request
                      </Button>
                      <Button variant="outline">
                        <FileText className="h-4 w-4 mr-2" />
                        Save Template
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Active Document Requests */}
          <Card>
            <CardHeader>
              <CardTitle>Active Document Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between mb-4">
                <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:gap-4">
                  <div className="relative">
                    <FileText className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search requests..."
                      className="pl-8 w-full lg:w-64"
                    />
                  </div>
                  <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
                    <SelectTrigger className="w-full lg:w-40">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending Response</SelectItem>
                      <SelectItem value="received">Response Received</SelectItem>
                      <SelectItem value="overdue">Overdue</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <input
                        type="checkbox"
                        checked={selectedRequests.length === mockRequests.length}
                        onChange={handleSelectAll}
                        className="rounded"
                      />
                    </TableHead>
                    <TableHead>Request ID</TableHead>
                    <TableHead>Claim ID</TableHead>
                    <TableHead>Client Name</TableHead>
                    <TableHead>Document Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Deadline</TableHead>
                    <TableHead>Days Remaining</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockRequests.filter(req => req.requestType === 'Document Request').map((request) => (
                    <TableRow key={request.id}>
                      <TableCell>
                        <input
                          type="checkbox"
                          checked={selectedRequests.includes(request.id)}
                          onChange={() => handleSelectRequest(request.id)}
                          className="rounded"
                        />
                      </TableCell>
                      <TableCell className="font-medium">{request.id}</TableCell>
                      <TableCell>
                        <Link href={`/dashboard/claims/${request.claimId}`} className="text-blue-600 hover:underline">
                          {request.claimId}
                        </Link>
                      </TableCell>
                      <TableCell>{request.clientName}</TableCell>
                      <TableCell>{request.documentType}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(request.status)}>
                          {request.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{request.deadline}</TableCell>
                      <TableCell>
                        <span className={`font-medium ${getDaysRemainingColor(request.daysRemaining)}`}>
                          {request.daysRemaining >= 0 ? `${request.daysRemaining} days` : `${Math.abs(request.daysRemaining)} days overdue`}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            <FileText className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Send className="h-4 w-4" />
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

        {/* Request Information Tab */}
        <TabsContent value="information" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Information Request Forms</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 lg:grid-cols-2">
                {/* Structured Request Forms */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Structured Request Forms</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Request Reason</label>
                      <Select value={selectedReason} onValueChange={setSelectedReason}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select request reason" />
                        </SelectTrigger>
                        <SelectContent>
                          {requestReasons.map((reason) => (
                            <SelectItem key={reason} value={reason.toLowerCase().replace(/\s+/g, '-')}>
                              {reason}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium">Client-Friendly Message</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select language suggestion" />
                        </SelectTrigger>
                        <SelectContent>
                          {clientLanguageSuggestions.map((suggestion, index) => (
                            <SelectItem key={index} value={index.toString()}>
                              {suggestion}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium">Custom Message</label>
                      <Textarea 
                        placeholder="Enter your custom message..."
                        rows={4}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium">Follow-up Schedule</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select follow-up schedule" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="3">3 days</SelectItem>
                          <SelectItem value="5">5 days</SelectItem>
                          <SelectItem value="7">1 week</SelectItem>
                          <SelectItem value="14">2 weeks</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button className="w-full">
                      <Send className="h-4 w-4 mr-2" />
                      Send Information Request
                    </Button>
                  </div>
                </div>

                {/* Request Templates */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Request Templates</h3>
                  <div className="space-y-3">
                    {[
                      { name: 'Accident Details Request', description: 'Request additional accident information' },
                      { name: 'Witness Statement Request', description: 'Request witness testimony' },
                      { name: 'Medical History Request', description: 'Request medical background information' },
                      { name: 'Employment Verification', description: 'Request employment details' },
                    ].map((template, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                        <div>
                          <p className="font-medium">{template.name}</p>
                          <p className="text-sm text-muted-foreground">{template.description}</p>
                        </div>
                        <Button variant="outline" size="sm">
                          Use Template
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Review Responses Tab */}
        <TabsContent value="responses" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Response Review Dashboard</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 lg:grid-cols-2">
                {/* Response Completeness */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Response Completeness Indicators</h3>
                  <div className="space-y-3">
                    {mockRequests.filter(req => req.status === 'Response Received').map((request) => (
                      <div key={request.id} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{request.id}</span>
                          <Badge className="bg-green-100 text-green-800">Complete</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {request.documentType} - {request.clientName}
                        </p>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span>Document Quality</span>
                            <span className="text-green-600">✓ Good</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span>Information Completeness</span>
                            <span className="text-green-600">✓ Complete</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span>Timeliness</span>
                            <span className="text-green-600">✓ On Time</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Workflow Progression */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Workflow Progression Controls</h3>
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">REQ-002 - Accident Details</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Response received from Sarah Johnson
                      </p>
                      <div className="space-y-2">
                        <Button size="sm" className="w-full">
                          <FileText className="h-4 w-4 mr-2" />
                          Approve & Move to Assessment
                        </Button>
                        <Button size="sm" variant="outline" className="w-full">
                          <HelpCircle className="h-4 w-4 mr-2" />
                          Request Additional Info
                        </Button>
                      </div>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">Timeline Update Interface</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Request Sent</span>
                          <span>Jan 14, 2024</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span>Reminder Sent</span>
                          <span>Jan 16, 2024</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span>Response Received</span>
                          <span>Jan 17, 2024</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span>Review Completed</span>
                          <span className="text-green-600">Pending</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Batch Actions */}
      {selectedRequests.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {selectedRequests.length} request(s) selected
              </p>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Send className="h-4 w-4 mr-2" />
                  Send Reminders
                </Button>
                <Button variant="outline" size="sm">
                  <CalendarDays className="h-4 w-4 mr-2" />
                  Update Deadlines
                </Button>
                <Button size="sm">
                  <FileText className="h-4 w-4 mr-2" />
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