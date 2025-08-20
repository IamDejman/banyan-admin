export type ClaimType = {
  id: string | number;
  name: string;
  code: string;
  tracking_prefix: string;
  description: string;
  required_documents: string[] | null;
  active: number;
  processing_time_estimate: string | null;
  created_at: string | null;
  updated_at: string | null;
  status?: "active" | "inactive"; // For UI compatibility
}; 