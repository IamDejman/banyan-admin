'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/components/ui/use-toast';
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  Settings,
  RefreshCw,
} from 'lucide-react';

// Mock data for validation rules
const validationRules = [
  {
    id: '1',
    name: 'Claim Amount Format',
    description: 'Validates that claim amounts are in correct currency format',
    type: 'format',
    status: 'active',
    lastRun: '2024-03-15 10:00',
  },
  {
    id: '2',
    name: 'Required Documents',
    description: 'Ensures all required documents are present for claim type',
    type: 'completeness',
    status: 'active',
    lastRun: '2024-03-15 10:00',
  },
  {
    id: '3',
    name: 'Client Information',
    description: 'Validates client contact information and identification',
    type: 'data',
    status: 'inactive',
    lastRun: '2024-03-14 15:30',
  },
];

// Mock data for validation results
const validationResults = [
  {
    id: '1',
    claimId: 'CLM-001',
    rule: 'Claim Amount Format',
    status: 'passed',
    message: 'Amount format is valid',
    timestamp: '2024-03-15 10:00',
  },
  {
    id: '2',
    claimId: 'CLM-002',
    rule: 'Required Documents',
    status: 'failed',
    message: 'Missing medical report',
    timestamp: '2024-03-15 09:30',
  },
  {
    id: '3',
    claimId: 'CLM-003',
    rule: 'Client Information',
    status: 'warning',
    message: 'Incomplete address information',
    timestamp: '2024-03-15 09:00',
  },
];

const statusColors = {
  active: 'bg-green-100 text-green-800',
  inactive: 'bg-gray-100 text-gray-800',
  passed: 'bg-green-100 text-green-800',
  failed: 'bg-red-100 text-red-800',
  warning: 'bg-yellow-100 text-yellow-800',
};

export default function ValidationPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('rules');

  const handleRunValidation = (ruleId: string) => {
    toast({
      title: 'Validation started',
      description: 'Running validation rule...',
    });
  };

  const handleToggleRule = (ruleId: string) => {
    toast({
      title: 'Rule status updated',
      description: 'Validation rule status has been updated.',
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Data Validation</h1>
        <p className="text-muted-foreground">
          Manage validation rules and view validation results
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="rules">Validation Rules</TabsTrigger>
          <TabsTrigger value="results">Validation Results</TabsTrigger>
        </TabsList>

        <TabsContent value="rules" className="space-y-4">
          {validationRules.map((rule) => (
            <Card key={rule.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="font-medium">{rule.name}</div>
                      <Badge
                        variant="secondary"
                        className={
                          statusColors[rule.status as keyof typeof statusColors]
                        }
                      >
                        {rule.status}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {rule.description}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Last run: {rule.lastRun}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRunValidation(rule.id)}
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Run
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleRule(rule.id)}
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      {rule.status === 'active' ? 'Deactivate' : 'Activate'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="results" className="space-y-4">
          {validationResults.map((result) => (
            <Card key={result.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div
                      className={`p-2 rounded-full ${
                        statusColors[result.status as keyof typeof statusColors]
                      }`}
                    >
                      {result.status === 'passed' && (
                        <CheckCircle2 className="h-5 w-5" />
                      )}
                      {result.status === 'failed' && (
                        <XCircle className="h-5 w-5" />
                      )}
                      {result.status === 'warning' && (
                        <AlertCircle className="h-5 w-5" />
                      )}
                    </div>
                    <div className="space-y-1">
                      <div className="font-medium">
                        {result.claimId} - {result.rule}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {result.message}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {result.timestamp}
                      </div>
                    </div>
                  </div>
                  <Badge
                    variant="secondary"
                    className={
                      statusColors[result.status as keyof typeof statusColors]
                    }
                  >
                    {result.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
} 