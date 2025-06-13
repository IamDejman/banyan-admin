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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Search, Mail, MessageSquare, Bell } from 'lucide-react';
import { NotificationType, NotificationTemplate } from '@/lib/types/notification';

// Mock data - replace with API calls
const mockTemplates: NotificationTemplate[] = [
  {
    id: '1',
    name: 'System Maintenance',
    type: 'EMAIL',
    subject: 'System Maintenance Notice',
    content: 'We will be performing system maintenance...',
    variables: ['maintenanceDate', 'duration', 'impact'],
    createdAt: '2024-03-15T10:00:00Z',
    updatedAt: '2024-03-15T10:00:00Z',
    createdBy: 'Admin',
  },
  {
    id: '2',
    name: 'Appointment Reminder',
    type: 'SMS',
    subject: 'Appointment Reminder',
    content: 'Your appointment is scheduled for {{date}}...',
    variables: ['date', 'time', 'location'],
    createdAt: '2024-03-15T11:00:00Z',
    updatedAt: '2024-03-15T11:00:00Z',
    createdBy: 'Admin',
  },
];

interface TemplateManagerProps {
  onSelectTemplate: (template: NotificationTemplate) => void;
}

export function TemplateManager({ onSelectTemplate }: TemplateManagerProps) {
  const [activeTab, setActiveTab] = useState<NotificationType>('EMAIL');
  const [searchQuery, setSearchQuery] = useState('');
  const [showEditor, setShowEditor] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<NotificationTemplate | null>(null);

  const filteredTemplates = mockTemplates.filter(
    (template) =>
      template.type === activeTab &&
      template.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const typeIcons = {
    EMAIL: Mail,
    SMS: MessageSquare,
    PUSH: Bell,
  };

  const handleCreateTemplate = () => {
    setEditingTemplate(null);
    setShowEditor(true);
  };

  const handleEditTemplate = (template: NotificationTemplate) => {
    setEditingTemplate(template);
    setShowEditor(true);
  };

  const handleSaveTemplate = (template: NotificationTemplate) => {
    // TODO: Implement API call to save template
    console.log('Saving template:', template);
    setShowEditor(false);
  };

  if (showEditor) {
    return (
      <Card className="p-4 sm:p-6">
        <CardHeader>
          <CardTitle>
            {editingTemplate ? 'Edit Template' : 'Create Template'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Template Name</Label>
            <Input
              id="name"
              value={editingTemplate?.name || ''}
              onChange={(e) =>
                setEditingTemplate((prev) => ({
                  ...prev!,
                  name: e.target.value,
                }))
              }
              placeholder="Enter template name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              value={editingTemplate?.subject || ''}
              onChange={(e) =>
                setEditingTemplate((prev) => ({
                  ...prev!,
                  subject: e.target.value,
                }))
              }
              placeholder="Enter subject"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              value={editingTemplate?.content || ''}
              onChange={(e) =>
                setEditingTemplate((prev) => ({
                  ...prev!,
                  content: e.target.value,
                }))
              }
              placeholder="Enter content"
              className="min-h-[200px]"
            />
          </div>

          <div className="space-y-2">
            <Label>Variables</Label>
            <div className="flex flex-wrap gap-2">
              {editingTemplate?.variables.map((variable) => (
                <div
                  key={variable}
                  className="flex items-center gap-1 bg-secondary px-2 py-1 rounded-md"
                >
                  <span>{variable}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      setEditingTemplate((prev) => ({
                        ...prev!,
                        variables: prev!.variables.filter((v) => v !== variable),
                      }))
                    }
                  >
                    ×
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-2">
            <Button variant="outline" onClick={() => setShowEditor(false)} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button onClick={() => handleSaveTemplate(editingTemplate!)} className="w-full sm:w-auto">
              Save Template
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="p-4 sm:p-6">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <CardTitle>Templates</CardTitle>
          <Button onClick={handleCreateTemplate} className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Create Template
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as NotificationType)}>
          <TabsList className="w-full sm:w-auto">
            <TabsTrigger value="EMAIL" className="flex-1 sm:flex-none">
              <Mail className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Email</span>
            </TabsTrigger>
            <TabsTrigger value="SMS" className="flex-1 sm:flex-none">
              <MessageSquare className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">SMS</span>
            </TabsTrigger>
            <TabsTrigger value="PUSH" className="flex-1 sm:flex-none">
              <Bell className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Push</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4">
            {filteredTemplates.map((template) => {
              const Icon = typeIcons[template.type];
              return (
                <div
                  key={template.id}
                  className="flex flex-col sm:flex-row sm:items-start justify-between p-4 border rounded-lg gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                      <h3 className="font-medium">{template.name}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {template.subject}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {template.variables.map((variable) => (
                        <span
                          key={variable}
                          className="text-xs bg-secondary px-2 py-1 rounded-md"
                        >
                          {variable}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditTemplate(template)}
                      className="w-full sm:w-auto"
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => onSelectTemplate(template)}
                      className="w-full sm:w-auto"
                    >
                      Use
                    </Button>
                  </div>
                </div>
              );
            })}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
} 