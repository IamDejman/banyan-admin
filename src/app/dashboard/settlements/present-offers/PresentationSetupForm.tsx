"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import type { PresentationSetup, Settlement } from "@/lib/types/settlement";

interface PresentationSetupFormProps {
  offer: Settlement;
  onSubmit: (setup: PresentationSetup) => void;
  onCancel: () => void;
}

export default function PresentationSetupForm({
  offer,
  onSubmit,
  onCancel,
}: PresentationSetupFormProps) {
  const [contactMethod, setContactMethod] = useState<PresentationSetup["contactMethod"]>(
    "EMAIL"
  );
  const [presentationPackage, setPresentationPackage] = useState({
    settlementLetter: true,
    paymentBreakdown: true,
    termsAndConditions: true,
    acceptanceForm: true,
    bankDetailsForm: false,
  });
  const [customMessage, setCustomMessage] = useState("");
  const [subjectLine, setSubjectLine] = useState(`Settlement Offer - Claim ${offer.claim_type}`);
  const [scheduledSendDate, setScheduledSendDate] = useState<string>("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  function handleSubmit(isDraft: boolean) {
    // e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!contactMethod) {
      newErrors.contactMethod = "Please select a contact method";
    }

    if (!subjectLine.trim()) {
      newErrors.subjectLine = "Subject line is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const setup: PresentationSetup = {
      contactMethod,
      presentationPackage,
      customMessage: customMessage.trim(),
      subjectLine: subjectLine.trim(),
      scheduledSendDate: scheduledSendDate ? new Date(scheduledSendDate) : undefined,
      trackingNumber: trackingNumber.trim() || undefined,
      deliveryStatus: "PENDING",
      isDraft: isDraft,
    };

    onSubmit(setup);
  }

  function handlePackageChange(key: keyof typeof presentationPackage, checked: boolean) {
    setPresentationPackage(prev => ({
      ...prev,
      [key]: checked,
    }));
  }

  return (
    <Card className="p-6">
      <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
        {/* Client Contact Method */}
        <div>
          <Label className="text-base font-medium">Client Contact Method *</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            <label className="flex items-center space-x-2 p-3 border rounded-lg cursor-pointer hover:bg-muted/50">
              <input
                type="radio"
                name="contactMethod"
                value="EMAIL"
                checked={contactMethod === "EMAIL"}
                onChange={(e) => setContactMethod(e.target.value as PresentationSetup["contactMethod"])}
                className="h-4 w-4"
              />
              <span className="font-medium">Email</span>
            </label>

            <label className="flex items-center space-x-2 p-3 border rounded-lg cursor-pointer hover:bg-muted/50">
              <input
                type="radio"
                name="contactMethod"
                value="SMS"
                checked={contactMethod === "SMS"}
                onChange={(e) => setContactMethod(e.target.value as PresentationSetup["contactMethod"])}
                className="h-4 w-4"
              />
              <span className="font-medium">SMS</span>
            </label>

            <label className="flex items-center space-x-2 p-3 border rounded-lg cursor-pointer hover:bg-muted/50">
              <input
                type="radio"
                name="contactMethod"
                value="PHONE_CALL"
                checked={contactMethod === "PHONE_CALL"}
                onChange={(e) => setContactMethod(e.target.value as PresentationSetup["contactMethod"])}
                className="h-4 w-4"
              />
              <span className="font-medium">Phone Call + Follow-up Email</span>
            </label>

            <label className="flex items-center space-x-2 p-3 border rounded-lg cursor-pointer hover:bg-muted/50">
              <input
                type="radio"
                name="contactMethod"
                value="PHYSICAL_DELIVERY"
                checked={contactMethod === "PHYSICAL_DELIVERY"}
                onChange={(e) => setContactMethod(e.target.value as PresentationSetup["contactMethod"])}
                className="h-4 w-4"
              />
              <span className="font-medium">Physical Delivery</span>
            </label>
          </div>
          {errors.contactMethod && <p className="text-red-500 text-sm mt-1">{errors.contactMethod}</p>}
        </div>

        {/* Presentation Package */}
        <div>
          <Label className="text-base font-medium">Presentation Package</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            <label className="flex items-center space-x-2 p-3 border rounded-lg cursor-pointer hover:bg-muted/50">
              <Checkbox
                checked={presentationPackage.settlementLetter}
                onCheckedChange={(checked) => handlePackageChange("settlementLetter", checked as boolean)}
              />
              <span>Settlement Offer Letter</span>
            </label>

            <label className="flex items-center space-x-2 p-3 border rounded-lg cursor-pointer hover:bg-muted/50">
              <Checkbox
                checked={presentationPackage.paymentBreakdown}
                onCheckedChange={(checked) => handlePackageChange("paymentBreakdown", checked as boolean)}
              />
              <span>Payment Breakdown</span>
            </label>

            <label className="flex items-center space-x-2 p-3 border rounded-lg cursor-pointer hover:bg-muted/50">
              <Checkbox
                checked={presentationPackage.termsAndConditions}
                onCheckedChange={(checked) => handlePackageChange("termsAndConditions", checked as boolean)}
              />
              <span>Terms and Conditions</span>
            </label>

            <label className="flex items-center space-x-2 p-3 border rounded-lg cursor-pointer hover:bg-muted/50">
              <Checkbox
                checked={presentationPackage.acceptanceForm}
                onCheckedChange={(checked) => handlePackageChange("acceptanceForm", checked as boolean)}
              />
              <span>Acceptance Form</span>
            </label>

            <label className="flex items-center space-x-2 p-3 border rounded-lg cursor-pointer hover:bg-muted/50">
              <Checkbox
                checked={presentationPackage.bankDetailsForm}
                onCheckedChange={(checked) => handlePackageChange("bankDetailsForm", checked as boolean)}
              />
              <span>Bank Details Form (if needed)</span>
            </label>
          </div>
        </div>

        {/* Message Customization */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Message Customization</h3>

          <div>
            <Label htmlFor="subjectLine">Subject Line *</Label>
            <Input
              id="subjectLine"
              value={subjectLine}
              onChange={(e) => setSubjectLine(e.target.value)}
              className={errors.subjectLine ? "border-red-500" : ""}
              placeholder="Settlement Offer - Claim CLM-001"
            />
            {errors.subjectLine && <p className="text-red-500 text-sm mt-1">{errors.subjectLine}</p>}
          </div>

          <div>
            <Label htmlFor="customMessage">Custom Message</Label>
            <Textarea
              id="customMessage"
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              placeholder="We are pleased to present your settlement offer..."
              rows={4}
            />
          </div>
        </div>

        {/* Tracking */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Tracking</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="scheduledSendDate">Scheduled Send Date</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="scheduledSendDate"
                  type="datetime-local"
                  value={scheduledSendDate}
                  onChange={(e) => setScheduledSendDate(e.target.value)}
                />
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>

            <div>
              <Label htmlFor="trackingNumber">Tracking Number (if applicable)</Label>
              <Input
                id="trackingNumber"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="e.g., TRK123456789"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 justify-end">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" variant="outline" onClick={() => handleSubmit(true)}>
            Save Draft
          </Button>
          <Button type="submit" onClick={() => handleSubmit(false)}>
            Send Offer
          </Button>
        </div>
      </form>
    </Card>
  );
} 