import RoleFormClient from './RoleFormClient';

export default async function RoleFormPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  return <RoleFormClient roleId={id} />;
} 