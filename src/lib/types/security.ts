export type Permission = {
  id: string;
  name: string;
  description: string;
  resource: string;
  action: 'CREATE' | 'READ' | 'UPDATE' | 'DELETE' | 'MANAGE';
  createdAt: string;
  updatedAt: string;
};

export type Role = {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  isSystem: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
};

export type AuditLog = {
  id: string;
  userId: string;
  userName: string;
  action: string;
  resource: string;
  resourceId: string;
  details: Record<string, unknown>;
  ipAddress: string;
  userAgent: string;
  timestamp: string;
};

export type Session = {
  id: string;
  userId: string;
  userName: string;
  email: string;
  role: string;
  lastActive: string;
  ipAddress: string;
  userAgent: string;
  status: 'ACTIVE' | 'EXPIRED' | 'TERMINATED';
  createdAt: string;
  expiresAt: string;
};

export type SecuritySettings = {
  sessionTimeout: number; // in minutes
  maxFailedAttempts: number;
  lockoutDuration: number; // in minutes
  passwordExpiry: number; // in days
  requireMFA: boolean;
  allowedIPs: string[];
  restrictedIPs: string[];
};

export type SecurityEvent = unknown; 