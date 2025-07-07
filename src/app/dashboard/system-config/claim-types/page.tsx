import React from "react";
import ClaimTypesClient from "./ClaimTypesClient";

export default function ClaimTypesPage() {
  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-2">Claim Types Management</h1>
      <p className="text-muted-foreground mb-8">Manage the types of claims supported by the system. (UI/UX only, mock data)</p>
      <ClaimTypesClient />
    </div>
  );
} 