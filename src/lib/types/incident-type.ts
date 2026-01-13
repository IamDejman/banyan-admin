export type IncidentType = {
  id: string | number;
  name: string;
  code: string;
  description: string;
  applicable_claim_types: (string | number)[] | null; // IDs of claim types
  required_documents: string[] | null;
  active: number;
  created_at: string | null;
  updated_at: string | null;
};
