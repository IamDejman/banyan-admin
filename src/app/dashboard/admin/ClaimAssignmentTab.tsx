"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip } from "@/components/ui/tooltip";
import { Plus, Eye, Edit, RotateCcw, Search, Download, Upload } from "lucide-react";

// Mock data for claim assignments
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

const mockAgents = [
  { id: "1", name: "Sarah K.", specialization: ["Motor", "Property"], workload: 12 },
  { id: "2", name: "Mike T.", specialization: ["Fire", "Motor"], workload: 18 },
  { id: "3", name: "Lisa M.", specialization: ["Property", "Health"], workload: 8 },
  { id: "4", name: "David L.", specialization: ["Health", "Motor"], workload: 15 },
];

const mockClaims = [
  { id: "CLM-004", clientName: "XYZ Corp", claimType: "Motor", status: "Unassigned" },
  { id: "CLM-005", clientName: "DEF Ltd", claimType: "Fire", status: "Unassigned" },
  { id: "CLM-006", clientName: "Bob Wilson", claimType: "Property", status: "Unassigned" },
];

export default function ClaimAssignmentTab() {
  const [assignments, setAssignments] = useState(mockAssignments);
  const [modal, setModal] = useState<{ mode: "single" | "bulk" | "view" | "edit"; assignment?: typeof mockAssignments[0] } | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredAssignments = assignments.filter((assignment) => {
    const matchesSearch = 
      assignment.claimId.toLowerCase().includes(search.toLowerCase()) ||
      assignment.clientName.toLowerCase().includes(search.toLowerCase()) ||
      assignment.assignedAgent.toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || assignment.status.toLowerCase() === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  function handleCreateAssignment(newAssignment: typeof mockAssignments[0]) {
    const assignment = {
      ...newAssignment,
      id: (Math.random() * 100000).toFixed(0),
      dateAssigned: new Date(),
      status: "Active",
    };
    setAssignments([assignment, ...assignments]);
    setModal(null);
  }

  function handleReassign(assignmentId: string, newAgent: string) {
    setAssignments(prev => prev.map(assignment => 
      assignment.id === assignmentId 
        ? { ...assignment, assignedAgent: newAgent, dateAssigned: new Date() }
        : assignment
    ));
  }

  function getStatusBadge(status: string) {
    const config = {
      Active: { label: "Active", variant: "default" as const },
      Overdue: { label: "Overdue", variant: "destructive" as const },
      Completed: { label: "Completed", variant: "secondary" as const },
    };
    
    const badgeConfig = config[status as keyof typeof config] || config.Active;
    return <Badge variant={badgeConfig.variant}>{badgeConfig.label}</Badge>;
  }

  function getDaysUntilDue(dueDate: Date) {
    const days = Math.ceil((dueDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    if (days < 0) return `${Math.abs(days)} days overdue`;
    if (days === 0) return "Due today";
    if (days === 1) return "Due tomorrow";
    return `${days} days left`;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Claim Assignment</h2>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setModal({ mode: "single" })}>
            <Plus className="h-4 w-4 mr-2" />
            Single Assignment
          </Button>
          <Button variant="outline" onClick={() => setModal({ mode: "bulk" })}>
            <Upload className="h-4 w-4 mr-2" />
            Bulk Assignment
          </Button>
        </div>
      </div>

      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by claim ID, client name, or agent..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="overdue">Overdue</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>

      <Card>
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold">Current Assignments Overview</h3>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Claim ID</TableHead>
                <TableHead>Client Name</TableHead>
                <TableHead>Claim Type</TableHead>
                <TableHead>Assigned Agent</TableHead>
                <TableHead>Date Assigned</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAssignments.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-muted-foreground">
                    No assignments found.
                  </TableCell>
                </TableRow>
              )}
              {filteredAssignments.map((assignment) => (
                <TableRow key={assignment.id}>
                  <TableCell className="font-medium">{assignment.claimId}</TableCell>
                  <TableCell>{assignment.clientName}</TableCell>
                  <TableCell>{assignment.claimType}</TableCell>
                  <TableCell>{assignment.assignedAgent}</TableCell>
                  <TableCell>{assignment.dateAssigned.toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div>
                      <div>{assignment.dueDate.toLocaleDateString()}</div>
                      <div className="text-xs text-muted-foreground">
                        {getDaysUntilDue(assignment.dueDate)}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(assignment.status)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Tooltip content="View Details">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setModal({ mode: "view", assignment })}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Tooltip>
                      <Tooltip content="Edit Assignment">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setModal({ mode: "edit", assignment })}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Tooltip>
                      <Tooltip content="Reassign">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleReassign(assignment.id, "New Agent")}
                        >
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
      </Card>

      {/* Workload Visualization */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Agent Workload Distribution</h3>
          <div className="space-y-3">
            {mockAgents.map((agent) => (
              <div key={agent.id} className="flex items-center justify-between">
                <span>{agent.name}</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full" 
                      style={{ width: `${(agent.workload / 20) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-muted-foreground">{agent.workload} claims</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Assignment Statistics</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {assignments.filter(a => a.status === "Active").length}
              </div>
              <div className="text-sm text-muted-foreground">Active Assignments</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {assignments.filter(a => a.status === "Overdue").length}
              </div>
              <div className="text-sm text-muted-foreground">Overdue Assignments</div>
            </div>
          </div>
        </Card>
      </div>

      {modal && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
          <div className="bg-white rounded shadow-lg p-6 w-full max-w-2xl relative max-h-[90vh] overflow-y-auto">
            <Button
              size="icon"
              variant="ghost"
              className="absolute top-2 right-2"
              onClick={() => setModal(null)}
            >
              ×
            </Button>

            {modal.mode === "single" && (
              <>
                <h3 className="text-lg font-semibold mb-4">New Claim Assignment</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Claim Selection</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a claim" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockClaims.map((claim) => (
                            <SelectItem key={claim.id} value={claim.id}>
                              {claim.id} - {claim.clientName} ({claim.claimType})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Agent Assignment</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an agent" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockAgents.map((agent) => (
                            <SelectItem key={agent.id} value={agent.name}>
                              {agent.name} ({agent.workload} claims)
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Assignment Reason</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select reason" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">New claim</SelectItem>
                          <SelectItem value="reassignment">Reassignment</SelectItem>
                          <SelectItem value="escalation">Escalation</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Due Date</label>
                      <Input type="date" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Special Instructions</label>
                    <textarea className="w-full p-2 border rounded-md" rows={3} placeholder="Any special instructions..."></textarea>
                  </div>
                  
                  <div className="flex gap-2 justify-end">
                    <Button variant="outline" onClick={() => setModal(null)}>
                      Cancel
                    </Button>
                    <Button onClick={() => handleCreateAssignment({
                      id: "",
                      claimId: "CLM-NEW",
                      clientName: "New Client",
                      claimType: "Motor",
                      assignedAgent: "Unassigned",
                      dateAssigned: new Date(),
                      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                      status: "Active",
                      assignmentReason: "New assignment",
                      specialInstructions: ""
                    })}>
                      Assign Claim
                    </Button>
                  </div>
                </div>
              </>
            )}

            {modal.mode === "bulk" && (
              <>
                <h3 className="text-lg font-semibold mb-4">Bulk Assignment</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Assignment Method</label>
                    <div className="space-y-2 mt-2">
                      <label className="flex items-center space-x-2">
                        <input type="radio" name="method" value="round-robin" />
                        <span>Round Robin (equal distribution)</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="radio" name="method" value="workload" />
                        <span>Workload Based (least busy agents first)</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="radio" name="method" value="expertise" />
                        <span>Expertise Based (match claim type to agent skills)</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="radio" name="method" value="manual" />
                        <span>Manual Selection</span>
                      </label>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Available Agents</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select agents" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockAgents.map((agent) => (
                            <SelectItem key={agent.id} value={agent.name}>
                              {agent.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Max Claims per Agent</label>
                      <Input type="number" placeholder="5" />
                    </div>
                  </div>
                  
                  <div className="flex gap-2 justify-end">
                    <Button variant="outline" onClick={() => setModal(null)}>
                      Cancel
                    </Button>
                    <Button>
                      Bulk Assign
                    </Button>
                  </div>
                </div>
              </>
            )}

            {modal.mode === "view" && modal.assignment && (
              <>
                <h3 className="text-lg font-semibold mb-4">Assignment Details</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="font-medium">Claim ID:</span> {modal.assignment.claimId}
                    </div>
                    <div>
                      <span className="font-medium">Client:</span> {modal.assignment.clientName}
                    </div>
                    <div>
                      <span className="font-medium">Claim Type:</span> {modal.assignment.claimType}
                    </div>
                    <div>
                      <span className="font-medium">Assigned Agent:</span> {modal.assignment.assignedAgent}
                    </div>
                    <div>
                      <span className="font-medium">Date Assigned:</span> {modal.assignment.dateAssigned.toLocaleDateString()}
                    </div>
                    <div>
                      <span className="font-medium">Due Date:</span> {modal.assignment.dueDate.toLocaleDateString()}
                    </div>
                    <div>
                      <span className="font-medium">Status:</span> {getStatusBadge(modal.assignment.status)}
                    </div>
                    <div>
                      <span className="font-medium">Reason:</span> {modal.assignment.assignmentReason}
                    </div>
                  </div>
                  
                  {modal.assignment.specialInstructions && (
                    <div>
                      <span className="font-medium">Special Instructions:</span>
                      <p className="mt-1 text-sm text-muted-foreground">{modal.assignment.specialInstructions}</p>
                    </div>
                  )}
                  
                  <div className="flex gap-2 justify-end">
                    <Button variant="outline" onClick={() => setModal(null)}>
                      Close
                    </Button>
                    <Button onClick={() => setModal({ mode: "edit", assignment: modal.assignment })}>
                      Edit Assignment
                    </Button>
                  </div>
                </div>
              </>
            )}

            {modal.mode === "edit" && modal.assignment && (
              <>
                <h3 className="text-lg font-semibold mb-4">Edit Assignment</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Current Agent</label>
                      <Input value={modal.assignment.assignedAgent} readOnly className="bg-muted" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">New Agent</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select new agent" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockAgents.map((agent) => (
                            <SelectItem key={agent.id} value={agent.name}>
                              {agent.name} ({agent.workload} claims)
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Reassignment Reason</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select reason" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="workload">Workload</SelectItem>
                        <SelectItem value="expertise">Expertise</SelectItem>
                        <SelectItem value="agent-request">Agent Request</SelectItem>
                        <SelectItem value="escalation">Escalation</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Transfer Notes</label>
                    <textarea className="w-full p-2 border rounded-md" rows={3} placeholder="Notes about the transfer..."></textarea>
                  </div>
                  
                  <div className="flex gap-2 justify-end">
                    <Button variant="outline" onClick={() => setModal(null)}>
                      Cancel
                    </Button>
                    <Button>
                      Update Assignment
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 