"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import type { Insurer } from "@/lib/types/insurer";
import type { ClaimType } from "@/lib/types/claim-types";

interface InsurerFormProps {
  insurer?: Insurer;
  claimTypes: ClaimType[];
  onSubmit: (insurer: Omit<Insurer, "id">) => void;
  onCancel: () => void;
}

export default function InsurerForm({ insurer, claimTypes, onSubmit, onCancel }: InsurerFormProps) {
  const [name, setName] = useState(insurer?.name || "");
  const [logo, setLogo] = useState<string | null>(insurer?.logo || null);
  const [contact_email, setContactEmail] = useState(insurer?.contact_email || "");
  const [contact_phone, setContactPhone] = useState(insurer?.contact_phone || "");
  const [address, setAddress] = useState(insurer?.address || "");
  const [supported_claim_types, setSupportedClaimTypes] = useState<string[]>(insurer?.supported_claim_types || []);
  const [special_instructions, setSpecialInstructions] = useState(insurer?.special_instructions || "");
  const [status] = useState<boolean>(insurer?.status ?? true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = "Name is required";
    if (!contact_email.trim()) newErrors.contact_email = "Contact email is required";
    if (!contact_phone.trim()) newErrors.contact_phone = "Contact phone is required";
    if (!address.trim()) newErrors.address = "Address is required";
    if (supported_claim_types.length === 0) newErrors.supported_claim_types = "At least one supported claim type is required";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    onSubmit({
      name: name.trim(),
      logo,
      contact_email: contact_email.trim(),
      contact_phone: contact_phone.trim(),
      address: address.trim(),
      supported_claim_types,
      special_instructions: special_instructions.trim(),
      status,
    });
  }

  function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      // File upload - upload to server
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogo(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  function handleAddClaimType(claimTypeId: string) {
    if (!supported_claim_types.includes(claimTypeId)) {
      setSupportedClaimTypes([...supported_claim_types, claimTypeId]);
    }
  }

  function handleRemoveClaimType(claimTypeId: string) {
    setSupportedClaimTypes(supported_claim_types.filter(id => id !== claimTypeId));
  }

  const availableClaimTypes = claimTypes.filter(ct => !supported_claim_types.includes(ct.id.toString()));

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Insurer name"
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          <div>
            <Label htmlFor="contact_email">Contact Email *</Label>
            <Input
              id="contact_email"
              type="email"
              value={contact_email}
              onChange={(e) => setContactEmail(e.target.value)}
              placeholder="contact@insurer.com"
              className={errors.contact_email ? "border-red-500" : ""}
            />
            {errors.contact_email && <p className="text-red-500 text-sm mt-1">{errors.contact_email}</p>}
          </div>

          <div>
            <Label htmlFor="contact_phone">Contact Phone *</Label>
            <Input
              id="contact_phone"
              value={contact_phone}
              onChange={(e) => setContactPhone(e.target.value)}
              placeholder="+1 (555) 123-4567"
              className={errors.contact_phone ? "border-red-500" : ""}
            />
            {errors.contact_phone && <p className="text-red-500 text-sm mt-1">{errors.contact_phone}</p>}
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="address">Address *</Label>
            <Textarea
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Full address"
              className={errors.address ? "border-red-500" : ""}
            />
            {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="logo">Logo</Label>
            <Input
              id="logo"
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              className="cursor-pointer"
            />
            {logo && (
              <div className="mt-2">
                <Image
                  src={logo}
                  alt="Logo preview"
                  width={80}
                  height={80}
                  className="h-20 w-auto object-contain"
                />
              </div>
            )}
          </div>

          <div className="md:col-span-2">
            <Label>Supported Claim Types *</Label>
            <div className="space-y-2">
              <Select onValueChange={handleAddClaimType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select claim types to support" />
                </SelectTrigger>
                <SelectContent>
                  {availableClaimTypes.map((claimType) => (
                    <SelectItem key={claimType.id} value={claimType.id.toString()}>
                      {claimType.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {supported_claim_types.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {supported_claim_types.map((claimTypeId) => {
                    const claimType = claimTypes.find(ct => ct.id === claimTypeId);
                    return claimType ? (
                      <Badge key={claimTypeId} variant="secondary" className="flex items-center gap-1">
                        {claimType.name}
                        <button
                          type="button"
                          onClick={() => handleRemoveClaimType(claimTypeId)}
                          className="ml-1 hover:text-red-500"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ) : null;
                  })}
                </div>
              )}

              {errors.supported_claim_types && (
                <p className="text-red-500 text-sm">{errors.supported_claim_types}</p>
              )}
            </div>
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="special_instructions">Special Instructions</Label>
            <Textarea
              id="special_instructions"
              value={special_instructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder="Special instructions for this insurer"
            />
          </div>
        </div>

        <div className="flex gap-2 justify-end">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {insurer ? "Update Insurer" : "Create Insurer"}
          </Button>
        </div>
      </form>
    </Card>
  );
} 