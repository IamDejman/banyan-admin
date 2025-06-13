export type WorkflowStatus = 
  | 'DRAFT'
  | 'ACTIVE'
  | 'INACTIVE'
  | 'ARCHIVED';

export type WorkflowStepType = 
  | 'REVIEW'
  | 'APPROVAL'
  | 'NOTIFICATION'
  | 'DOCUMENT_COLLECTION'
  | 'ASSESSMENT'
  | 'SETTLEMENT'
  | 'CUSTOM';

export type ApprovalLevel = 
  | 'SINGLE'
  | 'MULTI'
  | 'PARALLEL'
  | 'SEQUENTIAL';

export type EscalationTrigger = 
  | 'TIME_BASED'
  | 'ACTION_BASED'
  | 'CONDITION_BASED';

export interface WorkflowStep {
  id: string;
  name: string;
  type: WorkflowStepType;
  description: string;
  order: number;
  required: boolean;
  timeoutHours?: number;
  approvers: string[];
  approvalLevel: ApprovalLevel;
  escalationRules?: EscalationRule[];
  conditions?: WorkflowCondition[];
}

export interface EscalationRule {
  id: string;
  trigger: EscalationTrigger;
  condition: string;
  action: string;
  targetRole: string;
  timeoutHours: number;
  notificationTemplate: string;
}

export interface WorkflowCondition {
  id: string;
  field: string;
  operator: 'EQUALS' | 'NOT_EQUALS' | 'GREATER_THAN' | 'LESS_THAN' | 'CONTAINS';
  value: string | number;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  status: WorkflowStatus;
  steps: WorkflowStep[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  version: number;
}

export interface WorkflowInstance {
  id: string;
  workflowId: string;
  claimId: string;
  currentStep: number;
  status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED' | 'ERROR';
  startedAt: string;
  completedAt?: string;
  currentApprovers: string[];
  stepHistory: WorkflowStepHistory[];
}

export interface WorkflowStepHistory {
  stepId: string;
  status: 'PENDING' | 'COMPLETED' | 'REJECTED' | 'ESCALATED';
  startedAt: string;
  completedAt?: string;
  approvers: {
    userId: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    timestamp?: string;
    notes?: string;
  }[];
  escalations: {
    ruleId: string;
    triggeredAt: string;
    resolvedAt?: string;
    status: 'PENDING' | 'RESOLVED';
  }[];
} 