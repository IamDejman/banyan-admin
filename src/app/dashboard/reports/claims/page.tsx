import React from "react";
import ClaimsReportsClient from "./ClaimsReportsClient";

export default function ClaimsReportsPage() {
  return (
    <div className="max-w-6xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-2">Claims Reports</h1>
      <p className="text-muted-foreground mb-8">View and analyze claims data and trends. All data is local/mock for now.</p>
      <ClaimsReportsClient />
    </div>
  );
} 