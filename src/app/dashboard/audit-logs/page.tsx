"use client";
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Loader2 } from "lucide-react";
import { getAuditLogs } from "@/app/services/dashboard";
import { toast } from "@/components/ui/use-toast";
// import { formatDateTime } from "@/lib/utils/text-formatting"; // Removed unused import


// API Response interfaces
interface ApiAuditLog {
  id: number;
  log_name: string;
  description: string;
  subject_type: string | null;
  event: string | null;
  subject_id: string | null;
  causer_type: string;
  causer_id: number;
  properties: {
    action: string;
    status: string;
  };
  batch_uuid: string | null;
  created_at: string;
  updated_at: string;
}

interface TransformedAuditLog {
  id: number;
  timestamp: Date;
  userType: string;
  action: string;
  description: string;
  causerId?: number;
  userName: string;
  ipAddress?: string;
  status?: string;
}

// Error interface for proper typing
interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
    status?: number;
    statusText?: string;
  };
  message?: string;
}

const userTypes = [
  { value: "all", label: "All Users" },
  { value: "admin", label: "Admin" },
  { value: "agent", label: "Agent" },
];

const actions = [
  { value: "all", label: "All Actions" },
  { value: "New Claim Submitted", label: "New Claim Submitted" },
  { value: "User Logged in", label: "User Logged in" },
  { value: "Document Verified", label: "Document Verified" },
  { value: "Document Rejected", label: "Document Rejected" },
];

export default function AuditLogsPage() {
  const [auditLogs, setAuditLogs] = useState<TransformedAuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [userTypeFilter, setUserTypeFilter] = useState("all");
  const [actionFilter, setActionFilter] = useState("all");

  // Fetch audit logs from API
  useEffect(() => {
    const fetchAuditLogs = async () => {
      setLoading(true);
      try {
        console.log('Fetching audit logs...');
        // Add timeout to prevent hanging
        const res = await Promise.race([
          getAuditLogs(),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Request timeout')), 10000)
          )
        ]);
        console.log('Audit logs response:', res);
        console.log('Response status:', (res as { status?: number })?.status || 'No status');
        console.log('Response type:', typeof res);
        console.log('Response keys:', res ? Object.keys(res) : 'null');

        // Extract audit logs data from API response
        let auditLogsData = null;
        const response = res as { data?: unknown[] } | unknown[];
        if (response && typeof response === 'object' && 'data' in response && Array.isArray(response.data)) {
          auditLogsData = response.data;
        } else if (Array.isArray(response)) {
          auditLogsData = response;
        }

        console.log('Extracted audit logs data:', auditLogsData);
        console.log('Is array:', Array.isArray(auditLogsData));
        console.log('Length:', auditLogsData?.length);

        if (auditLogsData && auditLogsData.length > 0) {
          const transformedLogs = auditLogsData.map((log: unknown) => {
            const apiLog = log as ApiAuditLog;
            // Extract user name from description or use fallback
            let userName = 'System';
            const causerType = apiLog.causer_type || '';
            
            if (causerType.includes('User')) {
              // Try to extract name from description (e.g., "John Doe logged in" or "User John Doe updated...")
              const nameMatch = (apiLog.description || '').match(/(?:User\s+)?([A-Za-z\s]+?)(?:\s+(?:logged|accessed|updated|created|submitted|verified|rejected))/i);
              if (nameMatch && nameMatch[1]) {
                userName = nameMatch[1].trim();
              } else {
                // Fallback to User ID if no name found
                userName = `User #${apiLog.causer_id || 'Unknown'}`;
              }
            }
            
            return {
              id: apiLog.id,
              timestamp: new Date(apiLog.created_at || new Date().toISOString()),
              userType: causerType.includes('User') ? 'user' : 'system',
              action: apiLog.properties?.action || 'Unknown Action',
              description: apiLog.description || 'No description available',
              causerId: apiLog.causer_id,
              userName: userName,
              ipAddress: 'Unknown',
              status: apiLog.properties?.status || 'unknown'
            };
          });
          
          console.log('Transformed audit logs:', transformedLogs);
          setAuditLogs(transformedLogs);
        } else {
          console.log('No audit logs data found in API response');
          console.log('Raw response:', res);
          setAuditLogs([]);
        }
      } catch (error: unknown) {
        console.error('Error fetching audit logs:', error);
        
        let errorMsg = 'Failed to fetch audit logs';
        if (error && typeof error === 'object') {
          const err = error as ApiError;
          if (err.message === 'Request timeout') {
            errorMsg = 'Request timed out. The server may be slow or unavailable.';
          } else if (err.response) {
            const status = err.response.status;
            if (status === 500) {
              errorMsg = 'Server error. Please try again later or contact support.';
            } else if (status === 401) {
              errorMsg = 'Unauthorized. Please log in again.';
            } else if (status === 403) {
              errorMsg = 'Access denied. You do not have permission to view audit logs.';
            } else if (status === 404) {
              errorMsg = 'Audit logs endpoint not found.';
            } else {
              errorMsg = err.response.data?.message || err.response.statusText || `HTTP ${status}`;
            }
            console.error('Response error:', { status, data: err.response.data });
          } else if (err.message) {
            errorMsg = err.message;
          }
        }
        
        toast({
          title: "Error",
          description: errorMsg,
          variant: "destructive",
        });
        // Set empty data when API fails
        setAuditLogs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAuditLogs();
  }, []);

  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch = 
      log.description.toLowerCase().includes(search.toLowerCase()) ||
      log.action.toLowerCase().includes(search.toLowerCase());
    
    const matchesUserType = userTypeFilter === "all" || log.userType === userTypeFilter;
    const matchesAction = actionFilter === "all" || log.action === actionFilter;
    
    return matchesSearch && matchesUserType && matchesAction;
  });

  function getUserTypeBadge(userType: string) {
    const colors = {
      admin: "bg-blue-100 text-blue-800",
      agent: "bg-green-100 text-green-800",
      user: "bg-purple-100 text-purple-800",
      system: "bg-gray-100 text-gray-800",
    };
    return colors[userType as keyof typeof colors] || "bg-gray-100 text-gray-800";
  }

  function formatTimestamp(timestamp: Date) {
    // Format: DD Mmm YYYY HH:MM
    return timestamp.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).replace(',', '');
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Audit Logs</h1>
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
                  <TableHead>User Role</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Timestamp</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8">
                      <div className="text-center">
                        <Loader2 className="h-8 w-8 text-gray-400 mx-auto mb-2 animate-spin" />
                        <p className="text-sm text-muted-foreground">Loading audit logs...</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredLogs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8">
                      <div className="text-center">
                        <Filter className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">No audit logs found</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>
                        <Badge className={getUserTypeBadge(log.userType)}>
                          {log.userType}
                        </Badge>
                      </TableCell>
                      <TableCell>{log.action}</TableCell>
                      <TableCell>{log.description}</TableCell>
                      <TableCell>{formatTimestamp(log.timestamp)}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          
          {/* Mobile Audit Logs Cards */}
          <div className="sm:hidden space-y-3 p-4">
            {filteredLogs.map((log) => (
              <div key={log.id} className="border rounded-lg p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <Badge className={getUserTypeBadge(log.userType)}>
                    {log.userType}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{formatTimestamp(log.timestamp)}</span>
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Action:</span>
                    <span>{log.action}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Description:</span>
                    <p className="text-sm mt-1">{log.description}</p>
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