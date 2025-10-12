"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronRight, Edit, Trash2 } from "lucide-react";
import InsurerForm from "./InsurerForm";
import type { Insurer } from "@/lib/types/insurer";
import type { ClaimType } from "@/lib/types/claim-types";
import { getInsurers, updateInsurer, deleteInsurer } from "@/app/services/dashboard";
import { useToast } from "@/components/ui/use-toast";

type ModalState = { mode: "add" | "edit"; insurer: Insurer | null } | null;
type ConfirmState = { type: "delete"; insurer: Insurer } | null;

// Interface for the API response structure
interface InsurersApiResponse {
  data?: ApiInsurer[];
}

// API response type
type ApiInsurer = {
  id: number;
  name: string;
  code: string;
  logo: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  address: string | null;
  active: number;
  supported_claim_types: string;
  special_instructions: string | null;
  created_at: string | null;
  updated_at: string | null;
};

// Mock claim types for the dropdown
const claimTypes: ClaimType[] = [
  { id: "1", name: "Auto", code: "AUTO", tracking_prefix: "AUT", description: "Automobile insurance claims", required_documents: ["Driver's License", "Police Report"], active: 1, processing_time_estimate: "5-7 days", created_at: null, updated_at: null },
  { id: "2", name: "Property", code: "PROP", tracking_prefix: "PRO", description: "Property damage claims", required_documents: ["Photos", "Repair Estimates"], active: 1, processing_time_estimate: "7-10 days", created_at: null, updated_at: null },
  { id: "3", name: "Health", code: "HLTH", tracking_prefix: "HLT", description: "Health insurance claims", required_documents: ["Medical Records", "Bills"], active: 1, processing_time_estimate: "3-5 days", created_at: null, updated_at: null },
];

