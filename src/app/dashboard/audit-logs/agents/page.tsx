import React from "react";
import AgentsAuditLogsClient from "./AgentsAuditLogsClient";

export default function AgentsAuditLogsPage() {
  return (
    <div className="max-w-6xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-2">Agents Audit Logs</h1>
      <p className="text-muted-foreground mb-8">View audit logs for agent actions. All data is local/mock for now.</p>
      <AgentsAuditLogsClient />
    </div>
  );
} 