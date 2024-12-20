export interface User {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
  date_naissance: Date;
  lieu_naissance: string;
  role: 'admin' | 'user';
  isActive: boolean;
  username: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserDto {
  username: string;
  email: string;
  password: string;
  firstname: string;
  lastname: string;
  date_naissance: Date;
  lieu_naissance: string;
  role: 'admin' | 'user';
}

export interface UpdateUserDto {
  email?: string;
  firstname?: string;
  lastname?: string;
  date_naissance?: Date;
  lieu_naissance?: string;
  role?: 'admin' | 'user';
  password?: string;
  isActive?: boolean;
}

export interface ResetPasswordDto {
  newPassword: string;
  confirmPassword: string;
}
