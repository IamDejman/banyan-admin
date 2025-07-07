export type NotificationType = 'EMAIL' | 'SMS' | 'PUSH';

export type NotificationStatus = 'DRAFT' | 'SCHEDULED' | 'SENDING' | 'SENT' | 'FAILED';

export type NotificationPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export type RecipientType = 'ALL' | 'GROUP' | 'INDIVIDUAL';

export type NotificationTemplate = {
  id: string;
  name: string;
  description: string;
  type: NotificationType;
  subject: string;
  content: string;
  variables: string[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
};

export type Notification = {
  id: string;
  type: NotificationType;
  status: NotificationStatus;
  priority: NotificationPriority;
  subject: string;
  content: string;
  recipients: {
    type: RecipientType;
    ids: string[];
  };
  scheduledFor?: string;
  sentAt?: string;
  createdAt: string;
  createdBy: string;
  analytics?: NotificationAnalytics;
  metadata?: Record<string, unknown>;
};

export type NotificationAnalytics = {
  totalRecipients: number;
  delivered: number;
  failed: number;
  opened: number;
  clicked: number;
  bounceRate: number;
  openRate: number;
  clickRate: number;
};

export type NotificationHistory = {
  id: string;
  notificationId: string;
  recipientId: string;
  recipientEmail: string;
  status: 'DELIVERED' | 'FAILED' | 'OPENED' | 'CLICKED';
  timestamp: string;
  error?: string;
};

export type UserSegment = {
  id: string;
  name: string;
  description: string;
  criteria: {
    field: string;
    operator: 'equals' | 'contains' | 'greater_than' | 'less_than' | 'between';
    value: unknown;
  }[];
  userCount: number;
  createdAt: string;
  updatedAt: string;
};

export type NotificationSettings = {
  rateLimit: number;
  maxRecipients: number;
  allowedTypes: NotificationType[];
  requireApproval: boolean;
  defaultPriority: NotificationPriority;
  allowedMergeTags: string[];
};

export type NotificationPayload = unknown; 