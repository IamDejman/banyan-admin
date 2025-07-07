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

type ModalState = { mode: "add" | "edit" | "view"; insurer: Insurer | null } | null;

const initialMockInsurers: Insurer[] = [
  {
    id: "1",
    name: "Acme Insurance",
    logo: null,
    email: "contact@acme.com",
    phone: "+1234567890",
    address: "123 Main St, Lagos",
    claimTypes: ["1", "2"],
    instructions: "",
    status: true,
  },
  {
    id: "2",
    name: "Beta Insure",
    logo: null,
    email: "info@beta.com",
    phone: "+2348012345678",
    address: "456 Side Rd, Abuja",
    claimTypes: ["3"],
    instructions: "",
    status: false,
  },
];

export default function InsurersClient() {
  const [insurers, setInsurers] = useState<Insurer[]>(initialMockInsurers);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState<ModalState>(null);

  const filtered = insurers.filter((i) =>
    i.name.toLowerCase().includes(search.toLowerCase()) ||
    i.email.toLowerCase().includes(search.toLowerCase())
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Insurers</h2>
        <Button onClick={() => setModal({ mode: "add", insurer: null })}>Add Insurer</Button>
      </div>
      <div className="flex gap-4 items-center">
        <Input
          placeholder="Search by name or email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-64"
        />
      </div>
      <Card className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Logo</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">No insurers found.</TableCell>
              </TableRow>
            )}
            {filtered.map((insurer) => (
              <TableRow key={insurer.id}>
                <TableCell>
                  {insurer.logo ? (
                    <Image 
                      src={insurer.logo} 
                      alt="Logo" 
                      width={32}
                      height={32}
                      className="h-8 w-8 rounded object-cover border" 
                    />
                  ) : (
                    <div className="h-8 w-8 rounded bg-muted flex items-center justify-center text-xs text-muted-foreground">N/A</div>
                  )}
                </TableCell>
                <TableCell>{insurer.name}</TableCell>
                <TableCell>{insurer.email}</TableCell>
                <TableCell>{insurer.phone}</TableCell>
                <TableCell>
                  <Switch checked={insurer.status} onCheckedChange={() => handleStatusToggle(insurer.id)} />
                  <span className="ml-2 text-xs">{insurer.status ? "Enabled" : "Disabled"}</span>
                </TableCell>
                <TableCell>
                  <Button size="sm" variant="outline" onClick={() => setModal({ mode: "view", insurer })}>View</Button>
                  <Button size="sm" variant="outline" className="ml-2" onClick={() => setModal({ mode: "edit", insurer })}>Edit</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
      {modal && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
          <div className="bg-white rounded shadow-lg p-6 w-full max-w-lg relative">
            <Button size="icon" variant="ghost" className="absolute top-2 right-2" onClick={() => setModal(null)}>&times;</Button>
            {modal.mode === "add" && (
              <>
                <h3 className="text-lg font-semibold mb-4">Add Insurer</h3>
                <InsurerForm
                  initialData={{}}
                  onSave={handleAdd}
                  onCancel={() => setModal(null)}
                />
              </>
            )}
            {modal.mode === "edit" && (
              <>
                <h3 className="text-lg font-semibold mb-4">Edit Insurer</h3>
                <InsurerForm
                  initialData={modal.insurer}
                  onSave={handleEdit}
                  onCancel={() => setModal(null)}
                />
              </>
            )}
            {modal.mode === "view" && (
              <>
                <h3 className="text-lg font-semibold mb-4">Insurer Details</h3>
                <div className="space-y-2">
                  <div className="flex gap-4 items-center">
                    {modal.insurer.logo ? (
                      <Image 
                        src={modal.insurer.logo} 
                        alt="Logo" 
                        width={48}
                        height={48}
                        className="h-12 w-12 rounded object-cover border" 
                      />
                    ) : (
                      <div className="h-12 w-12 rounded bg-muted flex items-center justify-center text-xs text-muted-foreground">N/A</div>
                    )}
                    <div>
                      <div className="font-bold text-lg">{modal.insurer.name}</div>
                      <div className="text-xs text-muted-foreground">{modal.insurer.email}</div>
                    </div>
                  </div>
                  <div><span className="font-medium">Phone:</span> {modal.insurer.phone}</div>
                  <div><span className="font-medium">Address:</span> {modal.insurer.address}</div>
                  <div><span className="font-medium">Claim Types:</span> {modal.insurer.claimTypes?.join(", ")}</div>
                  <div><span className="font-medium">Status:</span> {modal.insurer.status ? "Enabled" : "Disabled"}</div>
                  <div>
                    <span className="font-medium">Special Instructions:</span>
                    <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: modal.insurer.instructions || "<em>None</em>" }} />
                  </div>
                </div>
                <div className="flex gap-2 justify-end mt-4">
                  <Button variant="outline" onClick={() => setModal(null)}>Close</Button>
                  <Button onClick={() => setModal({ mode: "edit", insurer: modal.insurer })}>Edit</Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 