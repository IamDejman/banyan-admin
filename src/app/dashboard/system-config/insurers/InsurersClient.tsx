"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import InsurerForm from "./InsurerForm";
import type { Insurer } from "@/lib/types/insurer";
import type { ClaimType } from "@/lib/types/claim-types";
import { getInsurers } from "@/app/services/dashboard";

type ModalState = { mode: "add" | "edit"; insurer: Insurer | null } | null;

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
  const [loading, setLoading] = useState(true);

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

  function handleEdit(updated: Omit<Insurer, "id">) {
    setInsurers((prev) => prev.map((i) => (i.id === modal?.insurer?.id ? { ...i, ...updated } : i)));
    setModal(null);
  }

  function handleStatusToggle(id: string) {
    setInsurers((prev) => prev.map((i) => (i.id === id ? { ...i, status: !i.status } : i)));
  }

  function handleDelete(id: string) {
    setInsurers((prev) => prev.filter((i) => i.id !== id));
  }

  function getClaimTypeNames(claimTypeIds: string[]): string {
    if (claimTypeIds.length === 0) return "N/A";
    return claimTypeIds.join(", ");
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
                <TableHead className="w-20 sm:w-auto">Name</TableHead>
                <TableHead className="hidden sm:table-cell">Email</TableHead>
                <TableHead className="hidden md:table-cell">Phone</TableHead>
                <TableHead className="hidden lg:table-cell">Address</TableHead>
                <TableHead className="hidden sm:table-cell">Claim Types</TableHead>
                <TableHead className="hidden sm:table-cell">Status</TableHead>
                <TableHead className="w-20 sm:w-auto">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <div className="text-center">
                      <Image
                        src="/globe.svg"
                        alt="Insurer logo"
                        width={32}
                        height={32}
                        className="rounded"
                      />
                      <p className="text-sm text-muted-foreground">No insurers found</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((insurer) => (
                  <TableRow key={insurer.id}>
                    <TableCell className="font-medium text-sm sm:text-base">{insurer.name}</TableCell>
                    <TableCell className="hidden sm:table-cell">{insurer.contact_email}</TableCell>
                    <TableCell className="hidden md:table-cell">{insurer.contact_phone}</TableCell>
                    <TableCell className="hidden lg:table-cell">{insurer.address}</TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <span className="text-xs sm:text-sm">
                        {getClaimTypeNames(insurer.supported_claim_types)}
                      </span>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <div className="flex items-center gap-2">
                        <Switch checked={insurer.status} onCheckedChange={() => handleStatusToggle(insurer.id)} />
                        <span className="text-xs">{insurer.status ? "Enabled" : "Disabled"}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1 sm:gap-2">
                        <Button size="sm" variant="outline" onClick={() => setModal({ mode: "edit", insurer })}>
                          Edit
                        </Button>
                        <Button size="sm" variant="outline" className="ml-2" onClick={() => handleDelete(insurer.id)}>
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

        {/* Mobile Insurers Cards */}
        <div className="sm:hidden space-y-3 p-4">
          {filtered.map((insurer) => (
            <div key={insurer.id} className="border rounded-lg p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium text-sm">{insurer.name}</span>
                <div className="flex items-center gap-2">
                  <Switch checked={insurer.status} onCheckedChange={() => handleStatusToggle(insurer.id)} />
                  <span className="text-xs">{insurer.status ? "Enabled" : "Disabled"}</span>
                </div>
              </div>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email:</span>
                  <span>{insurer.contact_email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Phone:</span>
                  <span>{insurer.contact_phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Claim Types:</span>
                  <span className="text-right">{getClaimTypeNames(insurer.supported_claim_types)}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 pt-2">
                <Button variant="ghost" size="sm" onClick={() => setModal({ mode: "edit", insurer })} className="flex-1">
                  Edit
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleDelete(insurer.id)} className="flex-1">
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
      {modal && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
          <div className="bg-white rounded shadow-lg p-6 w-full max-w-lg relative">
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
    </div>
  );
} 