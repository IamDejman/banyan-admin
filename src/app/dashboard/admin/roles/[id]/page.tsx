'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';

// Mock data for permissions
const permissions = [
  {
    category: 'Claims',
    permissions: [
      { id: 'VIEW_CLAIMS', label: 'View Claims' },
      { id: 'MANAGE_CLAIMS', label: 'Manage Claims' },
      { id: 'REVIEW_CLAIMS', label: 'Review Claims' },
      { id: 'APPROVE_CLAIMS', label: 'Approve Claims' },
    ],
  },
  {
    category: 'Settlements',
    permissions: [
      { id: 'VIEW_SETTLEMENTS', label: 'View Settlements' },
      { id: 'PROCESS_SETTLEMENTS', label: 'Process Settlements' },
      { id: 'APPROVE_SETTLEMENTS', label: 'Approve Settlements' },
    ],
  },
  {
    category: 'Reports',
    permissions: [
      { id: 'VIEW_REPORTS', label: 'View Reports' },
      { id: 'GENERATE_REPORTS', label: 'Generate Reports' },
      { id: 'EXPORT_REPORTS', label: 'Export Reports' },
    ],
  },
  {
    category: 'Administration',
    permissions: [
      { id: 'MANAGE_USERS', label: 'Manage Users' },
      { id: 'MANAGE_ROLES', label: 'Manage Roles' },
      { id: 'MANAGE_SETTINGS', label: 'Manage Settings' },
    ],
  },
];

export default function RoleFormPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const isNewRole = params.id === 'new';
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    permissions: [] as string[],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    router.push('/dashboard/admin');
  };

  const togglePermission = (permissionId: string) => {
    setFormData((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(permissionId)
        ? prev.permissions.filter((id) => id !== permissionId)
        : [...prev.permissions, permissionId],
    }));
  };

  const toggleCategory = (category: string) => {
    const categoryPermissions = permissions
      .find((p) => p.category === category)
      ?.permissions.map((p) => p.id) || [];

    const allSelected = categoryPermissions.every((id) =>
      formData.permissions.includes(id)
    );

    setFormData((prev) => ({
      ...prev,
      permissions: allSelected
        ? prev.permissions.filter((id) => !categoryPermissions.includes(id))
        : [...new Set([...prev.permissions, ...categoryPermissions])],
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">
          {isNewRole ? 'Add New Role' : 'Edit Role'}
        </h1>
        <Button variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Role Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Role Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Permissions</h3>
                <div className="space-y-6">
                  {permissions.map((category) => (
                    <div key={category.category} className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`category-${category.category}`}
                          checked={category.permissions.every((p) =>
                            formData.permissions.includes(p.id)
                          )}
                          onCheckedChange={() => toggleCategory(category.category)}
                        />
                        <Label
                          htmlFor={`category-${category.category}`}
                          className="text-lg font-medium"
                        >
                          {category.category}
                        </Label>
                      </div>
                      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                        {category.permissions.map((permission) => (
                          <div
                            key={permission.id}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              id={permission.id}
                              checked={formData.permissions.includes(permission.id)}
                              onCheckedChange={() =>
                                togglePermission(permission.id)
                              }
                            />
                            <Label htmlFor={permission.id}>
                              {permission.label}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <Button type="submit" className="w-full sm:w-auto">
                  {isNewRole ? 'Create Role' : 'Save Changes'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
} 