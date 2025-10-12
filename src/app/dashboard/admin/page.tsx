"use client";
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip } from "@/components/ui/tooltip";
import { 
  Users, 
  BarChart3, 
  Plus, 
  RotateCcw, 
  Search, 
  X
} from "lucide-react";
import { getClaims, getAgents, getAllUsers, getClaimAssignments, getClaimAssignmentStatistics, assignClaim, updateClaimAssignment } from '@/app/services/dashboard';
import { useToast } from '@/components/ui/use-toast';
import { formatStatus } from '@/lib/utils/text-formatting';
import { useDebounce } from '@/hooks/useDebounce';

// Mock data for assignments (commented out as not used)
/*
const mockAssignments = [
  {
    id: "1",
    claimId: "CLM-001",
    clientName: "John Doe",
    claimType: "Motor",
    assignedAgent: "Sarah K.",
    dateAssigned: new Date("2024-01-28"),
    status: "Active",
    assignmentReason: "New claim",
    specialInstructions: "Client is VIP",
  },
  {
    id: "2",
    claimId: "CLM-002",
    clientName: "ABC Ltd",
    claimType: "Fire",
    assignedAgent: "Mike T.",
    dateAssigned: new Date("2024-01-27"),
    status: "Overdue",
    assignmentReason: "Reassignment",
    specialInstructions: "Complex case - requires expert review",
  },
  {
    id: "3",
    claimId: "CLM-003",
    clientName: "Jane Smith",
    claimType: "Property",
    assignedAgent: "Lisa M.",
    dateAssigned: new Date("2024-01-26"),
    status: "Active",
    assignmentReason: "New claim",
    specialInstructions: "",
  },
];
*/

// Mock data for agent workloads
const mockAgentWorkloads = [
  {
    id: "1",
    agentName: "Sarah K.",
    activeClaims: 12,
    overdueClaims: 2,
    avgResolutionTime: 8.5,
    performanceScore: 87,
    status: "Good",
    specialization: ["Motor", "Property"],
    maxClaims: 15,
    availability: "Active",
  },
  {
    id: "2",
    agentName: "Mike T.",
    activeClaims: 18,
    overdueClaims: 5,
    avgResolutionTime: 12.3,
    performanceScore: 72,
    status: "Alert",
    specialization: ["Fire", "Motor"],
    maxClaims: 15,
    availability: "Active",
  },
  {
    id: "3",
    agentName: "Lisa M.",
    activeClaims: 8,
    overdueClaims: 0,
    avgResolutionTime: 6.2,
    performanceScore: 94,
    status: "Excellent",
    specialization: ["Property", "Health"],
    maxClaims: 15,
    availability: "Active",
  },
];


