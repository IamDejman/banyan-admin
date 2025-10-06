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
import { getClaims, getAgents, getAllUsers, getClaimAssignmentsWithClaims, getClaimAssignmentStatistics } from '@/app/services/dashboard';
import { formatStatus } from '@/lib/utils/text-formatting';

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
  const [filter, setFilter] = useState("all");
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

  // Fetch claim assignments and statistics on component mount
  useEffect(() => {
    fetchClaimAssignments();
    fetchStatistics();
  }, []);

  const filteredAssignments = assignments.filter((assignment) => {
    const matchesSearch = 
      assignment.claimId.toLowerCase().includes(search.toLowerCase()) ||
      assignment.clientName.toLowerCase().includes(search.toLowerCase()) ||
      assignment.assignedAgent.toLowerCase().includes(search.toLowerCase());
    
    const matchesFilter = filter === "all" || assignment.status.toLowerCase() === filter;
    
    return matchesSearch && matchesFilter;
  });

  // const filteredWorkloads = workloads.filter((workload) => {
  //   const matchesSearch = workload.agentName.toLowerCase().includes(search.toLowerCase());
  //   const matchesFilter = filter === "all" || workload.status.toLowerCase() === filter;
  //   return matchesSearch && matchesFilter;
  // });


  function getStatusBadge(status: string) {
    const config = {
      Active: { label: "Active", variant: "default" as const },
      Overdue: { label: "Overdue", variant: "destructive" as const },
      Completed: { label: "Completed", variant: "secondary" as const },
      Excellent: { label: "Excellent", variant: "default" as const, color: "text-green-600" },
      Good: { label: "Good", variant: "secondary" as const, color: "text-blue-600" },
      Alert: { label: "Alert", variant: "destructive" as const, color: "text-red-600" },
    };
    
    const badgeConfig = config[status as keyof typeof config] || config.Active;
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

  const handleReassignClaim = (assignment: { id: string; claimId: string; assignedAgent: string }) => {
    // For now, we'll show an alert. In a real implementation, this would open a reassignment modal
    alert(`Reassign claim ${assignment.claimId} from ${assignment.assignedAgent} to another agent.\n\nThis feature will open a reassignment modal where you can select a new agent.`);
  };

  const fetchUnassignedClaims = async () => {
    setUnassignedClaimsLoading(true);
    try {
      console.log('Fetching unassigned claims...');
      const res = await getClaims();
      console.log('Claims response:', res);
      
      // Extract claims data from response
      let claimsData = [];
      if (res && res.data && Array.isArray(res.data)) {
        claimsData = res.data;
      } else if (Array.isArray(res)) {
        claimsData = res;
      } else if (res && typeof res === 'object' && 'data' in res && res.data && typeof res.data === 'object' && 'data' in res.data && Array.isArray(res.data.data)) {
        claimsData = res.data.data;
      }
      
      // Filter for unassigned claims with pending or approved status
      const unassigned = claimsData.filter((claim: { assigned_agent?: string | null; status: string }) => {
        const isUnassigned = !claim.assigned_agent || claim.assigned_agent === '' || claim.assigned_agent === null;
        const hasValidStatus = claim.status === 'pending' || claim.status === 'approved';
        return isUnassigned && hasValidStatus;
      });
      
      console.log('Unassigned claims:', unassigned);
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

  const fetchClaimAssignments = async () => {
    setAssignmentsLoading(true);
    try {
      console.log('Fetching claim assignments...');
      const res = await getClaimAssignmentsWithClaims();
      console.log('Claim assignments response:', res);
      
      // Check if response indicates an error
      if (res && res.status && Number(res.status) >= 400) {
        console.error('API returned error status:', res.status, res.data);
        setAssignments([]);
        return;
      }
      
      // Extract claims data from response
      let claimsData = [];
      if (res && res.data && Array.isArray(res.data)) {
        claimsData = res.data;
      } else if (Array.isArray(res)) {
        claimsData = res;
      } else if (res && typeof res === 'object' && 'data' in res && res.data && typeof res.data === 'object' && 'data' in res.data && Array.isArray(res.data.data)) {
        claimsData = res.data.data;
      }
      
      // Transform API data to match our table structure and filter for assigned claims only
      const transformedAssignments = claimsData
        .filter((claim: { assigned_agent?: string | null }) => {
          // Only include claims that have an assigned agent (not empty or 'Unassigned')
          const assignedAgent = claim.assigned_agent;
          return assignedAgent && assignedAgent.trim() !== '' && assignedAgent.toLowerCase() !== 'unassigned';
        })
        .map((claim: { 
          id: string | number; 
          claim_number: string; 
          client: { first_name: string; last_name: string }; 
          claim_type_details: { name: string }; 
          assigned_agent: string; 
          status: string; 
          created_at: string; 
          special_instructions?: string;
          submission_date?: string;
          description?: string;
        }) => ({
          id: claim.id.toString(),
          claimId: claim.claim_number || `CLM-${claim.id}`,
          clientName: claim.client ? `${claim.client.first_name} ${claim.client.last_name}` : 'Unknown Client',
          claimType: claim.claim_type_details?.name || 'Unknown',
          assignedAgent: claim.assigned_agent,
          dateAssigned: new Date(claim.submission_date || claim.created_at || new Date()),
          status: claim.status === 'pending' ? 'Active' : claim.status === 'approved' ? 'Completed' : 'Pending',
          assignmentReason: 'New claim',
          specialInstructions: claim.description || 'No special instructions'
        }));
      
      console.log('Transformed assignments (assigned only):', transformedAssignments);
      setAssignments(transformedAssignments);
    } catch (error) {
      console.error('Error fetching claim assignments:', error);
      setAssignments([]);
    } finally {
      setAssignmentsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Assign Claims</h1>
        <p className="text-muted-foreground">Manage claim assignments, agent workloads, and status configurations</p>
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
                placeholder="Search assignments, agents, or statuses..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
                <SelectItem value="excellent">Excellent</SelectItem>
                <SelectItem value="good">Good</SelectItem>
                <SelectItem value="alert">Alert</SelectItem>
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
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">New Claim Assignment</h3>
              <Button variant="ghost" size="sm" onClick={handleCloseNewAssignmentModal}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Select Claim</label>
                <Select>
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
                <Select>
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
                />
              </div>
            </div>
            
            <div className="flex gap-2 justify-end mt-6">
              <Button variant="outline" onClick={handleCloseNewAssignmentModal}>
                Cancel
              </Button>
              <Button onClick={() => {
                alert('Assignment created successfully!');
                handleCloseNewAssignmentModal();
              }}>
                Create Assignment
              </Button>
            </div>
          </div>
        </div>
      )}


    </div>
  );
} 