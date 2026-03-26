import dayjs from 'dayjs';
import type { RoomType } from './types';

export const formatPrice = (price: number) => `¥${price}`;
export const calcNights = (checkIn: string, checkOut: string) =>
  Math.max(dayjs(checkOut).diff(dayjs(checkIn), 'day'), 1);
export const sortRoomsByPrice = (rooms: RoomType[]) => [...rooms].sort((a, b) => a.price - b.price);
export const generateHistoryKey = (prefix: string) => `easy-stay:${prefix}`;
