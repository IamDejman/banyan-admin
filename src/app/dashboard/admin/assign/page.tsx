'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const mockClaims = [
  { id: 'CLAIM-201', type: 'Property', assignedTo: null },
  { id: 'CLAIM-202', type: 'Medical', assignedTo: null },
  { id: 'CLAIM-203', type: 'Auto', assignedTo: 'Agent A' },
];
const mockAgents = ['Agent A', 'Agent B', 'Agent C'];

export default function AssignClaimsPage() {
  const [selectedClaims, setSelectedClaims] = useState<string[]>([]);
  const [selectedAgent, setSelectedAgent] = useState('');

  const assignClaims = () => {
    // No API, just mock
    alert(`Assigned ${selectedClaims.length} claim(s) to ${selectedAgent}`);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Claim Assignment</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead></TableHead>
                <TableHead>Claim ID</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Assigned To</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockClaims.map((claim) => (
                <TableRow key={claim.id}>
                  <TableCell>
                    <input
                      type="checkbox"
                      checked={selectedClaims.includes(claim.id)}
                      onChange={e => {
                        if (e.target.checked) setSelectedClaims([...selectedClaims, claim.id]);
                        else setSelectedClaims(selectedClaims.filter(id => id !== claim.id));
                      }}
                    />
                  </TableCell>
                  <TableCell>{claim.id}</TableCell>
                  <TableCell>{claim.type}</TableCell>
                  <TableCell>{claim.assignedTo || <span className="text-muted-foreground">Unassigned</span>}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex items-center gap-2 mt-4">
            <select className="border rounded p-2" value={selectedAgent} onChange={e => setSelectedAgent(e.target.value)}>
              <option value="">Select Agent</option>
              {mockAgents.map(agent => <option key={agent} value={agent}>{agent}</option>)}
            </select>
            <Button onClick={assignClaims} disabled={!selectedAgent || selectedClaims.length === 0}>Assign Selected</Button>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Workload Visualization</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="text-sm">
            {mockAgents.map(agent => (
              <li key={agent}>{agent}: {mockClaims.filter(c => c.assignedTo === agent).length} claims</li>
            ))}
          </ul>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Assignment Audit Trail</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="text-xs text-muted-foreground">
            <li>2024-06-01: CLAIM-203 assigned to Agent A by Admin</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
} 