import ClaimDetailsClient from './ClaimDetailsClient';

export default async function ClaimDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ClaimDetailsClient claimId={id} />;
} 