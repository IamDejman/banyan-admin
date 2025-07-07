import SettlementPaymentClient from './SettlementPaymentClient';

export default async function SettlementPaymentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <SettlementPaymentClient settlementId={id} />;
} 