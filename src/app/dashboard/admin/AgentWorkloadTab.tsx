"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip } from "@/components/ui/tooltip";
import { Eye, Edit, BarChart3, RotateCcw, Settings, TrendingUp, AlertTriangle } from "lucide-react";

// Mock data for agent workload
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
  {
    id: "4",
    agentName: "David L.",
    activeClaims: 15,
    overdueClaims: 3,
    avgResolutionTime: 9.1,
    performanceScore: 81,
    status: "Good",
    specialization: ["Health", "Motor"],
    maxClaims: 15,
    availability: "Limited",
  },
];

export default function AgentWorkloadTab() {
  const [workloads] = useState(mockAgentWorkloads);
  const [modal, setModal] = useState<{ mode: "view" | "edit" | "analytics" | "rebalance"; agent?: typeof mockAgentWorkloads[0] } | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredWorkloads = workloads.filter((workload) => {
    const matchesSearch = workload.agentName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || workload.status.toLowerCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  function getStatusBadge(status: string) {
    const config = {
      Excellent: { label: "Excellent", variant: "default" as const, color: "text-green-600" },
      Good: { label: "Good", variant: "secondary" as const, color: "text-blue-600" },
      Alert: { label: "Alert", variant: "destructive" as const, color: "text-red-600" },
    };
    
    const badgeConfig = config[status as keyof typeof config] || config.Good;
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Agent Workload</h2>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setModal({ mode: "rebalance" })}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Rebalance Workload
          </Button>
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Workload Rules
          </Button>
        </div>
      </div>

      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
          <Input
            placeholder="Search by agent name..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="excellent">Excellent</SelectItem>
            <SelectItem value="good">Good</SelectItem>
            <SelectItem value="alert">Alert</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold">Agent Workload Dashboard</h3>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Agent Name</TableHead>
                <TableHead>Active Claims</TableHead>
                <TableHead>Overdue</TableHead>
                <TableHead>Avg Resolution</TableHead>
                <TableHead>Performance Score</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredWorkloads.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground">
                    No agents found.
                  </TableCell>
                </TableRow>
              )}
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
                    <TableCell>{workload.avgResolutionTime} days</TableCell>
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
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setModal({ mode: "view", agent: workload })}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Tooltip>
                        <Tooltip content="Edit Settings">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setModal({ mode: "edit", agent: workload })}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Tooltip>
                        <Tooltip content="View Analytics">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setModal({ mode: "analytics", agent: workload })}
                          >
                            <BarChart3 className="h-4 w-4" />
                          </Button>
                        </Tooltip>
                        {workload.status === "Alert" && (
                          <Tooltip content="Rebalance Workload">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setModal({ mode: "rebalance", agent: workload })}
                            >
                              <RotateCcw className="h-4 w-4" />
                            </Button>
                          </Tooltip>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Performance Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Agents</p>
              <p className="text-2xl font-bold">{workloads.length}</p>
            </div>
            <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Active Claims</p>
              <p className="text-2xl font-bold">
                {workloads.reduce((sum, w) => sum + w.activeClaims, 0)}
              </p>
            </div>
            <div className="h-8 w-8 bg-green-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="h-4 w-4 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Overdue Claims</p>
              <p className="text-2xl font-bold text-red-600">
                {workloads.reduce((sum, w) => sum + w.overdueClaims, 0)}
              </p>
            </div>
            <div className="h-8 w-8 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Avg Performance</p>
              <p className="text-2xl font-bold">
                {Math.round(workloads.reduce((sum, w) => sum + w.performanceScore, 0) / workloads.length)}%
              </p>
            </div>
            <div className="h-8 w-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-purple-600" />
            </div>
          </div>
        </Card>
      </div>

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

            {modal.mode === "view" && modal.agent && (
              <>
                <h3 className="text-lg font-semibold mb-4">Agent Performance Detail</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="font-medium">Agent Name:</span> {modal.agent.agentName}
                    </div>
                    <div>
                      <span className="font-medium">Status:</span> {getStatusBadge(modal.agent.status)}
                    </div>
                    <div>
                      <span className="font-medium">Active Claims:</span> {modal.agent.activeClaims}
                    </div>
                    <div>
                      <span className="font-medium">Overdue Claims:</span> {modal.agent.overdueClaims}
                    </div>
                    <div>
                      <span className="font-medium">Avg Resolution Time:</span> {modal.agent.avgResolutionTime} days
                    </div>
                    <div>
                      <span className="font-medium">Performance Score:</span> {modal.agent.performanceScore}%
                    </div>
                  </div>
                  
                  <div>
                    <span className="font-medium">Specialization:</span>
                    <div className="flex gap-2 mt-1">
                      {modal.agent.specialization.map((spec: string) => (
                        <Badge key={spec} variant="outline">{spec}</Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex gap-2 justify-end">
                    <Button variant="outline" onClick={() => setModal(null)}>
                      Close
                    </Button>
                    <Button onClick={() => setModal({ mode: "edit", agent: modal.agent })}>
                      Edit Settings
                    </Button>
                  </div>
                </div>
              </>
            )}

            {modal.mode === "edit" && modal.agent && (
              <>
                <h3 className="text-lg font-semibold mb-4">Agent Settings</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Max Concurrent Claims</label>
                      <Input type="number" defaultValue={modal.agent.maxClaims} />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Availability Status</label>
                      <Select defaultValue={modal.agent.availability}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Active">Active</SelectItem>
                          <SelectItem value="Limited">Limited</SelectItem>
                          <SelectItem value="Unavailable">Unavailable</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Specialization Areas</label>
                    <div className="flex gap-2 mt-2">
                      {["Motor", "Property", "Fire", "Health"].map((area) => (
                        <label key={area} className="flex items-center space-x-2">
                          <input 
                            type="checkbox" 
                            defaultChecked={modal.agent?.specialization.includes(area) || false}
                          />
                          <span>{area}</span>
                        </label>
                      ))}
                    </div>
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

            {modal.mode === "analytics" && modal.agent && (
              <>
                <h3 className="text-lg font-semibold mb-4">Performance Analytics</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="font-medium">Performance Trend:</span>
                      <div className="mt-2 h-20 bg-muted rounded flex items-end justify-between p-2">
                        <div className="w-4 bg-blue-500 rounded-t" style={{ height: "60%" }}></div>
                        <div className="w-4 bg-blue-500 rounded-t" style={{ height: "75%" }}></div>
                        <div className="w-4 bg-blue-500 rounded-t" style={{ height: "85%" }}></div>
                        <div className="w-4 bg-blue-500 rounded-t" style={{ height: "90%" }}></div>
                        <div className="w-4 bg-blue-500 rounded-t" style={{ height: "87%" }}></div>
                      </div>
                    </div>
                    <div>
                      <span className="font-medium">Claim Resolution Time:</span>
                      <div className="mt-2 text-sm text-muted-foreground">
                        Average: {modal.agent.avgResolutionTime} days<br />
                        Best: 4.2 days<br />
                        Worst: 15.8 days
                      </div>
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

            {modal.mode === "rebalance" && (
              <>
                <h3 className="text-lg font-semibold mb-4">Workload Rebalancing</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Current Distribution</h4>
                    <div className="space-y-2">
                      {workloads.map((workload) => (
                        <div key={workload.id} className="flex items-center justify-between">
                          <span>{workload.agentName}</span>
                          <div className="flex items-center gap-2">
                            <span>{workload.activeClaims} claims</span>
                            <div className="w-20 bg-muted rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${getWorkloadColor(getWorkloadPercentage(workload.activeClaims, workload.maxClaims))}`}
                                style={{ width: `${getWorkloadPercentage(workload.activeClaims, workload.maxClaims)}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Suggested Redistribution</h4>
                    <p className="text-sm text-muted-foreground">
                      Based on current workload analysis, we suggest redistributing claims to balance the workload.
                    </p>
                  </div>
                  
                  <div className="flex gap-2 justify-end">
                    <Button variant="outline" onClick={() => setModal(null)}>
                      Cancel
                    </Button>
                    <Button>
                      Apply Redistribution
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