import React from "react";
import AdminsClient from "./AdminsClient";

export default function AdminsPage() {
  return (
    <div className="max-w-5xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-2">Admins Management</h1>
      <p className="text-muted-foreground mb-8">Manage admin users and their access. All data is local/mock for now.</p>
      <AdminsClient />
    </div>
  );
} 