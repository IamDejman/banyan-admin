"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { ClaimType } from "@/lib/types/claim-types";

const initialMockClaimTypes: ClaimType[] = [
  { id: "1", name: "Auto" },
  { id: "2", name: "Property" },
  { id: "3", name: "Health" },
];

export default function ClaimTypesClient() {
  const [claimTypes, setClaimTypes] = useState<ClaimType[]>(initialMockClaimTypes);
  const [modal, setModal] = useState<{ mode: "add" | "edit"; claimType: ClaimType | null } | null>(null);
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleAdd() {
    if (!name.trim()) {
      setError("Name is required");
      return;
    }
    setClaimTypes(prev => [
      { id: (Math.random() * 100000).toFixed(0), name: name.trim() },
      ...prev,
    ]);
    setName("");
    setError(null);
    setModal(null);
  }

  function handleEdit() {
    if (!name.trim() || !modal?.claimType) {
      setError("Name is required");
      return;
    }
    setClaimTypes(prev => prev.map(ct => ct.id === modal.claimType!.id ? { ...ct, name: name.trim() } : ct));
    setName("");
    setError(null);
    setModal(null);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Claim Types</h2>
        <Button onClick={() => { setModal({ mode: "add", claimType: null }); setName(""); }}>Add Claim Type</Button>
      </div>
      <Card className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {claimTypes.length === 0 && (
              <TableRow>
                <TableCell colSpan={2} className="text-center text-muted-foreground">No claim types found.</TableCell>
              </TableRow>
            )}
            {claimTypes.map((ct) => (
              <TableRow key={ct.id}>
                <TableCell>{ct.name}</TableCell>
                <TableCell>
                  <Button size="sm" variant="outline" onClick={() => { setModal({ mode: "edit", claimType: ct }); setName(ct.name); }}>Edit</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
      {modal && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
          <div className="bg-white rounded shadow-lg p-6 w-full max-w-sm relative">
            <Button
              size="icon"
              variant="ghost"
              className="absolute top-2 right-2"
              onClick={() => setModal(null)}
              aria-label="Close"
            >
              ✕
            </Button>
            <h3 className="text-lg font-semibold mb-4">{modal.mode === "add" ? "Add Claim Type" : "Edit Claim Type"}</h3>
            <form onSubmit={e => { e.preventDefault(); modal.mode === "add" ? handleAdd() : handleEdit(); }} className="space-y-4">
              <Input value={name} onChange={e => setName(e.target.value)} placeholder="Claim type name" required />
              {error && <div className="text-red-600 text-sm">{error}</div>}
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => setModal(null)}>Cancel</Button>
                <Button type="submit">Save</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 