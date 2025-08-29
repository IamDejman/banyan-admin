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
    supported_claim_types: string;
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
    type: string;
    config: Record<string, unknown>;
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


export const updateInsurer = (id: string, payload: Partial<Insurer>): Promise<ApiResponse<Insurer>> => Http.put(`/admin/insurers/${id}`, payload);


export const deleteInsurer = (id: string): Promise<ApiResponse<void>> => Http.delete(`/admin/insurers/${id}`);


export const getClaimTypes = (): Promise<ApiResponse<ClaimType[]>> => Http.get(`/admin/claim-types`);


export const getClaimTypeById = (id: string): Promise<ApiResponse<ClaimType>> => Http.get(`/admin/claim-types/${id}`);


export const storeClaimType = (payload: Omit<ClaimType, 'id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<ClaimType>> => Http.post(`/admin/claim-types`, payload);


export const updateClaimType = (id: string, payload: Partial<ClaimType>): Promise<ApiResponse<ClaimType>> => Http.put(`/admin/claim-types/${id}`, payload);


export const deleteClaimType = (id: string): Promise<ApiResponse<void>> => Http.delete(`/admin/claim-types/${id}`);



export const getIncidentTypes = (): Promise<ApiResponse<IncidentType[]>> => Http.get(`/admin/incident-types`);


export const getIncidentTypeById = (id: string): Promise<ApiResponse<IncidentType>> => Http.get(`/admin/incident-types/${id}`);


export const storeIncidentType = (payload: Omit<IncidentType, 'id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<IncidentType>> => Http.post(`/admin/incident-types`, payload);

export const updateIncidentType = (id: string, payload: Partial<IncidentType>): Promise<ApiResponse<IncidentType>> => Http.put(`/admin/incident-types/${id}`, payload);

export const deleteIncidentType = (id: string): Promise<ApiResponse<void>> => Http.delete(`/admin/incident-types/${id}`);



export const getPaymentConfigurations = (): Promise<ApiResponse<PaymentConfiguration[]>> => Http.get(`/admin/payment-configurations`);

export const getPaymentConfigurationById = (id: string): Promise<ApiResponse<PaymentConfiguration>> => Http.get(`/admin/payment-configurations/${id}`);

export const storePaymentConfiguration = (payload: Omit<PaymentConfiguration, 'id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<PaymentConfiguration>> => Http.post(`/admin/payment-configurations`, payload);

export const updatePaymentConfiguration = (id: string, payload: Partial<PaymentConfiguration>): Promise<ApiResponse<PaymentConfiguration>> => Http.put(`/admin/payment-configurations/${id}`, payload);

export const deletePaymentConfiguration = (id: string): Promise<ApiResponse<void>> => Http.delete(`/admin/payment-configurations/${id}`);




export const getClaimsStatistics = (): Promise<ApiResponse<unknown>> => Http.get(`/admin/claims/statistics`);

export const getClaims = (): Promise<ApiResponse<Claim[]>> => Http.get(`/admin/claims`);

export const getClaimById = (id: string): Promise<ApiResponse<Claim>> => Http.get(`/admin/claims/${id}`);

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
export const approveClaim = (id: string): Promise<ApiResponse<unknown>> => Http.post(`/admin/claims/approve/${id}`);





