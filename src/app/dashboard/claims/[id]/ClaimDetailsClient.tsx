'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  User,
  Calendar,
  FileText,
  CheckCircle,
  AlertCircle,
  Clock,
  Eye,
  X,
  Send,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';
import { getClaimById, approveClaim, requestAdditionalInformation } from '@/app/services/dashboard';
import { ApiError } from '@/lib/types/settlement';

// Define proper types for API response data
interface ApiClaimDocument {
  id: string;
  document_type: string;
  document_uploaded: boolean;
  created_at: string;
  document_url: string;
}

interface ApiClaimHistory {
  created_at: string;
  description: string;
  status: string;
}

interface ApiClaimClient {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
}

interface ApiClaimTypeDetails {
  name: string;
}

interface ApiClaim {
  claim_number: string;
  client: ApiClaimClient;
  submission_date: string;
  claim_type_details: ApiClaimTypeDetails;
  status: string;
  estimated_value: number;
  description: string;
  incident_location: string;
  incident_date: string;
  documents: ApiClaimDocument[];
  claim_history: ApiClaimHistory[];
}

interface TransformedClaimDocument {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadedDate: string;
  isUploaded: boolean;
  document_url: string;
}

interface TransformedClaimTimeline {
  date: string;
  action: string;
  description: string;
}

interface TransformedClaimData {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  submissionDate: string;
  claimType: string;
  status: string;
  documentStatus: number;
  estimatedValue: number;
  description: string;
  incidentLocation: string;
  incidentDate: string;
  documents: TransformedClaimDocument[];
  timeline: TransformedClaimTimeline[];
  daysSinceSubmission: number;
}

interface ClaimDetailsClientProps {
  claimId: string;
}

