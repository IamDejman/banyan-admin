import SettlementCounterClient from './SettlementCounterClient';

export default async function SettlementCounterPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <SettlementCounterClient settlementId={id} />;
} 