"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Check, X, ChevronDown, ChevronRight, UserX, Loader2, Edit, Search } from "lucide-react";
import AdminForm from "./AdminForm";
import { Tooltip } from "@/components/ui/tooltip";
import type { Admin, UserStatus } from "@/lib/types/user";
import { getAdmins, getAllUsers, createAdmin, disableUser, searchAdmins, editUser } from "@/app/services/dashboard";
import { formatStatus, formatDateTime, formatDate } from "@/lib/utils/text-formatting";
import { useToast } from "@/components/ui/use-toast";
import { useDebounce } from "@/hooks/useDebounce";

// Mock admin data
const mockAdmins: Admin[] = [
  {
    id: "1",
    firstName: "David",
    lastName: "Wilson",
    email: "david.wilson@company.com",
    phone: "+2348012345678",
    status: "active" as UserStatus,
    createdAt: "2024-01-01",
    lastLogin: "2024-01-20T10:30:00",
    role: "admin" as const,
    permissions: ["claims_management", "system_config", "reports_view"],
    isSuperAdmin: false,
    department: "Administration",
    assignedClaims: ["CLM-001", "CLM-003"],
    completedClaims: ["CLM-002", "CLM-004"]
  },
  {
    id: "2",
    firstName: "Lisa",
    lastName: "Brown",
    email: "lisa.brown@company.com",
    phone: "+2348098765432",
    status: "active" as UserStatus,
    createdAt: "2024-01-02",
    lastLogin: "2024-01-19T14:15:00",
    role: "admin" as const,
    permissions: ["claims_management", "audit_logs"],
    isSuperAdmin: false,
    department: "Operations",
    assignedClaims: ["CLM-005", "CLM-006"],
    completedClaims: ["CLM-007"]
  },
  {
    id: "3",
    firstName: "Robert",
    lastName: "Taylor",
    email: "robert.taylor@company.com",
    phone: "+2348055555555",
    status: "active" as UserStatus,
    createdAt: "2024-01-03",
    lastLogin: "2024-01-18T09:45:00",
    role: "admin" as const,
    permissions: ["system_config", "reports_view", "audit_logs"],
    isSuperAdmin: true,
    department: "IT",
    assignedClaims: [],
    completedClaims: ["CLM-008", "CLM-009", "CLM-010"]
  },
];

// Permission labels mapping
const permissionLabels = {
  claims_management: "Claims Management",
  system_config: "System Configuration",
  reports_view: "Reports View",
  audit_logs: "Audit Logs",
  settlement_management: "Settlement Management",
  document_management: "Document Management",
  assessment_management: "Assessment Management",
};

