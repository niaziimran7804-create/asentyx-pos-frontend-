export interface UserDto {
  id: number;
  userId: string;
  firstName: string;
  lastName: string;
  email?: string;
  age: number;
  gender?: string;
  role: string;
  salary: number;
  joinDate: Date;
  birthdate: Date;
  phone?: string;
  currentCity?: string;
  companyId?: number;
  branchId?: number;
  branchName?: string;
}

export interface CreateUserDto {
  userId: string;
  firstName: string;
  lastName: string;
  password: string;
  email?: string;
  age: number;
  gender?: string;
  role: string;
  salary: number;
  birthdate: Date;
  nid?: string;
  phone?: string;
  homeTown?: string;
  currentCity?: string;
  division?: string;
  bloodGroup?: string;
  postalCode?: number;
  companyId?: number;
  branchId?: number;
}

export interface UpdateUserDto {
  firstName: string;
  lastName: string;
  email?: string;
  age: number;
  gender?: string;
  role: string;
  salary: number;
  birthdate: Date;
  phone?: string;
  homeTown?: string;
  currentCity?: string;
  division?: string;
  bloodGroup?: string;
  postalCode?: number;
  companyId?: number;
  branchId?: number;
}

