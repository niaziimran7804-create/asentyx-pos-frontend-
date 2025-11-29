export interface CompanyDto {
  companyId: number;
  companyName: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  postalCode?: string;
  taxNumber?: string;
  registrationNumber?: string;
  isActive: boolean;
  createdDate: Date;
  subscriptionEndDate?: Date;
  subscriptionPlan: string;
  totalBranches: number;
  totalUsers: number;
}

export interface CreateCompanyDto {
  companyName: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  postalCode?: string;
  taxNumber?: string;
  registrationNumber?: string;
  subscriptionPlan: string;
  subscriptionEndDate?: Date;
  adminUserId: string;
  adminFirstName: string;
  adminLastName: string;
  adminPassword: string;
  adminEmail: string;
  adminPhone?: string;
}

export interface UpdateCompanyDto {
  companyName: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  postalCode?: string;
  taxNumber?: string;
  registrationNumber?: string;
  isActive: boolean;
  subscriptionPlan: string;
  subscriptionEndDate?: Date;
}
