import React from "react";
import PermissionsClient from "./PermissionsClient";

export default function PermissionsPage() {
  return (
    <div className="max-w-5xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-2">Permissions Management</h1>
      <p className="text-muted-foreground mb-8">Configure user roles and permissions. All data is local/mock for now.</p>
      <PermissionsClient />
    </div>
  );
} 