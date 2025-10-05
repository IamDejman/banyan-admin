"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Eye, Check, X, ChevronDown, ChevronRight } from "lucide-react";
import CustomerForm from "./CustomerForm";
import { Tooltip } from "@/components/ui/tooltip";
import type { Customer, UserStatus } from "@/lib/types/user";

// Mock customer data
const mockCustomers: Customer[] = [
  {
    id: "1",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@email.com",
    phone: "+2348012345678",
    status: "active" as UserStatus,
    createdAt: "2024-01-01",
    lastLogin: "2024-01-20T12:30:00",
    role: "customer" as const,
    dateOfBirth: "1990-01-01",
    address: "Lagos, Nigeria",
    emergencyContact: {
      name: "Jane Doe",
      phone: "+2348012345679",
      relationship: "Spouse"
    },
    claims: ["CLM-001", "CLM-002"],
    preferences: {
      notifications: true,
      language: "en"
    }
  },
  {
    id: "2",
    firstName: "Jane",
    lastName: "Smith",
    email: "jane.smith@email.com",
    phone: "+2348098765432",
    status: "active" as UserStatus,
    createdAt: "2024-01-02",
    lastLogin: "2024-01-19T15:20:00",
    role: "customer" as const,
    dateOfBirth: "1985-05-15",
    address: "Abuja, Nigeria",
    emergencyContact: undefined,
    claims: ["CLM-003", "CLM-004", "CLM-005"],
    preferences: {
      notifications: false,
      language: "en"
    }
  },
  {
    id: "3",
    firstName: "Michael",
    lastName: "Johnson",
    email: "michael.johnson@email.com",
    phone: "+2348055555555",
    status: "active" as UserStatus,
    createdAt: "2024-01-03",
    lastLogin: "2024-01-18T09:10:00",
    role: "customer" as const,
    dateOfBirth: "1988-12-20",
    address: "Port Harcourt, Nigeria",
    emergencyContact: {
      name: "Sarah Johnson",
      phone: "+2348055555556",
      relationship: "Sister"
    },
    claims: ["CLM-006", "CLM-007", "CLM-008"],
    preferences: {
      notifications: true,
      language: "en"
    }
  },
];

