"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import type { AuditLog, AuditLogAction, AuditLogSeverity } from "@/lib/types/audit";
import type { DateRange } from "react-day-picker";

const mockAgentAuditLogs: AuditLog[] = [
  {
    id: "1",
    userId: "agent1",
    userName: "Alice Johnson",
    userRole: "agent",
    action: "claim_created",
    severity: "info",
    description: "Created new claim for customer David Brown",
    details: { claimId: "CLM001", customerId: "cust123", claimType: "Auto" },
    ipAddress: "192.168.1.200",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    timestamp: "2024-01-20T14:30:00Z",
    resourceType: "claim",
    resourceId: "CLM001",
  },
  {
    id: "2",
    userId: "agent2",
    userName: "Bob Wilson",
    userRole: "agent",
    action: "claim_approved",
    severity: "info",
    description: "Approved claim CLM002 for customer Maria Garcia",
    details: { claimId: "CLM002", customerId: "cust456", approvedAmount: 5000 },
    ipAddress: "192.168.1.201",
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
    timestamp: "2024-01-20T13:15:00Z",
    resourceType: "claim",
    resourceId: "CLM002",
  },
  {
    id: "3",
    userId: "agent1",
    userName: "Alice Johnson",
    userRole: "agent",
    action: "document_uploaded",
    severity: "info",
    description: "Uploaded accident report for claim CLM003",
    details: { claimId: "CLM003", documentType: "accident_report", fileSize: "2.5MB" },
    ipAddress: "192.168.1.200",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    timestamp: "2024-01-20T12:45:00Z",
    resourceType: "document",
    resourceId: "CLM003",
  },
  {
    id: "4",
    userId: "agent3",
    userName: "Carol Davis",
    userRole: "agent",
    action: "claim_rejected",
    severity: "warning",
    description: "Rejected claim CLM004 due to insufficient documentation",
    details: { claimId: "CLM004", customerId: "cust789", reason: "Missing police report" },
    ipAddress: "192.168.1.202",
    userAgent: "Mozilla/5.0 (Linux x86_64) AppleWebKit/537.36",
    timestamp: "2024-01-20T11:30:00Z",
    resourceType: "claim",
    resourceId: "CLM004",
  },
  {
    id: "5",
    userId: "agent2",
    userName: "Bob Wilson",
    userRole: "agent",
    action: "user_login",
    severity: "info",
    description: "Agent logged in successfully",
    details: { sessionId: "sess_789012", loginMethod: "password" },
    ipAddress: "192.168.1.201",
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
    timestamp: "2024-01-20T09:00:00Z",
  },
  {
    id: "6",
    userId: "agent1",
    userName: "Alice Johnson",
    userRole: "agent",
    action: "claim_updated",
    severity: "info",
    description: "Updated claim CLM001 with additional information",
    details: { claimId: "CLM001", updates: ["Added witness statement", "Updated damage assessment"] },
    ipAddress: "192.168.1.200",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    timestamp: "2024-01-20T10:15:00Z",
    resourceType: "claim",
    resourceId: "CLM001",
  },
];

const auditActions: AuditLogAction[] = [
  "user_login", "user_logout", "claim_created", "claim_updated", "claim_approved", 
  "claim_rejected", "document_uploaded", "document_deleted"
];

const severityLevels: AuditLogSeverity[] = ["info", "warning", "error", "critical"];

