'use client';

import { useEffect } from 'react';
import { ClaimDetailsView } from './ClaimDetailsView';
import { ClaimReviewForm } from './ClaimReviewForm';
import { useAuthStore } from '@/lib/store/auth-store';
import { useClaimsStore } from '@/lib/store/claims-store';

interface ClaimDetailsPageClientProps {
  claimId: string;
}

export function ClaimDetailsPageClient({ claimId }: ClaimDetailsPageClientProps) {
  const { user } = useAuthStore();
  const { fetchClaimById } = useClaimsStore();

  useEffect(() => {
    fetchClaimById(claimId);
  }, [claimId, fetchClaimById]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Claim Details</h1>
        <p className="text-gray-600">
          Review claim information and submit your assessment
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ClaimDetailsView claimId={claimId} />
        </div>
        <div>
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium mb-4">Submit Review</h2>
            {user ? (
              <ClaimReviewForm
                claimId={claimId}
                onSuccess={() => {
                  // Refresh claim details after successful review
                  fetchClaimById(claimId);
                }}
              />
            ) : (
              <p className="text-gray-500">Please log in to submit a review</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 