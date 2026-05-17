import express from 'express';
import cors from 'cors';
import dayjs from 'dayjs';
import { auditRecords, banners, hotels, roleProfiles, systemLogs, systemMenus, users } from './db';
const app = express();
app.use(cors());
app.use(express.json());
const createToken = (userId) => `mock-token-${userId}`;
const parseToken = (token = '') => token.replace('Bearer mock-token-', '');
const getRoleProfile = (role) => roleProfiles.find((item) => item.code === role);
const toSafeUser = (user) => {
    const { password: _password, ...safeUser } = user;
    return {
        ...safeUser,
        permissionKeys: getRoleProfile(user.role)?.permissionKeys || []
    };
};
const addSystemLog = (payload) => {
    systemLogs.unshift({
        id: `log-${systemLogs.length + 1}`,
        createdAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        ...payload
    });
};
const authMiddleware = (req, res, next) => {
    const userId = parseToken(String(req.headers.authorization || ''));
    const user = users.find((item) => item.id === userId);
    if (!user)
        return res.status(401).json({ message: '未登录或登录已失效' });
    req.user = user;
    next();
};
const requireRoles = (roles) => (req, res, next) => {
    const user = req.user;
    if (!roles.includes(user.role))
        return res.status(403).json({ message: '无权限访问' });
    next();
};
const isVisibleForMobile = (hotel) => hotel.status === 'approved';
const filterHotels = (list, query) => {
    let result = [...list];
    if (query.scene === 'mobile')
        result = result.filter(isVisibleForMobile);
    if (query.keyword) {
        result = result.filter((hotel) => [hotel.nameCn, hotel.nameEn, hotel.city, hotel.businessArea].join('|').includes(String(query.keyword)));
    }
    if (query.city)
        result = result.filter((hotel) => hotel.city.includes(String(query.city)));
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
    if (user.status === 'disabled')
        return res.status(400).json({ message: '账号已停用' });
    res.json({ token: createToken(user.id), user: toSafeUser(user) });
});
app.post('/api/auth/register', (req, res) => {
    const { username, password, nickname, role } = req.body;
    if (users.some((item) => item.username === username))
        return res.status(400).json({ message: '账号已存在' });
    if (role === 'superAdmin')
        return res.status(403).json({ message: '超级管理员仅可由系统创建' });
    const user = {
        id: `u-${role}-${users.length + 1}`,
        username,
        password,
        nickname,
        role,
        status: 'enabled',
        hotelIds: [],
        createdAt: dayjs().toISOString()
    };
    users.push(user);
    addSystemLog({
        operatorId: user.id,
        operatorName: nickname,
        module: '注册',
        action: '创建',
        ip: '192.168.1.20',
        detail: `注册新账号 ${username}`
    });
    res.json({ token: createToken(user.id), user: toSafeUser(user) });
});
app.use('/api/auth/profile', authMiddleware);
app.get('/api/auth/profile', (req, res) => {
    res.json(toSafeUser(req.user));
});
app.get('/api/banners', (_, res) => res.json(banners));
app.get('/api/hotels', (req, res) => {
    const result = filterHotels(hotels, req.query);
    const page = Number(req.query.page || 1);
    const pageSize = Number(req.query.pageSize || 10);
    const start = (page - 1) * pageSize;
    const list = result.slice(start, start + pageSize);
    res.json({ list, total: result.length, page, pageSize, hasMore: start + pageSize < result.length });
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
app.post('/api/hotels/:id/book', (req, res) => {
    const hotel = hotels.find((item) => item.id === req.params.id);
    if (!hotel)
        return res.status(404).json({ message: '酒店不存在' });
    if (!isVisibleForMobile(hotel))
        return res.status(400).json({ message: '当前酒店暂不可预订' });
    const room = hotel.roomTypes.find((item) => item.id === req.body.roomId);
    if (!room)
        return res.status(404).json({ message: '房型不存在' });
    const roomCount = Math.max(1, Number(req.body.roomCount || 1));
    if (room.stock < roomCount) {
        return res.status(400).json({ message: '库存不足，请选择其他房型' });
    }
    room.stock -= roomCount;
    hotel.updatedAt = dayjs().toISOString();
    const availableRooms = hotel.roomTypes.filter((item) => item.stock > 0);
    if (availableRooms.length)
        hotel.priceStart = Math.min(...availableRooms.map((item) => item.price));
    res.json(hotel);
});
app.use('/api/merchant', authMiddleware, requireRoles(['merchant', 'superAdmin']));
app.use('/api/admin', authMiddleware, requireRoles(['admin', 'superAdmin']));
app.use('/api/system', authMiddleware, requireRoles(['superAdmin']));
app.get('/api/merchant/hotels', (req, res) => {
    const user = req.user;
    res.json(user.role === 'superAdmin' ? hotels : hotels.filter((hotel) => hotel.merchantId === user.id));
});
app.post('/api/merchant/hotels', (req, res) => {
    const user = req.user;
    const hotelId = `hotel-${String(hotels.length + 1).padStart(3, '0')}`;
    const hotel = {
        id: hotelId,
        district: '浦东新区',
        roomTypes: req.body.roomTypes?.length
            ? req.body.roomTypes
            : [
                {
                    id: `${hotelId}-room-1`,
                    hotelId,
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
        merchantId: user.role === 'superAdmin' ? 'u-super-01' : user.id,
        createdAt: dayjs().toISOString(),
        updatedAt: dayjs().toISOString(),
        status: 'pending',
        ...req.body
    };
    hotels.unshift(hotel);
    addSystemLog({
        operatorId: user.id,
        operatorName: user.nickname,
        module: '酒店管理',
        action: '新增',
        ip: '192.168.1.21',
        detail: `新增酒店 ${hotel.nameCn || hotel.id}`
    });
    res.json(hotel);
});
app.put('/api/merchant/hotels/:id', (req, res) => {
    const user = req.user;
    const hotel = hotels.find((item) => item.id === req.params.id && (user.role === 'superAdmin' || item.merchantId === user.id));
    if (!hotel)
        return res.status(404).json({ message: '酒店不存在或无权限' });
    Object.assign(hotel, req.body, {
        status: 'pending',
        rejectReason: '',
        updatedAt: dayjs().toISOString()
    });
    addSystemLog({
        operatorId: user.id,
        operatorName: user.nickname,
        module: '酒店管理',
        action: '编辑',
        ip: '192.168.1.22',
        detail: `编辑酒店 ${hotel.nameCn}`
    });
    res.json(hotel);
});
app.get('/api/admin/hotels', (req, res) => {
    const { keyword = '', status = '' } = req.query;
    let result = [...hotels];
    if (keyword)
        result = result.filter((hotel) => [hotel.nameCn, hotel.city].join('|').includes(String(keyword)));
    if (status)
        result = result.filter((hotel) => hotel.status === status);
    res.json(result);
});
app.get('/api/admin/hotels/:id', (req, res) => {
    const hotel = hotels.find((item) => item.id === req.params.id);
    if (!hotel)
        return res.status(404).json({ message: '酒店不存在' });
    res.json(hotel);
});
app.post('/api/admin/hotels/:id/audit', (req, res) => {
    const user = req.user;
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
    addSystemLog({
        operatorId: user.id,
        operatorName: user.nickname,
        module: '酒店审核',
        action: req.body.status === 'approved' ? '审核通过' : '审核驳回',
        ip: '192.168.1.23',
        detail: `${hotel.nameCn}${req.body.reason ? `，原因：${req.body.reason}` : ''}`
    });
    res.json(hotel);
});
app.post('/api/admin/hotels/:id/:hotelAction', (req, res) => {
    const user = req.user;
    const hotel = hotels.find((item) => item.id === req.params.id);
    if (!hotel)
        return res.status(404).json({ message: '酒店不存在' });
    const hotelAction = req.params.hotelAction;
    if (!['publish', 'offline', 'restore'].includes(hotelAction)) {
        return res.status(400).json({ message: '非法操作' });
    }
    const statusMap = {
        publish: 'approved',
        offline: 'offline',
        restore: 'approved'
    };
    hotel.status = statusMap[hotelAction];
    hotel.updatedAt = dayjs().toISOString();
    addSystemLog({
        operatorId: user.id,
        operatorName: user.nickname,
        module: '酒店审核',
        action: hotelAction,
        ip: '192.168.1.24',
        detail: `${hotelAction} ${hotel.nameCn}`
    });
    res.json(hotel);
});
app.get('/api/system/users', (req, res) => {
    const keyword = String(req.query.keyword || '');
    const list = users
        .filter((item) => keyword ? [item.username, item.nickname, item.role].join('|').toLowerCase().includes(keyword.toLowerCase()) : true)
        .map(toSafeUser);
    res.json(list);
});
app.post('/api/system/users', (req, res) => {
    const operator = req.user;
    const profile = getRoleProfile(req.body.role);
    const user = {
        id: `u-${req.body.role}-${users.length + 1}`,
        username: req.body.username,
        password: req.body.password || '123456',
        nickname: req.body.nickname,
        role: req.body.role,
        status: req.body.status || 'enabled',
        hotelIds: [],
        permissionKeys: profile?.permissionKeys,
        createdAt: dayjs().format('YYYY-MM-DD HH:mm:ss')
    };
    users.unshift(user);
    addSystemLog({
        operatorId: operator.id,
        operatorName: operator.nickname,
        module: '用户管理',
        action: '新增',
        ip: '192.168.1.25',
        detail: `新增用户 ${user.username}`
    });
    res.json(toSafeUser(user));
});
app.put('/api/system/users/:id', (req, res) => {
    const operator = req.user;
    const user = users.find((item) => item.id === req.params.id);
    if (!user)
        return res.status(404).json({ message: '用户不存在' });
    Object.assign(user, req.body);
    addSystemLog({
        operatorId: operator.id,
        operatorName: operator.nickname,
        module: '用户管理',
        action: '编辑',
        ip: '192.168.1.26',
        detail: `编辑用户 ${user.username}`
    });
    res.json(toSafeUser(user));
});
app.post('/api/system/users/:id/delete', (req, res) => {
    const operator = req.user;
    const index = users.findIndex((item) => item.id === req.params.id);
    if (index === -1)
        return res.status(404).json({ message: '用户不存在' });
    const [deleted] = users.splice(index, 1);
    addSystemLog({
        operatorId: operator.id,
        operatorName: operator.nickname,
        module: '用户管理',
        action: '删除',
        ip: '192.168.1.27',
        detail: `删除用户 ${deleted.username}`
    });
    res.json({ success: true });
});
app.get('/api/system/roles', (_req, res) => {
    res.json(roleProfiles);
});
app.put('/api/system/roles/:id', (req, res) => {
    const operator = req.user;
    const role = roleProfiles.find((item) => item.id === req.params.id);
    if (!role)
        return res.status(404).json({ message: '角色不存在' });
    Object.assign(role, req.body);
    users.forEach((user) => {
        if (user.role === role.code)
            user.permissionKeys = role.permissionKeys;
    });
    addSystemLog({
        operatorId: operator.id,
        operatorName: operator.nickname,
        module: '角色管理',
        action: '编辑',
        ip: '192.168.1.28',
        detail: `更新角色 ${role.name}`
    });
    res.json(role);
});
app.get('/api/system/menus', (_req, res) => {
    res.json(systemMenus);
});
app.get('/api/system/logs', (req, res) => {
    const keyword = String(req.query.keyword || '');
    const list = systemLogs.filter((item) => keyword ? [item.operatorName, item.module, item.action, item.detail].join('|').includes(keyword) : true);
    res.json(list);
});
app.listen(3000, () => {
    console.log('Mock API server is running at http://localhost:3000');
});
