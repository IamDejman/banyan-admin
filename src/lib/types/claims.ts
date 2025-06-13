export type ClaimStatus =
  | 'PENDING_REVIEW'
  | 'UNDER_REVIEW'
  | 'NEEDS_INFO'
  | 'APPROVED'
  | 'REJECTED'
  | 'SETTLEMENT_OFFERED'
  | 'SETTLEMENT_ACCEPTED'
  | 'SETTLEMENT_REJECTED'
  | 'SETTLED'
  | 'CLOSED';

export type ClaimType =
  | 'AUTO'
  | 'PROPERTY'
  | 'LIABILITY'
  | 'HEALTH'
  | 'LIFE'
  | 'OTHER';

export type ReviewOutcome = 'APPROVED' | 'REJECTED' | 'NEEDS_INFO';

export interface Claim {
  id: string;
  claimNumber: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  claimType: ClaimType;
  status: ClaimStatus;
  submissionDate: string;
  assignedAgentId?: string;
  assignedAgentName?: string;
  documentCompletion: number;
  totalValue: number;
  description: string;
  lastUpdated: string;
}

export interface ClaimReview {
  id: string;
  claimId: string;
  reviewerId: string;
  reviewerName: string;
  outcome: ReviewOutcome;
  notes: string;
  createdAt: string;
}

export interface ClaimDocument {
  id: string;
  claimId: string;
  name: string;
  type: string;
  status: 'PENDING' | 'VERIFIED' | 'REJECTED';
  url: string;
  uploadedAt: string;
  verifiedAt?: string;
  verifiedBy?: string;
}

export interface ClaimAudit {
  id: string;
  claimId: string;
  action: string;
  performedBy: string;
  performedById: string;
  timestamp: string;
  details: string;
}

export interface ClaimCommunication {
  id: string;
  claimId: string;
  type: 'EMAIL' | 'PHONE' | 'NOTE';
  direction: 'INBOUND' | 'OUTBOUND';
  content: string;
  timestamp: string;
  sender: string;
  recipient: string;
} 