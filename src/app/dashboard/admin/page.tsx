"use client";
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Users, BarChart3, Settings } from "lucide-react";
import ClaimAssignmentTab from "./ClaimAssignmentTab";
import AgentWorkloadTab from "./AgentWorkloadTab";
import StatusManagementTab from "./StatusManagementTab";

export default function AdminPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin</h1>
      </div>

      <Tabs defaultValue="assignments" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="assignments" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Claim Assignment
          </TabsTrigger>
          <TabsTrigger value="workload" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Agent Workload
          </TabsTrigger>
          <TabsTrigger value="status" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Status Management
          </TabsTrigger>
        </TabsList>

        <TabsContent value="assignments">
          <Card className="p-6">
            <ClaimAssignmentTab />
          </Card>
        </TabsContent>

        <TabsContent value="workload">
          <Card className="p-6">
            <AgentWorkloadTab />
          </Card>
        </TabsContent>

        <TabsContent value="status">
          <Card className="p-6">
            <StatusManagementTab />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 