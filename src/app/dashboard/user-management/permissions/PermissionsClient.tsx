"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Permission, Role } from "@/lib/types/permission";

const mockPermissions: Permission[] = [
  {
    id: "1",
    name: "View Claims",
    description: "Can view claim details and status",
    resource: "claims",
    action: "read",
    category: "claims",
  },
  {
    id: "2",
    name: "Manage Claims",
    description: "Can create, update, and delete claims",
    resource: "claims",
    action: "write",
    category: "claims",
  },
  {
    id: "3",
    name: "Approve Claims",
    description: "Can approve or reject claims",
    resource: "claims",
    action: "approve",
    category: "claims",
  },
  {
    id: "4",
    name: "View Users",
    description: "Can view user profiles and information",
    resource: "users",
    action: "read",
    category: "users",
  },
  {
    id: "5",
    name: "Manage Users",
    description: "Can create, update, and delete users",
    resource: "users",
    action: "write",
    category: "users",
  },
  {
    id: "6",
    name: "View Reports",
    description: "Can view system reports and analytics",
    resource: "reports",
    action: "read",
    category: "reports",
  },
  {
    id: "7",
    name: "Generate Reports",
    description: "Can generate and export reports",
    resource: "reports",
    action: "write",
    category: "reports",
  },
  {
    id: "8",
    name: "System Configuration",
    description: "Can modify system settings and configuration",
    resource: "system",
    action: "write",
    category: "system",
  },
];

const mockRoles: Role[] = [
  {
    id: "1",
    name: "super-admin",
    description: "Full system access with all permissions",
    permissions: ["1", "2", "3", "4", "5", "6", "7", "8"],
    isDefault: false,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "2",
    name: "admin",
    description: "Administrative access with most permissions",
    permissions: ["1", "2", "3", "4", "5", "6", "7"],
    isDefault: false,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "3",
    name: "agent",
    description: "Agent access for claim processing",
    permissions: ["1", "2", "3"],
    isDefault: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "4",
    name: "viewer",
    description: "Read-only access to view information",
    permissions: ["1", "4", "6"],
    isDefault: false,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
];

export default function PermissionsClient() {
  const [permissions] = useState<Permission[]>(mockPermissions);
  const [roles, setRoles] = useState<Role[]>(mockRoles);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [modal, setModal] = useState<{ mode: "add" | "edit" | "view"; role: Role | null } | null>(null);
  const [formData, setFormData] = useState<{ name: string; description: string; permissions: string[] }>({
    name: "",
    description: "",
    permissions: [],
  });

  const filtered = permissions.filter((permission) => {
    return categoryFilter === "all" || permission.category === categoryFilter;
  });

  function handleAddRole() {
    if (!formData.name || !formData.description) {
      return;
    }
    const newRole: Role = {
      id: (Math.random() * 100000).toFixed(0),
      ...formData,
      isDefault: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setRoles(prev => [newRole, ...prev]);
    setFormData({ name: "", description: "", permissions: [] });
    setModal(null);
  }

  function handleEditRole() {
    if (!modal?.role || !formData.name || !formData.description) {
      return;
    }
    setRoles(prev => prev.map(role => 
      role.id === modal.role!.id 
        ? { ...role, ...formData }
        : role
    ));
    setFormData({ name: "", description: "", permissions: [] });
    setModal(null);
  }

  function handleDeleteRole(roleId: string) {
    setRoles(prev => prev.filter(role => role.id !== roleId));
  }

  function getCategoryColor(category: string) {
    switch (category) {
      case "claims": return "default";
      case "users": return "secondary";
      case "reports": return "destructive";
      case "system": return "outline";
      default: return "outline";
    }
  }

  function getActionColor(action: string) {
    switch (action) {
      case "read": return "default";
      case "write": return "secondary";
      case "approve": return "destructive";
      default: return "outline";
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Permissions & Roles</h2>
        <Button onClick={() => { setModal({ mode: "add", role: null }); setFormData({ name: "", description: "", permissions: [] }); }}>
          Add Role
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Permissions Section */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Permissions</h3>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="claims">Claims</SelectItem>
                <SelectItem value="users">Users</SelectItem>
                <SelectItem value="reports">Reports</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filtered.map((permission) => (
              <div key={permission.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="font-medium">{permission.name}</div>
                  <div className="text-sm text-muted-foreground">{permission.description}</div>
                  <div className="flex gap-2 mt-1">
                    <Badge variant={getCategoryColor(permission.category)}>
                      {permission.category}
                    </Badge>
                    <Badge variant={getActionColor(permission.action)}>
                      {permission.action}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Roles Section */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Roles</h3>
          <div className="space-y-4">
            {roles.map((role) => (
              <div key={role.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="font-medium">{role.name}</div>
                    <div className="text-sm text-muted-foreground">{role.description}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Role created {new Date(role.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => { setModal({ mode: "view", role }); setFormData({ name: role.name, description: role.description, permissions: role.permissions }); }}>
                      View
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => { setModal({ mode: "edit", role }); setFormData({ name: role.name, description: role.description, permissions: role.permissions }); }}>
                      Edit
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDeleteRole(role.id)}>
                      Delete
                    </Button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1">
                  {role.permissions.slice(0, 3).map((permissionId) => {
                    const permission = permissions.find(p => p.id === permissionId);
                    return permission ? (
                      <Badge key={permissionId} variant="outline" className="text-xs">
                        {permission.name}
                      </Badge>
                    ) : null;
                  })}
                  {role.permissions.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{role.permissions.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Role Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
          <div className="bg-white rounded shadow-lg p-6 w-full max-w-md relative max-h-[90vh] overflow-y-auto">
            <Button
              size="icon"
              variant="ghost"
              className="absolute top-2 right-2"
              onClick={() => setModal(null)}
              aria-label="Close"
            >
              ✕
            </Button>
            <h3 className="text-lg font-semibold mb-4">
              {modal.mode === "add" ? "Add Role" : modal.mode === "edit" ? "Edit Role" : "Role Details"}
            </h3>
            <form onSubmit={e => { e.preventDefault(); if (modal.mode === "add") { handleAddRole(); } else { handleEditRole(); } }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Role name (e.g., admin)"
                  disabled={modal.mode === "view"}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Role description"
                  disabled={modal.mode === "view"}
                  className="w-full px-3 py-2 border rounded-md"
                  rows={3}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Permissions</label>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {permissions.map((permission) => (
                    <label key={permission.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.permissions.includes(permission.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData(prev => ({ ...prev, permissions: [...prev.permissions, permission.id] }));
                          } else {
                            setFormData(prev => ({ ...prev, permissions: prev.permissions.filter(p => p !== permission.id) }));
                          }
                        }}
                        disabled={modal.mode === "view"}
                        className="rounded"
                      />
                      <span className="text-sm">{permission.name}</span>
                    </label>
                  ))}
                </div>
              </div>
              {modal.mode !== "view" && (
                <div className="flex gap-2 justify-end">
                  <Button type="button" variant="outline" onClick={() => setModal(null)}>Cancel</Button>
                  <Button type="submit">{modal.mode === "add" ? "Add Role" : "Update Role"}</Button>
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 