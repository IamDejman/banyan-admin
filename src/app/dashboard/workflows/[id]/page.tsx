'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { WorkflowVisualizer } from '@/components/workflow/WorkflowVisualizer';
import { Workflow, WorkflowInstance } from '@/lib/types/workflow';
import { useToast } from '@/components/ui/use-toast';
import { Settings, ArrowLeft, Play, Pause, Archive } from 'lucide-react';

// Mock data - replace with API calls
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

const mockInstances: WorkflowInstance[] = [
  {
    id: '1',
    workflowId: '1',
    claimId: 'CLM-001',
    currentStep: 1,
    status: 'ACTIVE',
    startedAt: '2024-03-15T10:00:00Z',
    currentApprovers: ['Claims Reviewer'],
    stepHistory: [
      {
        stepId: '1',
        status: 'PENDING',
        startedAt: '2024-03-15T10:00:00Z',
        approvers: [
          {
            userId: 'Claims Reviewer',
            status: 'PENDING',
          },
        ],
        escalations: [],
      },
    ],
  },
  {
    id: '2',
    workflowId: '1',
    claimId: 'CLM-002',
    currentStep: 2,
    status: 'COMPLETED',
    startedAt: '2024-03-14T15:00:00Z',
    completedAt: '2024-03-15T09:00:00Z',
    currentApprovers: [],
    stepHistory: [
      {
        stepId: '1',
        status: 'COMPLETED',
        startedAt: '2024-03-14T15:00:00Z',
        completedAt: '2024-03-14T16:00:00Z',
        approvers: [
          {
            userId: 'Claims Reviewer',
            status: 'APPROVED',
            timestamp: '2024-03-14T16:00:00Z',
          },
        ],
        escalations: [],
      },
      {
        stepId: '2',
        status: 'COMPLETED',
        startedAt: '2024-03-14T16:00:00Z',
        completedAt: '2024-03-15T09:00:00Z',
        approvers: [
          {
            userId: 'Claims Manager',
            status: 'APPROVED',
            timestamp: '2024-03-15T09:00:00Z',
          },
        ],
        escalations: [],
      },
    ],
  },
];

const statusColors = {
  ACTIVE: 'bg-green-100 text-green-800',
  COMPLETED: 'bg-blue-100 text-blue-800',
  CANCELLED: 'bg-red-100 text-red-800',
  ERROR: 'bg-orange-100 text-orange-800',
};

export default function WorkflowDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [workflow, setWorkflow] = useState<Workflow | null>(null);
  const [instances, setInstances] = useState<WorkflowInstance[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // TODO: Replace with API calls
    const fetchData = async () => {
      try {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setWorkflow(mockWorkflow);
        setInstances(mockInstances);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load workflow details. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [params.id, toast]);

  const handleStatusChange = async (newStatus: 'ACTIVE' | 'INACTIVE' | 'ARCHIVED') => {
    try {
      // TODO: Implement API call to update workflow status
      toast({
        title: 'Status updated',
        description: `Workflow status has been updated to ${newStatus.toLowerCase()}.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update workflow status. Please try again.',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading workflow details...</p>
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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{workflow.name}</h1>
            <p className="text-muted-foreground">{workflow.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {workflow.status === 'ACTIVE' ? (
            <Button
              variant="outline"
              onClick={() => handleStatusChange('INACTIVE')}
            >
              <Pause className="h-4 w-4 mr-2" />
              Pause
            </Button>
          ) : (
            <Button
              variant="outline"
              onClick={() => handleStatusChange('ACTIVE')}
            >
              <Play className="h-4 w-4 mr-2" />
              Activate
            </Button>
          )}
          <Button
            variant="outline"
            onClick={() => handleStatusChange('ARCHIVED')}
          >
            <Archive className="h-4 w-4 mr-2" />
            Archive
          </Button>
          <Button
            onClick={() => router.push(`/dashboard/workflows/${params.id}/edit`)}
          >
            <Settings className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="instances">Instances</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <WorkflowVisualizer workflow={workflow} />
        </TabsContent>

        <TabsContent value="instances" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Workflow Instances</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {instances.map((instance) => (
                  <Card key={instance.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">
                              Claim {instance.claimId}
                            </h3>
                            <Badge
                              className={
                                statusColors[
                                  instance.status as keyof typeof statusColors
                                ]
                              }
                            >
                              {instance.status}
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Started:{' '}
                            {new Date(instance.startedAt).toLocaleString()}
                          </div>
                          {instance.completedAt && (
                            <div className="text-sm text-muted-foreground">
                              Completed:{' '}
                              {new Date(instance.completedAt).toLocaleString()}
                            </div>
                          )}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            router.push(
                              `/dashboard/claims/${instance.claimId}`
                            )
                          }
                        >
                          View Claim
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 