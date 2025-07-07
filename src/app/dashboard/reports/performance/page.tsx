import React from "react";
import PerformanceReportsClient from "./PerformanceReportsClient";

export default function PerformanceReportsPage() {
  return (
    <div className="max-w-6xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-2">Performance Reports</h1>
      <p className="text-muted-foreground mb-8">Monitor system and workflow performance. All data is local/mock for now.</p>
      <PerformanceReportsClient />
    </div>
  );
} 