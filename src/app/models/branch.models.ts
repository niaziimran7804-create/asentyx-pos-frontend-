export interface BranchDto {
  branchId: number;
  companyId: number;
  companyName: string;
  branchName: string;
  branchCode: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  postalCode?: string;
  isActive: boolean;
  isHeadOffice: boolean;
  createdDate: Date;
  totalUsers: number;
  totalProducts: number;
}

export interface CreateBranchDto {
  companyId: number;
  branchName: string;
  branchCode: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  postalCode?: string;
  isHeadOffice?: boolean;
}

export interface UpdateBranchDto {
  branchName: string;
  branchCode: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  postalCode?: string;
  isActive: boolean;
  isHeadOffice: boolean;
}
