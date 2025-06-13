'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { CalendarIcon, Search, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

// Mock data
const claims = [
  {
    id: 'CLM-001',
    clientName: 'John Doe',
    submissionDate: '2024-03-15',
    status: 'PENDING',
    type: 'AUTO',
    documentCompletion: 75,
    priority: 'HIGH',
    assignedTo: 'Sarah Wilson',
    lastUpdated: '2024-03-15 14:30',
  },
  {
    id: 'CLM-002',
    clientName: 'Jane Smith',
    submissionDate: '2024-03-14',
    status: 'IN_REVIEW',
    type: 'PROPERTY',
    documentCompletion: 100,
    priority: 'MEDIUM',
    assignedTo: 'Mike Johnson',
    lastUpdated: '2024-03-14 16:45',
  },
  {
    id: 'CLM-003',
    clientName: 'Robert Johnson',
    submissionDate: '2024-03-13',
    status: 'PENDING',
    type: 'HEALTH',
    documentCompletion: 50,
    priority: 'HIGH',
    assignedTo: 'Unassigned',
    lastUpdated: '2024-03-13 09:15',
  },
  {
    id: 'CLM-004',
    clientName: 'Sarah Williams',
    submissionDate: '2024-03-12',
    status: 'IN_REVIEW',
    type: 'AUTO',
    documentCompletion: 90,
    priority: 'LOW',
    assignedTo: 'David Brown',
    lastUpdated: '2024-03-12 11:20',
  },
];

const statusColors = {
  PENDING: 'bg-yellow-500',
  IN_REVIEW: 'bg-blue-500',
  APPROVED: 'bg-green-500',
  REJECTED: 'bg-red-500',
};

const priorityColors = {
  HIGH: 'bg-red-500',
  MEDIUM: 'bg-yellow-500',
  LOW: 'bg-green-500',
};

export default function ClaimsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });
  const [showFilters, setShowFilters] = useState(false);

  const filteredClaims = claims.filter((claim) => {
    const matchesSearch =
      claim.id.toLowerCase().includes(search.toLowerCase()) ||
      claim.clientName.toLowerCase().includes(search.toLowerCase()) ||
      claim.assignedTo.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'all' || claim.status === statusFilter;
    const matchesType = typeFilter === 'all' || claim.type === typeFilter;
    const matchesPriority = priorityFilter === 'all' || claim.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesType && matchesPriority;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Claims</h1>
          <p className="text-muted-foreground">
            Manage and review insurance claims
          </p>
        </div>
        <Button>New Claim</Button>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search claims by ID, client name, or agent..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="gap-2"
          >
            <Filter className="h-4 w-4" />
            Filters
            {showFilters ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </div>

        {showFilters && (
          <div className="grid gap-4 p-4 border rounded-lg bg-card">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="IN_REVIEW">In Review</SelectItem>
                    <SelectItem value="APPROVED">Approved</SelectItem>
                    <SelectItem value="REJECTED">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Claim Type</label>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="AUTO">Auto</SelectItem>
                    <SelectItem value="PROPERTY">Property</SelectItem>
                    <SelectItem value="HEALTH">Health</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Priority</label>
                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priorities</SelectItem>
                    <SelectItem value="HIGH">High</SelectItem>
                    <SelectItem value="MEDIUM">Medium</SelectItem>
                    <SelectItem value="LOW">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Date Range</label>
                <div className="flex gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          'w-full justify-start text-left font-normal',
                          !dateRange.from && 'text-muted-foreground'
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateRange.from ? (
                          format(dateRange.from, 'PPP')
                        ) : (
                          <span>From date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={dateRange.from}
                        onSelect={(date) =>
                          setDateRange((prev) => ({ ...prev, from: date }))
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          'w-full justify-start text-left font-normal',
                          !dateRange.to && 'text-muted-foreground'
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateRange.to ? (
                          format(dateRange.to, 'PPP')
                        ) : (
                          <span>To date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={dateRange.to}
                        onSelect={(date) =>
                          setDateRange((prev) => ({ ...prev, to: date }))
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Mobile view */}
        <div className="space-y-4 md:hidden">
          {filteredClaims.map((claim) => (
            <div
              key={claim.id}
              className="p-4 border rounded-lg space-y-3 bg-card"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">{claim.id}</h3>
                  <p className="text-sm text-muted-foreground">
                    {claim.clientName}
                  </p>
                </div>
                <Badge
                  className={cn(
                    'capitalize',
                    statusColors[claim.status as keyof typeof statusColors]
                  )}
                >
                  {claim.status.toLowerCase().replace('_', ' ')}
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-muted-foreground">Type</p>
                  <p>{claim.type}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Priority</p>
                  <Badge
                    variant="secondary"
                    className={cn(
                      'capitalize',
                      priorityColors[claim.priority as keyof typeof priorityColors]
                    )}
                  >
                    {claim.priority.toLowerCase()}
                  </Badge>
                </div>
                <div>
                  <p className="text-muted-foreground">Documents</p>
                  <p>{claim.documentCompletion}%</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Assigned To</p>
                  <p>{claim.assignedTo}</p>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm">
                  View Details
                </Button>
                <Button size="sm">Review</Button>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop view */}
        <div className="hidden md:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Claim ID</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Documents</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClaims.map((claim) => (
                <TableRow key={claim.id}>
                  <TableCell className="font-medium">{claim.id}</TableCell>
                  <TableCell>{claim.clientName}</TableCell>
                  <TableCell>
                    <Badge
                      className={cn(
                        'capitalize',
                        statusColors[claim.status as keyof typeof statusColors]
                      )}
                    >
                      {claim.status.toLowerCase().replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>{claim.type}</TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={cn(
                        'capitalize',
                        priorityColors[claim.priority as keyof typeof priorityColors]
                      )}
                    >
                      {claim.priority.toLowerCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>{claim.documentCompletion}%</TableCell>
                  <TableCell>{claim.assignedTo}</TableCell>
                  <TableCell>{claim.lastUpdated}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                      <Button size="sm">Review</Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
} 