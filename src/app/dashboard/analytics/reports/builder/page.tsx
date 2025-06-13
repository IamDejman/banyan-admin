'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Report, ReportWidget } from '@/lib/types/analytics';
import { useToast } from '@/components/ui/use-toast';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Download, Save, Plus, GripVertical } from 'lucide-react';

// Mock data - replace with API calls
const mockWidgets: ReportWidget[] = [
  {
    id: '1',
    type: 'metric',
    title: 'Total Claims',
    data: { value: 150, change: 10 },
    position: { x: 0, y: 0, width: 2, height: 1 },
  },
  {
    id: '2',
    type: 'chart',
    title: 'Claims by Status',
    data: {
      labels: ['Pending', 'Approved', 'Rejected'],
      values: [50, 80, 20],
    },
    position: { x: 2, y: 0, width: 2, height: 2 },
  },
];

export default function ReportBuilderPage() {
  const { toast } = useToast();
  const [report, setReport] = useState<Partial<Report>>({
    name: '',
    description: '',
    type: 'custom',
    metrics: [],
    filters: [],
    layout: {
      id: '1',
      type: 'grid',
      columns: 4,
      widgets: mockWidgets,
    },
  });

  const handleSave = async () => {
    try {
      // TODO: Implement API call to save report
      toast({
        title: 'Report saved',
        description: 'Your custom report has been saved successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save report. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleExport = async (format: 'pdf' | 'excel' | 'csv') => {
    // TODO: Implement export functionality
    console.log(`Exporting to ${format}...`);
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const widgets = Array.from(report.layout?.widgets || []);
    const [reorderedWidget] = widgets.splice(result.source.index, 1);
    widgets.splice(result.destination.index, 0, reorderedWidget);

    setReport((prev) => ({
      ...prev,
      layout: {
        ...prev.layout!,
        widgets,
      },
    }));
  };

  const handleAddWidget = (type: ReportWidget['type']) => {
    const newWidget: ReportWidget = {
      id: Date.now().toString(),
      type,
      title: `New ${type} Widget`,
      data: {},
      position: { x: 0, y: 0, width: 2, height: 1 },
    };

    setReport((prev) => ({
      ...prev,
      layout: {
        ...prev.layout!,
        widgets: [...(prev.layout?.widgets || []), newWidget],
      },
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Report Builder</h1>
          <p className="text-muted-foreground">
            Create and customize your reports
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save Report
          </Button>
          <Button variant="outline" onClick={() => handleExport('pdf')}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Report Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Report Name</Label>
                <Input
                  id="name"
                  value={report.name}
                  onChange={(e) =>
                    setReport((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="Enter report name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={report.description}
                  onChange={(e) =>
                    setReport((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Enter report description"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Report Layout</CardTitle>
            </CardHeader>
            <CardContent>
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="widgets">
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="space-y-4"
                    >
                      {report.layout?.widgets.map((widget, index) => (
                        <Draggable
                          key={widget.id}
                          draggableId={widget.id}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className="flex items-center gap-4 p-4 border rounded-lg"
                            >
                              <div
                                {...provided.dragHandleProps}
                                className="cursor-grab"
                              >
                                <GripVertical className="h-5 w-5 text-muted-foreground" />
                              </div>
                              <div className="flex-1">
                                <h3 className="font-medium">{widget.title}</h3>
                                <p className="text-sm text-muted-foreground">
                                  Type: {widget.type}
                                </p>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Add Widgets</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => handleAddWidget('metric')}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Metric
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => handleAddWidget('chart')}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Chart
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => handleAddWidget('table')}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Table
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => handleAddWidget('text')}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Text
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 