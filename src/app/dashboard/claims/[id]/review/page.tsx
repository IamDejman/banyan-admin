import ClaimReviewClient from './ClaimReviewClient';

export default async function ClaimReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ClaimReviewClient claimId={id} />;
} 