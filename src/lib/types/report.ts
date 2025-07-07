export type ReportType = "claims" | "users" | "performance" | "system";

export type ReportPeriod = "daily" | "weekly" | "monthly" | "quarterly" | "yearly";

export type ReportStatus = "draft" | "generated" | "scheduled" | "failed";

export type ReportData = ClaimsReport | UsersReport | PerformanceReport | SystemReport;

export type ReportFilters = {
  dateFrom?: string;
  dateTo?: string;
  claimType?: string;
  status?: string;
  userId?: string;
  [key: string]: string | undefined;
};

export type Report = {
  id: string;
  name: string;
  type: ReportType;
  description: string;
  status: ReportStatus;
  period: ReportPeriod;
  createdAt: string;
  generatedAt?: string;
  data: ReportData;
  filters: ReportFilters;
};

export type ClaimsReport = {
  totalClaims: number;
  pendingClaims: number;
  approvedClaims: number;
  rejectedClaims: number;
  averageProcessingTime: number;
  claimsByType: Record<string, number>;
  claimsByStatus: Record<string, number>;
  claimsByMonth: Array<{ month: string; count: number }>;
  topInsurers: Array<{ name: string; count: number }>;
};

export type UsersReport = {
  totalUsers: number;
  activeUsers: number;
  newUsers: number;
  usersByRole: Record<string, number>;
  usersByStatus: Record<string, number>;
  userActivity: Array<{ date: string; activeUsers: number }>;
  topAgents: Array<{ name: string; claimsProcessed: number; rating: number }>;
};

export type PerformanceReport = {
  systemUptime: number;
  averageResponseTime: number;
  errorRate: number;
  throughput: number;
  performanceByHour: Array<{ hour: number; requests: number }>;
  topPerformingAgents: Array<{ name: string; performance: number }>;
  systemLoad: Array<{ timestamp: string; load: number }>;
};

export type SystemReport = {
  systemHealth: "healthy" | "warning" | "critical";
  activeUsers: number;
  totalStorage: number;
  usedStorage: number;
  databaseConnections: number;
  lastBackup: string;
  systemAlerts: Array<{ severity: "low" | "medium" | "high"; message: string; timestamp: string }>;
}; 