export default function CustomersPage() {
  const [customers, setCustomers] = useState(mockCustomers);
  const [modal, setModal] = useState<{ mode: "create" | "edit"; customer?: typeof mockCustomers[0] } | null>(null);
  const [expandedRows, setExpandedRows] = useState<string[]>([]);
  const [search, setSearch] = useState("");

  const filteredCustomers = customers.filter((customer) =>
    customer.firstName.toLowerCase().includes(search.toLowerCase()) ||
    customer.lastName.toLowerCase().includes(search.toLowerCase()) ||
    customer.email.toLowerCase().includes(search.toLowerCase())
  );

  function handleCreateCustomer(customerData: { firstName: string; lastName: string; email: string; phoneNumber: string }) {
    const newCustomer: Customer = {
      id: `customer-${Date.now()}`,
      firstName: customerData.firstName,
      lastName: customerData.lastName,
      email: customerData.email,
      phone: customerData.phoneNumber,
      role: "customer",
      status: "active",
      dateOfBirth: "1990-01-01",
      address: "Lagos, Nigeria",
      emergencyContact: undefined,
      claims: [],
      preferences: {
        notifications: true,
        language: "en"
      },
      createdAt: new Date().toISOString().split('T')[0],
      lastLogin: undefined
    };
    setCustomers([newCustomer, ...customers]);
    setModal(null);
  }

  function handleUpdateCustomer(customerData: { firstName: string; lastName: string; email: string; phoneNumber: string }) {
    if (!modal?.customer) return;
    
    const updatedCustomer: Customer = {
      ...modal.customer,
      firstName: customerData.firstName,
      lastName: customerData.lastName,
      email: customerData.email,
      phone: customerData.phoneNumber,
    };
    
    setCustomers(prev => prev.map(customer => 
      customer.id === modal.customer!.id ? updatedCustomer : customer
    ));
    setModal(null);
  }

  function handleToggleStatus(customerId: string) {
    setCustomers(prev => prev.map(customer => 
      customer.id === customerId 
        ? { ...customer, status: customer.status === "active" ? "inactive" : "active" }
        : customer
    ));
  }

  function handleToggleExpanded(customerId: string) {
    setExpandedRows(prev => 
      prev.includes(customerId) 
        ? prev.filter(id => id !== customerId)
        : [...prev, customerId]
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Customers</h1>
        </div>
        <Button onClick={() => setModal({ mode: "create" })}>
          <Plus className="h-4 w-4 mr-2" />
          Add Customer
        </Button>
      </div>

      <div className="flex gap-4 items-center">
        <Input
          placeholder="Search by name or email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-64"
        />
      </div>

      <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12"></TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email Address</TableHead>
                <TableHead>Phone Number</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    No customers found.
                  </TableCell>
                </TableRow>
              )}
              {filteredCustomers.map((customer) => (
                <React.Fragment key={customer.id}>
                  <TableRow>
                    <TableCell>
                      <Tooltip content={expandedRows.includes(customer.id) ? "Collapse Details" : "Expand Details"}>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleToggleExpanded(customer.id)}
                        >
                          {expandedRows.includes(customer.id) ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </Button>
                      </Tooltip>
                    </TableCell>
                    <TableCell className="font-medium">
                      {customer.firstName} {customer.lastName}
                    </TableCell>
                    <TableCell>{customer.email}</TableCell>
                    <TableCell>{customer.phone}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Tooltip content="View Details">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleToggleExpanded(customer.id)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Tooltip>
                        <Tooltip content={customer.status === "active" ? "Disable Customer" : "Enable Customer"}>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleToggleStatus(customer.id)}
                            className={customer.status === "active" ? "text-red-500" : "text-green-600"}
                          >
                            {customer.status === "active" ? (
                              <X className="h-4 w-4" />
                            ) : (
                              <Check className="h-4 w-4" />
                            )}
                          </Button>
                        </Tooltip>
                      </div>
                    </TableCell>
                  </TableRow>
                  
                  {/* Expanded Row */}
                  {expandedRows.includes(customer.id) && (
                    <TableRow>
                      <TableCell colSpan={5} className="bg-muted/50">
                        <div className="p-4 space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div>
                              <h4 className="font-medium text-sm text-muted-foreground mb-1">Claims Summary</h4>
                              <div className="space-y-1">
                                <div className="flex justify-between">
                                  <span className="text-sm">Pending:</span>
                                  <Badge variant="secondary">{customer.claims.length}</Badge>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm">Settled:</span>
                                  <Badge variant="default">0</Badge>
                                </div>
                              </div>
                            </div>
                            
                            <div>
                              <h4 className="font-medium text-sm text-muted-foreground mb-1">BVN</h4>
                              <p className="text-sm font-mono">N/A</p>
                            </div>
                            
                            <div>
                              <h4 className="font-medium text-sm text-muted-foreground mb-1">Bank Details</h4>
                              <div className="space-y-1 text-sm">
                                <div><span className="font-medium">Bank:</span> N/A</div>
                                <div><span className="font-medium">Account:</span> N/A</div>
                                <div><span className="font-medium">Name:</span> N/A</div>
                              </div>
                            </div>
                            
                            <div>
                              <h4 className="font-medium text-sm text-muted-foreground mb-1">Status</h4>
                              <Badge variant={customer.status === "active" ? "default" : "secondary"}>
                                {customer.status === "active" ? "Active" : "Disabled"}
                              </Badge>
                            </div>
                            
                            <div>
                              <h4 className="font-medium text-sm text-muted-foreground mb-1">Last Login</h4>
                              <p className="text-sm">
                                {customer.lastLogin 
                                  ? `${new Date(customer.lastLogin).toLocaleDateString()} at ${new Date(customer.lastLogin).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`
                                  : "Never logged in"
                                }
                              </p>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {modal && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
          <div className="bg-white rounded shadow-lg p-6 w-full max-w-md relative">
            <Button
              size="icon"
              variant="ghost"
              className="absolute top-2 right-2"
              onClick={() => setModal(null)}
            >
              ×
            </Button>

            <h3 className="text-lg font-semibold mb-4">
              {modal.mode === "create" ? "Add New Customer" : "Edit Customer"}
            </h3>
            
            <CustomerForm
              customer={modal.customer}
              onSubmit={modal.mode === "create" ? handleCreateCustomer : handleUpdateCustomer}
              onCancel={() => setModal(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
} 