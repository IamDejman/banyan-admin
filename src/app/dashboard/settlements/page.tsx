"use client";
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NairaIcon } from '@/components/ui/naira-icon';
import CreateOffersTab from './create-offers/CreateOffersTab';
import ApproveOffersTab from './approve-offers/ApproveOffersTab';
import PresentOffersTab from './present-offers/PresentOffersTab';
import ManageOffersTab from './manage-offers/ManageOffersTab';

const quickStats = [
  { title: 'Active Offers', value: '12', icon: NairaIcon, description: 'Currently open offers', trend: '+2', trendUp: true },
  { title: 'Pending Approval', value: '5', icon: NairaIcon, description: 'Awaiting review', trend: '-1', trendUp: false },
  { title: 'Ready to Present', value: '8', icon: NairaIcon, description: 'Approved offers', trend: '+3', trendUp: true },
  { title: 'Total Settled', value: '₦2.5M', icon: NairaIcon, description: 'This month', trend: '+15%', trendUp: true },
];

export default function SettlementsPage() {
  const [activeTab, setActiveTab] = useState("create");

  return (
    <div className="max-w-7xl mx-auto py-8">
      <div>
        <h1 className="text-3xl font-bold">Settlements</h1>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {quickStats.map((stat, index) => (
          <Card key={index} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <stat.icon className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className={`font-medium ${stat.trendUp ? 'text-green-600' : 'text-red-600'}`}>
                {stat.trend}
              </span>
              <span className="text-muted-foreground ml-1">from last month</span>
            </div>
          </Card>
        ))}
      </div>

      {/* Main Tabs */}
      <Card className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="create">Create Offers</TabsTrigger>
            <TabsTrigger value="approve">Approve Offers</TabsTrigger>
            <TabsTrigger value="present">Present Offers</TabsTrigger>
            <TabsTrigger value="manage">Manage Offers</TabsTrigger>
          </TabsList>

          <TabsContent value="create" className="mt-6">
            <CreateOffersTab />
          </TabsContent>

          <TabsContent value="approve" className="mt-6">
            <ApproveOffersTab />
          </TabsContent>

          <TabsContent value="present" className="mt-6">
            <PresentOffersTab />
          </TabsContent>

          <TabsContent value="manage" className="mt-6">
            <ManageOffersTab />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
} 