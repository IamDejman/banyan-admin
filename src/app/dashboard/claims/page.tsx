'use client';

import { useEffect, useState, useCallback } from 'react';
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
  X,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight
} from 'lucide-react';
import Link from 'next/link';
import { getClaims, getClaimsStatistics, approveClaim } from '@/app/services/dashboard';
import { toast } from '@/components/ui/use-toast';

// Define proper types for API response data
interface ApiClaimDocument {
  id: string;
  document_uploaded: boolean;
}

interface ApiClaimClient {
  first_name: string;
  last_name: string;
}

interface ApiClaimTypeDetails {
  name: string;
}

interface ApiClaim {
  id: string;
  claim_number: string;
  client: ApiClaimClient;
  submission_date: string;
  claim_type_details: ApiClaimTypeDetails;
  status: string;
  estimated_value: number;
  description: string;
  incident_location: string;
  incident_date: string;
  documents: ApiClaimDocument[];
}

interface TransformedClaim {
  id: string;
  clientName: string;
  submissionDate: string;
  claimType: string;
  documentStatus: number;
  status: string;
  estimatedValue: number;
  incidentLocation: string;
  description: string;
  incidentDate: string;
  originalClaim: ApiClaim;
}

interface TransformedSettledClaim extends TransformedClaim {
  settlementDate: string;
  settlementAmount: number;
}

interface Statistics {
  total_pending_claims: number;
  average_review_time: number;
  document_completion: number;
  settled_claim: number;
  propertydamage_claims: number;
  auto_accident_claims: number;
  medical_claims: number;
  liability: number;
}

interface QuickStat {
  title: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  trend: string;
  trendUp: boolean;
}

interface ClaimType {
  label: string;
  value: string;
  count: number;
}

