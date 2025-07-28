"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Eye, Edit, Trash2 } from "lucide-react";
import type { SettlementOffer, ClaimForSettlement } from "@/lib/types/settlement";
import SettlementOfferForm from "./SettlementOfferForm";

// Mock data for approved claims
const approvedClaims: ClaimForSettlement[] = [
  {
    id: "1",
    claimNumber: "CLM-001",
    clientName: "John Doe",
    claimType: "Motor",
    assessedAmount: 50000,
    status: "APPROVED",
    assessmentDate: new Date("2024-01-15"),
    assessor: "Sarah K.",
  },
  {
    id: "2",
    claimNumber: "CLM-002",
    clientName: "ABC Ltd",
    claimType: "Fire",
    assessedAmount: 200000,
    status: "APPROVED",
    assessmentDate: new Date("2024-01-10"),
    assessor: "Mike T.",
  },
  {
    id: "3",
    claimNumber: "CLM-003",
    clientName: "Jane Smith",
    claimType: "Property",
    assessedAmount: 75000,
    status: "APPROVED",
    assessmentDate: new Date("2024-01-12"),
    assessor: "David L.",
  },
];

// Mock settlement offers
const mockOffers: SettlementOffer[] = [
  {
    id: "1",
    offerId: "OFF-001",
    claimId: "1",
    clientName: "John Doe",
    claimType: "Motor",
    assessedAmount: 50000,
    deductions: 5000,
    serviceFeePercentage: 10,
    finalAmount: 45000,
    paymentMethod: "BANK_TRANSFER",
    paymentTimeline: 7,
    offerValidityPeriod: 14,
    specialConditions: "Payment within 7 days for 5% discount",
    status: "DRAFT",
    createdBy: "Sarah K.",
    createdAt: new Date("2024-01-20"),
    supportingDocuments: ["assessment_report.pdf", "supporting_evidence.pdf"],
  },
  {
    id: "2",
    offerId: "OFF-002",
    claimId: "2",
    clientName: "ABC Ltd",
    claimType: "Fire",
    assessedAmount: 200000,
    deductions: 20000,
    serviceFeePercentage: 8,
    finalAmount: 184000,
    paymentMethod: "CHEQUE",
    paymentTimeline: 14,
    offerValidityPeriod: 21,
    specialConditions: "",
    status: "SUBMITTED",
    createdBy: "Mike T.",
    createdAt: new Date("2024-01-19"),
    submittedAt: new Date("2024-01-19"),
    supportingDocuments: ["assessment_report.pdf", "settlement_breakdown.pdf"],
  },
];

