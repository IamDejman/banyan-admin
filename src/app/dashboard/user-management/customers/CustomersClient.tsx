"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronUp, ChevronDown, ChevronsUpDown, ChevronRight, X, Check, Edit, ChevronLeft } from "lucide-react";
import CustomerForm from "./CustomerForm";
import type { Customer } from "@/lib/types/user";
import { getCustomers, getAllUsers, createCustomer, disableUser, searchCustomers, editUser } from "@/app/services/dashboard";
// import { formatStatus, toSentenceCase } from "@/lib/utils/text-formatting";
import { useToast } from "@/components/ui/use-toast";
import { useDebounce } from "@/hooks/useDebounce";
import { Tooltip } from "@/components/ui/tooltip";

// Interface for API customer data
interface ApiCustomer {
  id: string | number;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  status?: string;
  role: string;
  created_at?: string;
  updated_at?: string;
  last_login?: string;
  date_of_birth?: string;
  address?: string;
  emergency_contact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  claims?: string[];
  preferences?: {
    notifications: boolean;
    language: string;
  };
  bvn_verification_status?: number;
  bank_name?: string;
  bank_account_number?: string;
  bank_account_name?: string;
}

// Function to transform API data to component format
const transformApiCustomer = (apiCustomer: ApiCustomer): Customer => ({
  id: String(apiCustomer.id),
  email: apiCustomer.email,
  firstName: apiCustomer.first_name,
  lastName: apiCustomer.last_name,
  phone: apiCustomer.phone || "",
  status: (apiCustomer.status as "active" | "inactive" | "suspended") || "active",
  createdAt: apiCustomer.created_at || new Date().toISOString().split('T')[0],
  lastLogin: (apiCustomer as { last_login_at?: string }).last_login_at,
  role: "customer",
  dateOfBirth: apiCustomer.date_of_birth || "1990-01-01",
  address: apiCustomer.address || "",
  emergencyContact: apiCustomer.emergency_contact,
  claims: apiCustomer.claims || [],
  preferences: apiCustomer.preferences || {
    notifications: true,
    language: "en"
  },
  bvnVerification: apiCustomer.bvn_verification_status || 0,
  bankName: apiCustomer.bank_name || "",
  bankAccountNumber: apiCustomer.bank_account_number || "",
  bankAccountName: apiCustomer.bank_account_name || ""
});

