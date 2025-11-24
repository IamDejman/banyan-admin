import { Http } from "../../utils/http";
import { Metric } from "@/lib/types/analytics";
import { SettlementsResponse } from "@/lib/types/settlement";

// Generic API response interface
interface ApiResponse<T> {
    data?: T;
    message?: string;
    status?: string;
}

// Specific interfaces for different entities
interface Insurer {
    id: number;
    name: string;
    code: string;
    logo?: string;
    contact_email?: string;
    contact_phone?: string;
    address?: string;
    active: number;
    supported_claim_types: string[];
    special_instructions?: string;
    created_at?: string;
    updated_at?: string;
}

interface ClaimType {
    id: string | number;
    name: string;
    code: string;
    tracking_prefix: string;
    description: string;
    required_documents: string[] | null;
    active: number;
    processing_time_estimate: string | null;
    created_at: string | null;
    updated_at: string | null;
}

interface IncidentType {
    id: string | number;
    name: string;
    description?: string;
    active: number;
    created_at?: string;
    updated_at?: string;
}

interface PaymentConfiguration {
    id: string | number;
    name: string;
    code: string;
    description: string;
    applicable_claim_types?: string;
    terms_and_conditions: string;
    active: number;
    created_at?: string;
    updated_at?: string;
}

interface Claim {
    id: string | number;
    claim_number: string;
    client: {
        first_name: string;
        last_name: string;
    };
    claim_type_details: {
        name: string;
    };
    estimated_value: number;
    status: string;
    created_at?: string;
    updated_at?: string;
}

interface Document {
    id: string | number;
    document_type: string;
    claim_id: string | number;
    client: string;
    document_uploaded: boolean;
    file_type: string;
    file_size?: string;
    document_url?: string;
    status?: string;
    created_at?: string;
    updated_at?: string;
}

export const getDashboardMetrics = (): Promise<Metric[]> => Http.get(`/admin/dashboard`);





export const getInsurers = (): Promise<ApiResponse<Insurer[]>> => Http.get(`/admin/insurers`);


export const getInsurerById = (id: string): Promise<ApiResponse<Insurer>> => Http.get(`/admin/insurers/${id}`);


