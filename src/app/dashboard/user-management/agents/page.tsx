"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { Badge } from "@/components/ui/badge";
import { Plus, Check, X, ChevronDown, ChevronRight, Edit, Search } from "lucide-react";
import AgentForm from "./AgentForm";
import { Tooltip } from "@/components/ui/tooltip";
import type { Agent, UserStatus } from "@/lib/types/user";
import { getAgents, createAgent, disableUser, searchAgents, editUser } from "@/app/services/dashboard";
import { formatDateTime, formatDate } from "@/lib/utils/text-formatting";
import { useToast } from "@/components/ui/use-toast";
import { useDebounce } from "@/hooks/useDebounce";

// Mock agent data (commented out as not used)
/* const mockAgents: Agent[] = [
  {
    id: "1",
    firstName: "Sarah",
    lastName: "Johnson",
    email: "sarah.johnson@company.com",
    phone: "+2348012345678",
    status: "active" as UserStatus,
    createdAt: "2024-01-01",
    lastLogin: "2024-01-20T08:15:00",
    role: "agent" as const,
    employeeId: "EMP001",
    department: "Claims Processing",
    supervisor: "David Wilson",
    assignedClaims: ["CLM-001", "CLM-002", "CLM-003"],
    completedClaims: ["CLM-001", "CLM-002"],
    performanceRating: 4.8,
    specializations: ["Motor", "Property"]
  },
  {
    id: "2",
    firstName: "Michael",
    lastName: "Chen",
    email: "michael.chen@company.com",
    phone: "+2348098765432",
    status: "active" as UserStatus,
    createdAt: "2024-01-02",
    lastLogin: "2024-01-19T16:30:00",
    role: "agent" as const,
    employeeId: "EMP002",
    department: "Claims Processing",
    supervisor: "David Wilson",
    assignedClaims: ["CLM-004", "CLM-005"],
    completedClaims: ["CLM-004"],
    performanceRating: 4.5,
    specializations: ["Health", "Life"]
  },
  {
    id: "3",
    firstName: "Emily",
    lastName: "Davis",
    email: "emily.davis@company.com",
    phone: "+2348055555555",
    status: "active" as UserStatus,
    createdAt: "2024-01-03",
    lastLogin: "2024-01-18T11:45:00",
    role: "agent" as const,
    employeeId: "EMP003",
    department: "Claims Processing",
    supervisor: "David Wilson",
    assignedClaims: ["CLM-006", "CLM-007", "CLM-008"],
    completedClaims: ["CLM-006", "CLM-007"],
    performanceRating: 4.9,
    specializations: ["Business", "Travel"]
  },
]; */

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [agentsLoading, setAgentsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modal, setModal] = useState<{ mode: "create" | "edit"; agent?: Agent } | null>(null);
  const [expandedAgent, setExpandedAgent] = useState<Agent | null>(null);
  const [expandedRows, setExpandedRows] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const { toast } = useToast();
  const debouncedSearch = useDebounce(search, 500);

  // Fetch agents from API on component mount
  useEffect(() => {
    fetchAgents();
  }, []);

  // Handle debounced search
  useEffect(() => {
    if (debouncedSearch.trim()) {
      handleSearch(debouncedSearch);
    } else {
      fetchAgents();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  const handleSearch = async (searchTerm: string) => {
    setSearchLoading(true);
    try {
      const response = await searchAgents(searchTerm);
      
      if (response?.data && Array.isArray(response.data)) {
        const transformedAgents = (response.data as unknown as { id: string | number; first_name: string; last_name: string; email: string; phone: string; status: string; created_at: string; last_login_at?: string; employee_id?: string; department?: string; supervisor?: string; assigned_claims?: string[]; completed_claims?: string[]; performance_rating?: number; specializations?: string[] }[]).map((agent: { 
          id: string | number; 
          first_name: string; 
          last_name: string; 
          email: string; 
          phone: string; 
          status: string; 
          created_at: string; 
          last_login_at?: string;
          employee_id?: string;
          department?: string;
          supervisor?: string;
          assigned_claims?: string[];
          completed_claims?: string[];
          performance_rating?: number;
          specializations?: string[];
        }) => ({
          id: agent.id?.toString() || `agent-${Date.now()}`,
          firstName: agent.first_name || (agent as { firstName?: string }).firstName || '',
          lastName: agent.last_name || (agent as { lastName?: string }).lastName || '',
          email: agent.email || '',
          phone: agent.phone || (agent as { phone_number?: string }).phone_number || '',
          role: 'agent' as const,
          status: (agent.status as UserStatus) || 'active',
          createdAt: agent.created_at || (agent as { createdAt?: string }).createdAt || new Date().toISOString().split('T')[0],
          lastLogin: agent.last_login_at || (agent as { lastLogin?: string }).lastLogin || undefined,
          employeeId: agent.employee_id || (agent as { employeeId?: string }).employeeId || `EMP${agent.id}`,
          department: agent.department || 'Claims Processing',
          supervisor: agent.supervisor || undefined,
          assignedClaims: agent.assigned_claims || (agent as { assignedClaims?: string[] }).assignedClaims || [],
          completedClaims: agent.completed_claims || (agent as { completedClaims?: string[] }).completedClaims || [],
          performanceRating: agent.performance_rating || (agent as { performanceRating?: number }).performanceRating || undefined,
          specializations: agent.specializations || []
        }));
        setAgents(transformedAgents);
      } else {
        setAgents([]);
      }
    } catch (error) {
      console.error('Search failed:', error);
      toast({
        variant: "destructive",
        title: "Search failed",
        description: "Failed to search agents. Please try again.",
      });
      setAgents([]);
    } finally {
      setSearchLoading(false);
    }
  };

  const fetchAgents = async () => {
    setAgentsLoading(true);
    try {
      const res = await getAgents();
      
      // Check if response indicates an error
      if (res && res.status && Number(res.status) >= 400) {
        console.error('User Management API returned error status:', res.status, res.data);
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
      
      // Transform API data to match our Agent type
      const transformedAgents = agentsData.map((agent: { 
        id: string | number; 
        first_name: string; 
        last_name: string; 
        email: string; 
        phone: string; 
        status: string; 
        created_at: string; 
        last_login_at?: string;
        employee_id?: string;
        department?: string;
        supervisor?: string;
        assigned_claims?: string[];
        completed_claims?: string[];
        performance_rating?: number;
        specializations?: string[];
      }) => ({
        id: agent.id?.toString() || `agent-${Date.now()}`,
        firstName: agent.first_name || (agent as { firstName?: string }).firstName || '',
        lastName: agent.last_name || (agent as { lastName?: string }).lastName || '',
        email: agent.email || '',
        phone: agent.phone || (agent as { phone_number?: string }).phone_number || '',
        role: 'agent' as const,
        status: (agent.status as UserStatus) || 'active',
        createdAt: agent.created_at || new Date().toISOString().split('T')[0],
        lastLogin: agent.last_login_at || (agent as { lastLogin?: string }).lastLogin || undefined,
        employeeId: agent.employee_id || (agent as { employeeId?: string }).employeeId || `EMP${agent.id}`,
        department: agent.department || 'Claims Processing',
        supervisor: agent.supervisor || undefined,
        assignedClaims: agent.assigned_claims || (agent as { assignedClaims?: string[] }).assignedClaims || [],
        completedClaims: agent.completed_claims || (agent as { completedClaims?: string[] }).completedClaims || [],
        performanceRating: agent.performance_rating || (agent as { performanceRating?: number }).performanceRating || undefined,
        specializations: agent.specializations || []
      }));
      
      setAgents(transformedAgents);
    } catch (error) {
      console.error('Error fetching agents from user management API:', error);
      setAgents([]);
    } finally {
      setAgentsLoading(false);
    }
  };

  const filteredAgents = agents.filter((agent) =>
    agent.firstName.toLowerCase().includes(search.toLowerCase()) ||
    agent.lastName.toLowerCase().includes(search.toLowerCase()) ||
    agent.email.toLowerCase().includes(search.toLowerCase()) ||
    agent.phone.toLowerCase().includes(search.toLowerCase())
  );

  async function handleCreateAgent(agentData: { firstName: string; lastName: string; email: string; phoneNumber: string; password?: string }) {
    try {
      setLoading(true);
      setError(null);
      
      // Prepare data for API
      const apiData = {
        email: agentData.email,
        first_name: agentData.firstName,
        last_name: agentData.lastName,
        password: agentData.password || "",
        role: "agent" as const,
        phone: agentData.phoneNumber
      };
      
      const response = await createAgent(apiData);
      
      // If we get here, the API call succeeded (200 response)
      if (response?.data) {
        // Transform API response to match Agent interface
        const newAgent: Agent = {
          id: response.data.id?.toString() || `agent-${Date.now()}`,
          firstName: response.data.first_name || agentData.firstName,
          lastName: response.data.last_name || agentData.lastName,
          email: response.data.email || agentData.email,
          phone: agentData.phoneNumber,
          role: "agent",
          status: "active",
          employeeId: `EMP${Date.now()}`,
          department: "Claims Processing",
          supervisor: undefined,
          assignedClaims: [],
          completedClaims: [],
          performanceRating: undefined,
          specializations: [],
          createdAt: new Date().toISOString().split('T')[0],
          lastLogin: undefined
        };
        
        setAgents(prev => [...prev, newAgent]);
        setModal(null);
        toast({
          title: "Agent created successfully",
          description: `${agentData.firstName} ${agentData.lastName} has been added.`,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error creating agent",
          description: "Failed to create agent. Please try again.",
        });
      }
    } catch (error: unknown) {
      console.error('Error creating agent:', error);
      
      // Extract specific error message from the error object
      let errorMessage = 'Error creating agent. Please check the form data and try again.';
      
      if ((error as { response?: { data?: { message?: string } } })?.response?.data?.message) {
        errorMessage = (error as { response: { data: { message: string } } }).response.data.message;
      } else if ((error as { response?: { data?: { error?: string } } })?.response?.data?.error) {
        errorMessage = (error as { response: { data: { error: string } } }).response.data.error;
      } else if ((error as { message?: string })?.message) {
        errorMessage = (error as { message: string }).message;
      }
      
      toast({
        variant: "destructive",
        title: "Error creating agent",
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdateAgent(agentData: { firstName: string; lastName: string; email: string; phoneNumber: string }) {
    if (!modal?.agent) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Call the API to update the agent
      await editUser(modal.agent.id, {
        first_name: agentData.firstName,
        last_name: agentData.lastName,
        email: agentData.email,
        phone: agentData.phoneNumber,
        role: "agent"
      });
      
      // Update the local state
      const updatedAgent: Agent = {
        ...modal.agent,
        firstName: agentData.firstName,
        lastName: agentData.lastName,
        email: agentData.email,
        phone: agentData.phoneNumber,
      };
      
      setAgents(prev => prev.map(agent => 
        agent.id === modal.agent!.id ? updatedAgent : agent
      ));
      setModal(null);
      
      toast({
        title: "Agent updated",
        description: `${agentData.firstName} ${agentData.lastName} has been updated successfully.`,
      });
    } catch (err) {
      console.error('Failed to update agent:', err);
      setError('Failed to update agent. Please try again.');
      toast({
        variant: "destructive",
        title: "Error updating agent",
        description: "Failed to update agent. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleToggleStatus(agentId: string) {
    const agent = agents.find(a => a.id === agentId);
    if (!agent) return;

    const action = agent.disabled ? 'enable' : 'disable';
    const confirmed = window.confirm(
      `Are you sure you want to ${action} ${agent.firstName} ${agent.lastName}?`
    );

    if (!confirmed) return;

    try {
      setLoading(true);
      setError(null);
      
      // Call the API to disable/enable the agent
      await disableUser(agentId);
      
      // Update the local state
      setAgents(prev => prev.map(agent => 
        agent.id === agentId 
          ? { ...agent, disabled: !agent.disabled, status: agent.disabled ? "active" : "inactive" }
          : agent
      ));
    } catch (err) {
      console.error('Failed to toggle agent status:', err);
      setError('Failed to update agent status. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function handleToggleExpanded(agentId: string) {
    setExpandedRows(prev => 
      prev.includes(agentId) 
        ? prev.filter(id => id !== agentId)
        : [...prev, agentId]
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Agents</h1>
        </div>
        <Button onClick={() => setModal({ mode: "create" })} disabled={loading}>
          <Plus className="h-4 w-4 mr-2" />
          {loading ? "Creating..." : "Add Agent"}
        </Button>
      </div>

      <Card>
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
          <div className="flex gap-4 items-center mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name, email and phone..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-10 pr-10 flex-1 h-10 text-sm"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12"></TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email Address</TableHead>
                <TableHead>Phone Number</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(agentsLoading || searchLoading) ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    {searchLoading ? "Searching agents..." : "Loading agents..."}
                  </TableCell>
                </TableRow>
              ) : filteredAgents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    No agents found.
                  </TableCell>
                </TableRow>
              ) : null}
              {!agentsLoading && filteredAgents.map((agent) => (
                <React.Fragment key={agent.id}>
                  <TableRow>
                    <TableCell>
                      <Tooltip content={expandedRows.includes(agent.id) ? "Collapse Details" : "Expand Details"}>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleToggleExpanded(agent.id)}
                        >
                          {expandedRows.includes(agent.id) ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </Button>
                      </Tooltip>
                    </TableCell>
                    <TableCell className="font-medium">
                      {agent.firstName} {agent.lastName}
                    </TableCell>
                    <TableCell>{agent.email}</TableCell>
                    <TableCell>{agent.phone}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Tooltip content="Edit Agent">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setModal({ mode: "edit", agent })}
                            className="text-blue-600 hover:text-blue-700"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Tooltip>
                        <Tooltip content={!agent.disabled ? "Disable Agent" : "Enable Agent"}>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleToggleStatus(agent.id)}
                            className={!agent.disabled ? "text-red-500" : "text-green-600"}
                          >
                            {!agent.disabled ? (
                              <X className="h-4 w-4" />
                            ) : (
                              <Check className="h-4 w-4" />
                            )}
                          </Button>
                        </Tooltip>
                      </div>
                    </TableCell>
                  </TableRow>
                  
                  {/* Expanded Row */}
                  {expandedRows.includes(agent.id) && (
                    <TableRow>
                      <TableCell colSpan={5} className="bg-muted/50">
                        <div className="p-3 space-y-2">
                          {/* User Details List */}
                          <ul className="space-y-2 max-w-md">
                            <li className="flex justify-between items-center py-1 border-b border-gray-200">
                              <span className="text-sm font-medium text-gray-600">Email:</span>
                              <span className="text-sm text-gray-900">{agent.email}</span>
                            </li>
                            <li className="flex justify-between items-center py-1 border-b border-gray-200">
                              <span className="text-sm font-medium text-gray-600">Phone:</span>
                              <span className="text-sm text-gray-900">{agent.phone}</span>
                            </li>
                            <li className="flex justify-between items-center py-1 border-b border-gray-200">
                              <span className="text-sm font-medium text-gray-600">Assigned Claims:</span>
                              <span className="text-sm font-bold text-blue-600">{agent.assignedClaims.length}</span>
                            </li>
                            <li className="flex justify-between items-center py-1 border-b border-gray-200">
                              <span className="text-sm font-medium text-gray-600">Completed Claims:</span>
                              <span className="text-sm font-bold text-green-600">{agent.completedClaims.length}</span>
                            </li>
                            <li className="flex justify-between items-center py-1 border-b border-gray-200">
                              <span className="text-sm font-medium text-gray-600">Last Login:</span>
                              <span className="text-sm text-gray-900">
                                {agent.lastLogin ? formatDateTime(agent.lastLogin) : 'Never'}
                              </span>
                            </li>
                            <li className="flex justify-between items-center py-1">
                              <span className="text-sm font-medium text-gray-600">Date Created:</span>
                              <span className="text-sm text-gray-900">
                                {formatDate(agent.createdAt)}
                              </span>
                            </li>
                          </ul>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Expanded Agent View */}
      {expandedAgent && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Agent Details</h3>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setExpandedAgent(null)}
            >
              Close
            </Button>
          </div>
          
          <div className="space-y-2">
            <div className="text-sm">
              <span className="text-gray-600">Assigned Claims: </span>
              <span className="text-blue-600 font-medium">
                {expandedAgent.assignedClaims?.length || 0}
              </span>
            </div>
            
            <div className="text-sm">
              <span className="text-gray-600">Completed Claims: </span>
              <span className="text-green-600 font-medium">
                {expandedAgent.completedClaims?.length || 0}
              </span>
            </div>
            
            <div className="text-sm">
              <span className="text-gray-600">Date Created: </span>
              <span className="text-gray-900">
                {new Date(expandedAgent.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
          </div>
        </div>
      )}


      {modal && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
          <div className="bg-white rounded shadow-lg p-6 w-full max-w-md relative max-h-[90vh] overflow-y-auto">
            <Button
              size="icon"
              variant="ghost"
              className="absolute top-2 right-2"
              onClick={() => setModal(null)}
            >
              ×
            </Button>

            <h3 className="text-lg font-semibold mb-4">
              {modal.mode === "create" ? "Add New Agent" : "Edit Agent"}
            </h3>
            
            <AgentForm
              agent={modal.agent}
              onSubmit={modal.mode === "create" ? handleCreateAgent : handleUpdateAgent}
              onCancel={() => setModal(null)}
              loading={loading}
            />
          </div>
        </div>
      )}
    </div>
  );
} 