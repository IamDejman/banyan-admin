'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  NotificationType,
  NotificationPriority,
  RecipientType,
} from '@/lib/types/notification';

interface NotificationComposerProps {
  type: NotificationType;
  onSave: (notification: any) => void;
  onCancel: () => void;
}

export function NotificationComposer({
  type,
  onSave,
  onCancel,
}: NotificationComposerProps) {
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [priority, setPriority] = useState<NotificationPriority>('MEDIUM');
  const [recipientType, setRecipientType] = useState<RecipientType>('ALL');
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [scheduled, setScheduled] = useState(false);
  const [scheduledDate, setScheduledDate] = useState<Date>();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      type,
      subject,
      content,
      priority,
      recipients: {
        type: recipientType,
        ids: recipientType === 'ALL' ? [] : 
             recipientType === 'GROUP' ? selectedGroups : 
             selectedUsers,
      },
      scheduledFor: scheduled ? scheduledDate : undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-4 sm:p-6">
      <Card>
        <CardHeader>
          <CardTitle>Compose {type} Notification</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Enter notification subject"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter notification content"
              className="min-h-[200px]"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={priority}
                onValueChange={(value) => setPriority(value as NotificationPriority)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LOW">Low</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                  <SelectItem value="URGENT">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="recipientType">Recipients</Label>
              <Select
                value={recipientType}
                onValueChange={(value) => setRecipientType(value as RecipientType)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select recipient type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Users</SelectItem>
                  <SelectItem value="GROUP">Specific Groups</SelectItem>
                  <SelectItem value="INDIVIDUAL">Specific Users</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {recipientType !== 'ALL' && (
            <div className="space-y-2">
              <Label>
                {recipientType === 'GROUP' ? 'Select Groups' : 'Select Users'}
              </Label>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
                  <Users className="h-4 w-4 mr-2" />
                  {recipientType === 'GROUP'
                    ? 'Select Groups'
                    : 'Select Users'}
                </Button>
              </div>
            </div>
          )}

          <div className="flex items-center space-x-2">
            <Switch
              id="schedule"
              checked={scheduled}
              onCheckedChange={setScheduled}
            />
            <Label htmlFor="schedule">Schedule for later</Label>
          </div>

          {scheduled && (
            <div className="space-y-2">
              <Label>Schedule Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !scheduledDate && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {scheduledDate ? (
                      format(scheduledDate, 'PPP')
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={scheduledDate}
                    onSelect={setScheduledDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel} className="w-full sm:w-auto">
          Cancel
        </Button>
        <Button type="submit" className="w-full sm:w-auto">
          {scheduled ? 'Schedule' : 'Send'} Notification
        </Button>
      </div>
    </form>
  );
} 