import ClaimAssignmentClient from './ClaimAssignmentClient';

export default async function ClaimAssignmentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ClaimAssignmentClient claimId={id} />;
} 