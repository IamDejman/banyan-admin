"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, CheckSquare, X } from "lucide-react";
import type { SettlementOffer } from "@/lib/types/settlement";

// Mock pending offers for approval
const pendingOffers: SettlementOffer[] = [
  {
    id: "1",
    offerId: "OFF-001",
    claimId: "1",
    clientName: "John Doe",
    claimType: "Motor",
    assessedAmount: 50000,
    deductions: 5000,
    serviceFeePercentage: 10,
    finalAmount: 40000,
    paymentMethod: "BANK_TRANSFER",
    paymentTimeline: 7,
    offerValidityPeriod: 14,
    specialConditions: "Payment within 7 days for 5% discount",
    status: "SUBMITTED",
    createdBy: "Sarah K.",
    createdAt: new Date("2024-01-10"),
    submittedAt: new Date("2024-01-10"),
    expiresAt: new Date("2024-01-24"),
    supportingDocuments: ["assessment_report.pdf", "settlement_breakdown.pdf"],
  },
  {
    id: "2",
    offerId: "OFF-002",
    claimId: "2",
    clientName: "ABC Ltd",
    claimType: "Property",
    assessedAmount: 150000,
    deductions: 15000,
    serviceFeePercentage: 8,
    finalAmount: 123000,
    paymentMethod: "CHEQUE",
    paymentTimeline: 14,
    offerValidityPeriod: 21,
    specialConditions: "",
    status: "SUBMITTED",
    createdBy: "Mike T.",
    createdAt: new Date("2024-01-09"),
    submittedAt: new Date("2024-01-09"),
    expiresAt: new Date("2024-01-30"),
    supportingDocuments: ["assessment_report.pdf", "photos.zip"],
  },
  {
    id: "3",
    offerId: "OFF-003",
    claimId: "CLM-003",
    clientName: "Lisa Brown",
    claimType: "Property",
    assessedAmount: 85000,
    deductions: 5000,
    serviceFeePercentage: 8,
    finalAmount: 82800,
    paymentMethod: "BANK_TRANSFER",
    paymentTimeline: 10,
    offerValidityPeriod: 14,
    specialConditions: "Early payment discount available",
    status: "SUBMITTED",
    createdBy: "David L.",
    createdAt: new Date("2024-01-08"),
    submittedAt: new Date("2024-01-08"),
    expiresAt: new Date("2024-01-22"),
    supportingDocuments: ["medical_report.pdf", "bills.pdf"],
  },
];

