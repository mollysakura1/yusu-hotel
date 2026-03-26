import http from './http';
import type { AuthResponse, LoginPayload, RegisterPayload } from '@shared/types';

export const loginApi = (payload: LoginPayload) => http.post<AuthResponse>('/auth/login', payload);
export const registerApi = (payload: RegisterPayload) =>
  http.post<AuthResponse>('/auth/register', payload);
export const fetchCurrentUserProfile = () => http.get<AuthResponse['user']>('/auth/profile');
