export type UserRole = 'merchant' | 'admin';
export type HotelStatus = 'draft' | 'pending' | 'approved' | 'rejected' | 'offline';
export type SortType = 'recommended' | 'distance' | 'priceAsc' | 'scoreDesc';

export interface User {
  id: string;
  username: string;
  password: string;
  role: UserRole;
  hotelIds?: string[];
  nickname: string;
  createdAt: string;
}

export interface HotelFacility {
  id: string;
  name: string;
  icon?: string;
  group: 'basic' | 'traffic' | 'service' | 'recreation';
}

export interface HotelPolicy {
  checkInTime: string;
  checkOutTime: string;
  breakfast: string;
  cancellation: string;
  children: string;
  pets: string;
}

export interface HotelPromotion {
  id: string;
  title: string;
  tag: string;
  discountText: string;
  priceLabel?: string;
}

export interface HotelReviewSummary {
  score: number;
  reviewCount: number;
  highlights: string[];
}

export interface RoomType {
  id: string;
  hotelId: string;
  name: string;
  area: string;
  occupancy: number;
  floor: string;
  breakfast: string;
  cancellationPolicy: string;
  bedType: string;
  price: number;
  originalPrice?: number;
  stock: number;
}

export interface AuditRecord {
  id: string;
  hotelId: string;
  operatorId: string;
  status: HotelStatus;
  reason?: string;
  createdAt: string;
}

export interface Hotel {
  id: string;
  nameCn: string;
  nameEn: string;
  city: string;
  district: string;
  address: string;
  star: number;
  score: number;
  reviewCount: number;
  openYear: number;
  tags: string[];
  facilities: HotelFacility[];
  bannerImages: string[];
  coverImage: string;
  roomTypes: RoomType[];
  priceStart: number;
  promotions: HotelPromotion[];
  trafficInfo: string[];
  nearbySpots: string[];
  policies: HotelPolicy;
  reviewSummary: HotelReviewSummary;
  businessArea: string;
  distanceToMetro: string;
  latitude?: number;
  longitude?: number;
  recommendedText?: string;
  status: HotelStatus;
  rejectReason?: string;
  merchantId: string;
  createdAt: string;
  updatedAt: string;
}

export interface SearchQuery {
  city: string;
  keyword: string;
  checkIn: string;
  checkOut: string;
  starList?: number[];
  minPrice?: number;
  maxPrice?: number;
  tags?: string[];
  breakfast?: boolean;
  freeCancel?: boolean;
  nearMetro?: boolean;
  businessArea?: string;
  sortBy?: SortType;
  page?: number;
  pageSize?: number;
}

export interface PaginationResult<T> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export interface LoginPayload {
  username: string;
  password: string;
}

export interface RegisterPayload extends LoginPayload {
  nickname: string;
  role: UserRole;
}

export interface AuthResponse {
  token: string;
  user: Omit<User, 'password'>;
}
