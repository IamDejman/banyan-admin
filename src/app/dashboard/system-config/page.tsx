import React from "react";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { Building, FileText, AlertTriangle } from "lucide-react";

export default function SystemConfigPage() {
  return (
    <div className="max-w-4xl mx-auto py-8">
      <div>
        <h1 className="text-3xl font-bold">System Config</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/dashboard/system-config/insurers">
          <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Building className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Insurers</h3>
              </div>
            </div>
          </Card>
        </Link>
        
        <Link href="/dashboard/system-config/claim-types">
          <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <FileText className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Claim Types</h3>
              </div>
            </div>
          </Card>
        </Link>

        <Link href="/dashboard/system-config/incident-types">
          <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-orange-100 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Incident Types</h3>
              </div>
            </div>
          </Card>
        </Link>
      </div>
    </div>
  );
} 