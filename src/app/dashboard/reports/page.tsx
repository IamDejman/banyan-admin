"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, BarChart3, Users, Shield, Activity, Mail, Send } from "lucide-react";
import { usePathname } from "next/navigation";

const reportTypes = [
  {
    value: "claims",
    label: "Claims Report",
    description: "Claims data and analytics",
    icon: FileText,
  },
  {
    value: "performance",
    label: "Performance Report",
    description: "Agent and system performance metrics",
    icon: BarChart3,
  },
  {
    value: "users",
    label: "Users Report",
    description: "User activity and management data",
    icon: Users,
  },
  {
    value: "audit",
    label: "Audit Logs Report",
    description: "System audit trails and security logs",
    icon: Shield,
  },
  {
    value: "activity",
    label: "Activity Report",
    description: "System activity and usage statistics",
    icon: Activity,
  },
];

export default function ReportsPage() {
  const pathname = usePathname();
  const [selectedReportType, setSelectedReportType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [email, setEmail] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);

  // Auto-select report type based on URL
  useEffect(() => {
    if (pathname.includes('/claims')) {
      setSelectedReportType('claims');
    } else if (pathname.includes('/performance')) {
      setSelectedReportType('performance');
    } else if (pathname.includes('/users')) {
      setSelectedReportType('users');
    } else if (pathname.includes('/system')) {
      setSelectedReportType('audit'); // Using audit for system reports
    }
  }, [pathname]);

  const selectedReport = reportTypes.find(report => report.value === selectedReportType);
  const IconComponent = selectedReport?.icon || FileText;


  const isFormValid = selectedReportType && startDate && endDate && email;

  function handleSendToEmail() {
    if (!isFormValid) {
      return;
    }
    
    setIsGenerating(true);
    setIsEmailSent(false);
    
    // Simulate sending report to email
    setTimeout(() => {
      setIsGenerating(false);
      setIsEmailSent(true);
      console.log(`Sending ${selectedReportType} report to ${email} from ${startDate} to ${endDate}`);
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setIsEmailSent(false);
      }, 3000);
    }, 2000);
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Reports</h1>
      </div>

      <Card className="p-4 sm:p-6">
        <div className="space-y-4 sm:space-y-6">
          <div>
            <h2 className="text-lg sm:text-xl font-semibold mb-4">Generate Report</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Report Type */}
              <div className="space-y-2">
                <Label htmlFor="reportType">Report Type *</Label>
                <Select value={selectedReportType} onValueChange={setSelectedReportType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select report type" />
                  </SelectTrigger>
                  <SelectContent>
                    {reportTypes.map((report) => (
                      <SelectItem key={report.value} value={report.value}>
                        <div className="flex items-center gap-2">
                          <report.icon className="h-4 w-4" />
                          <span>{report.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Email Address */}
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full"
                />
              </div>

              {/* Start Date */}
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date *</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full"
                />
              </div>

              {/* End Date */}
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date *</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full"
                />
              </div>
            </div>

            {/* Send to Email Button */}
            <div className="mt-6">
              <Button 
                onClick={handleSendToEmail}
                disabled={!isFormValid || isGenerating}
                className="w-full sm:w-auto"
              >
                {isGenerating ? (
                  <>
                    <Mail className="h-4 w-4 mr-2" />
                    Sending Report...
                  </>
                ) : isEmailSent ? (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Report Sent!
                  </>
                ) : (
                  <>
                    <Mail className="h-4 w-4 mr-2" />
                    Send to Email
                  </>
                )}
              </Button>
              {isEmailSent && (
                <p className="text-sm text-green-600 mt-2">
                  Report has been sent to {email}
                </p>
              )}
            </div>

          </div>

          {/* Report Preview */}
          {selectedReport && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <IconComponent className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">{selectedReport.label}</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">{selectedReport.description}</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-3 rounded border">
                  <div className="text-2xl font-bold text-primary">1,247</div>
                  <div className="text-xs text-muted-foreground">Total Records</div>
                </div>
                <div className="bg-white p-3 rounded border">
                  <div className="text-2xl font-bold text-green-600">₦2.4M</div>
                  <div className="text-xs text-muted-foreground">Total Value</div>
                </div>
                <div className="bg-white p-3 rounded border">
                  <div className="text-2xl font-bold text-blue-600">89%</div>
                  <div className="text-xs text-muted-foreground">Success Rate</div>
                </div>
                <div className="bg-white p-3 rounded border">
                  <div className="text-2xl font-bold text-orange-600">3.2 days</div>
                  <div className="text-xs text-muted-foreground">Avg Processing</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Report Types Information */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Available Reports</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reportTypes.map((report) => {
            const Icon = report.icon;
            return (
              <div key={report.value} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3 mb-2">
                  <Icon className="h-5 w-5 text-primary" />
                  <h3 className="font-medium">{report.label}</h3>
                </div>
                <p className="text-sm text-muted-foreground">{report.description}</p>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
} 