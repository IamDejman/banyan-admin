"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Download } from "lucide-react";

// Mock audit log data
const mockAuditLogs = [
  {
    id: "1",
    timestamp: new Date("2024-01-20T14:30:25"),
    firstName: "David",
    lastName: "Wilson",
    userType: "admin",
    action: "LOGIN",
    description: "User logged into the system",
  },
  {
    id: "2",
    timestamp: new Date("2024-01-20T14:25:10"),
    firstName: "Sarah",
    lastName: "Johnson",
    userType: "agent",
    action: "CLAIM_UPDATE",
    description: "Updated claim status from PENDING to APPROVED",
  },
  {
    id: "3",
    timestamp: new Date("2024-01-20T14:20:45"),
    firstName: "Lisa",
    lastName: "Brown",
    userType: "admin",
    action: "USER_CREATE",
    description: "Created new agent account for Michael Chen",
  },
  {
    id: "4",
    timestamp: new Date("2024-01-20T14:15:30"),
    firstName: "Michael",
    lastName: "Chen",
    userType: "agent",
    action: "DOCUMENT_UPLOAD",
    description: "Uploaded assessment report for claim CLM-001",
  },
  {
    id: "5",
    timestamp: new Date("2024-01-20T14:10:15"),
    firstName: "Robert",
    lastName: "Taylor",
    userType: "admin",
    action: "SYSTEM_CONFIG",
    description: "Updated claim type configuration",
  },
  {
    id: "6",
    timestamp: new Date("2024-01-20T14:05:00"),
    firstName: "Emily",
    lastName: "Davis",
    userType: "agent",
    action: "SETTLEMENT_CREATE",
    description: "Created settlement offer for claim CLM-002",
  },
  {
    id: "7",
    timestamp: new Date("2024-01-20T13:55:30"),
    firstName: "David",
    lastName: "Wilson",
    userType: "admin",
    action: "REPORT_GENERATE",
    description: "Generated claims report for January 2024",
  },
  {
    id: "8",
    timestamp: new Date("2024-01-20T13:50:20"),
    firstName: "Sarah",
    lastName: "Johnson",
    userType: "agent",
    action: "ASSESSMENT_COMPLETE",
    description: "Completed damage assessment for motor claim",
  },
];

const userTypes = [
  { value: "all", label: "All Users" },
  { value: "admin", label: "Admin" },
  { value: "agent", label: "Agent" },
];

const actions = [
  { value: "all", label: "All Actions" },
  { value: "LOGIN", label: "Login" },
  { value: "LOGOUT", label: "Logout" },
  { value: "CLAIM_UPDATE", label: "Claim Update" },
  { value: "CLAIM_CREATE", label: "Claim Create" },
  { value: "USER_CREATE", label: "User Create" },
  { value: "USER_UPDATE", label: "User Update" },
  { value: "DOCUMENT_UPLOAD", label: "Document Upload" },
  { value: "SYSTEM_CONFIG", label: "System Config" },
  { value: "SETTLEMENT_CREATE", label: "Settlement Create" },
  { value: "ASSESSMENT_COMPLETE", label: "Assessment Complete" },
  { value: "REPORT_GENERATE", label: "Report Generate" },
];

export default function AuditLogsPage() {
  const [auditLogs] = useState(mockAuditLogs);
  const [search, setSearch] = useState("");
  const [userTypeFilter, setUserTypeFilter] = useState("all");
  const [actionFilter, setActionFilter] = useState("all");

  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch = 
      log.firstName.toLowerCase().includes(search.toLowerCase()) ||
      log.lastName.toLowerCase().includes(search.toLowerCase()) ||
      log.description.toLowerCase().includes(search.toLowerCase());
    
    const matchesUserType = userTypeFilter === "all" || log.userType === userTypeFilter;
    const matchesAction = actionFilter === "all" || log.action === actionFilter;
    
    return matchesSearch && matchesUserType && matchesAction;
  });

  function handleExportLogs() {
    console.log("Exporting audit logs...");
    // In a real app, this would trigger the export functionality
  }

  function getUserTypeBadge(userType: string) {
    const colors = {
      admin: "bg-blue-100 text-blue-800",
      agent: "bg-green-100 text-green-800",
    };
    return colors[userType as keyof typeof colors] || "bg-gray-100 text-gray-800";
  }

  function formatTimestamp(timestamp: Date) {
    return timestamp.toLocaleDateString() + " " + timestamp.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Audit Logs</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleExportLogs}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <Card className="p-4 sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:gap-4">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search logs..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8 w-full lg:w-64"
                />
              </div>
              <Select value={userTypeFilter} onValueChange={setUserTypeFilter}>
                <SelectTrigger className="w-full lg:w-40">
                  <SelectValue placeholder="User Type" />
                </SelectTrigger>
                <SelectContent>
                  {userTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={actionFilter} onValueChange={setActionFilter}>
                <SelectTrigger className="w-full lg:w-40">
                  <SelectValue placeholder="Action" />
                </SelectTrigger>
                <SelectContent>
                  {actions.map((action) => (
                    <SelectItem key={action.value} value={action.value}>
                      {action.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>
      </Card>

      {/* Audit Logs Table */}
      <Card>
        <Card className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12 sm:w-auto">S/N</TableHead>
                  <TableHead className="hidden sm:table-cell">Timestamp</TableHead>
                  <TableHead className="hidden md:table-cell">Name</TableHead>
                  <TableHead className="hidden sm:table-cell">User Type</TableHead>
                  <TableHead className="hidden lg:table-cell">Action/Activity</TableHead>
                  <TableHead className="hidden md:table-cell">Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="text-center">
                        <Filter className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">No audit logs found</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredLogs.map((log, index) => (
                    <TableRow key={log.id}>
                      <TableCell className="text-xs sm:text-sm">{index + 1}</TableCell>
                      <TableCell className="hidden sm:table-cell text-xs sm:text-sm">
                        {formatTimestamp(log.timestamp)}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <span className="text-sm sm:text-base">
                          {log.firstName} {log.lastName}
                        </span>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <Badge className={getUserTypeBadge(log.userType)}>
                          {log.userType}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-xs sm:text-sm">
                        {log.action}
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-xs sm:text-sm">
                        {log.description}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          
          {/* Mobile Audit Logs Cards */}
          <div className="sm:hidden space-y-3 p-4">
            {filteredLogs.map((log, index) => (
              <div key={log.id} className="border rounded-lg p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm">#{index + 1}</span>
                  <Badge className={getUserTypeBadge(log.userType)}>
                    {log.userType}
                  </Badge>
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Name:</span>
                    <span>{log.firstName} {log.lastName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Time:</span>
                    <span>{formatTimestamp(log.timestamp)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Action:</span>
                    <span>{log.action}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Description:</span>
                    <span className="text-right">{log.description}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </Card>
    </div>
  );
} 