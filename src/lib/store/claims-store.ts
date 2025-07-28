import { create } from 'zustand';
import { Claim, ClaimStatus, ClaimCommunication } from '../types/claims';


const mockClaims: Claim[] = [
  {
    id: '1',
    claimNumber: 'CLM-2024-001',
    status: 'PENDING_REVIEW',
    claimType: 'HEALTH',
    clientName: 'John Doe',
    clientEmail: 'john@example.com',
    clientPhone: '+1234567890',
    submissionDate: '2024-03-15T10:00:00Z',
    lastUpdated: '2024-03-15T10:00:00Z',
    description: 'Medical expenses for annual checkup',
    documentCompletion: 75,
    totalValue: 1500.00,
    documents: [
      {
        id: '1',
        claimId: '1',
        name: 'Medical Bill',
        type: 'INVOICE',
        status: 'APPROVED',
        url: '#',
        uploadedAt: '2024-03-15T10:00:00Z'
      }
    ],
    audits: [
      {
        id: '1',
        claimId: '1',
        action: 'SUBMITTED',
        performedBy: 'John Doe',
        performedById: 'user1',
        timestamp: '2024-03-15T10:00:00Z',
        notes: 'Claim submitted for review'
      }
    ],
    communications: [
      {
        id: '1',
        claimId: '1',
        type: 'EMAIL',
        direction: 'OUTBOUND',
        subject: 'Claim Submission',
        content: 'Please find attached the medical bill for my annual checkup.',
        timestamp: '2024-03-15T10:00:00Z',
        sender: 'John Doe',
        recipient: 'Claims Department'
      }
    ]
  },
  {
    id: '2',
    claimNumber: 'CLM-2024-002',
    status: 'APPROVED',
    claimType: 'HEALTH',
    clientName: 'Jane Smith',
    clientEmail: 'jane@example.com',
    clientPhone: '+1234567891',
    submissionDate: '2024-03-14T15:30:00Z',
    lastUpdated: '2024-03-14T16:00:00Z',
    description: 'Dental cleaning and checkup',
    documentCompletion: 100,
    totalValue: 300.00,
    documents: [
      {
        id: '2',
        claimId: '2',
        name: 'Dental Invoice',
        type: 'INVOICE',
        status: 'APPROVED',
        url: '#',
        uploadedAt: '2024-03-14T15:30:00Z'
      }
    ],
    audits: [
      {
        id: '2',
        claimId: '2',
        action: 'APPROVED',
        performedBy: 'Claims Reviewer',
        performedById: 'reviewer1',
        timestamp: '2024-03-14T16:00:00Z',
        notes: 'Claim approved after document verification'
      }
    ],
    communications: []
  }
];

interface ClaimsState {
  claims: Claim[];
  selectedClaim: Claim | null;
  isLoading: boolean;
  fetchClaims: () => Promise<void>;
  fetchClaimById: (id: string) => Promise<void>;
  updateClaimStatus: (id: string, status: ClaimStatus, notes: string) => Promise<void>;
  uploadDocument: (claimId: string, fileName: string) => Promise<void>;
  addCommunication: (claimId: string, communication: Omit<ClaimCommunication, 'id' | 'timestamp'>) => Promise<void>;
  submitClaimReview: (claimId: string, outcome: 'APPROVED' | 'REJECTED' | 'NEEDS_INFO', notes: string) => Promise<void>;
}

export const useClaimsStore = create<ClaimsState>((set) => ({
  claims: [],
  selectedClaim: null,
  isLoading: false,

  fetchClaims: async () => {
    set({ isLoading: true });
    try {
      // TODO: Implement API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      set({ claims: mockClaims, isLoading: false });
    } catch {
      console.error('Failed to fetch claims');
      set({ isLoading: false });
    }
  },

  fetchClaimById: async (id: string) => {
    set({ isLoading: true });
    try {
      // TODO: Implement API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      const claim = mockClaims.find(c => c.id === id);
      set({ selectedClaim: claim || null, isLoading: false });
    } catch {
      console.error('Failed to fetch claim');
      set({ isLoading: false });
    }
  },

  updateClaimStatus: async (id: string, status: ClaimStatus, notes: string) => {
    set({ isLoading: true });
    try {
      // TODO: Implement API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      set(state => ({
        claims: state.claims.map(claim => 
          claim.id === id ? { 
            ...claim, 
            status, 
            audits: [...claim.audits, { 
              id: String(claim.audits.length + 1), 
              claimId: id,
              action: status, 
              performedBy: 'Current User', 
              performedById: 'current-user',
              timestamp: new Date().toISOString(), 
              notes 
            }] 
          } : claim
        ),
        isLoading: false
      }));
    } catch {
      console.error('Failed to update claim status');
      set({ isLoading: false });
    }
  },

  uploadDocument: async (claimId: string, fileName: string) => {
    set({ isLoading: true });
    try {
      // TODO: Implement API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Document uploaded:', fileName);
      set({ isLoading: false });
    } catch {
      console.error('Failed to upload document');
      set({ isLoading: false });
    }
  },

  addCommunication: async (claimId: string, communication: Omit<ClaimCommunication, 'id' | 'timestamp'>) => {
    set({ isLoading: true });
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      const claim = mockClaims.find(c => c.id === claimId);
      if (!claim) {
        throw new Error('Claim not found');
      }

      const newCommunication: ClaimCommunication = {
        ...communication,
        id: String(claim.communications.length + 1),
        timestamp: new Date().toISOString()
      };

      const updatedClaim = {
        ...claim,
        communications: [...claim.communications, newCommunication]
      };

      set(state => ({
        claims: state.claims.map(c => c.id === claimId ? updatedClaim : c),
        selectedClaim: state.selectedClaim?.id === claimId ? updatedClaim : state.selectedClaim,
        isLoading: false
      }));
    } catch {
      set({ isLoading: false });
    }
  },

  submitClaimReview: async (claimId: string, outcome: 'APPROVED' | 'REJECTED' | 'NEEDS_INFO', notes: string) => {
    set({ isLoading: true });
    try {
      // TODO: Implement API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      set(state => ({
        claims: state.claims.map(claim => 
          claim.id === claimId ? { 
            ...claim, 
            status: outcome, 
            audits: [...claim.audits, { 
              id: String(claim.audits.length + 1), 
              claimId: claimId,
              action: outcome, 
              performedBy: 'Claims Reviewer', 
              performedById: 'reviewer',
              timestamp: new Date().toISOString(), 
              notes 
            }] 
          } : claim
        ),
        isLoading: false
      }));
    } catch {
      console.error('Failed to submit claim review');
      set({ isLoading: false });
    }
  }
})); 