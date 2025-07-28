'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip } from '@/components/ui/tooltip';
import { 
  Clock, 
  FileText, 
  Search, 
  User,
  Download,
  Eye,
  CheckSquare,
  X
} from 'lucide-react';
import Link from 'next/link';


const mockClaims = [
  {
    id: 'CLM-001',
    clientName: 'John Smith',
    submissionDate: '2024-01-15',
    claimType: 'Property Damage',
    documentStatus: 85,
    status: 'Pending Review',
    estimatedValue: 25000,
  },
  {
    id: 'CLM-002',
    clientName: 'Sarah Johnson',
    submissionDate: '2024-01-14',
    claimType: 'Auto Accident',
    documentStatus: 60,
    status: 'Pending Review',
    estimatedValue: 15000,
  },
  {
    id: 'CLM-003',
    clientName: 'Mike Wilson',
    submissionDate: '2024-01-13',
    claimType: 'Medical',
    documentStatus: 100,
    status: 'Pending Review',
    estimatedValue: 8000,
  },
  {
    id: 'CLM-004',
    clientName: 'Lisa Brown',
    submissionDate: '2024-01-12',
    claimType: 'Property Damage',
    documentStatus: 45,
    status: 'Pending Review',
    estimatedValue: 35000,
  },
  {
    id: 'CLM-005',
    clientName: 'David Lee',
    submissionDate: '2024-01-11',
    claimType: 'Auto Accident',
    documentStatus: 90,
    status: 'Pending Review',
    estimatedValue: 12000,
  },
];

const settledClaims = [
  {
    id: 'CLM-006',
    clientName: 'Emma Wilson',
    submissionDate: '2024-01-10',
    claimType: 'Property Damage',
    documentStatus: 100,
    status: 'Completed',
    settlementDate: '2024-01-20',
    settlementAmount: 28000,
    estimatedValue: 30000,
  },
  {
    id: 'CLM-007',
    clientName: 'James Brown',
    submissionDate: '2024-01-09',
    claimType: 'Auto Accident',
    documentStatus: 100,
    status: 'Completed',
    settlementDate: '2024-01-18',
    settlementAmount: 13500,
    estimatedValue: 14000,
  },
  {
    id: 'CLM-008',
    clientName: 'Maria Garcia',
    submissionDate: '2024-01-08',
    claimType: 'Medical',
    documentStatus: 100,
    status: 'Completed',
    settlementDate: '2024-01-17',
    settlementAmount: 7500,
    estimatedValue: 8000,
  },
];

const quickStats = [
  {
    title: 'Total Pending Claims',
    value: '42',
    icon: Clock,
    description: 'Requires review',
    trend: '+5 from yesterday',
    trendUp: true,
  },
  {
    title: 'Average Review Time',
    value: '2.3 days',
    icon: Clock,
    description: 'Last 30 days',
    trend: '-0.5 days',
    trendUp: false,
  },
  {
    title: 'Document Completion',
    value: '78%',
    icon: FileText,
    description: 'Average across claims',
    trend: '+3%',
    trendUp: true,
  },
  {
    title: 'Settled Claims',
    value: '156',
    icon: CheckSquare,
    description: 'This month',
    trend: '+12',
    trendUp: true,
  },
];

const claimTypes = [
  { label: 'Property Damage', value: 'property', count: 15 },
  { label: 'Auto Accident', value: 'auto', count: 12 },
  { label: 'Medical', value: 'medical', count: 8 },
  { label: 'Liability', value: 'liability', count: 7 },
];

