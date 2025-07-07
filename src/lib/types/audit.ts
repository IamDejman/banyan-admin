export type AuditLogSeverity = "info" | "warning" | "error" | "critical";

export type AuditLogAction = 
  | "user_login" 
  | "user_logout" 
  | "user_created" 
  | "user_updated" 
  | "user_deleted"
  | "claim_created"
  | "claim_updated"
  | "claim_approved"
  | "claim_rejected"
  | "document_uploaded"
  | "document_deleted"
  | "permission_granted"
  | "permission_revoked"
  | "system_config_changed"
  | "backup_created"
  | "backup_failed";

export type AuditLogDetails = {
  claimId?: string;
  customerId?: string;
  claimType?: string;
  approvedAmount?: number;
  documentType?: string;
  fileSize?: string;
  reason?: string;
  sessionId?: string;
  loginMethod?: string;
  updates?: string[];
  [key: string]: string | number | string[] | undefined;
};

export type AuditLog = {
  id: string;
  userId: string;
  userName: string;
  userRole: "admin" | "agent";
  action: AuditLogAction;
  severity: AuditLogSeverity;
  description: string;
  details: AuditLogDetails;
  ipAddress: string;
  userAgent: string;
  timestamp: string;
  resourceType?: string;
  resourceId?: string;
};

export type AuditLogFilter = {
  userRole?: "admin" | "agent";
  action?: AuditLogAction;
  severity?: AuditLogSeverity;
  dateFrom?: string;
  dateTo?: string;
  userId?: string;
}; 