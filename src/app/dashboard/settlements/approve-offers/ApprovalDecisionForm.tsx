"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import type { SettlementOffer, ApprovalDecision } from "@/lib/types/settlement";

interface ApprovalDecisionFormProps {
  offer: SettlementOffer;
  onSubmit: (decision: ApprovalDecision) => void;
  onCancel: () => void;
}

export default function ApprovalDecisionForm({
  offer,
  onSubmit,
  onCancel,
}: ApprovalDecisionFormProps) {
  const [decision, setDecision] = useState<ApprovalDecision["decision"]>("APPROVE");
  const [comments, setComments] = useState("");
  const [modifiedAmount, setModifiedAmount] = useState(offer.finalAmount);
  const [modifiedTerms, setModifiedTerms] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!comments.trim()) {
      newErrors.comments = "Approval comments are required";
    }

    if (decision === "APPROVE_WITH_CHANGES") {
      if (modifiedAmount <= 0) {
        newErrors.modifiedAmount = "Modified amount must be greater than 0";
      }
      if (!modifiedTerms.trim()) {
        newErrors.modifiedTerms = "Modified terms are required when approving with changes";
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const approvalDecision: ApprovalDecision = {
      decision,
      comments: comments.trim(),
      modifiedAmount: decision === "APPROVE_WITH_CHANGES" ? modifiedAmount : undefined,
      modifiedTerms: decision === "APPROVE_WITH_CHANGES" ? modifiedTerms : undefined,
      approvedBy: "Current User", // In real app, get from auth context
      approvedAt: new Date(),
    };

    onSubmit(approvalDecision);
  }

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Decision Type */}
        <div>
          <Label className="text-base font-medium">Approval Decision *</Label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
            <button
              type="button"
              onClick={() => setDecision("APPROVE")}
              className={`p-4 border rounded-lg text-left transition-colors ${
                decision === "APPROVE"
                  ? "border-green-500 bg-green-50 text-green-700"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">Approve</span>
              </div>
              <p className="text-sm mt-1 text-muted-foreground">
                Approve the offer as-is
              </p>
            </button>

            <button
              type="button"
              onClick={() => setDecision("APPROVE_WITH_CHANGES")}
              className={`p-4 border rounded-lg text-left transition-colors ${
                decision === "APPROVE_WITH_CHANGES"
                  ? "border-yellow-500 bg-yellow-50 text-yellow-700"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                <span className="font-medium">Approve with Changes</span>
              </div>
              <p className="text-sm mt-1 text-muted-foreground">
                Approve with modifications
              </p>
            </button>

            <button
              type="button"
              onClick={() => setDecision("REJECT")}
              className={`p-4 border rounded-lg text-left transition-colors ${
                decision === "REJECT"
                  ? "border-red-500 bg-red-50 text-red-700"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center gap-2">
                <XCircle className="h-5 w-5" />
                <span className="font-medium">Reject</span>
              </div>
              <p className="text-sm mt-1 text-muted-foreground">
                Reject the offer
              </p>
            </button>
          </div>
        </div>

        {/* Current Offer Summary */}
        <div className="border-t pt-4">
          <h4 className="font-medium mb-2">Current Offer Summary</h4>
          <div className="grid grid-cols-2 gap-4 text-sm bg-muted/50 p-4 rounded-lg">
            <div>
              <span className="font-medium">Client:</span> {offer.clientName}
            </div>
            <div>
              <span className="font-medium">Claim Type:</span> {offer.claimType}
            </div>
            <div>
              <span className="font-medium">Original Amount:</span> ₦{offer.finalAmount.toLocaleString()}
            </div>
            <div>
              <span className="font-medium">Payment Method:</span> {offer.paymentMethod.replace('_', ' ')}
            </div>
          </div>
        </div>

        {/* Modified Amount (for Approve with Changes) */}
        {decision === "APPROVE_WITH_CHANGES" && (
          <div>
            <Label htmlFor="modifiedAmount">Modified Amount *</Label>
            <Input
              id="modifiedAmount"
              type="number"
              value={modifiedAmount}
              onChange={(e) => setModifiedAmount(Number(e.target.value))}
              className={errors.modifiedAmount ? "border-red-500" : ""}
              placeholder="₦0"
            />
            {errors.modifiedAmount && <p className="text-red-500 text-sm mt-1">{errors.modifiedAmount}</p>}
          </div>
        )}

        {/* Modified Terms (for Approve with Changes) */}
        {decision === "APPROVE_WITH_CHANGES" && (
          <div>
            <Label htmlFor="modifiedTerms">Modified Terms *</Label>
            <Textarea
              id="modifiedTerms"
              value={modifiedTerms}
              onChange={(e) => setModifiedTerms(e.target.value)}
              className={errors.modifiedTerms ? "border-red-500" : ""}
              placeholder="Describe the changes to the offer terms..."
              rows={3}
            />
            {errors.modifiedTerms && <p className="text-red-500 text-sm mt-1">{errors.modifiedTerms}</p>}
          </div>
        )}

        {/* Approval Comments */}
        <div>
          <Label htmlFor="comments">
            {decision === "REJECT" ? "Rejection Comments" : "Approval Comments"} *
          </Label>
          <Textarea
            id="comments"
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            className={errors.comments ? "border-red-500" : ""}
            placeholder={
              decision === "REJECT"
                ? "Provide detailed reason for rejection..."
                : decision === "APPROVE_WITH_CHANGES"
                ? "Explain the changes and why they are necessary..."
                : "Add any comments about the approval..."
            }
            rows={4}
          />
          {errors.comments && <p className="text-red-500 text-sm mt-1">{errors.comments}</p>}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 justify-end">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant={decision === "REJECT" ? "destructive" : "default"}
          >
            {decision === "REJECT" ? "Reject Offer" : "Approve Offer"}
          </Button>
        </div>
      </form>
    </Card>
  );
} 