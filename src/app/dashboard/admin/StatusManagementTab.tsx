"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip } from "@/components/ui/tooltip";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Eye, Edit, BarChart3, Workflow } from "lucide-react";

// Mock data for status management
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
  {
    id: "4",
    statusName: "Rejected",
    statusCode: "REJ",
    category: "Resolved",
    description: "Claim rejected",
    usageCount: 123,
    lastUsed: new Date(Date.now() - 24 * 60 * 60 * 1000),
    workflow: "Standard",
    requiresApproval: true,
    autoNotification: true,
    triggersWorkflow: false,
  },
  {
    id: "5",
    statusName: "Pending Documents",
    statusCode: "PDOC",
    category: "Active",
    description: "Waiting for additional documents",
    usageCount: 234,
    lastUsed: new Date(),
    workflow: "Standard",
    requiresApproval: false,
    autoNotification: true,
    triggersWorkflow: false,
  },
];

const mockWorkflows = [
  {
    id: "1",
    name: "Standard",
    claimTypes: ["Motor", "Property", "Fire", "Health"],
    statusSequence: ["Submitted", "Under Review", "Pending Documents", "Approved", "Rejected"],
  },
  {
    id: "2",
    name: "Express",
    claimTypes: ["Motor"],
    statusSequence: ["Submitted", "Under Review", "Approved", "Rejected"],
  },
  {
    id: "3",
    name: "Complex",
    claimTypes: ["Fire", "Property"],
    statusSequence: ["Submitted", "Under Review", "Pending Documents", "Expert Review", "Approved", "Rejected"],
  },
];

