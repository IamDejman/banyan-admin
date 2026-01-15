'use client';

import { useClaimsStore } from '@/lib/store/claims-store';
import { ClaimStatus } from '@/lib/types/claims';
import { format } from 'date-fns';
import { formatDateTime } from '@/lib/utils/text-formatting';
import {
  FileIcon,
  User,
  Mail,
  Phone,
  FileText,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
} from 'lucide-react';

const statusColors: Record<ClaimStatus, string> = {
  PENDING_REVIEW: 'bg-yellow-100 text-yellow-800',
  UNDER_REVIEW: 'bg-blue-100 text-blue-800',
  NEEDS_INFO: 'bg-orange-100 text-orange-800',
  APPROVED: 'bg-green-100 text-green-800',
  REJECTED: 'bg-red-100 text-red-800',
  SETTLEMENT_OFFERED: 'bg-purple-100 text-purple-800',
  SETTLEMENT_ACCEPTED: 'bg-green-100 text-green-800',
  SETTLEMENT_REJECTED: 'bg-red-100 text-red-800',
  SETTLED: 'bg-green-100 text-green-800',
  CLOSED: 'bg-gray-100 text-gray-800',
};

interface ClaimDetailsViewProps {
  claimId: string;
}

export function ClaimDetailsView({ claimId }: ClaimDetailsViewProps) {
  const { selectedClaim, isLoading, uploadDocument } = useClaimsStore();

  if (isLoading || !selectedClaim) {
    return <div>Loading...</div>;
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);
      uploadFormData.append('document_type', claimId);
      uploadFormData.append('name', file.name);
      await uploadDocument(uploadFormData);
    }
  };

  return (
    <div className="space-y-6">
      {/* Claim Overview */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Claim #{selectedClaim.claimNumber}</h2>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[selectedClaim.status]}`}
          >
            {selectedClaim.status.replace('_', ' ')}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <User className="text-gray-400" size={20} />
              <div>
                <p className="text-sm text-gray-500">Client Name</p>
                <p className="font-medium">{selectedClaim.clientName}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="text-gray-400" size={20} />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{selectedClaim.clientEmail}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="text-gray-400" size={20} />
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium">{selectedClaim.clientPhone}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <FileText className="text-gray-400" size={20} />
              <div>
                <p className="text-sm text-gray-500">Claim Type</p>
                <p className="font-medium">{selectedClaim.claimType}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="text-gray-400" size={20} />
              <div>
                <p className="text-sm text-gray-500">Submission Date</p>
                <p className="font-medium">
                  {format(new Date(selectedClaim.submissionDate), 'MMM d, yyyy')}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="text-gray-400" size={20} />
              <div>
                <p className="text-sm text-gray-500">Last Updated</p>
                <p className="font-medium">
                  {format(new Date(selectedClaim.lastUpdated), 'MMM d, yyyy')}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-medium mb-2">Description</h3>
          <p className="text-gray-600">{selectedClaim.description}</p>
        </div>
      </div>

      {/* Document Status */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium mb-4">Document Status</h3>
          <label className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
            Upload Document
            <input
              type="file"
              className="hidden"
              onChange={handleFileUpload}
            />
          </label>
        </div>
        <div className="space-y-4">
          {selectedClaim.documents.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <FileIcon className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="font-medium">{doc.name}</p>
                  <p className="text-sm text-gray-500">{doc.type}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {doc.status === 'APPROVED' && <CheckCircle className="h-5 w-5 text-green-500" />}
                {doc.status === 'REJECTED' && <XCircle className="h-5 w-5 text-red-500" />}
                {doc.status === 'PENDING' && <Clock className="h-5 w-5 text-yellow-500" />}
                <span className={`text-sm ${doc.status === 'APPROVED' ? 'text-green-600' : doc.status === 'REJECTED' ? 'text-red-600' : 'text-yellow-600'}`}>
                  {doc.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Audit Trail */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium mb-4">Audit Trail</h3>
        <div className="space-y-4">
          {selectedClaim.audits.map((audit) => (
            <div key={audit.id} className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-blue-500" />
              <div>
                <p className="font-medium">{audit.action}</p>
                <p className="text-sm text-gray-500">
                  By {audit.performedBy} on {formatDateTime(audit.timestamp)}
                </p>
                {audit.notes && <p className="text-sm mt-1">{audit.notes}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Communications History */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium mb-4">Communications History</h3>
        <div className="space-y-4">
          {selectedClaim.communications.map((comm) => (
            <div key={comm.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-medium">{comm.subject}</p>
                  <p className="text-sm text-gray-500">
                    From {comm.sender} to {comm.recipient}
                  </p>
                </div>
                <span className="text-sm text-gray-500">
                  {formatDateTime(comm.timestamp)}
                </span>
              </div>
              <p className="text-sm">{comm.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 