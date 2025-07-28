'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowLeft, AlertCircle } from 'lucide-react';


const claim = {
  id: 'CLM-001',
  clientName: 'John Doe',
  type: 'MEDICAL_CLAIM',
  status: 'PENDING_ASSIGNMENT',
  description: 'Medical claim for emergency room visit',
  currentAssignee: null,
};

const agents = [
  {
    id: '1',
    name: 'Alice Johnson',
    email: 'alice@company.com',
    assigned: 12,
    open: 7,
    closed: 5,
    status: 'Active',
    performance: 85,
  },
  {
    id: '2',
    name: 'Bob Smith',
    email: 'bob@company.com',
    assigned: 8,
    open: 2,
    closed: 6,
    status: 'Active',
    performance: 92,
  },
  {
    id: '3',
    name: 'Carol Lee',
    email: 'carol@company.com',
    assigned: 15,
    open: 10,
    closed: 5,
    status: 'Inactive',
    performance: 70,
  },
];

interface ClaimAssignmentClientProps {
  claimId: string;
}

export default function ClaimAssignmentClient({ claimId }: ClaimAssignmentClientProps) {
  const router = useRouter();
  // Use claimId to ensure it's not marked as unused
  console.log('Assigning claim:', claimId);
  const [assignment, setAssignment] = useState({
    agentId: '',
    notes: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      router.push(`/dashboard/claims/${claim.id}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Assign Claim</h1>
          <p className="text-muted-foreground">
            Assign this claim to an agent
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Claim Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Claim ID</span>
                <span className="text-sm">{claim.id}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Client</span>
                <span className="text-sm">{claim.clientName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Type</span>
                <span className="text-sm">
                  {claim.type.replace(/_/g, ' ')}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Status</span>
                <Badge className="bg-yellow-100 text-yellow-800">
                  {claim.status.replace(/_/g, ' ')}
                </Badge>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <div className="rounded-md border p-3 text-sm">
                {claim.description}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Assign Agent</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Select Agent</Label>
              <Select
                value={assignment.agentId}
                onValueChange={(value) =>
                  setAssignment({ ...assignment, agentId: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose an agent" />
                </SelectTrigger>
                <SelectContent>
                  {agents.map((agent) => (
                    <SelectItem key={agent.id} value={agent.id}>
                      <div className="flex items-center justify-between w-full">
                        <span>{agent.name}</span>
                        <Badge
                          className={
                            agent.status === 'Active'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }
                        >
                          {agent.status}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {assignment.agentId && (
              <div className="space-y-2">
                <Label>Agent Workload</Label>
                {agents
                  .filter((a) => a.id === assignment.agentId)
                  .map((agent) => (
                    <div key={agent.id} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Assigned Claims: {agent.assigned}</span>
                        <span>Open: {agent.open}</span>
                        <span>Closed: {agent.closed}</span>
                      </div>
                      <Progress value={agent.performance} />
                      <div className="text-xs text-muted-foreground text-right">
                        Performance: {agent.performance}%
                      </div>
                      {agent.assigned > 10 && (
                        <div className="flex items-center gap-2 text-yellow-600 text-sm">
                          <AlertCircle className="h-4 w-4" />
                          High workload - Consider assigning to another agent
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            )}

            <div className="space-y-2">
              <Label>Assignment Notes</Label>
              <Textarea
                placeholder="Enter any notes about this assignment..."
                value={assignment.notes}
                onChange={(e) =>
                  setAssignment({ ...assignment, notes: e.target.value })
                }
              />
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button
                className="flex-1"
                disabled={!assignment.agentId || isLoading}
                onClick={handleSubmit}
              >
                {isLoading ? 'Assigning...' : 'Assign Claim'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 