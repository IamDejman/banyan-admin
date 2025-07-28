export type SettlementOffer = {
  id: string;
  offerId: string; // e.g., "OFF-001"
  claimId: string;
  clientName: string;
  claimType: string;
  assessedAmount: number;
  deductions: number;
  serviceFeePercentage: number;
  finalAmount: number;
  paymentMethod: 'BANK_TRANSFER' | 'CHEQUE' | 'OTHER';
  paymentTimeline: number; // days
  offerValidityPeriod: number; // days
  specialConditions: string;
  status: 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'REJECTED' | 'PRESENTED' | 'ACCEPTED' | 'REJECTED_BY_CLIENT' | 'EXPIRED' | 'PAYMENT_PROCESSING' | 'PAID' | 'CANCELLED';
  createdBy: string;
  createdAt: Date;
  submittedAt?: Date;
  approvedAt?: Date;
  presentedAt?: Date;
  expiresAt?: Date;
  supportingDocuments: string[];
  approvalComments?: string;
  rejectionReason?: string;
  clientResponse?: ClientResponse;
  paymentDetails?: PaymentDetails;
};

export type PaymentDetails = {
  paymentId: string;
  paymentDate: Date;
  paymentAmount: number;
  paymentMethod: 'BANK_TRANSFER' | 'CHEQUE' | 'OTHER';
  transactionReference?: string;
  bankName?: string;
  accountNumber?: string;
  accountName?: string;
  paymentStatus: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  processedBy: string;
  processedAt: Date;
  paymentNotes?: string;
  receiptNumber?: string;
};

export type ClientResponse = {
  responseType: 'ACCEPTED' | 'REJECTED' | 'COUNTER_OFFER';
  responseDate: Date;
  comments?: string;
  counterOfferAmount?: number;
  counterOfferTerms?: string;
};

export type ApprovalDecision = {
  decision: 'APPROVE' | 'APPROVE_WITH_CHANGES' | 'REJECT';
  comments: string;
  modifiedAmount?: number;
  modifiedTerms?: string;
  approvedBy: string;
  approvedAt: Date;
};

export type PresentationSetup = {
  contactMethod: 'EMAIL' | 'SMS' | 'PHONE_CALL' | 'PHYSICAL_DELIVERY';
  presentationPackage: {
    settlementLetter: boolean;
    paymentBreakdown: boolean;
    termsAndConditions: boolean;
    acceptanceForm: boolean;
    bankDetailsForm: boolean;
  };
  customMessage?: string;
  subjectLine: string;
  scheduledSendDate?: Date;
  trackingNumber?: string;
  sentAt?: Date;
  deliveryStatus: 'PENDING' | 'SENT' | 'DELIVERED' | 'FAILED';
};

export type SettlementOfferFormData = {
  claimId: string;
  assessedAmount: number;
  deductions: number;
  serviceFeePercentage: number;
  paymentMethod: 'BANK_TRANSFER' | 'CHEQUE' | 'OTHER';
  paymentTimeline: number;
  offerValidityPeriod: number;
  specialConditions: string;
  supportingDocuments: File[];
};

export type ClaimForSettlement = {
  id: string;
  claimNumber: string;
  clientName: string;
  claimType: string;
  assessedAmount: number;
  status: 'APPROVED' | 'ASSESSED';
  assessmentDate: Date;
  assessor: string;
}; 