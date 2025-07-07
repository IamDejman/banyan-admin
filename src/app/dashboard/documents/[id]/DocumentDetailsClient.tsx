'use client';

interface DocumentDetailsClientProps {
  documentId: string;
}

export default function DocumentDetailsClient({ documentId }: DocumentDetailsClientProps) {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-2">Document Details</h1>
      <p className="text-muted-foreground">Document ID: {documentId}</p>
      <div className="mt-4">(Document details would be shown here.)</div>
    </div>
  );
} 