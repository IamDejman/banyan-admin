'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const mockAgents = [
  { name: 'Agent A', assigned: 5, completed: 3 },
  { name: 'Agent B', assigned: 2, completed: 2 },
  { name: 'Agent C', assigned: 4, completed: 1 },
];

export default function AgentWorkloadPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Agent Workload Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Agent</TableHead>
                <TableHead>Assigned Claims</TableHead>
                <TableHead>Completed Claims</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockAgents.map(agent => (
                <TableRow key={agent.name}>
                  <TableCell>{agent.name}</TableCell>
                  <TableCell>{agent.assigned}</TableCell>
                  <TableCell>{agent.completed}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Rebalancing Tools</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Rebalance assignments between agents to optimize workload. (UI only, no API)</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Assignment History</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="text-xs text-muted-foreground">
            <li>2024-06-01: Agent A assigned 2 new claims</li>
            <li>2024-06-02: Agent B completed 1 claim</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
} 