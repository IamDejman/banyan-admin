"use client";
import React, { useState } from "react";
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
  Settings, 
  Plus, 
  Eye, 
  Edit, 
  RotateCcw, 
  Search, 
  Upload,
  TrendingUp,
  AlertTriangle,
  Workflow
} from "lucide-react";

// Mock data for assignments
const mockAssignments = [
  {
    id: "1",
    claimId: "CLM-001",
    clientName: "John Doe",
    claimType: "Motor",
    assignedAgent: "Sarah K.",
    dateAssigned: new Date("2024-01-28"),
    dueDate: new Date("2024-02-05"),
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
    dueDate: new Date("2024-02-03"),
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
    dueDate: new Date("2024-02-02"),
    status: "Active",
    assignmentReason: "New claim",
    specialInstructions: "",
  },
];

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

// Mock data for statuses
const mockStatuses = [
  {
    id: "1",
    statusName: "Submitted",
    statusCode: "SUB",
    category: "Active",
    description: "Initial claim submission",
    usageCount: 1245,
    lastUsed: new Date(),
    workflow: "Standard",
    requiresApproval: false,
    autoNotification: true,
    triggersWorkflow: true,
  },
  {
    id: "2",
    statusName: "Under Review",
    statusCode: "URV",
    category: "Active",
    description: "Claim under agent review",
    usageCount: 892,
    lastUsed: new Date(),
    workflow: "Standard",
    requiresApproval: false,
    autoNotification: true,
    triggersWorkflow: true,
  },
  {
    id: "3",
    statusName: "Approved",
    statusCode: "APP",
    category: "Active",
    description: "Claim approved for processing",
    usageCount: 567,
    lastUsed: new Date(),
    workflow: "Standard",
    requiresApproval: true,
    autoNotification: true,
    triggersWorkflow: true,
  },
];

export default function AdminPage() {
  const [assignments] = useState(mockAssignments);
  const [workloads] = useState(mockAgentWorkloads);
  const [statuses] = useState(mockStatuses);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const filteredAssignments = assignments.filter((assignment) => {
    const matchesSearch = 
      assignment.claimId.toLowerCase().includes(search.toLowerCase()) ||
      assignment.clientName.toLowerCase().includes(search.toLowerCase()) ||
      assignment.assignedAgent.toLowerCase().includes(search.toLowerCase());
    
    const matchesFilter = filter === "all" || assignment.status.toLowerCase() === filter;
    
    return matchesSearch && matchesFilter;
  });

  const filteredWorkloads = workloads.filter((workload) => {
    const matchesSearch = workload.agentName.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || workload.status.toLowerCase() === filter;
    return matchesSearch && matchesFilter;
  });

  const filteredStatuses = statuses.filter((status) => {
    const matchesSearch = 
      status.statusName.toLowerCase().includes(search.toLowerCase()) ||
      status.statusCode.toLowerCase().includes(search.toLowerCase());
    
    const matchesFilter = filter === "all" || status.category.toLowerCase() === filter;
    
    return matchesSearch && matchesFilter;
  });

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
    return <Badge variant={badgeConfig.variant}>{badgeConfig.label}</Badge>;
  }

  function getWorkloadPercentage(activeClaims: number, maxClaims: number) {
    return Math.min((activeClaims / maxClaims) * 100, 100);
  }

  function getWorkloadColor(percentage: number) {
    if (percentage >= 90) return "bg-red-500";
    if (percentage >= 75) return "bg-yellow-500";
    return "bg-green-500";
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Management</h1>
        <p className="text-muted-foreground">Manage claim assignments, agent workloads, and status configurations</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Assignments</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{assignments.filter(a => a.status === "Active").length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Agents</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{workloads.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue Claims</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {workloads.reduce((sum, w) => sum + w.overdueClaims, 0)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status Types</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statuses.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-6">
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
        </CardContent>
      </Card>

      {/* Claim Assignments Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              <CardTitle>Claim Assignments</CardTitle>
            </div>
            <div className="flex gap-2">
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                New Assignment
              </Button>
              <Button variant="outline" size="sm">
                <Upload className="h-4 w-4 mr-2" />
                Bulk Assign
              </Button>
            </div>
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
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAssignments.map((assignment) => (
                  <TableRow key={assignment.id}>
                    <TableCell className="font-medium">{assignment.claimId}</TableCell>
                    <TableCell>{assignment.clientName}</TableCell>
                    <TableCell>{assignment.claimType}</TableCell>
                    <TableCell>{assignment.assignedAgent}</TableCell>
                    <TableCell>{assignment.dueDate.toLocaleDateString()}</TableCell>
                    <TableCell>{getStatusBadge(assignment.status)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Tooltip content="View Details">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Tooltip>
                        <Tooltip content="Reassign">
                          <Button size="sm" variant="outline">
                            <RotateCcw className="h-4 w-4" />
                          </Button>
                        </Tooltip>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Agent Workload Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              <CardTitle>Agent Workload</CardTitle>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <RotateCcw className="h-4 w-4 mr-2" />
                Rebalance
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Rules
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Agent</TableHead>
                  <TableHead>Active Claims</TableHead>
                  <TableHead>Overdue</TableHead>
                  <TableHead>Performance</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredWorkloads.map((workload) => {
                  const workloadPercentage = getWorkloadPercentage(workload.activeClaims, workload.maxClaims);
                  return (
                    <TableRow key={workload.id}>
                      <TableCell className="font-medium">{workload.agentName}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span>{workload.activeClaims}</span>
                          <div className="w-20 bg-muted rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${getWorkloadColor(workloadPercentage)}`}
                              style={{ width: `${workloadPercentage}%` }}
                            ></div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {workload.overdueClaims > 0 ? (
                          <Badge variant="destructive">{workload.overdueClaims}</Badge>
                        ) : (
                          <span className="text-green-600">0</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{workload.performanceScore}%</span>
                          {workload.performanceScore >= 90 && <TrendingUp className="h-4 w-4 text-green-500" />}
                          {workload.performanceScore < 75 && <AlertTriangle className="h-4 w-4 text-red-500" />}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(workload.status)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Tooltip content="View Details">
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Tooltip>
                          <Tooltip content="Edit Settings">
                            <Button size="sm" variant="outline">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Tooltip>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Status Management Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              <CardTitle>Status Management</CardTitle>
            </div>
            <div className="flex gap-2">
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Create Status
              </Button>
              <Button variant="outline" size="sm">
                <Workflow className="h-4 w-4 mr-2" />
                Workflows
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Status Name</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Usage</TableHead>
                  <TableHead>Last Used</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStatuses.map((status) => (
                  <TableRow key={status.id}>
                    <TableCell className="font-medium">{status.statusName}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{status.statusCode}</Badge>
                    </TableCell>
                    <TableCell>{getStatusBadge(status.category)}</TableCell>
                    <TableCell>{status.usageCount.toLocaleString()}</TableCell>
                    <TableCell>{status.lastUsed.toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Tooltip content="View Details">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Tooltip>
                        <Tooltip content="Edit Status">
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Tooltip>
                        <Tooltip content="Analytics">
                          <Button size="sm" variant="outline">
                            <BarChart3 className="h-4 w-4" />
                          </Button>
                        </Tooltip>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 