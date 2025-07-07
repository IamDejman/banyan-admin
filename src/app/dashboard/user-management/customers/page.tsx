import React from "react";
import CustomersClient from "./CustomersClient";

export default function CustomersPage() {
  return (
    <div className="max-w-5xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-2">Customers Management</h1>
      <p className="text-muted-foreground mb-8">Manage customer users and their details. All data is local/mock for now.</p>
      <CustomersClient />
    </div>
  );
} 