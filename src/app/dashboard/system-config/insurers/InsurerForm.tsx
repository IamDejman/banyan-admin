"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import type { Insurer } from "@/lib/types/insurer";

interface InsurerFormProps {
  insurer?: Insurer;
  onSubmit: (insurer: Omit<Insurer, "id">) => void;
  onCancel: () => void;
}

export default function InsurerForm({ insurer, onSubmit, onCancel }: InsurerFormProps) {
  const [name, setName] = useState(insurer?.name || "");
  const [logo, setLogo] = useState<string | null>(insurer?.logo || null);
  const [email, setEmail] = useState(insurer?.email || "");
  const [phone, setPhone] = useState(insurer?.phone || "");
  const [address, setAddress] = useState(insurer?.address || "");
  const [claimTypes] = useState<string[]>(insurer?.claimTypes || []);
  const [instructions, setInstructions] = useState(insurer?.instructions || "");
  const [status] = useState<boolean>(insurer?.status ?? true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = "Name is required";
    if (!email.trim()) newErrors.email = "Email is required";
    if (!phone.trim()) newErrors.phone = "Phone is required";
    if (!address.trim()) newErrors.address = "Address is required";
    if (!instructions.trim()) newErrors.instructions = "Instructions are required";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    onSubmit({
      name: name.trim(),
      logo,
      email: email.trim(),
      phone: phone.trim(),
      address: address.trim(),
      claimTypes,
      instructions: instructions.trim(),
      status,
    });
  }

  function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      // Mock file upload - in real app, upload to server
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogo(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

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
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="contact@insurer.com"
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          <div>
            <Label htmlFor="phone">Phone *</Label>
            <Input
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 (555) 123-4567"
              className={errors.phone ? "border-red-500" : ""}
            />
            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
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
            <Label htmlFor="instructions">Instructions *</Label>
            <Textarea
              id="instructions"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="Instructions for this insurer"
              className={errors.instructions ? "border-red-500" : ""}
            />
            {errors.instructions && <p className="text-red-500 text-sm mt-1">{errors.instructions}</p>}
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