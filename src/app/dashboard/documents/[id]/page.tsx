import DocumentDetailsClient from './DocumentDetailsClient';

export default async function DocumentDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <DocumentDetailsClient documentId={id} />;
} 