export default function CreateOffersTab() {
  const [offers, setOffers] = useState<SettlementOffer[]>(mockOffers);
  const [modal, setModal] = useState<{ mode: "create" | "view" | "edit"; offer?: SettlementOffer } | null>(null);
  const [search, setSearch] = useState("");

  const filteredOffers = offers.filter((offer) =>
    offer.clientName.toLowerCase().includes(search.toLowerCase()) ||
    offer.offerId.toLowerCase().includes(search.toLowerCase()) ||
    offer.claimType.toLowerCase().includes(search.toLowerCase())
  );

  function handleCreateOffer(newOffer: Omit<SettlementOffer, "id" | "offerId" | "createdAt" | "createdBy">) {
    const offer: SettlementOffer = {
      ...newOffer,
      id: (Math.random() * 100000).toFixed(0),
      offerId: `OFF-${String(offers.length + 1).padStart(3, '0')}`,
      createdAt: new Date(),
      createdBy: "Current User", // In real app, get from auth context
    };
    setOffers([offer, ...offers]);
    setModal(null);
  }

  function handleUpdateOffer(updatedOffer: Omit<SettlementOffer, "id" | "offerId" | "createdAt" | "createdBy">) {
    setOffers(prev => prev.map(offer => 
      offer.id === modal?.offer?.id 
        ? { ...offer, ...updatedOffer, submittedAt: updatedOffer.status === "SUBMITTED" ? new Date() : offer.submittedAt }
        : offer
    ));
    setModal(null);
  }

  function handleDeleteOffer(offerId: string) {
    setOffers(prev => prev.filter(offer => offer.id !== offerId));
  }

  function getStatusBadge(status: SettlementOffer["status"]) {
    const statusConfig = {
      DRAFT: { label: "Draft", variant: "secondary" as const },
      SUBMITTED: { label: "Submitted", variant: "default" as const },
      APPROVED: { label: "Approved", variant: "default" as const },
      REJECTED: { label: "Rejected", variant: "destructive" as const },
      PRESENTED: { label: "Presented", variant: "default" as const },
      ACCEPTED: { label: "Accepted", variant: "default" as const },
      REJECTED_BY_CLIENT: { label: "Rejected by Client", variant: "destructive" as const },
      EXPIRED: { label: "Expired", variant: "secondary" as const },
      PAYMENT_PROCESSING: { label: "Payment Processing", variant: "default" as const },
      PAID: { label: "Paid", variant: "default" as const },
      CANCELLED: { label: "Cancelled", variant: "destructive" as const },
    };

    const config = statusConfig[status];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Create Offers</h2>
        </div>
        <Button onClick={() => setModal({ mode: "create" })}>
          <Plus className="h-4 w-4 mr-2" />
          Create New Offer
        </Button>
      </div>

      <div className="flex gap-4 items-center">
        <Input
          placeholder="Search offers by client name, offer ID, or claim type..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-64"
        />
      </div>

      <Card>
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold">Draft & Created Offers List</h3>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Offer ID</TableHead>
                <TableHead>Client Name</TableHead>
                <TableHead>Claim Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOffers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground">
                    No offers found.
                  </TableCell>
                </TableRow>
              )}
              {filteredOffers.map((offer) => (
                <TableRow key={offer.id}>
                  <TableCell className="font-medium">{offer.offerId}</TableCell>
                  <TableCell>{offer.clientName}</TableCell>
                  <TableCell>{offer.claimType}</TableCell>
                  <TableCell>₦{offer.finalAmount.toLocaleString()}</TableCell>
                  <TableCell>{getStatusBadge(offer.status)}</TableCell>
                  <TableCell>{offer.createdAt.toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setModal({ mode: "view", offer })}
                        title="View Offer Details"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {offer.status === "DRAFT" && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setModal({ mode: "edit", offer })}
                            title="Edit Offer"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteOffer(offer.id)}
                            title="Delete Offer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {modal && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
          <div className="bg-white rounded shadow-lg p-6 w-full max-w-4xl relative max-h-[90vh] overflow-y-auto">
            <Button
              size="icon"
              variant="ghost"
              className="absolute top-2 right-2"
              onClick={() => setModal(null)}
            >
              ×
            </Button>

            {modal.mode === "create" && (
              <>
                <h3 className="text-lg font-semibold mb-4">New Settlement Offer Form</h3>
                <SettlementOfferForm
                  approvedClaims={approvedClaims}
                  onSubmit={handleCreateOffer}
                  onCancel={() => setModal(null)}
                />
              </>
            )}

            {modal.mode === "view" && modal.offer && (
              <>
                <h3 className="text-lg font-semibold mb-4">Offer Details</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="font-medium">Offer ID:</span> {modal.offer.offerId}
                    </div>
                    <div>
                      <span className="font-medium">Client:</span> {modal.offer.clientName}
                    </div>
                    <div>
                      <span className="font-medium">Claim Type:</span> {modal.offer.claimType}
                    </div>
                    <div>
                      <span className="font-medium">Status:</span> {getStatusBadge(modal.offer.status)}
                    </div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-2">Offer Calculation</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>Assessed Amount: ₦{modal.offer.assessedAmount.toLocaleString()}</div>
                      <div>Deductions: ₦{modal.offer.deductions.toLocaleString()}</div>
                      <div>Service Fee: {modal.offer.serviceFeePercentage}%</div>
                      <div className="font-bold">Final Amount: ₦{modal.offer.finalAmount.toLocaleString()}</div>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-2">Offer Terms</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>Payment Method: {modal.offer.paymentMethod.replace('_', ' ')}</div>
                      <div>Payment Timeline: {modal.offer.paymentTimeline} days</div>
                      <div>Validity Period: {modal.offer.offerValidityPeriod} days</div>
                      <div>Created: {modal.offer.createdAt.toLocaleDateString()}</div>
                    </div>
                  </div>

                  {modal.offer.specialConditions && (
                    <div className="border-t pt-4">
                      <h4 className="font-medium mb-2">Special Conditions</h4>
                      <p className="text-sm">{modal.offer.specialConditions}</p>
                    </div>
                  )}

                  {modal.offer.supportingDocuments.length > 0 && (
                    <div className="border-t pt-4">
                      <h4 className="font-medium mb-2">Supporting Documents</h4>
                      <div className="flex flex-wrap gap-2">
                        {modal.offer.supportingDocuments.map((doc, index) => (
                          <Badge key={index} variant="outline">
                            {doc}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 justify-end mt-6">
                  <Button variant="outline" onClick={() => setModal(null)}>
                    Close
                  </Button>
                  {modal.offer.status === "DRAFT" && (
                    <Button onClick={() => setModal({ mode: "edit", offer: modal.offer })}>
                      Edit Offer
                    </Button>
                  )}
                </div>
              </>
            )}

            {modal.mode === "edit" && modal.offer && (
              <>
                <h3 className="text-lg font-semibold mb-4">Edit Settlement Offer</h3>
                <SettlementOfferForm
                  approvedClaims={approvedClaims}
                  existingOffer={modal.offer}
                  onSubmit={handleUpdateOffer}
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