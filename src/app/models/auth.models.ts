export interface LoginDto {
  userId: string;
  password: string;
}

export interface LoginResponseDto {
  token: string;
  user: UserDto;
}

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
  companyName?: string;
  branchId?: number;
  branchName?: string;
}

