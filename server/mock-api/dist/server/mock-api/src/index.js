import express from 'express';
import cors from 'cors';
import dayjs from 'dayjs';
import { auditRecords, banners, hotels, users } from './db';
const app = express();
app.use(cors());
app.use(express.json());
const createToken = (userId) => `mock-token-${userId}`;
const parseToken = (token = '') => token.replace('Bearer mock-token-', '');
const authMiddleware = (req, res, next) => {
    const userId = parseToken(String(req.headers.authorization || ''));
    const user = users.find((item) => item.id === userId);
    if (!user)
        return res.status(401).json({ message: '未登录或登录已失效' });
    req.user = user;
    next();
};
const isVisibleForMobile = (hotel) => hotel.status === 'approved';
const filterHotels = (list, query) => {
    let result = [...list];
    if (query.scene === 'mobile')
        result = result.filter(isVisibleForMobile);
    if (query.keyword) {
        result = result.filter((hotel) => [hotel.nameCn, hotel.nameEn, hotel.city, hotel.businessArea].join('|').includes(query.keyword));
    }
    if (query.city)
        result = result.filter((hotel) => hotel.city.includes(query.city));
    if (query.breakfast === 'true')
        result = result.filter((hotel) => hotel.tags.includes('含早餐'));
    if (query.freeCancel === 'true')
        result = result.filter((hotel) => hotel.tags.includes('可取消'));
    if (query.nearMetro === 'true')
        result = result.filter((hotel) => hotel.tags.includes('近地铁'));
    if (query.tags) {
        const tags = String(query.tags).split(',');
        result = result.filter((hotel) => tags.every((tag) => hotel.tags.includes(tag)));
    }
    if (query.starList) {
        const stars = String(query.starList).split(',').map(Number);
        result = result.filter((hotel) => stars.includes(hotel.star));
    }
    const minPrice = Number(query.minPrice || 0);
    const maxPrice = Number(query.maxPrice || Number.MAX_SAFE_INTEGER);
    result = result.filter((hotel) => hotel.priceStart >= minPrice && hotel.priceStart <= maxPrice);
    switch (query.sortBy) {
        case 'priceAsc':
            result.sort((a, b) => a.priceStart - b.priceStart);
            break;
        case 'scoreDesc':
            result.sort((a, b) => b.score - a.score);
            break;
        case 'distance':
            result.sort((a, b) => Number(a.distanceToMetro.replace(/\D/g, '')) - Number(b.distanceToMetro.replace(/\D/g, '')));
            break;
        default:
            result.sort((a, b) => b.score * b.reviewCount - a.score * a.reviewCount);
    }
    return result;
};
app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find((item) => item.username === username && item.password === password);
    if (!user)
        return res.status(400).json({ message: '账号或密码错误' });
    const { password: _, ...safeUser } = user;
    res.json({ token: createToken(user.id), user: safeUser });
});
app.post('/api/auth/register', (req, res) => {
    const { username, password, nickname, role } = req.body;
    if (users.some((item) => item.username === username)) {
        return res.status(400).json({ message: '账号已存在' });
    }
    const user = {
        id: `u-${role}-${users.length + 1}`,
        username,
        password,
        nickname,
        role,
        hotelIds: [],
        createdAt: dayjs().toISOString()
    };
    users.push(user);
    const { password: _, ...safeUser } = user;
    res.json({ token: createToken(user.id), user: safeUser });
});
app.get('/api/banners', (_, res) => res.json(banners));
app.get('/api/hotels', (req, res) => {
    const result = filterHotels(hotels, req.query);
    const page = Number(req.query.page || 1);
    const pageSize = Number(req.query.pageSize || 10);
    const start = (page - 1) * pageSize;
    const list = result.slice(start, start + pageSize);
    res.json({
        list,
        total: result.length,
        page,
        pageSize,
        hasMore: start + pageSize < result.length
    });
});
app.get('/api/hotels/:id', (req, res) => {
    const hotel = hotels.find((item) => item.id === req.params.id);
    if (!hotel)
        return res.status(404).json({ message: '酒店不存在' });
    if (req.query.scene === 'mobile' && !isVisibleForMobile(hotel)) {
        return res.status(404).json({ message: '酒店暂不可预订' });
    }
    res.json(hotel);
});
app.use('/api/merchant', authMiddleware);
app.use('/api/admin', authMiddleware);
app.get('/api/merchant/hotels', (req, res) => {
    const user = req.user;
    if (user.role !== 'merchant')
        return res.status(403).json({ message: '仅商户可访问' });
    res.json(hotels.filter((hotel) => hotel.merchantId === user.id));
});
app.post('/api/merchant/hotels', (req, res) => {
    const user = req.user;
    if (user.role !== 'merchant')
        return res.status(403).json({ message: '仅商户可访问' });
    const hotel = {
        id: `hotel-${String(hotels.length + 1).padStart(3, '0')}`,
        district: '浦东新区',
        roomTypes: req.body.roomTypes?.length
            ? req.body.roomTypes
            : [
                {
                    id: `hotel-${hotels.length + 1}-room-1`,
                    hotelId: `hotel-${hotels.length + 1}`,
                    name: '高级大床房',
                    area: '30m²',
                    occupancy: 2,
                    floor: '8-12层',
                    breakfast: '双早',
                    cancellationPolicy: '限时可取消',
                    bedType: '1张大床',
                    price: req.body.priceStart,
                    stock: 6
                }
            ],
        policies: {
            checkInTime: '14:00后',
            checkOutTime: '12:00前',
            breakfast: '以页面为准',
            cancellation: '以房型政策为准',
            children: '欢迎儿童入住',
            pets: '不可携带宠物'
        },
        reviewSummary: { score: req.body.score || 4.6, reviewCount: req.body.reviewCount || 100, highlights: ['新上架'] },
        distanceToMetro: '距地铁 500m',
        recommendedText: '新上架待审核',
        rejectReason: '',
        merchantId: user.id,
        createdAt: dayjs().toISOString(),
        updatedAt: dayjs().toISOString(),
        status: 'pending',
        ...req.body
    };
    hotels.unshift(hotel);
    res.json(hotel);
});
app.put('/api/merchant/hotels/:id', (req, res) => {
    const user = req.user;
    if (user.role !== 'merchant')
        return res.status(403).json({ message: '仅商户可访问' });
    const hotel = hotels.find((item) => item.id === req.params.id && item.merchantId === user.id);
    if (!hotel)
        return res.status(404).json({ message: '酒店不存在或无权限' });
    Object.assign(hotel, req.body, {
        status: 'pending',
        rejectReason: '',
        updatedAt: dayjs().toISOString()
    });
    res.json(hotel);
});
app.get('/api/admin/hotels', (req, res) => {
    const user = req.user;
    if (user.role !== 'admin')
        return res.status(403).json({ message: '仅管理员可访问' });
    const { keyword = '', status = '' } = req.query;
    let result = [...hotels];
    if (keyword) {
        result = result.filter((hotel) => [hotel.nameCn, hotel.city].join('|').includes(String(keyword)));
    }
    if (status)
        result = result.filter((hotel) => hotel.status === status);
    res.json(result);
});
app.get('/api/admin/hotels/:id', (req, res) => {
    const user = req.user;
    if (user.role !== 'admin')
        return res.status(403).json({ message: '仅管理员可访问' });
    const hotel = hotels.find((item) => item.id === req.params.id);
    if (!hotel)
        return res.status(404).json({ message: '酒店不存在' });
    res.json(hotel);
});
app.post('/api/admin/hotels/:id/audit', (req, res) => {
    const user = req.user;
    if (user.role !== 'admin')
        return res.status(403).json({ message: '仅管理员可访问' });
    const hotel = hotels.find((item) => item.id === req.params.id);
    if (!hotel)
        return res.status(404).json({ message: '酒店不存在' });
    hotel.status = req.body.status;
    hotel.rejectReason = req.body.reason || '';
    hotel.updatedAt = dayjs().toISOString();
    auditRecords.push({
        id: `audit-${auditRecords.length + 1}`,
        hotelId: hotel.id,
        operatorId: user.id,
        status: req.body.status,
        reason: req.body.reason,
        createdAt: dayjs().toISOString()
    });
    res.json(hotel);
});
app.post('/api/admin/hotels/:id/publish', (req, res) => {
    const user = req.user;
    if (user.role !== 'admin')
        return res.status(403).json({ message: '仅管理员可访问' });
    const hotel = hotels.find((item) => item.id === req.params.id);
    if (!hotel)
        return res.status(404).json({ message: '酒店不存在' });
    hotel.status = 'approved';
    hotel.updatedAt = dayjs().toISOString();
    res.json(hotel);
});
app.post('/api/admin/hotels/:id/offline', (req, res) => {
    const user = req.user;
    if (user.role !== 'admin')
        return res.status(403).json({ message: '仅管理员可访问' });
    const hotel = hotels.find((item) => item.id === req.params.id);
    if (!hotel)
        return res.status(404).json({ message: '酒店不存在' });
    hotel.status = 'offline';
    hotel.updatedAt = dayjs().toISOString();
    res.json(hotel);
});
app.post('/api/admin/hotels/:id/restore', (req, res) => {
    const user = req.user;
    if (user.role !== 'admin')
        return res.status(403).json({ message: '仅管理员可访问' });
    const hotel = hotels.find((item) => item.id === req.params.id);
    if (!hotel)
        return res.status(404).json({ message: '酒店不存在' });
    hotel.status = 'approved';
    hotel.updatedAt = dayjs().toISOString();
    res.json(hotel);
});
app.listen(3000, () => {
    console.log('Mock API server is running at http://localhost:3000');
});