export default function StatusManagementTab() {
  const [statuses, setStatuses] = useState(mockStatuses);
  const [workflows, setWorkflows] = useState(mockWorkflows);
  const [modal, setModal] = useState<{ mode: "create-status" | "create-workflow" | "view" | "edit" | "analytics"; status?: typeof mockStatuses[0]; workflow?: typeof mockWorkflows[0] } | null>(null);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const filteredStatuses = statuses.filter((status) => {
    const matchesSearch = 
      status.statusName.toLowerCase().includes(search.toLowerCase()) ||
      status.statusCode.toLowerCase().includes(search.toLowerCase());
    
    const matchesCategory = categoryFilter === "all" || status.category.toLowerCase() === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  function getCategoryBadge(category: string) {
    const config = {
      Active: { label: "Active", variant: "default" as const },
      Pending: { label: "Pending", variant: "secondary" as const },
      Resolved: { label: "Resolved", variant: "outline" as const },
    };
    
    const badgeConfig = config[category as keyof typeof config] || config.Active;
    return <Badge variant={badgeConfig.variant}>{badgeConfig.label}</Badge>;
  }

  function handleCreateStatus(newStatus: typeof mockStatuses[0]) {
    const status = {
      ...newStatus,
      id: (Math.random() * 100000).toFixed(0),
      usageCount: 0,
      lastUsed: new Date(),
    };
    setStatuses([status, ...statuses]);
    setModal(null);
  }

  function handleCreateWorkflow(newWorkflow: typeof mockWorkflows[0]) {
    const workflow = {
      ...newWorkflow,
      id: (Math.random() * 100000).toFixed(0),
    };
    setWorkflows([workflow, ...workflows]);
    setModal(null);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Status Management</h2>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setModal({ mode: "create-status" })}>
            <Plus className="h-4 w-4 mr-2" />
            Create Status
          </Button>
          <Button variant="outline" onClick={() => setModal({ mode: "create-workflow" })}>
            <Workflow className="h-4 w-4 mr-2" />
            Create Workflow
          </Button>
        </div>
      </div>

      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
          <Input
            placeholder="Search by status name or code..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold">Current Statuses List</h3>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Status Name</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Usage Count</TableHead>
                <TableHead>Last Used</TableHead>
                <TableHead>Workflow</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStatuses.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground">
                    No statuses found.
                  </TableCell>
                </TableRow>
              )}
              {filteredStatuses.map((status) => (
                <TableRow key={status.id}>
                  <TableCell className="font-medium">{status.statusName}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{status.statusCode}</Badge>
                  </TableCell>
                  <TableCell>{getCategoryBadge(status.category)}</TableCell>
                  <TableCell>{status.usageCount.toLocaleString()}</TableCell>
                  <TableCell>
                    {status.lastUsed.toLocaleDateString()}
                    <div className="text-xs text-muted-foreground">
                      {status.lastUsed.toLocaleTimeString()}
                    </div>
                  </TableCell>
                  <TableCell>{status.workflow}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Tooltip content="View Details">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setModal({ mode: "view", status })}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Tooltip>
                      <Tooltip content="Edit Status">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setModal({ mode: "edit", status })}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Tooltip>
                      <Tooltip content="View Analytics">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setModal({ mode: "analytics", status })}
                        >
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
      </Card>

      {/* Status Workflow Diagram */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Status Workflow Diagram</h3>
        <div className="space-y-4">
          {workflows.map((workflow) => (
            <div key={workflow.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium">{workflow.name} Workflow</h4>
                <Badge variant="outline">{workflow.claimTypes.join(", ")}</Badge>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {workflow.statusSequence.map((status, index) => (
                  <div key={status} className="flex items-center">
                    <Badge variant="secondary">{status}</Badge>
                    {index < workflow.statusSequence.length - 1 && (
                      <div className="w-8 h-0.5 bg-muted mx-2"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {modal && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
          <div className="bg-white rounded shadow-lg p-6 w-full max-w-4xl relative max-h-[90vh] overflow-y-auto">
            <Button
              size="icon"
              variant="ghost"
              className="absolute top-2 right-2"
              onClick={() => setModal(null)}
            >
              ×
            </Button>

            {modal.mode === "create-status" && (
              <>
                <h3 className="text-lg font-semibold mb-4">Create New Status</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Status Name</label>
                      <Input placeholder="e.g., Under Review" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Status Code</label>
                      <Input placeholder="e.g., URV" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Category</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Resolved">Resolved</SelectItem>
                        <SelectItem value="Cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Description</label>
                    <Textarea placeholder="Describe what this status represents..." />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Status Behavior</label>
                    <div className="space-y-2 mt-2">
                      <label className="flex items-center space-x-2">
                        <Checkbox />
                        <span>Requires approval to enter</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <Checkbox defaultChecked />
                        <span>Auto-notification to client</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <Checkbox defaultChecked />
                        <span>Auto-notification to agent</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <Checkbox defaultChecked />
                        <span>Triggers workflow actions</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <Checkbox />
                        <span>Requires documentation</span>
                      </label>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 justify-end">
                    <Button variant="outline" onClick={() => setModal(null)}>
                      Cancel
                    </Button>
                    <Button onClick={() => handleCreateStatus({
                      id: "",
                      statusName: "New Status",
                      statusCode: "NEW",
                      category: "Active",
                      description: "New status description",
                      usageCount: 0,
                      lastUsed: new Date(),
                      workflow: "Standard",
                      requiresApproval: false,
                      autoNotification: true,
                      triggersWorkflow: true
                    })}>
                      Create Status
                    </Button>
                  </div>
                </div>
              </>
            )}

            {modal.mode === "create-workflow" && (
              <>
                <h3 className="text-lg font-semibold mb-4">Create Status Workflow</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Workflow Name</label>
                    <Input placeholder="e.g., Express Claims" />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Claim Types</label>
                    <div className="flex gap-2 mt-2">
                      {["Motor", "Property", "Fire", "Health"].map((type) => (
                        <label key={type} className="flex items-center space-x-2">
                          <Checkbox />
                          <span>{type}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Status Sequence</label>
                    <p className="text-sm text-muted-foreground mb-2">
                      Drag and drop to reorder statuses in the workflow
                    </p>
                    <div className="border rounded-lg p-4 space-y-2">
                      {["Submitted", "Under Review", "Approved", "Rejected"].map((status, index) => (
                        <div key={status} className="flex items-center justify-between p-2 bg-muted rounded">
                          <span>{index + 1}. {status}</span>
                          <div className="flex gap-1">
                            <Button size="sm" variant="outline">↑</Button>
                            <Button size="sm" variant="outline">↓</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex gap-2 justify-end">
                    <Button variant="outline" onClick={() => setModal(null)}>
                      Cancel
                    </Button>
                    <Button onClick={() => handleCreateWorkflow({
                      id: "",
                      name: "New Workflow",
                      claimTypes: ["Motor"],
                      statusSequence: ["Submitted", "Under Review", "Approved", "Rejected"]
                    })}>
                      Create Workflow
                    </Button>
                  </div>
                </div>
              </>
            )}

            {modal.mode === "view" && modal.status && (
              <>
                <h3 className="text-lg font-semibold mb-4">Status Detail View</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="font-medium">Status Name:</span> {modal.status.statusName}
                    </div>
                    <div>
                      <span className="font-medium">Status Code:</span> {modal.status.statusCode}
                    </div>
                    <div>
                      <span className="font-medium">Category:</span> {getCategoryBadge(modal.status.category)}
                    </div>
                    <div>
                      <span className="font-medium">Usage Count:</span> {modal.status.usageCount.toLocaleString()}
                    </div>
                    <div>
                      <span className="font-medium">Last Used:</span> {modal.status.lastUsed.toLocaleDateString()}
                    </div>
                    <div>
                      <span className="font-medium">Workflow:</span> {modal.status.workflow}
                    </div>
                  </div>
                  
                  <div>
                    <span className="font-medium">Description:</span>
                    <p className="mt-1 text-sm text-muted-foreground">{modal.status.description}</p>
                  </div>
                  
                  <div>
                    <span className="font-medium">Behavior Settings:</span>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <div className="flex items-center gap-2">
                        <Checkbox checked={modal.status.requiresApproval} disabled />
                        <span className="text-sm">Requires approval</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox checked={modal.status.autoNotification} disabled />
                        <span className="text-sm">Auto notification</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox checked={modal.status.triggersWorkflow} disabled />
                        <span className="text-sm">Triggers workflow</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 justify-end">
                    <Button variant="outline" onClick={() => setModal(null)}>
                      Close
                    </Button>
                    <Button onClick={() => setModal({ mode: "edit", status: modal.status })}>
                      Edit Status
                    </Button>
                  </div>
                </div>
              </>
            )}

            {modal.mode === "edit" && modal.status && (
              <>
                <h3 className="text-lg font-semibold mb-4">Edit Status Configuration</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Status Name</label>
                      <Input defaultValue={modal.status.statusName} />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Status Code</label>
                      <Input defaultValue={modal.status.statusCode} />
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Category</label>
                    <Select defaultValue={modal.status.category}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Resolved">Resolved</SelectItem>
                        <SelectItem value="Cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Description</label>
                    <Textarea defaultValue={modal.status.description} />
                  </div>
                  
                  <div className="flex gap-2 justify-end">
                    <Button variant="outline" onClick={() => setModal(null)}>
                      Cancel
                    </Button>
                    <Button>
                      Save Changes
                    </Button>
                  </div>
                </div>
              </>
            )}

            {modal.mode === "analytics" && modal.status && (
              <>
                <h3 className="text-lg font-semibold mb-4">Status Analytics</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="font-medium">Usage Statistics:</span>
                      <div className="mt-2 text-sm text-muted-foreground">
                        Total Usage: {modal.status.usageCount.toLocaleString()}<br />
                        Last 30 days: 45<br />
                        Last 7 days: 12
                      </div>
                    </div>
                    <div>
                      <span className="font-medium">Average Duration:</span>
                      <div className="mt-2 text-sm text-muted-foreground">
                        Time in status: 2.3 days<br />
                        Min duration: 0.5 days<br />
                        Max duration: 15.2 days
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <span className="font-medium">Transition Patterns:</span>
                    <div className="mt-2 space-y-1 text-sm">
                      <div>From &quot;Submitted&quot;: 67%</div>
                      <div>To &quot;Under Review&quot;: 45%</div>
                      <div>To &quot;Approved&quot;: 23%</div>
                      <div>To &quot;Rejected&quot;: 12%</div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 justify-end">
                    <Button variant="outline" onClick={() => setModal(null)}>
                      Close
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