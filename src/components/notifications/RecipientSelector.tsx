'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, Users } from 'lucide-react';
import { RecipientType } from '@/lib/types/notification';

// Mock data - replace with API calls
const mockGroups = [
  { id: '1', name: 'Administrators' },
  { id: '2', name: 'Managers' },
  { id: '3', name: 'Agents' },
  { id: '4', name: 'Support Team' },
];

const mockUsers = [
  { id: '1', name: 'John Doe', email: 'john@example.com' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
  { id: '3', name: 'Bob Johnson', email: 'bob@example.com' },
  { id: '4', name: 'Alice Brown', email: 'alice@example.com' },
];

interface RecipientSelectorProps {
  type: RecipientType;
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
  onClose: () => void;
}

export function RecipientSelector({
  type,
  selectedIds,
  onSelectionChange,
  onClose,
}: RecipientSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selected, setSelected] = useState<string[]>(selectedIds);

  const items = type === 'GROUP' ? mockGroups : mockUsers;
  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleToggle = (id: string) => {
    const newSelected = selected.includes(id)
      ? selected.filter((itemId) => itemId !== id)
      : [...selected, id];
    setSelected(newSelected);
  };

  const handleSave = () => {
    onSelectionChange(selected);
    onClose();
  };

  return (
    <Card className="w-[600px]">
      <CardHeader>
        <CardTitle>
          Select {type === 'GROUP' ? 'Groups' : 'Users'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={`Search ${type === 'GROUP' ? 'groups' : 'users'}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>

        <ScrollArea className="h-[300px] rounded-md border p-4">
          <div className="space-y-4">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center space-x-2"
              >
                <Checkbox
                  id={item.id}
                  checked={selected.includes(item.id)}
                  onCheckedChange={() => handleToggle(item.id)}
                />
                <Label
                  htmlFor={item.id}
                  className="flex flex-1 cursor-pointer items-center justify-between"
                >
                  <span>{item.name}</span>
                  {type === 'INDIVIDUAL' && (
                    <span className="text-sm text-muted-foreground">
                      {(item as any).email}
                    </span>
                  )}
                </Label>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            {selected.length} {type === 'GROUP' ? 'groups' : 'users'} selected
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save Selection
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 