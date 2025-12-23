"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Permission, Role } from "@/lib/types/permission";
import { getPermissions, getRoles } from "@/app/services/dashboard";

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
  const [permissions, setPermissions] = useState<Permission[]>(mockPermissions);
  const [roles, setRoles] = useState<Role[]>(mockRoles);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [modal, setModal] = useState<{ mode: "add" | "edit" | "view"; role: Role | null } | null>(null);
  const [formData, setFormData] = useState<{ name: string; description: string; permissions: string[] }>({
    name: "",
    description: "",
    permissions: [],
  });
  const [loading, setLoading] = useState(true);
  const [rolesLoading, setRolesLoading] = useState(true);

  // Fetch permissions from API
  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        setLoading(true);
        const response = await getPermissions();
        
        // Handle different possible response structures
        let permissionsData: Permission[] = [];
        if (response && typeof response === 'object' && 'data' in response) {
          if (Array.isArray(response.data)) {
            permissionsData = response.data;
          }
        } else if (Array.isArray(response)) {
          permissionsData = response;
        }
        
        // If API returns empty array, use mock data
        if (permissionsData.length === 0) {
          setPermissions(mockPermissions);
        } else {
          setPermissions(permissionsData);
        }
      } catch (error) {
        console.error('Error fetching permissions:', error);
        // Fall back to mock data on error
        setPermissions(mockPermissions);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPermissions();
  }, []);

  // Fetch roles from API
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        setRolesLoading(true);
        const response = await getRoles();
        
        // Handle different possible response structures
        let rolesData: Role[] = [];
        if (response && typeof response === 'object' && 'data' in response) {
          if (Array.isArray(response.data)) {
            // Map API roles to our Role interface
            rolesData = response.data.map((role: { id: number | string; name: string; description?: string; permissions?: Array<{ id?: string | number } | string>; is_default?: boolean; created_at?: string; updated_at?: string }) => ({
              id: role.id.toString(),
              name: role.name,
              description: role.description || `${role.name} role`,
              permissions: Array.isArray(role.permissions) ? role.permissions.map((p: { id?: string | number } | string) => (typeof p === 'object' ? p.id?.toString() : p) || '') : [],
              isDefault: role.is_default || false,
              createdAt: role.created_at || new Date().toISOString(),
              updatedAt: role.updated_at || new Date().toISOString(),
            }));
          }
        } else if (Array.isArray(response)) {
          // Direct array response
          rolesData = response.map((role: { id: number | string; name: string; description?: string; permissions?: Array<{ id?: string | number } | string>; is_default?: boolean; created_at?: string; updated_at?: string }) => ({
            id: role.id.toString(),
            name: role.name,
            description: role.description || `${role.name} role`,
            permissions: Array.isArray(role.permissions) ? role.permissions.map((p: { id?: string | number } | string) => (typeof p === 'object' ? p.id?.toString() : p) || '') : [],
            isDefault: role.is_default || false,
            createdAt: role.created_at || new Date().toISOString(),
            updatedAt: role.updated_at || new Date().toISOString(),
          }));
        }
        
        // If API returns data, use it; otherwise use mock data
        if (rolesData.length > 0) {
          setRoles(rolesData);
        } else {
          setRoles(mockRoles);
        }
      } catch (error) {
        console.error('Error fetching roles:', error);
        // Fall back to mock data on error
        setRoles(mockRoles);
      } finally {
        setRolesLoading(false);
      }
    };
    
    fetchRoles();
  }, []);

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
        <Card>
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
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
          </div>
          <div className="p-6">
            {loading ? (
              <div className="text-center py-8">
                <p className="text-sm text-muted-foreground">Loading permissions...</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-sm text-muted-foreground">No permissions found</p>
              </div>
            ) : (
              <div className="space-y-2">
                {filtered.map((permission) => (
                  <div key={permission.id} className="flex items-center justify-between py-2 px-3 rounded-md hover:bg-gray-50">
                    <div className="flex-1">
                      <div className="font-medium text-sm">{permission.name}</div>
                      <div className="text-xs text-muted-foreground">{permission.description}</div>
                    </div>
                    <div className="flex gap-1">
                      <Badge variant="secondary" className="text-xs px-2 py-0">
                        {permission.action}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>

        {/* Roles Section */}
        <Card>
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold">Roles</h3>
          </div>
          <div className="p-6">
            {rolesLoading ? (
              <div className="text-center py-8">
                <p className="text-sm text-muted-foreground">Loading roles...</p>
              </div>
            ) : roles.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-sm text-muted-foreground">No roles found</p>
              </div>
            ) : (
              <div className="space-y-3">
                {roles.map((role) => (
                  <div key={role.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-sm">{role.name}</h4>
                          {role.isDefault && (
                            <Badge variant="secondary" className="text-xs">Default</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{role.description}</p>
                        <div className="text-xs text-muted-foreground">
                          Created {new Date(role.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex gap-1 ml-4">
                        <Button size="sm" variant="ghost" onClick={() => { setModal({ mode: "view", role }); setFormData({ name: role.name, description: role.description, permissions: role.permissions }); }}>
                          View
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => { setModal({ mode: "edit", role }); setFormData({ name: role.name, description: role.description, permissions: role.permissions }); }}>
                          Edit
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleDeleteRole(role.id)} className="text-red-600 hover:text-red-700">
                          Delete
                        </Button>
                      </div>
                    </div>
                    <div className="mt-2">
                      <div className="text-xs text-muted-foreground mb-1">
                        {role.permissions.length} permissions
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
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