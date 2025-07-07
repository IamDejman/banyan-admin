export type Permission = {
  id: string;
  name: string;
  description: string;
  resource: string;
  action: string;
  category: string;
};

export type Role = {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}; 