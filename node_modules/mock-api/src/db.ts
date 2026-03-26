import dayjs from 'dayjs';
import type {
  AdminMenuNode,
  AuditRecord,
  Hotel,
  RolePermissionProfile,
  SystemLog,
  User
} from '@shared/types';
import { ADMIN_MENU_TREE } from '@shared/constants';

export const roleProfiles: RolePermissionProfile[] = [
  {
    id: 'role-super-admin',
    code: 'superAdmin',
    name: '超级管理员',
    description: '拥有平台全部功能，包括用户、角色、菜单、日志和酒店审核管理权限。',
    status: 'enabled',
    permissionKeys: ['dashboard_view', 'hotel_edit', 'audit_manage', 'user_manage', 'role_manage', 'menu_manage', 'log_manage'],
    menuKeys: ['dashboard', 'hotel-edit', 'audit', 'system', 'system-users', 'system-roles', 'system-menus', 'system-logs'],
    createdAt: dayjs().subtract(60, 'day').toISOString()
  },
  {
    id: 'role-admin',
    code: 'admin',
    name: '管理员',
    description: '负责酒店审核、上下线和平台业务巡检。',
    status: 'enabled',
    permissionKeys: ['dashboard_view', 'audit_manage'],
    menuKeys: ['dashboard', 'audit'],
    createdAt: dayjs().subtract(50, 'day').toISOString()
  },
  {
    id: 'role-merchant',
    code: 'merchant',
    name: '商家',
    description: '负责商家端酒店信息维护、提交审核和基础经营查看。',
    status: 'enabled',
    permissionKeys: ['dashboard_view', 'hotel_edit'],
    menuKeys: ['dashboard', 'hotel-edit'],
    createdAt: dayjs().subtract(45, 'day').toISOString()
  }
];

export const users: User[] = [
  {
    id: 'u-super-01',
    username: 'superadmin',
    password: '123456',
    nickname: '系统超级管理员',
    role: 'superAdmin',
    status: 'enabled',
    createdAt: dayjs().subtract(35, 'day').toISOString()
  },
  {
    id: 'u-admin-01',
    username: 'admin01',
    password: '123456',
    nickname: '平台管理员',
    role: 'admin',
    status: 'enabled',
    createdAt: dayjs().subtract(30, 'day').toISOString()
  },
  {
    id: 'u-merchant-01',
    username: 'merchant01',
    password: '123456',
    nickname: '陆家嘴商家',
    role: 'merchant',
    status: 'enabled',
    hotelIds: ['hotel-001', 'hotel-003'],
    createdAt: dayjs().subtract(20, 'day').toISOString()
  },
  {
    id: 'u-merchant-02',
    username: 'merchant02',
    password: '123456',
    nickname: '虹桥商家',
    role: 'merchant',
    status: 'enabled',
    hotelIds: ['hotel-002'],
    createdAt: dayjs().subtract(18, 'day').toISOString()
  }
];

const roomTemplate = (hotelId: string) => [
  {
    id: `${hotelId}-room-1`,
    hotelId,
    name: '高级大床房',
    area: '32m²',
    occupancy: 2,
    floor: '12-18层',
    breakfast: '双早',
    cancellationPolicy: '限时可取消',
    bedType: '1张大床',
    price: 568,
    originalPrice: 688,
    stock: 4
  },
  {
    id: `${hotelId}-room-2`,
    hotelId,
    name: '行政双床房',
    area: '40m²',
    occupancy: 2,
    floor: '20-22层',
    breakfast: '双早',
    cancellationPolicy: '不可取消',
    bedType: '2张单床',
    price: 628,
    originalPrice: 788,
    stock: 6
  },
  {
    id: `${hotelId}-room-3`,
    hotelId,
    name: '亲子家庭套房',
    area: '58m²',
    occupancy: 3,
    floor: '16-20层',
    breakfast: '三早',
    cancellationPolicy: '限时可取消',
    bedType: '1张大床+1张单床',
    price: 899,
    originalPrice: 1099,
    stock: 2
  }
];

