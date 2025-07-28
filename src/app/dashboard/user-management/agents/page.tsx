"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Eye, Edit, UserX, ChevronDown, ChevronRight } from "lucide-react";
import AgentForm from "./AgentForm";
import { Tooltip } from "@/components/ui/tooltip";

// Mock agent data
const mockAgents = [
  {
    id: "1",
    firstName: "Sarah",
    lastName: "Johnson",
    email: "sarah.johnson@company.com",
    phoneNumber: "+2348012345678",
    bvn: "12345678901",
    bankName: "First Bank of Nigeria",
    accountNumber: "1234567890",
    accountName: "Sarah Johnson",
    claimsAssigned: 12,
    claimsCompleted: 8,
    status: "active",
    lastLoginDate: new Date("2024-01-20T08:15:00"),
  },
  {
    id: "2",
    firstName: "Michael",
    lastName: "Chen",
    email: "michael.chen@company.com",
    phoneNumber: "+2348098765432",
    bvn: "98765432109",
    bankName: "Zenith Bank",
    accountNumber: "0987654321",
    accountName: "Michael Chen",
    claimsAssigned: 8,
    claimsCompleted: 6,
    status: "active",
    lastLoginDate: new Date("2024-01-19T16:30:00"),
  },
  {
    id: "3",
    firstName: "Emily",
    lastName: "Davis",
    email: "emily.davis@company.com",
    phoneNumber: "+2348055555555",
    bvn: "55555555555",
    bankName: "GT Bank",
    accountNumber: "5555555555",
    accountName: "Emily Davis",
    claimsAssigned: 15,
    claimsCompleted: 12,
    status: "active",
    lastLoginDate: new Date("2024-01-18T11:45:00"),
  },
];

export default function AgentsPage() {
  const [agents, setAgents] = useState(mockAgents);
  const [modal, setModal] = useState<{ mode: "create" | "edit"; agent?: typeof mockAgents[0] } | null>(null);
  const [expandedRows, setExpandedRows] = useState<string[]>([]);
  const [search, setSearch] = useState("");

  const filteredAgents = agents.filter((agent) =>
    agent.firstName.toLowerCase().includes(search.toLowerCase()) ||
    agent.lastName.toLowerCase().includes(search.toLowerCase()) ||
    agent.email.toLowerCase().includes(search.toLowerCase())
  );

  function handleCreateAgent(newAgent: Omit<typeof agents[0], "id">) {
    const agent = {
      ...newAgent,
      id: (Math.random() * 100000).toFixed(0),
      claimsAssigned: 0,
      claimsCompleted: 0,
      status: "active",
    };
    setAgents([agent, ...agents]);
    setModal(null);
  }

  function handleUpdateAgent(updatedAgent: Omit<typeof agents[0], "id">) {
    setAgents(prev => prev.map(agent => 
      agent.id === modal?.agent?.id 
        ? { ...agent, ...updatedAgent }
        : agent
    ));
    setModal(null);
  }

  function handleToggleStatus(agentId: string) {
    setAgents(prev => prev.map(agent => 
      agent.id === agentId 
        ? { ...agent, status: agent.status === "active" ? "disabled" : "active" }
        : agent
    ));
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
        <Button onClick={() => setModal({ mode: "create" })}>
          <Plus className="h-4 w-4 mr-2" />
          Add Agent
        </Button>
      </div>

      <div className="flex gap-4 items-center">
        <Input
          placeholder="Search by name or email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-64"
        />
      </div>

      <Card>
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
              {filteredAgents.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    No agents found.
                  </TableCell>
                </TableRow>
              )}
              {filteredAgents.map((agent) => (
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
                    <TableCell>{agent.phoneNumber}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Tooltip content="View Details">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleToggleExpanded(agent.id)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Tooltip>
                        <Tooltip content="Edit Agent">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setModal({ mode: "edit", agent })}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Tooltip>
                        <Tooltip content={agent.status === "active" ? "Disable Agent" : "Enable Agent"}>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleToggleStatus(agent.id)}
                            className={agent.status === "disabled" ? "text-red-500" : ""}
                          >
                            <UserX className="h-4 w-4" />
                          </Button>
                        </Tooltip>
                      </div>
                    </TableCell>
                  </TableRow>
                  
                  {/* Expanded Row */}
                  {expandedRows.includes(agent.id) && (
                    <TableRow>
                      <TableCell colSpan={5} className="bg-muted/50">
                        <div className="p-4 space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div>
                              <h4 className="font-medium text-sm text-muted-foreground mb-1">Claims Summary</h4>
                              <div className="space-y-1">
                                <div className="flex justify-between">
                                  <span className="text-sm">Assigned:</span>
                                  <Badge variant="secondary">{agent.claimsAssigned}</Badge>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm">Completed:</span>
                                  <Badge variant="default">{agent.claimsCompleted}</Badge>
                                </div>
                              </div>
                            </div>
                            
                            <div>
                              <h4 className="font-medium text-sm text-muted-foreground mb-1">BVN</h4>
                              <p className="text-sm font-mono">{agent.bvn}</p>
                            </div>
                            
                            <div>
                              <h4 className="font-medium text-sm text-muted-foreground mb-1">Bank Details</h4>
                              <div className="space-y-1 text-sm">
                                <div><span className="font-medium">Bank:</span> {agent.bankName}</div>
                                <div><span className="font-medium">Account:</span> {agent.accountNumber}</div>
                                <div><span className="font-medium">Name:</span> {agent.accountName}</div>
                              </div>
                            </div>
                            
                            <div>
                              <h4 className="font-medium text-sm text-muted-foreground mb-1">Status</h4>
                              <Badge variant={agent.status === "active" ? "default" : "secondary"}>
                                {agent.status === "active" ? "Active" : "Disabled"}
                              </Badge>
                            </div>
                            
                            <div>
                              <h4 className="font-medium text-sm text-muted-foreground mb-1">Last Login</h4>
                              <p className="text-sm">
                                {agent.lastLoginDate 
                                  ? `${agent.lastLoginDate.toLocaleDateString()} at ${agent.lastLoginDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`
                                  : "Never logged in"
                                }
                              </p>
                            </div>
                          </div>
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

      {modal && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
          <div className="bg-white rounded shadow-lg p-6 w-full max-w-md relative">
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
            />
          </div>
        </div>
      )}
    </div>
  );
} 