import React from "react";
import { Card } from "@/components/ui/card";
import Link from "next/link";

export default function ReportsPage() {
  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-2">Reports</h1>
      <p className="text-muted-foreground mb-8">View and analyze system data and performance. All data is local/mock for now.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/dashboard/reports/claims">
          <Card className="p-6 hover:shadow-lg transition cursor-pointer">
            <h2 className="text-xl font-semibold mb-2">Claims</h2>
            <p className="text-muted-foreground">View and analyze claims data and trends.</p>
          </Card>
        </Link>
        <Link href="/dashboard/reports/users">
          <Card className="p-6 hover:shadow-lg transition cursor-pointer">
            <h2 className="text-xl font-semibold mb-2">Users</h2>
            <p className="text-muted-foreground">Analyze user activity and engagement.</p>
          </Card>
        </Link>
        <Link href="/dashboard/reports/performance">
          <Card className="p-6 hover:shadow-lg transition cursor-pointer">
            <h2 className="text-xl font-semibold mb-2">Performance</h2>
            <p className="text-muted-foreground">Monitor system and workflow performance.</p>
          </Card>
        </Link>
        <Link href="/dashboard/reports/system">
          <Card className="p-6 hover:shadow-lg transition cursor-pointer">
            <h2 className="text-xl font-semibold mb-2">System</h2>
            <p className="text-muted-foreground">System health, audit, and configuration reports.</p>
          </Card>
        </Link>
      </div>
    </div>
  );
} 