export default function AdminPage() {
  const { toast } = useToast();
  const [assignments, setAssignments] = useState<Array<{
    id: string;
    claimId: string;
    clientName: string;
    claimType: string;
    assignedAgent: string;
    dateAssigned: Date;
    status: string;
    assignmentReason: string;
    specialInstructions: string;
  }>>([]);
  const [assignmentsLoading, setAssignmentsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [filter, setFilter] = useState("all");
  const [availableStatuses, setAvailableStatuses] = useState<string[]>([]);
  const [showNewAssignmentModal, setShowNewAssignmentModal] = useState(false);
  const [unassignedClaims, setUnassignedClaims] = useState<Array<{id: string, claim_number: string, client: {first_name: string, last_name: string}, claim_type_details: {name: string}}>>([]);
  const [unassignedClaimsLoading, setUnassignedClaimsLoading] = useState(false);
  const [agents, setAgents] = useState<Array<{id: string, first_name: string, last_name: string, email?: string}>>([]);
  const [agentsLoading, setAgentsLoading] = useState(false);
  const [workloads] = useState(mockAgentWorkloads);
  const [statistics, setStatistics] = useState<{
    total_agents: number;
    active_assignments: number;
  }>({
    total_agents: 0,
    active_assignments: 0
  });
  const [statisticsLoading, setStatisticsLoading] = useState(false);
  
  // Form state for new assignment modal
  const [newAssignment, setNewAssignment] = useState({
    claimId: '',
    agentId: '',
    specialInstructions: ''
  });
  const [isCreatingAssignment, setIsCreatingAssignment] = useState(false);

  // Reassignment modal state
  const [showReassignmentModal, setShowReassignmentModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<{
    id: string;
    claimId: string;
    clientName: string;
    assignedAgent: string;
    originalAssignment?: { claim_id?: string };
  } | null>(null);
  const [newAgentId, setNewAgentId] = useState('');
  const [isUpdatingAssignment, setIsUpdatingAssignment] = useState(false);

  // Fetch claim assignments and statistics on component mount
  useEffect(() => {
    fetchClaimAssignments();
    fetchStatistics();
    fetchAgents(); // Also fetch agents on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Debounced search effect for assigned claims
  useEffect(() => {
    if (debouncedSearch !== '') {
      console.log('Search API called with:', debouncedSearch);
      fetchClaimAssignments(debouncedSearch);
    } else if (debouncedSearch === '') {
      console.log('Clearing search');
      fetchClaimAssignments();
    }
  }, [debouncedSearch]);

  const filteredAssignments = assignments.filter((assignment) => {
    // Only filter by status since search is now handled server-side
    const claimStatus = assignment.status;
    const matchesFilter = filter === "all" || (claimStatus && String(claimStatus).toLowerCase() === filter);
    
    return matchesFilter;
  });

  // const filteredWorkloads = workloads.filter((workload) => {
  //   const matchesSearch = workload.agentName.toLowerCase().includes(search.toLowerCase());
  //   const matchesFilter = filter === "all" || workload.status.toLowerCase() === filter;
  //   return matchesSearch && matchesFilter;
  // });


  function getStatusBadge(status: string) {
    const config = {
      Active: { label: "Active", variant: "default" as const },
      Pending: { label: "Pending", variant: "secondary" as const },
      Approved: { label: "Approved", variant: "default" as const },
      Overdue: { label: "Overdue", variant: "destructive" as const },
      Completed: { label: "Completed", variant: "secondary" as const },
      Excellent: { label: "Excellent", variant: "default" as const, color: "text-green-600" },
      Good: { label: "Good", variant: "secondary" as const, color: "text-blue-600" },
      Alert: { label: "Alert", variant: "destructive" as const, color: "text-red-600" },
    };
    
    const badgeConfig = config[status as keyof typeof config] || { label: status, variant: "default" as const };
    return <Badge variant={badgeConfig.variant}>{formatStatus(badgeConfig.label)}</Badge>;
  }

  // function getWorkloadPercentage(activeClaims: number, maxClaims: number) {
  //   return Math.min((activeClaims / maxClaims) * 100, 100);
  // }

  // function getWorkloadColor(percentage: number) {
  //   if (percentage >= 90) return "bg-red-500";
  //   if (percentage >= 75) return "bg-yellow-500";
  //   return "bg-green-500";
  // }

  const handleNewAssignment = () => {
    setShowNewAssignmentModal(true);
    fetchUnassignedClaims(); // Fetch unassigned claims when modal opens
    fetchAgents(); // Fetch agents when modal opens
  };

  const handleCloseNewAssignmentModal = () => {
    setShowNewAssignmentModal(false);
  };

  const handleReassignClaim = (assignment: {
    id: string;
    claimId: string;
    clientName: string;
    assignedAgent: string;
    originalAssignment?: { claim_id?: string };
  }) => {
    setSelectedAssignment(assignment);
    setNewAgentId('');
    setShowReassignmentModal(true);
    
    // Ensure agents are loaded when opening reassignment modal
    if (agents.length === 0 && !agentsLoading) {
      fetchAgents();
    }
  };

  const handleUpdateAssignment = async () => {
    if (!selectedAssignment || !newAgentId) {
      toast({
        title: "Error",
        description: "Please select a new agent.",
        variant: "destructive",
      });
      return;
    }

    setIsUpdatingAssignment(true);
    try {
      // Extract claim ID from the assignment - use the original claim_id from the API response
      const claimId = selectedAssignment.originalAssignment?.claim_id || selectedAssignment.claimId?.replace('CLM-', '') || selectedAssignment.id;
      
      console.log('Reassignment debug:', {
        selectedAssignment,
        claimId,
        newAgentId,
        assignmentId: selectedAssignment.id,
        payload: {
          agent_id: parseInt(newAgentId)
        }
      });
      
      const response = await updateClaimAssignment(
        selectedAssignment.id.toString(),
        claimId,
        newAgentId
      );
      
      if (response) {
        toast({
          title: "Assignment Updated Successfully",
          description: `The claim has been reassigned to the selected agent.`,
        });
        
        // Close modal and reset form
        setShowReassignmentModal(false);
        setSelectedAssignment(null);
        setNewAgentId('');
        
        // Refresh assignments to show the updated assignment
        fetchClaimAssignments();
        
        // Refresh statistics to update counts
        fetchStatistics();
      }
    } catch (error) {
      console.error('Error updating assignment:', error);
      const errorResponse = error as { response?: { data?: { message?: string }; status?: number; headers?: unknown }; message?: string };
      console.error('API Response:', errorResponse?.response?.data);
      console.error('API Status:', errorResponse?.response?.status);
      console.error('API Headers:', errorResponse?.response?.headers);
      
      const errorMessage = errorResponse?.response?.data?.message || errorResponse?.message || "Failed to update assignment. Please try again.";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsUpdatingAssignment(false);
    }
  };

  const fetchUnassignedClaims = async () => {
    setUnassignedClaimsLoading(true);
    try {
      console.log('Fetching unassigned claims...');
      
      // First, get all claims
      const claimsRes = await getClaims();
      console.log('Claims response:', claimsRes);
      
      // Then, get all assignments
      const assignmentsRes = await getClaimAssignments();
      console.log('Assignments response:', assignmentsRes);
      
      // Extract claims data from response
      let claimsData = [];
      if (claimsRes && claimsRes.data && Array.isArray(claimsRes.data)) {
        claimsData = claimsRes.data;
      } else if (Array.isArray(claimsRes)) {
        claimsData = claimsRes;
      } else if (claimsRes && typeof claimsRes === 'object' && 'data' in claimsRes && claimsRes.data && typeof claimsRes.data === 'object' && 'data' in claimsRes.data && Array.isArray(claimsRes.data.data)) {
        claimsData = claimsRes.data.data;
      }
      
      // Extract assignments data from response
      let assignmentsData = [];
      if (assignmentsRes && assignmentsRes.data && Array.isArray(assignmentsRes.data)) {
        assignmentsData = assignmentsRes.data;
      } else if (Array.isArray(assignmentsRes)) {
        assignmentsData = assignmentsRes;
      }
      
      // Get claim IDs that are already assigned
      const assignedClaimIds = new Set(assignmentsData.map((assignment: { claim_id: string | number }) => assignment.claim_id));
      
      // Filter for unassigned claims with pending or approved status
      const unassigned = claimsData.filter((claim: { id: string | number; status: string }) => {
        const isUnassigned = !assignedClaimIds.has(claim.id);
        const hasValidStatus = claim.status === 'pending' || claim.status === 'approved';
        return isUnassigned && hasValidStatus;
      });
      
      console.log('Unassigned claims:', unassigned);
      console.log('Assigned claim IDs:', assignedClaimIds);
      setUnassignedClaims(unassigned);
    } catch (error) {
      console.error('Error fetching unassigned claims:', error);
      setUnassignedClaims([]);
    } finally {
      setUnassignedClaimsLoading(false);
    }
  };

  const fetchAgents = async () => {
    setAgentsLoading(true);
    try {
      console.log('Fetching agents from user management API...');
      let res;
      
      try {
        // Try the primary endpoint first
        res = await getAgents();
        console.log('Primary agents response:', res);
      } catch (primaryError) {
        console.warn('Primary agents endpoint failed, trying alternative...', primaryError);
        try {
          // Try alternative endpoint to get all users
          res = await getAllUsers();
          console.log('All users response:', res);
          
          // Filter agents from all users on the client side
          if (res && res.data && Array.isArray(res.data)) {
            const agents = (res.data as unknown as { role: string }[]).filter((user: { role: string }) => user.role === 'agent');
            res = { ...res, data: agents };
          }
        } catch (altError) {
          console.error('Alternative endpoint also failed:', altError);
          throw altError;
        }
      }
      
      // Check if response indicates an error
      if (res && res.status && Number(res.status) >= 400) {
        console.error('User Management API returned error status:', res.status, res.data);
        console.log('API Error Details:', (res.data as { message?: string })?.message);
        setAgents([]);
        return;
      }
      
      // Extract agents data from response
      let agentsData = [];
      if (res && res.data && Array.isArray(res.data)) {
        agentsData = res.data;
      } else if (Array.isArray(res)) {
        agentsData = res;
      } else if (res && typeof res === 'object' && 'data' in res && res.data && typeof res.data === 'object' && 'data' in res.data && Array.isArray(res.data.data)) {
        agentsData = res.data.data;
      }
      
      console.log('Agents data from API:', agentsData);
      setAgents(agentsData);
    } catch (error) {
      console.error('Error fetching agents from user management API:', error);
      // Fallback to mock data from workloads to ensure UI functionality
      console.log('Using fallback mock agents data...');
      const mockAgents = workloads.map(workload => ({
        id: workload.id,
        first_name: workload.agentName.split(' ')[0] || 'Unknown',
        last_name: workload.agentName.split(' ')[1] || 'Agent',
        email: `${workload.agentName.toLowerCase().replace(/\s+/g, '.')}@company.com`
      }));
      setAgents(mockAgents);
    } finally {
      setAgentsLoading(false);
    }
  };

  const fetchStatistics = async () => {
    setStatisticsLoading(true);
    try {
      console.log('Fetching claim assignment statistics...');
      const res = await getClaimAssignmentStatistics();
      console.log('Statistics response:', res);
      
      // Check if response indicates an error
      if (res && res.status && Number(res.status) >= 400) {
        console.error('Statistics API returned error status:', res.status, res.data);
        setStatistics({
          total_agents: 0,
          active_assignments: 0
        });
        return;
      }
      
      // Extract statistics data from response
      let statsData = null;
      if (res && res.data) {
        statsData = res.data;
      } else if (res && typeof res === 'object') {
        statsData = res;
      }
      
      if (statsData) {
        const actualData = 'data' in statsData ? statsData.data : statsData as { total_agents?: number; active_assignments?: number };
        setStatistics({
          total_agents: actualData?.total_agents || 0,
          active_assignments: actualData?.active_assignments || 0
        });
        console.log('Statistics set:', {
          total_agents: actualData?.total_agents || 0,
          active_assignments: actualData?.active_assignments || 0
        });
      }
    } catch (error) {
      console.error('Error fetching claim assignment statistics:', error);
      setStatistics({
        total_agents: 0,
        active_assignments: 0
      });
    } finally {
      setStatisticsLoading(false);
    }
  };

  const fetchClaimAssignments = async (searchTerm?: string) => {
    setAssignmentsLoading(true);
    try {
      console.log('Fetching claim assignments with search:', searchTerm);
      const res = await getClaimAssignments(searchTerm);
      console.log('Claim assignments response:', res);
      console.log('Response type:', typeof res);
      console.log('Response keys:', res ? Object.keys(res) : 'No response');
      
      // Check if response indicates an error
      if (res && res.status && Number(res.status) >= 400) {
        console.error('API returned error status:', res.status, res.data);
        setAssignments([]);
        return;
      }
      
      // Extract assignments data from response
      let assignmentsData = [];
      console.log('Attempting to extract assignments data from response...');
      
      if (res && res.data && Array.isArray(res.data)) {
        console.log('Using res.data (Array)');
        assignmentsData = res.data;
      } else if (Array.isArray(res)) {
        console.log('Using res directly (Array)');
        assignmentsData = res;
      } else if (res && typeof res === 'object' && 'data' in res && res.data && typeof res.data === 'object' && 'data' in res.data && Array.isArray(res.data.data)) {
        console.log('Using res.data.data (Nested Array)');
        assignmentsData = res.data.data;
      } else {
        console.log('No valid data structure found. Response structure:', {
          isArray: Array.isArray(res),
          hasData: res && 'data' in res,
          dataType: res?.data ? typeof res.data : 'no data',
          dataIsArray: res?.data ? Array.isArray(res.data) : false,
          fullResponse: res
        });
      }
      
      console.log('Extracted assignmentsData:', assignmentsData);
      console.log('AssignmentsData length:', assignmentsData.length);
      
      // Debug: Log the raw API response to understand the structure
      console.log('Raw API response data:', assignmentsData);
      console.log('First assignment structure:', assignmentsData[0]);
      
      // Extract unique statuses from assignments data
      const extractUniqueStatuses = (assignmentsData: Array<{ claim?: { status?: string }; status?: string }>): string[] => {
        const statusSet = new Set<string>();
        assignmentsData.forEach((assignment: { claim?: { status?: string }; status?: string }) => {
          const claim = assignment.claim || {};
          if (claim.status) {
            statusSet.add(claim.status.toLowerCase());
          }
        });
        // Return all unique statuses found in the API response
        return Array.from(statusSet).sort();
      };

      const uniqueStatuses = extractUniqueStatuses(assignmentsData);
      setAvailableStatuses(uniqueStatuses);

      // Transform assignments data to match our table structure
      const transformedAssignments = assignmentsData
        .map((assignment: {
          id: string | number;
          claim_id?: string;
          agent_id?: string;
          claim?: {
            id?: string;
            status?: string;
            client?: { first_name?: string; last_name?: string; name?: string } | string;
            client_name?: string;
            customer_name?: string;
            claim_type_details?: { name?: string } | string;
            claim_type?: string;
            type?: string;
            claim_number?: string;
            claim_id?: string;
            number?: string;
            description?: string;
            submission_date?: string;
            created_at?: string;
          };
          agent?: { name?: string; first_name?: string; last_name?: string; full_name?: string } | string;
          assigned_agent?: string;
          agent_name?: string;
          assigned_to?: string;
          status?: string;
          created_at?: string;
          reason?: string;
          special_instructions?: string;
        }) => {
          // Debug: Log each assignment's structure
          console.log('Processing assignment:', {
            id: assignment.id,
            claim_id: assignment.claim_id,
            agent_id: assignment.agent_id,
            claim: assignment.claim,
            agent: assignment.agent,
            full_assignment: assignment,
            all_assignment_keys: Object.keys(assignment)
          });
          
          // Extract claim data from assignment
          const claim = assignment.claim || {};
          
          console.log('Claim extraction debug:', {
            assignment_claim: assignment.claim,
            claim_status: claim.status,
            assignment_keys: Object.keys(assignment),
            claim_keys: claim ? Object.keys(claim) : 'no claim'
          });
          
          // Handle different possible client data structures
          let clientName = 'Unknown Client';
          if (claim.client) {
            if (typeof claim.client === 'string') {
              clientName = claim.client;
            } else if (claim.client.first_name && claim.client.last_name) {
              clientName = `${claim.client.first_name} ${claim.client.last_name}`;
            } else if (claim.client.name) {
              clientName = claim.client.name;
            }
          } else if (claim.client_name) {
            clientName = claim.client_name;
          } else if (claim.customer_name) {
            clientName = claim.customer_name;
          }
          
          // Handle different possible claim type structures
          let claimType = 'Unknown';
          if (claim.claim_type_details) {
            if (typeof claim.claim_type_details === 'string') {
              claimType = claim.claim_type_details;
            } else if (claim.claim_type_details.name) {
              claimType = claim.claim_type_details.name;
            }
          } else if (claim.claim_type) {
            claimType = claim.claim_type;
          } else if (claim.type) {
            claimType = claim.type;
          }
          
          // Handle different possible claim number structures
          let claimId = `CLM-${claim.id || assignment.claim_id}`;
          if (claim.claim_number) {
            claimId = String(claim.claim_number);
          } else if (assignment.claim_id) {
            claimId = `CLM-${assignment.claim_id}`;
          } else if (claim.claim_id) {
            claimId = String(claim.claim_id);
          } else if (claim.number) {
            claimId = String(claim.number);
          }
          
          // Handle status mapping - keep original statuses
          let mappedStatus = claim.status || assignment.status || 'unknown';
          
          // Only capitalize first letter, don't change the actual status
          if (mappedStatus && typeof mappedStatus === 'string') {
            mappedStatus = mappedStatus.charAt(0).toUpperCase() + mappedStatus.slice(1);
          }
          
          console.log('Status extraction debug:', {
            claim_status: claim.status,
            assignment_status: assignment.status,
            final_mappedStatus: mappedStatus,
            claim_object: claim,
            assignment_object: assignment
          });
          
          // Handle different possible assigned agent structures
          let assignedAgent = 'Unassigned';
          
          // Check for direct assigned_agent field first
          if (assignment.assigned_agent && assignment.assigned_agent.trim() !== '') {
            assignedAgent = assignment.assigned_agent;
          } else if (assignment.agent) {
            if (typeof assignment.agent === 'string' && assignment.agent.trim() !== '') {
              assignedAgent = assignment.agent;
            } else if (typeof assignment.agent === 'object' && assignment.agent.name && assignment.agent.name.trim() !== '') {
              assignedAgent = assignment.agent.name;
            } else if (typeof assignment.agent === 'object' && assignment.agent.first_name && assignment.agent.last_name) {
              assignedAgent = `${assignment.agent.first_name} ${assignment.agent.last_name}`;
            } else if (typeof assignment.agent === 'object' && assignment.agent.full_name && assignment.agent.full_name.trim() !== '') {
              assignedAgent = assignment.agent.full_name;
            }
          } else if (assignment.agent_name && assignment.agent_name.trim() !== '') {
            assignedAgent = assignment.agent_name;
          } else if (assignment.assigned_to && assignment.assigned_to.trim() !== '') {
            assignedAgent = assignment.assigned_to;
          } else if (assignment.agent_id) {
            // If we have agent_id but no name, try to get from agents list
            assignedAgent = `Agent ID: ${assignment.agent_id}`;
          }
          
          console.log('Agent extraction debug:', {
            assigned_agent: assignment.assigned_agent,
            assignment_agent: assignment.agent,
            agent_name: assignment.agent_name,
            assigned_to: assignment.assigned_to,
            agent_id: assignment.agent_id,
            final_assignedAgent: assignedAgent
          });
          
                return {
                  id: assignment.id.toString(),
                  claimId: claimId,
                  clientName: clientName,
                  claimType: claimType,
                  assignedAgent: assignedAgent,
                  dateAssigned: new Date(assignment.created_at || claim.submission_date || claim.created_at || new Date()),
                  status: mappedStatus,
                  assignmentReason: assignment.reason || 'New assignment',
                  specialInstructions: assignment.special_instructions || claim.description || 'No special instructions',
                  originalAssignment: assignment // Store original assignment data for API calls
                };
        });
      
      console.log('Transformed assignments (assigned only):', transformedAssignments);
      setAssignments(transformedAssignments);
    } catch (error) {
      console.error('Error fetching claim assignments:', error);
      setAssignments([]);
    } finally {
      setAssignmentsLoading(false);
    }
  };

  const handleCreateAssignment = async () => {
    if (!newAssignment.claimId || !newAssignment.agentId) {
      toast({
        title: "Error",
        description: "Please select both a claim and an agent to create the assignment.",
        variant: "destructive",
      });
      return;
    }

    setIsCreatingAssignment(true);
    try {
      // Call the API to assign the claim
      const response = await assignClaim(newAssignment.claimId, newAssignment.agentId, newAssignment.specialInstructions);
      
      if (response) {
        // Show success notification
        toast({
          title: "Claim Assigned Successfully",
          description: `The claim has been successfully assigned to the selected agent.`,
        });
        
        // Reset form
        setNewAssignment({
          claimId: '',
          agentId: '',
          specialInstructions: ''
        });
        
        // Close modal
        setShowNewAssignmentModal(false);
        
        // Refresh assignments to show the new assignment
        fetchClaimAssignments();
        
        // Refresh statistics to update counts
        fetchStatistics();
      }
    } catch (error) {
      console.error('Error creating assignment:', error);
      toast({
        title: "Error",
        description: "Failed to assign agent to claim. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCreatingAssignment(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Assign Claims</h1>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Agents</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statisticsLoading ? (
                <div className="animate-pulse bg-gray-200 h-8 w-12 rounded"></div>
              ) : (
                statistics.total_agents
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Assignments</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statisticsLoading ? (
                <div className="animate-pulse bg-gray-200 h-8 w-12 rounded"></div>
              ) : (
                statistics.active_assignments
              )}
            </div>
          </CardContent>
        </Card>
      </div>


      {/* Claim Assignments Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              <CardTitle>Assigned Claims</CardTitle>
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={handleNewAssignment}>
                <Plus className="h-4 w-4 mr-2" />
                New Assignment
              </Button>
            </div>
          </div>
          
          {/* Search and Filter */}
          <div className="flex gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by agent name, client name, claim ID, or claim type..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-10 pr-10"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {availableStatuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {formatStatus(status)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Claim ID</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Agent</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
              <TableBody>
                {assignmentsLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground">
                      Loading claim assignments...
                    </TableCell>
                  </TableRow>
                ) : filteredAssignments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground">
                      No assigned claims found matching your criteria.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAssignments.map((assignment) => (
                    <TableRow key={assignment.id}>
                      <TableCell className="font-medium">{assignment.claimId}</TableCell>
                      <TableCell>{assignment.clientName}</TableCell>
                      <TableCell>{assignment.claimType}</TableCell>
                      <TableCell>{assignment.assignedAgent}</TableCell>
                      <TableCell>{getStatusBadge(assignment.status)}</TableCell>
                      <TableCell>
                        <Tooltip content="Reassign">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleReassignClaim(assignment)}
                          >
                            <RotateCcw className="h-4 w-4" />
                          </Button>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>


      {/* New Assignment Modal */}
      {showNewAssignmentModal && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">New Claim Assignment</h3>
              <Button variant="ghost" size="sm" onClick={handleCloseNewAssignmentModal}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Select Claim</label>
                <Select 
                  value={newAssignment.claimId} 
                  onValueChange={(value) => setNewAssignment({...newAssignment, claimId: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a claim" />
                  </SelectTrigger>
                  <SelectContent>
                    {unassignedClaimsLoading ? (
                      <SelectItem value="loading" disabled>Loading claims...</SelectItem>
                    ) : unassignedClaims.length === 0 ? (
                      <SelectItem value="no-claims" disabled>No unassigned claims available</SelectItem>
                    ) : (
                      unassignedClaims.map((claim) => (
                        <SelectItem key={claim.id} value={claim.id}>
                          {claim.claim_number} - {claim.client.first_name} {claim.client.last_name} ({claim.claim_type_details.name})
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium">Assign to Agent</label>
                <Select 
                  value={newAssignment.agentId} 
                  onValueChange={(value) => setNewAssignment({...newAssignment, agentId: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose an agent" />
                  </SelectTrigger>
                  <SelectContent>
                    {agentsLoading ? (
                      <SelectItem value="loading" disabled>Loading agents from API...</SelectItem>
                    ) : agents.length === 0 ? (
                      <SelectItem value="no-agents" disabled>No agents available</SelectItem>
                    ) : (
                      agents.map((agent) => (
                        <SelectItem key={agent.id} value={agent.id}>
                          {agent.first_name} {agent.last_name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
              
              
              <div>
                <label className="text-sm font-medium">Special Instructions</label>
                <textarea 
                  className="w-full p-2 border rounded-md" 
                  rows={3}
                  placeholder="Any special notes or instructions..."
                  value={newAssignment.specialInstructions}
                  onChange={(e) => setNewAssignment({...newAssignment, specialInstructions: e.target.value})}
                />
              </div>
            </div>
            
            <div className="flex gap-2 justify-end mt-6">
              <Button variant="outline" onClick={handleCloseNewAssignmentModal} disabled={isCreatingAssignment}>
                Cancel
              </Button>
              <Button onClick={handleCreateAssignment} disabled={isCreatingAssignment}>
                {isCreatingAssignment ? 'Creating...' : 'Create Assignment'}
              </Button>
            </div>
          </div>
        </div>
      )}


      {/* Reassignment Modal */}
      {showReassignmentModal && selectedAssignment && (
        <div 
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        >
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Reassign Claim</h3>
              <button
                onClick={() => setShowReassignmentModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  <strong>Current Assignment:</strong><br />
                  Claim: {selectedAssignment.claimId}<br />
                  Client: {selectedAssignment.clientName}<br />
                  Current Agent: {selectedAssignment.assignedAgent}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Select New Agent</label>
                <Select 
                  value={newAgentId} 
                  onValueChange={setNewAgentId}
                  disabled={agentsLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={agentsLoading ? "Loading agents..." : "Choose an agent"} />
                  </SelectTrigger>
                  <SelectContent>
                    {agentsLoading ? (
                      <SelectItem value="loading" disabled>
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 mr-2"></div>
                          Loading agents...
                        </div>
                      </SelectItem>
                    ) : agents.length === 0 ? (
                      <SelectItem value="no-agents" disabled>No agents available</SelectItem>
                    ) : (
                      agents.map((agent) => (
                        <SelectItem key={agent.id} value={agent.id}>
                          {agent.first_name} {agent.last_name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <Button
                variant="outline"
                onClick={() => setShowReassignmentModal(false)}
                disabled={isUpdatingAssignment}
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpdateAssignment}
                disabled={isUpdatingAssignment || !newAgentId}
              >
                {isUpdatingAssignment ? "Updating..." : "Update Assignment"}
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
} 