export type UserRole = "admin" | "agent" | "customer";

export type UserStatus = "active" | "inactive" | "suspended";

export type BaseUser = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  status: UserStatus;
  createdAt: string;
  lastLogin?: string; // This maps to last_login_at from API
  disabled?: boolean;
};

export type Admin = BaseUser & {
  role: "admin";
  permissions: string[];
  department?: string;
  isSuperAdmin: boolean;
  assignedClaims: string[];
  completedClaims: string[];
};

export type Agent = BaseUser & {
  role: "agent";
  employeeId: string;
  department: string;
  supervisor?: string;
  assignedClaims: string[];
  completedClaims: string[];
  performanceRating?: number;
  specializations: string[];
};

export type Customer = BaseUser & {
  role: "customer";
  dateOfBirth: string;
  address: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  claims: string[];
  preferences: {
    notifications: boolean;
    language: string;
  };
  bvnVerification: number; // 0 = false, 1 = true
  bankName?: string;
  bankAccountNumber?: string;
  bankAccountName?: string;
};

export type User = Admin | Agent | Customer; 