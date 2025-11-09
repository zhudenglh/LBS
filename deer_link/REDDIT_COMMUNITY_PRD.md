# Reddit-like 社区产品需求文档 (PRD)

**项目名称**: 小路游 (XiaoLuYou) Reddit-like 社区重构
**文档版本**: v1.0
**创建日期**: 2025-11-08
**产品负责人**: [待填写]
**目标发布**: Q1 2025

---

## 📋 目录

1. [产品概述](#产品概述)
2. [社区架构设计](#社区架构设计)
3. [核心功能设计](#核心功能设计)
4. [数据模型](#数据模型)
5. [用户交互流程](#用户交互流程)
6. [技术实现方案](#技术实现方案)
7. [产品路线图](#产品路线图)
8. [成功指标](#成功指标)

---

## 1. 产品概述

### 1.1 产品定位

将小路游现有的简单社区功能升级为 **Reddit-like 扁平化社区架构**，采用 **圈子 (Subreddit) + Flair 标签** 的模式，为公交出行用户提供更灵活、更细分的讨论空间。

### 1.2 核心价值

- **扁平化架构**: 避免多层嵌套，降低用户认知成本
- **灵活分类**: Flair 标签系统支持动态分类，无需创建子社区
- **内容聚合**: 类 Reddit 的 Feed 系统，支持多种排序和筛选
- **社区自治**: 社区管理员可自定义 Flair、置顶帖、规则

### 1.3 目标用户

1. **公交通勤族** - 需要特定线路信息和实时路况
2. **美食探索者** - 寻找公交沿线美食推荐
3. **旅游爱好者** - 发现城市隐藏景点
4. **本地居民** - 分享生活服务信息

### 1.4 与 Reddit 的对比

| 功能 | Reddit | 小路游社区 |
|------|--------|----------|
| 顶层结构 | Subreddits | 圈子 (Circles) |
| 二级分类 | Flair | Flair |
| 主页 Feed | Home/Popular/All | 主页/热门/资讯 |
| 排序方式 | Hot/New/Top/Rising | 热门/最新/推荐 |
| 置顶帖 | Pinned Posts | 社区置顶 |
| 用户角色 | Moderator/User | 圈主/成员 |

---

## 2. 社区架构设计

### 2.1 社区层级结构

```
小路游社区
│
├─ 主页 Feed (全站内容聚合)
│  ├─ 推荐 (Recommended)
│  ├─ 热门 (Hot)
│  ├─ 最新 (New)
│  └─ 关注的圈子 (Following)
│
├─ 圈子列表 (Circles Directory)
│  ├─ 圈/南京公交 🚌
│  │  ├─ Flair: [5路]
│  │  ├─ Flair: [6路]
│  │  ├─ Flair: [s3路]
│  │  ├─ Flair: [22路]
│  │  ├─ Flair: [讨论]
│  │  ├─ Flair: [求助]
│  │  └─ Flair: [公告]
│  │
│  ├─ 圈/太原公交 🚌
│  │  ├─ Flair: [801路]
│  │  ├─ Flair: [802路]
│  │  └─ Flair: [讨论]
│  │
│  ├─ 圈/南京美食 🍜
│  │  ├─ Flair: [小吃]
│  │  ├─ Flair: [餐厅]
│  │  ├─ Flair: [探店]
│  │  └─ Flair: [评测]
│  │
│  ├─ 圈/南京酒店 🏨
│  │  ├─ Flair: [住宿推荐]
│  │  ├─ Flair: [价格对比]
│  │  └─ Flair: [体验分享]
│  │
│  └─ 圈/南京旅游 ✈️
│     ├─ Flair: [景点]
│     ├─ Flair: [路线]
│     └─ Flair: [攻略]
```

### 2.2 圈子 (Circle) 设计

**圈子属性**:
```typescript
interface Circle {
  id: string;                    // 圈子ID
  name: string;                  // 圈子名称，如 "南京公交"
  icon: string;                  // 圈子图标 emoji
  description: string;           // 圈子描述
  memberCount: number;           // 成员数
  postCount: number;             // 帖子数
  createdAt: string;             // 创建时间
  moderators: string[];          // 管理员ID列表
  flairs: Flair[];              // 可用的 Flair 标签
  rules: string[];              // 社区规则
  pinnedPosts: string[];        // 置顶帖ID列表
  coverImage?: string;          // 封面图（可选）
  color?: string;               // 主题色（可选）
}
```

**圈子类型**:
1. **交通类** - 南京公交、太原公交、地铁、共享单车
2. **美食类** - 南京美食、太原美食、特色小吃
3. **生活服务类** - 酒店、购物、医疗、教育
4. **旅游类** - 景点推荐、旅游攻略、周边游

### 2.3 Flair 系统设计

**Flair 属性**:
```typescript
interface Flair {
  id: string;                    // Flair ID
  circleId: string;              // 所属圈子ID
  name: string;                  // Flair 名称，如 "5路"
  color: string;                 // 背景色，如 "#FF5722"
  textColor: string;             // 文字色，如 "#FFFFFF"
  icon?: string;                 // 图标（可选）
  description?: string;          // 描述（可选）
  postCount: number;             // 使用该 Flair 的帖子数
  isDefault: boolean;            // 是否默认 Flair
  createdAt: string;
}
```

**Flair 使用规则**:
- ✅ **强制选择**: 发帖时必须选择至少一个 Flair
- ✅ **多标签支持**: 一篇帖子可以有多个 Flair（最多3个）
- ✅ **动态管理**: 圈主可以动态添加/删除/编辑 Flair
- ✅ **筛选功能**: 用户可以按 Flair 筛选帖子

**Flair 预设模板**:

| 圈子类型 | 预设 Flair |
|---------|-----------|
| 公交圈 | [线路号]、[讨论]、[求助]、[公告]、[失物招领]、[乘车体验] |
| 美食圈 | [小吃]、[餐厅]、[探店]、[评测]、[推荐]、[避雷] |
| 酒店圈 | [住宿推荐]、[价格对比]、[体验分享]、[优惠信息] |
| 旅游圈 | [景点]、[路线]、[攻略]、[问答]、[游记] |

---

## 3. 核心功能设计

### 3.1 主页 Feed 系统

**功能描述**: 类似 Reddit 主页，聚合所有圈子的内容，提供多种排序和筛选方式。

**Feed 切换选项** (位于左上角):

```
┌─────────────────────────────────┐
│ [主页 ▼]  搜索🔍  消息🔔         │
├─────────────────────────────────┤
│ ○ 主页 (Home)                   │
│ ○ 热门 (Hot)                    │
│ ○ 资讯 (News)                   │
│ ○ 关注的圈子 (Following)         │
└─────────────────────────────────┘
```

**Feed 类型说明**:

1. **主页 (Home)**
   - 显示用户关注的圈子的内容
   - 按时间倒序 + 推荐算法排序
   - 显示帖子所属圈子和 Flair

2. **热门 (Hot)**
   - 全站热门内容
   - 根据 `(点赞数 × 2 + 评论数 × 3) / 时间衰减` 排序
   - 显示热度指数

3. **资讯 (News)**
   - 官方公告、公交线路变更、重要通知
   - 仅限特定圈子的 [公告] Flair
   - 管理员发布

4. **关注的圈子 (Following)**
   - 显示已加入圈子列表
   - 快速切换到特定圈子

**帖子卡片设计** (参考 Reddit):

```
┌─────────────────────────────────────┐
│ 圈/南京公交 · [5路] [讨论]  2小时前  │
│ ───────────────────────────────────│
│ 📷 [图片]                           │
│                                    │
│ 5路公交早高峰太挤了，能不能加车？     │
│                                    │
│ ───────────────────────────────────│
│ 👍 123  💬 45  🔗 分享  ⭐ 收藏      │
│                                    │
│ u/张三 · 南京市民                   │
└─────────────────────────────────────┘
```

### 3.2 圈子页面设计

**页面布局** (参考 Reddit Subreddit 页面):

```
┌─────────────────────────────────────┐
│ ← 返回    圈/南京公交 🚌       ⋮ 更多 │
├─────────────────────────────────────┤
│ [封面图片]                           │
│                                    │
│ 南京公交                             │
│ 12.5K 成员 · 345 在线               │
│                                    │
│ [加入圈子] [发帖]                    │
├─────────────────────────────────────┤
│ 📌 置顶: 南京公交使用指南（必读）      │
│ 📌 置顶: 2025年春运时刻表            │
├─────────────────────────────────────┤
│ Flair 筛选:                         │
│ [全部] [5路] [6路] [s3路] [22路]... │
├─────────────────────────────────────┤
│ 排序: [热门 ▼]                       │
│ ○ 热门 (Hot)                        │
│ ○ 最新 (New)                        │
│ ○ 精华 (Top - All Time)             │
│ ○ 本周最佳 (Top - This Week)        │
├─────────────────────────────────────┤
│ [帖子列表]                           │
│ ...                                │
└─────────────────────────────────────┘
```

**圈子功能**:
- ✅ **置顶帖**: 最多3条，由圈主设置
- ✅ **Flair 筛选栏**: 水平滚动，显示所有可用 Flair
- ✅ **排序选项**: 热门、最新、精华（本周/本月/全部时间）
- ✅ **侧边栏** (可折叠):
  - 圈子简介
  - 圈子规则
  - 圈主和管理员
  - 相关圈子推荐

### 3.3 发帖功能

**发帖流程**:

```
1. 点击 "发帖" 按钮
   ↓
2. 选择目标圈子
   ↓
3. 选择 Flair（必选，支持多选最多3个）
   ↓
4. 填写标题（必填，5-100字）
   ↓
5. 填写正文（支持富文本、图片、链接）
   ↓
6. 添加图片（最多9张）
   ↓
7. 添加标签（可选，用于SEO）
   ↓
8. 预览
   ↓
9. 发布
```

**发帖界面设计**:

```
┌─────────────────────────────────────┐
│ ← 取消              发布 →           │
├─────────────────────────────────────┤
│ 发布到: [选择圈子 ▼]                  │
│                                    │
│ Flair: [选择标签]                    │
│ ○ [5路] ○ [讨论] ○ [求助]...        │
│                                    │
│ 标题:                               │
│ ┌───────────────────────────────┐  │
│ │ [输入标题（5-100字）]            │  │
│ └───────────────────────────────┘  │
│                                    │
│ 正文:                               │
│ ┌───────────────────────────────┐  │
│ │                               │  │
│ │ [输入内容，支持 Markdown]        │  │
│ │                               │  │
│ └───────────────────────────────┘  │
│                                    │
│ [📷 添加图片] [🔗 添加链接]           │
│                                    │
│ [预览]                              │
└─────────────────────────────────────┘
```

### 3.4 帖子详情页

**页面布局**:

```
┌─────────────────────────────────────┐
│ ← 返回                       ⋮ 更多  │
├─────────────────────────────────────┤
│ 圈/南京公交 · [5路] [讨论]  2小时前  │
│                                    │
│ u/张三 (楼主) · 南京市民              │
│                                    │
│ 5路公交早高峰太挤了，能不能加车？      │
│                                    │
│ 今天早上7:30在中山北路站等车，连续3辆  │
│ 5路都是满员状态，根本挤不上去...      │
│                                    │
│ [图片1] [图片2] [图片3]              │
│                                    │
│ ───────────────────────────────────│
│ 👍 123 👎 2  💬 45  🔗 分享  ⭐ 收藏  │
├─────────────────────────────────────┤
│ 评论 (45)       [排序: 热门 ▼]       │
│                                    │
│ ┌─────────────────────────────────┐ │
│ │ u/李四 · 2小时前                  │ │
│ │ 确实，5路早高峰太挤了，建议投诉...  │ │
│ │ 👍 34  💬 回复                    │ │
│ │                                 │ │
│ │   ├─ u/王五 · 1小时前             │ │
│ │   │  我也遇到了，已经投诉了         │ │
│ │   │  👍 12  💬 回复               │ │
│ └─────────────────────────────────┘ │
│                                    │
│ [输入评论...]                        │
└─────────────────────────────────────┘
```

**功能点**:
- ✅ **嵌套评论**: 最多3层
- ✅ **评论排序**: 热门、最新、最早
- ✅ **评论点赞/踩**
- ✅ **@ 提及用户**
- ✅ **楼主标识**
- ✅ **管理员标识**
- ✅ **置顶评论** (by 楼主或管理员)

### 3.5 圈子管理功能

**圈主权限**:
1. ✅ 添加/删除/编辑 Flair
2. ✅ 设置/取消置顶帖
3. ✅ 删除违规帖子和评论
4. ✅ 封禁用户（临时/永久）
5. ✅ 编辑圈子简介、规则
6. ✅ 添加/移除管理员
7. ✅ 设置圈子为公开/私有/受限

**管理面板设计**:

```
┌─────────────────────────────────────┐
│ 圈子管理 - 南京公交                   │
├─────────────────────────────────────┤
│ 基本信息                             │
│ - 名称: 南京公交                      │
│ - 简介: [编辑]                       │
│ - 规则: [编辑]                       │
│ - 封面: [上传图片]                    │
│                                    │
│ Flair 管理                           │
│ [+ 添加 Flair]                       │
│ ○ [5路] [编辑] [删除]                │
│ ○ [6路] [编辑] [删除]                │
│ ○ [讨论] [编辑] [删除]               │
│                                    │
│ 置顶帖                               │
│ [添加置顶]                           │
│ 1. 南京公交使用指南 [取消置顶]         │
│ 2. 2025年春运时刻表 [取消置顶]        │
│                                    │
│ 成员管理                             │
│ - 总成员: 12,543                     │
│ - 管理员: 3                          │
│ - 封禁用户: 12 [查看]                │
│                                    │
│ 数据统计                             │
│ - 今日新增帖子: 23                    │
│ - 今日活跃用户: 456                   │
│ - 本周增长: +234 成员                │
└─────────────────────────────────────┘
```

---

## 4. 数据模型

### 4.1 数据库 Schema

**Circle (圈子) 表**:
```typescript
interface CircleModel {
  id: string;                    // PK
  name: string;                  // 圈子名称
  slug: string;                  // URL slug，如 "nanjing-bus"
  icon: string;                  // 图标 emoji
  description: string;           // 简介
  rules: string[];              // 规则列表
  coverImage?: string;          // 封面图URL
  color?: string;               // 主题色
  memberCount: number;          // 成员数（冗余字段，定期更新）
  postCount: number;            // 帖子数（冗余字段）
  createdAt: Date;
  updatedAt: Date;
  isPublic: boolean;            // 是否公开
  creatorId: string;            // FK to User
  moderatorIds: string[];       // FK to User[]
}
```

**Flair (标签) 表**:
```typescript
interface FlairModel {
  id: string;                    // PK
  circleId: string;              // FK to Circle
  name: string;                  // Flair 名称
  color: string;                 // 背景色
  textColor: string;             // 文字色
  icon?: string;                 // 图标
  description?: string;          // 描述
  postCount: number;             // 使用次数（冗余字段）
  isDefault: boolean;            // 是否默认
  sortOrder: number;             // 排序
  createdAt: Date;
}
```

**Post (帖子) 表**:
```typescript
interface PostModel {
  id: string;                    // PK
  circleId: string;              // FK to Circle
  authorId: string;              // FK to User
  title: string;                 // 标题
  content: string;               // 正文（Markdown）
  imageUrls: string[];          // 图片URL列表
  flairIds: string[];           // FK to Flair[]，最多3个
  tags: string[];               // 自定义标签
  likeCount: number;            // 点赞数（冗余字段）
  dislikeCount: number;         // 踩数（冗余字段）
  commentCount: number;         // 评论数（冗余字段）
  viewCount: number;            // 浏览数
  hotScore: number;             // 热度分数（计算字段）
  isPinned: boolean;            // 是否置顶
  pinnedAt?: Date;              // 置顶时间
  isDeleted: boolean;           // 软删除
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

**Comment (评论) 表**:
```typescript
interface CommentModel {
  id: string;                    // PK
  postId: string;                // FK to Post
  authorId: string;              // FK to User
  parentId?: string;             // FK to Comment (支持嵌套)
  content: string;               // 评论内容
  likeCount: number;            // 点赞数
  dislikeCount: number;         // 踩数
  depth: number;                // 嵌套层级（0-3）
  isPinned: boolean;            // 是否置顶
  isDeleted: boolean;           // 软删除
  createdAt: Date;
  updatedAt: Date;
}
```

**CircleMembership (圈子成员) 表**:
```typescript
interface CircleMembershipModel {
  id: string;                    // PK
  circleId: string;              // FK to Circle
  userId: string;                // FK to User
  role: 'member' | 'moderator' | 'creator';
  joinedAt: Date;
  isBanned: boolean;
  bannedUntil?: Date;
  bannedReason?: string;
}
```

**Like/Dislike (点赞/踩) 表**:
```typescript
interface VoteModel {
  id: string;                    // PK
  userId: string;                // FK to User
  targetType: 'post' | 'comment'; // 目标类型
  targetId: string;              // FK to Post or Comment
  voteType: 'like' | 'dislike';
  createdAt: Date;
}
```

### 4.2 数据关系图

```
User (用户)
  ├─ 创建 → Circle (圈子)
  ├─ 加入 → CircleMembership (成员关系)
  ├─ 发布 → Post (帖子)
  ├─ 评论 → Comment (评论)
  └─ 点赞 → Vote (投票)

Circle (圈子)
  ├─ 包含 → Flair (标签)
  ├─ 包含 → Post (帖子)
  └─ 包含 → CircleMembership (成员)

Post (帖子)
  ├─ 属于 → Circle (圈子)
  ├─ 关联 → Flair[] (多个标签)
  ├─ 包含 → Comment[] (评论)
  └─ 接收 → Vote[] (投票)

Comment (评论)
  ├─ 属于 → Post (帖子)
  ├─ 回复 → Comment (父评论，可选)
  └─ 接收 → Vote[] (投票)
```

---

## 5. 用户交互流程

### 5.1 新用户首次使用流程

```
1. 打开 App
   ↓
2. 引导页：介绍社区功能
   ↓
3. 推荐圈子（基于定位）
   ├─ 南京公交（检测到用户在南京）
   ├─ 南京美食
   └─ 南京旅游
   ↓
4. 选择感兴趣的圈子（至少3个）
   ↓
5. 进入主页 Feed
   ↓
6. 提示："可以发帖分享你的故事啦！"
```

### 5.2 发帖流程

```
1. 点击 FAB "✏️" 按钮
   ↓
2. 选择圈子
   ├─ 显示已加入的圈子
   └─ 可搜索其他圈子
   ↓
3. 选择 Flair（必选）
   ├─ 显示该圈子的所有 Flair
   ├─ 支持多选（最多3个）
   └─ 显示每个 Flair 的说明
   ↓
4. 填写标题（5-100字）
   ↓
5. 填写正文
   ├─ 支持 Markdown
   ├─ 支持插入图片（最多9张）
   ├─ 支持插入链接
   └─ 实时预览
   ↓
6. 点击 "预览"
   ↓
7. 确认无误，点击 "发布"
   ↓
8. 发布成功，跳转到帖子详情页
   ↓
9. 提示："发布成功！快去看看大家的回复吧"
```

### 5.3 浏览圈子流程

```
1. 从主页点击圈子名称
   ↓
2. 进入圈子页面
   ├─ 查看圈子简介
   ├─ 查看置顶帖
   └─ 查看圈子规则
   ↓
3. 点击 "加入圈子" 按钮
   ↓
4. 加入成功，按钮变为 "已加入"
   ↓
5. 浏览帖子列表
   ├─ 可按 Flair 筛选
   ├─ 可按热门/最新排序
   └─ 可查看精华帖
   ↓
6. 点击帖子进入详情页
```

### 5.4 评论流程

```
1. 在帖子详情页
   ↓
2. 点击 "评论" 输入框
   ↓
3. 输入评论内容
   ├─ 支持 @ 提及用户
   ├─ 支持 Markdown
   └─ 最多500字
   ↓
4. 点击 "发送"
   ↓
5. 评论成功，显示在评论列表
   ↓
6. 楼主收到通知
```

### 5.5 圈主管理流程

```
1. 圈主进入圈子页面
   ↓
2. 点击右上角 "⋮" 菜单
   ↓
3. 选择 "圈子管理"
   ↓
4. 管理选项：
   ├─ 编辑圈子信息
   ├─ 管理 Flair
   ├─ 设置置顶帖
   ├─ 查看成员列表
   ├─ 处理举报
   └─ 查看数据统计
   ↓
5. 例：添加新 Flair
   ├─ 输入 Flair 名称
   ├─ 选择颜色
   ├─ 输入描述
   └─ 保存
   ↓
6. 新 Flair 生效，用户发帖时可选
```

---

## 6. 技术实现方案

### 6.1 前端架构

**技术栈**:
- React Native 0.73+
- TypeScript 5.0+
- React Navigation 6.x (Tab + Stack)
- React Query (数据缓存和同步)
- Zustand (全局状态管理)
- react-native-markdown-display (Markdown 渲染)
- react-native-image-picker (图片选择)
- react-native-fast-image (图片缓存)

**新增页面**:
```
src/screens/
├─ community/
│  ├─ CommunityFeedScreen.tsx         # 主页 Feed
│  ├─ CircleListScreen.tsx            # 圈子列表
│  ├─ CircleDetailScreen.tsx          # 圈子详情页
│  ├─ CircleManageScreen.tsx          # 圈子管理（圈主专用）
│  ├─ PostDetailScreen.tsx            # 帖子详情页
│  ├─ PostCreateScreen.tsx            # 发帖页面
│  └─ FlairManageScreen.tsx           # Flair 管理页面
```

**新增组件**:
```
src/components/community/
├─ CircleCard.tsx                     # 圈子卡片
├─ PostCard.tsx                       # 帖子卡片（替换现有的）
├─ FlairBadge.tsx                     # Flair 标签
├─ FlairSelector.tsx                  # Flair 选择器（发帖时用）
├─ CommentItem.tsx                    # 评论项（支持嵌套）
├─ CommentInput.tsx                   # 评论输入框
├─ FeedSwitcher.tsx                   # Feed 切换器（主页/热门/资讯）
├─ SortSelector.tsx                   # 排序选择器
├─ PinnedPostBanner.tsx               # 置顶帖横幅
└─ CircleSidebar.tsx                  # 圈子侧边栏
```

### 6.2 后端 API 设计

**Base URL**: `http://101.37.70.167:3000/api`

**新增 API 端点**:

#### 圈子相关 API

```typescript
// 获取圈子列表
GET /circles
Query: ?category=transport&sort=members&page=1&limit=20
Response: {
  circles: Circle[],
  total: number,
  page: number,
  hasMore: boolean
}

// 获取圈子详情
GET /circles/:circleId
Response: {
  circle: Circle,
  isMember: boolean,
  role?: 'member' | 'moderator' | 'creator'
}

// 加入圈子
POST /circles/:circleId/join
Body: { userId: string }
Response: { success: boolean, membership: CircleMembership }

// 退出圈子
POST /circles/:circleId/leave
Body: { userId: string }
Response: { success: boolean }

// 创建圈子（需要权限）
POST /circles
Body: {
  name: string,
  slug: string,
  description: string,
  icon: string,
  color?: string
}
Response: { circleId: string, circle: Circle }
```

#### Flair 相关 API

```typescript
// 获取圈子的所有 Flair
GET /circles/:circleId/flairs
Response: { flairs: Flair[] }

// 创建 Flair（圈主/管理员）
POST /circles/:circleId/flairs
Body: {
  name: string,
  color: string,
  textColor: string,
  icon?: string,
  description?: string
}
Response: { flairId: string, flair: Flair }

// 更新 Flair
PUT /flairs/:flairId
Body: { name?, color?, textColor?, description? }
Response: { success: boolean, flair: Flair }

// 删除 Flair
DELETE /flairs/:flairId
Response: { success: boolean }
```

#### 帖子相关 API（扩展现有的）

```typescript
// 获取帖子列表（支持多种筛选和排序）
GET /posts
Query: {
  circleId?: string,          // 筛选圈子
  flairIds?: string[],        // 筛选 Flair（多选）
  sort?: 'hot' | 'new' | 'top', // 排序方式
  timeRange?: 'day' | 'week' | 'month' | 'year' | 'all', // 时间范围（top排序时用）
  page?: number,
  limit?: number,
  userId?: string             // 用于判断用户是否点赞
}
Response: {
  posts: Post[],
  total: number,
  page: number,
  hasMore: boolean
}

// 创建帖子（扩展）
POST /posts
Body: {
  circleId: string,
  authorId: string,
  title: string,
  content: string,
  imageUrls: string[],
  flairIds: string[],         // 新增：必须至少1个，最多3个
  tags?: string[]
}
Response: { postId: string, post: Post }

// 置顶帖子（圈主/管理员）
POST /posts/:postId/pin
Body: { circleId: string, userId: string }
Response: { success: boolean }

// 取消置顶
POST /posts/:postId/unpin
Body: { circleId: string, userId: string }
Response: { success: boolean }

// 删除帖子（作者或管理员）
DELETE /posts/:postId
Body: { userId: string, reason?: string }
Response: { success: boolean }
```

#### 评论相关 API

```typescript
// 获取帖子的评论
GET /posts/:postId/comments
Query: {
  sort?: 'hot' | 'new' | 'old',
  page?: number,
  limit?: number
}
Response: {
  comments: Comment[],  // 包含嵌套评论
  total: number
}

// 创建评论
POST /posts/:postId/comments
Body: {
  authorId: string,
  content: string,
  parentId?: string      // 如果是回复某条评论
}
Response: { commentId: string, comment: Comment }

// 点赞评论
POST /comments/:commentId/like
Body: { userId: string }
Response: { success: boolean, likeCount: number }

// 踩评论
POST /comments/:commentId/dislike
Body: { userId: string }
Response: { success: boolean, dislikeCount: number }

// 删除评论
DELETE /comments/:commentId
Body: { userId: string, reason?: string }
Response: { success: boolean }
```

#### Feed 相关 API

```typescript
// 获取主页 Feed
GET /feed/home
Query: {
  userId: string,            // 根据用户关注的圈子推荐
  page?: number,
  limit?: number
}
Response: { posts: Post[], hasMore: boolean }

// 获取热门 Feed
GET /feed/hot
Query: {
  timeRange?: 'day' | 'week',
  page?: number,
  limit?: number
}
Response: { posts: Post[], hasMore: boolean }

// 获取资讯 Feed
GET /feed/news
Query: {
  page?: number,
  limit?: number
}
Response: { posts: Post[], hasMore: boolean }
```

#### 圈子管理 API

```typescript
// 获取圈子成员列表
GET /circles/:circleId/members
Query: { page?, limit?, role?: 'member' | 'moderator' }
Response: { members: CircleMembership[], total: number }

// 添加管理员
POST /circles/:circleId/moderators
Body: { userId: string, targetUserId: string }
Response: { success: boolean }

// 封禁用户
POST /circles/:circleId/ban
Body: {
  userId: string,          // 操作者
  targetUserId: string,    // 被封禁者
  reason: string,
  duration?: number        // 封禁天数，null为永久
}
Response: { success: boolean }

// 解封用户
POST /circles/:circleId/unban
Body: { userId: string, targetUserId: string }
Response: { success: boolean }

// 获取圈子统计数据
GET /circles/:circleId/stats
Query: { timeRange?: 'day' | 'week' | 'month' }
Response: {
  memberCount: number,
  postCount: number,
  activeUserCount: number,
  newMembersToday: number,
  newPostsToday: number,
  topFlairs: { flairId: string, postCount: number }[]
}
```

### 6.3 热度算法设计

**热度分数计算公式** (参考 Reddit):

```typescript
function calculateHotScore(post: Post): number {
  const now = Date.now();
  const ageInHours = (now - post.createdAt.getTime()) / (1000 * 60 * 60);

  // 时间衰减因子：越新的帖子权重越高
  const timeDecay = Math.pow(ageInHours + 2, -1.5);

  // 互动分数：点赞 × 2 + 评论 × 3 + 浏览 × 0.1
  const engagementScore =
    post.likeCount * 2 +
    post.commentCount * 3 +
    post.viewCount * 0.1;

  // 争议度：有踩数说明有争议，降低权重
  const controversyPenalty = post.dislikeCount > 0
    ? 1 - (post.dislikeCount / (post.likeCount + post.dislikeCount)) * 0.3
    : 1;

  // 最终热度分数
  return engagementScore * timeDecay * controversyPenalty;
}
```

**定时任务**: 每 5 分钟更新一次热度分数（存储在 `Post.hotScore` 字段）

### 6.4 数据库选型

**推荐方案**:
- **主数据库**: PostgreSQL 14+ (支持 JSON 字段，适合复杂查询)
- **缓存**: Redis (缓存热帖、热评、用户session)
- **搜索引擎**: Elasticsearch (全文搜索帖子和评论)
- **对象存储**: 阿里云 OSS (图片、封面图)

**为什么不用现有的 Tablestore**:
- Tablestore 是 NoSQL，不适合复杂的关联查询（如嵌套评论、多Flair筛选）
- 需要支持事务（如点赞时同时更新 Post.likeCount 和 Vote 表）
- 需要全文搜索功能

**迁移方案**:
1. 保留现有 Tablestore 存储帖子基本信息（兼容现有系统）
2. PostgreSQL 存储新的圈子、Flair、评论、投票数据
3. 双写一段时间，逐步迁移到 PostgreSQL

### 6.5 性能优化

**缓存策略**:
```typescript
// Redis 缓存 Key 设计
const cacheKeys = {
  hotPosts: 'feed:hot:global',              // 全站热帖，TTL 5min
  circlePosts: 'circle:{circleId}:posts',   // 圈子帖子，TTL 10min
  postDetail: 'post:{postId}',              // 帖子详情，TTL 1h
  comments: 'post:{postId}:comments',       // 评论列表，TTL 5min
  userCircles: 'user:{userId}:circles',     // 用户加入的圈子，TTL 1h
  circleFlairs: 'circle:{circleId}:flairs', // 圈子Flair，TTL 1h
};
```

**数据库优化**:
- 为 `Post.circleId`、`Post.createdAt`、`Post.hotScore` 建立索引
- 为 `Comment.postId`、`Comment.parentId` 建立索引
- 使用 `likeCount`、`commentCount` 等冗余字段避免实时计算
- 使用 `EXPLAIN` 分析慢查询

**图片优化**:
- 上传时自动生成缩略图（200x200、800x800、1200x1200）
- 使用 WebP 格式（兼容 JPEG fallback）
- 启用 OSS CDN 加速
- App端使用 react-native-fast-image 缓存

**分页优化**:
- 使用 cursor-based pagination 而非 offset-based
- 帖子列表默认每页 20 条
- 评论支持无限滚动加载

---

## 7. 产品路线图

### Phase 1: MVP (4周) - 核心功能

**目标**: 实现基本的圈子 + Flair + 发帖功能

**开发任务**:
- [x] 数据库设计和迁移
- [ ] 后端 API 开发
  - [ ] 圈子 CRUD API
  - [ ] Flair CRUD API
  - [ ] 帖子 API 扩展（支持 Flair）
  - [ ] Feed API（主页、热门、最新）
- [ ] 前端页面开发
  - [ ] CommunityFeedScreen（主页 Feed）
  - [ ] CircleListScreen（圈子列表）
  - [ ] CircleDetailScreen（圈子详情）
  - [ ] PostCreateScreen（发帖，支持选择 Flair）
  - [ ] PostDetailScreen（帖子详情）
- [ ] 组件开发
  - [ ] FlairBadge（Flair 标签显示）
  - [ ] FlairSelector（Flair 选择器）
  - [ ] FeedSwitcher（Feed 切换器）
  - [ ] PostCard（重构，支持显示圈子和 Flair）
- [ ] 测试和修复

**验收标准**:
- ✅ 用户可以浏览圈子列表
- ✅ 用户可以加入/退出圈子
- ✅ 用户可以发帖时选择 Flair
- ✅ 用户可以按 Flair 筛选帖子
- ✅ 用户可以在主页切换 Feed（主页/热门/最新）

### Phase 2: 社区功能增强 (3周)

**目标**: 添加评论、置顶、排序等核心社区功能

**开发任务**:
- [ ] 评论系统
  - [ ] 嵌套评论（最多3层）
  - [ ] 评论点赞/踩
  - [ ] 评论排序（热门/最新/最早）
- [ ] 置顶功能
  - [ ] 帖子置顶/取消置顶
  - [ ] 评论置顶（楼主/管理员）
- [ ] 排序和筛选
  - [ ] 帖子排序（热门/最新/精华）
  - [ ] 时间范围筛选（今日/本周/本月/全部）
- [ ] 用户交互
  - [ ] @ 提及用户
  - [ ] 帖子分享
  - [ ] 帖子收藏

**验收标准**:
- ✅ 用户可以评论帖子
- ✅ 用户可以回复评论（支持3层嵌套）
- ✅ 圈主可以置顶帖子
- ✅ 用户可以按不同方式排序帖子

### Phase 3: 圈子管理 (2周)

**目标**: 完善圈主管理功能

**开发任务**:
- [ ] 圈子管理页面
  - [ ] 编辑圈子信息
  - [ ] Flair 管理（添加/编辑/删除）
  - [ ] 置顶帖管理
  - [ ] 成员管理
  - [ ] 封禁/解封用户
- [ ] 权限系统
  - [ ] 圈主权限检查
  - [ ] 管理员权限检查
  - [ ] 操作日志
- [ ] 数据统计
  - [ ] 圈子数据面板
  - [ ] 成员增长趋势
  - [ ] 热门 Flair 统计

**验收标准**:
- ✅ 圈主可以管理 Flair
- ✅ 圈主可以设置置顶帖
- ✅ 圈主可以封禁违规用户
- ✅ 圈主可以查看圈子数据统计

### Phase 4: 优化和扩展 (2周)

**目标**: 性能优化和用户体验提升

**开发任务**:
- [ ] 性能优化
  - [ ] 实现 Redis 缓存
  - [ ] 优化数据库查询
  - [ ] 图片懒加载和缓存
  - [ ] 无限滚动优化
- [ ] 用户体验
  - [ ] 搜索功能（帖子、圈子、用户）
  - [ ] 推荐算法优化
  - [ ] 通知系统（评论、点赞、@ 提及）
  - [ ] 黑暗模式支持
- [ ] 运营功能
  - [ ] 举报系统
  - [ ] 敏感词过滤
  - [ ] 反垃圾机制

**验收标准**:
- ✅ 主页加载时间 < 1s
- ✅ 帖子列表滚动流畅（60fps）
- ✅ 搜索功能可用
- ✅ 通知系统正常工作

### Phase 5: 高级功能 (4周，可选)

**目标**: 参考 Reddit 的高级功能

**功能列表**:
- [ ] 多图帖子支持（图集模式）
- [ ] 视频帖子支持
- [ ] 投票帖（Poll Post）
- [ ] 用户 Flair（用户身份标签）
- [ ] 圈子规则自动化（AutoMod）
- [ ] 用户勋章系统
- [ ] 圈子订阅 Feed（RSS）
- [ ] 跨圈子帖子（Crosspost）
- [ ] 热帖推送通知
- [ ] 圈子联盟（相关圈子推荐）

---

## 8. 成功指标 (KPIs)

### 8.1 用户增长指标

| 指标 | 目标（3个月后） | 测量方式 |
|------|---------------|---------|
| DAU (日活用户) | 5,000+ | 每日登录用户数 |
| 圈子总数 | 50+ | 活跃圈子（≥10个成员） |
| 平均每用户加入圈子数 | 3-5 个 | UserCircles 表统计 |
| 帖子日均发布量 | 200+ | 每日新增帖子数 |
| 评论日均发布量 | 1,000+ | 每日新增评论数 |

### 8.2 互动指标

| 指标 | 目标 | 测量方式 |
|------|------|---------|
| 帖子平均浏览量 | 100+ | Post.viewCount |
| 帖子平均点赞数 | 10+ | Post.likeCount |
| 帖子平均评论数 | 5+ | Post.commentCount |
| 用户日均停留时长 | 15分钟+ | 埋点统计 |
| 用户周留存率 | 40%+ | 埋点统计 |

### 8.3 内容质量指标

| 指标 | 目标 | 测量方式 |
|------|------|---------|
| 优质帖子占比 | 20%+ | 点赞数 > 50 的帖子 |
| 垃圾帖举报率 | < 5% | 举报数 / 总帖子数 |
| 平均回复时长 | < 2小时 | 首条评论时间 - 发帖时间 |
| Flair 使用覆盖率 | 80%+ | 带 Flair 的帖子比例 |

### 8.4 圈子健康度指标

| 指标 | 目标 | 测量方式 |
|------|------|---------|
| 活跃圈子比例 | 60%+ | 本周有新帖的圈子比例 |
| 平均圈子成员数 | 200+ | 成员数中位数 |
| 圈子成员留存率 | 50%+ | 加入后仍活跃的比例 |
| 圈主活跃度 | 80%+ | 每周至少登录1次的圈主比例 |

---

## 9. 风险和挑战

### 9.1 技术风险

| 风险 | 影响 | 缓解措施 |
|------|------|---------|
| 数据库迁移失败 | 高 | 双写策略，分阶段迁移，备份数据 |
| 性能问题（大量用户） | 高 | 提前压测，Redis缓存，CDN加速 |
| 嵌套评论查询慢 | 中 | 使用 materialized path 或 closure table |
| 图片存储成本高 | 中 | 压缩图片，WebP格式，CDN优惠包 |

### 9.2 产品风险

| 风险 | 影响 | 缓解措施 |
|------|------|---------|
| 用户不理解 Flair 概念 | 中 | 新手引导，示例帖子，视频教程 |
| 圈子过多导致内容分散 | 中 | 推荐算法优化，合并相似圈子 |
| 恶意用户刷帖 | 高 | 反垃圾机制，验证码，举报系统 |
| 圈主滥用权限 | 中 | 操作日志，用户申诉，平台介入 |

### 9.3 运营风险

| 风险 | 影响 | 缓解措施 |
|------|------|---------|
| 初期内容稀缺 | 高 | 官方种子内容，KOL邀请，活动激励 |
| 圈子质量参差不齐 | 中 | 圈子审核机制，优质圈子推荐 |
| 用户流失到其他平台 | 高 | 差异化功能，社区氛围建设 |
| 违规内容监管 | 高 | 敏感词过滤，人工审核，用户举报 |

---

## 10. 附录

### 10.1 名词解释

- **圈子 (Circle)**: 类似 Reddit 的 Subreddit，一个独立的主题社区
- **Flair**: 帖子标签，用于细分帖子类型，避免创建过多子社区
- **Feed**: 内容流，聚合多个来源的帖子
- **置顶 (Pin)**: 将重要帖子固定在列表顶部
- **热度分数 (Hot Score)**: 综合考虑点赞、评论、时间的帖子排序分数
- **圈主**: 圈子的创建者，拥有最高权限
- **管理员 (Moderator)**: 由圈主任命，拥有部分管理权限

### 10.2 参考资料

- [Reddit Design Guidelines](https://www.reddit.com/wiki/design)
- [Reddit API Documentation](https://www.reddit.com/dev/api/)
- [React Navigation Documentation](https://reactnavigation.org/)
- [React Native Best Practices](https://reactnative.dev/docs/performance)

### 10.3 设计稿和原型

- Figma 设计稿: [待补充 URL]
- 交互原型: [待补充 URL]
- 用户测试报告: [待补充]

---

## 变更记录

| 版本 | 日期 | 变更内容 | 作者 |
|------|------|---------|------|
| v1.0 | 2025-11-08 | 初始版本，完成核心架构设计 | Claude |

---

**下一步行动**:
1. ✅ 评审 PRD，团队讨论和确认
2. ⬜ 创建数据库迁移脚本
3. ⬜ 开始 Phase 1 开发（后端 API）
4. ⬜ 设计师完成 UI 设计稿
5. ⬜ 前端开始组件开发

---

**联系方式**:
- 产品负责人: [待填写]
- 技术负责人: [待填写]
- 设计负责人: [待填写]
