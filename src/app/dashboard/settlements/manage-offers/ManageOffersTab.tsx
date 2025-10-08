"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, Edit, RotateCcw, Search } from "lucide-react";
import PaymentProcessingForm from "./PaymentProcessingForm";
import type {  ClientResponse, PaymentDetails } from "@/lib/types/settlement";
import { Settlement } from "@/lib/types/settlement";
import { formatDate } from "@/lib/utils/text-formatting";
import { getSettlementsWithStatus } from "@/app/services/dashboard";

// Removed unused interface ManageOffersTabProps



export default function ManageOffersTab({ loading }: { loading: boolean }) {
  // const availableSettlements = settlements.length > 0 ? settlements : []; // Removed unused variable

  // const [offers, setOffers] = useState<Settlement[]>(availableSettlements); // Removed unused variable
  const [settlementsData, setSettlementsData] = useState<Settlement[]>([]);
  // const [settlementsLoading, setSettlementsLoading] = useState(false); // Removed unused variable
  const [modal, setModal] = useState<{ mode: "view" | "edit" | "payment" | "manage" | "payment-processing"; offer: Settlement } | null>(null);
  const [search, setSearch] = useState("");
  const [claimTypeFilter, setClaimTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Function to fetch managed settlements from API (settlement_presented, settlement_accepted, settlement_rejected, settlement_paid)
  const fetchManagedSettlements = async () => {
    try {
      // setSettlementsLoading(true); // Removed unused
      // Fetch settlements with multiple statuses
      const statuses = ['settlement_presented', 'settlement_accepted', 'settlement_rejected', 'settlement_paid'];
      const allSettlements = [];
      
      for (const status of statuses) {
        try {
          const response = await getSettlementsWithStatus(status);
          console.log(`${status} settlements API response:`, response);
          
          // Extract data from the nested response structure
          let settlementsArray = [];
          if (response && typeof response === 'object' && 'data' in response && response.data && typeof response.data === 'object' && 'data' in response.data && Array.isArray(response.data.data)) {
            settlementsArray = response.data.data;
          } else if (Array.isArray(response)) {
            settlementsArray = response;
          }
          
          allSettlements.push(...settlementsArray);
        } catch (error) {
          console.error(`Error fetching ${status} settlements:`, error);
        }
      }
      
      setSettlementsData(allSettlements);
    } catch (error) {
      console.error('Error fetching managed settlements:', error);
      setSettlementsData([]);
    } finally {
      // setSettlementsLoading(false); // Removed unused
    }
  };

  // Fetch managed settlements on component mount
  useEffect(() => {
    fetchManagedSettlements();
  }, []);

  // Use settlements data if available, otherwise fall back to mock data

  // Extract unique claim types from settlements data
  const extractUniqueClaimTypes = (settlementsData: Settlement[]): string[] => {
    const claimTypeSet = new Set<string>();
    settlementsData.forEach((settlement: Settlement) => {
      if (settlement.claim_type) {
        claimTypeSet.add(settlement.claim_type.toLowerCase());
      }
    });
    return Array.from(claimTypeSet).sort();
  };

  const availableClaimTypes = extractUniqueClaimTypes(settlementsData);

  const filteredOffers = settlementsData.filter((offer) => {
    const searchLower = search.toLowerCase();
    const matchesSearch = !search || (
      offer.client.toLowerCase().includes(searchLower) ||
      offer.id.toString().toLowerCase().includes(searchLower) ||
      offer.claim_type?.toLowerCase().includes(searchLower) ||
      (offer as Settlement & { amount?: number }).amount?.toString().toLowerCase().includes(searchLower)
    );
    
    const matchesClaimType = claimTypeFilter === "all" || 
      (offer.claim_type && offer.claim_type.toLowerCase() === claimTypeFilter);
    
    const matchesStatus = statusFilter === "all" ||
      (statusFilter === "settlement_presented" && offer.status === "settlement_presented") ||
      (statusFilter === "settlement_accepted" && offer.status === "settlement_accepted") ||
      (statusFilter === "settlement_rejected" && offer.status === "settlement_rejected") ||
      (statusFilter === "settlement_paid" && offer.status === "settlement_paid");
    
    return matchesSearch && matchesClaimType && matchesStatus;
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

  // Removed unused handleMarkExpired function

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

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:gap-4 flex-1">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by Claim ID, Client name, or amount..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-8 w-full"
            />
          </div>
          <Select value={claimTypeFilter} onValueChange={setClaimTypeFilter}>
            <SelectTrigger className="w-full lg:w-48">
              <SelectValue placeholder="Filter by Claim Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Claim Types</SelectItem>
              {availableClaimTypes.map((claimType) => (
                <SelectItem key={claimType} value={claimType}>
                  {claimType.charAt(0).toUpperCase() + claimType.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full lg:w-48">
              <SelectValue placeholder="Filter by Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="settlement_presented">Presented</SelectItem>
              <SelectItem value="settlement_accepted">Accepted</SelectItem>
              <SelectItem value="settlement_rejected">Rejected</SelectItem>
              <SelectItem value="settlement_paid">Paid</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold">Active Offers Dashboard</h3>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Claim ID</TableHead>
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
                      {/* Removed Mark as Expired button - function was removed */}
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
                      <span className="font-medium">Expires:</span> {modal.offer.expiry_period ? formatDate(modal.offer.expiry_period) : "N/A"}
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
                          <span className="font-medium">Response Date:</span> {formatDate(modal.offer.client_response.responseDate)}
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