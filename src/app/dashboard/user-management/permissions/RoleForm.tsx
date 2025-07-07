"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import type { Role, Permission } from "@/lib/types/permission";

type RoleFormProps = {
  initialData: Partial<Role>;
  onSave: (data: Omit<Role, "id" | "createdAt" | "updatedAt">) => void;
  onCancel: () => void;
  permissions: Permission[];
};

export default function RoleForm({ initialData, onSave, onCancel, permissions }: RoleFormProps) {
  const [name, setName] = useState(initialData?.name || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>(initialData?.permissions || []);
  const [isDefault, setIsDefault] = useState(initialData?.isDefault || false);
  const [error, setError] = useState<string | null>(null);

  function handlePermissionToggle(permissionId: string) {
    setSelectedPermissions(prev => 
      prev.includes(permissionId) 
        ? prev.filter(id => id !== permissionId)
        : [...prev, permissionId]
    );
  }

  function validate() {
    if (!name.trim()) return "Role name is required";
    if (!description.trim()) return "Description is required";
    if (selectedPermissions.length === 0) return "At least one permission must be selected";
    return null;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const err = validate();
    if (err) {
      setError(err);
      return;
    }
    setError(null);
    onSave({
      name: name.trim(),
      description: description.trim(),
      permissions: selectedPermissions,
      isDefault,
    });
  }

  const permissionsByCategory = permissions.reduce((acc, perm) => {
    if (!acc[perm.category]) acc[perm.category] = [];
    acc[perm.category].push(perm);
    return acc;
  }, {} as Record<string, Permission[]>);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex flex-col gap-2">
        <label className="font-medium">Role Name *</label>
        <Input value={name} onChange={e => setName(e.target.value)} required />
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-medium">Description *</label>
        <Textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} required />
      </div>

      <div className="flex items-center gap-4">
        <label className="font-medium">Default Role</label>
        <Switch checked={isDefault} onCheckedChange={setIsDefault} />
        <span className="text-sm text-muted-foreground">
          {isDefault ? "This role will be assigned to new users by default" : "Standard role assignment"}
        </span>
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-medium">Permissions *</label>
        <div className="space-y-4">
          {Object.entries(permissionsByCategory).map(([category, perms]) => (
            <div key={category}>
              <h4 className="font-medium text-sm text-muted-foreground mb-2">{category}</h4>
              <div className="flex flex-wrap gap-2">
                {perms.map(perm => (
                  <Badge
                    key={perm.id}
                    variant={selectedPermissions.includes(perm.id) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => handlePermissionToggle(perm.id)}
                  >
                    {perm.name}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {error && <div className="text-red-600 text-sm">{error}</div>}

      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit">Save</Button>
      </div>
    </form>
  );
} 