import React from "react";
import InsurersClient from "./InsurersClient";

export default function InsurersPage() {
  return (
    <div className="max-w-5xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-2">Insurers Management</h1>
      <p className="text-muted-foreground mb-8">View, add, edit, and manage all insurers in the system. All data is local/mock for now.</p>
      <InsurersClient />
    </div>
  );
} 