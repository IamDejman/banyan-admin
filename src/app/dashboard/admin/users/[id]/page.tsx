import UserFormClient from './UserFormClient';

export default async function UserFormPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  return <UserFormClient userId={id} />;
} 