export default function ClaimsReviewPage() {
  const [filters, setFilters] = useState({
    dateRange: 'today',
    claimType: 'all',
    documentStatus: 'all',
    startDate: '',
    endDate: '',
  });
  const [activeTab, setActiveTab] = useState('pending');
  const [approveModal, setApproveModal] = useState<{ isOpen: boolean; claim: typeof mockClaims[0] | null }>({ isOpen: false, claim: null });
  const [approvedClaims, setApprovedClaims] = useState<typeof mockClaims>([]);

  // Debug logging
  console.log('Mock claims:', mockClaims);
  console.log('Settled claims:', settledClaims);
  console.log('Approved claims:', approvedClaims);

  const handleApproveClaim = (claim: typeof mockClaims[0]) => {
    setApproveModal({ isOpen: true, claim });
  };

  const confirmApprove = () => {
    if (approveModal.claim) {
      console.log("Approving claim:", approveModal.claim.id);
      // In a real app, this would update the claim status
      setApprovedClaims(prev => [...prev, approveModal.claim!]);
    }
    setApproveModal({ isOpen: false, claim: null });
  };

  const cancelApprove = () => {
    setApproveModal({ isOpen: false, claim: null });
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      approved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
      processing: "bg-blue-100 text-blue-800",
    };
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Claims Review</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {quickStats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
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

      {/* Claims by Type Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Claims by Type</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {claimTypes.map((type) => (
              <div key={type.value} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium text-sm sm:text-base">{type.label}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">{type.count} claims</p>
                </div>
                <div className="text-xl sm:text-2xl font-bold text-primary">{type.count}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="pending" className="text-xs sm:text-sm">Pending Claims</TabsTrigger>
          <TabsTrigger value="settled" className="text-xs sm:text-sm">Settled Claims</TabsTrigger>
        </TabsList>

        {/* Pending Claims Tab */}
        <TabsContent value="pending" className="space-y-4">
          {/* Filters and Search */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Pending Review Claims</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:gap-4">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search claims..."
                      className="pl-8 w-full lg:w-64"
                    />
                  </div>
                  <Select value={filters.dateRange} onValueChange={(value) => setFilters(prev => ({ ...prev, dateRange: value }))}>
                    <SelectTrigger className="w-full lg:w-40">
                      <SelectValue placeholder="Date Range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="week">This Week</SelectItem>
                      <SelectItem value="month">This Month</SelectItem>
                      <SelectItem value="all">All Time</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filters.claimType} onValueChange={(value) => setFilters(prev => ({ ...prev, claimType: value }))}>
                    <SelectTrigger className="w-full lg:w-40">
                      <SelectValue placeholder="Claim Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="property">Property Damage</SelectItem>
                      <SelectItem value="auto">Auto Accident</SelectItem>
                      <SelectItem value="medical">Medical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Claims Table */}
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-20 sm:w-auto">Claim ID</TableHead>
                      <TableHead className="hidden sm:table-cell">Client</TableHead>
                      <TableHead className="hidden md:table-cell">Submission Date</TableHead>
                      <TableHead className="hidden sm:table-cell">Claim Type</TableHead>
                      <TableHead className="hidden lg:table-cell">Document Status</TableHead>
                      <TableHead className="hidden sm:table-cell">Status</TableHead>
                      <TableHead className="hidden md:table-cell">Estimated Value</TableHead>
                      <TableHead className="w-20 sm:w-auto">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockClaims.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8">
                          <div className="text-center">
                            <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-muted-foreground">No pending claims found</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      mockClaims.map((claim) => (
                        <TableRow key={claim.id}>
                          <TableCell className="font-medium text-xs sm:text-sm">{claim.id}</TableCell>
                          <TableCell className="hidden sm:table-cell">{claim.clientName}</TableCell>
                          <TableCell className="hidden md:table-cell">{claim.submissionDate}</TableCell>
                          <TableCell className="hidden sm:table-cell">{claim.claimType}</TableCell>
                          <TableCell className="hidden lg:table-cell">
                            <div className="flex items-center gap-2">
                              <Progress value={claim.documentStatus} className="w-16" />
                              <span className="text-xs">{claim.documentStatus}%</span>
                            </div>
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">
                            <Badge className={getStatusColor(claim.status)}>
                              {claim.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">₦{claim.estimatedValue.toLocaleString()}</TableCell>
                          <TableCell>
                            <div className="flex gap-1 sm:gap-2">
                              <Button variant="ghost" size="sm" asChild>
                                <Link href={`/dashboard/claims/${claim.id}`}>
                                  <Eye className="h-4 w-4" />
                                </Link>
                              </Button>
                              <Tooltip content="Approve Claim">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleApproveClaim(claim)}
                                >
                                  <CheckSquare className="h-4 w-4" />
                                </Button>
                              </Tooltip>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
              
              {/* Mobile Claims Cards */}
              <div className="sm:hidden space-y-3 p-4">
                {mockClaims.map((claim) => (
                  <div key={claim.id} className="border rounded-lg p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">{claim.id}</span>
                      <Badge className={getStatusColor(claim.status)}>
                        {claim.status}
                      </Badge>
                    </div>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Client:</span>
                        <span>{claim.clientName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Type:</span>
                        <span>{claim.claimType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Value:</span>
                        <span>₦{claim.estimatedValue.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 pt-2">
                      <Button variant="ghost" size="sm" asChild className="flex-1">
                        <Link href={`/dashboard/claims/${claim.id}`}>
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Link>
                      </Button>
                      <Tooltip content="Approve Claim">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleApproveClaim(claim)}
                          className="flex-1"
                        >
                          <CheckSquare className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                      </Tooltip>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settled Claims Tab */}
        <TabsContent value="settled" className="space-y-4">
          {/* Settled Claims Table */}
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-20 sm:w-auto">Claim ID</TableHead>
                      <TableHead className="hidden sm:table-cell">Client Name</TableHead>
                      <TableHead className="hidden md:table-cell">Submission Date</TableHead>
                      <TableHead className="hidden sm:table-cell">Claim Type</TableHead>
                      <TableHead className="hidden lg:table-cell">Settlement Date</TableHead>
                      <TableHead className="hidden md:table-cell">Settlement Amount</TableHead>
                      <TableHead className="hidden sm:table-cell">Status</TableHead>
                      <TableHead className="w-20 sm:w-auto">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {settledClaims.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8">
                          <div className="text-center">
                            <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-muted-foreground">No settled claims found</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      settledClaims.map((claim) => (
                        <TableRow key={claim.id}>
                          <TableCell className="font-medium text-xs sm:text-sm">{claim.id}</TableCell>
                          <TableCell className="hidden sm:table-cell">
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-muted-foreground" />
                              {claim.clientName}
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">{claim.submissionDate}</TableCell>
                          <TableCell className="hidden sm:table-cell">{claim.claimType}</TableCell>
                          <TableCell className="hidden lg:table-cell">{claim.settlementDate}</TableCell>
                          <TableCell className="hidden md:table-cell">₦{claim.settlementAmount.toLocaleString()}</TableCell>
                          <TableCell className="hidden sm:table-cell">
                            <Badge className={getStatusColor(claim.status)}>
                              {claim.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1 sm:gap-2">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                asChild
                                title="View Claim Details"
                              >
                                <Link href={`/dashboard/claims/${claim.id}`}>
                                  <Eye className="h-4 w-4" />
                                </Link>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
              
              {/* Mobile Settled Claims Cards */}
              <div className="sm:hidden space-y-3 p-4">
                {settledClaims.map((claim) => (
                  <div key={claim.id} className="border rounded-lg p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">{claim.id}</span>
                      <Badge className={getStatusColor(claim.status)}>
                        {claim.status}
                      </Badge>
                    </div>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Client:</span>
                        <span>{claim.clientName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Type:</span>
                        <span>{claim.claimType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Settlement:</span>
                        <span>₦{claim.settlementAmount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Date:</span>
                        <span>{claim.settlementDate}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 pt-2">
                      <Button variant="ghost" size="sm" asChild className="flex-1">
                        <Link href={`/dashboard/claims/${claim.id}`}>
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Approve Claim Modal */}
      {approveModal.isOpen && approveModal.claim && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-md mx-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Approve Claim</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={cancelApprove}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Are you sure you want to approve this claim?</p>
                <div className="bg-gray-50 p-3 rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Claim ID:</span>
                    <span className="text-sm">{approveModal.claim.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Client:</span>
                    <span className="text-sm">{approveModal.claim.clientName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Type:</span>
                    <span className="text-sm">{approveModal.claim.claimType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Estimated Value:</span>
                    <span className="text-sm">₦{approveModal.claim.estimatedValue.toLocaleString()}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2 sm:gap-3">
                <Button
                  variant="outline"
                  onClick={cancelApprove}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={confirmApprove}
                  className="flex-1"
                >
                  Approve Claim
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 