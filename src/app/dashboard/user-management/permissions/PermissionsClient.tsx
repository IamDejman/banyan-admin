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
    name: "claims_view",
    displayName: "View Claims",
    description: "Can view claim details and status",
    category: "claims",
    resource: "claims",
    action: "read",
  },
  {
    id: "2",
    name: "claims_manage",
    displayName: "Manage Claims",
    description: "Can create, edit, and delete claims",
    category: "claims",
    resource: "claims",
    action: "write",
  },
  {
    id: "3",
    name: "claims_approve",
    displayName: "Approve Claims",
    description: "Can approve or reject claims",
    category: "claims",
    resource: "claims",
    action: "approve",
  },
  {
    id: "4",
    name: "users_view",
    displayName: "View Users",
    description: "Can view user profiles and information",
    category: "users",
    resource: "users",
    action: "read",
  },
  {
    id: "5",
    name: "users_manage",
    displayName: "Manage Users",
    description: "Can create, edit, and delete users",
    category: "users",
    resource: "users",
    action: "write",
  },
  {
    id: "6",
    name: "reports_view",
    displayName: "View Reports",
    description: "Can view system reports and analytics",
    category: "reports",
    resource: "reports",
    action: "read",
  },
  {
    id: "7",
    name: "reports_generate",
    displayName: "Generate Reports",
    description: "Can generate and export reports",
    category: "reports",
    resource: "reports",
    action: "write",
  },
  {
    id: "8",
    name: "system_config",
    displayName: "System Configuration",
    description: "Can modify system settings and configuration",
    category: "system",
    resource: "system",
    action: "write",
  },
];

const mockRoles: Role[] = [
  {
    id: "1",
    name: "super_admin",
    displayName: "Super Administrator",
    description: "Full system access with all permissions",
    permissions: mockPermissions.map(p => p.id),
    userCount: 2,
  },
  {
    id: "2",
    name: "admin",
    displayName: "Administrator",
    description: "Administrative access with most permissions",
    permissions: ["claims_view", "claims_manage", "claims_approve", "users_view", "reports_view", "reports_generate"],
    userCount: 5,
  },
  {
    id: "3",
    name: "agent",
    displayName: "Agent",
    description: "Standard agent access for claim processing",
    permissions: ["claims_view", "claims_manage", "reports_view"],
    userCount: 15,
  },
  {
    id: "4",
    name: "viewer",
    displayName: "Viewer",
    description: "Read-only access to view information",
    permissions: ["claims_view", "users_view", "reports_view"],
    userCount: 8,
  },
];

export default function PermissionsClient() {
  const [permissions] = useState<Permission[]>(mockPermissions);
  const [roles, setRoles] = useState<Role[]>(mockRoles);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [modal, setModal] = useState<{ mode: "add" | "edit" | "view"; role: Role | null } | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    displayName: "",
    description: "",
    permissions: [] as string[],
  });

  const filtered = permissions.filter((permission) => {
    return categoryFilter === "all" || permission.category === categoryFilter;
  });

  function handleAddRole() {
    if (!formData.name || !formData.displayName || !formData.description) {
      return;
    }
    const newRole: Role = {
      id: (Math.random() * 100000).toFixed(0),
      ...formData,
      userCount: 0,
    };
    setRoles(prev => [newRole, ...prev]);
    setFormData({ name: "", displayName: "", description: "", permissions: [] });
    setModal(null);
  }

  function handleEditRole() {
    if (!modal?.role || !formData.name || !formData.displayName || !formData.description) {
      return;
    }
    setRoles(prev => prev.map(role => 
      role.id === modal.role!.id 
        ? { ...role, ...formData }
        : role
    ));
    setFormData({ name: "", displayName: "", description: "", permissions: [] });
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
        <Button onClick={() => { setModal({ mode: "add", role: null }); setFormData({ name: "", displayName: "", description: "", permissions: [] }); }}>
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
                  <div className="font-medium">{permission.displayName}</div>
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
                    <div className="font-medium">{role.displayName}</div>
                    <div className="text-sm text-muted-foreground">{role.description}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {role.userCount} users assigned
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => { setModal({ mode: "view", role }); setFormData({ name: role.name, displayName: role.displayName, description: role.description, permissions: role.permissions }); }}>
                      View
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => { setModal({ mode: "edit", role }); setFormData({ name: role.name, displayName: role.displayName, description: role.description, permissions: role.permissions }); }}>
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
                        {permission.displayName}
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
            <form onSubmit={e => { e.preventDefault(); modal.mode === "add" ? handleAddRole() : handleEditRole(); }} className="space-y-4">
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
                <label className="block text-sm font-medium mb-1">Display Name</label>
                <input
                  type="text"
                  value={formData.displayName}
                  onChange={e => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
                  placeholder="Display name (e.g., Administrator)"
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
                      <span className="text-sm">{permission.displayName}</span>
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