'use client';

import { useEffect } from 'react';
import { ClaimsPendingTable } from './ClaimsPendingTable';
import { useClaimsStore } from '@/lib/store/claims-store';

export function ClaimsPageClient() {
  const { fetchClaims } = useClaimsStore();

  useEffect(() => {
    fetchClaims();
  }, [fetchClaims]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Claims Management</h1>
        <p className="text-gray-600">
          Review and manage insurance claims
        </p>
      </div>
      <ClaimsPendingTable />
    </div>
  );
} 