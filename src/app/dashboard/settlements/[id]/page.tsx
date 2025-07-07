import SettlementDetailsClient from './SettlementDetailsClient';

export default async function SettlementDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <SettlementDetailsClient settlementId={id} />;
} 