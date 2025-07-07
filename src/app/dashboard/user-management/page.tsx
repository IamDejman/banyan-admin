import React from "react";
import { Card } from "@/components/ui/card";
import Link from "next/link";

export default function UserManagementPage() {
  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-2">User Management</h1>
      <p className="text-muted-foreground mb-8">Manage all users, roles, and permissions in the system. All data is local/mock for now.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/dashboard/user-management/admins">
          <Card className="p-6 hover:shadow-lg transition cursor-pointer">
            <h2 className="text-xl font-semibold mb-2">Admins</h2>
            <p className="text-muted-foreground">Manage admin users and their access.</p>
          </Card>
        </Link>
        <Link href="/dashboard/user-management/agents">
          <Card className="p-6 hover:shadow-lg transition cursor-pointer">
            <h2 className="text-xl font-semibold mb-2">Agents</h2>
            <p className="text-muted-foreground">Manage agent users and assignments.</p>
          </Card>
        </Link>
        <Link href="/dashboard/user-management/customers">
          <Card className="p-6 hover:shadow-lg transition cursor-pointer">
            <h2 className="text-xl font-semibold mb-2">Customers</h2>
            <p className="text-muted-foreground">Manage customer users and their details.</p>
          </Card>
        </Link>
        <Link href="/dashboard/user-management/permissions">
          <Card className="p-6 hover:shadow-lg transition cursor-pointer">
            <h2 className="text-xl font-semibold mb-2">Permissions</h2>
            <p className="text-muted-foreground">Configure user roles and permissions.</p>
          </Card>
        </Link>
      </div>
    </div>
  );
} 