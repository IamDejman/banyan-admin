'use client';

import { Workflow, WorkflowInstance, WorkflowStep } from '@/lib/types/workflow';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, Clock, AlertCircle, XCircle } from 'lucide-react';

interface WorkflowVisualizerProps {
  workflow: Workflow;
  instance?: WorkflowInstance;
}

const stepStatusColors = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  COMPLETED: 'bg-green-100 text-green-800',
  REJECTED: 'bg-red-100 text-red-800',
  ESCALATED: 'bg-orange-100 text-orange-800',
};

export function WorkflowVisualizer({ workflow, instance }: WorkflowVisualizerProps) {
  const getStepStatus = (step: WorkflowStep) => {
    if (!instance) return 'PENDING';
    const stepHistory = instance.stepHistory.find(h => h.stepId === step.id);
    return stepHistory?.status || 'PENDING';
  };

  const getStepProgress = (step: WorkflowStep) => {
    if (!instance) return 0;
    const stepHistory = instance.stepHistory.find(h => h.stepId === step.id);
    if (!stepHistory) return 0;
    
    if (stepHistory.status === 'COMPLETED') return 100;
    if (stepHistory.status === 'REJECTED') return 0;
    
    const totalApprovers = step.approvers.length;
    const approvedCount = stepHistory.approvers.filter(a => a.status === 'APPROVED').length;
    return (approvedCount / totalApprovers) * 100;
  };

  const getStepIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'PENDING':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'REJECTED':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'ESCALATED':
        return <AlertCircle className="h-5 w-5 text-orange-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Workflow Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {workflow.steps.map((step, index) => {
            const status = getStepStatus(step);
            const progress = getStepProgress(step);
            
            return (
              <div key={step.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getStepIcon(status)}
                    <div>
                      <div className="font-medium">{step.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {step.description}
                      </div>
                    </div>
                  </div>
                  <Badge
                    className={stepStatusColors[status as keyof typeof stepStatusColors]}
                  >
                    {status}
                  </Badge>
                </div>
                
                <div className="space-y-1">
                  <Progress value={progress} />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Progress: {Math.round(progress)}%</span>
                    <span>
                      {step.approvers.length} {step.approvers.length === 1 ? 'Approver' : 'Approvers'}
                    </span>
                  </div>
                </div>

                {instance && status === 'PENDING' && (
                  <div className="mt-2 p-2 bg-yellow-50 rounded-md">
                    <div className="text-sm font-medium text-yellow-800">Current Approvers</div>
                    <div className="mt-1 space-y-1">
                      {step.approvers.map((approver) => (
                        <div key={approver} className="text-sm text-yellow-700">
                          {approver}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {instance && status === 'ESCALATED' && (
                  <div className="mt-2 p-2 bg-orange-50 rounded-md">
                    <div className="text-sm font-medium text-orange-800">Escalated To</div>
                    <div className="mt-1 space-y-1">
                      {step.escalationRules?.map((rule) => (
                        <div key={rule.id} className="text-sm text-orange-700">
                          {rule.targetRole} - {rule.action}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
} 