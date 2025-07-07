'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, DollarSign, CheckCircle, MessageSquare, ClipboardList } from 'lucide-react';

// Mock stats and data
const quickStats = [
  { title: 'Active Offers', value: '12', icon: DollarSign, description: 'Currently open offers', trend: '+2', trendUp: true },
  { title: 'Pending Approvals', value: '5', icon: CheckCircle, description: 'Awaiting admin approval', trend: '+1', trendUp: true },
  { title: 'Counter-Offers Received', value: '3', icon: MessageSquare, description: 'Client counter-offers', trend: '0', trendUp: false },
  { title: 'Settlements in Progress', value: '8', icon: ClipboardList, description: 'Ongoing settlements', trend: '-1', trendUp: false },
];

export default function SettlementsPage() {
  const [activeTab, setActiveTab] = useState('create');
  const [searchQuery, setSearchQuery] = useState('');
  const [claimType, setClaimType] = useState<string>('all');
  const [offerStatus, setOfferStatus] = useState<string>('all');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settlement Management</h1>
        <p className="text-muted-foreground">Complete settlement offer and payment workflow</p>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {quickStats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">{stat.description}</p>
                <div className={`flex items-center text-xs ${stat.trendUp ? 'text-green-600' : 'text-red-600'}`}>{stat.trend}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">Settlement Offers Management</h1>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 w-full sm:w-64"
            />
          </div>
          {activeTab === 'claims' ? (
            <Select value={claimType} onValueChange={setClaimType}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Claim Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="MEDICAL_CLAIM">Medical Claim</SelectItem>
                <SelectItem value="PROPERTY_CLAIM">Property Claim</SelectItem>
              </SelectContent>
            </Select>
          ) : (
            <Select value={offerStatus} onValueChange={setOfferStatus}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Offer Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="PENDING_APPROVAL">Pending Approval</SelectItem>
                <SelectItem value="APPROVED">Approved</SelectItem>
                <SelectItem value="REJECTED">Rejected</SelectItem>
                <SelectItem value="ACCEPTED">Accepted</SelectItem>
                <SelectItem value="DECLINED">Declined</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="create">Create Offers</TabsTrigger>
          <TabsTrigger value="approve">Approve Offers</TabsTrigger>
          <TabsTrigger value="present">Present Offers</TabsTrigger>
          <TabsTrigger value="manage">Manage Offers</TabsTrigger>
          <TabsTrigger value="process">Process Settlements</TabsTrigger>
        </TabsList>

        <TabsContent value="create">
          <Card>
            <CardHeader>
              <CardTitle>Offer Creation</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Assessment-based offer calculator, breakdown builder, T&C templates, expiry, fee config */}
              <p className="text-muted-foreground">Assessment-based offer calculator, breakdown builder, terms and conditions templates, expiry date management, fee structure configuration.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="approve">
          <Card>
            <CardHeader>
              <CardTitle>Offer Approval</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Approval workflow, side-by-side assessment/offer, modification, approval history */}
              <p className="text-muted-foreground">Approval workflow based on amount and admin role, side-by-side comparison of assessment vs. offer, modification tools, approval history tracking.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="present">
          <Card>
            <CardHeader>
              <CardTitle>Offer Presentation</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Presentation method, document attachment, communication templates, delivery tracking */}
              <p className="text-muted-foreground">Presentation method selection, document attachment system, client communication templates, delivery confirmation tracking.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="manage">
          <Card>
            <CardHeader>
              <CardTitle>Offer Management</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Pending responses, counter-offers, counter-offer response */}
              <p className="text-muted-foreground">Pending responses (expiry tracking, reminders, status), counter-offers (comparison tools, evaluation, recommendations), counter-offer response (response type, justification, new offer workflow).</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="process">
          <Card>
            <CardHeader>
              <CardTitle>Settlement Processing</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Finalization, payment, completion */}
              <p className="text-muted-foreground">Finalization (document generation, fee confirmation, client instructions), payment (secure interface, method selection, transaction tracking), completion (checklist, final docs, claim closure).</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 