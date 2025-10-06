"use client";
import React, { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Eye, Edit, Clock, CheckCircle, TrendingUp } from "lucide-react";
import SettlementOfferForm from "./SettlementOfferForm";
import { createSettlementOffer, getSettlementsWithStatus } from "@/app/services/dashboard";
import { Settlement, } from "@/lib/types/settlement";
import { formatStatus } from "@/lib/utils/text-formatting";

// Interface for the form data
interface SettlementFormData {
  claimId: string;
  clientName: string;
  claimType: string;
  assessedAmount: number;
  deductions: number;
  serviceFeePercentage: number;
  finalAmount: number;
  paymentMethod: string;
  paymentTimeline: number;
  offerValidityPeriod: number;
  specialConditions: string;
  status: string;
  supportingDocuments: string[];
}

interface CreateOffersTabProps {
  settlements: Settlement[];
  loading: boolean;
  refetch?: () => void;
}



export default function CreateOffersTab({ settlements, loading, refetch }: CreateOffersTabProps) {
  const availableSettlements = useMemo(() => settlements && settlements.length > 0 ? settlements : [], [settlements]);
  const [, setOffers] = useState<Settlement[]>(availableSettlements);
  const [settlementsData, setSettlementsData] = useState<Settlement[]>([]);
  const [settlementsLoading, setSettlementsLoading] = useState(false);
  const [modal, setModal] = useState<{ mode: "create" | "view" | "edit"; offer?: Settlement } | null>(null);
  const [search, setSearch] = useState("");

  console.log(availableSettlements, "availableSettlements__");

  // Use settlements data if available, otherwise fall back to mock data

  // Function to fetch settlements from API
  const fetchSettlements = async () => {
    try {
      setSettlementsLoading(true);
      const response = await getSettlementsWithStatus('settlement_offered');
      console.log('Settlements API response:', response);
      
      // Extract data from the nested response structure
      let settlementsArray = [];
      if (response && typeof response === 'object' && 'data' in response && response.data && typeof response.data === 'object' && 'data' in response.data && Array.isArray(response.data.data)) {
        settlementsArray = response.data.data;
      } else if (Array.isArray(response)) {
        settlementsArray = response;
      }
      
      setSettlementsData(settlementsArray);
    } catch (error) {
      console.error('Error fetching settlements:', error);
      setSettlementsData([]);
    } finally {
      setSettlementsLoading(false);
    }
  };

  useEffect(() => {
    setOffers(availableSettlements);
    fetchSettlements(); // Fetch settlements on component mount
  }, [availableSettlements]);


  // Filter settlements data based on search
  const filteredSettlements = settlementsData.filter((settlement) => {
    if (!search) return true;
    const searchLower = search.toLowerCase();
    return (
      (settlement as { client_name?: string })?.client_name?.toLowerCase().includes(searchLower) ||
      settlement?.id?.toString().toLowerCase().includes(searchLower) ||
      settlement?.claim_type?.toLowerCase().includes(searchLower)
    );
  });

  // const filteredOffers = offers.filter((offer) =>
  //   offer?.client.toLowerCase().includes(search.toLowerCase()) ||
  //   offer.id.toString().toLowerCase().includes(search.toLowerCase()) ||
  //   offer.claim_type.toLowerCase().includes(search.toLowerCase())
  // );

  async function handleCreateOffer(newOffer: SettlementFormData) {
    try {
      console.log(newOffer, "newOffer__");
      const payload = {
        claim_id: newOffer.claimId,
        offer_amount: newOffer.finalAmount,
        status: "submitted",
        assessed_claim_value: newOffer.assessedAmount,
        deductions: newOffer.deductions,
        service_fee_percentage: newOffer.serviceFeePercentage,
        payment_method: newOffer.paymentMethod.toLowerCase(),
        payment_timeline: newOffer.paymentTimeline,
        offer_validity_period: newOffer.offerValidityPeriod,
        special_conditions: newOffer.specialConditions,
        supporting_documents: newOffer.supportingDocuments,
      }
      console.log(payload, "payload__");
      const response = await createSettlementOffer(payload);
      console.log(response, "response__");
      if (refetch) {
        refetch();
      }
      setModal(null);
    } catch (error) {
      console.error(error, "error__");
      setModal(null);
    }
  }



  function getStatusBadge(status: string) {
    console.log(status, "status__");
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

    const config = statusConfig[status?.toUpperCase() as keyof typeof statusConfig] || statusConfig.DRAFT;
    return <Badge variant={config?.variant}>{formatStatus(config?.label)}</Badge>;
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

      {/* KPI Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Offers</p>
                <p className="text-2xl font-bold">0</p>
              </div>
              <div className="text-blue-600 font-bold text-lg">₦</div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending Approval</p>
                <p className="text-2xl font-bold">0</p>
              </div>
              <Clock className="h-4 w-4 text-orange-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Ready to Present</p>
                <p className="text-2xl font-bold">0</p>
              </div>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Settled</p>
                <p className="text-2xl font-bold">₦0</p>
              </div>
              <TrendingUp className="h-4 w-4 text-emerald-600" />
            </div>
          </div>
        </Card>
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

      <Card>
        <div className="p-6 border-b">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">View Created Offers</h3>
          </div>
          <Input
            placeholder="Search offers by client name, offer ID, or claim type..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-64"
          />
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
              {settlementsLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground">
                    Loading settlements...
                  </TableCell>
                </TableRow>
              ) : filteredSettlements.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground">
                    No settlement offers found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredSettlements.map((settlement) => (
                <TableRow key={settlement.id}>
                  <TableCell className="font-medium">{settlement.id || 'N/A'}</TableCell>
                  <TableCell>{(settlement as { client_name?: string }).client_name || 'N/A'}</TableCell>
                  <TableCell>{settlement.claim_type || 'N/A'}</TableCell>
                  <TableCell>₦{settlement.offer_amount || (settlement as { final_amount?: string | number }).final_amount || '0'}</TableCell>
                  <TableCell>{getStatusBadge(settlement.status || 'settlement_offered')}</TableCell>
                  <TableCell>{settlement?.created_at ? new Date(settlement.created_at).toLocaleDateString() : 'N/A'}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setModal({ mode: "view", offer: settlement })}
                        title="View Offer Details"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {settlement.status === "DRAFT" && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setModal({ mode: "edit", offer: settlement })}
                            title="Edit Offer"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>

                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
                ))
              )}
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
                      <span className="font-medium">Offer ID:</span> {modal.offer.id}
                    </div>
                    <div>
                      <span className="font-medium">Client:</span> {modal.offer.client}
                    </div>
                    <div>
                      <span className="font-medium">Claim Type:</span> {modal.offer.claim_type}
                    </div>
                    <div>
                      <span className="font-medium">Status:</span> {getStatusBadge(modal.offer.status)}
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-2">Offer Calculation</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>Assessed Amount: ₦{modal.offer.assessed_claim_value}</div>
                      <div>Deductions: ₦{modal.offer.deductions}</div>
                      <div>Service Fee: {modal.offer.service_fee_percentage}%</div>
                      <div className="font-bold">Final Amount: ₦{modal.offer.offer_amount}</div>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-2">Offer Terms</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>Payment Method: {modal.offer.payment_method.replace('_', ' ')}</div>
                      <div>Payment Timeline: {modal.offer.payment_timeline} days</div>
                      <div>Validity Period: {modal.offer.offer_validity_period} days</div>
                      <div>Created: {modal.offer.created_at ? new Date(modal.offer.created_at).toLocaleDateString() : "N/A"}</div>
                    </div>
                  </div>

                  {modal.offer.special_conditions && (
                    <div className="border-t pt-4">
                      <h4 className="font-medium mb-2">Special Conditions</h4>
                      <p className="text-sm">{modal.offer.special_conditions}</p>
                    </div>
                  )}

                  {modal.offer.supporting_documents.length > 0 && (
                    <div className="border-t pt-4">
                      <h4 className="font-medium mb-2">Supporting Documents</h4>
                      <div className="flex flex-wrap gap-2">
                        {modal.offer.supporting_documents.map((doc, index) => (
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


          </div>
        </div>
      )}
    </div>
  );
} 