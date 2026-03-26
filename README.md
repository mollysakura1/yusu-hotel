# 易宿酒店预订平台

基于 Vue 3 生态的单仓多端酒店预订项目，包含移动端 H5 用户端、PC 管理后台和 Node.js Mock API。整体视觉偏旅行预订平台风格，强调搜索效率、价格感知、筛选决策和后台运营管理能力。

## 项目亮点

- 单仓多端结构：`apps/mobile-h5`、`apps/admin-pc`、`server/mock-api`、`packages/shared`
- Vue 3 + Vite + TypeScript + Pinia + Vue Router 工程化落地
- 移动端首页、酒店列表、详情页完整串联，支持 query 条件透传
- 酒店列表支持分页加载、Skeleton、图片懒加载、排序与快捷筛选
- 后台支持登录注册、角色权限控制、商户酒店录入、管理员审核、超级管理员系统管理
- Mock API 内置真实感业务数据模型，覆盖酒店、房型、审核、用户、角色、菜单、日志
- 预留搜索历史、最近浏览、收藏、价格趋势提示、优惠活动等扩展能力

## 技术栈

- 前端：Vue 3、Vite、TypeScript、Vue Router、Pinia、Axios
- 样式：UnoCSS（移动端）、Element Plus（后台端）
- 服务：Node.js、Express
- 工具：dayjs、ESLint、Prettier

## 目录结构

```bash
vue3-hotel
├─ apps
│  ├─ mobile-h5
│  └─ admin-pc
├─ packages
│  └─ shared
├─ server
│  └─ mock-api
├─ package.json
└─ tsconfig.base.json
```

## 功能说明

### 移动端 H5

- 酒店查询首页
- 酒店列表页
- 酒店详情页
- Banner 推荐
- 搜索历史
- 最近浏览
- 收藏功能
- 价格趋势提示

### 管理后台

- 登录 / 注册
- 商户酒店录入与编辑
- 管理员酒店审核、发布、下线、恢复
- 超级管理员用户管理
- 超级管理员角色管理
- 超级管理员菜单管理
- 超级管理员日志管理

## 角色说明

- `merchant`
  - 可查看经营概览
  - 可管理自己的酒店信息

- `admin`
  - 可查看平台概览
  - 可审核、发布、下线、恢复酒店

- `superAdmin`
  - 拥有管理员全部权限
  - 可管理用户、角色、菜单、日志
  - 可查看全部系统管理菜单

## 核心业务规则

- 用户端只展示审核通过 `approved` 且未下线的酒店
- 首页搜索条件通过路由 query 传入列表页
- 列表页根据 query 动态加载酒店数据
- 详情页按酒店 `id` 拉取详情
- 商户新增或编辑酒店后，状态自动置为 `pending`
- 管理员审核通过后，酒店才可在用户端展示
- 管理员下线酒店后，用户端不可见，但后台支持恢复
- 房型价格按升序展示
- 后台菜单与页面权限按角色动态控制
- 驳回审核必须记录 `reason`
- 用户管理中的权限来自角色配置，角色调整后用户权限同步更新

## 启动方式

### 1. 安装依赖

```bash
npm install
```

### 2. 启动 Mock API

```bash
npm run dev:server
```

服务地址：[http://localhost:3000](http://localhost:3000)

### 3. 启动移动端 H5

```bash
npm run dev:mobile
```

访问地址：[http://localhost:5173](http://localhost:5173)

### 4. 启动 PC 管理后台

```bash
npm run dev:admin
```

访问地址：[http://localhost:5174](http://localhost:5174)

## 演示账号

- 超级管理员：`superadmin / 123456`
- 管理员：`admin01 / 123456`
- 商家：`merchant01 / 123456`

## 后续可扩展方向

- 订单支付与下单流程
- 优惠券、套餐价、会员价
- 酒店收藏与消息提醒
- 地图找酒店、附近推荐、价格趋势图表
- 管理端经营数据看板与审核日志明细


## 第一次更新

- 新增超级管理员角色 `superAdmin`
- 新增系统管理模块：
  - 用户管理
  - 角色管理
  - 菜单管理
  - 日志管理
- 新增角色驱动权限模型，用户权限自动继承自角色
- 管理后台菜单升级为分角色动态显示
- 超级管理员拥有酒店管理、审核管理和系统管理全部权限
- Mock API 新增用户、角色、菜单、日志相关接口与示例数据