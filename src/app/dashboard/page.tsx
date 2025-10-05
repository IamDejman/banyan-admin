'use client';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  FileText,
  Clock
} from 'lucide-react';
import { NairaIcon } from '@/components/ui/naira-icon';
import {  getClaims, getDashboardMetrics } from '../services/dashboard';



const recentActivity = [
  {
    id: 1,
    action: 'New claim submitted',
    description: 'SET-2024-001 for ₦50,000',
    time: '15 Jan 2024 14:30',
    type: 'claim',
    user: 'John Doe',
    status: 'pending'
  },
  {
    id: 2,
    action: 'Document verified',
    description: 'Medical report for CLM-2024-089',
    time: '15 Jan 2024 14:15',
    type: 'document',
    user: 'Sarah K.',
    status: 'completed'
  },
  {
    id: 3,
    action: 'Settlement approved',
    description: 'Offer accepted for ₦25,000',
    time: '15 Jan 2024 13:30',
    type: 'settlement',
    user: 'Mike T.',
    status: 'completed'
  },
  {
    id: 4,
    action: 'User logged in',
    description: 'Sarah K. accessed the system',
    time: '15 Jan 2024 14:10',
    type: 'login',
    user: 'Sarah K.',
    status: 'info'
  },
  {
    id: 5,
    action: 'Assessment completed',
    description: 'Property damage assessment for CLM-2024-090',
    time: '15 Jan 2024 12:30',
    type: 'assessment',
    user: 'David L.',
    status: 'completed'
  },
  {
    id: 6,
    action: 'Payment processed',
    description: 'Settlement payment of ₦35,000 completed',
    time: '15 Jan 2024 11:30',
    type: 'payment',
    user: 'Lisa M.',
    status: 'completed'
  },
];



export default function DashboardPage() {
  const [dashboardStats, setDashboardStats] = useState({
    total_claims: 0,
    pending_review: 0,
    approved: 0,
    settled_claims: 0
  });

  useEffect(() => {
    console.log("fetching metrics__");
    getDashboardMetrics().then((res: unknown) => {
      setDashboardStats(res as { total_claims: number; pending_review: number; approved: number; settled_claims: number; });
      console.log(res, "res__111");
    });
    // getClaimsStatistics ().then((res) => {
    //   console.log(res, "res__");
    // });
    getClaims().then((res) => {
      console.log(res, "res__");
    });
  }, []);
  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-0">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Dashboard</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-bold truncate">Total Claims</p>
                <p className="text-lg sm:text-2xl font-bold truncate">{dashboardStats.total_claims}</p>
              </div>
              <div className="h-8 w-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 ml-2">
                <FileText className="h-4 w-4 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-bold truncate">Pending Review</p>
                <p className="text-lg sm:text-2xl font-bold truncate">{dashboardStats.pending_review}</p>
              </div>
              <div className="h-8 w-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 ml-2">
                <Clock className="h-4 w-4 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-bold truncate">Approved</p>
                <p className="text-lg sm:text-2xl font-bold truncate">{dashboardStats.approved}</p>
              </div>
              <div className="h-8 w-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 ml-2">
                <FileText className="h-4 w-4 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-bold truncate">Settlements</p>
                <p className="text-lg sm:text-2xl font-bold truncate">{dashboardStats.settled_claims}</p>
              </div>
              <div className="h-8 w-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 ml-2">
                <NairaIcon className="h-4 w-4 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-lg sm:text-xl">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="p-0 sm:p-6">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Action</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Timestamp</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentActivity.map((activity) => (
                  <TableRow key={activity.id}>
                    <TableCell className="font-medium">{activity.action}</TableCell>
                    <TableCell>{activity.description}</TableCell>
                    <TableCell>{activity.user}</TableCell>
                    <TableCell className="text-muted-foreground text-xs sm:text-sm">{activity.time}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Activity Cards */}
          <div className="sm:hidden space-y-3 mt-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="border rounded-lg p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm">{activity.action}</span>
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                </div>
                <p className="text-sm text-muted-foreground">{activity.description}</p>
                <div className="text-xs text-muted-foreground">
                  <span>{activity.user}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 