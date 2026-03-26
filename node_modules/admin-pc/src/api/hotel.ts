import http from './http';
import type { AdminMenuNode, Hotel, RolePermissionProfile, SystemLog, User } from '@shared/types';

export const fetchMerchantHotels = () => http.get<Hotel[]>('/merchant/hotels');
export const fetchAuditHotels = (params: Record<string, any>) => http.get<Hotel[]>('/admin/hotels', { params });
export const fetchAdminHotelDetail = (id: string) => http.get<Hotel>(`/admin/hotels/${id}`);
export const createHotel = (payload: Partial<Hotel>) => http.post<Hotel>('/merchant/hotels', payload);
export const updateHotel = (id: string, payload: Partial<Hotel>) =>
  http.put<Hotel>(`/merchant/hotels/${id}`, payload);
export const auditHotel = (id: string, payload: { status: string; reason?: string }) =>
  http.post<Hotel>(`/admin/hotels/${id}/audit`, payload);
export const toggleHotelPublish = (id: string, action: 'publish' | 'offline' | 'restore') =>
  http.post<Hotel>(`/admin/hotels/${id}/${action}`);

export const fetchSystemUsers = (params: Record<string, any>) => http.get<User[]>('/system/users', { params });
export const createSystemUser = (payload: Partial<User>) => http.post<User>('/system/users', payload);
export const updateSystemUser = (id: string, payload: Partial<User>) =>
  http.put<User>(`/system/users/${id}`, payload);
export const deleteSystemUser = (id: string) => http.post<{ success: boolean }>(`/system/users/${id}/delete`);

export const fetchRoles = () => http.get<RolePermissionProfile[]>('/system/roles');
export const updateRole = (id: string, payload: Partial<RolePermissionProfile>) =>
  http.put<RolePermissionProfile>(`/system/roles/${id}`, payload);

export const fetchSystemMenus = () => http.get<AdminMenuNode[]>('/system/menus');
export const fetchSystemLogs = (params: Record<string, any>) => http.get<SystemLog[]>('/system/logs', { params });
