import http from './http';
import type { BookingPayload, Hotel, PaginationResult, SearchQuery } from '@shared/types';

export interface BannerItem {
  id: string;
  hotelId: string;
  title: string;
  subtitle: string;
  image: string;
}

export const fetchBanners = () => http.get<BannerItem[]>('/banners');
export const fetchHotels = (params: SearchQuery) =>
  http.get<PaginationResult<Hotel>>('/hotels', { params: { ...params, scene: 'mobile' } });
export const fetchHotelDetail = (id: string) =>
  http.get<Hotel>(`/hotels/${id}`, { params: { scene: 'mobile' } });
export const bookHotelRoom = (hotelId: string, payload: BookingPayload) =>
  http.post<Hotel>(`/hotels/${hotelId}/book`, payload);
