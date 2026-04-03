import dayjs from 'dayjs';
import type { RoomType } from './types';

export const formatPrice = (price: number) => `¥${price}`;
export const calcNights = (checkIn: string, checkOut: string) =>
  Math.max(dayjs(checkOut).diff(dayjs(checkIn), 'day'), 1);
export const sortRoomsByPrice = (rooms: RoomType[]) => [...rooms].sort((a, b) => a.price - b.price);
export const generateHistoryKey = (prefix: string) => `easy-stay:${prefix}`;
export const normalizeDateRange = (checkIn: string, checkOut: string) => {
  const safeCheckIn = dayjs(checkIn).isValid() ? checkIn : dayjs().format('YYYY-MM-DD');
  const nextDay = dayjs(safeCheckIn).add(1, 'day').format('YYYY-MM-DD');
  if (!dayjs(checkOut).isValid() || !dayjs(checkOut).isAfter(dayjs(safeCheckIn), 'day')) {
    return {
      checkIn: safeCheckIn,
      checkOut: nextDay
    };
  }
  return {
    checkIn: safeCheckIn,
    checkOut
  };
};
