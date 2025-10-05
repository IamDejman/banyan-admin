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
  causerId: number;
  userName: string;
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
        const res = await getAuditLogs();
        console.log('Audit logs response:', res);
        console.log('Response type:', typeof res);
        console.log('Response keys:', res ? Object.keys(res) : 'null');

        // Extract audit logs data from API response
        let auditLogsData = null;
        if (res && res.data && Array.isArray(res.data)) {
          auditLogsData = res.data;
        } else if (Array.isArray(res)) {
          auditLogsData = res;
        } else if (res && Array.isArray(res)) {
          auditLogsData = res;
        }

        console.log('Extracted audit logs data:', auditLogsData);
        console.log('Is array:', Array.isArray(auditLogsData));
        console.log('Length:', auditLogsData?.length);

        if (auditLogsData && auditLogsData.length > 0) {
          const transformedLogs = auditLogsData.map((log: ApiAuditLog) => {
            // Extract user name from description or use fallback
            let userName = 'System';
            if (log.causer_type.includes('User')) {
              // Try to extract name from description (e.g., "John Doe logged in" or "User John Doe updated...")
              const nameMatch = log.description.match(/(?:User\s+)?([A-Za-z\s]+?)(?:\s+(?:logged|accessed|updated|created|submitted|verified|rejected))/i);
              if (nameMatch && nameMatch[1]) {
                userName = nameMatch[1].trim();
              } else {
                // Fallback to User ID if no name found
                userName = `User #${log.causer_id}`;
              }
            }
            
            return {
              id: log.id,
              timestamp: new Date(log.created_at),
              userType: log.causer_type.includes('User') ? 'user' : 'system',
              action: log.properties?.action || 'Unknown Action',
              description: log.description || 'No description available',
              causerId: log.causer_id,
              userName: userName
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
        console.error('Error type:', typeof error);
        console.error('Error details:', error);
        
        let errorMsg = 'Failed to fetch audit logs';
        if (error && typeof error === 'object') {
          const err = error as ApiError;
          if (err.response) {
            console.error('Response error:', err.response);
            errorMsg = err.response.data?.message || err.response.statusText || `HTTP ${err.response.status}`;
          } else if (err.message) {
            errorMsg = err.message;
          }
        }
        
        toast({
          title: "Error",
          description: errorMsg,
          variant: "destructive",
        });
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
                  <TableHead className="hidden md:table-cell">User Name</TableHead>
                  <TableHead className="hidden sm:table-cell">User Type</TableHead>
                  <TableHead className="hidden lg:table-cell">Action/Activity</TableHead>
                  <TableHead className="hidden md:table-cell">Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="text-center">
                        <Loader2 className="h-8 w-8 text-gray-400 mx-auto mb-2 animate-spin" />
                        <p className="text-sm text-muted-foreground">Loading audit logs...</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredLogs.length === 0 ? (
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
                          {log.userName}
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
                    <span className="text-muted-foreground">User:</span>
                    <span>{log.userName}</span>
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