'use client';

import { useState } from 'react';
import { Workflow, WorkflowStep, WorkflowStepType, ApprovalLevel } from '@/lib/types/workflow';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, ArrowUp, ArrowDown, Settings } from 'lucide-react';

interface WorkflowEditorProps {
  workflow: Workflow;
  onSave: (workflow: Workflow) => void;
}

export function WorkflowEditor({ workflow: initialWorkflow, onSave }: WorkflowEditorProps) {
  const [workflow, setWorkflow] = useState<Workflow>(initialWorkflow);
  const [editingStep, setEditingStep] = useState<WorkflowStep | null>(null);

  const handleAddStep = () => {
    const newStep: WorkflowStep = {
      id: `step-${Date.now()}`,
      name: 'New Step',
      type: 'REVIEW',
      description: '',
      order: workflow.steps.length + 1,
      required: true,
      approvers: [],
      approvalLevel: 'SINGLE',
    };
    setWorkflow({
      ...workflow,
      steps: [...workflow.steps, newStep],
    });
    setEditingStep(newStep);
  };

  const handleUpdateStep = (updatedStep: WorkflowStep) => {
    setWorkflow({
      ...workflow,
      steps: workflow.steps.map((step) =>
        step.id === updatedStep.id ? updatedStep : step
      ),
    });
    setEditingStep(null);
  };

  const handleDeleteStep = (stepId: string) => {
    setWorkflow({
      ...workflow,
      steps: workflow.steps.filter((step) => step.id !== stepId),
    });
  };

  const handleMoveStep = (stepId: string, direction: 'up' | 'down') => {
    const currentIndex = workflow.steps.findIndex((step) => step.id === stepId);
    if (
      (direction === 'up' && currentIndex === 0) ||
      (direction === 'down' && currentIndex === workflow.steps.length - 1)
    ) {
      return;
    }

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    const newSteps = [...workflow.steps];
    const [movedStep] = newSteps.splice(currentIndex, 1);
    newSteps.splice(newIndex, 0, movedStep);

    setWorkflow({
      ...workflow,
      steps: newSteps.map((step, index) => ({
        ...step,
        order: index + 1,
      })),
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Workflow Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input
              value={workflow.name}
              onChange={(e) =>
                setWorkflow({ ...workflow, name: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={workflow.description}
              onChange={(e) =>
                setWorkflow({ ...workflow, description: e.target.value })
              }
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Workflow Steps</CardTitle>
          <Button onClick={handleAddStep}>
            <Plus className="h-4 w-4 mr-2" />
            Add Step
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {workflow.steps.map((step) => (
            <Card key={step.id}>
              <CardContent className="p-4">
                {editingStep?.id === step.id ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Step Name</Label>
                      <Input
                        value={step.name}
                        onChange={(e) =>
                          handleUpdateStep({
                            ...step,
                            name: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Type</Label>
                      <Select
                        value={step.type}
                        onValueChange={(value: WorkflowStepType) =>
                          handleUpdateStep({
                            ...step,
                            type: value,
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="REVIEW">Review</SelectItem>
                          <SelectItem value="APPROVAL">Approval</SelectItem>
                          <SelectItem value="NOTIFICATION">Notification</SelectItem>
                          <SelectItem value="DOCUMENT_COLLECTION">
                            Document Collection
                          </SelectItem>
                          <SelectItem value="ASSESSMENT">Assessment</SelectItem>
                          <SelectItem value="SETTLEMENT">Settlement</SelectItem>
                          <SelectItem value="CUSTOM">Custom</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea
                        value={step.description}
                        onChange={(e) =>
                          handleUpdateStep({
                            ...step,
                            description: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Approval Level</Label>
                      <Select
                        value={step.approvalLevel}
                        onValueChange={(value: ApprovalLevel) =>
                          handleUpdateStep({
                            ...step,
                            approvalLevel: value,
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="SINGLE">Single Approver</SelectItem>
                          <SelectItem value="MULTI">Multiple Approvers</SelectItem>
                          <SelectItem value="PARALLEL">Parallel Approval</SelectItem>
                          <SelectItem value="SEQUENTIAL">
                            Sequential Approval
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setEditingStep(null)}
                      >
                        Cancel
                      </Button>
                      <Button onClick={() => handleUpdateStep(step)}>Save</Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{step.name}</h3>
                        <Badge variant="secondary">{step.type}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {step.description}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>Order: {step.order}</span>
                        <span>Approval: {step.approvalLevel}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleMoveStep(step.id, 'up')}
                        disabled={step.order === 1}
                      >
                        <ArrowUp className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleMoveStep(step.id, 'down')}
                        disabled={step.order === workflow.steps.length}
                      >
                        <ArrowDown className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingStep(step)}
                      >
                        <Settings className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteStep(step.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => onSave(workflow)}>
          Save Workflow
        </Button>
      </div>
    </div>
  );
} 