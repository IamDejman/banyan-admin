export type Insurer = {
  id: string;
  name: string;
  logo: string | null;
  contact_email: string;
  contact_phone: string;
  address: string;
  supported_claim_types: string[];
  special_instructions: string;
  status: boolean;
}; 