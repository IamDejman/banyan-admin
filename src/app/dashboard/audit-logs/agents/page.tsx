import React from "react";
import AgentsAuditLogsClient from "./AgentsAuditLogsClient";

export default function AgentsAuditLogsPage() {
  return (
    <div className="max-w-6xl mx-auto py-8">
      <div>
        <h1 className="text-3xl font-bold">Agents Audit Logs</h1>
      </div>
      <AgentsAuditLogsClient />
    </div>
  );
} 