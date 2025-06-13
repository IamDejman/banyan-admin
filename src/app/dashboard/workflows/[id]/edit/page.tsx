'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { WorkflowEditor } from '@/components/workflow/WorkflowEditor';
import { Workflow } from '@/lib/types/workflow';
import { useToast } from '@/components/ui/use-toast';

// Mock data - replace with API call
const mockWorkflow: Workflow = {
  id: '1',
  name: 'Standard Claim Review',
  description: 'Standard workflow for claim review and approval',
  status: 'ACTIVE',
  steps: [
    {
      id: '1',
      name: 'Initial Review',
      type: 'REVIEW',
      description: 'Initial review of claim documents',
      order: 1,
      required: true,
      approvers: ['Claims Reviewer'],
      approvalLevel: 'SINGLE',
    },
    {
      id: '2',
      name: 'Manager Approval',
      type: 'APPROVAL',
      description: 'Manager approval for claims over $10,000',
      order: 2,
      required: true,
      approvers: ['Claims Manager'],
      approvalLevel: 'SINGLE',
      conditions: [
        {
          id: '1',
          field: 'amount',
          operator: 'GREATER_THAN',
          value: 10000,
        },
      ],
    },
  ],
  createdAt: '2024-03-15T10:00:00Z',
  updatedAt: '2024-03-15T10:00:00Z',
  createdBy: 'Admin',
  updatedBy: 'Admin',
  version: 1,
};

export default function EditWorkflowPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const [workflow, setWorkflow] = useState<Workflow | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // TODO: Replace with API call
    const fetchWorkflow = async () => {
      try {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setWorkflow(mockWorkflow);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load workflow. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchWorkflow();
  }, [params.id, toast]);

  const handleSave = async (updatedWorkflow: Workflow) => {
    try {
      // TODO: Implement API call to update workflow
      toast({
        title: 'Workflow updated',
        description: 'The workflow has been updated successfully.',
      });
      router.push('/dashboard/workflows');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update workflow. Please try again.',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading workflow...</p>
        </div>
      </div>
    );
  }

  if (!workflow) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-lg font-medium">Workflow not found</h2>
          <p className="text-muted-foreground">
            The workflow you're looking for doesn't exist or has been deleted.
          </p>
          <button
            onClick={() => router.push('/dashboard/workflows')}
            className="mt-4 text-primary hover:underline"
          >
            Return to Workflows
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Edit Workflow</h1>
        <p className="text-muted-foreground">
          Modify the workflow configuration
        </p>
      </div>

      <WorkflowEditor workflow={workflow} onSave={handleSave} />
    </div>
  );
} 