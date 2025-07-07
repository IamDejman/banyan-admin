"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import type { Insurer } from "@/lib/types/insurer";

interface InsurerFormProps {
  insurer?: Insurer;
  onSubmit: (insurer: Omit<Insurer, "id">) => void;
  onCancel: () => void;
}

export default function InsurerForm({ insurer, onSubmit, onCancel }: InsurerFormProps) {
  const [name, setName] = useState(insurer?.name || "");
  const [description, setDescription] = useState(insurer?.description || "");
  const [website, setWebsite] = useState(insurer?.website || "");
  const [phone, setPhone] = useState(insurer?.phone || "");
  const [email, setEmail] = useState(insurer?.email || "");
  const [address, setAddress] = useState(insurer?.address || "");
  const [logoUrl, setLogoUrl] = useState(insurer?.logoUrl || "");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const editor = useEditor({
    extensions: [StarterKit],
    content: insurer?.description || "",
    onUpdate: ({ editor }) => {
      setDescription(editor.getHTML());
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!name.trim()) newErrors.name = "Name is required";
    if (!description.trim()) newErrors.description = "Description is required";
    if (!website.trim()) newErrors.website = "Website is required";
    if (!phone.trim()) newErrors.phone = "Phone is required";
    if (!email.trim()) newErrors.email = "Email is required";
    if (!address.trim()) newErrors.address = "Address is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit({
      name: name.trim(),
      description: description.trim(),
      website: website.trim(),
      phone: phone.trim(),
      email: email.trim(),
      address: address.trim(),
      logoUrl: logoUrl.trim(),
      status: insurer?.status || "active",
    });
  }

  function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      // Mock file upload - in real app, upload to server
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoUrl(e.target?.result as string);
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
            <Label htmlFor="website">Website *</Label>
            <Input
              id="website"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://example.com"
              className={errors.website ? "border-red-500" : ""}
            />
            {errors.website && <p className="text-red-500 text-sm mt-1">{errors.website}</p>}
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
            {logoUrl && (
              <div className="mt-2">
                <Image 
                  src={logoUrl} 
                  alt="Logo preview" 
                  width={80}
                  height={80}
                  className="h-20 w-auto object-contain" 
                />
              </div>
            )}
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="description">Description *</Label>
            <div className="border rounded-md p-3 min-h-[200px]">
              <EditorContent editor={editor} />
            </div>
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
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