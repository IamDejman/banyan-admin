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
import type { SettlementOffer, ClaimForSettlement } from "@/lib/types/settlement";

interface SettlementOfferFormProps {
  approvedClaims: ClaimForSettlement[];
  existingOffer?: SettlementOffer;
  onSubmit: (offer: Omit<SettlementOffer, "id" | "offerId" | "createdAt" | "createdBy">) => void;
  onCancel: () => void;
}

export default function SettlementOfferForm({
  approvedClaims,
  existingOffer,
  onSubmit,
  onCancel,
}: SettlementOfferFormProps) {
  const [selectedClaimId, setSelectedClaimId] = useState(existingOffer?.claimId || "");
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

  const selectedClaim = approvedClaims.find(claim => claim.id === selectedClaimId);

  // Calculate final amount when inputs change
  useEffect(() => {
    if (assessedAmount > 0) {
      const serviceFee = (assessedAmount * serviceFeePercentage) / 100;
      const calculatedFinalAmount = assessedAmount - deductions - serviceFee;
      setFinalAmount(Math.max(0, calculatedFinalAmount));
    }
  }, [assessedAmount, deductions, serviceFeePercentage]);

  // Auto-populate when claim is selected
  useEffect(() => {
    if (selectedClaim && !existingOffer) {
      setAssessedAmount(selectedClaim.assessedAmount);
      setDeductions(0);
      setServiceFeePercentage(10); // Default 10%
    }
  }, [selectedClaim, existingOffer]);

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
      clientName: selectedClaim?.clientName || "",
      claimType: selectedClaim?.claimType || "",
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
          <Select value={selectedClaimId} onValueChange={setSelectedClaimId}>
            <SelectTrigger className={errors.claimId ? "border-red-500" : ""}>
              <SelectValue placeholder="Select an approved claim" />
            </SelectTrigger>
            <SelectContent>
              {approvedClaims.map((claim) => (
                <SelectItem key={claim.id} value={claim.id}>
                  {claim.claimNumber} - {claim.clientName} ({claim.claimType})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.claimId && <p className="text-red-500 text-sm mt-1">{errors.claimId}</p>}
        </div>

        {/* Client Details (Auto-populated) */}
        {selectedClaim && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
            <div>
              <Label className="text-sm font-medium">Client Name</Label>
              <p className="text-sm">{selectedClaim.clientName}</p>
            </div>
            <div>
              <Label className="text-sm font-medium">Claim Type</Label>
              <p className="text-sm">{selectedClaim.claimType}</p>
            </div>
            <div>
              <Label className="text-sm font-medium">Assessed Amount</Label>
              <p className="text-sm">₦{selectedClaim.assessedAmount.toLocaleString()}</p>
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
                type="number"
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
                type="number"
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
                type="number"
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
                type="number"
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