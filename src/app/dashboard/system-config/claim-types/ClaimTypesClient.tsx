"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { X, Plus } from "lucide-react";
import type { ClaimType } from "@/lib/types/claim-types";
import { getClaimTypes } from "@/app/services/dashboard";

type ModalState = { mode: "add" | "edit"; claimType: ClaimType | null } | null;

export default function ClaimTypesClient() {
  const [claimTypes, setClaimTypes] = useState<ClaimType[]>([]);
  const [modal, setModal] = useState<ModalState>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const filtered = claimTypes.filter((ct) =>
    ct.name.toLowerCase().includes(search.toLowerCase()) ||
    ct.description.toLowerCase().includes(search.toLowerCase())
  );

  function handleAdd(newClaimType: Omit<ClaimType, "id">) {
    setClaimTypes(prev => [
      { ...newClaimType, id: (Math.random() * 100000).toFixed(0) },
      ...prev,
    ]);
    setModal(null);
  }

  function handleEdit(updated: Omit<ClaimType, "id">) {
    setClaimTypes(prev => prev.map(ct => ct.id === modal?.claimType?.id ? { ...ct, ...updated } : ct));
    setModal(null);
  }

  function handleDelete(id: string | number) {
    setClaimTypes(prev => prev.filter(ct => ct.id !== id));
  }

  function handleStatusToggle(id: string | number) {
    setClaimTypes(prev => prev.map(ct =>
      ct.id === id ? { ...ct, active: ct.active === 1 ? 0 : 1 } : ct
    ));
  }

  // Helper function to format data for display
  function formatData(value: any, type: 'documents' | 'text' = 'text'): string {
    if (value === null || value === undefined || value === '') {
      return 'N/A';
    }

    if (type === 'documents' && Array.isArray(value)) {
      return value.length > 0 ? value.join(', ') : 'N/A';
    }

    return String(value);
  }

  // Helper function to get status text
  function getStatusText(active: number): string {
    return active === 1 ? 'Active' : 'Inactive';
  }

  useEffect(() => {
    setLoading(true);
    getClaimTypes().then((res: any) => {
      if (res && res.data) {
        // Map API response to component format
        const mappedData = res.data.map((item: any) => ({
          ...item,
          status: item.active === 1 ? "active" : "inactive" // For UI compatibility
        }));
        setClaimTypes(mappedData);
      }
      setLoading(false);
    }).catch((error) => {
      console.error('Error fetching claim types:', error);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="text-xl sm:text-2xl font-bold">Claim Types</h2>
        </div>
        <div className="text-center py-8">
          <p className="text-muted-foreground">Loading claim types...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-xl sm:text-2xl font-bold">Claim Types</h2>
        <Button onClick={() => setModal({ mode: "add", claimType: null })}>
          Add Claim Type
        </Button>
      </div>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:gap-4">
          <Input
            placeholder="Search claim types..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full lg:w-64"
          />
        </div>
      </div>

      <Card className="overflow-x-auto">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-20 sm:w-auto">Name</TableHead>
                <TableHead className="hidden sm:table-cell">Code</TableHead>
                <TableHead className="hidden sm:table-cell">Description</TableHead>
                <TableHead className="hidden lg:table-cell">Required Documents</TableHead>
                <TableHead className="hidden md:table-cell">Processing Time</TableHead>
                <TableHead className="hidden sm:table-cell">Status</TableHead>
                <TableHead className="w-20 sm:w-auto">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <div className="text-center">
                      <X className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">No claim types found</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((claimType) => (
                  <TableRow key={claimType.id}>
                    <TableCell className="font-medium text-sm sm:text-base">{claimType.name}</TableCell>
                    <TableCell className="hidden sm:table-cell text-xs sm:text-sm">
                      {claimType.code}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-xs sm:text-sm">
                      {claimType.description}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {claimType.required_documents && claimType.required_documents.length > 0 ? (
                          claimType.required_documents.map((doc, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {doc}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-muted-foreground text-xs">N/A</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-xs sm:text-sm">
                      {formatData(claimType.processing_time_estimate)}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <div className="flex items-center gap-2">
                        <Switch checked={claimType.active === 1} onCheckedChange={() => handleStatusToggle(claimType.id)} />
                        <span className="text-xs">{getStatusText(claimType.active)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1 sm:gap-2">
                        <Button size="sm" variant="outline" onClick={() => setModal({ mode: "edit", claimType })}>
                          Edit
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleDelete(claimType.id)}>
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Mobile Claim Types Cards */}
        <div className="sm:hidden space-y-3 p-4">
          {filtered.map((claimType) => (
            <div key={claimType.id} className="border rounded-lg p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium text-sm">{claimType.name}</span>
                <div className="flex items-center gap-2">
                  <Switch checked={claimType.active === 1} onCheckedChange={() => handleStatusToggle(claimType.id)} />
                  <span className="text-xs">{getStatusText(claimType.active)}</span>
                </div>
              </div>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Code:</span>
                  <span className="text-right">{claimType.code}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Description:</span>
                  <span className="text-right">{claimType.description}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Processing:</span>
                  <span>{formatData(claimType.processing_time_estimate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Documents:</span>
                  <span className="text-right">
                    {claimType.required_documents && claimType.required_documents.length > 0
                      ? `${claimType.required_documents.length} required`
                      : 'N/A'}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 pt-2">
                <Button variant="ghost" size="sm" onClick={() => setModal({ mode: "edit", claimType })} className="flex-1">
                  Edit
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleDelete(claimType.id)} className="flex-1">
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {modal && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
          <div className="bg-white rounded shadow-lg p-6 w-full max-w-2xl relative max-h-[90vh] overflow-y-auto">
            <Button size="icon" variant="ghost" className="absolute top-2 right-2" onClick={() => setModal(null)}>&times;</Button>

            {modal.mode === "add" && (
              <>
                <h3 className="text-lg font-semibold mb-4">Add Claim Type</h3>
                <ClaimTypeForm
                  claimType={undefined}
                  onSubmit={handleAdd}
                  onCancel={() => setModal(null)}
                />
              </>
            )}

            {modal.mode === "edit" && (
              <>
                <h3 className="text-lg font-semibold mb-4">Edit Claim Type</h3>
                <ClaimTypeForm
                  claimType={modal.claimType ?? undefined}
                  onSubmit={handleEdit}
                  onCancel={() => setModal(null)}
                />
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

interface ClaimTypeFormProps {
  claimType?: ClaimType;
  onSubmit: (claimType: Omit<ClaimType, "id">) => void;
  onCancel: () => void;
}

function ClaimTypeForm({ claimType, onSubmit, onCancel }: ClaimTypeFormProps) {
  const [name, setName] = useState(claimType?.name || "");
  const [code, setCode] = useState(claimType?.code || "");
  const [tracking_prefix, setTrackingPrefix] = useState(claimType?.tracking_prefix || "");
  const [description, setDescription] = useState(claimType?.description || "");
  const [required_documents, setRequiredDocuments] = useState<string[]>(claimType?.required_documents || []);
  const [processing_time_estimate, setProcessingTimeEstimate] = useState(claimType?.processing_time_estimate || "");
  const [active, setActive] = useState<number>(claimType?.active ?? 1);
  const [newDocument, setNewDocument] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = "Name is required";
    if (!code.trim()) newErrors.code = "Code is required";
    if (!tracking_prefix.trim()) newErrors.tracking_prefix = "Tracking prefix is required";
    if (!description.trim()) newErrors.description = "Description is required";
    if (!processing_time_estimate.trim()) newErrors.processing_time_estimate = "Processing time estimate is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit({
      name: name.trim(),
      code: code.trim(),
      tracking_prefix: tracking_prefix.trim(),
      description: description.trim(),
      required_documents: required_documents.length > 0 ? required_documents : null,
      processing_time_estimate: processing_time_estimate.trim(),
      active,
      created_at: null,
      updated_at: null,
    });
  }

  function handleAddDocument() {
    if (newDocument.trim() && !required_documents.includes(newDocument.trim())) {
      setRequiredDocuments([...required_documents, newDocument.trim()]);
      setNewDocument("");
    }
  }

  function handleRemoveDocument(doc: string) {
    setRequiredDocuments(required_documents.filter(d => d !== doc));
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
              placeholder="Claim type name"
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          <div>
            <Label htmlFor="code">Code *</Label>
            <Input
              id="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="e.g., MOTOR"
              className={errors.code ? "border-red-500" : ""}
            />
            {errors.code && <p className="text-red-500 text-sm mt-1">{errors.code}</p>}
          </div>

          <div>
            <Label htmlFor="tracking_prefix">Tracking Prefix *</Label>
            <Input
              id="tracking_prefix"
              value={tracking_prefix}
              onChange={(e) => setTrackingPrefix(e.target.value)}
              placeholder="e.g., MTR"
              className={errors.tracking_prefix ? "border-red-500" : ""}
            />
            {errors.tracking_prefix && <p className="text-red-500 text-sm mt-1">{errors.tracking_prefix}</p>}
          </div>

          <div>
            <Label htmlFor="processing_time_estimate">Processing Time Estimate *</Label>
            <Input
              id="processing_time_estimate"
              value={processing_time_estimate}
              onChange={(e) => setProcessingTimeEstimate(e.target.value)}
              placeholder="e.g., 5-7 days"
              className={errors.processing_time_estimate ? "border-red-500" : ""}
            />
            {errors.processing_time_estimate && <p className="text-red-500 text-sm mt-1">{errors.processing_time_estimate}</p>}
          </div>

          <div>
            <Label htmlFor="active">Status *</Label>
            <Select value={active.toString()} onValueChange={(value) => setActive(parseInt(value))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Active</SelectItem>
                <SelectItem value="0">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detailed description of this claim type"
              className={errors.description ? "border-red-500" : ""}
              rows={3}
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>

          <div className="md:col-span-2">
            <Label>Required Documents (Optional)</Label>
            <div className="space-y-2">
              <div className="flex gap-2">
                <Input
                  value={newDocument}
                  onChange={(e) => setNewDocument(e.target.value)}
                  placeholder="Add required document"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddDocument())}
                />
                <Button type="button" size="sm" onClick={handleAddDocument}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {required_documents.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {required_documents.map((doc, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {doc}
                      <button
                        type="button"
                        onClick={() => handleRemoveDocument(doc)}
                        className="ml-1 hover:text-red-500"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-2 justify-end">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {claimType ? "Update Claim Type" : "Create Claim Type"}
          </Button>
        </div>
      </form>
    </Card>
  );
} 