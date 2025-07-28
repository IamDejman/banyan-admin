import React from "react";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { Shield, Users, User, Settings } from "lucide-react";

export default function UserManagementPage() {
  return (
    <div className="max-w-4xl mx-auto py-8">
      <div>
        <h1 className="text-3xl font-bold">User Management</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/dashboard/user-management/admins">
          <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-red-100 rounded-lg">
                <Shield className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Admins</h3>
              </div>
            </div>
          </Card>
        </Link>

        <Link href="/dashboard/user-management/agents">
          <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Agents</h3>
              </div>
            </div>
          </Card>
        </Link>

        <Link href="/dashboard/user-management/customers">
          <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <User className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Customers</h3>
              </div>
            </div>
          </Card>
        </Link>

        <Link href="/dashboard/user-management/permissions">
          <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Settings className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Permissions</h3>
              </div>
            </div>
          </Card>
        </Link>
      </div>
    </div>
  );
} 