"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AgentForm from "./AgentForm";
import type { Agent } from "@/lib/types/user";

const initialMockAgents: Agent[] = [
  {
    id: "1",
    email: "agent1@banyan.com",
    firstName: "Alice",
    lastName: "Johnson",
    phone: "+2348012345678",
    status: "active",
    createdAt: "2024-01-15",
    lastLogin: "2024-01-20T10:30:00Z",
    role: "agent",
    employeeId: "EMP001",
    department: "Claims",
    supervisor: "John Doe",
    assignedClaims: ["CLM001", "CLM002"],
    performanceRating: 4.5,
    specializations: ["Auto", "Property"],
  },
  {
    id: "2",
    email: "agent2@banyan.com",
    firstName: "Bob",
    lastName: "Wilson",
    phone: "+2348098765432",
    status: "active",
    createdAt: "2024-01-10",
    lastLogin: "2024-01-19T14:20:00Z",
    role: "agent",
    employeeId: "EMP002",
    department: "Customer Service",
    supervisor: "Jane Smith",
    assignedClaims: ["CLM003"],
    performanceRating: 4.2,
    specializations: ["Health"],
  },
];

const mockSpecializations = ["Auto", "Property", "Health", "Life", "Business", "Travel"];

export default function AgentsClient() {
  const [agents, setAgents] = useState<Agent[]>(initialMockAgents);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [modal, setModal] = useState<{ mode: "add" | "edit" | "view"; agent: Agent | null } | null>(null);

  const filtered = agents.filter((agent) => {
    const matchesSearch = 
      agent.firstName.toLowerCase().includes(search.toLowerCase()) ||
      agent.lastName.toLowerCase().includes(search.toLowerCase()) ||
      agent.email.toLowerCase().includes(search.toLowerCase()) ||
      agent.employeeId.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || agent.status === statusFilter;
    const matchesDepartment = departmentFilter === "all" || agent.department === departmentFilter;
    return matchesSearch && matchesStatus && matchesDepartment;
  });

  function handleAdd(newAgent: Omit<Agent, "id" | "createdAt">) {
    setAgents((prev) => [
      { 
        ...newAgent, 
        id: (Math.random() * 100000).toFixed(0),
        createdAt: new Date().toISOString().split('T')[0]
      },
      ...prev,
    ]);
    setModal(null);
  }

  function handleEdit(updated: Omit<Agent, "id" | "createdAt">) {
    setAgents((prev) => prev.map((agent) => 
      agent.id === modal?.agent?.id ? { ...agent, ...updated } : agent
    ));
    setModal(null);
  }

  function getPerformanceColor(rating?: number) {
    if (!rating) return "secondary";
    if (rating >= 4.5) return "default";
    if (rating >= 4.0) return "outline";
    return "destructive";
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Agents</h2>
        <Button onClick={() => setModal({ mode: "add", agent: null })}>Add Agent</Button>
      </div>
      
      <div className="flex gap-4 items-center">
        <Input
          placeholder="Search by name, email, or employee ID..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-64"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="suspended">Suspended</SelectItem>
          </SelectContent>
        </Select>
        <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            <SelectItem value="Claims">Claims</SelectItem>
            <SelectItem value="Customer Service">Customer Service</SelectItem>
            <SelectItem value="Sales">Sales</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Employee ID</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Specializations</TableHead>
              <TableHead>Assigned Claims</TableHead>
              <TableHead>Performance</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-muted-foreground">
                  No agents found.
                </TableCell>
              </TableRow>
            )}
            {filtered.map((agent) => (
              <TableRow key={agent.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{agent.firstName} {agent.lastName}</div>
                    <div className="text-sm text-muted-foreground">{agent.email}</div>
                  </div>
                </TableCell>
                <TableCell>{agent.employeeId}</TableCell>
                <TableCell>{agent.department}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {agent.specializations.map(spec => (
                      <Badge key={spec} variant="outline" className="text-xs">{spec}</Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">{agent.assignedClaims.length} claims</Badge>
                </TableCell>
                <TableCell>
                  {agent.performanceRating ? (
                    <Badge variant={getPerformanceColor(agent.performanceRating)}>
                      {agent.performanceRating}/5.0
                    </Badge>
                  ) : (
                    <span className="text-muted-foreground">N/A</span>
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant={agent.status === "active" ? "default" : "secondary"}>
                    {agent.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button size="sm" variant="outline" onClick={() => setModal({ mode: "view", agent })}>
                    View
                  </Button>
                  <Button size="sm" variant="outline" className="ml-2" onClick={() => setModal({ mode: "edit", agent })}>
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {modal && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
          <div className="bg-white rounded shadow-lg p-6 w-full max-w-2xl relative max-h-[90vh] overflow-y-auto">
            <Button size="icon" variant="ghost" className="absolute top-2 right-2" onClick={() => setModal(null)}>
              ×
            </Button>
            {modal.mode === "add" && (
              <>
                <h3 className="text-lg font-semibold mb-4">Add Agent</h3>
                <AgentForm
                  initialData={{}}
                  onSave={handleAdd}
                  onCancel={() => setModal(null)}
                  specializations={mockSpecializations}
                />
              </>
            )}
            {modal.mode === "edit" && (
              <>
                <h3 className="text-lg font-semibold mb-4">Edit Agent</h3>
                <AgentForm
                  initialData={modal.agent!}
                  onSave={handleEdit}
                  onCancel={() => setModal(null)}
                  specializations={mockSpecializations}
                />
              </>
            )}
            {modal.mode === "view" && (
              <>
                <h3 className="text-lg font-semibold mb-4">Agent Details</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="font-medium">Name:</span> {modal.agent!.firstName} {modal.agent!.lastName}
                    </div>
                    <div>
                      <span className="font-medium">Employee ID:</span> {modal.agent!.employeeId}
                    </div>
                    <div>
                      <span className="font-medium">Email:</span> {modal.agent!.email}
                    </div>
                    <div>
                      <span className="font-medium">Phone:</span> {modal.agent!.phone}
                    </div>
                    <div>
                      <span className="font-medium">Department:</span> {modal.agent!.department}
                    </div>
                    <div>
                      <span className="font-medium">Supervisor:</span> {modal.agent!.supervisor || "N/A"}
                    </div>
                    <div>
                      <span className="font-medium">Status:</span> 
                      <Badge variant={modal.agent!.status === "active" ? "default" : "secondary"} className="ml-2">
                        {modal.agent!.status}
                      </Badge>
                    </div>
                    <div>
                      <span className="font-medium">Performance Rating:</span> 
                      {modal.agent!.performanceRating ? (
                        <Badge variant={getPerformanceColor(modal.agent!.performanceRating)} className="ml-2">
                          {modal.agent!.performanceRating}/5.0
                        </Badge>
                      ) : (
                        <span className="ml-2 text-muted-foreground">N/A</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <span className="font-medium">Specializations:</span>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {modal.agent!.specializations.map(spec => (
                        <Badge key={spec} variant="outline">{spec}</Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="font-medium">Assigned Claims:</span>
                    <div className="mt-2">
                      {modal.agent!.assignedClaims.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {modal.agent!.assignedClaims.map(claim => (
                            <Badge key={claim} variant="secondary">{claim}</Badge>
                          ))}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">No claims assigned</span>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="font-medium">Created:</span> {modal.agent!.createdAt}
                    </div>
                    <div>
                      <span className="font-medium">Last Login:</span> {modal.agent!.lastLogin ? new Date(modal.agent!.lastLogin).toLocaleString() : "Never"}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 justify-end mt-6">
                  <Button variant="outline" onClick={() => setModal(null)}>Close</Button>
                  <Button onClick={() => setModal({ mode: "edit", agent: modal.agent })}>Edit</Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 