export default function ClaimDetailsClient({ claimId }: ClaimDetailsClientProps) {
  const [claimData, setClaimData] = useState<ApiClaim | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [showRequestInfoModal, setShowRequestInfoModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  
  // Request info form state
  const [requestType, setRequestType] = useState<'document' | 'question'>('document');
  const [documentName, setDocumentName] = useState('');
  const [question, setQuestion] = useState('');

  const fetchClaimData = async () => {
      setLoading(true);
      try {
        console.log('Fetching claim with ID:', claimId);
        console.log('API endpoint will be: /admin/claims/show/' + claimId);
        const res = await getClaimById(claimId);
        console.log('Single claim response:', res);
        console.log('Response type:', typeof res);
        console.log('Response keys:', res ? Object.keys(res) : 'null');

        // Helper function to safely extract claim data
        const extractClaimData = (response: unknown): ApiClaim | null => {
          console.log('Raw API response:', response);
          
          if (response && typeof response === 'object' && response !== null) {
            // Check if response has data property
            if ('data' in response && response.data) {
              console.log('Response has data property:', response.data);
              return response.data as ApiClaim;
            }
            // Check if response is the claim object itself
            if ('id' in response && 'claim_number' in response) {
              console.log('Response is claim object directly');
              return response as unknown as ApiClaim;
            }
            // Check if response has nested data structure
            if ('data' in response && typeof response.data === 'object' && response.data !== null) {
              const data = response.data as { data: ApiClaim[] };
              if ('data' in data && Array.isArray(data.data) && data.data.length > 0) {
                console.log('Response has nested data array, taking first item:', data.data[0]);
                return data.data[0] as ApiClaim;
              }
            }
          }
          console.log('No valid claim data found in response');
          return null;
        };

        const claimData = extractClaimData(res);
        console.log('Extracted claim data:', claimData);
        console.log('Claim client data:', claimData?.client);
        setClaimData(claimData);
      } catch (err: unknown) {
        console.error('Error fetching claim data:', err);
        const error = err as ApiError;
        const errorMessage = error?.response?.data?.message || error?.message || 'Failed to fetch claim data';
        console.error('Error message:', errorMessage);
        setClaimData(null);
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    if (claimId) {
      fetchClaimData();
    }
  }, [claimId]);

  console.log(claimData, "claim__111");

  function getStatusColor(status: string) {
    const colors = {
      submitted: "bg-yellow-100 text-yellow-800",
      completed: "bg-green-100 text-green-800",
      approved: "bg-emerald-100 text-emerald-800",
      rejected: "bg-red-100 text-red-800",
      processing: "bg-blue-100 text-blue-800",
    };
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800";
  }

  // Transform claim data for display
  const transformClaimData = (claim: ApiClaim | null): TransformedClaimData | null => {
    if (!claim) return null;
    
    console.log('Transforming claim data:', claim);

    const uploadedDocs = claim.documents?.filter((doc: ApiClaimDocument) => doc.document_uploaded) || [];
    const totalDocs = claim.documents?.length || 0;
    const documentStatus = totalDocs > 0 ? Math.round((uploadedDocs.length / totalDocs) * 100) : 0;

    // Calculate days since submission
    const submissionDate = new Date((claim as { created_at?: string }).created_at || claim.submission_date);
    const today = new Date();
    const daysSinceSubmission = Math.floor((today.getTime() - submissionDate.getTime()) / (1000 * 60 * 60 * 24));

    // Format status to sentence case
    const formatStatus = (status: string) => {
      return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
    };

    // Format submission date to DD Mmm YYYY HH:MM
    const formatSubmissionDate = (dateString: string) => {
      const date = new Date(dateString);
      const day = date.getDate().toString().padStart(2, '0');
      const month = date.toLocaleDateString('en-US', { month: 'short' });
      const year = date.getFullYear();
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return `${day} ${month} ${year} ${hours}:${minutes}`;
    };

    return {
      id: claim.claim_number,
      clientName: `${claim.client?.first_name || ''} ${claim.client?.last_name || ''}`.trim(),
      clientEmail: claim.client?.email || 'N/A',
      clientPhone: claim.client?.phone || 'N/A',
      submissionDate: formatSubmissionDate(claim.submission_date),
      claimType: claim.claim_type_details?.name || 'Unknown',
      status: formatStatus(claim.status),
      documentStatus,
      estimatedValue: parseFloat(String(claim.estimated_value || '0').replace(/,/g, '')),
      description: claim.description || 'No description provided',
      incidentLocation: claim.incident_location,
      incidentDate: new Date(claim.incident_date).toLocaleDateString(),
      documents: claim.documents?.map((doc: ApiClaimDocument): TransformedClaimDocument => ({
        id: doc.id,
        name: doc.document_type,
        type: 'pdf',
        size: 'N/A',
        uploadedDate: new Date(doc.created_at).toLocaleDateString(),
        isUploaded: doc.document_uploaded,
        document_url: doc.document_url,
      })) || [],
      timeline: claim.claim_history?.map((history: ApiClaimHistory): TransformedClaimTimeline => ({
        date: new Date(history.created_at).toLocaleDateString(),
        action: history.description,
        description: `Status: ${history.status}`,
      })) || [],
      daysSinceSubmission,
    };
  };

  const transformedClaim = transformClaimData(claimData);

  // Action handlers
  const handleRequestInfo = () => {
    setShowRequestInfoModal(true);
  };


  const handleApproveClaim = () => {
    setShowApproveModal(true);
  };

  const submitRequestInfo = async () => {
    try {
      let requestTypeApi: 'document_request' | 'additional_information';
      let details: string;

      if (requestType === 'document' && documentName.trim()) {
        requestTypeApi = 'document_request';
        details = documentName.trim();
      } else if (requestType === 'question' && question.trim()) {
        requestTypeApi = 'additional_information';
        details = question.trim();
      } else {
        alert('Please fill in the required information');
        return;
      }

      console.log('Sending request:', { claimId, requestTypeApi, details });
      
      const response = await requestAdditionalInformation({
        claim_id: claimId,
        request_type: requestTypeApi,
        details: details
      });
      
      console.log('Request sent successfully:', response);
      alert('Request sent successfully!');
      
      // Reset form and close modal
      setDocumentName('');
      setQuestion('');
      setShowRequestInfoModal(false);
      
    } catch (error) {
      console.error('Error sending request:', error);
      const errorMessage = (error as ApiError)?.response?.data?.message || (error as ApiError)?.message || 'Failed to send request';
      alert(`Error: ${errorMessage}`);
    }
  };


  const submitApproveClaim = async () => {
    if (isApproving) return; // Prevent multiple clicks
    
    try {
      setIsApproving(true);
      console.log('Approving claim:', claimId);
      const response = await approveClaim(claimId);
      console.log('Claim approval response:', response);
      
      // Show success message
      alert('Claim approved successfully!');
      
      // Close modal
      setShowApproveModal(false);
      
      // Refresh the claim data to update the status
      console.log('Refreshing claim data after approval...');
      await fetchClaimData();
      
    } catch (error) {
      console.error('Error approving claim:', error);
      const errorMessage = (error as ApiError)?.response?.data?.message || (error as ApiError)?.message || 'Failed to approve claim';
      alert(`Error: ${errorMessage}`);
    } finally {
      setIsApproving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Claim Details</h1>
            <p className="text-muted-foreground">
              Claim Number: <span className="animate-pulse">Loading...</span>
            </p>
          </div>
        </div>
        <div className="text-center py-8">
          <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Loading claim details...</p>
        </div>
      </div>
    );
  }

  if (!transformedClaim) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Claim Details</h1>
            <p className="text-muted-foreground">Claim Number: {claimData?.claim_number || claimId}</p>
          </div>
        </div>
        <div className="text-center py-8">
          <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Claim not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Claim Details</h1>
          <p className="text-muted-foreground">Claim Number: {claimData?.claim_number || claimId}</p>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href="/dashboard/claims">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Claims
          </Link>
        </Button>
      </div>

      {/* Status and Days Since Submission */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">Status:</span>
          <Badge className={getStatusColor(claimData?.status || 'submitted')}>
            {transformedClaim.status}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium text-muted-foreground">Days Since Submission:</span>
          <span className="text-sm font-medium">{transformedClaim.daysSinceSubmission}</span>
        </div>
      </div>

      {/* Available Actions - Only show if claim is not approved */}
      {claimData?.status !== 'approved' && (
        <div>
          <h4 className="text-sm font-medium text-muted-foreground mb-3">Available Actions</h4>
          <div className="grid gap-4 md:grid-cols-2">
            <Button className="w-full" variant="outline" onClick={handleApproveClaim}>
              <CheckCircle className="h-4 w-4 mr-2" />
              Approve Claim
            </Button>
            <Button className="w-full" variant="outline" onClick={handleRequestInfo}>
              <AlertCircle className="h-4 w-4 mr-2" />
              Request More Info
            </Button>
          </div>
        </div>
      )}

      {/* All Information - Single Card */}
      <Card>
        <CardContent className="space-y-8 pt-6">
          {/* Client Information */}
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-3">Client Information</h4>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="font-medium">{transformedClaim.clientName}</p>
                <p className="text-sm text-muted-foreground">{transformedClaim.clientEmail}</p>
                <p className="text-sm text-muted-foreground">{transformedClaim.clientPhone}</p>
              </div>
            </div>
          </div>

          {/* Claim Information */}
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-3">Claim Information</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Claim Type:</span>
                <span className="text-sm">{transformedClaim.claimType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Submission Date:</span>
                <span className="text-sm">{transformedClaim.submissionDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Incident Date:</span>
                <span className="text-sm">{transformedClaim.incidentDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Incident Location:</span>
                <span className="text-sm">{transformedClaim.incidentLocation}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Estimated Value:</span>
                <span className="text-sm">₦{transformedClaim.estimatedValue.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-3">Description</h4>
            <p className="text-sm text-muted-foreground">{transformedClaim.description}</p>
          </div>

          {/* Documents Section */}
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-3">Uploaded Documents</h4>
            <div className="space-y-4">
              {transformedClaim.documents.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">No documents uploaded yet</p>
                </div>
              ) : (
                transformedClaim.documents.map((doc: TransformedClaimDocument) => (
                  <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{doc.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {doc.type.toUpperCase()} • {doc.size} • Uploaded {doc.uploadedDate}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button onClick={() => window.open(doc.document_url, '_blank')} variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Timeline Section */}
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-3">Claim Timeline</h4>
            <div className="space-y-4">
              {transformedClaim.timeline.length === 0 ? (
                <div className="text-center py-8">
                  <Clock className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">No timeline events found</p>
                </div>
              ) : (
                transformedClaim.timeline.map((event: TransformedClaimTimeline, index: number) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 bg-primary rounded-full"></div>
                      {index < transformedClaim.timeline.length - 1 && (
                        <div className="w-0.5 h-8 bg-gray-200 mt-1"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{event.action}</p>
                      <p className="text-sm text-muted-foreground">{event.description}</p>
                      <p className="text-xs text-muted-foreground">{event.date}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </CardContent>
      </Card>

      {/* Request More Info Modal */}
      {showRequestInfoModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Request More Information</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowRequestInfoModal(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Request Type</label>
                <Select value={requestType} onValueChange={(value: 'document' | 'question') => setRequestType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="document">Document Request</SelectItem>
                    <SelectItem value="question">Question/Information</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {requestType === 'document' ? (
                <div>
                  <label className="text-sm font-medium mb-2 block">Document Name</label>
                  <Input
                    placeholder="Enter document name (user will be required to upload)"
                    value={documentName}
                    onChange={(e) => setDocumentName(e.target.value)}
                  />
                </div>
              ) : (
                <div>
                  <label className="text-sm font-medium mb-2 block">Question</label>
                  <Textarea
                    placeholder="Enter your question (user will be required to answer)"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    rows={3}
                  />
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={() => setShowRequestInfoModal(false)} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={submitRequestInfo} className="flex-1">
                  <Send className="h-4 w-4 mr-2" />
                  Send Request
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}


      {/* Approve Claim Modal */}
      {showApproveModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Approve Claim</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowApproveModal(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-4">
              <div className="text-center py-4">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  Are you sure you want to approve this claim? This action cannot be undone.
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={() => setShowApproveModal(false)} className="flex-1">
                  Cancel
                </Button>
                <Button 
                  onClick={submitApproveClaim} 
                  disabled={isApproving}
                  className="flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-50"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  {isApproving ? 'Approving...' : 'Approve Claim'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}