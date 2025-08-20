"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Eye, Edit, Send, Mail, Phone, Calendar } from "lucide-react";
import type { SettlementOffer, PresentationSetup } from "@/lib/types/settlement";
import PresentationSetupForm from "./PresentationSetupForm";

interface PresentOffersTabProps {
  settlements: any[];
  loading: boolean;
}

// Mock approved offers ready for presentation (fallback)
const readyOffers: (SettlementOffer & { presentation?: PresentationSetup })[] = [
  {
    id: "6",
    offerId: "OFF-006",
    claimId: "6",
    clientName: "Bob Wilson",
    claimType: "Motor",
    assessedAmount: 90000,
    deductions: 5000,
    serviceFeePercentage: 10,
    finalAmount: 76000,
    paymentMethod: "BANK_TRANSFER",
    paymentTimeline: 7,
    offerValidityPeriod: 14,
    specialConditions: "Payment within 7 days for 5% discount",
    status: "APPROVED",
    createdBy: "Sarah K.",
    createdAt: new Date("2024-01-15"),
    approvedAt: new Date("2024-01-16"),
    supportingDocuments: ["assessment_report.pdf", "settlement_breakdown.pdf"],
    presentation: {
      contactMethod: "EMAIL",
      presentationPackage: {
        settlementLetter: true,
        paymentBreakdown: true,
        termsAndConditions: true,
        acceptanceForm: true,
        bankDetailsForm: false,
      },
      customMessage: "We are pleased to present your settlement offer.",
      subjectLine: "Settlement Offer - Claim CLM-006",
      deliveryStatus: "PENDING",
    },
  },
  {
    id: "7",
    offerId: "OFF-007",
    claimId: "7",
    clientName: "DEF Ltd",
    claimType: "Property",
    assessedAmount: 180000,
    deductions: 20000,
    serviceFeePercentage: 8,
    finalAmount: 145600,
    paymentMethod: "CHEQUE",
    paymentTimeline: 14,
    offerValidityPeriod: 21,
    specialConditions: "",
    status: "APPROVED",
    createdBy: "Mike T.",
    createdAt: new Date("2024-01-14"),
    approvedAt: new Date("2024-01-15"),
    supportingDocuments: ["assessment_report.pdf", "property_photos.pdf"],
    presentation: {
      contactMethod: "SMS",
      presentationPackage: {
        settlementLetter: true,
        paymentBreakdown: true,
        termsAndConditions: true,
        acceptanceForm: true,
        bankDetailsForm: true,
      },
      customMessage: "Your settlement offer is ready for review.",
      subjectLine: "Settlement Offer - Claim CLM-007",
      deliveryStatus: "SENT",
      sentAt: new Date("2024-01-16"),
    },
  },
];

