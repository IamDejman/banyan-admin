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
import { X, Plus, ChevronDown, ChevronRight, Edit, Trash2, Loader2 } from "lucide-react";
import type { IncidentType } from "@/lib/types/incident-type";
import {
  getIncidentTypes,
  storeIncidentType,
  updateIncidentType,
  deleteIncidentType,
  getClaimTypes
} from "@/app/services/dashboard";
import type { ClaimType } from "@/lib/types/claim-types";
import { formatDate } from "@/lib/utils/text-formatting";
import { toast } from "@/components/ui/use-toast";

// Interface for the API response structure
interface IncidentTypeApiResponse {
  data?: IncidentType[];
}

type ModalState = { mode: "add" | "edit"; incidentType: IncidentType | null } | null;

// Helper function to parse JSON strings from API for claim types (returns IDs)
function parseClaimTypesField(value: string | null): (string | number)[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

// Helper function to parse JSON strings from API for documents (returns strings)
function parseDocumentsField(value: string | null): string[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default function IncidentTypesClient() {
  const [incidentTypes, setIncidentTypes] = useState<IncidentType[]>([]);
  const [claimTypes, setClaimTypes] = useState<ClaimType[]>([]);
  const [modal, setModal] = useState<ModalState>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [expandedRows, setExpandedRows] = useState<Set<string | number>>(new Set());
  const [actionLoading, setActionLoading] = useState(false);

  const filtered = incidentTypes.filter((it) => {
    if (!it || !it.name || !it.description || !it.code) return false;
    const searchLower = search.toLowerCase();
    return (
      it.name.toLowerCase().includes(searchLower) ||
      it.description.toLowerCase().includes(searchLower) ||
      it.code.toLowerCase().includes(searchLower)
    );
  });

  async function handleAdd(newIncidentType: Omit<IncidentType, "id" | "created_at" | "updated_at">) {
    setActionLoading(true);
    try {
      const payload = {
        ...newIncidentType,
        // Convert claim type IDs to strings as API expects strings
        applicable_claim_types: (newIncidentType.applicable_claim_types || []).map(id => String(id)),
        required_documents: newIncidentType.required_documents || [],
      };
      console.log(payload, "payload______");

      const response = await storeIncidentType(payload as any);

      if (response && response.data) {
        const created = response.data as IncidentType;
        // Parse JSON strings back to arrays for display
        const parsedIncidentType: IncidentType = {
          ...created,
          applicable_claim_types: parseClaimTypesField(created.applicable_claim_types as any),
          required_documents: parseDocumentsField(created.required_documents as any),
        };
        setIncidentTypes(prev => [parsedIncidentType, ...prev]);
        toast({
          title: "Success",
          description: "Incident type created successfully",
        });
      }
      setModal(null);
    } catch (error: any) {
      console.error('Error creating incident type:', error);
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Failed to create incident type",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  }

  async function handleEdit(updated: Omit<IncidentType, "id" | "created_at" | "updated_at">) {
    if (!modal?.incidentType) return;

    setActionLoading(true);
    try {
      const payload = {
        ...updated,
        // Convert claim type IDs to strings as API expects strings
        applicable_claim_types: (updated.applicable_claim_types || []).map(id => String(id)),
        required_documents: updated.required_documents || [],
      };

      const response = await updateIncidentType(String(modal.incidentType.id), payload as any);

      if (response) {
        // Handle different response structures
        let updatedItem: IncidentType | null = null;

        if (Array.isArray(response.data) && response.data.length > 0) {
          // If data is an array, take the first item
          updatedItem = response.data[0] as IncidentType;
        } else if (response.data && !Array.isArray(response.data)) {
          // If data is an object
          updatedItem = response.data as IncidentType;
        } else if (Array.isArray(response.data) && response.data.length === 0) {
          // If data is empty array, use the payload we sent and merge with existing
          updatedItem = {
            ...modal.incidentType,
            ...updated,
            applicable_claim_types: updated.applicable_claim_types || [],
            required_documents: updated.required_documents || [],
          } as IncidentType;
        }

        if (updatedItem) {
          // Parse JSON strings back to arrays for display if needed
          const parsedIncidentType: IncidentType = {
            ...updatedItem,
            applicable_claim_types: typeof updatedItem.applicable_claim_types === 'string'
              ? parseClaimTypesField(updatedItem.applicable_claim_types as any)
              : updatedItem.applicable_claim_types || [],
            required_documents: typeof updatedItem.required_documents === 'string'
              ? parseDocumentsField(updatedItem.required_documents as any)
              : updatedItem.required_documents || [],
          };
          setIncidentTypes(prev => prev.map(it =>
            it.id === modal.incidentType?.id ? parsedIncidentType : it
          ));
          toast({
            title: "Success",
            description: "Incident type updated successfully",
          });
        } else {
          // If we can't parse the response, refetch all incident types
          const res = await getIncidentTypes();
          if (res && typeof res === 'object' && 'data' in res) {
            const response = res as IncidentTypeApiResponse;
            if (response.data) {
              const mappedData = response.data.map((item: IncidentType) => ({
                ...item,
                applicable_claim_types: parseClaimTypesField(item.applicable_claim_types as any),
                required_documents: parseDocumentsField(item.required_documents as any),
              }));
              setIncidentTypes(mappedData);
            }
          }
          toast({
            title: "Success",
            description: "Incident type updated successfully",
          });
        }
      }
      setModal(null);
    } catch (error: any) {
      console.error('Error updating incident type:', error);
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Failed to update incident type",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  }

  async function handleDelete(id: string | number) {
    if (!confirm("Are you sure you want to delete this incident type?")) return;

    setActionLoading(true);
    try {
      await deleteIncidentType(String(id));
      setIncidentTypes(prev => prev.filter(it => it.id !== id));
      toast({
        title: "Success",
        description: "Incident type deleted successfully",
      });
    } catch (error: any) {
      console.error('Error deleting incident type:', error);
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Failed to delete incident type",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  }

  async function handleStatusToggle(id: string | number) {
    const incidentType = incidentTypes.find(it => it.id === id);
    if (!incidentType) return;

    setActionLoading(true);
    try {
      const newActive = incidentType.active === 1 ? 0 : 1;
      const payload = {
        ...incidentType,
        // Convert claim type IDs to strings as API expects strings
        applicable_claim_types: (incidentType.applicable_claim_types || []).map(id => String(id)),
        required_documents: incidentType.required_documents || [],
        active: newActive,
      };

      await updateIncidentType(String(id), payload as any);
      setIncidentTypes(prev => prev.map(it =>
        it.id === id ? { ...it, active: newActive } : it
      ));
      toast({
        title: "Success",
        description: `Incident type ${newActive === 1 ? 'activated' : 'deactivated'} successfully`,
      });
    } catch (error: any) {
      console.error('Error toggling incident type status:', error);
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Failed to update incident type status",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  }

  // Helper function to format data for display
  function formatData(value: unknown, type: 'documents' | 'text' = 'text'): string {
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

  function toggleExpandedRow(id: string | number) {
    setExpandedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }

  useEffect(() => {
    setLoading(true);

    // Fetch both incident types and claim types
    Promise.all([
      getIncidentTypes(),
      getClaimTypes()
    ]).then(([incidentTypesRes, claimTypesRes]) => {
      // Handle incident types
      if (incidentTypesRes && typeof incidentTypesRes === 'object' && 'data' in incidentTypesRes) {
        const response = incidentTypesRes as IncidentTypeApiResponse;
        if (response.data) {
          const mappedData = response.data.map((item: IncidentType) => ({
            ...item,
            applicable_claim_types: parseClaimTypesField(item.applicable_claim_types as any),
            required_documents: parseDocumentsField(item.required_documents as any),
          }));
          setIncidentTypes(mappedData);
        }
      }

      // Handle claim types
      if (claimTypesRes && typeof claimTypesRes === 'object' && 'data' in claimTypesRes && Array.isArray(claimTypesRes.data)) {
        setClaimTypes(claimTypesRes.data as ClaimType[]);
      }

      setLoading(false);
    }).catch((error) => {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch incident types",
        variant: "destructive",
      });
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="text-xl sm:text-2xl font-bold">Incident Types</h2>
        </div>
        <div className="text-center py-8">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-muted-foreground" />
          <p className="text-muted-foreground">Loading incident types...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-xl sm:text-2xl font-bold">Incident Types</h2>
        <Button
          onClick={() => setModal({ mode: "add", incidentType: null })}
          disabled={actionLoading}
        >
          Add Incident Type
        </Button>
      </div>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:gap-4">
          <Input
            placeholder="Search incident types..."
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
                <TableHead className="w-12"></TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-32">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <div className="text-center">
                      <X className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">No incident types found</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((incidentType) => {
                  const isExpanded = expandedRows.has(incidentType.id);
                  return (
                    <React.Fragment key={incidentType.id}>
                      <TableRow className="hover:bg-muted/50">
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleExpandedRow(incidentType.id)}
                            className="h-6 w-6 p-0"
                          >
                            {isExpanded ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </Button>
                        </TableCell>
                        <TableCell className="font-medium">{incidentType.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {incidentType.code}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={incidentType.active === 1}
                              onCheckedChange={() => handleStatusToggle(incidentType.id)}
                              disabled={actionLoading}
                            />
                            <Badge variant={incidentType.active === 1 ? "default" : "secondary"}>
                              {getStatusText(incidentType.active)}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setModal({ mode: "edit", incidentType })}
                              className="h-7 px-2"
                              disabled={actionLoading}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDelete(incidentType.id)}
                              className="h-7 px-2 text-red-600 hover:text-red-700"
                              disabled={actionLoading}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                      {isExpanded && (
                        <TableRow>
                          <TableCell colSpan={5} className="bg-muted/30 p-0">
                            <div className="p-4 space-y-3">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <div>
                                    <span className="text-sm font-medium text-muted-foreground">Description:</span>
                                    <p className="text-sm">{incidentType.description}</p>
                                  </div>
                                  <div>
                                    <span className="text-sm font-medium text-muted-foreground">Created:</span>
                                    <p className="text-sm">
                                      {incidentType.created_at ? formatDate(incidentType.created_at) : 'N/A'}
                                    </p>
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <div>
                                    <span className="text-sm font-medium text-muted-foreground">Updated:</span>
                                    <p className="text-sm">
                                      {incidentType.updated_at ? formatDate(incidentType.updated_at) : 'N/A'}
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <div>
                                <span className="text-sm font-medium text-muted-foreground">Applicable Claim Types:</span>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {incidentType.applicable_claim_types && incidentType.applicable_claim_types.length > 0 ? (
                                    incidentType.applicable_claim_types.map((claimTypeId) => {
                                      const claimType = claimTypes.find(ct => ct.id === claimTypeId);
                                      return claimType ? (
                                        <Badge key={claimTypeId} variant="secondary" className="text-xs">
                                          {claimType.name}
                                        </Badge>
                                      ) : (
                                        <Badge key={claimTypeId} variant="secondary" className="text-xs">
                                          ID: {claimTypeId}
                                        </Badge>
                                      );
                                    })
                                  ) : (
                                    <span className="text-muted-foreground text-sm">No claim types specified</span>
                                  )}
                                </div>
                              </div>
                              <div>
                                <span className="text-sm font-medium text-muted-foreground">Required Documents:</span>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {incidentType.required_documents && incidentType.required_documents.length > 0 ? (
                                    incidentType.required_documents.map((doc, index) => (
                                      <Badge key={index} variant="secondary" className="text-xs">
                                        {doc}
                                      </Badge>
                                    ))
                                  ) : (
                                    <span className="text-muted-foreground text-sm">No documents required</span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {modal && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
          <div className="bg-white rounded shadow-lg p-6 w-full max-w-2xl relative max-h-[90vh] overflow-y-auto">
            <Button size="icon" variant="ghost" className="absolute top-2 right-2" onClick={() => setModal(null)}>&times;</Button>

            {modal.mode === "add" && (
              <>
                <h3 className="text-lg font-semibold mb-4">Add Incident Type</h3>
                <IncidentTypeForm
                  incidentType={undefined}
                  onSubmit={handleAdd}
                  onCancel={() => setModal(null)}
                  loading={actionLoading}
                  claimTypes={claimTypes}
                />
              </>
            )}

            {modal.mode === "edit" && (
              <>
                <h3 className="text-lg font-semibold mb-4">Edit Incident Type</h3>
                <IncidentTypeForm
                  incidentType={modal.incidentType ?? undefined}
                  onSubmit={handleEdit}
                  onCancel={() => setModal(null)}
                  loading={actionLoading}
                  claimTypes={claimTypes}
                />
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

interface IncidentTypeFormProps {
  incidentType?: IncidentType;
  onSubmit: (incidentType: Omit<IncidentType, "id" | "created_at" | "updated_at">) => void;
  onCancel: () => void;
  loading?: boolean;
  claimTypes: ClaimType[];
}

function IncidentTypeForm({ incidentType, onSubmit, onCancel, loading, claimTypes }: IncidentTypeFormProps) {
  const [name, setName] = useState(incidentType?.name || "");
  const [code, setCode] = useState(incidentType?.code || "");
  const [description, setDescription] = useState(incidentType?.description || "");
  const [applicable_claim_types, setApplicableClaimTypes] = useState<(string | number)[]>(
    incidentType?.applicable_claim_types || []
  );
  const [required_documents, setRequiredDocuments] = useState<string[]>(incidentType?.required_documents || []);
  const [active, setActive] = useState<number>(incidentType?.active ?? 1);
  const [newClaimType, setNewClaimType] = useState("");
  const [newDocument, setNewDocument] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = "Name is required";
    if (!code.trim()) newErrors.code = "Code is required";
    if (!description.trim()) newErrors.description = "Description is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit({
      name: name.trim(),
      code: code.trim(),
      description: description.trim(),
      applicable_claim_types: applicable_claim_types.length > 0 ? applicable_claim_types : [],
      required_documents: required_documents.length > 0 ? required_documents : [],
      active,
    });
  }

  function handleAddClaimType() {
    if (!newClaimType) return;

    // Convert string to number if the claim type ID is a number
    const claimType = claimTypes.find(ct => String(ct.id) === newClaimType);
    if (!claimType) return;

    const claimTypeId = claimType.id; // This will be the correct type (string | number)

    // Check if already added (compare by converting both to strings for comparison)
    if (applicable_claim_types.some(id => String(id) === String(claimTypeId))) {
      return;
    }

    setApplicableClaimTypes([...applicable_claim_types, claimTypeId]);
    setNewClaimType("");
  }

  function handleRemoveClaimType(claimTypeId: string | number) {
    setApplicableClaimTypes(applicable_claim_types.filter(id => id !== claimTypeId));
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
              placeholder="Incident type name"
              className={errors.name ? "border-red-500" : ""}
              disabled={loading}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          <div>
            <Label htmlFor="code">Code *</Label>
            <Input
              id="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="e.g., VEHICLE_ACCIDENT"
              className={errors.code ? "border-red-500" : ""}
              disabled={loading}
            />
            {errors.code && <p className="text-red-500 text-sm mt-1">{errors.code}</p>}
          </div>

          <div>
            <Label htmlFor="active">Status *</Label>
            <Select value={active.toString()} onValueChange={(value) => setActive(parseInt(value))} disabled={loading}>
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
              placeholder="Detailed description of this incident type"
              className={errors.description ? "border-red-500" : ""}
              rows={3}
              disabled={loading}
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>

          <div className="md:col-span-2">
            <Label>Applicable Claim Types (Optional)</Label>
            <div className="space-y-2">
              <div className="flex gap-2">
                <Select
                  value={newClaimType}
                  onValueChange={setNewClaimType}
                  disabled={loading || claimTypes.length === 0}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={claimTypes.length === 0 ? "Loading claim types..." : "Select claim type"} />
                  </SelectTrigger>
                  <SelectContent>
                    {claimTypes
                      .filter(ct => !applicable_claim_types.some(id => String(id) === String(ct.id)))
                      .map(ct => (
                        <SelectItem key={ct.id} value={String(ct.id)}>
                          {ct.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <Button type="button" size="sm" onClick={handleAddClaimType} disabled={loading || !newClaimType || claimTypes.length === 0}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {applicable_claim_types.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {applicable_claim_types.map((claimTypeId) => {
                    const claimType = claimTypes.find(ct => ct.id === claimTypeId);
                    return claimType ? (
                      <Badge key={claimTypeId} variant="secondary" className="flex items-center gap-1">
                        {claimType.name}
                        <button
                          type="button"
                          onClick={() => handleRemoveClaimType(claimTypeId)}
                          className="ml-1 hover:text-red-500"
                          disabled={loading}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ) : null;
                  })}
                </div>
              )}
            </div>
          </div>

          {/* <div className="md:col-span-2">
            <Label>Required Documents (Optional)</Label>
            <div className="space-y-2">
              <div className="flex gap-2">
                <Input
                  value={newDocument}
                  onChange={(e) => setNewDocument(e.target.value)}
                  placeholder="Add required document"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddDocument())}
                  disabled={loading}
                />
                <Button type="button" size="sm" onClick={handleAddDocument} disabled={loading}>
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
                        disabled={loading}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div> */}
        </div>

        <div className="flex gap-2 justify-end">
          <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {incidentType ? "Updating..." : "Creating..."}
              </>
            ) : (
              incidentType ? "Update Incident Type" : "Create Incident Type"
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
}
