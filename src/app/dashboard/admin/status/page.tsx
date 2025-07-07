'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const mockStatuses = [
  { name: 'Pending', color: 'bg-yellow-200', count: 5 },
  { name: 'In Review', color: 'bg-blue-200', count: 3 },
  { name: 'Approved', color: 'bg-green-200', count: 7 },
  { name: 'Rejected', color: 'bg-red-200', count: 2 },
];

export default function StatusManagementPage() {
  const [statuses, setStatuses] = useState(mockStatuses);
  const [newStatus, setNewStatus] = useState('');

  const addStatus = () => {
    if (newStatus) {
      setStatuses([...statuses, { name: newStatus, color: 'bg-gray-200', count: 0 }]);
      setNewStatus('');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Status Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Status</TableHead>
                <TableHead>Claims</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {statuses.map((status, idx) => (
                <TableRow key={idx}>
                  <TableCell>
                    <span className={`inline-block w-3 h-3 rounded-full mr-2 ${status.color}`}></span>
                    {status.name}
                  </TableCell>
                  <TableCell>{status.count}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex gap-2 mt-4">
            <input
              className="border rounded p-2 flex-1"
              placeholder="Add new status"
              value={newStatus}
              onChange={e => setNewStatus(e.target.value)}
            />
            <Button onClick={addStatus}>Add</Button>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Status Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="text-xs text-muted-foreground">
            {statuses.map((status, idx) => (
              <li key={idx}>{status.name}: {status.count} claims</li>
            ))}
          </ul>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Status Change Audit Trail</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="text-xs text-muted-foreground">
            <li>2024-06-01: CLAIM-201 status changed to Approved by Admin</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
} 