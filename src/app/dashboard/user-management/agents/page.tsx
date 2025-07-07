import React from "react";
import AgentsClient from "./AgentsClient";

export default function AgentsPage() {
  return (
    <div className="max-w-5xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-2">Agents Management</h1>
      <p className="text-muted-foreground mb-8">Manage agent users and assignments. All data is local/mock for now.</p>
      <AgentsClient />
    </div>
  );
} 