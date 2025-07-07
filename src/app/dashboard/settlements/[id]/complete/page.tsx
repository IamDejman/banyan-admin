import SettlementCompleteClient from './SettlementCompleteClient';

export default async function SettlementCompletePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <SettlementCompleteClient settlementId={id} />;
} 