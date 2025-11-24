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
  isDraft: boolean;
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
  client?: string;
  claimType: string;
  assessedAmount: number;
  status: 'APPROVED' | 'ASSESSED';
  assessmentDate: Date;
  assessor: string;
}; 

export interface Settlement {
  id: number,
  claim_type: string,
  client: string,
  claim_id: number,
  calculation_breakdown: null,
  offer_modifications: null,
  assessed_claim_value: string,
  fee_structure: null,
  offer_amount: string,
  offer_terms: null,
  expiry_period: string,
  status: string,
  approval_notes: null,
  rejection_reason: null,
  offer_acceptance_notes: null,
  offer_acceptance_status: null,
  offer_acceptance_reason: null,
  approved_by: null,
  rejected_by: null,
  approved_at: null,
  rejected_at: null,
  created_at: string,
  updated_at: string,
  deductions: string,
  service_fee_percentage: string,
  payment_method: string,
  payment_timeline: string,
  offer_validity_period: string,
  supporting_documents: [],
  special_conditions: string,
  expired: boolean,
  send_status: string,
  presented_at: string,
  client_response: ClientResponse | null,
  phone?: string,
}
export interface SettlementStatistics {
  active_offers: number;
  active_offers_percentage: number;
  pending_approval: number;
  pending_approval_percentage: number;
  ready_to_present: number;
  ready_to_present_percentage: number;
  total_settled: number;
  total_settled_percentage: number;
}


export interface SettlementsResponse {
  data: {
  data: Settlement[];
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    links: Array<{
      url: string | null;
      label: string;
      active: boolean;
    }>;
    path: string;
    per_page: number;
    to: number;
    total: number;
  };
  }
}

export interface ApiError {
  response?: {
    data?: {
      message?: string;
      statusCode?: number;
    };
    status?: number;
  };
  message?: string;
}