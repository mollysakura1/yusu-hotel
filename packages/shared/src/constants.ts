import type { SortType } from './types';

export const HOTEL_TAG_OPTIONS = ['亲子优选', '豪华高星', '免费停车', '近地铁', '含早餐', '可取消'];
export const HOTEL_SORT_OPTIONS: { label: string; value: SortType }[] = [
  { label: '推荐优先', value: 'recommended' },
  { label: '距离优先', value: 'distance' },
  { label: '价格升序', value: 'priceAsc' },
  { label: '评分优先', value: 'scoreDesc' }
];

export const ADMIN_ROLE_MENU = {
  merchant: [
    { name: 'dashboard', label: '经营概览', path: '/dashboard' },
    { name: 'hotel-edit', label: '酒店管理', path: '/hotel/edit' }
  ],
  admin: [
    { name: 'dashboard', label: '平台看板', path: '/dashboard' },
    { name: 'audit', label: '审核中心', path: '/audit' }
  ]
};
