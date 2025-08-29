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
import type {  ClientResponse, PaymentDetails } from "@/lib/types/settlement";
import { Settlement } from "@/lib/types/settlement";

interface ManageOffersTabProps {
  settlements: Settlement[];
  loading: boolean;
}



export default function ManageOffersTab({ settlements, loading }: ManageOffersTabProps) {
  const availableSettlements = settlements.length > 0 ? settlements : [];

  const [offers, setOffers] = useState<Settlement[]>(availableSettlements);
  const [modal, setModal] = useState<{ mode: "view" | "edit" | "payment" | "manage" | "payment-processing"; offer: Settlement } | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Use settlements data if available, otherwise fall back to mock data

  const filteredOffers = offers.filter((offer) => {
    const matchesSearch = offer.client.toLowerCase().includes(search.toLowerCase()) ||
      offer.id.toString().toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" ||
      (statusFilter === "pending" && !offer.send_status) ||
      (statusFilter === "accepted" && offer.send_status === "sent") ||
      (statusFilter === "rejected" && offer.send_status === "rejected") ||
      (statusFilter === "counter" && offer.send_status === "counter_offered") ||
      (statusFilter === "expired" && offer.expired) ||
      (statusFilter === "payment_processing" && offer.send_status === "payment_processing") ||
      (statusFilter === "paid" && offer.send_status === "paid"); 
    return matchesSearch && matchesStatus;
  });

  function getDaysLeft(expiresAt: Date) {
    const days = Math.ceil((expiresAt.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    if (days < 0) return "Expired";
    if (days === 0) return "Today";
    if (days === 1) return "1 day";
    return `${days} days`;
  }

  function getLastContact(offer: Settlement & { clientResponse?: ClientResponse }) {
    if (offer.clientResponse) {
      const days = Math.floor((new Date().getTime() - offer.clientResponse.responseDate.getTime()) / (1000 * 60 * 60 * 24));
      if (days === 0) return "Today";
      if (days === 1) return "Yesterday";
      return `${days} days ago`;
    }
    const days = Math.floor((new Date().getTime() - new Date(offer.presented_at!).getTime()) / (1000 * 60 * 60 * 24));
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    return `${days} days ago`;
  }

  function getStatusBadge(offer: Settlement) {
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

    if (offer.expiry_period && new Date() > new Date(offer.expiry_period)) {
      return <Badge variant="secondary">Expired</Badge>;
    }

    if (offer?.client_response) {
      switch (offer.client_response.responseType) {
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
      offer.id === Number(offerId)
        ? { ...offer, expired: true }
        : offer
    ));
  }

  function handlePaymentProcessing(offer: Settlement) {
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
                  <TableCell className="font-medium">{offer.id}</TableCell>
                  <TableCell>{offer.client}</TableCell>
                  <TableCell>₦{offer.offer_amount}</TableCell>
                  <TableCell>{getStatusBadge(offer)}</TableCell>
                  <TableCell>
                    {offer.expired ? getDaysLeft(new Date(offer.expiry_period)) : "N/A"}
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
                      {!offer.client_response && offer.expiry_period && new Date() > new Date(offer.expiry_period) && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleMarkExpired(offer.id.toString())}
                          title="Mark as Expired"
                        >
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                      )}
                      {offer.client_response?.responseType === "ACCEPTED" && offer.status !== "PAYMENT_PROCESSING" && offer.status !== "PAID" && (
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
                      <span className="font-medium">Offer ID:</span> {modal.offer.id}
                    </div>
                    <div>
                      <span className="font-medium">Client:</span> {modal.offer.client}
                    </div>
                    <div>
                      <span className="font-medium">Amount:</span> ₦{modal.offer.offer_amount}
                    </div>
                    <div>
                      <span className="font-medium">Status:</span> {getStatusBadge(modal.offer)}
                    </div>
                    <div>
                      <span className="font-medium">Expires:</span> {modal.offer.expiry_period ? new Date(modal.offer.expiry_period).toLocaleDateString() : "N/A"}
                    </div>
                    <div>
                      <span className="font-medium">Days Left:</span> {modal.offer.expiry_period ? getDaysLeft(new Date(modal.offer.expiry_period)) : "N/A"}
                    </div>
                  </div>

                  {modal.offer.client_response && (
                    <div className="border-t pt-4">
                      <h4 className="font-medium mb-2">Client Response</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Response Type:</span> {modal.offer.client_response.responseType}
                        </div>
                        <div>
                          <span className="font-medium">Response Date:</span> {modal.offer.client_response.responseDate.toLocaleDateString()}
                        </div>
                        {modal.offer.client_response.counterOfferAmount && (
                          <div>
                            <span className="font-medium">Counter Offer:</span> ₦{modal.offer.client_response.counterOfferAmount.toLocaleString()}
                          </div>
                        )}
                        {modal.offer.client_response.comments && (
                          <div className="md:col-span-2">
                            <span className="font-medium">Comments:</span> {modal.offer.client_response.comments}
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
                      <span className="font-medium">Offer ID:</span> {modal.offer.id}
                    </div>
                    <div>
                      <span className="font-medium">Client:</span> {modal.offer.client}
                    </div>
                    <div>
                      <span className="font-medium">Amount:</span> ₦{modal.offer.offer_amount}
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
                      {modal.offer.client_response?.responseType === "COUNTER_OFFER" && (
                        <Button variant="outline" className="justify-start">
                          <Edit className="h-4 w-4 mr-2" />
                          Respond to Counter-Offer
                        </Button>
                      )}
                        {modal.offer.client_response?.responseType === "ACCEPTED" && (
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