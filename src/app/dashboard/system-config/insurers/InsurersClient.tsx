"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import InsurerForm from "./InsurerForm";
import type { Insurer } from "@/lib/types/insurer";
import type { ClaimType } from "@/lib/types/claim-types";

type ModalState = { mode: "add" | "edit"; insurer: Insurer | null } | null;

const initialInsurers: Insurer[] = [
  {
    id: "1",
    name: "Acme Insurance",
    logo: null,
    contact_email: "contact@acme.com",
    contact_phone: "+1234567890",
    address: "123 Main St, Lagos",
    supported_claim_types: ["1", "2"],
    special_instructions: "",
    status: true,
  },
  {
    id: "2",
    name: "Beta Insure",
    logo: null,
    contact_email: "info@beta.com",
    contact_phone: "+2348012345678",
    address: "456 Side Rd, Abuja",
    supported_claim_types: ["3"],
    special_instructions: "",
    status: false,
  },
];

// Mock claim types for the dropdown
const claimTypes: ClaimType[] = [
  { id: "1", name: "Auto", description: "Automobile insurance claims", required_documents: ["Driver's License", "Police Report"], processing_time_estimate: "5-7 days", status: "active" },
  { id: "2", name: "Property", description: "Property damage claims", required_documents: ["Photos", "Repair Estimates"], processing_time_estimate: "7-10 days", status: "active" },
  { id: "3", name: "Health", description: "Health insurance claims", required_documents: ["Medical Records", "Bills"], processing_time_estimate: "3-5 days", status: "active" },
];

export default function InsurersClient() {
  const [insurers, setInsurers] = useState<Insurer[]>(initialInsurers);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState<ModalState>(null);

  const filtered = insurers.filter((i) =>
    i.name.toLowerCase().includes(search.toLowerCase()) ||
    i.contact_email.toLowerCase().includes(search.toLowerCase())
  );

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
    return claimTypeIds
      .map(id => claimTypes.find(ct => ct.id === id)?.name)
      .filter(Boolean)
      .join(", ");
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