export default function AdminsPage() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [modal, setModal] = useState<{ mode: "create" | "edit"; admin?: Admin } | null>(null);
  const [expandedAdmin, setExpandedAdmin] = useState<Admin | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter] = useState("all");
  const [expandedRows, setExpandedRows] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const { toast } = useToast();
  const debouncedSearch = useDebounce(search, 500);

  // Fetch admins from API
  const fetchAdmins = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("Fetching admins from API...");
      let response;
      
      try {
        // Try the primary admins endpoint first
        response = await getAdmins();
        console.log("Primary admins response:", response);
      } catch (primaryError) {
        console.warn('Primary admins endpoint failed, trying alternative...', primaryError);
        try {
          // Try alternative endpoint to get all users
          response = await getAllUsers();
          console.log('All users response:', response);
          
          // Filter admins from all users on the client side
          if (response && response.data && Array.isArray(response.data)) {
            const admins = (response.data as unknown as { role: string }[]).filter((user: { role: string }) => user.role === 'admin');
            response = { ...response, data: admins };
          }
        } catch (altError) {
          console.error('Alternative endpoint also failed:', altError);
          throw altError;
        }
      }
      
      // Check if response has data property
      if (response && Array.isArray(response.data)) {
        // Transform API response to match Admin interface
        const transformedAdmins: Admin[] = (response.data as unknown as { id: string | number; first_name: string; last_name: string; email: string; phone: string; status: string; created_at: string; last_login_at?: string; permissions?: string[]; is_super_admin?: boolean; department?: string }[]).map((admin: { 
          id: string | number; 
          first_name: string; 
          last_name: string; 
          email: string; 
          phone: string; 
          status: string; 
          created_at: string; 
          last_login_at?: string;
          permissions?: string[];
          is_super_admin?: boolean;
          department?: string;
        }) => ({
          id: admin.id?.toString() || (admin as { user_id?: string | number }).user_id?.toString() || `admin-${Date.now()}`,
          firstName: admin.first_name || (admin as { firstName?: string }).firstName || "Unknown",
          lastName: admin.last_name || (admin as { lastName?: string }).lastName || "Unknown",
          email: admin.email || "",
          phone: admin.phone || (admin as { phone_number?: string }).phone_number || "",
          status: (admin.status || "active") as UserStatus,
          createdAt: admin.created_at || (admin as { createdAt?: string }).createdAt || new Date().toISOString().split('T')[0],
          lastLogin: admin.last_login_at || (admin as { lastLogin?: string }).lastLogin,
          role: "admin" as const,
          permissions: admin.permissions || [],
          isSuperAdmin: admin.is_super_admin || (admin as { isSuperAdmin?: boolean }).isSuperAdmin || false,
          department: admin.department || "Administration",
          assignedClaims: [],
          completedClaims: []
        }));
        
        setAdmins(transformedAdmins);
      } else {
        // If no data array, treat as empty result
        setAdmins([]);
      }
    } catch (err: unknown) {
      console.error("Error fetching admins:", err);
      
      // Check if it's a backend filtering error
      if ((err as { response?: { data?: { message?: string } } })?.response?.data?.message?.includes("scopeFilter")) {
        setError("Backend filtering error. Using mock data for demonstration.");
        setAdmins(mockAdmins);
      } else {
        setError("Failed to load admins. Please try again.");
        // Fallback to mock data in case of API error
        setAdmins(mockAdmins);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAdmins();
  }, [fetchAdmins]);

  // Handle debounced search
  useEffect(() => {
    if (debouncedSearch.trim()) {
      handleSearch(debouncedSearch);
    } else {
      fetchAdmins();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  const handleSearch = async (searchTerm: string) => {
    setSearchLoading(true);
    try {
      console.log('Searching admins with term:', searchTerm);
      const response = await searchAdmins(searchTerm);
      console.log('Search response:', response);
      
      if (response?.data && Array.isArray(response.data)) {
        const transformedAdmins = (response.data as unknown as { id: string | number; first_name: string; last_name: string; email: string; phone: string; status: string; created_at: string; last_login_at?: string; permissions?: string[]; is_super_admin?: boolean; department?: string }[]).map((admin: { 
          id: string | number; 
          first_name: string; 
          last_name: string; 
          email: string; 
          phone: string; 
          status: string; 
          created_at: string; 
          last_login_at?: string;
          permissions?: string[];
          is_super_admin?: boolean;
          department?: string;
        }) => ({
          id: admin.id?.toString() || `admin-${Date.now()}`,
          firstName: admin.first_name || (admin as { firstName?: string }).firstName || "Unknown",
          lastName: admin.last_name || (admin as { lastName?: string }).lastName || "Unknown",
          email: admin.email || "",
          phone: admin.phone || (admin as { phone_number?: string }).phone_number || "",
          status: (admin.status || "active") as UserStatus,
          createdAt: admin.created_at || new Date().toISOString().split('T')[0],
          lastLogin: admin.last_login_at || undefined,
          role: "admin" as const,
          permissions: admin.permissions || [],
          department: admin.department || "Administration",
          isSuperAdmin: admin.is_super_admin || false,
          assignedClaims: [],
          completedClaims: []
        }));
        setAdmins(transformedAdmins);
      } else {
        setAdmins([]);
      }
    } catch (error) {
      console.error('Search failed:', error);
      toast({
        variant: "destructive",
        title: "Search failed",
        description: "Failed to search admins. Please try again.",
      });
      setAdmins([]);
    } finally {
      setSearchLoading(false);
    }
  };

  const filteredAdmins = admins.filter((admin) => {
    const matchesSearch = 
      admin.firstName.toLowerCase().includes(search.toLowerCase()) ||
      admin.lastName.toLowerCase().includes(search.toLowerCase()) ||
      admin.email.toLowerCase().includes(search.toLowerCase()) ||
      admin.phone.toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || admin.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  async function handleToggleStatus(adminId: string) {
    const admin = admins.find(a => a.id === adminId);
    if (!admin) return;

    const action = admin.disabled ? 'enable' : 'disable';
    const confirmed = window.confirm(
      `Are you sure you want to ${action} ${admin.firstName} ${admin.lastName}?`
    );

    if (!confirmed) return;

    try {
      setLoading(true);
      setError(null);
      
      // Call the API to disable/enable the admin
      await disableUser(adminId);
      
      // Update the local state
      setAdmins(prev => prev.map(admin => 
        admin.id === adminId 
          ? { ...admin, disabled: !admin.disabled, status: admin.disabled ? "active" : "inactive" }
          : admin
      ));
    } catch (err) {
      console.error('Failed to toggle admin status:', err);
      setError('Failed to update admin status. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function handleToggleExpanded(adminId: string) {
    setExpandedRows(prev => 
      prev.includes(adminId) 
        ? prev.filter(id => id !== adminId)
        : [...prev, adminId]
    );
  }

  async function handleCreateAdmin(adminData: { firstName: string; lastName: string; email: string; phoneNumber: string; password: string }) {
    try {
      setLoading(true);
      setError(null);
      
      // Call the API to create the admin
      await createAdmin({
        email: adminData.email,
        first_name: adminData.firstName,
        last_name: adminData.lastName,
        password: adminData.password,
        role: "admin",
        phone: adminData.phoneNumber
      });

      // If we get here, the API call succeeded (200 response)
      // Refresh the page to show the new admin
      window.location.reload();
    } catch (err) {
      console.error('Failed to create admin:', err);
      setError('Failed to create admin. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdateAdmin(adminData: { firstName: string; lastName: string; email: string; phoneNumber: string }) {
    if (!modal?.admin) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Call the API to update the admin
      await editUser(modal.admin.id, {
        first_name: adminData.firstName,
        last_name: adminData.lastName,
        email: adminData.email,
        phone: adminData.phoneNumber,
        role: "admin"
      });
      
      // Update the local state
      const updatedAdmin: Admin = {
        ...modal.admin,
        firstName: adminData.firstName,
        lastName: adminData.lastName,
        email: adminData.email,
        phone: adminData.phoneNumber,
      };
      
      setAdmins(prev => prev.map(admin => 
        admin.id === modal.admin!.id ? updatedAdmin : admin
      ));
      setModal(null);
      
      toast({
        title: "Admin updated",
        description: `${adminData.firstName} ${adminData.lastName} has been updated successfully.`,
      });
    } catch (err) {
      console.error('Failed to update admin:', err);
      setError('Failed to update admin. Please try again.');
      toast({
        variant: "destructive",
        title: "Error updating admin",
        description: "Failed to update admin. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Admins</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => setModal({ mode: "create" })}>
            <Plus className="h-4 w-4 mr-2" />
            Add Admin
          </Button>
        </div>
      </div>

      {/* Admins Table */}
      <Card>
        <div className="p-4 sm:p-6 border-b">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:gap-4 flex-1">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by name, email and phone..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 pr-10 w-full"
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label="Clear search"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-20 sm:w-auto">Name</TableHead>
                  <TableHead className="hidden sm:table-cell">Email</TableHead>
                  <TableHead className="hidden md:table-cell">Phone</TableHead>
                  <TableHead className="hidden lg:table-cell">Last Login</TableHead>
                  <TableHead className="hidden sm:table-cell">Status</TableHead>
                  <TableHead className="w-20 sm:w-auto">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="text-center">
                        <Loader2 className="h-8 w-8 text-gray-400 mx-auto mb-2 animate-spin" />
                        <p className="text-sm text-muted-foreground">Loading admins...</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="text-center">
                        <UserX className="h-8 w-8 text-red-400 mx-auto mb-2" />
                        <p className="text-sm text-red-600 mb-3">{error}</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredAdmins.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="text-center">
                        <UserX className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">No admins found</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAdmins.map((admin) => (
                    <React.Fragment key={admin.id}>
                      <TableRow>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleToggleExpanded(admin.id)}
                              className="p-0 h-auto"
                            >
                              {expandedRows.includes(admin.id) ? (
                                <ChevronDown className="h-4 w-4" />
                              ) : (
                                <ChevronRight className="h-4 w-4" />
                              )}
                            </Button>
                            <span className="text-sm sm:text-base">
                              {admin.firstName} {admin.lastName}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">{admin.email}</TableCell>
                        <TableCell className="hidden md:table-cell">{admin.phone}</TableCell>
                        <TableCell className="hidden lg:table-cell">
                          {admin.lastLogin ? formatDate(admin.lastLogin) : "Never"}
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <Badge className={!admin.disabled ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                            {admin.disabled ? "Disabled" : "Active"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1 sm:gap-2">
                            <Tooltip content={!admin.disabled ? "Disable Admin" : "Enable Admin"}>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleToggleStatus(admin.id)}
                                className={!admin.disabled ? "text-red-500" : "text-green-600"}
                              >
                                {!admin.disabled ? (
                                  <X className="h-4 w-4" />
                                ) : (
                                  <Check className="h-4 w-4" />
                                )}
                              </Button>
                            </Tooltip>
                            <Tooltip content="Edit Admin">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setModal({ mode: "edit", admin })}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </Tooltip>
                          </div>
                        </TableCell>
                      </TableRow>
                      {expandedRows.includes(admin.id) && (
                        <TableRow>
                          <TableCell colSpan={6} className="bg-gray-50">
                            <div className="p-3 space-y-2">
                              {/* Admin Details List */}
                              <ul className="space-y-2 max-w-md">
                                <li className="flex justify-between items-center py-1 border-b border-gray-200">
                                  <span className="text-sm font-medium text-gray-600">Email:</span>
                                  <span className="text-sm text-gray-900">{admin.email}</span>
                                </li>
                                <li className="flex justify-between items-center py-1 border-b border-gray-200">
                                  <span className="text-sm font-medium text-gray-600">Phone:</span>
                                  <span className="text-sm text-gray-900">{admin.phone}</span>
                                </li>
                                <li className="flex justify-between items-center py-1 border-b border-gray-200">
                                  <span className="text-sm font-medium text-gray-600">Last Login:</span>
                                  <span className="text-sm text-gray-900">
                                    {admin.lastLogin ? formatDateTime(admin.lastLogin) : 'Never'}
                                  </span>
                                </li>
                                <li className="flex justify-between items-start py-1">
                                  <span className="text-sm font-medium text-gray-600">Permissions:</span>
                                  <div className="flex flex-wrap gap-1 ml-4">
                                    {admin.permissions.map((permission) => (
                                      <Badge key={permission} variant="secondary" className="text-xs">
                                        {permissionLabels[permission as keyof typeof permissionLabels]}
                                      </Badge>
                                    ))}
                                  </div>
                                </li>
                              </ul>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          
          {/* Mobile Admin Cards */}
          <div className="sm:hidden space-y-3 p-4">
            {(loading || searchLoading) ? (
              <div className="text-center py-8">
                <Loader2 className="h-8 w-8 text-gray-400 mx-auto mb-2 animate-spin" />
                <p className="text-sm text-muted-foreground">
                  {searchLoading ? "Searching admins..." : "Loading admins..."}
                </p>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <UserX className="h-8 w-8 text-red-400 mx-auto mb-2" />
                <p className="text-sm text-red-600 mb-3">{error}</p>
              </div>
            ) : filteredAdmins.length === 0 ? (
              <div className="text-center py-8">
                <UserX className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No admins found</p>
              </div>
            ) : (
              filteredAdmins.map((admin) => (
              <div key={admin.id} className="border rounded-lg p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm">{admin.firstName} {admin.lastName}</span>
                  <Badge className={admin.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                    {formatStatus(admin.status)}
                  </Badge>
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Email:</span>
                    <span>{admin.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Phone:</span>
                    <span>{admin.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Last Login:</span>
                    <span>{admin.lastLogin ? formatDate(admin.lastLogin) : "Never"}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleToggleStatus(admin.id)} 
                    className={`flex-1 ${!admin.disabled ? "text-red-500" : "text-green-600"}`}
                  >
                    {!admin.disabled ? (
                      <X className="h-4 w-4 mr-1" />
                    ) : (
                      <Check className="h-4 w-4 mr-1" />
                    )}
                    {!admin.disabled ? "Disable" : "Enable"}
                  </Button>
                </div>
                {expandedRows.includes(admin.id) && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg space-y-3">
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm">Permissions</h4>
                      <div className="flex flex-wrap gap-1">
                        {admin.permissions.map((permission) => (
                          <Badge key={permission} variant="secondary" className="text-xs">
                            {permissionLabels[permission as keyof typeof permissionLabels]}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )))}
          </div>
        </div>
      </Card>

      {/* Expanded Admin View */}
      {expandedAdmin && (
        <Card className="mt-6">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">Admin Details</h3>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setExpandedAdmin(null)}
              >
                Close
              </Button>
            </div>
            
            <div className="space-y-4">
              {/* Assigned Claims */}
              <div>
                <div className="text-4xl font-bold text-blue-600 mb-1">
                  {expandedAdmin.assignedClaims?.length || 0}
                </div>
                <div className="text-sm text-gray-600">Assigned Claims</div>
              </div>

              {/* Completed Claims */}
              <div>
                <div className="text-4xl font-bold text-green-600 mb-1">
                  {expandedAdmin.completedClaims?.length || 0}
                </div>
                <div className="text-sm text-gray-600">Completed Claims</div>
              </div>

              {/* Last Login */}
              <div>
                <span className="text-sm text-gray-600">Last Login: </span>
                <span className="text-sm text-gray-900">
                  {expandedAdmin.lastLogin ? formatDateTime(expandedAdmin.lastLogin) : 'Never'}
                </span>
              </div>

              {/* Date Created */}
              <div>
                <span className="text-sm text-gray-600">Date Created: </span>
                <span className="text-sm text-gray-900">
                  {formatDate(expandedAdmin.createdAt)}
                </span>
              </div>

              {/* Additional Info */}
              <div className="flex gap-4">
                <div>
                  <Badge 
                    variant={expandedAdmin.status === "active" ? "default" : "secondary"}
                    className={expandedAdmin.status === "active" ? "bg-green-100 text-green-800 border-green-200" : "bg-gray-100 text-gray-600 border-gray-200"}
                  >
                    {formatStatus(expandedAdmin.status)}
                  </Badge>
                </div>
                {expandedAdmin.isSuperAdmin && (
                  <Badge variant="destructive" className="bg-red-100 text-red-800 border-red-200">
                    Super Admin
                  </Badge>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 pt-6 border-t flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => setModal({ mode: "edit", admin: expandedAdmin })}
              >
                Edit Admin
              </Button>
            </div>
          </div>
        </Card>
      )}

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
              {modal.mode === "create" ? "Add New Admin" : "Edit Admin"}
            </h3>
            
            <AdminForm
              admin={modal.admin}
              onSubmit={modal.mode === "create" ? handleCreateAdmin : handleUpdateAdmin}
              onCancel={() => setModal(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
} 