export default function CustomersClient() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [modal, setModal] = useState<{ mode: "add" | "edit"; customer: Customer | null } | null>(null);
  const [expandedRows, setExpandedRows] = useState<string[]>([]);
  const [sortField, setSortField] = useState<keyof Customer | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [searchLoading, setSearchLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 15;
  const { toast } = useToast();
  const debouncedSearch = useDebounce(search, 500);

  // Fetch customers when page changes
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        setError(null);
        let response;
        
        try {
          // Try the primary customers endpoint first
          console.log('Fetching customers from user management API...');
          response = await getCustomers();
          console.log('Primary customers response:', response);
        } catch (primaryError) {
          console.warn('Primary customers endpoint failed, trying alternative...', primaryError);
          try {
            // Try alternative endpoint to get all users
            response = await getAllUsers();
            console.log('All users response:', response);
            
            // Filter customers from all users on the client side
            if (response && response.data && Array.isArray(response.data)) {
              const customers = (response.data as unknown as { role: string }[]).filter((user: { role: string }) => user.role === 'customer');
              response = { ...response, data: customers };
            }
          } catch (altError) {
            console.error('Alternative endpoint also failed:', altError);
            throw altError;
          }
        }
        
        if (response?.data && Array.isArray(response.data)) {
          const transformedCustomers = (response.data as unknown as ApiCustomer[]).map(transformApiCustomer);
          setCustomers(transformedCustomers);
        } else {
          setCustomers([]);
        }
      } catch (err) {
        console.error('Failed to fetch customers:', err);
        toast({
          variant: "destructive",
          title: "Error loading customers",
          description: "Failed to load customers. Please try again.",
        });
        // Fallback to empty array on error
        setCustomers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, [currentPage]);

  // Handle debounced search
  useEffect(() => {
    if (debouncedSearch.trim()) {
      handleSearch(debouncedSearch);
    } else {
      // Reload all customers when search is cleared
      const fetchCustomers = async () => {
        try {
          setLoading(true);
          setError(null);
          let response;
          
          try {
            console.log('Fetching customers from user management API...');
            response = await getCustomers(currentPage, itemsPerPage);
            console.log('Primary customers response:', response);
          } catch (primaryError) {
            console.warn('Primary customers endpoint failed, trying alternative...', primaryError);
            try {
              response = await getAllUsers();
              console.log('All users response:', response);
              
              if (response && response.data && Array.isArray(response.data)) {
                const customers = (response.data as unknown as { role: string }[]).filter((user: { role: string }) => user.role === 'customer');
                response = { ...response, data: customers };
              }
            } catch (altError) {
              console.error('Alternative endpoint also failed:', altError);
              throw altError;
            }
          }
          
          if (response?.data && Array.isArray(response.data)) {
            const transformedCustomers = (response.data as unknown as ApiCustomer[]).map(transformApiCustomer);
            setCustomers(transformedCustomers);
            
            // Handle pagination metadata
            if ((response as { meta?: { last_page?: number; total?: number } }).meta) {
              setTotalPages((response as { meta?: { last_page?: number; total?: number } }).meta?.last_page || 1);
              setTotalItems((response as { meta?: { last_page?: number; total?: number } }).meta?.total || (response.data as unknown as Customer[]).length);
            } else {
              setTotalPages(1);
              setTotalItems((response.data as unknown as Customer[]).length);
            }
          } else {
            setCustomers([]);
            setTotalPages(1);
            setTotalItems(0);
          }
        } catch (err) {
          console.error('Failed to fetch customers:', err);
          toast({
            variant: "destructive",
            title: "Error loading customers",
            description: "Failed to load customers. Please try again.",
          });
          setCustomers([]);
        } finally {
          setLoading(false);
        }
      };
      fetchCustomers();
    }
  }, [debouncedSearch]);

  // Fetch customers when currentPage changes
  useEffect(() => {
    if (!search.trim()) {
      const fetchCustomers = async () => {
        try {
          setLoading(true);
          setError(null);
          let response;
          
          try {
            console.log('Fetching customers from user management API...');
            response = await getCustomers(currentPage, itemsPerPage);
            console.log('Primary customers response:', response);
          } catch (primaryError) {
            console.warn('Primary customers endpoint failed, trying alternative...', primaryError);
            try {
              response = await getAllUsers();
              console.log('All users response:', response);
              
              if (response && response.data && Array.isArray(response.data)) {
                const customers = (response.data as unknown as { role: string }[]).filter((user: { role: string }) => user.role === 'customer');
                response = { ...response, data: customers };
              }
            } catch (altError) {
              console.error('Alternative endpoint also failed:', altError);
              throw altError;
            }
          }
          
          if (response?.data && Array.isArray(response.data)) {
            const transformedCustomers = (response.data as unknown as ApiCustomer[]).map(transformApiCustomer);
            setCustomers(transformedCustomers);
            
            // Handle pagination metadata
            if ((response as { meta?: { last_page?: number; total?: number } }).meta) {
              setTotalPages((response as { meta?: { last_page?: number; total?: number } }).meta?.last_page || 1);
              setTotalItems((response as { meta?: { last_page?: number; total?: number } }).meta?.total || (response.data as unknown as Customer[]).length);
            } else {
              setTotalPages(1);
              setTotalItems((response.data as unknown as Customer[]).length);
            }
          } else {
            setCustomers([]);
            setTotalPages(1);
            setTotalItems(0);
          }
        } catch (err) {
          console.error('Failed to fetch customers:', err);
          toast({
            variant: "destructive",
            title: "Error loading customers",
            description: "Failed to load customers. Please try again.",
          });
          setCustomers([]);
        } finally {
          setLoading(false);
        }
      };
      fetchCustomers();
    }
  }, [currentPage]);

  const handleSearch = async (searchTerm: string) => {
    setSearchLoading(true);
    try {
      console.log('Searching customers with term:', searchTerm);
      const response = await searchCustomers(searchTerm);
      console.log('Search response:', response);
      
      if (response?.data && Array.isArray(response.data)) {
        const transformedCustomers = (response.data as unknown as ApiCustomer[]).map(transformApiCustomer);
        setCustomers(transformedCustomers);
      } else {
        setCustomers([]);
      }
    } catch (error) {
      console.error('Search failed:', error);
      toast({
        variant: "destructive",
        title: "Search failed",
        description: "Failed to search customers. Please try again.",
      });
      setCustomers([]);
    } finally {
      setSearchLoading(false);
    }
  };

  const filtered = customers.filter((customer) => {
    const matchesSearch = 
      customer.firstName.toLowerCase().includes(search.toLowerCase()) ||
      customer.lastName.toLowerCase().includes(search.toLowerCase()) ||
      customer.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || customer.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Sorting function
  const handleSort = (field: keyof Customer) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedCustomers = [...filtered].sort((a, b) => {
    if (!sortField) return 0;
    
    let aValue = a[sortField];
    let bValue = b[sortField];
    
    // Handle different data types
    if (typeof aValue === "string" && typeof bValue === "string") {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }
    
    if (sortField === "dateOfBirth") {
      aValue = calculateAge(a.dateOfBirth);
      bValue = calculateAge(b.dateOfBirth);
    }
    
    if (aValue != null && bValue != null) {
      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    }
    return 0;
  });

  const getSortIcon = (field: keyof Customer) => {
    if (sortField !== field) return <ChevronsUpDown className="h-4 w-4 text-gray-400" />;
    return sortDirection === "asc" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />;
  };

  async function handleAdd(customerData: { firstName: string; lastName: string; email: string; phoneNumber: string; password: string }) {
    try {
      setLoading(true);
      setError(null);
      
      // Call the API to create the customer
      const response = await createCustomer({
      email: customerData.email,
        first_name: customerData.firstName,
        last_name: customerData.lastName,
        password: customerData.password,
      role: "customer",
        phone: customerData.phoneNumber
      });

      // If we get here, the API call succeeded (200 response)
      if (response?.data) {
        // Transform the API response to our Customer format
        const newCustomer = transformApiCustomer(response.data);
    setCustomers(prev => [...prev, newCustomer]);
    setModal(null);
        toast({
          title: "Customer created successfully",
          description: `${customerData.firstName} ${customerData.lastName} has been added.`,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error creating customer",
          description: "Failed to create customer. Please try again.",
        });
      }
    } catch (err) {
      console.error('Failed to create customer:', err);
      toast({
        variant: "destructive",
        title: "Error creating customer",
        description: "Failed to create customer. Please check your input and try again.",
      });
    } finally {
      setLoading(false);
    }
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

  const handleToggleExpanded = (customerId: string) => {
    setExpandedRows(prev => 
      prev.includes(customerId) 
        ? prev.filter(id => id !== customerId)
        : [...prev, customerId]
    );
  };

  async function handleEdit(customerData: { firstName: string; lastName: string; email: string; phoneNumber: string }) {
    if (!modal?.customer) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Call the API to update the customer
      await editUser(modal.customer.id, {
        first_name: customerData.firstName,
        last_name: customerData.lastName,
        email: customerData.email,
        phone: customerData.phoneNumber,
        role: "customer"
      });
      
      // Update the local state
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
      
      toast({
        title: "Customer updated",
        description: `${customerData.firstName} ${customerData.lastName} has been updated successfully.`,
      });
    } catch (err) {
      console.error('Failed to update customer:', err);
      setError('Failed to update customer. Please try again.');
      toast({
        variant: "destructive",
        title: "Error updating customer",
        description: "Failed to update customer. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleToggleStatus(customer: Customer) {
    const action = customer.disabled ? 'enable' : 'disable';
    const confirmed = window.confirm(
      `Are you sure you want to ${action} ${customer.firstName} ${customer.lastName}?`
    );

    if (!confirmed) return;

    try {
      setLoading(true);
      setError(null);
      
      // Call the API to disable/enable the customer
      await disableUser(customer.id);
      
      // Update the local state
      const newStatus = customer.disabled ? "active" : "inactive";
      setCustomers(prev => prev.map(c => 
        c.id === customer.id 
          ? { ...c, disabled: !c.disabled, status: newStatus }
          : c
      ));
      
      toast({
        title: `Customer ${newStatus === "active" ? "enabled" : "disabled"}`,
        description: `${customer.firstName} ${customer.lastName} has been ${newStatus === "active" ? "enabled" : "disabled"}.`,
      });
    } catch (err) {
      console.error('Failed to toggle customer status:', err);
      toast({
        variant: "destructive",
        title: "Error updating customer status",
        description: "Failed to update customer status. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Customers</h2>
        <Button onClick={() => setModal({ mode: "add", customer: null })}>Add Customer</Button>
      </div>
      
      <Card className="overflow-hidden">
        <div className="p-4 border-b">
          <div className="flex gap-3 items-center">
        <Input
          placeholder="Search by name or email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
              className="flex-1 max-w-md h-8 text-sm"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32 h-8 text-sm">
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
        </div>
        {(loading || searchLoading) ? (
          <div className="p-8 text-center">
            <div className="text-muted-foreground">
              {searchLoading ? "Searching customers..." : "Loading customers..."}
            </div>
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <div className="text-red-600 mb-4">{error}</div>
            <Button onClick={() => window.location.reload()} variant="outline">
              Retry
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto min-w-full">
            <Table className="min-w-[600px]">
            <TableHeader>
                <TableRow className="border-b bg-muted/50">
                  <TableHead className="w-12"></TableHead>
                  <TableHead className="min-w-[150px] font-semibold">
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("firstName")}
                      className="h-auto p-0 font-semibold hover:bg-transparent text-xs"
                    >
                      Name {getSortIcon("firstName")}
                    </Button>
                  </TableHead>
                  <TableHead className="min-w-[200px] font-semibold">
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("email")}
                      className="h-auto p-0 font-semibold hover:bg-transparent text-xs"
                    >
                      Email {getSortIcon("email")}
                    </Button>
                  </TableHead>
                  <TableHead className="min-w-[130px] font-semibold text-xs">Phone Number</TableHead>
                  <TableHead className="min-w-[70px] font-semibold text-center text-xs">Claims</TableHead>
                  <TableHead className="min-w-[180px] font-semibold text-center text-xs">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 && (
                <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                      <div className="flex flex-col items-center gap-2">
                        <div className="text-lg">No customers found</div>
                        <div className="text-sm">Try adjusting your search or filter criteria</div>
                      </div>
                  </TableCell>
                </TableRow>
              )}
              {sortedCustomers.map((customer, index) => (
                <React.Fragment key={customer.id}>
                  <TableRow className={`${index % 2 === 0 ? 'bg-white' : 'bg-muted/20'} hover:bg-muted/40 transition-colors`}>
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
                    <TableCell className="py-2">
                      <div className="font-medium text-sm text-gray-900">{customer.firstName} {customer.lastName}</div>
                </TableCell>
                    <TableCell className="py-2">
                      <div className="text-xs text-gray-600" title={customer.email}>{customer.email}</div>
                </TableCell>
                    <TableCell className="py-2">
                      <div className="text-xs text-gray-700">{customer.phone || 'N/A'}</div>
                </TableCell>
                    <TableCell className="py-2 text-center">
                      <Badge 
                        variant={customer.claims.length > 0 ? "default" : "secondary"} 
                        className="px-2 py-0.5 text-xs font-medium h-5"
                      >
                        {customer.claims.length}
                  </Badge>
                </TableCell>
                    <TableCell className="py-2">
                      <div className="flex items-center justify-center gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => setModal({ mode: "edit", customer })}
                          className="p-1 h-6 w-6 text-blue-600 hover:text-blue-700"
                          title="Edit Customer"
                        >
                          <Edit className="h-3 w-3" />
                  </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleToggleStatus(customer)}
                          className={`p-1 h-6 w-6 ${customer.status === "active" ? "text-red-500 hover:text-red-600" : "text-green-600 hover:text-green-700"}`}
                        >
                          {customer.status === "active" ? (
                            <X className="h-3 w-3" />
                          ) : (
                            <Check className="h-3 w-3" />
                          )}
                  </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                  
                  {/* Expanded Row */}
                  {expandedRows.includes(customer.id) && (
                    <TableRow>
                      <TableCell colSpan={6} className="bg-muted/50">
                        <div className="p-4">
                          <ul className="space-y-2">
                            <li className="flex items-center py-1">
                              <span className="text-sm font-medium text-gray-600 w-32">BVN Verification:</span>
                              <span className="text-sm text-gray-900 ml-4">
                                {customer.bvnVerification === 1 ? (
                                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    Verified
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                    Not Verified
                                  </span>
                                )}
                              </span>
                            </li>
                            <li className="flex items-center py-1">
                              <span className="text-sm font-medium text-gray-600 w-32">Bank Account Name:</span>
                              <span className="text-sm text-gray-900 ml-4">{customer.bankAccountName || 'N/A'}</span>
                            </li>
                            <li className="flex items-center py-1">
                              <span className="text-sm font-medium text-gray-600 w-32">Bank Account Number:</span>
                              <span className="text-sm text-gray-900 ml-4">{customer.bankAccountNumber || 'N/A'}</span>
                            </li>
                            <li className="flex items-center py-1">
                              <span className="text-sm font-medium text-gray-600 w-32">Bank Name:</span>
                              <span className="text-sm text-gray-900 ml-4">{customer.bankName || 'N/A'}</span>
                            </li>
                            <li className="flex items-center py-1">
                              <span className="text-sm font-medium text-gray-600 w-32">Last Login:</span>
                              <span className="text-sm text-gray-900 ml-4">
                                {customer.lastLogin ? 
                                  new Date(customer.lastLogin).toLocaleDateString('en-GB', {
                                    day: '2-digit',
                                    month: 'short',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    hour12: false
                                  }).replace(/,/g, '') : 'Never'
                                }
                              </span>
                            </li>
                            <li className="flex items-center py-1">
                              <span className="text-sm font-medium text-gray-600 w-32">Created Date:</span>
                              <span className="text-sm text-gray-900 ml-4">
                                {new Date(customer.createdAt).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </span>
                            </li>
                          </ul>
                        </div>
                </TableCell>
              </TableRow>
                  )}
                </React.Fragment>
            ))}
            </TableBody>
          </Table>
          </div>
        )}
        
        {/* Pagination Controls */}
        {!loading && !searchLoading && totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t">
            <div className="text-sm text-muted-foreground">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} customers
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              
              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(pageNum)}
                      className="w-8 h-8 p-0"
                    >
                      {pageNum}
                    </Button>
                  );
                })}
                {totalPages > 5 && (
                  <>
                    <span className="text-muted-foreground">...</span>
                    <Button
                      variant={currentPage === totalPages ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(totalPages)}
                      className="w-8 h-8 p-0"
                    >
                      {totalPages}
                    </Button>
                  </>
                )}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Modal for Add/Edit Customer */}

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
                  customer={undefined}
                  onSubmit={handleAdd}
                  onCancel={() => setModal(null)}
                />
              </>
            )}
            {modal.mode === "edit" && (
              <>
                <h3 className="text-lg font-semibold mb-4">Edit Customer</h3>
                <CustomerForm
                  customer={modal.customer!}
                  onSubmit={handleEdit}
                  onCancel={() => setModal(null)}
                />
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 