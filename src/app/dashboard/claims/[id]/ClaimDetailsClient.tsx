'use client';

interface ClaimDetailsClientProps {
  claimId: string;
}

export default function ClaimDetailsClient({ claimId }: ClaimDetailsClientProps) {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-2">Claim Details</h1>
      <p className="text-muted-foreground">Claim ID: {claimId}</p>
      <div className="mt-4">(Claim details would be shown here.)</div>
    </div>
  );
} 