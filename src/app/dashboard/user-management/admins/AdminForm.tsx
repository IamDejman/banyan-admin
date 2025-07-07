"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Admin } from "@/lib/types/user";

type Permission = {
  id: string;
  name: string;
  category: string;
};

type AdminFormProps = {
  initialData: Partial<Admin>;
  onSave: (data: Omit<Admin, "id" | "createdAt">) => void;
  onCancel: () => void;
  permissions: Permission[];
};

export default function AdminForm({ initialData, onSave, onCancel, permissions }: AdminFormProps) {
  const [firstName, setFirstName] = useState(initialData?.firstName || "");
  const [lastName, setLastName] = useState(initialData?.lastName || "");
  const [email, setEmail] = useState(initialData?.email || "");
  const [phone, setPhone] = useState(initialData?.phone || "");
  const [department, setDepartment] = useState(initialData?.department || "");
  const [status, setStatus] = useState<Admin["status"]>(initialData?.status || "active");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>(initialData?.permissions || []);
  const [isSuperAdmin, setIsSuperAdmin] = useState(initialData?.isSuperAdmin || false);
  const [error, setError] = useState<string | null>(null);

  const departments = ["IT", "Operations", "Finance", "HR", "Legal", "Marketing"];

  function handlePermissionToggle(permissionId: string) {
    setSelectedPermissions(prev => 
      prev.includes(permissionId) 
        ? prev.filter(id => id !== permissionId)
        : [...prev, permissionId]
    );
  }

  function validate() {
    if (!firstName.trim()) return "First name is required";
    if (!lastName.trim()) return "Last name is required";
    if (!email.match(/^[^@\s]+@[^@\s]+\.[^@\s]+$/)) return "Valid email is required";
    if (!phone.match(/^\+?\d{7,15}$/)) return "Valid phone number is required";
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
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      department: department.trim() || undefined,
      status,
      permissions: selectedPermissions,
      isSuperAdmin,
      role: "admin",
    });
  }

  const permissionsByCategory = permissions.reduce((acc, perm) => {
    if (!acc[perm.category]) acc[perm.category] = [];
    acc[perm.category].push(perm);
    return acc;
  }, {} as Record<string, Permission[]>);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label className="font-medium">First Name *</label>
          <Input value={firstName} onChange={e => setFirstName(e.target.value)} required />
        </div>
        <div className="flex flex-col gap-2">
          <label className="font-medium">Last Name *</label>
          <Input value={lastName} onChange={e => setLastName(e.target.value)} required />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label className="font-medium">Email *</label>
          <Input value={email} onChange={e => setEmail(e.target.value)} type="email" required />
        </div>
        <div className="flex flex-col gap-2">
          <label className="font-medium">Phone *</label>
          <Input value={phone} onChange={e => setPhone(e.target.value)} type="tel" required />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label className="font-medium">Department</label>
          <Select value={department} onValueChange={setDepartment}>
            <SelectTrigger>
              <SelectValue placeholder="Select department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">No Department</SelectItem>
              {departments.map(dept => (
                <SelectItem key={dept} value={dept}>{dept}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-2">
          <label className="font-medium">Status</label>
          <Select value={status} onValueChange={(value: Admin["status"]) => setStatus(value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <label className="font-medium">Super Admin</label>
        <Switch checked={isSuperAdmin} onCheckedChange={setIsSuperAdmin} />
        <span className="text-sm text-muted-foreground">
          {isSuperAdmin ? "Has full system access" : "Standard admin access"}
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