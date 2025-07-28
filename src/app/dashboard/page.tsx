'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  FileText, 
  User, 
  AlertCircle, 
  Clock 
} from 'lucide-react';
import { formatNairaCompact } from '@/lib/utils';
import { NairaIcon } from '@/components/ui/naira-icon';

const stats = [
  {
    title: 'Total Claims',
    value: '1,234',
    icon: FileText,
    description: 'All time claims',
    trend: '+12%',
    trendUp: true,
  },
  {
    title: 'Pending Review',
    value: '42',
    icon: Clock,
    description: 'Requires attention',
    trend: '-5%',
    trendUp: false,
  },
  {
    title: 'Approved',
    value: '892',
    icon: FileText,
    description: 'This month',
    trend: '+8%',
    trendUp: true,
  },
  {
    title: 'Settlements',
    value: formatNairaCompact(156000000), // ₦156M
    icon: NairaIcon,
    description: 'Active settlements',
    trend: '+15%',
    trendUp: true,
  },
];

const recentActivity = [
  {
    id: 1,
    action: 'New claim submitted',
    description: 'SET-2024-001 for ₦50,000',
    time: '5 minutes ago',
    type: 'claim',
    user: 'John Doe',
    status: 'pending'
  },
  {
    id: 2,
    action: 'Document verified',
    description: 'Medical report for CLM-2024-089',
    time: '15 minutes ago',
    type: 'document',
    user: 'Sarah K.',
    status: 'completed'
  },
  {
    id: 3,
    action: 'Settlement approved',
    description: 'Offer accepted for ₦25,000',
    time: '1 hour ago',
    type: 'settlement',
    user: 'Mike T.',
    status: 'completed'
  },
  {
    id: 4,
    action: 'User logged in',
    description: 'Sarah K. accessed the system',
    time: '20 minutes ago',
    type: 'login',
    user: 'Sarah K.',
    status: 'info'
  },
  {
    id: 5,
    action: 'Assessment completed',
    description: 'Property damage assessment for CLM-2024-090',
    time: '2 hours ago',
    type: 'assessment',
    user: 'David L.',
    status: 'completed'
  },
  {
    id: 6,
    action: 'Payment processed',
    description: 'Settlement payment of ₦35,000 completed',
    time: '3 hours ago',
    type: 'payment',
    user: 'Lisa M.',
    status: 'completed'
  },
];

const getActivityIcon = (type: string) => {
  switch (type) {
    case 'claim':
      return <FileText className="h-4 w-4" />;
    case 'document':
      return <FileText className="h-4 w-4" />;
    case 'settlement':
      return <NairaIcon className="h-4 w-4" />;
    case 'login':
      return <User className="h-4 w-4" />;
    case 'assessment':
      return <NairaIcon className="h-4 w-4" />;
    case 'payment':
      return <NairaIcon className="h-4 w-4" />;
    default:
      return <AlertCircle className="h-4 w-4" />;
  }
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'completed':
      return <Badge variant="default" className="bg-green-100 text-green-800">Completed</Badge>;
    case 'pending':
      return <Badge variant="secondary">Pending</Badge>;
    case 'info':
      return <Badge variant="outline">Info</Badge>;
    default:
      return <Badge variant="outline">Info</Badge>;
  }
};

export default function DashboardPage() {
  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-0">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Dashboard</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">{stat.title}</p>
                  <p className="text-lg sm:text-2xl font-bold truncate">{stat.value}</p>
                  <p className="text-xs text-muted-foreground truncate">{stat.description}</p>
                </div>
                <div className="h-8 w-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 ml-2">
                  <stat.icon className="h-4 w-4 text-primary" />
                </div>
              </div>
              <div className="flex items-center mt-2">
                <TrendingUp className={`h-3 w-3 mr-1 ${stat.trendUp ? 'text-green-500' : 'text-red-500'}`} />
                <span className={`text-xs ${stat.trendUp ? 'text-green-500' : 'text-red-500'}`}>
                  {stat.trend}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
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
                  <TableHead className="w-12 sm:w-auto">Type</TableHead>
                  <TableHead className="hidden sm:table-cell">Action</TableHead>
                  <TableHead className="hidden sm:table-cell">Description</TableHead>
                  <TableHead className="hidden md:table-cell">User</TableHead>
                  <TableHead className="hidden sm:table-cell">Status</TableHead>
                  <TableHead className="w-20 sm:w-auto">Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentActivity.map((activity) => (
                  <TableRow key={activity.id}>
                    <TableCell className="w-12 sm:w-auto">
                      <div className="flex items-center">
                        {getActivityIcon(activity.type)}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium hidden sm:table-cell">{activity.action}</TableCell>
                    <TableCell className="hidden sm:table-cell">{activity.description}</TableCell>
                    <TableCell className="hidden md:table-cell">{activity.user}</TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {getStatusBadge(activity.status)}
                    </TableCell>
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
                  <div className="flex items-center gap-2">
                    {getActivityIcon(activity.type)}
                    <span className="font-medium text-sm">{activity.action}</span>
                  </div>
                  {getStatusBadge(activity.status)}
                </div>
                <p className="text-sm text-muted-foreground">{activity.description}</p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{activity.user}</span>
                  <span>{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 