"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Customer } from "@/lib/types/user";

type CustomerFormProps = {
  initialData: Partial<Customer>;
  onSave: (data: Omit<Customer, "id" | "createdAt">) => void;
  onCancel: () => void;
};

export default function CustomerForm({ initialData, onSave, onCancel }: CustomerFormProps) {
  const [firstName, setFirstName] = useState(initialData?.firstName || "");
  const [lastName, setLastName] = useState(initialData?.lastName || "");
  const [email, setEmail] = useState(initialData?.email || "");
  const [phone, setPhone] = useState(initialData?.phone || "");
  const [dateOfBirth, setDateOfBirth] = useState(initialData?.dateOfBirth || "");
  const [address, setAddress] = useState(initialData?.address || "");
  const [status, setStatus] = useState<Customer["status"]>(initialData?.status || "active");
  
  // Emergency contact
  const [hasEmergencyContact, setHasEmergencyContact] = useState(!!initialData?.emergencyContact);
  const [emergencyName, setEmergencyName] = useState(initialData?.emergencyContact?.name || "");
  const [emergencyPhone, setEmergencyPhone] = useState(initialData?.emergencyContact?.phone || "");
  const [emergencyRelationship, setEmergencyRelationship] = useState(initialData?.emergencyContact?.relationship || "");
  
  // Preferences
  const [notifications, setNotifications] = useState(initialData?.preferences?.notifications ?? true);
  const [language, setLanguage] = useState(initialData?.preferences?.language || "English");
  
  const [error, setError] = useState<string | null>(null);

  const languages = ["English", "French", "Spanish", "Arabic", "Chinese"];
  const relationships = ["Spouse", "Parent", "Child", "Sibling", "Friend", "Other"];

  function validate() {
    if (!firstName.trim()) return "First name is required";
    if (!lastName.trim()) return "Last name is required";
    if (!email.match(/^[^@\s]+@[^@\s]+\.[^@\s]+$/)) return "Valid email is required";
    if (!phone.match(/^\+?\d{7,15}$/)) return "Valid phone number is required";
    if (!dateOfBirth) return "Date of birth is required";
    if (!address.trim()) return "Address is required";
    if (hasEmergencyContact) {
      if (!emergencyName.trim()) return "Emergency contact name is required";
      if (!emergencyPhone.match(/^\+?\d{7,15}$/)) return "Valid emergency contact phone is required";
      if (!emergencyRelationship) return "Emergency contact relationship is required";
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
      dateOfBirth,
      address: address.trim(),
      status,
      emergencyContact: hasEmergencyContact ? {
        name: emergencyName.trim(),
        phone: emergencyPhone.trim(),
        relationship: emergencyRelationship,
      } : undefined,
      preferences: {
        notifications,
        language,
      },
      role: "customer",
      claims: [],
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
          <label className="font-medium">Date of Birth *</label>
          <Input value={dateOfBirth} onChange={e => setDateOfBirth(e.target.value)} type="date" required />
        </div>
        <div className="flex flex-col gap-2">
          <label className="font-medium">Status</label>
          <Select value={status} onValueChange={(value: Customer["status"]) => setStatus(value)}>
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
        <label className="font-medium">Address *</label>
        <Textarea value={address} onChange={e => setAddress(e.target.value)} rows={3} required />
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <label className="font-medium">Emergency Contact</label>
          <Switch checked={hasEmergencyContact} onCheckedChange={setHasEmergencyContact} />
          <span className="text-sm text-muted-foreground">
            {hasEmergencyContact ? "Include emergency contact" : "No emergency contact"}
          </span>
        </div>
        
        {hasEmergencyContact && (
          <div className="grid grid-cols-3 gap-4 pl-4 border-l-2 border-muted">
            <div className="flex flex-col gap-2">
              <label className="font-medium">Name *</label>
              <Input value={emergencyName} onChange={e => setEmergencyName(e.target.value)} required />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-medium">Phone *</label>
              <Input value={emergencyPhone} onChange={e => setEmergencyPhone(e.target.value)} type="tel" required />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-medium">Relationship *</label>
              <Select value={emergencyRelationship} onValueChange={setEmergencyRelationship}>
                <SelectTrigger>
                  <SelectValue placeholder="Select relationship" />
                </SelectTrigger>
                <SelectContent>
                  {relationships.map(rel => (
                    <SelectItem key={rel} value={rel}>{rel}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <h4 className="font-medium">Preferences</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-4">
            <label className="font-medium">Notifications</label>
            <Switch checked={notifications} onCheckedChange={setNotifications} />
            <span className="text-sm text-muted-foreground">
              {notifications ? "Receive notifications" : "No notifications"}
            </span>
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-medium">Language</label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {languages.map(lang => (
                  <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
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