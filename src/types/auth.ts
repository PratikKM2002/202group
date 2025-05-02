import { User } from './index';

export interface AuthFormData {
  email: string;
  password: string;
  name?: string;
  phone?: string;
}

export interface AuthResponse {
  user: User | null;
  error: Error | null;
}

export interface PasswordResetData {
  email: string;
  token: string;
  newPassword: string;
}

export interface ProfileUpdateData {
  name?: string;
  phone?: string;
  avatar?: string;
}

export interface SocialUser {
  id: string;
  email: string;
  name: string;
  picture?: string;
  provider: 'google' | 'apple';
}

export interface TokenPayload {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}