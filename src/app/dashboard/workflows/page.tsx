'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Settings, Trash2, ArrowRight } from 'lucide-react';
import { Workflow, WorkflowStatus, WorkflowStepType, ApprovalLevel } from '@/lib/types/workflow';

// Mock data
const workflows: Workflow[] = [
  {
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
  },
];

const statusColors = {
  ACTIVE: 'bg-green-100 text-green-800',
  DRAFT: 'bg-yellow-100 text-yellow-800',
  INACTIVE: 'bg-gray-100 text-gray-800',
  ARCHIVED: 'bg-red-100 text-red-800',
};

export default function WorkflowsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('list');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredWorkflows = workflows.filter((workflow) =>
    workflow.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">Workflow Management</h1>
        <Button onClick={() => router.push('/dashboard/workflows/new')}>
          <Plus className="h-4 w-4 mr-2" />
          Create Workflow
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="list">Workflows</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          <div className="flex items-center gap-4">
            <Input
              placeholder="Search workflows..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <div className="grid gap-4">
            {filteredWorkflows.map((workflow) => (
              <Card key={workflow.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-medium">{workflow.name}</h3>
                        <Badge
                          className={
                            statusColors[workflow.status as keyof typeof statusColors]
                          }
                        >
                          {workflow.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {workflow.description}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Version: {workflow.version}</span>
                        <span>Steps: {workflow.steps.length}</span>
                        <span>
                          Last updated:{' '}
                          {new Date(workflow.updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          router.push(`/dashboard/workflows/${workflow.id}`)
                        }
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Configure
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          router.push(`/dashboard/workflows/${workflow.id}/edit`)
                        }
                      >
                        <ArrowRight className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Workflow Templates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium">Standard Claim Review</h4>
                  <p className="text-sm text-muted-foreground">
                    Basic workflow for standard claim review process
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => router.push('/dashboard/workflows/new?template=standard')}
                  >
                    Use Template
                  </Button>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium">High-Value Claim Review</h4>
                  <p className="text-sm text-muted-foreground">
                    Enhanced workflow for high-value claims with multiple approval levels
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => router.push('/dashboard/workflows/new?template=high-value')}
                  >
                    Use Template
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 