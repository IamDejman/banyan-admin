import React from "react";
import AdminsAuditLogsClient from "./AdminsAuditLogsClient";

export default function AdminsAuditLogsPage() {
  return (
    <div className="max-w-6xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-2">Admins Audit Logs</h1>
      <p className="text-muted-foreground mb-8">View audit logs for admin actions. All data is local/mock for now.</p>
      <AdminsAuditLogsClient />
    </div>
  );
} 