export type Role = 'USER' | 'ADMIN';

export interface User {
  id?: number;
  username: string;
  password?: string;
  role?: Role;
}

export interface AuthResponse {
  token: string;
  role: Role;
}
