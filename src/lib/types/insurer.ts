export type Insurer = {
  id: string;
  name: string;
  logo: string | null;
  email: string;
  phone: string;
  address: string;
  claimTypes: string[];
  instructions: string;
  status: boolean;
}; 