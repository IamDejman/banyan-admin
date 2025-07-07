'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Send } from 'lucide-react';

export default function PresentOffersPage() {
  const [method, setMethod] = useState('email');
  const [template, setTemplate] = useState('Standard');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [tracking, setTracking] = useState('Not Sent');

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Present Offer to Client</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block font-medium mb-1">Presentation Method</label>
            <Select value={method} onValueChange={setMethod}>
              <SelectTrigger>
                <SelectValue placeholder="Select method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="portal">Client Portal</SelectItem>
                <SelectItem value="physical">Physical Mail</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block font-medium mb-1">Attach Documents</label>
            <Input type="file" multiple onChange={e => setAttachments(Array.from(e.target.files || []))} />
            <div className="text-xs text-muted-foreground mt-1">
              {attachments.length > 0 ? `${attachments.length} file(s) selected` : 'No files selected'}
            </div>
          </div>
          <div>
            <label className="block font-medium mb-1">Communication Template</label>
            <Select value={template} onValueChange={setTemplate}>
              <SelectTrigger>
                <SelectValue placeholder="Select template" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Standard">Standard</SelectItem>
                <SelectItem value="Reminder">Reminder</SelectItem>
                <SelectItem value="Custom">Custom</SelectItem>
              </SelectContent>
            </Select>
            {template === 'Custom' && (
              <Textarea rows={3} placeholder="Write your custom message here..." />
            )}
          </div>
          <div>
            <label className="block font-medium mb-1">Delivery Tracking</label>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">{tracking}</span>
              <Button size="sm" onClick={() => setTracking('Sent')}>Mark as Sent</Button>
            </div>
          </div>
          <Button className="mt-4"><Send className="h-4 w-4 mr-1" /> Present Offer</Button>
        </CardContent>
      </Card>
    </div>
  );
} 