export const hotels: Hotel[] = [
  {
    id: 'hotel-001',
    nameCn: '上海陆家嘴云栖酒店',
    nameEn: 'Yunqi Hotel Lujiazui Shanghai',
    city: '上海',
    district: '浦东新区',
    address: '上海市浦东新区世纪大道 1288 号',
    star: 5,
    score: 4.8,
    reviewCount: 4862,
    openYear: 2021,
    tags: ['近地铁', '高性价比', '含早餐', '适合亲子'],
    facilities: [
      { id: 'f1', name: '免费停车', group: 'basic' },
      { id: 'f2', name: '健身房', group: 'recreation' },
      { id: 'f3', name: '亲子乐园', group: 'recreation' },
      { id: 'f4', name: '行政酒廊', group: 'service' }
    ],
    bannerImages: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945',
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267'
    ],
    coverImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945',
    roomTypes: roomTemplate('hotel-001'),
    priceStart: 568,
    promotions: [
      { id: 'p1', title: '住 2 晚立减', tag: '连住优惠', discountText: '连住两晚总价 95 折' },
      { id: 'p2', title: '早餐加量不加价', tag: '限时', discountText: '双早免费升级' }
    ],
    trafficInfo: ['距地铁 2 号线东昌路站步行 6 分钟', '距上海站打车约 24 分钟'],
    nearbySpots: ['东方明珠', '陆家嘴中心', '滨江步道'],
    policies: {
      checkInTime: '14:00后',
      checkOutTime: '12:00前',
      breakfast: '自助早餐 7:00-10:00',
      cancellation: '部分房型支持 18:00 前免费取消',
      children: '欢迎携带儿童入住',
      pets: '不可携带宠物'
    },
    reviewSummary: { score: 4.8, reviewCount: 4862, highlights: ['早餐丰富', '景观好', '交通便利'] },
    businessArea: '陆家嘴金融区',
    distanceToMetro: '距地铁 320m',
    recommendedText: '景观视野好，金融区出行效率高',
    status: 'approved',
    merchantId: 'u-merchant-01',
    createdAt: dayjs().subtract(10, 'day').toISOString(),
    updatedAt: dayjs().toISOString()
  },
  {
    id: 'hotel-002',
    nameCn: '上海虹桥悦程酒店',
    nameEn: 'Yuecheng Hotel Hongqiao Shanghai',
    city: '上海',
    district: '闵行区',
    address: '上海市闵行区申虹路 688 号',
    star: 4,
    score: 4.6,
    reviewCount: 2198,
    openYear: 2019,
    tags: ['免费停车', '近地铁', '商务出行'],
    facilities: [
      { id: 'f5', name: '洗衣房', group: 'service' },
      { id: 'f6', name: '健身房', group: 'recreation' },
      { id: 'f7', name: '会议室', group: 'service' }
    ],
    bannerImages: [
      'https://images.unsplash.com/photo-1445019980597-93fa8acb246c',
      'https://images.unsplash.com/photo-1455587734955-081b22074882'
    ],
    coverImage: 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c',
    roomTypes: roomTemplate('hotel-002').map((item, index) => ({ ...item, price: item.price - 90 + index * 20 })),
    priceStart: 478,
    promotions: [{ id: 'p3', title: '高铁出行专享', tag: '专享', discountText: '接驳券免费领' }],
    trafficInfo: ['距虹桥火车站打车约 10 分钟'],
    nearbySpots: ['虹桥天地', '国家会展中心'],
    policies: {
      checkInTime: '14:00后',
      checkOutTime: '12:00前',
      breakfast: '中西结合早餐',
      cancellation: '预订后 2 小时内可免费取消',
      children: '可加婴儿床',
      pets: '不可携带宠物'
    },
    reviewSummary: { score: 4.6, reviewCount: 2198, highlights: ['适合赶高铁', '卫生稳定'] },
    businessArea: '虹桥枢纽',
    distanceToMetro: '距地铁 450m',
    recommendedText: '赶车友好，商务差旅效率高',
    status: 'approved',
    merchantId: 'u-merchant-02',
    createdAt: dayjs().subtract(9, 'day').toISOString(),
    updatedAt: dayjs().toISOString()
  },
  {
    id: 'hotel-003',
    nameCn: '上海外滩澜庭酒店',
    nameEn: 'Lanting Hotel Bund Shanghai',
    city: '上海',
    district: '黄浦区',
    address: '上海市黄浦区福州路 166 号',
    star: 5,
    score: 4.9,
    reviewCount: 3568,
    openYear: 2023,
    tags: ['豪华高星', '含早餐', '可取消', '外滩夜景'],
    facilities: [
      { id: 'f8', name: '露台酒吧', group: 'service' },
      { id: 'f9', name: 'SPA', group: 'recreation' },
      { id: 'f10', name: '接送机', group: 'traffic' }
    ],
    bannerImages: [
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb',
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85'
    ],
    coverImage: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb',
    roomTypes: roomTemplate('hotel-003').map((item, index) => ({ ...item, price: item.price + 220 + index * 40 })),
    priceStart: 788,
    promotions: [{ id: 'p4', title: '夜景房升级券', tag: '热门', discountText: '部分房型免费升层' }],
    trafficInfo: ['距南京东路步行街步行 8 分钟'],
    nearbySpots: ['外滩', '豫园', '南京东路'],
    policies: {
      checkInTime: '15:00后',
      checkOutTime: '12:00前',
      breakfast: '高空景观早餐',
      cancellation: '入住前一日 18:00 前可取消',
      children: '可提供儿童洗漱用品',
      pets: '不可携带宠物'
    },
    reviewSummary: { score: 4.9, reviewCount: 3568, highlights: ['夜景很赞', '服务细致'] },
    businessArea: '外滩商圈',
    distanceToMetro: '距地铁 280m',
    recommendedText: '外滩夜景强，适合周末微度假',
    status: 'pending',
    merchantId: 'u-merchant-01',
    createdAt: dayjs().subtract(5, 'day').toISOString(),
    updatedAt: dayjs().toISOString()
  }
];

