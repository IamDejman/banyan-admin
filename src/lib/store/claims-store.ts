import { create } from 'zustand';
import { Claim, ClaimStatus, ClaimType, ClaimDocument, ClaimAudit, ClaimCommunication } from '../types/claims';

// Mock data
const mockClaims: Claim[] = [
  {
    id: '1',
    claimNumber: 'CLM-2024-001',
    status: 'PENDING',
    type: 'HEALTH',
    clientName: 'John Doe',
    clientEmail: 'john@example.com',
    submissionDate: '2024-03-15T10:00:00Z',
    description: 'Medical expenses for annual checkup',
    amount: 1500.00,
    documents: [
      {
        id: '1',
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
        action: 'SUBMITTED',
        performedBy: 'John Doe',
        timestamp: '2024-03-15T10:00:00Z',
        notes: 'Claim submitted for review'
      }
    ],
    communications: [
      {
        id: '1',
        type: 'EMAIL',
        sender: 'John Doe',
        recipient: 'Claims Department',
        subject: 'Claim Submission',
        content: 'Please find attached the medical bill for my annual checkup.',
        timestamp: '2024-03-15T10:00:00Z'
      }
    ]
  },
  {
    id: '2',
    claimNumber: 'CLM-2024-002',
    status: 'APPROVED',
    type: 'DENTAL',
    clientName: 'Jane Smith',
    clientEmail: 'jane@example.com',
    submissionDate: '2024-03-14T15:30:00Z',
    description: 'Dental cleaning and checkup',
    amount: 300.00,
    documents: [
      {
        id: '2',
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
        action: 'APPROVED',
        performedBy: 'Claims Reviewer',
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
  error: string | null;
  fetchClaims: () => Promise<void>;
  fetchClaimById: (id: string) => Promise<void>;
  updateClaimStatus: (id: string, status: ClaimStatus, notes: string) => Promise<void>;
  uploadDocument: (claimId: string, fileName: string) => Promise<void>;
  addCommunication: (claimId: string, communication: Omit<ClaimCommunication, 'id' | 'timestamp'>) => Promise<void>;
}

export const useClaimsStore = create<ClaimsState>((set, get) => ({
  claims: [],
  selectedClaim: null,
  isLoading: false,
  error: null,

  fetchClaims: async () => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      set({ claims: mockClaims, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch claims', isLoading: false });
    }
  },

  fetchClaimById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      const claim = mockClaims.find(c => c.id === id);
      if (!claim) {
        throw new Error('Claim not found');
      }
      set({ selectedClaim: claim, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch claim details', isLoading: false });
    }
  },

  updateClaimStatus: async (id: string, status: ClaimStatus, notes: string) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      const claim = mockClaims.find(c => c.id === id);
      if (!claim) {
        throw new Error('Claim not found');
      }
      
      // Update the claim in our mock data
      const updatedClaim = {
        ...claim,
        status,
        audits: [
          ...claim.audits,
          {
            id: String(claim.audits.length + 1),
            action: status,
            performedBy: 'Current User',
            timestamp: new Date().toISOString(),
            notes
          }
        ]
      };

      set(state => ({
        claims: state.claims.map(c => c.id === id ? updatedClaim : c),
        selectedClaim: state.selectedClaim?.id === id ? updatedClaim : state.selectedClaim,
        isLoading: false
      }));
    } catch (error) {
      set({ error: 'Failed to update claim status', isLoading: false });
    }
  },

  uploadDocument: async (claimId: string, fileName: string) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      const claim = mockClaims.find(c => c.id === claimId);
      if (!claim) {
        throw new Error('Claim not found');
      }

      const newDocument: ClaimDocument = {
        id: String(claim.documents.length + 1),
        name: fileName,
        type: 'OTHER',
        status: 'PENDING',
        url: '#',
        uploadedAt: new Date().toISOString()
      };

      const updatedClaim = {
        ...claim,
        documents: [...claim.documents, newDocument]
      };

      set(state => ({
        claims: state.claims.map(c => c.id === claimId ? updatedClaim : c),
        selectedClaim: state.selectedClaim?.id === claimId ? updatedClaim : state.selectedClaim,
        isLoading: false
      }));
    } catch (error) {
      set({ error: 'Failed to upload document', isLoading: false });
    }
  },

  addCommunication: async (claimId: string, communication: Omit<ClaimCommunication, 'id' | 'timestamp'>) => {
    set({ isLoading: true, error: null });
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
    } catch (error) {
      set({ error: 'Failed to add communication', isLoading: false });
    }
  }
})); 