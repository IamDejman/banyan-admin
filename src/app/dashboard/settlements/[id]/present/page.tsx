import SettlementPresentClient from './SettlementPresentClient';

export default async function SettlementPresentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <SettlementPresentClient settlementId={id} />;
} 