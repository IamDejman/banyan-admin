"use client";
import React, { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Eye, Edit, Clock, Search, FileText, Trash2, CheckCircle, X } from "lucide-react";
import SettlementOfferForm from "./SettlementOfferForm";
import { createSettlementOffer, getSettlementsWithStatus, approveSettlementOffer, rejectSettlementOffer, getClaimOffersStatistics } from "@/app/services/dashboard";
import { Settlement, } from "@/lib/types/settlement";
import { formatStatus, formatDateTime } from "@/lib/utils/text-formatting";

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

interface ClaimOffersStatistics {
  created_offers?: number;
  pending_approval?: number;
  [key: string]: unknown;
}



export default function CreateOffersTab({ settlements, loading, refetch }: CreateOffersTabProps) {
  const availableSettlements = useMemo(() => settlements && settlements.length > 0 ? settlements : [], [settlements]);
  
  // Format amount with commas
  const formatAmount = (amount: string | number | undefined): string => {
    if (!amount) return '₦0';
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    if (isNaN(numAmount)) return '₦0';
    return `₦${numAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };
  const [, setOffers] = useState<Settlement[]>(availableSettlements);
  const [settlementsData, setSettlementsData] = useState<Settlement[]>([]);
  const [settlementsLoading, setSettlementsLoading] = useState(false);
  const [modal, setModal] = useState<{ mode: "create" | "view" | "edit" | "drafts"; offer?: Settlement } | null>(null);
  const [search, setSearch] = useState("");
  const [claimTypeFilter, setClaimTypeFilter] = useState<string>("all");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [drafts, setDrafts] = useState<Array<{
    key: string;
    claimId: string;
    claimNumber: string;
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
    paymentDueDate?: string;
    offerExpiryDate?: string;
    savedAt: Date;
  }>>([]);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [statistics, setStatistics] = useState<ClaimOffersStatistics>({
    created_offers: 0,
    pending_approval: 0,
  });
  const [statisticsLoading, setStatisticsLoading] = useState(false);

  console.log(availableSettlements, "availableSettlements__");

  // Function to get saved drafts
  const getSavedDrafts = () => {
    const draftKeys = Object.keys(localStorage).filter(key => key.startsWith('settlement-offer-draft-'));
    const savedDrafts = draftKeys.map(key => {
      try {
        const draftData = JSON.parse(localStorage.getItem(key) || '{}');
        console.log('Loading draft data:', draftData);
        return {
          key,
          ...draftData,
          savedAt: new Date(draftData.savedAt || key.split('-').pop())
        };
      } catch (error) {
        console.error('Error parsing draft:', error);
        return null;
      }
    }).filter(Boolean);
    
    return savedDrafts.sort((a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime());
  };

  // Load drafts when component mounts
  useEffect(() => {
    setDrafts(getSavedDrafts());
  }, []);

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

  // Function to fetch statistics from API
  const fetchStatistics = async () => {
    try {
      setStatisticsLoading(true);
      const response = await getClaimOffersStatistics();
      console.log('Statistics API response:', response);
      
      // Extract statistics from response - handle various response structures
      let stats: ClaimOffersStatistics = {
        created_offers: 0,
        pending_approval: 0,
      };
      
      if (response && typeof response === 'object') {
        // Try to find the data in different possible locations
        let data: unknown = null;
        
        // Check if response has nested data structure: response.data.data
        if ('data' in response && response.data && typeof response.data === 'object') {
          if ('data' in response.data && response.data.data && typeof response.data.data === 'object') {
            data = response.data.data;
          } else {
            data = response.data;
          }
        } else {
          // Response might be the data directly
          data = response;
        }
        
        if (data && typeof data === 'object') {
          const statsData = data as Record<string, unknown>;
          
          // Extract created_offers - try multiple possible field names
          const createdOffers = 
            (typeof statsData.created_offers === 'number' ? statsData.created_offers : null) ||
            (typeof statsData.total_offers === 'number' ? statsData.total_offers : null) ||
            (typeof statsData.offers_created === 'number' ? statsData.offers_created : null) ||
            0;
          
          // Extract offers_pending_approval - try multiple possible field names
          const pendingApproval = 
            (typeof statsData.offers_pending_approval === 'number' ? statsData.offers_pending_approval : null) ||
            (typeof statsData.pending_approval === 'number' ? statsData.pending_approval : null) ||
            (typeof statsData.pending === 'number' ? statsData.pending : null) ||
            (typeof statsData.offers_pending === 'number' ? statsData.offers_pending : null) ||
            0;
          
          stats = {
            created_offers: createdOffers,
            pending_approval: pendingApproval,
          };
          
          console.log('Extracted statistics:', stats);
        }
      }
      
      setStatistics(stats);
    } catch (error) {
      console.error('Error fetching statistics:', error);
      setStatistics({
        created_offers: 0,
        pending_approval: 0,
      });
    } finally {
      setStatisticsLoading(false);
    }
  };

  useEffect(() => {
    setOffers(availableSettlements);
    fetchSettlements(); // Fetch settlements on component mount
    fetchStatistics(); // Fetch statistics on component mount
  }, [availableSettlements]);


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

  // Filter settlements data based on search and claim type
  const filteredSettlements = settlementsData.filter((settlement) => {
    const searchLower = search.toLowerCase();
    const matchesSearch = !search || (
      (settlement as { client_name?: string })?.client_name?.toLowerCase().includes(searchLower) ||
      settlement?.id?.toString().toLowerCase().includes(searchLower) ||
      settlement?.claim_type?.toLowerCase().includes(searchLower) ||
      (settlement as Settlement & { amount?: number }).amount?.toString().toLowerCase().includes(searchLower)
    );
    
    const matchesClaimType = claimTypeFilter === "all" || 
      (settlement.claim_type && settlement.claim_type.toLowerCase() === claimTypeFilter);
    
    return matchesSearch && matchesClaimType;
  });

  // const filteredOffers = offers.filter((offer) =>
  //   offer?.client.toLowerCase().includes(search.toLowerCase()) ||
  //   offer.id.toString().toLowerCase().includes(search.toLowerCase()) ||
  //   offer.claim_type.toLowerCase().includes(search.toLowerCase())
  // );

  async function handleCreateOffer(newOffer: SettlementFormData, action: 'draft' | 'submit' = 'submit') {
    try {
      setIsSubmitting(true);
      setSubmitError(null);
      setSubmitSuccess(null);
      
      console.log(newOffer, "newOffer__");
      const payload = {
        claim_id: parseInt(newOffer.claimId),
        offer_amount: newOffer.finalAmount,
        status: action === 'draft' ? "draft" : "submitted",
        assessed_claim_value: newOffer.assessedAmount,
        deductions: newOffer.deductions,
        service_fee_percentage: newOffer.serviceFeePercentage,
        payment_method: newOffer.paymentMethod,
        payment_timeline: newOffer.paymentTimeline.toString(),
        offer_validity_period: newOffer.offerValidityPeriod.toString(),
        special_conditions: newOffer.specialConditions,
        supporting_documents: newOffer.supportingDocuments,
      }
      console.log(payload, "payload__");
      const response = await createSettlementOffer(payload);
      console.log(response, "response__");
      
      setSubmitSuccess(`Settlement offer ${action === 'draft' ? 'saved as draft' : 'submitted for approval'} successfully!`);
      if (refetch) {
        refetch();
      }
      
      // Close modal after a short delay to show success message
      setTimeout(() => {
        setModal(null);
        setSubmitSuccess(null);
        // Refresh the page after successful API call
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error(error, "error__");
      const errorResponse = error as { response?: { data?: { message?: string } }; message?: string };
      setSubmitError(
        errorResponse?.response?.data?.message || 
        errorResponse?.message || 
        "Failed to create settlement offer. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleApprove(offerId: number) {
    try {
      setIsApproving(true);
      setSubmitError(null);
      setSubmitSuccess(null);
      
      const response = await approveSettlementOffer({ id: offerId, approval_notes: "Approved by admin" });
      console.log(response, "response__");
      
      setSubmitSuccess("Settlement offer approved successfully!");
      if (refetch) {
        refetch();
      }
      
      // Close modal after a short delay to show success message
      setTimeout(() => {
        setModal(null);
        setSubmitSuccess(null);
        // Refresh the page after successful API call
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error(error, "error__");
      const errorResponse = error as { response?: { data?: { message?: string } }; message?: string };
      setSubmitError(
        errorResponse?.response?.data?.message || 
        errorResponse?.message || 
        "Failed to approve settlement offer. Please try again."
      );
    } finally {
      setIsApproving(false);
    }
  }

  async function handleReject(offerId: number) {
    if (!rejectionReason.trim()) {
      setSubmitError("Please provide a reason for rejection");
      return;
    }

    try {
      setIsRejecting(true);
      setSubmitError(null);
      setSubmitSuccess(null);
      
      const response = await rejectSettlementOffer({ id: offerId, rejection_reason: rejectionReason });
      console.log(response, "response__");
      
      setSubmitSuccess("Settlement offer rejected successfully!");
      if (refetch) {
        refetch();
      }
      
      // Close modal after a short delay to show success message
      setTimeout(() => {
        setModal(null);
        setSubmitSuccess(null);
        setShowRejectModal(false);
        setRejectionReason("");
        // Refresh the page after successful API call
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error(error, "error__");
      const errorResponse = error as { response?: { data?: { message?: string } }; message?: string };
      setSubmitError(
        errorResponse?.response?.data?.message || 
        errorResponse?.message || 
        "Failed to reject settlement offer. Please try again."
      );
    } finally {
      setIsRejecting(false);
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
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => setModal({ mode: "drafts" })}
            className="flex items-center gap-2"
          >
            <FileText className="h-4 w-4" />
            View Drafts ({drafts.length})
          </Button>
          <Button 
            variant="default" 
            onClick={() => setModal({ mode: "create" })}
            className="bg-primary hover:bg-primary/90"
            style={{ color: 'white' }}
          >
            <Plus className="h-4 w-4 mr-2" style={{ color: 'white' }} />
            Create New Offer
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Created Offers</p>
                <p className="text-2xl font-bold">
                  {statisticsLoading ? (
                    <span className="animate-pulse">...</span>
                  ) : (
                    statistics.created_offers || 0
                  )}
                </p>
              </div>
              <div className="text-green-600 font-bold text-lg">₦</div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Offers Pending Approval</p>
                <p className="text-2xl font-bold">
                  {statisticsLoading ? (
                    <span className="animate-pulse">...</span>
                  ) : (
                    statistics.pending_approval || 0
                  )}
                </p>
              </div>
              <Clock className="h-4 w-4 text-orange-600" />
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
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Claim ID</TableHead>
                <TableHead>Client Name</TableHead>
                <TableHead>Claim Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Created Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {settlementsLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    Loading settlements...
                  </TableCell>
                </TableRow>
              ) : filteredSettlements.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    No settlement offers found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredSettlements.map((settlement) => (
                <TableRow key={settlement.id}>
                  <TableCell className="font-medium">{(settlement as { claim_id?: string | number }).claim_id || 'N/A'}</TableCell>
                  <TableCell>{(settlement as { client?: string }).client || 'N/A'}</TableCell>
                  <TableCell>{settlement.claim_type || 'N/A'}</TableCell>
                  <TableCell>{formatAmount(settlement.offer_amount || (settlement as { final_amount?: string | number }).final_amount)}</TableCell>
                  <TableCell>{settlement?.created_at ? formatDateTime(settlement.created_at) : 'N/A'}</TableCell>
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
                
                {submitError && (
                  <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-700 text-sm">{submitError}</p>
                  </div>
                )}
                
                {submitSuccess && (
                  <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-green-700 text-sm">{submitSuccess}</p>
                  </div>
                )}
                
                <SettlementOfferForm
                  onSubmit={handleCreateOffer}
                  onCancel={() => {
                    setModal(null);
                    setSubmitError(null);
                    setSubmitSuccess(null);
                  }}
                  isSubmitting={isSubmitting}
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
                      <div>Created: {modal.offer.created_at ? formatDateTime(modal.offer.created_at) : "N/A"}</div>
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
                  {modal.offer.status === "settlement_offered" && (
                    <>
                      <Button
                        variant="outline"
                        onClick={() => setShowRejectModal(true)}
                        className="text-red-600 hover:text-red-700"
                        disabled={isApproving || isRejecting}
                      >
                        <X className="h-4 w-4 mr-2" />
                        {isRejecting ? "Rejecting..." : "Reject"}
                      </Button>
                      <Button
                        onClick={() => modal?.offer && handleApprove(modal.offer.id)}
                        className="bg-green-600 hover:bg-green-700 text-white"
                        disabled={isApproving || isRejecting}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        {isApproving ? "Approving..." : "Approve"}
                      </Button>
                    </>
                  )}
                </div>
              </>
            )}


          </div>
        </div>
      )}

      {/* Rejection Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-auto">
            <h3 className="text-lg font-semibold mb-4">Reject Settlement Offer</h3>
            <p className="text-sm text-gray-600 mb-4">Please provide a reason for rejecting this offer:</p>
            <Textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter rejection reason..."
              rows={4}
              className="mb-4"
            />
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectionReason("");
                }}
                disabled={isRejecting}
              >
                Cancel
              </Button>
              <Button
                onClick={() => modal?.offer && handleReject(modal.offer.id)}
                className="bg-red-600 hover:bg-red-700 text-white"
                disabled={isRejecting || !rejectionReason.trim()}
              >
                {isRejecting ? "Rejecting..." : "Confirm Rejection"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Drafts Modal */}
      {modal?.mode === "drafts" && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl mx-auto max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Saved Drafts</h3>
              <Button variant="outline" onClick={() => setModal(null)}>
                Close
              </Button>
            </div>

            {drafts.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">No saved drafts found.</p>
                <p className="text-sm text-gray-400 mt-2">Create and save a draft to see it here.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {drafts.map((draft, index) => (
                  <Card key={draft.key} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-2">
                          <h4 className="font-medium">
                            Draft #{index + 1}
                          </h4>
                          <Badge variant="secondary">
                            Saved {new Date(draft.savedAt).toLocaleDateString()}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                          <div>
                            <strong>Claim Number:</strong> {draft.claimNumber || draft.claimId || 'Not selected'}
                          </div>
                          <div>
                            <strong>Client:</strong> {draft.clientName || 'Not specified'}
                          </div>
                          <div>
                            <strong>Assessed Amount:</strong> ₦{draft.assessedAmount?.toLocaleString() || '0'}
                          </div>
                          <div>
                            <strong>Final Amount:</strong> ₦{draft.finalAmount?.toLocaleString() || '0'}
                          </div>
                          {draft.paymentDueDate && (
                            <div>
                              <strong>Payment Due:</strong> {new Date(draft.paymentDueDate).toLocaleDateString()}
                            </div>
                          )}
                          {draft.offerExpiryDate && (
                            <div>
                              <strong>Expiry Date:</strong> {new Date(draft.offerExpiryDate).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            // Load this draft
                            localStorage.setItem('latest-settlement-draft', draft.key);
                            setModal({ mode: "create" });
                            alert('Draft loaded! You can continue editing it.');
                          }}
                        >
                          Load Draft
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            // Delete this draft
                            localStorage.removeItem(draft.key);
                            setDrafts(getSavedDrafts());
                            alert('Draft deleted successfully!');
                          }}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 