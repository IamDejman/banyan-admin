'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { WorkflowEditor } from '@/components/workflow/WorkflowEditor';
import { Workflow } from '@/lib/types/workflow';
import { useToast } from '@/components/ui/use-toast';

// Template workflows
const workflowTemplates: Record<string, Workflow> = {
  standard: {
    id: 'template-standard',
    name: 'Standard Claim Review',
    description: 'Standard workflow for claim review and approval',
    status: 'DRAFT',
    steps: [
      {
        id: 'step-1',
        name: 'Initial Review',
        type: 'REVIEW',
        description: 'Initial review of claim documents',
        order: 1,
        required: true,
        approvers: ['Claims Reviewer'],
        approvalLevel: 'SINGLE',
      },
      {
        id: 'step-2',
        name: 'Manager Approval',
        type: 'APPROVAL',
        description: 'Manager approval for claims over $10,000',
        order: 2,
        required: true,
        approvers: ['Claims Manager'],
        approvalLevel: 'SINGLE',
        conditions: [
          {
            id: 'cond-1',
            field: 'amount',
            operator: 'GREATER_THAN',
            value: 10000,
          },
        ],
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'System',
    updatedBy: 'System',
    version: 1,
  },
  'high-value': {
    id: 'template-high-value',
    name: 'High-Value Claim Review',
    description: 'Enhanced workflow for high-value claims with multiple approval levels',
    status: 'DRAFT',
    steps: [
      {
        id: 'step-1',
        name: 'Initial Review',
        type: 'REVIEW',
        description: 'Initial review of claim documents',
        order: 1,
        required: true,
        approvers: ['Senior Claims Reviewer'],
        approvalLevel: 'SINGLE',
      },
      {
        id: 'step-2',
        name: 'Risk Assessment',
        type: 'ASSESSMENT',
        description: 'Risk assessment for high-value claims',
        order: 2,
        required: true,
        approvers: ['Risk Analyst'],
        approvalLevel: 'SINGLE',
      },
      {
        id: 'step-3',
        name: 'Manager Approval',
        type: 'APPROVAL',
        description: 'Manager approval for high-value claims',
        order: 3,
        required: true,
        approvers: ['Claims Manager'],
        approvalLevel: 'SINGLE',
      },
      {
        id: 'step-4',
        name: 'Executive Review',
        type: 'APPROVAL',
        description: 'Executive review for claims over $50,000',
        order: 4,
        required: true,
        approvers: ['Executive'],
        approvalLevel: 'SINGLE',
        conditions: [
          {
            id: 'cond-1',
            field: 'amount',
            operator: 'GREATER_THAN',
            value: 50000,
          },
        ],
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'System',
    updatedBy: 'System',
    version: 1,
  },
};

export default function NewWorkflowPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [workflow, setWorkflow] = useState<Workflow>({
    id: `workflow-${Date.now()}`,
    name: 'New Workflow',
    description: '',
    status: 'DRAFT',
    steps: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'System',
    updatedBy: 'System',
    version: 1,
  });

  useEffect(() => {
    const template = searchParams.get('template');
    if (template && workflowTemplates[template]) {
      setWorkflow({
        ...workflowTemplates[template],
        id: `workflow-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
  }, [searchParams]);

  const handleSave = async (updatedWorkflow: Workflow) => {
    try {
      // TODO: Implement API call to save workflow
      toast({
        title: 'Workflow saved',
        description: 'The workflow has been saved successfully.',
      });
      router.push('/dashboard/workflows');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save workflow. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Create New Workflow</h1>
        <p className="text-muted-foreground">
          Define a new workflow for claim processing
        </p>
      </div>

      <WorkflowEditor workflow={workflow} onSave={handleSave} />
    </div>
  );
} 