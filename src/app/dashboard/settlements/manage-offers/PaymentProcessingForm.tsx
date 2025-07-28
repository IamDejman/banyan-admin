"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertCircle, Clock, XCircle } from "lucide-react";
import type { SettlementOffer, PaymentDetails } from "@/lib/types/settlement";

interface PaymentProcessingFormProps {
  offer: SettlementOffer;
  onSubmit: (paymentDetails: PaymentDetails) => void;
  onCancel: () => void;
}

export default function PaymentProcessingForm({
  offer,
  onSubmit,
  onCancel,
}: PaymentProcessingFormProps) {
  const [paymentMethod, setPaymentMethod] = useState<PaymentDetails["paymentMethod"]>(offer.paymentMethod);
  const [transactionReference, setTransactionReference] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [paymentNotes, setPaymentNotes] = useState("");
  const [paymentStatus, setPaymentStatus] = useState<PaymentDetails["paymentStatus"]>("COMPLETED");
  const [errors, setErrors] = useState<Record<string, string>>({});

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!transactionReference.trim()) {
      newErrors.transactionReference = "Transaction reference is required";
    }

    if (paymentMethod === "BANK_TRANSFER" && !bankName.trim()) {
      newErrors.bankName = "Bank name is required for bank transfers";
    }

    if (paymentMethod === "BANK_TRANSFER" && !accountNumber.trim()) {
      newErrors.accountNumber = "Account number is required for bank transfers";
    }

    if (paymentMethod === "BANK_TRANSFER" && !accountName.trim()) {
      newErrors.accountName = "Account name is required for bank transfers";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const paymentDetails: PaymentDetails = {
      paymentId: `PAY-${Date.now()}`,
      paymentDate: new Date(),
      paymentAmount: offer.finalAmount,
      paymentMethod,
      transactionReference: transactionReference.trim(),
      bankName: bankName.trim() || undefined,
      accountNumber: accountNumber.trim() || undefined,
      accountName: accountName.trim() || undefined,
      paymentStatus,
      processedBy: "Current User", // In real app, get from auth context
      processedAt: new Date(),
      paymentNotes: paymentNotes.trim() || undefined,
      receiptNumber: `RCP-${Date.now()}`,
    };

    onSubmit(paymentDetails);
  }

  function getStatusIcon(status: PaymentDetails["paymentStatus"]) {
    switch (status) {
      case "COMPLETED":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "PROCESSING":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "PENDING":
        return <AlertCircle className="h-4 w-4 text-blue-500" />;
      case "FAILED":
        return <XCircle className="h-4 w-4 text-red-500" />;
    }
  }

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Settlement Summary */}
        <div className="border-b pb-4">
          <h3 className="text-lg font-semibold mb-3">Settlement Summary</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Offer ID:</span> {offer.offerId}
            </div>
            <div>
              <span className="font-medium">Client:</span> {offer.clientName}
            </div>
            <div>
              <span className="font-medium">Amount:</span> ₦{offer.finalAmount.toLocaleString()}
            </div>
            <div>
              <span className="font-medium">Payment Method:</span> {offer.paymentMethod.replace('_', ' ')}
            </div>
          </div>
        </div>

        {/* Payment Details */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Payment Details</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="paymentMethod">Payment Method *</Label>
              <Select value={paymentMethod} onValueChange={(value: PaymentDetails["paymentMethod"]) => setPaymentMethod(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BANK_TRANSFER">Bank Transfer</SelectItem>
                  <SelectItem value="CHEQUE">Cheque</SelectItem>
                  <SelectItem value="OTHER">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="paymentStatus">Payment Status *</Label>
              <Select value={paymentStatus} onValueChange={(value: PaymentDetails["paymentStatus"]) => setPaymentStatus(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="PROCESSING">Processing</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="FAILED">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="transactionReference">Transaction Reference *</Label>
              <Input
                id="transactionReference"
                value={transactionReference}
                onChange={(e) => setTransactionReference(e.target.value)}
                className={errors.transactionReference ? "border-red-500" : ""}
                placeholder="e.g., TXN123456789"
              />
              {errors.transactionReference && <p className="text-red-500 text-sm mt-1">{errors.transactionReference}</p>}
            </div>

            <div>
              <Label htmlFor="receiptNumber">Receipt Number</Label>
              <Input
                id="receiptNumber"
                value={`RCP-${Date.now()}`}
                readOnly
                className="bg-muted"
              />
            </div>
          </div>

          {/* Bank Details (for Bank Transfer) */}
          {paymentMethod === "BANK_TRANSFER" && (
            <div className="space-y-4 border-t pt-4">
              <h4 className="font-medium">Bank Transfer Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="bankName">Bank Name *</Label>
                  <Input
                    id="bankName"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className={errors.bankName ? "border-red-500" : ""}
                    placeholder="e.g., First Bank of Nigeria"
                  />
                  {errors.bankName && <p className="text-red-500 text-sm mt-1">{errors.bankName}</p>}
                </div>

                <div>
                  <Label htmlFor="accountNumber">Account Number *</Label>
                  <Input
                    id="accountNumber"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    className={errors.accountNumber ? "border-red-500" : ""}
                    placeholder="e.g., 1234567890"
                  />
                  {errors.accountNumber && <p className="text-red-500 text-sm mt-1">{errors.accountNumber}</p>}
                </div>

                <div>
                  <Label htmlFor="accountName">Account Name *</Label>
                  <Input
                    id="accountName"
                    value={accountName}
                    onChange={(e) => setAccountName(e.target.value)}
                    className={errors.accountName ? "border-red-500" : ""}
                    placeholder="e.g., John Doe"
                  />
                  {errors.accountName && <p className="text-red-500 text-sm mt-1">{errors.accountName}</p>}
                </div>
              </div>
            </div>
          )}

          <div>
            <Label htmlFor="paymentNotes">Payment Notes</Label>
            <Textarea
              id="paymentNotes"
              value={paymentNotes}
              onChange={(e) => setPaymentNotes(e.target.value)}
              placeholder="Additional notes about the payment..."
              rows={3}
            />
          </div>
        </div>

        {/* Payment Summary */}
        <div className="border-t pt-4">
          <h4 className="font-medium mb-3">Payment Summary</h4>
          <div className="bg-muted/50 p-4 rounded-lg space-y-2">
            <div className="flex justify-between">
              <span>Settlement Amount:</span>
              <span className="font-medium">₦{offer.finalAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Payment Method:</span>
              <span>{paymentMethod.replace('_', ' ')}</span>
            </div>
            <div className="flex justify-between">
              <span>Status:</span>
              <div className="flex items-center gap-2">
                {getStatusIcon(paymentStatus)}
                <Badge variant={paymentStatus === "COMPLETED" ? "default" : "secondary"}>
                  {paymentStatus}
                </Badge>
              </div>
            </div>
            {transactionReference && (
              <div className="flex justify-between">
                <span>Transaction Ref:</span>
                <span className="font-mono text-sm">{transactionReference}</span>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 justify-end">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {paymentStatus === "COMPLETED" ? "Mark as Paid" : "Update Payment Status"}
          </Button>
        </div>
      </form>
    </Card>
  );
} 