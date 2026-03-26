export const HOTEL_TAG_OPTIONS = ['亲子优选', '豪华高星', '免费停车', '近地铁', '含早餐', '可取消'];
export const HOTEL_SORT_OPTIONS = [
    { label: '推荐优先', value: 'recommended' },
    { label: '距离优先', value: 'distance' },
    { label: '价格升序', value: 'priceAsc' },
    { label: '评分优先', value: 'scoreDesc' }
];
export const PERMISSION_LABELS = {
    dashboard_view: '查看经营概览',
    hotel_edit: '编辑酒店',
    audit_manage: '审核酒店',
    user_manage: '用户管理',
    role_manage: '角色管理',
    menu_manage: '菜单管理',
    log_manage: '日志管理'
};
export const ADMIN_MENU_TREE = [
    {
        key: 'dashboard',
        label: '经营概览',
        path: '/dashboard'
    },
    {
        key: 'hotel-edit',
        label: '酒店管理',
        path: '/hotel/edit'
    },
    {
        key: 'audit',
        label: '审核中心',
        path: '/audit'
    },
    {
        key: 'system',
        label: '系统管理',
        children: [
            { key: 'system-users', label: '用户管理', path: '/system/users' },
            { key: 'system-roles', label: '角色管理', path: '/system/roles' },
            { key: 'system-menus', label: '菜单管理', path: '/system/menus' },
            { key: 'system-logs', label: '日志管理', path: '/system/logs' }
        ]
    }
];
export const ROLE_MENU_ACCESS = {
    merchant: ['dashboard', 'hotel-edit'],
    admin: ['dashboard', 'audit'],
    superAdmin: ['dashboard', 'hotel-edit', 'audit', 'system', 'system-users', 'system-roles', 'system-menus', 'system-logs']
};
