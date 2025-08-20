"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, Edit, RotateCcw } from "lucide-react";
import PaymentProcessingForm from "./PaymentProcessingForm";
import type { SettlementOffer, ClientResponse, PaymentDetails } from "@/lib/types/settlement";

interface ManageOffersTabProps {
  settlements: any[];
  loading: boolean;
}

// Mock active offers with different statuses (fallback)
const activeOffers: (SettlementOffer & { clientResponse?: ClientResponse })[] = [
  {
    id: "8",
    offerId: "OFF-008",
    claimId: "8",
    clientName: "Alice Johnson",
    claimType: "Motor",
    assessedAmount: 60000,
    deductions: 3000,
    serviceFeePercentage: 10,
    finalAmount: 51000,
    paymentMethod: "BANK_TRANSFER",
    paymentTimeline: 7,
    offerValidityPeriod: 14,
    specialConditions: "Payment within 7 days for 5% discount",
    status: "PAYMENT_PROCESSING",
    createdBy: "Sarah K.",
    createdAt: new Date("2024-01-10"),
    approvedAt: new Date("2024-01-12"),
    presentedAt: new Date("2024-01-13"),
    expiresAt: new Date("2024-01-27"),
    supportingDocuments: ["assessment_report.pdf", "settlement_breakdown.pdf"],
    clientResponse: {
      responseType: "ACCEPTED",
      responseDate: new Date("2024-01-14"),
      comments: "Client accepts the offer",
    },
    paymentDetails: {
      paymentId: "PAY-001",
      paymentDate: new Date("2024-01-15"),
      paymentAmount: 51000,
      paymentMethod: "BANK_TRANSFER",
      transactionReference: "TXN123456789",
      bankName: "First Bank of Nigeria",
      accountNumber: "1234567890",
      accountName: "Alice Johnson",
      paymentStatus: "PROCESSING",
      processedBy: "Sarah K.",
      processedAt: new Date("2024-01-15"),
      paymentNotes: "Payment initiated",
      receiptNumber: "RCP-001",
    },
  },
  {
    id: "9",
    offerId: "OFF-009",
    claimId: "9",
    clientName: "GHI Co",
    claimType: "Property",
    assessedAmount: 120000,
    deductions: 15000,
    serviceFeePercentage: 8,
    finalAmount: 95400,
    paymentMethod: "CHEQUE",
    paymentTimeline: 14,
    offerValidityPeriod: 21,
    specialConditions: "",
    status: "PAID",
    createdBy: "Mike T.",
    createdAt: new Date("2024-01-08"),
    approvedAt: new Date("2024-01-09"),
    presentedAt: new Date("2024-01-10"),
    expiresAt: new Date("2024-01-31"),
    supportingDocuments: ["assessment_report.pdf", "property_photos.pdf"],
    clientResponse: {
      responseType: "ACCEPTED",
      responseDate: new Date("2024-01-12"),
      comments: "Client accepts the offer",
    },
    paymentDetails: {
      paymentId: "PAY-002",
      paymentDate: new Date("2024-01-13"),
      paymentAmount: 95400,
      paymentMethod: "CHEQUE",
      transactionReference: "CHQ987654321",
      paymentStatus: "COMPLETED",
      processedBy: "Mike T.",
      processedAt: new Date("2024-01-13"),
      paymentNotes: "Cheque cleared successfully",
      receiptNumber: "RCP-002",
    },
  },
  {
    id: "10",
    offerId: "OFF-010",
    claimId: "10",
    clientName: "Carol Smith",
    claimType: "Motor",
    assessedAmount: 45000,
    deductions: 2000,
    serviceFeePercentage: 10,
    finalAmount: 38700,
    paymentMethod: "BANK_TRANSFER",
    paymentTimeline: 7,
    offerValidityPeriod: 14,
    specialConditions: "",
    status: "PAYMENT_PROCESSING",
    createdBy: "David L.",
    createdAt: new Date("2024-01-07"),
    approvedAt: new Date("2024-01-08"),
    presentedAt: new Date("2024-01-09"),
    expiresAt: new Date("2024-01-24"),
    supportingDocuments: ["assessment_report.pdf", "vehicle_photos.pdf"],
    clientResponse: {
      responseType: "ACCEPTED",
      responseDate: new Date("2024-01-11"),
      comments: "Client accepts the offer",
    },
    paymentDetails: {
      paymentId: "PAY-003",
      paymentDate: new Date("2024-01-12"),
      paymentAmount: 38700,
      paymentMethod: "BANK_TRANSFER",
      transactionReference: "TXN987654321",
      bankName: "Zenith Bank",
      accountNumber: "0987654321",
      accountName: "Carol Smith",
      paymentStatus: "PROCESSING",
      processedBy: "David L.",
      processedAt: new Date("2024-01-12"),
      paymentNotes: "Payment initiated",
      receiptNumber: "RCP-003",
    },
  },
];

