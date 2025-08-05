import { Http } from "../../utils/http";
import { Metric, Benchmark, Prediction, Report, ReportFilter, ReportLayout, ReportWidget, TrendData, AnalyticsData, AnalyticsTrend } from "@/lib/types/analytics";





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

export const getPendingDocuments = (): Promise<any[]> => Http.get(`/admin/claims/pending-documents`);

export const getSettlements = (): Promise<any[]> => Http.get(`/admin/claims/settlements`);


export const getSettlementById = (id: string): Promise<any[]> => Http.get(`/admin/claims/settlements/${id}`);


export const getSettlementStatistics = (): Promise<any[]> => Http.get(`/admin/claims/settlement-statistics`);





