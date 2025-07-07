'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Clock, 
  FileText, 
  AlertCircle, 
  Search, 
  Filter,
  Calendar,
  User,
  Download,
  Eye,
  CheckSquare,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import Link from 'next/link';

// Mock data for demonstration
const mockClaims = [
  {
    id: 'CLM-001',
    clientName: 'John Smith',
    submissionDate: '2024-01-15',
    claimType: 'Property Damage',
    documentStatus: 85,
    priority: 'High',
    status: 'Pending Review',
    estimatedValue: 25000,
  },
  {
    id: 'CLM-002',
    clientName: 'Sarah Johnson',
    submissionDate: '2024-01-14',
    claimType: 'Auto Accident',
    documentStatus: 60,
    priority: 'Medium',
    status: 'Pending Review',
    estimatedValue: 15000,
  },
  {
    id: 'CLM-003',
    clientName: 'Mike Wilson',
    submissionDate: '2024-01-13',
    claimType: 'Medical',
    documentStatus: 100,
    priority: 'Low',
    status: 'Pending Review',
    estimatedValue: 8000,
  },
  {
    id: 'CLM-004',
    clientName: 'Lisa Brown',
    submissionDate: '2024-01-12',
    claimType: 'Property Damage',
    documentStatus: 45,
    priority: 'High',
    status: 'Pending Review',
    estimatedValue: 35000,
  },
  {
    id: 'CLM-005',
    clientName: 'David Lee',
    submissionDate: '2024-01-11',
    claimType: 'Auto Accident',
    documentStatus: 90,
    priority: 'Medium',
    status: 'Pending Review',
    estimatedValue: 12000,
  },
];

const quickStats = [
  {
    title: 'Total Pending Claims',
    value: '42',
    icon: Clock,
    description: 'Requires review',
    trend: '+5 from yesterday',
    trendUp: true,
  },
  {
    title: 'Average Review Time',
    value: '2.3 days',
    icon: Calendar,
    description: 'Last 30 days',
    trend: '-0.5 days',
    trendUp: false,
  },
  {
    title: 'Document Completion',
    value: '78%',
    icon: FileText,
    description: 'Average across claims',
    trend: '+3%',
    trendUp: true,
  },
  {
    title: 'High Priority Claims',
    value: '8',
    icon: AlertCircle,
    description: 'Require immediate attention',
    trend: '+2',
    trendUp: true,
  },
];

const claimTypes = [
  { label: 'Property Damage', value: 'property', count: 15 },
  { label: 'Auto Accident', value: 'auto', count: 12 },
  { label: 'Medical', value: 'medical', count: 8 },
  { label: 'Liability', value: 'liability', count: 7 },
];

export default function ClaimsReviewPage() {
  const [sortField, setSortField] = useState<string>('submissionDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [selectedClaims, setSelectedClaims] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    dateRange: 'all',
    claimType: 'all',
    documentStatus: 'all',
    priority: 'all',
  });

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleSelectClaim = (claimId: string) => {
    setSelectedClaims(prev => 
      prev.includes(claimId) 
        ? prev.filter(id => id !== claimId)
        : [...prev, claimId]
    );
  };

  const handleSelectAll = () => {
    if (selectedClaims.length === mockClaims.length) {
      setSelectedClaims([]);
    } else {
      setSelectedClaims(mockClaims.map(claim => claim.id));
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDocumentStatusColor = (status: number) => {
    if (status >= 80) return 'text-green-600';
    if (status >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Claims Review</h1>
          <p className="text-muted-foreground">
            Handle initial claim processing and review workflow
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button size="sm">
            <CheckSquare className="h-4 w-4 mr-2" />
            Batch Review
          </Button>
        </div>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {quickStats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
                <div className={`flex items-center text-xs ${stat.trendUp ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.trend}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Claims by Type Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Claims by Type</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {claimTypes.map((type) => (
              <div key={type.value} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">{type.label}</p>
                  <p className="text-sm text-muted-foreground">{type.count} claims</p>
                </div>
                <div className="text-2xl font-bold text-primary">{type.count}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Pending Review Claims</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:gap-4">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search claims..."
                  className="pl-8 w-full lg:w-64"
                />
              </div>
              <Select value={filters.dateRange} onValueChange={(value) => setFilters(prev => ({ ...prev, dateRange: value }))}>
                <SelectTrigger className="w-full lg:w-40">
                  <SelectValue placeholder="Date Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filters.claimType} onValueChange={(value) => setFilters(prev => ({ ...prev, claimType: value }))}>
                <SelectTrigger className="w-full lg:w-40">
                  <SelectValue placeholder="Claim Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="property">Property Damage</SelectItem>
                  <SelectItem value="auto">Auto Accident</SelectItem>
                  <SelectItem value="medical">Medical</SelectItem>
                  <SelectItem value="liability">Liability</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filters.priority} onValueChange={(value) => setFilters(prev => ({ ...prev, priority: value }))}>
                <SelectTrigger className="w-full lg:w-40">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                More Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Claims Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <input
                    type="checkbox"
                    checked={selectedClaims.length === mockClaims.length}
                    onChange={handleSelectAll}
                    className="rounded"
                  />
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort('id')}
                    className="h-auto p-0 font-medium"
                  >
                    Claim ID
                    {sortField === 'id' && (
                      sortDirection === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                    )}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort('clientName')}
                    className="h-auto p-0 font-medium"
                  >
                    Client Name
                    {sortField === 'clientName' && (
                      sortDirection === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                    )}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort('submissionDate')}
                    className="h-auto p-0 font-medium"
                  >
                    Submission Date
                    {sortField === 'submissionDate' && (
                      sortDirection === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                    )}
                  </Button>
                </TableHead>
                <TableHead>Claim Type</TableHead>
                <TableHead>Document Status</TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort('priority')}
                    className="h-auto p-0 font-medium"
                  >
                    Priority
                    {sortField === 'priority' && (
                      sortDirection === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                    )}
                  </Button>
                </TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockClaims.map((claim) => (
                <TableRow key={claim.id}>
                  <TableCell>
                    <input
                      type="checkbox"
                      checked={selectedClaims.includes(claim.id)}
                      onChange={() => handleSelectClaim(claim.id)}
                      className="rounded"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{claim.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      {claim.clientName}
                    </div>
                  </TableCell>
                  <TableCell>{claim.submissionDate}</TableCell>
                  <TableCell>{claim.claimType}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className={`text-sm font-medium ${getDocumentStatusColor(claim.documentStatus)}`}>
                          {claim.documentStatus}%
                        </span>
                      </div>
                      <Progress value={claim.documentStatus} className="h-2" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getPriorityColor(claim.priority)}>
                      {claim.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/dashboard/claims/review/${claim.id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/dashboard/claims/complete/${claim.id}`}>
                          <CheckSquare className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Batch Actions */}
      {selectedClaims.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {selectedClaims.length} claim(s) selected
              </p>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  Assign to Agent
                </Button>
                <Button variant="outline" size="sm">
                  Mark as Reviewed
                </Button>
                <Button size="sm">
                  Batch Process
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 