export default function InsurersClient() {
  const [insurers, setInsurers] = useState<Insurer[]>([]);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState<ModalState>(null);
  const [confirmDialog, setConfirmDialog] = useState<ConfirmState>(null);
  const [loading, setLoading] = useState(true);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  const filtered = insurers.filter((i) =>
    i.name.toLowerCase().includes(search.toLowerCase()) ||
    i.contact_email.toLowerCase().includes(search.toLowerCase())
  );

  // Transform API data to match Insurer type
  const transformApiData = (apiInsurer: ApiInsurer): Insurer => {
    let supportedClaimTypes: string[] = [];
    try {
      if (apiInsurer.supported_claim_types) {
        supportedClaimTypes = JSON.parse(apiInsurer.supported_claim_types);
      }
    } catch (error) {
      console.error('Error parsing supported_claim_types:', error);
      supportedClaimTypes = [];
    }

    return {
      id: apiInsurer.id.toString(),
      name: apiInsurer.name || "N/A",
      logo: apiInsurer.logo,
      contact_email: apiInsurer.contact_email || "N/A",
      contact_phone: apiInsurer.contact_phone || "N/A",
      address: apiInsurer.address || "N/A",
      supported_claim_types: supportedClaimTypes,
      special_instructions: apiInsurer.special_instructions || "N/A",
      status: apiInsurer.active === 1,
    };
  };

  function handleAdd(newInsurer: Omit<Insurer, "id">) {
    setInsurers((prev) => [
      { ...newInsurer, id: (Math.random() * 100000).toFixed(0) },
      ...prev,
    ]);
    setModal(null);
  }

  async function handleEdit(updated: Omit<Insurer, "id">) {
    if (!modal?.insurer?.id) return;
    
    try {
      setLoading(true);
      
      // Transform the data to match API format
      const apiPayload = {
        name: updated.name,
        logo: updated.logo || undefined,
        contact_email: updated.contact_email,
        contact_phone: updated.contact_phone,
        address: updated.address,
        supported_claim_types: JSON.stringify(updated.supported_claim_types),
        special_instructions: updated.special_instructions,
        active: updated.status ? 1 : 0
      };
      
      // Call the API to update the insurer
      const response = await updateInsurer(modal.insurer.id, apiPayload);
      console.log('Insurer update response:', response);
      
      // Update local state on success
      setInsurers((prev) => prev.map((i) => (i.id === modal?.insurer?.id ? { ...i, ...updated } : i)));
      setModal(null);
      
      // Show success message
      toast({
        title: "Insurer updated successfully",
        description: `${updated.name} has been updated.`,
      });
    } catch (error) {
      console.error('Failed to update insurer:', error);
      toast({
        variant: "destructive",
        title: "Error updating insurer",
        description: "Failed to update insurer. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }

  function handleStatusToggle(id: string) {
    setInsurers((prev) => prev.map((i) => (i.id === id ? { ...i, status: !i.status } : i)));
  }

  function handleDelete(id: string) {
    const insurer = insurers.find(i => i.id === id);
    if (!insurer) return;

    // Show confirmation dialog
    setConfirmDialog({ type: "delete", insurer });
  }

  async function confirmDelete() {
    if (!confirmDialog || confirmDialog.type !== "delete") return;

    const { insurer } = confirmDialog;
    
    try {
      setLoading(true);
      
      // Call the API to delete the insurer
      await deleteInsurer(insurer.id);
      console.log('Insurer deleted successfully');
      
      // Update local state on success
      setInsurers((prev) => prev.filter((i) => i.id !== insurer.id));
      
      // Show success message
      toast({
        title: "Insurer deleted successfully",
        description: `${insurer.name} has been deleted.`,
      });
    } catch (error) {
      console.error('Failed to delete insurer:', error);
      toast({
        variant: "destructive",
        title: "Error deleting insurer",
        description: "Failed to delete insurer. Please try again.",
      });
    } finally {
      setLoading(false);
      setConfirmDialog(null);
    }
  }


  function toggleExpandedRow(id: string) {
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
    getInsurers().then((res: unknown) => {
      if (res && typeof res === 'object' && 'data' in res) {
        const response = res as InsurersApiResponse;
        if (response.data) {
          const transformedInsurers = response.data.map(transformApiData);
          setInsurers(transformedInsurers);
        }
      }
      setLoading(false);
    }).catch((error) => {
      console.error('Error fetching insurers:', error);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="text-xl sm:text-2xl font-bold">Insurers</h2>
          <Button onClick={() => setModal({ mode: "add", insurer: null })}>
            Add Insurer
          </Button>
        </div>
        <div className="flex items-center justify-center py-8">
          <p className="text-muted-foreground">Loading insurers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-xl sm:text-2xl font-bold">Insurers</h2>
        <Button onClick={() => setModal({ mode: "add", insurer: null })}>
          Add Insurer
        </Button>
      </div>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:gap-4">
          <Input
            placeholder="Search by name or email..."
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
                <TableHead>Status</TableHead>
                <TableHead>Claim Types</TableHead>
                <TableHead className="w-32">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <div className="text-center">
                      <Image
                        src="/globe.svg"
                        alt="Insurer logo"
                        width={32}
                        height={32}
                        className="rounded mx-auto mb-2"
                      />
                      <p className="text-sm text-muted-foreground">No insurers found</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((insurer) => {
                  const isExpanded = expandedRows.has(insurer.id);
                  return (
                    <React.Fragment key={insurer.id}>
                      <TableRow className="hover:bg-muted/50">
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleExpandedRow(insurer.id)}
                            className="h-6 w-6 p-0"
                          >
                            {isExpanded ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </Button>
                        </TableCell>
                        <TableCell className="font-medium">{insurer.name}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Switch 
                              checked={insurer.status}
                              onCheckedChange={() => handleStatusToggle(insurer.id)}
                            />
                            <Badge variant={insurer.status ? "default" : "secondary"}>
                              {insurer.status ? "Active" : "Inactive"}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {insurer.supported_claim_types.slice(0, 2).map((type, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {type}
                              </Badge>
                            ))}
                            {insurer.supported_claim_types.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{insurer.supported_claim_types.length - 2}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => setModal({ mode: "edit", insurer })}
                              className="h-7 px-2"
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => handleDelete(insurer.id)}
                              className="h-7 px-2 text-red-600 hover:text-red-700"
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
                                    <span className="text-sm font-medium text-muted-foreground">Email:</span>
                                    <p className="text-sm">{insurer.contact_email}</p>
                                  </div>
                                  <div>
                                    <span className="text-sm font-medium text-muted-foreground">Phone:</span>
                                    <p className="text-sm">{insurer.contact_phone}</p>
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <div>
                                    <span className="text-sm font-medium text-muted-foreground">Address:</span>
                                    <p className="text-sm">{insurer.address}</p>
                                  </div>
                                  <div>
                                    <span className="text-sm font-medium text-muted-foreground">Special Instructions:</span>
                                    <p className="text-sm">{insurer.special_instructions}</p>
                                  </div>
                                </div>
                              </div>
                              <div>
                                <span className="text-sm font-medium text-muted-foreground">Supported Claim Types:</span>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {insurer.supported_claim_types.map((type, index) => (
                                    <Badge key={index} variant="secondary" className="text-xs">
                                      {type}
                                    </Badge>
                                  ))}
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
          <div className="bg-white rounded shadow-lg p-6 w-full max-w-lg relative max-h-[90vh] overflow-y-auto">
            <Button size="icon" variant="ghost" className="absolute top-2 right-2" onClick={() => setModal(null)}>&times;</Button>
            {modal.mode === "add" && (
              <>
                <h3 className="text-lg font-semibold mb-4">Add Insurer</h3>
                <InsurerForm
                  insurer={undefined}
                  claimTypes={claimTypes}
                  onSubmit={handleAdd}
                  onCancel={() => setModal(null)}
                />
              </>
            )}
            {modal.mode === "edit" && (
              <>
                <h3 className="text-lg font-semibold mb-4">Edit Insurer</h3>
                <InsurerForm
                  insurer={modal.insurer ?? undefined}
                  claimTypes={claimTypes}
                  onSubmit={handleEdit}
                  onCancel={() => setModal(null)}
                />
              </>
            )}
          </div>
        </div>
      )}
      
      {/* Confirmation Dialog */}
      {confirmDialog && confirmDialog.type === "delete" && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
          <div className="bg-white rounded shadow-lg p-6 w-full max-w-md relative max-h-[90vh] overflow-y-auto">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Insurer</h3>
              <p className="text-sm text-gray-500 mb-6">
                Are you sure you want to delete <strong>&quot;{confirmDialog.insurer.name}&quot;</strong>? 
                This action cannot be undone.
              </p>
              <div className="flex gap-3 justify-center">
                <Button
                  variant="outline"
                  onClick={() => setConfirmDialog(null)}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={confirmDelete}
                  disabled={loading}
                >
                  {loading ? "Deleting..." : "Delete"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 