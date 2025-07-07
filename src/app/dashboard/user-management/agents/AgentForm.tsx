"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Agent } from "@/lib/types/user";

type AgentFormProps = {
  initialData: Partial<Agent>;
  onSave: (data: Omit<Agent, "id" | "createdAt">) => void;
  onCancel: () => void;
  specializations: string[];
};

export default function AgentForm({ initialData, onSave, onCancel, specializations }: AgentFormProps) {
  const [firstName, setFirstName] = useState(initialData?.firstName || "");
  const [lastName, setLastName] = useState(initialData?.lastName || "");
  const [email, setEmail] = useState(initialData?.email || "");
  const [phone, setPhone] = useState(initialData?.phone || "");
  const [employeeId, setEmployeeId] = useState(initialData?.employeeId || "");
  const [department, setDepartment] = useState(initialData?.department || "");
  const [supervisor, setSupervisor] = useState(initialData?.supervisor || "");
  const [status, setStatus] = useState<Agent["status"]>(initialData?.status || "active");
  const [selectedSpecializations, setSelectedSpecializations] = useState<string[]>(initialData?.specializations || []);
  const [performanceRating, setPerformanceRating] = useState<string>(initialData?.performanceRating?.toString() || "");
  const [error, setError] = useState<string | null>(null);

  const departments = ["Claims", "Customer Service", "Sales", "Underwriting", "Finance"];
  const supervisors = ["John Doe", "Jane Smith", "Mike Johnson", "Sarah Wilson"];

  function handleSpecializationToggle(spec: string) {
    setSelectedSpecializations(prev => 
      prev.includes(spec) 
        ? prev.filter(s => s !== spec)
        : [...prev, spec]
    );
  }

  function validate() {
    if (!firstName.trim()) return "First name is required";
    if (!lastName.trim()) return "Last name is required";
    if (!email.match(/^[^@\s]+@[^@\s]+\.[^@\s]+$/)) return "Valid email is required";
    if (!phone.match(/^\+?\d{7,15}$/)) return "Valid phone number is required";
    if (!employeeId.trim()) return "Employee ID is required";
    if (!department) return "Department is required";
    if (selectedSpecializations.length === 0) return "At least one specialization must be selected";
    if (performanceRating && (parseFloat(performanceRating) < 0 || parseFloat(performanceRating) > 5)) {
      return "Performance rating must be between 0 and 5";
    }
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
      employeeId: employeeId.trim(),
      department,
      supervisor: supervisor.trim() || undefined,
      status,
      specializations: selectedSpecializations,
      performanceRating: performanceRating ? parseFloat(performanceRating) : undefined,
      role: "agent",
      assignedClaims: [],
    });
  }

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
          <label className="font-medium">Employee ID *</label>
          <Input value={employeeId} onChange={e => setEmployeeId(e.target.value)} required />
        </div>
        <div className="flex flex-col gap-2">
          <label className="font-medium">Department *</label>
          <Select value={department} onValueChange={setDepartment}>
            <SelectTrigger>
              <SelectValue placeholder="Select department" />
            </SelectTrigger>
            <SelectContent>
              {departments.map(dept => (
                <SelectItem key={dept} value={dept}>{dept}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label className="font-medium">Supervisor</label>
          <Select value={supervisor} onValueChange={setSupervisor}>
            <SelectTrigger>
              <SelectValue placeholder="Select supervisor" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">No Supervisor</SelectItem>
              {supervisors.map(sup => (
                <SelectItem key={sup} value={sup}>{sup}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-2">
          <label className="font-medium">Status</label>
          <Select value={status} onValueChange={(value: Agent["status"]) => setStatus(value)}>
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

      <div className="flex flex-col gap-2">
        <label className="font-medium">Performance Rating (0-5)</label>
        <Input 
          value={performanceRating} 
          onChange={e => setPerformanceRating(e.target.value)} 
          type="number" 
          min="0" 
          max="5" 
          step="0.1"
          placeholder="e.g., 4.5"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-medium">Specializations *</label>
        <div className="flex flex-wrap gap-2">
          {specializations.map(spec => (
            <Badge
              key={spec}
              variant={selectedSpecializations.includes(spec) ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => handleSpecializationToggle(spec)}
            >
              {spec}
            </Badge>
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