import React from "react";
import SystemReportsClient from "./SystemReportsClient";

export default function SystemReportsPage() {
  return (
    <div className="max-w-6xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-2">System Reports</h1>
      <p className="text-muted-foreground mb-8">System health, audit, and configuration reports. All data is local/mock for now.</p>
      <SystemReportsClient />
    </div>
  );
} 