export default function ClaimsReviewPage() {
  const [filters, setFilters] = useState({
    dateRange: 'today',
    claimType: 'all',
    documentStatus: 'all',
    startDate: '',
    endDate: '',
    search: '',
  });
  const [activeTab, setActiveTab] = useState('pending');
  const [approveModal, setApproveModal] = useState<{ isOpen: boolean; claim: TransformedClaim | null }>({ isOpen: false, claim: null });
  const [statistics, setStatistics] = useState<Statistics>({
    total_pending_claims: 0,
    average_review_time: 0,
    document_completion: 0,
    settled_claim: 0,
    propertydamage_claims: 0,
    auto_accident_claims: 0,
    medical_claims: 0,
    liability: 0
  });
  const [claims, setClaims] = useState<ApiClaim[]>([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  });
  const [loading, setLoading] = useState(false);

  const handleApproveClaim = (claim: TransformedClaim) => {
    console.log("Approving claim:", claim);
    setApproveModal({ isOpen: true, claim });
  };

  const confirmApprove = async () => {
    try {
      if (approveModal.claim) {
        console.log("Approving claim:", approveModal.claim.id);
        const res = await approveClaim(approveModal.claim.id);
        console.log(res, "res__111");
        // In a real app, this would update the claim status
        return toast({
          title: "Claim approved successfully",
          description: "The claim has been approved successfully",
          variant: "default",
        });
      }
      setApproveModal({ isOpen: false, claim: null });

    } catch {
      toast({
        title: "Failed to approve claim",
        description: "The claim has not been approved",
        variant: "destructive",
      });
    }
  };

  const cancelApprove = () => {
    setApproveModal({ isOpen: false, claim: null });
  };

  const getStatusColor = (status: string) => {
    const colors = {
      submitted: "bg-yellow-100 text-yellow-800",
      completed: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
      processing: "bg-blue-100 text-blue-800",
    };
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  // Transform API claim data to table format
  const transformClaimData = (claim: ApiClaim): TransformedClaim => {
    const uploadedDocs = claim.documents?.filter((doc: ApiClaimDocument) => doc.document_uploaded) || [];
    const totalDocs = claim.documents?.length || 0;
    const documentStatus = totalDocs > 0 ? Math.round((uploadedDocs.length / totalDocs) * 100) : 0;

    return {
      id: claim.claim_number,
      clientName: claim.client.first_name + ' ' + claim.client.last_name, // API doesn't provide client name
      submissionDate: new Date(claim.submission_date).toLocaleDateString(),
      claimType: claim.claim_type_details?.name || 'Unknown',
      documentStatus,
      status: claim.status === 'completed' ? 'Completed' : 'Pending Review',
      estimatedValue: claim.estimated_value, // API doesn't provide estimated value
      incidentLocation: claim.incident_location,
      description: claim.description,
      incidentDate: new Date(claim.incident_date).toLocaleDateString(),
      originalClaim: claim, // Keep original data for filtering
    };
  };

  // Transform settled claim data with settlement info
  const transformSettledClaimData = (claim: ApiClaim): TransformedSettledClaim => {
    const baseData = transformClaimData(claim);
    return {
      ...baseData,
      settlementDate: new Date(claim.submission_date).toLocaleDateString(), // Using submission date as settlement date
      settlementAmount: 0, // API doesn't provide settlement amount
    };
  };

  // Filter and search claims
  const filterClaims = (claims: ApiClaim[], searchTerm: string, claimTypeFilter: string): ApiClaim[] => {
    return claims.filter(claim => {
      const matchesSearch = searchTerm === '' ||
        claim.claim_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        claim.incident_location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        claim.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        claim.claim_type_details?.name?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType = claimTypeFilter === 'all' ||
        claim.claim_type_details?.name?.toLowerCase().includes(claimTypeFilter.toLowerCase());

      return matchesSearch && matchesType;
    });
  };

  // Apply filters and pagination
  const getFilteredClaims = (): ApiClaim[] => {
    const filtered = filterClaims(claims, filters.search, filters.claimType);
    const startIndex = (pagination.currentPage - 1) * pagination.itemsPerPage;
    const endIndex = startIndex + pagination.itemsPerPage;
    return filtered.slice(startIndex, endIndex);
  };

  // Get filtered claims for display
  const pendingClaims = getFilteredClaims().filter(claim => claim?.status !== 'completed').map(transformClaimData);
  const settledClaims = getFilteredClaims().filter(claim => claim?.status === 'completed').map(transformSettledClaimData);

  // Calculate total filtered items for pagination
  const getTotalFilteredItems = useCallback((): number => {
    const filtered = filterClaims(claims, filters.search, filters.claimType);
    return filtered.length;
  }, [claims, filters.search, filters.claimType]);

  // Update pagination when filters or claims change
  useEffect(() => {
    const totalItems = getTotalFilteredItems();
    const totalPages = Math.ceil(totalItems / pagination.itemsPerPage);
    setPagination(prev => ({
      ...prev,
      totalItems,
      totalPages,
      currentPage: prev.currentPage > totalPages ? 1 : prev.currentPage,
    }));
  }, [claims, filters.search, filters.claimType, pagination.itemsPerPage, getTotalFilteredItems]);

  // Handle pagination
  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
  };

  // Handle search
  const handleSearch = (value: string) => {
    setFilters(prev => ({ ...prev, search: value }));
    setPagination(prev => ({ ...prev, currentPage: 1 })); // Reset to first page
  };

  // Handle claim type filter
  const handleClaimTypeFilter = (value: string) => {
    setFilters(prev => ({ ...prev, claimType: value }));
    setPagination(prev => ({ ...prev, currentPage: 1 })); // Reset to first page
  };

  // Fetch claims
  const fetchClaims = async () => {
    setLoading(true);
    try {
      const res: unknown = await getClaims();
      console.log(res, "res__");

      // Helper function to safely extract claims data
      const extractClaimsData = (response: unknown): ApiClaim[] => {
        if (Array.isArray(response)) {
          // If response is an array, try to get data from first element
          const firstItem = response[0];
          if (firstItem && typeof firstItem === 'object' && firstItem !== null) {
            if ('data' in firstItem && firstItem.data) {
              if (Array.isArray(firstItem.data)) {
                return firstItem.data;
              } else if (typeof firstItem.data === 'object' && firstItem.data !== null && 'data' in firstItem.data) {
                return Array.isArray(firstItem.data.data) ? firstItem.data.data : [];
              }
            }
          }
          return [];
        } else if (response && typeof response === 'object' && response !== null) {
          // If response is an object, try to extract data
          if ('data' in response && response.data) {
            if (Array.isArray(response.data)) {
              return response.data;
            } else if (typeof response.data === 'object' && response.data !== null && 'data' in response.data) {
              return Array.isArray(response.data.data) ? response.data.data : [];
            }
          }
        }
        return [];
      };

      const claimsData = extractClaimsData(res);
      setClaims(claimsData);
    } catch {
      console.error('Error fetching claims');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("fetching claims statistics__");
    getClaimsStatistics().then((res) => {
      console.log(res, "res__111");
      // Handle the response - it might be an array with the first element being the data
      const statsData = Array.isArray(res) ? res[0] : res;
      setStatistics(statsData as Statistics);
    });
    fetchClaims();
  }, []);

  // Remove the automatic refetch - filtering will be client-side only

  // Generate quickStats from API response
  const quickStats: QuickStat[] = [
    {
      title: 'Total Pending Claims',
      value: statistics.total_pending_claims.toString(),
      icon: Clock,
      description: 'Requires review',
      trend: '+1%',
      trendUp: true,
    },
    {
      title: 'Average Review Time',
      value: `${statistics.average_review_time} days`,
      icon: Clock,
      description: 'Last 30 days',
      trend: '+1%',
      trendUp: true,
    },
    {
      title: 'Document Completion',
      value: `${statistics.document_completion}%`,
      icon: FileText,
      description: 'Average across claims',
      trend: '+1%',
      trendUp: true,
    },
    {
      title: 'Settled Claims',
      value: statistics.settled_claim.toString(),
      icon: CheckSquare,
      description: 'This month',
      trend: '+1%',
      trendUp: true,
    },
  ];

  // Generate claimTypes from API response
  const claimTypes: ClaimType[] = [
    { label: 'Property Damage', value: 'property', count: statistics.propertydamage_claims },
    { label: 'Auto Accident', value: 'auto', count: statistics.auto_accident_claims },
    { label: 'Medical', value: 'medical', count: statistics.medical_claims },
    { label: 'Liability', value: 'liability', count: statistics.liability },
  ];


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
                      value={filters.search}
                      onChange={(e) => handleSearch(e.target.value)}
                      disabled={loading}
                    />
                  </div>
                  <Select value={filters.claimType} onValueChange={handleClaimTypeFilter}>
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
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8">
                          <div className="text-center">
                            <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-muted-foreground">Loading claims...</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : pendingClaims.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8">
                          <div className="text-center">
                            <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-muted-foreground">No pending claims found</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      pendingClaims.map((claim) => (
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
                              {/* <Tooltip content="Approve Claim">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    // navigate to document page
                                    navigate.push(`/dashboard/claims/${claim.id}/documents`);
                                  }}
                                // onClick={() => handleApproveClaim(claim)}
                                >
                                  <CheckSquare className="h-4 w-4" />
                                </Button>
                              </Tooltip> */}
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
                {loading ? (
                  <div className="text-center py-8">
                    <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Loading claims...</p>
                  </div>
                ) : pendingClaims.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">No pending claims found</p>
                  </div>
                ) : (
                  pendingClaims.map((claim) => (
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
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Pagination Controls */}
          {!loading && pendingClaims.length > 0 && (
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Showing {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1} to{' '}
                    {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} of{' '}
                    {pagination.totalItems} results
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(1)}
                      disabled={pagination.currentPage === 1}
                    >
                      <ChevronsLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(pagination.currentPage - 1)}
                      disabled={pagination.currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                        const page = Math.max(1, Math.min(pagination.totalPages - 4, pagination.currentPage - 2)) + i;
                        if (page > pagination.totalPages) return null;
                        return (
                          <Button
                            key={page}
                            variant={pagination.currentPage === page ? "default" : "outline"}
                            size="sm"
                            onClick={() => handlePageChange(page)}
                            className="w-8 h-8"
                          >
                            {page}
                          </Button>
                        );
                      })}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(pagination.currentPage + 1)}
                      disabled={pagination.currentPage === pagination.totalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(pagination.totalPages)}
                      disabled={pagination.currentPage === pagination.totalPages}
                    >
                      <ChevronsRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
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
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8">
                          <div className="text-center">
                            <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-muted-foreground">Loading settled claims...</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : settledClaims.length === 0 ? (
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
                {loading ? (
                  <div className="text-center py-8">
                    <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Loading settled claims...</p>
                  </div>
                ) : settledClaims.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">No settled claims found</p>
                  </div>
                ) : (
                  settledClaims.map((claim) => (
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
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Pagination Controls for Settled Claims */}
          {!loading && settledClaims.length > 0 && (
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Showing {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1} to{' '}
                    {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} of{' '}
                    {pagination.totalItems} results
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(1)}
                      disabled={pagination.currentPage === 1}
                    >
                      <ChevronsLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(pagination.currentPage - 1)}
                      disabled={pagination.currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                        const page = Math.max(1, Math.min(pagination.totalPages - 4, pagination.currentPage - 2)) + i;
                        if (page > pagination.totalPages) return null;
                        return (
                          <Button
                            key={page}
                            variant={pagination.currentPage === page ? "default" : "outline"}
                            size="sm"
                            onClick={() => handlePageChange(page)}
                            className="w-8 h-8"
                          >
                            {page}
                          </Button>
                        );
                      })}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(pagination.currentPage + 1)}
                      disabled={pagination.currentPage === pagination.totalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(pagination.totalPages)}
                      disabled={pagination.currentPage === pagination.totalPages}
                    >
                      <ChevronsRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
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