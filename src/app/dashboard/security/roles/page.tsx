'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Role, Permission } from '@/lib/types/security';
import { useToast } from '@/components/ui/use-toast';
import { Plus, Settings, Shield, Users } from 'lucide-react';

// Mock data - replace with API calls
const mockRoles: Role[] = [
  {
    id: '1',
    name: 'Admin',
    description: 'Full system access',
    permissions: [
      {
        id: '1',
        name: 'Manage Users',
        description: 'Can create, read, update, and delete users',
        resource: 'users',
        action: 'MANAGE',
        createdAt: '2024-03-15T10:00:00Z',
        updatedAt: '2024-03-15T10:00:00Z',
      },
    ],
    isSystem: true,
    createdAt: '2024-03-15T10:00:00Z',
    updatedAt: '2024-03-15T10:00:00Z',
    createdBy: 'System',
    updatedBy: 'System',
  },
  {
    id: '2',
    name: 'Claims Manager',
    description: 'Can manage claims and workflows',
    permissions: [
      {
        id: '2',
        name: 'Manage Claims',
        description: 'Can create, read, update, and delete claims',
        resource: 'claims',
        action: 'MANAGE',
        createdAt: '2024-03-15T10:00:00Z',
        updatedAt: '2024-03-15T10:00:00Z',
      },
    ],
    isSystem: false,
    createdAt: '2024-03-15T10:00:00Z',
    updatedAt: '2024-03-15T10:00:00Z',
    createdBy: 'Admin',
    updatedBy: 'Admin',
  },
];

export default function RolesPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [roles, setRoles] = useState<Role[]>(mockRoles);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRoles = roles.filter((role) =>
    role.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateRole = () => {
    router.push('/dashboard/security/roles/new');
  };

  const handleEditRole = (roleId: string) => {
    router.push(`/dashboard/security/roles/${roleId}/edit`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Role Management</h1>
          <p className="text-muted-foreground">
            Manage user roles and their permissions
          </p>
        </div>
        <Button onClick={handleCreateRole}>
          <Plus className="h-4 w-4 mr-2" />
          Create Role
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Input
            placeholder="Search roles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
          <Users className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        </div>
      </div>

      <div className="grid gap-4">
        {filteredRoles.map((role) => (
          <Card key={role.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{role.name}</h3>
                    {role.isSystem && (
                      <Badge variant="secondary">System Role</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {role.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {role.permissions.map((permission) => (
                      <Badge
                        key={permission.id}
                        variant="outline"
                        className="flex items-center gap-1"
                      >
                        <Shield className="h-3 w-3" />
                        {permission.name}
                      </Badge>
                    ))}
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEditRole(role.id)}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 