export const auditRecords: AuditRecord[] = [];

export const systemMenus: AdminMenuNode[] = ADMIN_MENU_TREE;

export const systemLogs: SystemLog[] = [
  {
    id: 'log-1',
    operatorId: 'u-super-01',
    operatorName: '系统超级管理员',
    module: '用户管理',
    action: '新增',
    ip: '192.168.1.10',
    detail: '新增管理员账号 admin01',
    createdAt: dayjs().subtract(1, 'hour').format('YYYY-MM-DD HH:mm:ss')
  },
  {
    id: 'log-2',
    operatorId: 'u-admin-01',
    operatorName: '平台管理员',
    module: '酒店审核',
    action: '审核通过',
    ip: '192.168.1.12',
    detail: '审核通过 上海陆家嘴云栖酒店',
    createdAt: dayjs().subtract(2, 'hour').format('YYYY-MM-DD HH:mm:ss')
  },
  {
    id: 'log-3',
    operatorId: 'u-super-01',
    operatorName: '系统超级管理员',
    module: '角色管理',
    action: '编辑',
    ip: '192.168.1.13',
    detail: '调整管理员角色菜单范围',
    createdAt: dayjs().subtract(3, 'hour').format('YYYY-MM-DD HH:mm:ss')
  },
  {
    id: 'log-4',
    operatorId: 'u-merchant-01',
    operatorName: '陆家嘴商家',
    module: '酒店管理',
    action: '编辑',
    ip: '192.168.1.15',
    detail: '更新酒店图片与价格',
    createdAt: dayjs().subtract(4, 'hour').format('YYYY-MM-DD HH:mm:ss')
  }
];

export const banners = [
  {
    id: 'banner-1',
    hotelId: 'hotel-001',
    title: '陆家嘴高分口碑榜',
    subtitle: '金融区高效率出行，含双早套餐',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945'
  },
  {
    id: 'banner-2',
    hotelId: 'hotel-003',
    title: '外滩夜景周末游',
    subtitle: '高星景观房，适合纪念日和短住',
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb'
  }
];
