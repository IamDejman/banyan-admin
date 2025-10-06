"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AdminForm from "./AdminForm";
import type { Admin } from "@/lib/types/user";
import { formatStatus } from "@/lib/utils/text-formatting";

const initialMockAdmins: Admin[] = [
  {
    id: "1",
    email: "admin@banyan.com",
    firstName: "John",
    lastName: "Doe",
    phone: "+2348012345678",
    status: "active",
    createdAt: "2024-01-15",
    lastLogin: "2024-01-20T10:30:00Z",
    role: "admin",
    permissions: ["users:read", "users:write", "reports:read"],
    department: "IT",
    isSuperAdmin: true,
    assignedClaims: [],
    completedClaims: [],
  },
  {
    id: "2",
    email: "manager@banyan.com",
    firstName: "Jane",
    lastName: "Smith",
    phone: "+2348098765432",
    status: "active",
    createdAt: "2024-01-10",
    lastLogin: "2024-01-19T14:20:00Z",
    role: "admin",
    permissions: ["users:read", "reports:read"],
    department: "Operations",
    isSuperAdmin: false,
    assignedClaims: [],
    completedClaims: [],
  },
];

const mockPermissions = [
  { id: "users:read", name: "View Users", category: "Users" },
  { id: "users:write", name: "Manage Users", category: "Users" },
  { id: "reports:read", name: "View Reports", category: "Reports" },
  { id: "reports:write", name: "Generate Reports", category: "Reports" },
  { id: "system:config", name: "System Configuration", category: "System" },
];

export default function AdminsClient() {
  const [admins, setAdmins] = useState<Admin[]>(initialMockAdmins);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [modal, setModal] = useState<{ mode: "add" | "edit" | "view"; admin: Admin | null } | null>(null);

  const filtered = admins.filter((admin) => {
    const matchesSearch = 
      admin.firstName.toLowerCase().includes(search.toLowerCase()) ||
      admin.lastName.toLowerCase().includes(search.toLowerCase()) ||
      admin.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || admin.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  function handleAdd(adminData: { firstName: string; lastName: string; email: string; phoneNumber: string }) {
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
      department: "Administration",
      assignedClaims: [],
      completedClaims: []
    };
    setAdmins(prev => [...prev, newAdmin]);
    setModal(null);
  }

  function handleEdit(adminData: { firstName: string; lastName: string; email: string; phoneNumber: string }) {
    if (!modal?.admin) return;
    
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
  }

  function getPermissionNames(permissionIds: string[]) {
    return permissionIds
      .map(id => mockPermissions.find(p => p.id === id)?.name)
      .filter(Boolean)
      .join(", ");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Admins</h2>
        <Button onClick={() => setModal({ mode: "add", admin: null })}>Add Admin</Button>
      </div>
      
      <div className="flex gap-4 items-center">
        <Input
          placeholder="Search by name or email..."
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
      </div>

      <Card className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Permissions</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Login</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground">
                  No admins found.
                </TableCell>
              </TableRow>
            )}
            {filtered.map((admin) => (
              <TableRow key={admin.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{admin.firstName} {admin.lastName}</div>
                    {admin.isSuperAdmin && (
                      <Badge variant="destructive" className="text-xs">Super Admin</Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>{admin.email}</TableCell>
                <TableCell>{admin.department || "N/A"}</TableCell>
                <TableCell>
                  <div className="max-w-xs truncate" title={getPermissionNames(admin.permissions)}>
                    {getPermissionNames(admin.permissions)}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={admin.status === "active" ? "default" : "secondary"}>
                    {formatStatus(admin.status)}
                  </Badge>
                </TableCell>
                <TableCell>
                  {admin.lastLogin ? new Date(admin.lastLogin).toLocaleDateString() : "Never"}
                </TableCell>
                <TableCell>
                  <Button size="sm" variant="outline" onClick={() => setModal({ mode: "view", admin })}>
                    View
                  </Button>
                  <Button size="sm" variant="outline" className="ml-2" onClick={() => setModal({ mode: "edit", admin })}>
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
                <h3 className="text-lg font-semibold mb-4">Add Admin</h3>
                <AdminForm
                  admin={undefined}
                  onSubmit={handleAdd}
                  onCancel={() => setModal(null)}
                />
              </>
            )}
            {modal.mode === "edit" && (
              <>
                <h3 className="text-lg font-semibold mb-4">Edit Admin</h3>
                <AdminForm
                  admin={modal.admin!}
                  onSubmit={handleEdit}
                  onCancel={() => setModal(null)}
                />
              </>
            )}
            {modal.mode === "view" && (
              <>
                <h3 className="text-lg font-semibold mb-4">Admin Details</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="font-medium">Name:</span> {modal.admin!.firstName} {modal.admin!.lastName}
                    </div>
                    <div>
                      <span className="font-medium">Email:</span> {modal.admin!.email}
                    </div>
                    <div>
                      <span className="font-medium">Phone:</span> {modal.admin!.phone}
                    </div>
                    <div>
                      <span className="font-medium">Department:</span> {modal.admin!.department || "N/A"}
                    </div>
                    <div>
                      <span className="font-medium">Status:</span> 
                      <Badge variant={modal.admin!.status === "active" ? "default" : "secondary"} className="ml-2">
                        {modal.admin!.status}
                      </Badge>
                    </div>
                    <div>
                      <span className="font-medium">Super Admin:</span> 
                      <Badge variant={modal.admin!.isSuperAdmin ? "destructive" : "secondary"} className="ml-2">
                        {modal.admin!.isSuperAdmin ? "Yes" : "No"}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <span className="font-medium">Permissions:</span>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {modal.admin!.permissions.map(permId => {
                        const perm = mockPermissions.find(p => p.id === permId);
                        return perm ? (
                          <Badge key={permId} variant="outline">{perm.name}</Badge>
                        ) : null;
                      })}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="font-medium">Created:</span> {modal.admin!.createdAt}
                    </div>
                    <div>
                      <span className="font-medium">Last Login:</span> {modal.admin!.lastLogin ? new Date(modal.admin!.lastLogin).toLocaleString() : "Never"}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 justify-end mt-6">
                  <Button variant="outline" onClick={() => setModal(null)}>Close</Button>
                  <Button onClick={() => setModal({ mode: "edit", admin: modal.admin })}>Edit</Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 