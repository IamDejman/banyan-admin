"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Eye, Edit, Mail, Phone, Calendar } from "lucide-react";
import type { PresentationSetup } from "@/lib/types/settlement";
import PresentationSetupForm from "./PresentationSetupForm";
import { Settlement } from "@/lib/types/settlement";
import { updateSettlementOffer } from "@/app/services/dashboard";
import { useToast } from "@/components/ui/use-toast";

interface PresentOffersTabProps {
  settlements: Settlement[];
  loading: boolean;
}



export default function PresentOffersTab({ settlements, loading }: PresentOffersTabProps) {
  const availableSettlements = settlements.length > 0 ? settlements : [];

  const [offers] = useState<Settlement[]>(availableSettlements);
  const [modal, setModal] = useState<{ mode: "setup" | "view" | "edit"; offer: Settlement } | null>(null);
  const [search, setSearch] = useState("");
  const { toast } = useToast();
  // Use settlements data if available, otherwise fall back to mock data

  const filteredOffers = offers.filter((offer) =>
    offer.client.toLowerCase().includes(search.toLowerCase()) ||
    offer.id.toString().toLowerCase().includes(search.toLowerCase())
  );

  async function handlePresentationSetup(offerId: string, setup: PresentationSetup) {

    console.log(offerId, setup, "offerId, setup__");
    const contactMethod = setup.contactMethod === "PHONE_CALL" ? "phone" : setup.contactMethod === "PHYSICAL_DELIVERY" ? "physical" : setup.contactMethod === "EMAIL" ? "email" : "sms";
    const payload = {
      claim_offer_id: offerId,
      contact_method: contactMethod,
      settlement_offer: setup.presentationPackage.settlementLetter,
      payment_breakdown: setup.presentationPackage.paymentBreakdown,
      terms_and_condition: setup.presentationPackage.termsAndConditions,
      bank_details_form: setup.presentationPackage.bankDetailsForm,
      acceptance_form: setup.presentationPackage.acceptanceForm,
      status: setup.isDraft ? "draft" : "sent",
      tracking_number: setup.trackingNumber,
      scheduled_send_date: setup.scheduledSendDate
    }
    console.log(payload, "payload__");
    try {
      const response = await updateSettlementOffer(payload);
      console.log(response, "response__");
      toast({
        title: "Presentation setup updated successfully",
        description: "Presentation setup updated successfully",
        variant: "default",
      });
      setModal(null);
      // Refresh the page after successful API call
      window.location.reload();
    } catch (error) {
      toast({
        title: "Error updating presentation setup",
        description: "Error updating presentation setup",
        variant: "destructive",
      });
      console.error(error, "error__");
      setModal(null);
    }
    // setOffers(prev => prev.map(offer =>
    //   offer.id === Number(offerId)
    //     ? { ...offer, presentation: setup }
    //     : offer
    // ));
    // setModal(null);
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
                  <TableCell className="font-medium">{offer.id}</TableCell>
                  <TableCell>{offer.client}</TableCell>
                  <TableCell>₦{offer.offer_amount}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getContactMethodIcon(offer.payment_method || "EMAIL")}
                      <span className="text-sm">
                        {offer.payment_method?.replace('_', ' ') || "Not Set"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {offer.send_status ? getStatusBadge(offer.send_status.toUpperCase()) : <Badge variant="secondary">Not Set</Badge>}
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
                      {(!offer.send_status || offer.send_status.toUpperCase() === "PENDING") && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setModal({ mode: offer.send_status ? "edit" : "setup", offer })}
                            title="Setup Presentation"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          {/* {offer.send_status.toUpperCase() !== "SENT" && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleSendOffer(offer.id.toString())}
                              title="Send Offer"
                            >
                              <Send className="h-4 w-4" />
                            </Button>
                          )} */}
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
                      <span className="font-medium">Offer ID:</span> {modal.offer.id}
                    </div>
                    <div>
                      <span className="font-medium">Client:</span> {modal.offer.client}
                    </div>
                    <div>
                      <span className="font-medium">Amount:</span> ₦{modal.offer.offer_amount}
                    </div>
                    <div>
                      <span className="font-medium">Contact Method:</span> {modal.offer.payment_method?.replace('_', ' ') || "Not Set"}
                    </div>
                  </div>

                  {modal.offer.send_status.toUpperCase() !== "SENT" && (
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
                          {modal.offer.special_conditions || "No custom message"}
                        </p>
                      </div>

                      <div className="border-t pt-4">
                        <h4 className="font-medium mb-2">Subject Line</h4>
                        <p className="text-sm">Settlement Offer</p>
                      </div>
                    </>
                  )}

                  <div className="flex gap-2 justify-end mt-6">
                    <Button variant="outline" onClick={() => setModal(null)}>
                      Close
                    </Button>
                    {(!modal.offer.send_status || modal.offer.send_status.toUpperCase() === "PENDING") && (
                      <Button onClick={() => setModal({ mode: modal.offer.send_status ? "edit" : "setup", offer: modal.offer })}>
                        {modal.offer.send_status ? "Edit Setup" : "Setup Presentation"}
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
                  onSubmit={(setup) => handlePresentationSetup(modal.offer.id.toString(), setup)}
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