export const storeInsurer = (payload: Omit<Insurer, 'id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<Insurer>> => Http.post(`/admin/insurers`, payload);


export const updateInsurer = (id: string, payload: Partial<Insurer>): Promise<ApiResponse<Insurer>> => Http.patch(`/admin/insurers/${id}`, payload);


export const deleteInsurer = (id: string): Promise<ApiResponse<void>> => Http.delete(`/admin/insurers/${id}`);


export const getClaimTypes = (): Promise<ApiResponse<ClaimType[]>> => Http.get(`/admin/claim-types`);

// Agent interface
interface Agent {
    id: string | number;
    first_name: string;
    last_name: string;
    email?: string;
    active?: number;
    created_at?: string;
    updated_at?: string;
}

// NOTE: This API currently returns 500 error due to backend filtering issue
// The endpoint expects an array for filter parameter but receives null
// Returns empty array when API fails
// Alternative endpoints to try:
// 1. /admin/user-management (without role filter)
// 2. /admin/users?role=agent
// 3. /admin/agents
// NOTE: This API currently returns 500 error due to backend filtering issue
// The endpoint expects an array for filter parameter but receives null
// Returns empty array when API fails
// Alternative endpoints to try:
// 1. /admin/user-management (without role filter)
// 2. /admin/users?role=agent
// 3. /admin/agents
export const getAgents = (page: number = 1, perPage: number = 15): Promise<ApiResponse<Agent[]>> => 
  Http.get(`/admin/user-management/?role=agent&page=${page}&per_page=${perPage}`);

// Search agents with search parameter
export const searchAgents = (searchTerm: string): Promise<ApiResponse<Agent[]>> => 
  Http.get(`/admin/user-management/?role=agent&search=${encodeURIComponent(searchTerm)}`);

// Alternative function to get all users and filter agents client-side
export const getAllUsers = (): Promise<ApiResponse<Agent[]>> => Http.get(`/admin/user-management`);

// Create agent interface
interface CreateAgentRequest {
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  role: "agent";
  phone: string;
}

// Create a new agent
export const createAgent = (agentData: CreateAgentRequest): Promise<ApiResponse<Agent>> => {
  return Http.post(`/admin/user-management/`, agentData);
};


export const getClaimTypeById = (id: string): Promise<ApiResponse<ClaimType>> => Http.get(`/admin/claim-types/${id}`);


export const storeClaimType = (payload: Omit<ClaimType, 'id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<ClaimType>> => Http.post(`/admin/claim-types`, payload);


export const updateClaimType = (id: string, payload: Partial<ClaimType>): Promise<ApiResponse<ClaimType>> => Http.patch(`/admin/claim-types/${id}`, payload);


export const deleteClaimType = (id: string): Promise<ApiResponse<void>> => Http.delete(`/admin/claim-types/${id}`);



export const getIncidentTypes = (): Promise<ApiResponse<IncidentType[]>> => Http.get(`/admin/incident-types`);


export const getIncidentTypeById = (id: string): Promise<ApiResponse<IncidentType>> => Http.get(`/admin/incident-types/${id}`);


export const storeIncidentType = (payload: Omit<IncidentType, 'id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<IncidentType>> => Http.post(`/admin/incident-types`, payload);

export const updateIncidentType = (id: string, payload: Partial<IncidentType>): Promise<ApiResponse<IncidentType>> => Http.patch(`/admin/incident-types/${id}`, payload);

export const deleteIncidentType = (id: string): Promise<ApiResponse<void>> => Http.delete(`/admin/incident-types/${id}`);



export const getPaymentConfigurations = (): Promise<ApiResponse<PaymentConfiguration[]>> => Http.get(`/admin/payment-configurations`);

export const getPaymentConfigurationById = (id: string): Promise<ApiResponse<PaymentConfiguration>> => Http.get(`/admin/payment-configurations/${id}`);

export const storePaymentConfiguration = (payload: Omit<PaymentConfiguration, 'id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<PaymentConfiguration>> => Http.post(`/admin/payment-configurations`, payload);

export const updatePaymentConfiguration = (id: string, payload: Partial<PaymentConfiguration>): Promise<ApiResponse<PaymentConfiguration>> => Http.patch(`/admin/payment-configurations/${id}`, payload);

export const togglePaymentConfigurationStatus = (id: string): Promise<ApiResponse<PaymentConfiguration>> => Http.patch(`/admin/payment-configurations/update-status/${id}`);

export const deletePaymentConfiguration = (id: string): Promise<ApiResponse<void>> => Http.delete(`/admin/payment-configurations/${id}`);




export const getClaimsStatistics = (): Promise<ApiResponse<unknown>> => Http.get(`/admin/claims/statistics`);

export const getClaims = (
  page: number = 1,
  perPage: number = 15,
  filters?: {
    search?: string;
    status?: string;
    claim_type?: string;
    start_date?: string;
    end_date?: string;
  }
): Promise<ApiResponse<Claim[]>> => {
  const params = new URLSearchParams({
    page: page.toString(),
    per_page: perPage.toString(),
  });

  if (filters?.search) params.append('search', filters.search);
  if (filters?.status && filters.status !== 'all') params.append('status', filters.status);
  if (filters?.claim_type && filters.claim_type !== 'all') params.append('claim_type', filters.claim_type);
  if (filters?.start_date) params.append('start_date', filters.start_date);
  if (filters?.end_date) params.append('end_date', filters.end_date);

  return Http.get(`/admin/claims?${params.toString()}`);
};

export const getClaimById = (id: string): Promise<ApiResponse<Claim>> => Http.get(`/admin/claims/show/${id}`);

// Admin management API
// NOTE: This API currently returns 500 error due to backend filtering issue
// The endpoint expects an array for filter parameter but receives null
// Same issue as getAgents and getCustomers - will use getAllUsers as fallback
export const getAdmins = (page: number = 1, perPage: number = 15): Promise<ApiResponse<Admin[]>> => 
  Http.get(`/admin/user-management/?role=admin&page=${page}&per_page=${perPage}`);

// Search admins with search parameter
export const searchAdmins = (searchTerm: string): Promise<ApiResponse<Admin[]>> => 
  Http.get(`/admin/user-management/?role=admin&search=${encodeURIComponent(searchTerm)}`);

export const getDocumentStatistics = (): Promise<ApiResponse<unknown>> => Http.get(`/admin/claims/document-statistics`);
export const listDocuments = (): Promise<ApiResponse<Document[]>> => Http.get(`/admin/claims/documents`);
export const updateDocument = (document_id: string, status: "approve" | "reject"): Promise<ApiResponse<Document>> => Http.patch(`/admin/claims/update-document-status`, { document_id, status });

export const getPendingDocuments = (): Promise<ApiResponse<Document[]>> => Http.get(`/admin/claims/pending-documents`);

export const getSettlements = (optionalParams?: string): Promise<SettlementsResponse> => {
    if (optionalParams && optionalParams !== "all") {
        return Http.get(`/admin/claims/settlements?status=${optionalParams}`);
    }
    return Http.get(`/admin/claims/settlements`);
}


export const updateSettlementOffer = (payload: Record<string, unknown>): Promise<ApiResponse<unknown>> => Http.post(`/admin/claim-offers/present-offer`, payload);


export const getSettlementById = (id: string): Promise<ApiResponse<unknown>> => Http.get(`/admin/claims/settlements/${id}`);


export const getSettlementStatistics = (): Promise<ApiResponse<unknown>> => Http.get(`/admin/claims/settlement-statistics`);

export const createSettlementOffer = (payload: Record<string, unknown>): Promise<ApiResponse<unknown>> => Http.post(`/admin/claim-offers/store`, payload);

export const approveSettlementOffer = (payload: Record<string, unknown>): Promise<ApiResponse<unknown>> => Http.post(`/admin/claim-offers/approve-offer`, payload);

export const rejectSettlementOffer = (payload: Record<string, unknown>): Promise<ApiResponse<unknown>> => Http.post(`/admin/claim-offers/reject-offer`, payload);

// approve claim
export const approveClaim = (claimId: string): Promise<ApiResponse<unknown>> => Http.post(`/admin/claims/approve-claim`, { claim_id: claimId });

// get settlements with status filter
export const getSettlementsWithStatus = (status: string = 'settlement_offered'): Promise<ApiResponse<unknown>> => Http.get(`/admin/claims/settlements?status=${status}`);

// get claim offers statistics
export const getClaimOffersStatistics = (): Promise<ApiResponse<unknown>> => Http.get(`/admin/claim-offers/statistics`);

// get claim offers
export const getClaimOffers = (): Promise<ApiResponse<unknown>> => Http.get(`/claims/claim-offer/`);

// complete offer (mark as paid)
export const completeOffer = (claimOfferId: number): Promise<ApiResponse<unknown>> => Http.post(`/admin/claim-offers/complete-offer`, { claim_offer_id: claimOfferId });

// get approved claims for settlement offers
export const getApprovedClaims = (): Promise<ApiResponse<unknown>> => Http.get(`/admin/claims?status=approved`);

// request additional information for a claim
export const requestAdditionalInformation = (payload: {
  claim_id: string | number;
  request_type: 'document_request' | 'additional_information';
  details: string;
}): Promise<ApiResponse<unknown>> => Http.post(`/admin/claims/request-additional-information`, payload);

// get claim assignments (for agent filter)
export const getClaimAssignments = (search?: string): Promise<ApiResponse<unknown>> => {
  const url = search ? `/admin/claim-assignments?search=${encodeURIComponent(search)}` : '/admin/claim-assignments';
  return Http.get(url);
};

// get claim assignments with claims data
export const getClaimAssignmentsWithClaims = (): Promise<ApiResponse<unknown>> => Http.get(`/admin/claim-assignments/claims`);

// Claim assignment statistics interface
interface ClaimAssignmentStatistics {
  total_agents: number;
  active_assignments: number;
  total_assignments?: number;
  completed_assignments?: number;
  overdue_assignments?: number;
}

// get claim assignments statistics
export const getClaimAssignmentStatistics = (): Promise<ApiResponse<ClaimAssignmentStatistics>> => Http.get(`/admin/claim-assignments/statistics`);

// assign claim to agent
export const assignClaim = (claimId: string, agentId: string, specialInstructions?: string): Promise<ApiResponse<unknown>> => 
  Http.post(`/admin/claim-assignments`, {
    claim_id: claimId,
    agent_id: agentId,
    special_instructions: specialInstructions || ""
  });

// update claim assignment
export const updateClaimAssignment = (claimAssignmentId: string, claimId: string, agentId?: string): Promise<ApiResponse<unknown>> => {
  // Try sending just the agent_id since we're reassigning
  const payload: { agent_id?: number } = {};
  
  if (agentId) {
    payload.agent_id = parseInt(agentId);
  }
  
  return Http.patch(`/admin/claim-assignments/update-assignment/${claimAssignmentId}`, payload);
};

// Audit Log interfaces
interface AuditLog {
  id: number;
  log_name: string;
  description: string;
  subject_type: string | null;
  event: string | null;
  subject_id: string | null;
  causer_type: string;
  causer_id: number;
  properties: {
    action: string;
    status: string;
  };
  batch_uuid: string | null;
  created_at: string;
  updated_at: string;
}

export const getAuditLogs = (): Promise<ApiResponse<AuditLog[]>> => Http.get(`/admin/audit-logs`);

// Customer interface
interface Customer {
    id: string | number;
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
    status?: string;
    role: string;
    created_at?: string;
    updated_at?: string;
    last_login?: string;
    date_of_birth?: string;
    address?: string;
    emergency_contact?: {
        name: string;
        phone: string;
        relationship: string;
    };
    claims?: string[];
    preferences?: {
        notifications: boolean;
        language: string;
    };
}

// Admin interface
interface Admin {
    id: string | number;
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
    status?: string;
    role: string;
    created_at?: string;
    updated_at?: string;
    last_login?: string;
    permissions?: string[];
    is_super_admin?: boolean;
    department?: string;
}

// Get customers from the API with pagination
// NOTE: This API currently returns 500 error due to backend filtering issue
// The endpoint expects an array for filter parameter but receives null
// Same issue as getAgents - will use getAllUsers as fallback
export const getCustomers = (page: number = 1, perPage: number = 15): Promise<ApiResponse<Customer[]>> => 
  Http.get(`/admin/user-management/?role=customer&page=${page}&per_page=${perPage}`);

// Search customers with search parameter
export const searchCustomers = (searchTerm: string): Promise<ApiResponse<Customer[]>> => 
  Http.get(`/admin/user-management/?role=customer&search=${encodeURIComponent(searchTerm)}`);

// Create a new customer
export const createCustomer = (payload: {
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  role: string;
  phone: string;
}): Promise<ApiResponse<Customer>> => Http.post(`/admin/user-management/`, payload);

// Create a new admin
export const createAdmin = (payload: {
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  role: string;
  phone: string;
}): Promise<ApiResponse<Admin>> => Http.post(`/admin/user-management/`, payload);

// Disable/Enable a user
export const disableUser = (userId: string): Promise<ApiResponse<unknown>> => Http.patch(`/admin/user-management/disable/${userId}`);

// Edit/Update a user
export const editUser = (userId: string, payload: {
  email?: string;
  first_name?: string;
  last_name?: string;
  password?: string;
  phone?: string;
  role?: string;
}): Promise<ApiResponse<unknown>> => Http.patch(`/admin/user-management/update/${userId}`, payload);

// RBAC - Permissions and Roles API
export const getPermissions = (): Promise<ApiResponse<unknown>> => Http.get(`/admin/rbac/permissions`);
export const getRoles = (): Promise<ApiResponse<unknown>> => Http.get(`/admin/rbac/roles`);



