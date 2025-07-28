"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Eye, Edit, UserX, ChevronDown, ChevronRight } from "lucide-react";
import AdminForm from "./AdminForm";
import { Tooltip } from "@/components/ui/tooltip";
import type { Admin, UserStatus } from "@/lib/types/user";

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
    permissions: ["claims_management", "user_management", "system_config", "reports_view"],
    isSuperAdmin: false,
    department: "Administration"
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
    permissions: ["claims_management", "user_management", "audit_logs"],
    isSuperAdmin: false,
    department: "Operations"
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
    department: "IT"
  },
];

// Permission labels mapping
const permissionLabels = {
  claims_management: "Claims Management",
  user_management: "User Management",
  system_config: "System Configuration",
  reports_view: "Reports View",
  audit_logs: "Audit Logs",
  settlement_management: "Settlement Management",
  document_management: "Document Management",
  assessment_management: "Assessment Management",
};

export default function AdminsPage() {
  const [modal, setModal] = useState<{ mode: "create" | "edit"; admin?: typeof mockAdmins[0] } | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter] = useState("all");
  const [expandedRows, setExpandedRows] = useState<string[]>([]);

  const filteredAdmins = mockAdmins.filter((admin) => {
    const matchesSearch = 
      admin.firstName.toLowerCase().includes(search.toLowerCase()) ||
      admin.lastName.toLowerCase().includes(search.toLowerCase()) ||
      admin.email.toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || admin.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  function handleToggleExpanded(adminId: string) {
    setExpandedRows(prev => 
      prev.includes(adminId) 
        ? prev.filter(id => id !== adminId)
        : [...prev, adminId]
    );
  }

  function handleCreateAdmin(adminData: { firstName: string; lastName: string; email: string; phoneNumber: string }) {
    const newAdmin: Admin = {
      id: `admin-${Date.now()}`,
      firstName: adminData.firstName,
      lastName: adminData.lastName,
      email: adminData.email,
      phone: adminData.phoneNumber,
      role: "admin",
      status: "active",
      permissions: [],
      isSuperAdmin: false,
      createdAt: new Date().toISOString().split('T')[0],
      lastLogin: undefined,
      department: "Administration"
    };
    // In a real app, you'd add this to the database
    console.log('Creating admin:', newAdmin);
    setModal(null);
  }

  function handleUpdateAdmin(adminData: { firstName: string; lastName: string; email: string; phoneNumber: string }) {
    if (!modal?.admin) return;
    
    const updatedAdmin: Admin = {
      ...modal.admin,
      firstName: adminData.firstName,
      lastName: adminData.lastName,
      email: adminData.email,
      phone: adminData.phoneNumber,
    };
    
    // In a real app, you'd update this in the database
    console.log('Updating admin:', updatedAdmin);
    setModal(null);
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

      {/* Search and Filters */}
      <Card>
        <Card className="p-4 sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:gap-4">
              <div className="relative">
                <Input
                  placeholder="Search admins..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full lg:w-64"
                />
              </div>
            </div>
          </div>
        </Card>
      </Card>

      {/* Admins Table */}
      <Card>
        <Card className="p-0">
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
                {filteredAdmins.length === 0 ? (
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
                          {admin.lastLogin ? new Date(admin.lastLogin).toLocaleDateString() : "Never"}
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <Badge className={admin.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                            {admin.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1 sm:gap-2">
                            <Tooltip content="View Details">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleToggleExpanded(admin.id)}
                              >
                                <Eye className="h-4 w-4" />
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
                            <div className="p-4 space-y-4">
                              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                                <div className="space-y-2">
                                  <h4 className="font-semibold text-sm">Contact Information</h4>
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
                                      <span>{admin.lastLogin ? new Date(admin.lastLogin).toLocaleDateString() : "Never"}</span>
                                    </div>
                                  </div>
                                </div>
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
            {filteredAdmins.map((admin) => (
              <div key={admin.id} className="border rounded-lg p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm">{admin.firstName} {admin.lastName}</span>
                  <Badge className={admin.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                    {admin.status}
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
                    <span>{admin.lastLogin ? new Date(admin.lastLogin).toLocaleDateString() : "Never"}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <Button variant="ghost" size="sm" onClick={() => handleToggleExpanded(admin.id)} className="flex-1">
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setModal({ mode: "edit", admin })} className="flex-1">
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
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
            ))}
          </div>
        </Card>
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