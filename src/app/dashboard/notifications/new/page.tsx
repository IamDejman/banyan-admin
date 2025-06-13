'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { NotificationComposer } from '@/components/notifications/NotificationComposer';
import { useToast } from '@/components/ui/use-toast';
import { NotificationType } from '@/lib/types/notification';

export default function NewNotificationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const type = (searchParams.get('type') as NotificationType) || 'EMAIL';

  const handleSave = async (notification: any) => {
    try {
      // TODO: Implement API call to save notification
      console.log('Saving notification:', notification);
      
      toast({
        title: 'Success',
        description: `Notification ${notification.scheduledFor ? 'scheduled' : 'sent'} successfully.`,
      });
      
      router.push('/dashboard/notifications');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save notification. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleCancel = () => {
    router.push('/dashboard/notifications');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">New Notification</h1>
        <p className="text-muted-foreground">
          Create and send a new notification to users
        </p>
      </div>

      <NotificationComposer
        type={type}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    </div>
  );
} 