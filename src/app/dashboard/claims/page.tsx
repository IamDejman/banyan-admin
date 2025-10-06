'use client';

import { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  FileText,
  Search,
  Eye,
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import Link from 'next/link';
import { getClaims, getClaimsStatistics, getClaimTypes, getClaimAssignments } from '@/app/services/dashboard';
import { formatStatus } from '@/lib/utils/text-formatting';
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
  assigned_agent?: string; // This might need to be added to the API response
}

interface TransformedClaim {
  id: string;
  clientName: string;
  submissionDate: string;
  claim_type: string;
  status: string;
  assigned_agent: string;
  originalClaim: ApiClaim;
}

interface Statistics {
  total_pending_claims: number;
  settled_claim: number;
}

// Error interface for proper typing
interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
    status?: number;
    statusText?: string;
  };
  message?: string;
}

interface FilterState {
  status: string;
  assigned_agent: string;
  claim_type: string;
  start_date: string;
  end_date: string;
}

interface SearchState {
  search: string;
}

export default function ClaimsReviewPage() {
  const [search, setSearch] = useState<SearchState>({
    search: '',
  });
  const [filters, setFilters] = useState<FilterState>({
    status: 'all',
    assigned_agent: 'all',
    claim_type: 'all',
    start_date: '',
    end_date: '',
  });
  const [statistics, setStatistics] = useState<Statistics>({
    total_pending_claims: 0,
    settled_claim: 0,
  });
  const [claims, setClaims] = useState<ApiClaim[]>([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 15,
  });
  const [loading, setLoading] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [claimTypes, setClaimTypes] = useState<Array<{id: string | number, name: string}>>([]);
  const [claimTypesLoading, setClaimTypesLoading] = useState(false);
  const [, setClaimTypesError] = useState<string | null>(null);
  const [assignments, setAssignments] = useState<Array<{id: string | number, agent_name: string}>>([]);
  const [assignmentsLoading, setAssignmentsLoading] = useState(false);
  const [tempFilters, setTempFilters] = useState<FilterState>({
    status: 'all',
    assigned_agent: 'all',
    claim_type: 'all',
    start_date: '',
    end_date: '',
  });
  const [filtersApplied, setFiltersApplied] = useState(false);

  const getStatusColor = (status: string) => {
    const colors = {
      submitted: "bg-yellow-100 text-yellow-800",
      completed: "bg-green-100 text-green-800",
      approved: "bg-emerald-100 text-emerald-800",
      settled: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
      processing: "bg-blue-100 text-blue-800",
      pending: "bg-yellow-100 text-yellow-800",
    };
    return colors[status.toLowerCase() as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  // Transform API claim data to table format
  const transformClaimData = (claim: ApiClaim): TransformedClaim => {
    // Format status to sentence case
    const formatStatus = (status: string) => {
      return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
    };

    // Format submission date to DD Mmm YYYY HH:MM
    const formatSubmissionDate = (dateString: string) => {
      const date = new Date(dateString);
      const day = date.getDate().toString().padStart(2, '0');
      const month = date.toLocaleDateString('en-US', { month: 'short' });
      const year = date.getFullYear();
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return `${day} ${month} ${year} ${hours}:${minutes}`;
    };

    return {
      id: claim.id, // Use database ID for navigation
      clientName: `${claim.client.first_name} ${claim.client.last_name}`,
      submissionDate: formatSubmissionDate(claim.submission_date),
      claim_type: claim.claim_type_details?.name || 'Unknown',
      status: formatStatus(claim.status),
      assigned_agent: claim.assigned_agent || 'Unassigned',
      originalClaim: claim,
    };
  };

  // Filter and search claims
  const filterClaims = (claims: ApiClaim[], searchTerm: string, filters: FilterState): ApiClaim[] => {
    return claims.filter(claim => {
      const matchesSearch = searchTerm === '' ||
        claim.claim_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        claim.client.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        claim.client.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        claim.claim_type_details?.name?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = filters.status === 'all' ||
        (filters.status === 'pending' && claim.status !== 'completed') ||
        (filters.status === 'settled' && claim.status === 'completed');

      const matchesAgent = filters.assigned_agent === 'all' ||
        (filters.assigned_agent === 'unassigned' && (!claim.assigned_agent || claim.assigned_agent === '')) ||
        claim.assigned_agent?.toLowerCase().replace(/\s+/g, '-').includes(filters.assigned_agent.toLowerCase());

      const matchesType = filters.claim_type === 'all' ||
        claim.claim_type_details?.name?.toLowerCase().replace(/\s+/g, '-').includes(filters.claim_type.toLowerCase());

      const matchesDate = (!filters.start_date && !filters.end_date) ||
        (filters.start_date && new Date(claim.submission_date) >= new Date(filters.start_date)) ||
        (filters.end_date && new Date(claim.submission_date) <= new Date(filters.end_date));

      return matchesSearch && matchesStatus && matchesAgent && matchesType && matchesDate;
    });
  };

  // Get claims for display (filter current page results)
      const filteredClaims = filterClaims(claims, search.search, filters);
  const allClaims = filteredClaims.map(transformClaimData);

  // Handle pagination
  const handlePageChange = (page: number) => {
    fetchClaims(page);
  };

  // Handle search (for now, just update state - could be enhanced with API search later)
  const handleSearch = (value: string) => {
    setSearch({ search: value });
    // Trigger immediate API call with search term
    const combinedFilters = {
      ...filters,
      search: value
    };
    fetchClaimsWithFilters(1, combinedFilters);
  };

  // Handle filter modal (for now, just update state - could be enhanced with API filtering later)
  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setTempFilters(prev => ({ ...prev, [key]: value }));
  };


  const applyFilters = () => {
    setFilters(tempFilters);
    setFiltersApplied(true);
    setShowFilterModal(false);
    fetchClaimsWithFilters(1, { ...tempFilters }); // Reset to page 1 when applying new filters
  };

  const clearAllFilters = () => {
    const clearedFilters = {
      status: 'all',
      assigned_agent: 'all',
      claim_type: 'all',
      start_date: '',
      end_date: '',
    };
    setSearch({ search: '' });
    setFilters(clearedFilters);
    setTempFilters(clearedFilters);
    setFiltersApplied(false);
    fetchClaimsWithFilters(1, { ...clearedFilters });
  };

  const openFilterModal = () => {
    setTempFilters(filters); // Set temp filters to current applied filters
    setShowFilterModal(true);
  };

  const cancelFilters = () => {
    setTempFilters(filters); // Reset temp filters to current applied filters
    setShowFilterModal(false);
  };

  // Fetch claim types from API
  const fetchClaimTypes = async () => {
    setClaimTypesLoading(true);
    setClaimTypesError(null);
    try {
      console.log('Fetching claim types...');
      const res = await getClaimTypes();
      console.log('Claim types response:', res);
      
      // Handle different possible response structures
      let claimTypesData = null;
      if (res && res.data && Array.isArray(res.data)) {
        claimTypesData = res.data;
      } else if (Array.isArray(res)) {
        claimTypesData = res;
      } else if (res && Array.isArray(res)) {
        claimTypesData = res;
      }
      
      if (claimTypesData && claimTypesData.length > 0) {
        const mappedTypes = claimTypesData.map((type: { id: string | number; name: string }) => ({
          id: type.id,
          name: type.name
        }));
        console.log('Mapped claim types:', mappedTypes);
        setClaimTypes(mappedTypes);
      } else {
        const errorMsg = 'No claim types data found in API response';
        console.log(errorMsg);
        setClaimTypesError(errorMsg);
        toast({
          title: "Error",
          description: errorMsg,
          variant: "destructive",
        });
      }
    } catch (error: unknown) {
      const errorMsg = (error as ApiError)?.response?.data?.message || (error as ApiError)?.message || 'Failed to fetch claim types';
      console.error('Error fetching claim types:', error);
      setClaimTypesError(errorMsg);
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive",
      });
    } finally {
      setClaimTypesLoading(false);
    }
  };

  const fetchAssignments = async () => {
    setAssignmentsLoading(true);
    try {
      console.log('Fetching claim assignments...');
      const res = await getClaimAssignments();
      console.log('Assignments response:', res);
      
      // Handle different possible response structures
      let assignmentsData = null;
      if (res && res.data && Array.isArray(res.data)) {
        assignmentsData = res.data;
      } else if (Array.isArray(res)) {
        assignmentsData = res;
      }
      
      if (assignmentsData && assignmentsData.length > 0) {
        // Extract unique agents from assignments
        const uniqueAgents = assignmentsData.reduce((acc: Array<{id: string | number, agent_name: string}>, assignment: { agent_name: string; agent_id?: string | number; id?: string | number }) => {
          if (assignment.agent_name && !acc.find(agent => agent.agent_name === assignment.agent_name)) {
            acc.push({
              id: assignment.agent_id || assignment.id || assignment.agent_name,
              agent_name: assignment.agent_name
            });
          }
          return acc;
        }, []);
        
        console.log('Mapped assignments:', uniqueAgents);
        setAssignments(uniqueAgents);
      } else {
        console.log('No assignments data found in API response');
        setAssignments([]);
      }
    } catch (error: unknown) {
      const errorMsg = (error as ApiError)?.response?.data?.message || (error as ApiError)?.message || 'Failed to fetch assignments';
      console.error('Error fetching assignments:', error);
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive",
      });
      setAssignments([]);
    } finally {
      setAssignmentsLoading(false);
    }
  };

  // Fetch claims with filters and pagination
  const fetchClaimsWithFilters = useCallback(async (page: number = 1, filterParams: FilterState | null = null) => {
    setLoading(true);
    try {
      const params = filterParams || { ...filters, search: search.search };
      const res: unknown = await getClaims(page, pagination.itemsPerPage, params);
      console.log(res, "res__");

      // Helper function to safely extract claims data and pagination info
      const extractClaimsData = (response: unknown): { claims: ApiClaim[], pagination: { currentPage: number; totalPages: number; totalItems: number; itemsPerPage: number } } => {
        if (response && typeof response === 'object' && response !== null) {
          if ('data' in response && response.data) {
            const data = response.data as { data: ApiClaim[]; meta: { current_page: number; last_page: number; total: number; per_page: number } };
            if ('data' in data && Array.isArray(data.data)) {
              return {
                claims: data.data,
                pagination: {
                  currentPage: data.meta?.current_page || 1,
                  totalPages: data.meta?.last_page || 1,
                  totalItems: data.meta?.total || 0,
                  itemsPerPage: data.meta?.per_page || 15,
                }
              };
            }
          }
        }
        return { claims: [], pagination: { currentPage: 1, totalPages: 1, totalItems: 0, itemsPerPage: 15 } };
      };

      const { claims: claimsData, pagination: paginationData } = extractClaimsData(res);
      setClaims(claimsData);
      setPagination(prev => ({ ...prev, ...paginationData }));
    } catch {
      console.error('Error fetching claims');
      toast({
        title: "Error",
        description: "Failed to fetch claims",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [filters, search.search, pagination.itemsPerPage]);

  const fetchClaims = useCallback(async (page: number = 1) => {
    return fetchClaimsWithFilters(page);
  }, [fetchClaimsWithFilters]);

  useEffect(() => {
    getClaimsStatistics().then((res) => {
      console.log(res, "res__111");
      const statsData = Array.isArray(res) ? res[0] : res;
      setStatistics(statsData as Statistics);
    });
    fetchClaimTypes();
    fetchAssignments();
    fetchClaims(1);
    // Initialize temp filters with current filters
    setTempFilters(filters);
  }, [filters, fetchClaims]);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Claims Review</h1>
        </div>
      </div>

      {/* KPI Cards - Enhanced with better icons */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">
              Total Claims
            </CardTitle>
            <FileText className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{statistics.total_pending_claims + statistics.settled_claim}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">
              Pending Review
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{statistics.total_pending_claims}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">
              Approved
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{statistics.settled_claim}</div>
          </CardContent>
        </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">
                Settlements
              </CardTitle>
              <div className="text-emerald-600 font-bold text-lg">₦</div>
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">₦0</div>
            </CardContent>
          </Card>
      </div>

      {/* All Claims - Single Box */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">All Claims</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search and Filter */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by client name or claim ID..."
                      className="pl-8 w-full"
                      value={search.search}
                      onChange={(e) => handleSearch(e.target.value)}
                      disabled={loading}
                    />
            </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={openFilterModal}
                      className="flex-shrink-0"
                    >
                      <Filter className="h-4 w-4 mr-2" />
                      {filtersApplied ? 'Edit Filter' : 'Filter'}
                      {filtersApplied && (
                        <div className="ml-2 h-2 w-2 bg-blue-500 rounded-full"></div>
                      )}
                    </Button>
                    {filtersApplied && (
                      <Button
                        variant="ghost"
                        onClick={clearAllFilters}
                        className="flex-shrink-0 text-muted-foreground"
                      >
                        <X className="h-4 w-4 mr-1" />
                        Clear
                      </Button>
                    )}
                  </div>
          </div>

          {/* Claims Table */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Claim ID</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Submission Date</TableHead>
                  <TableHead>Claim Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Assigned Agent</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="text-center">
                        <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">Loading claims...</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : allClaims.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="text-center">
                        <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">No claims found</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  allClaims.map((claim) => (
                    <TableRow key={claim.id}>
                      <TableCell className="font-medium">{claim.originalClaim.claim_number}</TableCell>
                      <TableCell>{claim.clientName}</TableCell>
                      <TableCell>{claim.submissionDate}</TableCell>
                      <TableCell>{claim.claim_type}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(claim.status)}>
                          {formatStatus(claim.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>{claim.assigned_agent}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/dashboard/claims/${claim.id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination Controls - Only show when there are results */}
      {!loading && pagination.totalItems > 0 && (
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

      {/* Filter Modal */}
      {showFilterModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Filter Claims</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFilterModal(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select value={tempFilters.status} onValueChange={(value) => handleFilterChange('status', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="settled">Settled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Assigned Agent</label>
                <Select value={tempFilters.assigned_agent} onValueChange={(value) => handleFilterChange('assigned_agent', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select agent" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Agents</SelectItem>
                    <SelectItem value="unassigned">Unassigned</SelectItem>
                    {assignmentsLoading ? (
                      <SelectItem value="" disabled>Loading agents...</SelectItem>
                    ) : (
                      assignments.map((agent) => (
                        <SelectItem key={agent.id} value={agent.agent_name.toLowerCase().replace(/\s+/g, '-')}>
                          {agent.agent_name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Claim Type</label>
                <Select value={tempFilters.claim_type} onValueChange={(value) => handleFilterChange('claim_type', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select claim type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {claimTypesLoading ? (
                      <SelectItem value="" disabled>Loading...</SelectItem>
                    ) : (
                      claimTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id.toString()}>
                          {type.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Date From</label>
                <Input
                  type="date"
                  value={tempFilters.start_date}
                  onChange={(e) => handleFilterChange('start_date', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Date To</label>
                <Input
                  type="date"
                  value={tempFilters.end_date}
                  onChange={(e) => handleFilterChange('end_date', e.target.value)}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={cancelFilters}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={applyFilters}
                  className="flex-1"
                >
                  Apply Filters
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}