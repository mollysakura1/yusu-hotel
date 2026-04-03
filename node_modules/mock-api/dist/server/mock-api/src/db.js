import dayjs from 'dayjs';
import { ADMIN_MENU_TREE } from '@shared/constants';
export const roleProfiles = [
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
export const users = [
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
const roomTemplate = (hotelId) => [
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
const createCityHotel = ({ id, city, district, businessArea, address, nameCn, nameEn, star, score, priceStart, distanceToMetro, recommendedText }) => ({
    id,
    nameCn,
    nameEn,
    city,
    district,
    address,
    star,
    score,
    reviewCount: 1200 + Number(id.replace(/\D/g, '').slice(-2) || '1') * 20,
    openYear: 2020,
    tags: ['近地铁', '含早餐', '高性价比'],
    facilities: [
        { id: `${id}-f1`, name: '免费停车', group: 'basic' },
        { id: `${id}-f2`, name: '健身房', group: 'recreation' },
        { id: `${id}-f3`, name: '洗衣房', group: 'service' }
    ],
    bannerImages: [
        'https://images.unsplash.com/photo-1566073771259-6a8506099945',
        'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa'
    ],
    coverImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945',
    roomTypes: roomTemplate(id).map((room, index) => ({
        ...room,
        price: priceStart + index * 80,
        originalPrice: priceStart + index * 80 + 120
    })),
    priceStart,
    promotions: [{ id: `${id}-p1`, title: '限时优惠', tag: '促销', discountText: '提前预订享 9 折' }],
    trafficInfo: [`${distanceToMetro}，出行便捷`, `距${businessArea}核心区域约 10 分钟车程`],
    nearbySpots: [businessArea, `${city}地标商圈`, `${city}热门景点`],
    policies: {
        checkInTime: '14:00后',
        checkOutTime: '12:00前',
        breakfast: '自助早餐 7:00-10:00',
        cancellation: '部分房型支持免费取消',
        children: '欢迎携带儿童入住',
        pets: '不可携带宠物'
    },
    reviewSummary: { score, reviewCount: 1200, highlights: ['位置方便', '服务稳定', '性价比高'] },
    businessArea,
    distanceToMetro,
    recommendedText,
    status: 'approved',
    merchantId: 'u-merchant-02',
    createdAt: dayjs().subtract(7, 'day').toISOString(),
    updatedAt: dayjs().toISOString()
});
export const hotels = [
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
hotels.push(createCityHotel({
    id: 'hotel-101',
    city: '杭州',
    district: '上城区',
    businessArea: '西湖湖滨商圈',
    address: '杭州市上城区延安路 188 号',
    nameCn: '杭州湖滨云舍酒店',
    nameEn: 'Yunshe Hotel Hangzhou West Lake',
    star: 4,
    score: 4.7,
    priceStart: 498,
    distanceToMetro: '距地铁 280m',
    recommendedText: '西湖出行便捷，适合周末短住'
}), createCityHotel({
    id: 'hotel-102',
    city: '杭州',
    district: '西湖区',
    businessArea: '黄龙商圈',
    address: '杭州市西湖区学院路 66 号',
    nameCn: '杭州黄龙雅致酒店',
    nameEn: 'Elegance Hotel Hangzhou Huanglong',
    star: 5,
    score: 4.8,
    priceStart: 628,
    distanceToMetro: '距地铁 360m',
    recommendedText: '商旅与休闲兼顾，口碑稳定'
}), createCityHotel({
    id: 'hotel-103',
    city: '北京',
    district: '朝阳区',
    businessArea: '国贸商圈',
    address: '北京市朝阳区建国路 89 号',
    nameCn: '北京国贸云廷酒店',
    nameEn: 'Yunting Hotel Beijing Guomao',
    star: 5,
    score: 4.8,
    priceStart: 758,
    distanceToMetro: '距地铁 220m',
    recommendedText: '核心商圈高效率出行，商务优选'
}), createCityHotel({
    id: 'hotel-104',
    city: '北京',
    district: '东城区',
    businessArea: '王府井商圈',
    address: '北京市东城区东安门大街 128 号',
    nameCn: '北京王府井臻选酒店',
    nameEn: 'Select Hotel Beijing Wangfujing',
    star: 4,
    score: 4.6,
    priceStart: 688,
    distanceToMetro: '距地铁 340m',
    recommendedText: '景点与商圈兼顾，逛街方便'
}), createCityHotel({
    id: 'hotel-105',
    city: '广州',
    district: '天河区',
    businessArea: '珠江新城',
    address: '广州市天河区花城大道 108 号',
    nameCn: '广州珠江新城悦程酒店',
    nameEn: 'Yuecheng Hotel Guangzhou Zhujiang New Town',
    star: 5,
    score: 4.7,
    priceStart: 598,
    distanceToMetro: '距地铁 260m',
    recommendedText: '天河核心地段，差旅高效'
}), createCityHotel({
    id: 'hotel-106',
    city: '广州',
    district: '越秀区',
    businessArea: '北京路商圈',
    address: '广州市越秀区中山五路 166 号',
    nameCn: '广州北京路轻奢酒店',
    nameEn: 'Boutique Hotel Guangzhou Beijing Road',
    star: 4,
    score: 4.6,
    priceStart: 468,
    distanceToMetro: '距地铁 310m',
    recommendedText: '逛街觅食方便，性价比高'
}), createCityHotel({
    id: 'hotel-107',
    city: '深圳',
    district: '福田区',
    businessArea: '会展中心商圈',
    address: '深圳市福田区福华三路 88 号',
    nameCn: '深圳会展中心嘉誉酒店',
    nameEn: 'Jiayu Hotel Shenzhen Convention Center',
    star: 5,
    score: 4.8,
    priceStart: 628,
    distanceToMetro: '距地铁 190m',
    recommendedText: '展会差旅友好，交通转换快'
}), createCityHotel({
    id: 'hotel-108',
    city: '深圳',
    district: '南山区',
    businessArea: '科技园商圈',
    address: '深圳市南山区科苑路 99 号',
    nameCn: '深圳科技园智选酒店',
    nameEn: 'Smart Hotel Shenzhen Science Park',
    star: 4,
    score: 4.7,
    priceStart: 538,
    distanceToMetro: '距地铁 280m',
    recommendedText: '商务出差高频选择，配套成熟'
}), createCityHotel({
    id: 'hotel-109',
    city: '成都',
    district: '锦江区',
    businessArea: '春熙路商圈',
    address: '成都市锦江区红星路 3 段 58 号',
    nameCn: '成都春熙路澜景酒店',
    nameEn: 'Lanjing Hotel Chengdu Chunxi Road',
    star: 4,
    score: 4.7,
    priceStart: 458,
    distanceToMetro: '距地铁 230m',
    recommendedText: '逛街美食都方便，适合首次到访'
}), createCityHotel({
    id: 'hotel-110',
    city: '成都',
    district: '武侯区',
    businessArea: '金融城商圈',
    address: '成都市武侯区交子大道 128 号',
    nameCn: '成都金融城雅宿酒店',
    nameEn: 'Yasu Hotel Chengdu Financial City',
    star: 5,
    score: 4.8,
    priceStart: 568,
    distanceToMetro: '距地铁 330m',
    recommendedText: '新城商务区，房型舒适度高'
}), createCityHotel({
    id: 'hotel-111',
    city: '天津',
    district: '和平区',
    businessArea: '滨江道商圈',
    address: '天津市和平区南京路 199 号',
    nameCn: '天津滨江道精选酒店',
    nameEn: 'Select Hotel Tianjin Binjiangdao',
    star: 4,
    score: 4.5,
    priceStart: 428,
    distanceToMetro: '距地铁 280m',
    recommendedText: '中心城区出行方便，预算友好'
}), createCityHotel({
    id: 'hotel-112',
    city: '天津',
    district: '河西区',
    businessArea: '梅江会展商圈',
    address: '天津市河西区友谊南路 66 号',
    nameCn: '天津梅江会展酒店',
    nameEn: 'Convention Hotel Tianjin Meijiang',
    star: 5,
    score: 4.7,
    priceStart: 558,
    distanceToMetro: '距地铁 390m',
    recommendedText: '会展配套完善，适合差旅会议'
}), createCityHotel({
    id: 'hotel-113',
    city: '南京',
    district: '玄武区',
    businessArea: '新街口商圈',
    address: '南京市玄武区中山东路 188 号',
    nameCn: '南京新街口星澜酒店',
    nameEn: 'Xinglan Hotel Nanjing Xinjiekou',
    star: 5,
    score: 4.8,
    priceStart: 538,
    distanceToMetro: '距地铁 180m',
    recommendedText: '核心商圈地铁直达，购物方便'
}), createCityHotel({
    id: 'hotel-114',
    city: '南京',
    district: '建邺区',
    businessArea: '河西商圈',
    address: '南京市建邺区江东中路 88 号',
    nameCn: '南京河西雅致酒店',
    nameEn: 'Elegance Hotel Nanjing Hexi',
    star: 4,
    score: 4.6,
    priceStart: 488,
    distanceToMetro: '距地铁 320m',
    recommendedText: '新城区域配套成熟，适合商旅'
}), createCityHotel({
    id: 'hotel-115',
    city: '苏州',
    district: '姑苏区',
    businessArea: '观前街商圈',
    address: '苏州市姑苏区人民路 166 号',
    nameCn: '苏州观前街臻享酒店',
    nameEn: 'Zhenxiang Hotel Suzhou Guanqian Street',
    star: 4,
    score: 4.7,
    priceStart: 438,
    distanceToMetro: '距地铁 260m',
    recommendedText: '古城游玩方便，生活氛围浓'
}), createCityHotel({
    id: 'hotel-116',
    city: '苏州',
    district: '工业园区',
    businessArea: '金鸡湖商圈',
    address: '苏州市工业园区现代大道 99 号',
    nameCn: '苏州金鸡湖景观酒店',
    nameEn: 'Lakeview Hotel Suzhou Jinji Lake',
    star: 5,
    score: 4.8,
    priceStart: 598,
    distanceToMetro: '距地铁 340m',
    recommendedText: '湖景资源优，适合休闲和商务'
}), createCityHotel({
    id: 'hotel-117',
    city: '武汉',
    district: '江汉区',
    businessArea: '江汉路商圈',
    address: '武汉市江汉区解放大道 188 号',
    nameCn: '武汉江汉路悦享酒店',
    nameEn: 'Yuexiang Hotel Wuhan Jianghan Road',
    star: 4,
    score: 4.6,
    priceStart: 428,
    distanceToMetro: '距地铁 240m',
    recommendedText: '老牌商圈，逛街和通勤都方便'
}), createCityHotel({
    id: 'hotel-118',
    city: '武汉',
    district: '武昌区',
    businessArea: '楚河汉街商圈',
    address: '武汉市武昌区中北路 88 号',
    nameCn: '武汉汉街星悦酒店',
    nameEn: 'Xingyue Hotel Wuhan Han Street',
    star: 5,
    score: 4.7,
    priceStart: 538,
    distanceToMetro: '距地铁 350m',
    recommendedText: '景点与商圈兼顾，房型新'
}), createCityHotel({
    id: 'hotel-119',
    city: '西安',
    district: '碑林区',
    businessArea: '钟楼商圈',
    address: '西安市碑林区东大街 88 号',
    nameCn: '西安钟楼雅宿酒店',
    nameEn: 'Yasu Hotel Xi an Bell Tower',
    star: 4,
    score: 4.7,
    priceStart: 398,
    distanceToMetro: '距地铁 260m',
    recommendedText: '古城核心区域，游玩路线顺'
}), createCityHotel({
    id: 'hotel-120',
    city: '西安',
    district: '雁塔区',
    businessArea: '小寨商圈',
    address: '西安市雁塔区长安中路 166 号',
    nameCn: '西安小寨都会酒店',
    nameEn: 'Metropolis Hotel Xi an Xiaozhai',
    star: 5,
    score: 4.8,
    priceStart: 518,
    distanceToMetro: '距地铁 210m',
    recommendedText: '商圈活跃，生活配套齐全'
}));
export const auditRecords = [];
export const systemMenus = ADMIN_MENU_TREE;
export const systemLogs = [
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
