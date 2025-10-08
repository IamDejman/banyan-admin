"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, ChevronRight, ChevronDown, X, Check } from "lucide-react";
import { 
  getPaymentConfigurations, 
  storePaymentConfiguration, 
  updatePaymentConfiguration, 
  togglePaymentConfigurationStatus,
  deletePaymentConfiguration
} from "@/app/services/dashboard";

// Interface for Payment Configuration
interface PaymentConfiguration {
  id: string | number;
  name: string;
  code: string;
  description: string;
  applicable_claim_types?: string;
  terms_and_conditions: string;
  active: number;
  created_at?: string;
  updated_at?: string;
}

interface PaymentConfigurationFormData {
  name: string;
  description: string;
  terms_and_conditions: string;
}

export default function PaymentConfigurationsClient() {
  const [paymentConfigurations, setPaymentConfigurations] = useState<PaymentConfiguration[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState<{ 
    mode: "create" | "edit" | "view"; 
    configuration?: PaymentConfiguration 
  } | null>(null);
  const [expandedRows, setExpandedRows] = useState<Set<string | number>>(new Set());

  // Fetch payment configurations
  const fetchPaymentConfigurations = async () => {
    try {
      setLoading(true);
      const response = await getPaymentConfigurations();
      console.log('Payment configurations API response:', response);
      
      let configurationsArray: PaymentConfiguration[] = [];
      if (response && typeof response === 'object' && 'data' in response && Array.isArray(response.data)) {
        configurationsArray = response.data;
      }
      
      setPaymentConfigurations(configurationsArray);
    } catch (error) {
      console.error('Error fetching payment configurations:', error);
      setPaymentConfigurations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaymentConfigurations();
  }, []);

  // Filter configurations based on search
  const filteredConfigurations = paymentConfigurations.filter((config) => {
    if (!search) return true;
    const searchLower = search.toLowerCase();
    return (
      config.name.toLowerCase().includes(searchLower) ||
      config.code.toLowerCase().includes(searchLower) ||
      config.description.toLowerCase().includes(searchLower)
    );
  });

  // Handle create/update
  const handleSubmit = async (formData: PaymentConfigurationFormData) => {
    try {
      // Generate code from name (uppercase, replace spaces with underscores)
      const generatedCode = formData.name.toUpperCase().replace(/\s+/g, '_');
      
      // Always set active to 1 (enabled) when creating or updating
      const payload = { 
        ...formData, 
        code: generatedCode,
        active: 1 
      };
      
      if (modal?.mode === "create") {
        await storePaymentConfiguration(payload);
      } else if (modal?.mode === "edit" && modal.configuration) {
        await updatePaymentConfiguration(modal.configuration.id.toString(), payload);
      }
      
      fetchPaymentConfigurations();
      setModal(null);
    } catch (error) {
      console.error('Error saving payment configuration:', error);
    }
  };

  // Handle toggle status (enable/disable)
  const handleToggleStatus = async (id: string | number) => {
    // Find the configuration to show appropriate confirmation message
    const config = paymentConfigurations.find(c => c.id === id);
    
    if (!config) return;
    
    const action = config.active === 1 ? 'disable' : 'enable';
    const confirmMessage = `Are you sure you want to ${action} "${config.name}"?`;
    
    if (!window.confirm(confirmMessage)) {
      return;
    }
    
    try {
      await togglePaymentConfigurationStatus(id.toString());
      fetchPaymentConfigurations();
    } catch (error) {
      console.error('Error toggling payment configuration status:', error);
      
      // Show user-friendly error message
      const errorResponse = error as { response?: { data?: { message?: string } }; message?: string };
      const errorMessage = errorResponse?.response?.data?.message || 
                         errorResponse?.message || 
                         'Failed to update payment configuration status. Please try again.';
      alert(`Error: ${errorMessage}`);
    }
  };

  // Handle delete
  const handleDelete = async (id: string | number) => {
    // Find the configuration to check if it's active
    const config = paymentConfigurations.find(c => c.id === id);
    
    if (config && config.active === 1) {
      alert('Cannot delete active payment configuration. Please deactivate it first.');
      return;
    }

    if (window.confirm('Are you sure you want to delete this payment configuration?')) {
      try {
        await deletePaymentConfiguration(id.toString());
        fetchPaymentConfigurations();
      } catch (error) {
        console.error('Error deleting payment configuration:', error);
        
        // Show user-friendly error message
        const errorResponse = error as { response?: { data?: { message?: string } }; message?: string };
        const errorMessage = errorResponse?.response?.data?.message || 
                           errorResponse?.message || 
                           'Failed to delete payment configuration. Please try again.';
        alert(`Error: ${errorMessage}`);
      }
    }
  };

  // Toggle expanded row
  const toggleExpandedRow = (id: string | number) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Payment Configurations</h1>
          <p className="text-muted-foreground text-sm md:text-base">Manage payment configuration settings</p>
        </div>
        <Button onClick={() => setModal({ mode: "create" })} className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Add Configuration
        </Button>
      </div>

      {/* Search */}
      <Card>
        <div className="p-4 md:p-6">
          <Input
            placeholder="Search by name or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-md"
          />
        </div>
      </Card>

      {/* Table */}
      <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-8"></TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="w-24">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    Loading payment configurations...
                  </TableCell>
                </TableRow>
              ) : filteredConfigurations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    No payment configurations found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredConfigurations.map((config) => {
                  const isExpanded = expandedRows.has(config.id);
                  return (
                    <React.Fragment key={config.id}>
                      {/* Main row */}
                      <TableRow 
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => toggleExpandedRow(config.id)}
                      >
                        <TableCell>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 w-6 p-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleExpandedRow(config.id);
                            }}
                          >
                            {isExpanded ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </Button>
                        </TableCell>
                        <TableCell className="font-medium">
                          <div className="min-w-0">
                            <div className="truncate">{config.name}</div>
                          </div>
                        </TableCell>
                        <TableCell className="max-w-xs md:max-w-md">
                          <div className="break-words text-sm">
                            {config.description || "No description"}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setModal({ mode: "edit", configuration: config })}
                              title="Edit"
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleToggleStatus(config.id)}
                              title={config.active === 1 ? "Disable" : "Enable"}
                              className={config.active === 1 ? "text-red-600 hover:text-red-700" : "text-green-600 hover:text-green-700"}
                            >
                              {config.active === 1 ? (
                                <X className="h-3 w-3" />
                              ) : (
                                <Check className="h-3 w-3" />
                              )}
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDelete(config.id)}
                              title={config.active === 1 ? "Cannot delete active configuration" : "Delete"}
                              disabled={config.active === 1}
                              className={config.active === 1 ? "opacity-50 cursor-not-allowed" : ""}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                      
                      {/* Expanded row */}
                      {isExpanded && (
                        <TableRow>
                          <TableCell></TableCell>
                          <TableCell colSpan={3} className="bg-muted/30">
                            <div className="p-4 space-y-3">
                              <div>
                                <h4 className="font-medium text-sm mb-1">Code</h4>
                                <Badge variant="outline">{config.code}</Badge>
                              </div>
                              {config.terms_and_conditions && (
                                <div>
                                  <h4 className="font-medium text-sm mb-1">Terms and Conditions</h4>
                                  <p className="text-sm text-muted-foreground">{config.terms_and_conditions}</p>
                                </div>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Modal */}
      {modal && (
        <PaymentConfigurationModal
          mode={modal.mode}
          configuration={modal.configuration}
          onSubmit={handleSubmit}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}

// Modal Component
interface PaymentConfigurationModalProps {
  mode: "create" | "edit" | "view";
  configuration?: PaymentConfiguration;
  onSubmit: (data: PaymentConfigurationFormData) => void;
  onClose: () => void;
}

function PaymentConfigurationModal({ 
  mode, 
  configuration, 
  onSubmit, 
  onClose 
}: PaymentConfigurationModalProps) {
  const [formData, setFormData] = useState<PaymentConfigurationFormData>({
    name: "",
    description: "",
    terms_and_conditions: "",
  });

  useEffect(() => {
    if (configuration) {
      setFormData({
        name: configuration.name,
        description: configuration.description,
        terms_and_conditions: configuration.terms_and_conditions,
      });
    }
  }, [configuration]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const isViewMode = mode === "view";

  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-4 md:p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">
            {mode === "create" ? "Create Payment Configuration" : 
             mode === "edit" ? "Edit Payment Configuration" : 
             "Payment Configuration Details"}
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            ×
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name *</label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              disabled={isViewMode}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <Input
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              disabled={isViewMode}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Terms and Conditions</label>
            <textarea
              className="w-full p-2 border rounded-md"
              rows={4}
              value={formData.terms_and_conditions}
              onChange={(e) => setFormData({ ...formData, terms_and_conditions: e.target.value })}
              disabled={isViewMode}
            />
          </div>

          {!isViewMode && (
            <div className="flex gap-2 justify-end pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                {mode === "create" ? "Create" : "Update"}
              </Button>
            </div>
          )}

          {isViewMode && (
            <div className="flex justify-end pt-4">
              <Button onClick={onClose}>
                Close
              </Button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