export default function PresentOffersTab({ settlements, loading }: PresentOffersTabProps) {
  const [offers, setOffers] = useState<(SettlementOffer & { presentation?: PresentationSetup })[]>(readyOffers);
  const [modal, setModal] = useState<{ mode: "setup" | "view" | "edit"; offer: SettlementOffer & { presentation?: PresentationSetup } } | null>(null);
  const [search, setSearch] = useState("");

  // Use settlements data if available, otherwise fall back to mock data
  const availableSettlements = settlements.length > 0 ? settlements : [];

  const filteredOffers = offers.filter((offer) =>
    offer.clientName.toLowerCase().includes(search.toLowerCase()) ||
    offer.offerId.toLowerCase().includes(search.toLowerCase())
  );

  function handlePresentationSetup(offerId: string, setup: PresentationSetup) {
    setOffers(prev => prev.map(offer =>
      offer.id === offerId
        ? { ...offer, presentation: setup }
        : offer
    ));
    setModal(null);
  }

  function handleSendOffer(offerId: string) {
    setOffers(prev => prev.map(offer => {
      if (offer.id === offerId && offer.presentation) {
        return {
          ...offer,
          presentation: {
            ...offer.presentation,
            deliveryStatus: "SENT",
            sentAt: new Date(),
          },
        };
      }
      return offer;
    }));
  }

  function getContactMethodIcon(method: string) {
    switch (method) {
      case "EMAIL":
        return <Mail className="h-4 w-4" />;
      case "SMS":
        return <Phone className="h-4 w-4" />;
      case "PHONE_CALL":
        return <Phone className="h-4 w-4" />;
      case "PHYSICAL_DELIVERY":
        return <Calendar className="h-4 w-4" />;
      default:
        return <Mail className="h-4 w-4" />;
    }
  }

  function getStatusBadge(status: string) {
    const statusConfig = {
      PENDING: { label: "Pending", variant: "secondary" as const },
      SENT: { label: "Sent", variant: "default" as const },
      DELIVERED: { label: "Delivered", variant: "default" as const },
      FAILED: { label: "Failed", variant: "destructive" as const },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Present Offers</h2>
          <p className="text-muted-foreground">Send approved offers to clients</p>
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
          <div className="text-sm text-muted-foreground">
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
      </div>

      <Card>
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold">Ready to Present List</h3>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Offer ID</TableHead>
                <TableHead>Client Name</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Contact Method</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOffers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    No offers ready for presentation.
                  </TableCell>
                </TableRow>
              )}
              {filteredOffers.map((offer) => (
                <TableRow key={offer.id}>
                  <TableCell className="font-medium">{offer.offerId}</TableCell>
                  <TableCell>{offer.clientName}</TableCell>
                  <TableCell>₦{offer.finalAmount.toLocaleString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getContactMethodIcon(offer.presentation?.contactMethod || "EMAIL")}
                      <span className="text-sm">
                        {offer.presentation?.contactMethod?.replace('_', ' ') || "Not Set"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {offer.presentation ? getStatusBadge(offer.presentation.deliveryStatus) : <Badge variant="secondary">Not Set</Badge>}
                  </TableCell>
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
                      {(!offer.presentation || offer.presentation.deliveryStatus === "PENDING") && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setModal({ mode: offer.presentation ? "edit" : "setup", offer })}
                            title="Setup Presentation"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          {offer.presentation && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleSendOffer(offer.id)}
                              title="Send Offer"
                            >
                              <Send className="h-4 w-4" />
                            </Button>
                          )}
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
                <h3 className="text-lg font-semibold mb-4">Presentation Preview</h3>
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
                      <span className="font-medium">Contact Method:</span> {modal.offer.presentation?.contactMethod?.replace('_', ' ') || "Not Set"}
                    </div>
                  </div>

                  {modal.offer.presentation && (
                    <>
                      <div className="border-t pt-4">
                        <h4 className="font-medium mb-2">Presentation Package</h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>✓ Settlement Letter</div>
                          <div>✓ Payment Breakdown</div>
                          <div>✓ Terms and Conditions</div>
                          <div>✓ Acceptance Form</div>
                          <div>✓ Bank Details Form</div>
                        </div>
                      </div>

                      <div className="border-t pt-4">
                        <h4 className="font-medium mb-2">Custom Message</h4>
                        <p className="text-sm bg-muted/50 p-3 rounded">
                          {modal.offer.presentation.customMessage || "No custom message"}
                        </p>
                      </div>

                      <div className="border-t pt-4">
                        <h4 className="font-medium mb-2">Subject Line</h4>
                        <p className="text-sm">{modal.offer.presentation.subjectLine}</p>
                      </div>
                    </>
                  )}

                  <div className="flex gap-2 justify-end mt-6">
                    <Button variant="outline" onClick={() => setModal(null)}>
                      Close
                    </Button>
                    {(!modal.offer.presentation || modal.offer.presentation.deliveryStatus === "PENDING") && (
                      <Button onClick={() => setModal({ mode: modal.offer.presentation ? "edit" : "setup", offer: modal.offer })}>
                        {modal.offer.presentation ? "Edit Setup" : "Setup Presentation"}
                      </Button>
                    )}
                  </div>
                </div>
              </>
            )}

            {(modal.mode === "setup" || modal.mode === "edit") && (
              <>
                <h3 className="text-lg font-semibold mb-4">
                  {modal.mode === "setup" ? "Offer Presentation Setup" : "Edit Presentation Setup"}
                </h3>
                <PresentationSetupForm
                  offer={modal.offer}
                  existingSetup={modal.offer.presentation}
                  onSubmit={(setup) => handlePresentationSetup(modal.offer.id, setup)}
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