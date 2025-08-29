"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Upload, FileText } from "lucide-react";
import type { SettlementOffer } from "@/lib/types/settlement";
import { getClaims, } from '@/app/services/dashboard';

// Interface for the actual claims data structure from API
interface ApiClaim {
  id: string;
  claim_number: string;
  client: {
    first_name: string;
    last_name: string;
  };
  claim_type_details: {
    name: string;
  };
  estimated_value: number;
}

// Interface for the API response structure
interface ClaimsApiResponse {
  data?: {
    data?: ApiClaim[];
  };
}

interface SettlementOfferFormProps {
  existingOffer?: SettlementOffer;
  onSubmit: (offer: Omit<SettlementOffer, "id" | "offerId" | "createdAt" | "createdBy">) => void;
  onCancel: () => void;
}

export default function SettlementOfferForm({
  existingOffer,
  onSubmit,
  onCancel,
}: SettlementOfferFormProps) {
  const [selectedClaimId, setSelectedClaimId] = useState<string>(existingOffer?.claimId || "");
  const [assessedAmount, setAssessedAmount] = useState(existingOffer?.assessedAmount || 0);
  const [deductions, setDeductions] = useState(existingOffer?.deductions || 0);
  const [serviceFeePercentage, setServiceFeePercentage] = useState(existingOffer?.serviceFeePercentage || 0);
  const [finalAmount, setFinalAmount] = useState(existingOffer?.finalAmount || 0);
  const [paymentMethod, setPaymentMethod] = useState<SettlementOffer["paymentMethod"]>(existingOffer?.paymentMethod || "BANK_TRANSFER");
  const [paymentTimeline, setPaymentTimeline] = useState(existingOffer?.paymentTimeline || 7);
  const [offerValidityPeriod, setOfferValidityPeriod] = useState(existingOffer?.offerValidityPeriod || 14);
  const [specialConditions, setSpecialConditions] = useState(existingOffer?.specialConditions || "");
  const [supportingDocuments, setSupportingDocuments] = useState<string[]>(existingOffer?.supportingDocuments || []);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [claims, setClaims] = useState<ApiClaim[]>([]);
  const [selectedClaim, setSelectedClaim] = useState<ApiClaim | null>(null);

  console.log(selectedClaim, "selectedClaim__");
  // Handle claim selection change
  const handleClaimSelection = (value: string) => {
    console.log("Claim selection changed to:", value);
    console.log("Previous selectedClaimId:", selectedClaimId);
    console.log("Available claims:", claims);

    if (value) {
      setSelectedClaimId(value);
      console.log("selectedClaimId set to:", value);
    } else {
      console.log("No value provided to handleClaimSelection");
    }
  };

  // Find and set selected claim when selectedClaimId or claims change
  useEffect(() => {
    console.log("useEffect triggered - selectedClaimId:", selectedClaimId, "claims length:", claims.length);

    if (selectedClaimId && claims.length > 0) {
      const foundClaim = claims.find(claim => claim.id == selectedClaimId);
      console.log("Found claim:", foundClaim);

      if (foundClaim) {
        setSelectedClaim(foundClaim);
        // setAssessedAmount(foundClaim?.estimated_value || 0);
        // setDeductions(0);
        // setServiceFeePercentage(10); // Default 10%
        // setFinalAmount(foundClaim?.estimated_value || 0);
        // setPaymentMethod(existingOffer?.paymentMethod || "BANK_TRANSFER");
        // setPaymentTimeline(existingOffer?.paymentTimeline || 7);
      } else {
        console.log("Claim not found for ID:", selectedClaimId);
        setSelectedClaim(null);
      }
    }
  }, [selectedClaimId, claims, existingOffer?.paymentMethod, existingOffer?.paymentTimeline]);

  // Calculate final amount when inputs change
  useEffect(() => {
    if (assessedAmount > 0) {
      const serviceFee = (assessedAmount * serviceFeePercentage) / 100;
      const calculatedFinalAmount = assessedAmount - deductions - serviceFee;
      setFinalAmount(Math.max(0, calculatedFinalAmount));
    }
  }, [assessedAmount, deductions, serviceFeePercentage]);

  // Fetch claims data
  useEffect(() => {
    getClaims().then((res: unknown) => {
      console.log("Raw claims response:", res);

      let claimsData: ApiClaim[] = [];

      if (Array.isArray(res)) {
        const firstItem = res[0] as ClaimsApiResponse;
        claimsData = firstItem?.data?.data || [];
      } else if (res && typeof res === 'object') {
        const response = res as ClaimsApiResponse;
        claimsData = response?.data?.data || [];
      }

      console.log("Processed claims data:", claimsData);
      setClaims(claimsData);

      // If we have an existing offer, try to find the claim
      if (existingOffer?.claimId && claimsData.length > 0) {
        const existingClaim = claimsData.find(claim => claim.id === existingOffer.claimId);
        if (existingClaim) {
          setSelectedClaim(existingClaim);
        }
      }
    }).catch((error) => {
      console.error("Error fetching claims:", error);
      setClaims([]);
    });
  }, [existingOffer?.claimId]);


  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!selectedClaimId) newErrors.claimId = "Please select a claim";
    if (assessedAmount <= 0) newErrors.assessedAmount = "Assessed amount must be greater than 0";
    if (deductions < 0) newErrors.deductions = "Deductions cannot be negative";
    if (serviceFeePercentage < 0) newErrors.serviceFeePercentage = "Service fee cannot be negative";
    if (finalAmount <= 0) newErrors.finalAmount = "Final amount must be greater than 0";
    if (!paymentMethod) newErrors.paymentMethod = "Please select a payment method";
    if (paymentTimeline <= 0) newErrors.paymentTimeline = "Payment timeline must be greater than 0";
    if (offerValidityPeriod <= 0) newErrors.offerValidityPeriod = "Offer validity period must be greater than 0";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const offerData = {
      claimId: selectedClaimId,
      clientName: selectedClaim ? `${selectedClaim.client.first_name} ${selectedClaim.client.last_name}` : "",
      claimType: selectedClaim?.claim_type_details?.name || "",
      assessedAmount,
      deductions,
      serviceFeePercentage,
      finalAmount,
      paymentMethod,
      paymentTimeline,
      offerValidityPeriod,
      specialConditions,
      status: existingOffer?.status || "DRAFT",
      supportingDocuments,
    };

    console.log(offerData, "offerData__");

    onSubmit(offerData);
  }

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (files) {
      const newDocuments = Array.from(files).map(file => file.name);
      setSupportingDocuments([...supportingDocuments, ...newDocuments]);
    }
  }

  function handleRemoveDocument(docName: string) {
    setSupportingDocuments(supportingDocuments.filter(doc => doc !== docName));
  }

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Claim Selection */}
        <div>
          <Label htmlFor="claim">Claim Selection *</Label>
          <Select
            value={selectedClaimId || ""}
            onValueChange={handleClaimSelection}
          >
            <SelectTrigger className={errors.claimId ? "border-red-500" : ""}>
              <SelectValue placeholder="Select an approved claim">
                {selectedClaimId && selectedClaim ? selectedClaim.claim_number +
                  " - " + selectedClaim.client?.first_name +
                  " " + selectedClaim.client?.last_name +
                  " (" + selectedClaim.claim_type_details?.name + ")"
                  : "Select an approved claim"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {claims.map((claim) => (
                <SelectItem key={claim.id} value={claim.id}>
                  {claim.claim_number} - {claim.client?.first_name} {claim.client?.last_name} ({claim.claim_type_details?.name})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.claimId && <p className="text-red-500 text-sm mt-1">{errors.claimId}</p>}
          {/* Debug info */}
          <p className="text-xs text-gray-500 mt-1">
            Selected Claim ID: {selectedClaimId || 'None'} | Claims loaded: {claims.length}
          </p>
        </div>

        {/* Client Details (Auto-populated) */}
        {selectedClaim && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
            <div>
              <Label className="text-sm font-medium">Client Name</Label>
              <p className="text-sm">{selectedClaim?.client?.first_name} {selectedClaim?.client?.last_name}</p>
            </div>
            <div>
              <Label className="text-sm font-medium">Claim Type</Label>
              <p className="text-sm">{selectedClaim?.claim_type_details?.name}</p>
            </div>
            <div>
              <Label className="text-sm font-medium">Assessed Amount</Label>
              <p className="text-sm">₦{selectedClaim?.estimated_value.toLocaleString()}</p>
            </div>
          </div>
        )}

        {/* Offer Calculation */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Offer Calculation</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="assessedAmount">Assessed Claim Value *</Label>
              <Input
                id="assessedAmount"
                type="text"
                value={assessedAmount}
                onChange={(e) => setAssessedAmount(Number(e.target.value))}
                className={errors.assessedAmount ? "border-red-500" : ""}
                placeholder="₦0"
              />
              {errors.assessedAmount && <p className="text-red-500 text-sm mt-1">{errors.assessedAmount}</p>}
            </div>

            <div>
              <Label htmlFor="deductions">Deductions (if any)</Label>
              <Input
                id="deductions"
                type="text"
                value={deductions}
                onChange={(e) => setDeductions(Number(e.target.value))}
                className={errors.deductions ? "border-red-500" : ""}
                placeholder="₦0"
              />
              {errors.deductions && <p className="text-red-500 text-sm mt-1">{errors.deductions}</p>}
            </div>

            <div>
              <Label htmlFor="serviceFee">Service Fee Percentage *</Label>
              <Input
                id="serviceFee"
                type="text"
                value={serviceFeePercentage}
                onChange={(e) => setServiceFeePercentage(Number(e.target.value))}
                className={errors.serviceFeePercentage ? "border-red-500" : ""}
                placeholder="10"
              />
              {errors.serviceFeePercentage && <p className="text-red-500 text-sm mt-1">{errors.serviceFeePercentage}</p>}
            </div>

            <div>
              <Label htmlFor="finalAmount">Final Offer Amount</Label>
              <Input
                id="finalAmount"
                type="text"
                value={finalAmount}
                readOnly
                className="bg-muted"
                placeholder="₦0"
              />
              {errors.finalAmount && <p className="text-red-500 text-sm mt-1">{errors.finalAmount}</p>}
            </div>
          </div>
        </div>

        {/* Offer Terms */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Offer Terms</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="paymentMethod">Payment Method *</Label>
              <Select value={paymentMethod} onValueChange={(value: SettlementOffer["paymentMethod"]) => setPaymentMethod(value)}>
                <SelectTrigger className={errors.paymentMethod ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BANK_TRANSFER">Bank Transfer</SelectItem>
                  <SelectItem value="CHEQUE">Cheque</SelectItem>
                  <SelectItem value="OTHER">Other</SelectItem>
                </SelectContent>
              </Select>
              {errors.paymentMethod && <p className="text-red-500 text-sm mt-1">{errors.paymentMethod}</p>}
            </div>

            <div>
              <Label htmlFor="paymentTimeline">Payment Timeline (days) *</Label>
              <Select value={paymentTimeline.toString()} onValueChange={(value) => setPaymentTimeline(Number(value))}>
                <SelectTrigger className={errors.paymentTimeline ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select timeline" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">7 days</SelectItem>
                  <SelectItem value="14">14 days</SelectItem>
                  <SelectItem value="30">30 days</SelectItem>
                </SelectContent>
              </Select>
              {errors.paymentTimeline && <p className="text-red-500 text-sm mt-1">{errors.paymentTimeline}</p>}
            </div>

            <div>
              <Label htmlFor="validityPeriod">Offer Validity Period (days) *</Label>
              <Select value={offerValidityPeriod.toString()} onValueChange={(value) => setOfferValidityPeriod(Number(value))}>
                <SelectTrigger className={errors.offerValidityPeriod ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select validity period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">7 days</SelectItem>
                  <SelectItem value="14">14 days</SelectItem>
                  <SelectItem value="21">21 days</SelectItem>
                </SelectContent>
              </Select>
              {errors.offerValidityPeriod && <p className="text-red-500 text-sm mt-1">{errors.offerValidityPeriod}</p>}
            </div>
          </div>

          <div>
            <Label htmlFor="specialConditions">Special Conditions</Label>
            <Textarea
              id="specialConditions"
              value={specialConditions}
              onChange={(e) => setSpecialConditions(e.target.value)}
              placeholder="Any special conditions or terms for this offer..."
              rows={3}
            />
          </div>
        </div>

        {/* Supporting Documents */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Supporting Documents</h3>

          <div>
            <Label htmlFor="documents">Upload Documents</Label>
            <div className="flex items-center gap-2">
              <Input
                id="documents"
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                onChange={handleFileUpload}
                className="cursor-pointer"
              />
              <Upload className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>

          {supportingDocuments.length > 0 && (
            <div>
              <Label className="text-sm font-medium">Uploaded Documents</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {supportingDocuments.map((doc, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    <FileText className="h-3 w-3" />
                    {doc}
                    <button
                      type="button"
                      onClick={() => handleRemoveDocument(doc)}
                      className="ml-1 hover:text-red-500"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 justify-end">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" variant="outline">
            Save Draft
          </Button>
          <Button type="submit">
            Submit for Approval
          </Button>
        </div>
      </form>
    </Card>
  );
} 