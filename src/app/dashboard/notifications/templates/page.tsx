'use client';

import { useRouter } from 'next/navigation';
import { TemplateManager } from '@/components/notifications/TemplateManager';
import { NotificationTemplate } from '@/lib/types/notification';

export default function TemplatesPage() {
  const router = useRouter();

  const handleSelectTemplate = (template: NotificationTemplate) => {
    router.push(`/dashboard/notifications/new?type=${template.type}&template=${template.id}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Notification Templates</h1>
        <p className="text-muted-foreground">
          Create and manage notification templates
        </p>
      </div>

      <TemplateManager onSelectTemplate={handleSelectTemplate} />
    </div>
  );
} 