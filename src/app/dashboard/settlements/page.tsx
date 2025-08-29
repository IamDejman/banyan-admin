"use client";
import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NairaIcon } from '@/components/ui/naira-icon';
import CreateOffersTab from './create-offers/CreateOffersTab';
import ApproveOffersTab from './approve-offers/ApproveOffersTab';
import PresentOffersTab from './present-offers/PresentOffersTab';
import ManageOffersTab from './manage-offers/ManageOffersTab';
import { getSettlements, getSettlementStatistics } from '@/app/services/dashboard';
import { Settlement, SettlementStatistics, SettlementsResponse } from "@/lib/types/settlement";






export default function SettlementsPage() {
  const [activeTab, setActiveTab] = useState("create");
  const [filterStatus, setFilterStatus] = useState("all");
  const [statistics, setStatistics] = useState<SettlementStatistics | null>(null);
  const [settlements, setSettlements] = useState<Settlement[]>([]);
  const [loading, setLoading] = useState(true);
  const [settlementsLoading, setSettlementsLoading] = useState(true);

  useEffect(() => {
    if (activeTab === "create") {
      setFilterStatus("all");
      handleReloadData("all");
    } else if (activeTab === "approve") {
      setFilterStatus("all");
      handleReloadData("all");
    } else if (activeTab === "present") {
      setFilterStatus("approved");
      handleReloadData("approved");
    } else if (activeTab === "manage") {
      setFilterStatus("all");
      handleReloadData("all");
    }
  }, [activeTab]);

  const handleReloadData = (status?: string) => {
    console.log("fetching settlements__");
    getSettlements(status || filterStatus).then((res: SettlementsResponse) => {
      // console.log(res, "settlements res__");
      // Handle the nested data structure from the API response
      let settlementsData: Settlement[] = [];
      if (res?.data?.data && Array.isArray(res.data.data)) {
        settlementsData = res.data.data;
      } else if (Array.isArray(res)) {
        settlementsData = res;
      }
      console.log(settlementsData, "settlementsData__");

      // Fill missing data with "N/A" for required fields
      const processedSettlements = settlementsData.map(settlement => ({
        ...settlement,
        calculation_breakdown: settlement.calculation_breakdown || "N/A",
        offer_modifications: settlement.offer_modifications || "N/A",
        fee_structure: settlement.fee_structure || "N/A",
        offer_terms: settlement.offer_terms || "N/A",
        approval_notes: settlement.approval_notes || "N/A",
        rejection_reason: settlement.rejection_reason || "N/A",
        offer_acceptance_notes: settlement.offer_acceptance_notes || "N/A",
        offer_acceptance_status: settlement.offer_acceptance_status || "N/A",
        offer_acceptance_reason: settlement.offer_acceptance_reason || "N/A",
        approved_by: settlement.approved_by || "N/A",
        rejected_by: settlement.rejected_by || "N/A",
        approved_at: settlement.approved_at || "N/A",
        rejected_at: settlement.rejected_at || "N/A",
        supporting_documents: settlement.supporting_documents || [],
        special_conditions: settlement.special_conditions || "N/A"
      }));

      setSettlements(processedSettlements as unknown as Settlement[]);
      setSettlementsLoading(false);
    }).catch((error) => {
      console.error("Error fetching settlements:", error);
      setSettlementsLoading(false);
    });

    getSettlementStatistics().then((res) => {
      console.log(res, "statistics__");
      // Handle the response - it might be an array with the first element being the data
      const statsData = Array.isArray(res) ? res[0] : res;
      setStatistics(statsData as SettlementStatistics);
      setLoading(false);
    }).catch((error) => {
      console.error("Error fetching settlement statistics:", error);
      setLoading(false);
    });
  };

  useEffect(() => {
    handleReloadData(filterStatus);
  }, []);

  // Filter settlements by status for different tabs
  const getSettlementsByStatus = (status: string) => {
    return settlements.filter(settlement => settlement.status === status);
  };

  const getSettlementsByStatuses = (statuses: string[]) => {
    return settlements.filter(settlement => statuses.includes(settlement.status));
  };

  const quickStats = statistics ? [
    {
      title: 'Active Offers',
      value: statistics.active_offers.toString(),
      icon: NairaIcon,
      description: 'Currently open offers',
      trend: `${statistics.active_offers_percentage >= 0 ? '+' : ''}${statistics.active_offers_percentage}%`,
      trendUp: statistics.active_offers_percentage >= 0
    },
    {
      title: 'Pending Approval',
      value: statistics.pending_approval.toString(),
      icon: NairaIcon,
      description: 'Awaiting review',
      trend: `${statistics.pending_approval_percentage >= 0 ? '+' : ''}${statistics.pending_approval_percentage}%`,
      trendUp: statistics.pending_approval_percentage >= 0
    },
    {
      title: 'Ready to Present',
      value: statistics.ready_to_present.toString(),
      icon: NairaIcon,
      description: 'Approved offers',
      trend: `${statistics.ready_to_present_percentage >= 0 ? '+' : ''}${statistics.ready_to_present_percentage}%`,
      trendUp: statistics.ready_to_present_percentage >= 0
    },
    {
      title: 'Total Settled',
      value: `₦${statistics.total_settled.toLocaleString()}`,
      icon: NairaIcon,
      description: 'This month',
      trend: `${statistics.total_settled_percentage >= 0 ? '+' : ''}${statistics.total_settled_percentage}%`,
      trendUp: statistics.total_settled_percentage >= 0
    },
  ] : [];

  return (
    <div className="max-w-7xl mx-auto py-8">
      <div>
        <h1 className="text-3xl font-bold">Settlements</h1>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {loading ? (
          // Loading skeleton
          Array.from({ length: 4 }).map((_, index) => (
            <Card key={index} className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                  <div className="h-8 bg-gray-200 rounded w-16"></div>
                  <div className="h-3 bg-gray-200 rounded w-32"></div>
                </div>
                <div className="h-12 w-12 rounded-lg bg-gray-200"></div>
              </div>
              <div className="mt-4">
                <div className="h-4 bg-gray-200 rounded w-20"></div>
              </div>
            </Card>
          ))
        ) : (
          quickStats.map((stat, index) => (
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
          ))
        )}
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
            <CreateOffersTab
              refetch={() => {
                getSettlements("all").then((res: SettlementsResponse) => {
                  let latestSettlements: Settlement[] = [];
                  if (res?.data?.data && Array.isArray(res.data.data)) {
                    latestSettlements = res.data.data;
                  } else if (Array.isArray(res)) {
                    latestSettlements = res;
                  }
                  setSettlements(latestSettlements);
                });
              }}
              settlements={settlements}
              loading={settlementsLoading}
            />
          </TabsContent>

          <TabsContent value="approve" className="mt-6">
            <ApproveOffersTab
              settlements={getSettlementsByStatuses(['submitted', 'pending_approval'])}
              loading={settlementsLoading}
            />
          </TabsContent>

          <TabsContent value="present" className="mt-6">
            <PresentOffersTab
              settlements={getSettlementsByStatuses(['approved', 'ready_to_present'])}
              loading={settlementsLoading}
            />
          </TabsContent>

          <TabsContent value="manage" className="mt-6">
            <ManageOffersTab
              settlements={settlements}
              loading={settlementsLoading}
            />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
} 