export default function ApproveOffersTab() {
  const [offers, setOffers] = useState<SettlementOffer[]>(pendingOffers);
  const [modal, setModal] = useState<{ mode: "view" | "approve" | "reject"; offer: SettlementOffer } | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredOffers = offers.filter((offer) => {
    const matchesSearch = offer.clientName.toLowerCase().includes(search.toLowerCase()) ||
                         offer.offerId.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || offer.status.toLowerCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  function getDaysLeft(expiresAt: Date) {
    const days = Math.ceil((expiresAt.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    if (days < 0) return "Expired";
    if (days === 0) return "Today";
    if (days === 1) return "1 day";
    return `${days} days`;
  }

  function handleApprove(offerId: string) {
    setOffers(prev => prev.map(offer => 
      offer.id === offerId 
        ? { ...offer, status: "APPROVED", approvedAt: new Date() }
        : offer
    ));
    setModal(null);
  }

  function handleReject(offerId: string, reason: string) {
    setOffers(prev => prev.map(offer => 
      offer.id === offerId 
        ? { ...offer, status: "REJECTED", rejectionReason: reason }
        : offer
    ));
    setModal(null);
  }

  function getStatusBadge(status: string) {
    const config = {
      SUBMITTED: { label: "Submitted", variant: "secondary" as const },
      APPROVED: { label: "Approved", variant: "default" as const },
      REJECTED: { label: "Rejected", variant: "destructive" as const },
    };
    
    const badgeConfig = config[status as keyof typeof config] || config.SUBMITTED;
    return <Badge variant={badgeConfig.variant}>{badgeConfig.label}</Badge>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Approve Offers</h2>
        </div>
      </div>

      <div className="flex gap-4 items-center">
        <Input
          placeholder="Search by client name or offer ID..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-64"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="submitted">Submitted</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold">Pending Approval List</h3>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Offer ID</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Days Left</TableHead>
                <TableHead>Created By</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOffers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground">
                    No pending offers found.
                  </TableCell>
                </TableRow>
              )}
              {filteredOffers.map((offer) => (
                <TableRow key={offer.id}>
                  <TableCell className="font-medium">{offer.offerId}</TableCell>
                  <TableCell>{offer.clientName}</TableCell>
                  <TableCell>₦{offer.finalAmount.toLocaleString()}</TableCell>
                  <TableCell>{getStatusBadge(offer.status)}</TableCell>
                  <TableCell>
                    {offer.expiresAt ? getDaysLeft(offer.expiresAt) : "N/A"}
                  </TableCell>
                  <TableCell>{offer.createdBy}</TableCell>
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
                      {offer.status === "SUBMITTED" && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setModal({ mode: "approve", offer })}
                            title="Approve Offer"
                          >
                            <CheckSquare className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setModal({ mode: "reject", offer })}
                            title="Reject Offer"
                          >
                            <X className="h-4 w-4" />
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

            {modal.mode === "view" && (
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
                      <span className="font-medium">Assessed Amount:</span> ₦{modal.offer.assessedAmount.toLocaleString()}
                    </div>
                    <div>
                      <span className="font-medium">Deductions:</span> ₦{modal.offer.deductions.toLocaleString()}
                    </div>
                    <div>
                      <span className="font-medium">Service Fee:</span> {modal.offer.serviceFeePercentage}%
                    </div>
                    <div>
                      <span className="font-medium">Final Amount:</span> ₦{modal.offer.finalAmount.toLocaleString()}
                    </div>
                    <div>
                      <span className="font-medium">Payment Method:</span> {modal.offer.paymentMethod.replace('_', ' ')}
                    </div>
                    <div>
                      <span className="font-medium">Payment Timeline:</span> {modal.offer.paymentTimeline} days
                    </div>
                    <div>
                      <span className="font-medium">Offer Validity:</span> {modal.offer.offerValidityPeriod} days
                    </div>
                    <div>
                      <span className="font-medium">Expires:</span> {modal.offer.expiresAt?.toLocaleDateString()}
                    </div>
                  </div>
                  
                  {modal.offer.specialConditions && (
                    <div>
                      <span className="font-medium">Special Conditions:</span>
                      <p className="mt-1 text-sm text-muted-foreground">{modal.offer.specialConditions}</p>
                    </div>
                  )}
                  
                  <div>
                    <span className="font-medium">Supporting Documents:</span>
                    <div className="flex gap-2 mt-1">
                      {modal.offer.supportingDocuments.map((doc) => (
                        <Badge key={doc} variant="outline">{doc}</Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex gap-2 justify-end">
                    <Button variant="outline" onClick={() => setModal(null)}>
                      Close
                    </Button>
                    {modal.offer.status === "SUBMITTED" && (
                      <>
                        <Button onClick={() => handleApprove(modal.offer.id)}>
                          Approve Offer
                        </Button>
                        <Button variant="destructive" onClick={() => setModal({ mode: "reject", offer: modal.offer })}>
                          Reject Offer
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </>
            )}

            {modal.mode === "approve" && (
              <>
                <h3 className="text-lg font-semibold mb-4">Approve Offer</h3>
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-medium text-green-800 mb-2">Offer Summary</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Client:</span> {modal.offer.clientName}
                      </div>
                      <div>
                        <span className="font-medium">Amount:</span> ₦{modal.offer.finalAmount.toLocaleString()}
                      </div>
                      <div>
                        <span className="font-medium">Payment Method:</span> {modal.offer.paymentMethod.replace('_', ' ')}
                      </div>
                      <div>
                        <span className="font-medium">Timeline:</span> {modal.offer.paymentTimeline} days
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 justify-end">
                    <Button variant="outline" onClick={() => setModal(null)}>
                      Cancel
                    </Button>
                    <Button onClick={() => handleApprove(modal.offer.id)}>
                      Confirm Approval
                    </Button>
                  </div>
                </div>
              </>
            )}

            {modal.mode === "reject" && (
              <>
                <h3 className="text-lg font-semibold mb-4">Reject Offer</h3>
                <div className="space-y-4">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h4 className="font-medium text-red-800 mb-2">Offer Summary</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Client:</span> {modal.offer.clientName}
                      </div>
                      <div>
                        <span className="font-medium">Amount:</span> ₦{modal.offer.finalAmount.toLocaleString()}
                      </div>
                      <div>
                        <span className="font-medium">Payment Method:</span> {modal.offer.paymentMethod.replace('_', ' ')}
                      </div>
                      <div>
                        <span className="font-medium">Timeline:</span> {modal.offer.paymentTimeline} days
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Rejection Reason</label>
                    <textarea 
                      className="w-full p-2 border rounded-md mt-1" 
                      rows={3}
                      placeholder="Enter rejection reason..."
                    ></textarea>
                  </div>
                  
                  <div className="flex gap-2 justify-end">
                    <Button variant="outline" onClick={() => setModal(null)}>
                      Cancel
                    </Button>
                    <Button variant="destructive" onClick={() => handleReject(modal.offer.id, "Rejected by admin")}>
                      Confirm Rejection
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 