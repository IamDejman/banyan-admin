"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Permission } from "@/lib/types/permission";

type PermissionFormProps = {
  initialData: Partial<Permission>;
  onSave: (data: Omit<Permission, "id">) => void;
  onCancel: () => void;
};

export default function PermissionForm({ initialData, onSave, onCancel }: PermissionFormProps) {
  const [name, setName] = useState(initialData?.name || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [resource, setResource] = useState(initialData?.resource || "");
  const [action, setAction] = useState(initialData?.action || "");
  const [category, setCategory] = useState(initialData?.category || "");
  const [error, setError] = useState<string | null>(null);

  const resources = ["users", "claims", "reports", "system", "documents", "settlements"];
  const actions = ["read", "write", "delete", "config", "approve", "reject"];
  const categories = ["Users", "Claims", "Reports", "System", "Documents", "Settlements"];

  function validate() {
    if (!name.trim()) return "Permission name is required";
    if (!description.trim()) return "Description is required";
    if (!resource) return "Resource is required";
    if (!action) return "Action is required";
    if (!category) return "Category is required";
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
      resource,
      action,
      category,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex flex-col gap-2">
        <label className="font-medium">Permission Name *</label>
        <Input value={name} onChange={e => setName(e.target.value)} required />
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-medium">Description *</label>
        <Textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} required />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label className="font-medium">Resource *</label>
          <Select value={resource} onValueChange={setResource}>
            <SelectTrigger>
              <SelectValue placeholder="Select resource" />
            </SelectTrigger>
            <SelectContent>
              {resources.map(res => (
                <SelectItem key={res} value={res}>{res}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-2">
          <label className="font-medium">Action *</label>
          <Select value={action} onValueChange={setAction}>
            <SelectTrigger>
              <SelectValue placeholder="Select action" />
            </SelectTrigger>
            <SelectContent>
              {actions.map(act => (
                <SelectItem key={act} value={act}>{act}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-medium">Category *</label>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map(cat => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {error && <div className="text-red-600 text-sm">{error}</div>}

      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit">Save</Button>
      </div>
    </form>
  );
} 