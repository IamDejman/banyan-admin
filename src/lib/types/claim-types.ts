export type ClaimType = {
  id: string;
  name: string;
  description: string;
  required_documents: string[];
  processing_time_estimate: string;
  status: "active" | "inactive";
}; 