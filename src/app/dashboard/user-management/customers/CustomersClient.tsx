"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import CustomerForm from "./CustomerForm";
import type { Customer } from "@/lib/types/user";

const initialMockCustomers: Customer[] = [
  {
    id: "1",
    email: "customer1@example.com",
    firstName: "David",
    lastName: "Brown",
    phone: "+2348012345678",
    status: "active",
    createdAt: "2024-01-15",
    lastLogin: "2024-01-20T10:30:00Z",
    role: "customer",
    dateOfBirth: "1985-03-15",
    address: "123 Main Street, Lagos, Nigeria",
    emergencyContact: {
      name: "Sarah Brown",
      phone: "+2348098765432",
      relationship: "Spouse"
    },
    claims: ["CLM001", "CLM002"],
    preferences: {
      notifications: true,
      language: "English"
    }
  },
  {
    id: "2",
    email: "customer2@example.com",
    firstName: "Maria",
    lastName: "Garcia",
    phone: "+2348098765432",
    status: "active",
    createdAt: "2024-01-10",
    lastLogin: "2024-01-19T14:20:00Z",
    role: "customer",
    dateOfBirth: "1990-07-22",
    address: "456 Oak Avenue, Abuja, Nigeria",
    claims: ["CLM003"],
    preferences: {
      notifications: false,
      language: "English"
    }
  },
];

export default function CustomersClient() {
  const [customers, setCustomers] = useState<Customer[]>(initialMockCustomers);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [modal, setModal] = useState<{ mode: "add" | "edit" | "view"; customer: Customer | null } | null>(null);

  const filtered = customers.filter((customer) => {
    const matchesSearch = 
      customer.firstName.toLowerCase().includes(search.toLowerCase()) ||
      customer.lastName.toLowerCase().includes(search.toLowerCase()) ||
      customer.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || customer.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  function handleAdd(newCustomer: Omit<Customer, "id" | "createdAt">) {
    setCustomers((prev) => [
      { 
        ...newCustomer, 
        id: (Math.random() * 100000).toFixed(0),
        createdAt: new Date().toISOString().split('T')[0]
      },
      ...prev,
    ]);
    setModal(null);
  }

  function handleEdit(updated: Omit<Customer, "id" | "createdAt">) {
    setCustomers((prev) => prev.map((customer) => 
      customer.id === modal?.customer?.id ? { ...customer, ...updated } : customer
    ));
    setModal(null);
  }

  function calculateAge(dateOfBirth: string) {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Customers</h2>
        <Button onClick={() => setModal({ mode: "add", customer: null })}>Add Customer</Button>
      </div>
      
      <div className="flex gap-4 items-center">
        <Input
          placeholder="Search by name or email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-64"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="suspended">Suspended</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Age</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Claims</TableHead>
              <TableHead>Preferences</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground">
                  No customers found.
                </TableCell>
              </TableRow>
            )}
            {filtered.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{customer.firstName} {customer.lastName}</div>
                    <div className="text-sm text-muted-foreground">{customer.email}</div>
                  </div>
                </TableCell>
                <TableCell>{calculateAge(customer.dateOfBirth)} years</TableCell>
                <TableCell>
                  <div className="text-sm">
                    <div>{customer.phone}</div>
                    {customer.emergencyContact && (
                      <div className="text-muted-foreground">EC: {customer.emergencyContact.name}</div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">{customer.claims.length} claims</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <Badge variant={customer.preferences.notifications ? "default" : "outline"} className="text-xs">
                      {customer.preferences.notifications ? "Notifications ON" : "Notifications OFF"}
                    </Badge>
                    <Badge variant="outline" className="text-xs">{customer.preferences.language}</Badge>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={customer.status === "active" ? "default" : "secondary"}>
                    {customer.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button size="sm" variant="outline" onClick={() => setModal({ mode: "view", customer })}>
                    View
                  </Button>
                  <Button size="sm" variant="outline" className="ml-2" onClick={() => setModal({ mode: "edit", customer })}>
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {modal && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
          <div className="bg-white rounded shadow-lg p-6 w-full max-w-2xl relative max-h-[90vh] overflow-y-auto">
            <Button size="icon" variant="ghost" className="absolute top-2 right-2" onClick={() => setModal(null)}>
              ×
            </Button>
            {modal.mode === "add" && (
              <>
                <h3 className="text-lg font-semibold mb-4">Add Customer</h3>
                <CustomerForm
                  initialData={{}}
                  onSave={handleAdd}
                  onCancel={() => setModal(null)}
                />
              </>
            )}
            {modal.mode === "edit" && (
              <>
                <h3 className="text-lg font-semibold mb-4">Edit Customer</h3>
                <CustomerForm
                  initialData={modal.customer!}
                  onSave={handleEdit}
                  onCancel={() => setModal(null)}
                />
              </>
            )}
            {modal.mode === "view" && (
              <>
                <h3 className="text-lg font-semibold mb-4">Customer Details</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="font-medium">Name:</span> {modal.customer!.firstName} {modal.customer!.lastName}
                    </div>
                    <div>
                      <span className="font-medium">Age:</span> {calculateAge(modal.customer!.dateOfBirth)} years
                    </div>
                    <div>
                      <span className="font-medium">Email:</span> {modal.customer!.email}
                    </div>
                    <div>
                      <span className="font-medium">Phone:</span> {modal.customer!.phone}
                    </div>
                    <div>
                      <span className="font-medium">Date of Birth:</span> {modal.customer!.dateOfBirth}
                    </div>
                    <div>
                      <span className="font-medium">Status:</span> 
                      <Badge variant={modal.customer!.status === "active" ? "default" : "secondary"} className="ml-2">
                        {modal.customer!.status}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <span className="font-medium">Address:</span>
                    <div className="mt-1">{modal.customer!.address}</div>
                  </div>
                  {modal.customer!.emergencyContact && (
                    <div>
                      <span className="font-medium">Emergency Contact:</span>
                      <div className="mt-1 grid grid-cols-3 gap-4">
                        <div>Name: {modal.customer!.emergencyContact.name}</div>
                        <div>Phone: {modal.customer!.emergencyContact.phone}</div>
                        <div>Relationship: {modal.customer!.emergencyContact.relationship}</div>
                      </div>
                    </div>
                  )}
                  <div>
                    <span className="font-medium">Claims:</span>
                    <div className="mt-2">
                      {modal.customer!.claims.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {modal.customer!.claims.map(claim => (
                            <Badge key={claim} variant="secondary">{claim}</Badge>
                          ))}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">No claims</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <span className="font-medium">Preferences:</span>
                    <div className="mt-2 grid grid-cols-2 gap-4">
                      <div>
                        <Badge variant={modal.customer!.preferences.notifications ? "default" : "outline"}>
                          {modal.customer!.preferences.notifications ? "Notifications ON" : "Notifications OFF"}
                        </Badge>
                      </div>
                      <div>
                        <Badge variant="outline">Language: {modal.customer!.preferences.language}</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="font-medium">Created:</span> {modal.customer!.createdAt}
                    </div>
                    <div>
                      <span className="font-medium">Last Login:</span> {modal.customer!.lastLogin ? new Date(modal.customer!.lastLogin).toLocaleString() : "Never"}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 justify-end mt-6">
                  <Button variant="outline" onClick={() => setModal(null)}>Close</Button>
                  <Button onClick={() => setModal({ mode: "edit", customer: modal.customer })}>Edit</Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 