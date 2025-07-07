'use client';

import { CheckCircle, Circle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface WorkflowStep {
  id: string;
  name: string;
  description: string;
  status: 'completed' | 'current' | 'pending';
  completedAt?: string;
}

interface WorkflowProgressProps {
  steps: WorkflowStep[];
  className?: string;
}

export function WorkflowProgress({ steps, className }: WorkflowProgressProps) {
  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Claim Progress</h3>
        <span className="text-sm text-muted-foreground">
          {steps.filter(step => step.status === 'completed').length} of {steps.length} completed
        </span>
      </div>
      
      <div className="space-y-3">
        {steps.map((step, index) => {
          const isLast = index === steps.length - 1;
          
          return (
            <div key={step.id} className="flex items-start gap-3">
              {/* Step Icon */}
              <div className="flex flex-col items-center">
                <div className={cn(
                  'flex items-center justify-center w-8 h-8 rounded-full border-2',
                  step.status === 'completed' && 'bg-green-500 border-green-500 text-white',
                  step.status === 'current' && 'bg-blue-500 border-blue-500 text-white',
                  step.status === 'pending' && 'bg-gray-100 border-gray-300 text-gray-400'
                )}>
                  {step.status === 'completed' && <CheckCircle size={16} />}
                  {step.status === 'current' && <Clock size={16} />}
                  {step.status === 'pending' && <Circle size={16} />}
                </div>
                
                {/* Connector Line */}
                {!isLast && (
                  <div className={cn(
                    'w-0.5 h-8 mt-2',
                    step.status === 'completed' ? 'bg-green-500' : 'bg-gray-200'
                  )} />
                )}
              </div>
              
              {/* Step Content */}
              <div className="flex-1 pt-1">
                <div className="flex items-center justify-between">
                  <h4 className={cn(
                    'font-medium',
                    step.status === 'completed' && 'text-green-700',
                    step.status === 'current' && 'text-blue-700',
                    step.status === 'pending' && 'text-gray-500'
                  )}>
                    {step.name}
                  </h4>
                  {step.completedAt && (
                    <span className="text-xs text-muted-foreground">
                      {step.completedAt}
                    </span>
                  )}
                </div>
                <p className={cn(
                  'text-sm mt-1',
                  step.status === 'pending' && 'text-gray-400'
                )}>
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Predefined workflow steps for claims
export const CLAIM_WORKFLOW_STEPS: WorkflowStep[] = [
  {
    id: 'submitted',
    name: 'Claim Submitted',
    description: 'Claim has been submitted and is awaiting review',
    status: 'completed',
  },
  {
    id: 'review',
    name: 'Under Review',
    description: 'Claim is being reviewed by claims agent',
    status: 'current',
  },
  {
    id: 'documents',
    name: 'Document Review',
    description: 'Documents are being verified and processed',
    status: 'pending',
  },
  {
    id: 'assessment',
    name: 'Assessment',
    description: 'Claim is being assessed for valuation',
    status: 'pending',
  },
  {
    id: 'settlement',
    name: 'Settlement',
    description: 'Settlement offer is being prepared',
    status: 'pending',
  },
  {
    id: 'completed',
    name: 'Completed',
    description: 'Claim has been settled and closed',
    status: 'pending',
  },
];

// Helper function to update workflow status
export function updateWorkflowStatus(
  steps: WorkflowStep[], 
  currentStepId: string
): WorkflowStep[] {
  return steps.map(step => {
    if (step.id === currentStepId) {
      return { ...step, status: 'current' as const };
    } else if (step.status === 'current') {
      return { ...step, status: 'completed' as const, completedAt: new Date().toLocaleDateString() };
    }
    return step;
  });
} 