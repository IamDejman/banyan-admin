'use client';

interface SettlementDetailsClientProps {
  settlementId: string;
}

export default function SettlementDetailsClient({ settlementId }: SettlementDetailsClientProps) {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-2">Settlement Details</h1>
      <p className="text-muted-foreground">Settlement ID: {settlementId}</p>
      <div className="mt-4">(Settlement details would be shown here.)</div>
    </div>
  );
} 