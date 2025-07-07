import React from "react";
import { Card } from "@/components/ui/card";
import Link from "next/link";

export default function SystemConfigPage() {
  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-2">System Configuration</h1>
      <p className="text-muted-foreground mb-8">Configure core system settings such as insurers and claim types. All data is local/mock for now.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/dashboard/system-config/insurers">
          <Card className="p-6 hover:shadow-lg transition cursor-pointer">
            <h2 className="text-xl font-semibold mb-2">Insurers</h2>
            <p className="text-muted-foreground">Manage all insurers, their details, and claim type support.</p>
          </Card>
        </Link>
        <Link href="/dashboard/system-config/claim-types">
          <Card className="p-6 hover:shadow-lg transition cursor-pointer">
            <h2 className="text-xl font-semibold mb-2">Claim Types</h2>
            <p className="text-muted-foreground">Define and edit the types of claims supported by the system.</p>
          </Card>
        </Link>
      </div>
    </div>
  );
} 