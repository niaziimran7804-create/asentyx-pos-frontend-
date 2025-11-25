export enum UserRole {
  ADMIN = 'ADMIN',
  SALESMAN = 'SALESMAN'
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  fullName: string;
  avatar?: string;
  createdAt: Date;
  lastLogin?: Date;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
  expiresIn: number;
}

export interface ChangePasswordRequest {
  userId: string;
  oldPassword?: string;
  newPassword: string;
}