export default function ManageOffersTab({ settlements, loading }: ManageOffersTabProps) {
  const [offers, setOffers] = useState<(SettlementOffer & { clientResponse?: ClientResponse })[]>(activeOffers);
  const [modal, setModal] = useState<{ mode: "view" | "edit" | "payment"; offer: SettlementOffer & { clientResponse?: ClientResponse } } | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Use settlements data if available, otherwise fall back to mock data
  const availableSettlements = settlements.length > 0 ? settlements : [];

  const filteredOffers = offers.filter((offer) => {
    const matchesSearch = offer.clientName.toLowerCase().includes(search.toLowerCase()) ||
      offer.offerId.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" ||
      (statusFilter === "pending" && !offer.clientResponse) ||
      (statusFilter === "accepted" && offer.clientResponse?.responseType === "ACCEPTED") ||
      (statusFilter === "rejected" && offer.clientResponse?.responseType === "REJECTED") ||
      (statusFilter === "counter" && offer.clientResponse?.responseType === "COUNTER_OFFER") ||
      (statusFilter === "expired" && offer.expiresAt && new Date() > offer.expiresAt) ||
      (statusFilter === "payment_processing" && offer.status === "PAYMENT_PROCESSING") ||
      (statusFilter === "paid" && offer.status === "PAID");
    return matchesSearch && matchesStatus;
  });

  function getDaysLeft(expiresAt: Date) {
    const days = Math.ceil((expiresAt.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    if (days < 0) return "Expired";
    if (days === 0) return "Today";
    if (days === 1) return "1 day";
    return `${days} days`;
  }

  function getLastContact(offer: SettlementOffer & { clientResponse?: ClientResponse }) {
    if (offer.clientResponse) {
      const days = Math.floor((new Date().getTime() - offer.clientResponse.responseDate.getTime()) / (1000 * 60 * 60 * 24));
      if (days === 0) return "Today";
      if (days === 1) return "Yesterday";
      return `${days} days ago`;
    }
    const days = Math.floor((new Date().getTime() - offer.presentedAt!.getTime()) / (1000 * 60 * 60 * 24));
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    return `${days} days ago`;
  }

  function getStatusBadge(offer: SettlementOffer & { clientResponse?: ClientResponse }) {
    // Check for payment-related statuses first
    if (offer.status === "PAYMENT_PROCESSING") {
      return <Badge variant="secondary">Payment Processing</Badge>;
    }
    if (offer.status === "PAID") {
      return <Badge variant="default">Paid</Badge>;
    }
    if (offer.status === "CANCELLED") {
      return <Badge variant="destructive">Cancelled</Badge>;
    }

    if (offer.expiresAt && new Date() > offer.expiresAt) {
      return <Badge variant="secondary">Expired</Badge>;
    }

    if (offer.clientResponse) {
      switch (offer.clientResponse.responseType) {
        case "ACCEPTED":
          return <Badge variant="default">Accepted</Badge>;
        case "REJECTED":
          return <Badge variant="destructive">Rejected</Badge>;
        case "COUNTER_OFFER":
          return <Badge variant="outline">Counter-Offered</Badge>;
      }
    }

    return <Badge variant="secondary">Pending Response</Badge>;
  }

  function handleMarkExpired(offerId: string) {
    setOffers(prev => prev.map(offer =>
      offer.id === offerId
        ? { ...offer, status: "EXPIRED" as SettlementOffer["status"] }
        : offer
    ));
  }

  function handlePaymentProcessing(offer: typeof activeOffers[0]) {
    setModal({ mode: "payment-processing", offer });
  }

  function handlePaymentSubmit(paymentDetails: PaymentDetails) {
    console.log("Payment submitted:", paymentDetails);
    // In a real app, this would update the offer status and payment details
    setModal(null);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Manage Offers</h2>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <Card className="p-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading settlements data...</p>
          </div>
        </Card>
      )}

      {/* Data Info */}
      {/* {!loading && availableSettlements.length > 0 && (
        <Card className="p-4">
          <div className="text-muted-foreground">
            Loaded {availableSettlements.length} settlements from API
          </div>
        </Card>
      )} */}

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
            <SelectItem value="pending">Pending Response</SelectItem>
            <SelectItem value="accepted">Accepted</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
            <SelectItem value="counter">Counter-Offered</SelectItem>
            <SelectItem value="expired">Expired</SelectItem>
            <SelectItem value="payment_processing">Payment Processing</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold">Active Offers Dashboard</h3>
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
                <TableHead>Last Contact</TableHead>
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
                  <TableCell>₦{offer.finalAmount.toLocaleString()}</TableCell>
                  <TableCell>{getStatusBadge(offer)}</TableCell>
                  <TableCell>
                    {offer.expiresAt ? getDaysLeft(offer.expiresAt) : "N/A"}
                  </TableCell>
                  <TableCell>{getLastContact(offer)}</TableCell>
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
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setModal({ mode: "manage", offer })}
                        title="Manage Response"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      {!offer.clientResponse && offer.expiresAt && new Date() > offer.expiresAt && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleMarkExpired(offer.id)}
                          title="Mark as Expired"
                        >
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                      )}
                      {offer.clientResponse?.responseType === "ACCEPTED" && offer.status !== "PAYMENT_PROCESSING" && offer.status !== "PAID" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handlePaymentProcessing(offer)}
                          title="Move to Payment Processing"
                        >
                          {/* NairaIcon was removed, so this button will be empty or need a replacement */}
                        </Button>
                      )}
                      {offer.status === "PAYMENT_PROCESSING" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handlePaymentProcessing(offer)}
                          title="Process Payment"
                        >
                          {/* NairaIcon was removed, so this button will be empty or need a replacement */}
                        </Button>
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

            {modal.mode === "view" && modal.offer && (
              <>
                <h3 className="text-lg font-semibold mb-4">Offer Details & Response</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="font-medium">Offer ID:</span> {modal.offer.offerId}
                    </div>
                    <div>
                      <span className="font-medium">Client:</span> {modal.offer.clientName}
                    </div>
                    <div>
                      <span className="font-medium">Amount:</span> ₦{modal.offer.finalAmount.toLocaleString()}
                    </div>
                    <div>
                      <span className="font-medium">Status:</span> {getStatusBadge(modal.offer)}
                    </div>
                    <div>
                      <span className="font-medium">Expires:</span> {modal.offer.expiresAt?.toLocaleDateString()}
                    </div>
                    <div>
                      <span className="font-medium">Days Left:</span> {modal.offer.expiresAt ? getDaysLeft(modal.offer.expiresAt) : "N/A"}
                    </div>
                  </div>

                  {modal.offer.clientResponse && (
                    <div className="border-t pt-4">
                      <h4 className="font-medium mb-2">Client Response</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Response Type:</span> {modal.offer.clientResponse.responseType}
                        </div>
                        <div>
                          <span className="font-medium">Response Date:</span> {modal.offer.clientResponse.responseDate.toLocaleDateString()}
                        </div>
                        {modal.offer.clientResponse.counterOfferAmount && (
                          <div>
                            <span className="font-medium">Counter Offer:</span> ₦{modal.offer.clientResponse.counterOfferAmount.toLocaleString()}
                          </div>
                        )}
                        {modal.offer.clientResponse.comments && (
                          <div className="md:col-span-2">
                            <span className="font-medium">Comments:</span> {modal.offer.clientResponse.comments}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2 justify-end mt-6">
                    <Button variant="outline" onClick={() => setModal(null)}>
                      Close
                    </Button>
                    <Button onClick={() => setModal({ mode: "manage", offer: modal.offer })}>
                      Manage Response
                    </Button>
                  </div>
                </div>
              </>
            )}

            {modal.mode === "manage" && modal.offer && (
              <>
                <h3 className="text-lg font-semibold mb-4">Response Management</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="font-medium">Offer ID:</span> {modal.offer.offerId}
                    </div>
                    <div>
                      <span className="font-medium">Client:</span> {modal.offer.clientName}
                    </div>
                    <div>
                      <span className="font-medium">Amount:</span> ₦{modal.offer.finalAmount.toLocaleString()}
                    </div>
                    <div>
                      <span className="font-medium">Status:</span> {getStatusBadge(modal.offer)}
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-4">Available Actions</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Button variant="outline" className="justify-start">
                        {/* NairaIcon was removed, so this button will be empty or need a replacement */}
                        Call Client
                      </Button>
                      <Button variant="outline" className="justify-start">
                        {/* NairaIcon was removed, so this button will be empty or need a replacement */}
                        Send Reminder
                      </Button>
                      <Button variant="outline" className="justify-start">
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Extend Deadline
                      </Button>
                      {modal.offer.clientResponse?.responseType === "COUNTER_OFFER" && (
                        <Button variant="outline" className="justify-start">
                          <Edit className="h-4 w-4 mr-2" />
                          Respond to Counter-Offer
                        </Button>
                      )}
                      {modal.offer.clientResponse?.responseType === "ACCEPTED" && (
                        <Button
                          variant="outline"
                          className="justify-start"
                          onClick={() => modal.offer && handlePaymentProcessing(modal.offer)}
                        >
                          {/* NairaIcon was removed, so this button will be empty or need a replacement */}
                          Move to Payment Processing
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2 justify-end mt-6">
                    <Button variant="outline" onClick={() => setModal(null)}>
                      Close
                    </Button>
                  </div>
                </div>
              </>
            )}

            {modal.mode === "payment-processing" && modal.offer && (
              <>
                <h3 className="text-lg font-semibold mb-4">Payment Processing</h3>
                <PaymentProcessingForm
                  offer={modal.offer}
                  onSubmit={handlePaymentSubmit}
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