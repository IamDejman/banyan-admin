import { Http } from "../../utils/http";
import { Metric, Benchmark, Prediction, Report, ReportFilter, ReportLayout, ReportWidget, TrendData, AnalyticsData, AnalyticsTrend } from "@/lib/types/analytics";
import { Settlement, SettlementsResponse, SettlementStatistics } from "@/lib/types/settlement";






export const getDashboardMetrics = (): Promise<Metric[]> => Http.get(`/admin/dashboard`);





export const getInsurers = (): Promise<any[]> => Http.get(`/admin/insurers`);


export const getInsurerById = (id: string): Promise<any[]> => Http.get(`/admin/insurers/${id}`);


export const storeInsurer = (payload: any): Promise<any[]> => Http.post(`/admin/insurers`, payload);


export const updateInsurer = (id: string, payload: any): Promise<any[]> => Http.put(`/admin/insurers/${id}`, payload);


export const deleteInsurer = (id: string): Promise<any[]> => Http.delete(`/admin/insurers/${id}`);


export const getClaimTypes = (): Promise<any[]> => Http.get(`/admin/claim-types`);


export const getClaimTypeById = (id: string): Promise<any[]> => Http.get(`/admin/claim-types/${id}`);


export const storeClaimType = (payload: any): Promise<any[]> => Http.post(`/admin/claim-types`, payload);


export const updateClaimType = (id: string, payload: any): Promise<any[]> => Http.put(`/admin/claim-types/${id}`, payload);


export const deleteClaimType = (id: string): Promise<any[]> => Http.delete(`/admin/claim-types/${id}`);



export const getIncidentTypes = (): Promise<any[]> => Http.get(`/admin/incident-types`);


export const getIncidentTypeById = (id: string): Promise<any[]> => Http.get(`/admin/incident-types/${id}`);


export const storeIncidentType = (payload: any): Promise<any[]> => Http.post(`/admin/incident-types`, payload);

export const updateIncidentType = (id: string, payload: any): Promise<any[]> => Http.put(`/admin/incident-types/${id}`, payload);

export const deleteIncidentType = (id: string): Promise<any[]> => Http.delete(`/admin/incident-types/${id}`);



export const getPaymentConfigurations = (): Promise<any[]> => Http.get(`/admin/payment-configurations`);

export const getPaymentConfigurationById = (id: string): Promise<any[]> => Http.get(`/admin/payment-configurations/${id}`);

export const storePaymentConfiguration = (payload: any): Promise<any[]> => Http.post(`/admin/payment-configurations`, payload);

export const updatePaymentConfiguration = (id: string, payload: any): Promise<any[]> => Http.put(`/admin/payment-configurations/${id}`, payload);

export const deletePaymentConfiguration = (id: string): Promise<any[]> => Http.delete(`/admin/payment-configurations/${id}`);




export const getClaimsStatistics = (): Promise<any[]> => Http.get(`/admin/claims/statistics`);

export const getClaims = (): Promise<any[]> => Http.get(`/admin/claims`);

export const getClaimById = (id: string): Promise<any[]> => Http.get(`/admin/claims/${id}`);

export const getDocumentStatistics = (): Promise<any[]> => Http.get(`/admin/claims/document-statistics`);
export const listDocuments = (): Promise<any[]> => Http.get(`/admin/claims/documents`);
export const updateDocument = (document_id: string, status: "approve" | "reject"): Promise<any[]> => Http.patch(`/admin/claims/update-document-status`, { document_id, status });

export const getPendingDocuments = (): Promise<any[]> => Http.get(`/admin/claims/pending-documents`);

export const getSettlements = (optionalParams?: any): Promise<SettlementsResponse> => {
    if (optionalParams && optionalParams !== "all") {
        return Http.get(`/admin/claims/settlements?status=${optionalParams}`);
    }
    return Http.get(`/admin/claims/settlements`);
}


export const updateSettlementOffer = (payload: any): Promise<any[]> => Http.post(`/admin/claim-offers/present-offer`, payload);


export const getSettlementById = (id: string): Promise<any[]> => Http.get(`/admin/claims/settlements/${id}`);


export const getSettlementStatistics = (): Promise<any[]> => Http.get(`/admin/claims/settlement-statistics`);

export const createSettlementOffer = (payload: any): Promise<any[]> => Http.post(`/admin/claim-offers/store`, payload);

export const approveSettlementOffer = (payload: any): Promise<any[]> => Http.post(`/admin/claim-offers/approve-offer`, payload);

export const rejectSettlementOffer = (payload: any): Promise<any[]> => Http.post(`/admin/claim-offers/reject-offer`, payload);

// approve claim
export const approveClaim = (id: string): Promise<any[]> => Http.post(`/admin/claims/approve/${id}`);