export default function AgentsAuditLogsClient() {
  const [logs] = useState<AuditLog[]>(mockAgentAuditLogs);
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState<string>("all");
  const [severityFilter, setSeverityFilter] = useState<string>("all");
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    to: new Date(),
  });
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  const filtered = logs.filter((log) => {
    const matchesSearch = 
      log.userName.toLowerCase().includes(search.toLowerCase()) ||
      log.description.toLowerCase().includes(search.toLowerCase()) ||
      log.ipAddress.includes(search);
    const matchesAction = actionFilter === "all" || log.action === actionFilter;
    const matchesSeverity = severityFilter === "all" || log.severity === severityFilter;
    return matchesSearch && matchesAction && matchesSeverity;
  });


  function getSeverityColor(severity: AuditLogSeverity) {
    switch (severity) {
      case "info": return "default";
      case "warning": return "secondary";
      case "error": return "destructive";
      case "critical": return "destructive";
      default: return "outline";
    }
  }

  function getActionIcon(action: AuditLogAction) {
    switch (action) {
      case "user_login": return "🔐";
      case "user_logout": return "🚪";
      case "claim_created": return "➕";
      case "claim_updated": return "✏️";
      case "claim_approved": return "✅";
      case "claim_rejected": return "❌";
      case "document_uploaded": return "📄";
      case "document_deleted": return "🗑️";
      default: return "📝";
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Agents Audit Logs</h2>
      </div>

      <div className="flex gap-4 items-center flex-wrap">
        <Input
          placeholder="Search by agent, description, or IP..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-64"
        />
        <Select value={actionFilter} onValueChange={setActionFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Action" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Actions</SelectItem>
            {auditActions.map(action => (
              <SelectItem key={action} value={action}>{action.replace(/_/g, ' ')}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={severityFilter} onValueChange={setSeverityFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Severity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Severities</SelectItem>
            {severityLevels.map(severity => (
              <SelectItem key={severity} value={severity}>{severity}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <DateRangePicker
          date={dateRange}
          onDateChange={setDateRange}
        />
      </div>

      <Card className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Timestamp</TableHead>
              <TableHead>Agent</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Severity</TableHead>
              <TableHead>IP Address</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground">
                  No audit logs found.
                </TableCell>
              </TableRow>
            )}
            {filtered.map((log) => (
              <TableRow key={log.id}>
                <TableCell>
                  <div className="text-sm">
                    {new Date(log.timestamp).toLocaleDateString()}
                    <div className="text-xs text-muted-foreground">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="font-medium">{log.userName}</div>
                  <div className="text-xs text-muted-foreground">ID: {log.userId}</div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span>{getActionIcon(log.action)}</span>
                    <span className="text-sm">{log.action.replace(/_/g, ' ')}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="max-w-xs truncate" title={log.description}>
                    {log.description}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={getSeverityColor(log.severity)}>
                    {log.severity}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="text-sm font-mono">{log.ipAddress}</div>
                </TableCell>
                <TableCell>
                  <Button size="sm" variant="outline" onClick={() => setSelectedLog(log)}>
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Log Details Modal */}
      {selectedLog && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
          <div className="bg-white rounded shadow-lg p-6 w-full max-w-2xl relative max-h-[90vh] overflow-y-auto">
            <Button size="icon" variant="ghost" className="absolute top-2 right-2" onClick={() => setSelectedLog(null)}>
              ×
            </Button>
            <h3 className="text-lg font-semibold mb-4">Audit Log Details</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="font-medium">Agent:</span> {selectedLog.userName}
                </div>
                <div>
                  <span className="font-medium">Agent ID:</span> {selectedLog.userId}
                </div>
                <div>
                  <span className="font-medium">Action:</span> 
                  <div className="flex items-center gap-2 mt-1">
                    <span>{getActionIcon(selectedLog.action)}</span>
                    <span>{selectedLog.action.replace(/_/g, ' ')}</span>
                  </div>
                </div>
                <div>
                  <span className="font-medium">Severity:</span>
                  <Badge variant={getSeverityColor(selectedLog.severity)} className="ml-2">
                    {selectedLog.severity}
                  </Badge>
                </div>
                <div>
                  <span className="font-medium">Timestamp:</span>
                  <div className="text-sm">{new Date(selectedLog.timestamp).toLocaleString()}</div>
                </div>
                <div>
                  <span className="font-medium">IP Address:</span>
                  <div className="font-mono text-sm">{selectedLog.ipAddress}</div>
                </div>
              </div>
              <div>
                <span className="font-medium">Description:</span>
                <div className="mt-1 p-3 bg-muted/30 rounded">{selectedLog.description}</div>
              </div>
              <div>
                <span className="font-medium">Details:</span>
                <div className="mt-1 p-3 bg-muted/30 rounded">
                  <pre className="text-sm whitespace-pre-wrap">{JSON.stringify(selectedLog.details, null, 2)}</pre>
                </div>
              </div>
              <div>
                <span className="font-medium">User Agent:</span>
                <div className="mt-1 p-3 bg-muted/30 rounded text-sm font-mono break-all">
                  {selectedLog.userAgent}
                </div>
              </div>
              {selectedLog.resourceType && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="font-medium">Resource Type:</span> {selectedLog.resourceType}
                  </div>
                  <div>
                    <span className="font-medium">Resource ID:</span> {selectedLog.resourceId}
                  </div>
                </div>
              )}
            </div>
            <div className="flex gap-2 justify-end mt-6">
              <Button variant="outline" onClick={() => setSelectedLog(null)}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 