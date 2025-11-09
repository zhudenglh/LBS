# Reddit-like 社区快速参考

## 📌 核心概念

### 圈子 (Circle) = Reddit 的 Subreddit
- **圈/南京公交** - 公交相关讨论
- **圈/南京美食** - 美食推荐和评测
- **圈/南京酒店** - 住宿分享
- **圈/太原公交** - 太原公交讨论

### Flair = 帖子标签
在每个圈子内用 Flair 进行细分，而不是创建子圈子。

**示例：南京公交圈的 Flair**
- `[5路]` - 5路公交相关
- `[6路]` - 6路公交相关
- `[讨论]` - 一般讨论
- `[求助]` - 求助帖
- `[公告]` - 官方公告

**优势**:
- ✅ 避免圈子碎片化
- ✅ 灵活添加/删除分类
- ✅ 一篇帖子可以有多个 Flair（如 `[5路]` + `[求助]`）

---

## 🏠 主页结构

### Feed 切换（左上角）

```
[主页 ▼]
├─ 主页 (Home)        - 关注的圈子内容
├─ 热门 (Hot)         - 全站热门内容
├─ 资讯 (News)        - 官方公告和重要通知
└─ 关注的圈子 (Following) - 已加入圈子列表
```

### 帖子卡片显示

```
┌─────────────────────────────────┐
│ 圈/南京公交 · [5路] [讨论]  2小时前│
│ ───────────────────────────────│
│ 📷 [图片]                       │
│                                │
│ 5路公交早高峰太挤了，能不能加车？  │
│                                │
│ ───────────────────────────────│
│ 👍 123  💬 45  🔗 分享  ⭐ 收藏  │
│                                │
│ u/张三 · 南京市民                │
└─────────────────────────────────┘
```

---

## 📝 发帖流程

1. 点击 ✏️ 按钮
2. **选择圈子** (必选)
3. **选择 Flair** (必选，最多 3 个)
4. 填写标题（5-100字）
5. 填写正文（支持 Markdown）
6. 添加图片（最多 9 张）
7. 发布

---

## 🔥 热度算法

```typescript
热度分数 = (点赞数 × 2 + 评论数 × 3 + 浏览数 × 0.1)
          × 时间衰减因子
          × 争议度惩罚
```

- **时间衰减**: 新帖权重高
- **争议度惩罚**: 踩数多的帖子权重降低
- **定时更新**: 每 5 分钟更新一次

---

## 🎨 圈子页面布局

```
┌───────────────────────────────────┐
│ ← 返回   圈/南京公交 🚌    ⋮ 更多 │
├───────────────────────────────────┤
│ [封面图片]                         │
│ 南京公交                           │
│ 12.5K 成员 · 345 在线             │
│ [加入圈子] [发帖]                  │
├───────────────────────────────────┤
│ 📌 置顶: 南京公交使用指南           │
│ 📌 置顶: 2025年春运时刻表          │
├───────────────────────────────────┤
│ Flair 筛选:                       │
│ [全部] [5路] [6路] [s3路] [22路]  │
├───────────────────────────────────┤
│ 排序: [热门 ▼]                     │
│ ○ 热门 (Hot)                      │
│ ○ 最新 (New)                      │
│ ○ 精华 (Top)                      │
└───────────────────────────────────┘
```

---

## 💬 评论系统

### 嵌套评论（最多 3 层）

```
u/张三 (楼主) · 2小时前
│ 5路公交早高峰太挤了
│ 👍 123  💬 回复
│
├─ u/李四 · 1小时前
│  │ 确实，我也遇到了
│  │ 👍 34  💬 回复
│  │
│  ├─ u/王五 · 30分钟前
│  │  │ 已经投诉了
│  │  │ 👍 12  💬 回复
```

### 评论排序
- **热门**: 点赞数多的在前
- **最新**: 时间倒序
- **最早**: 时间正序

---

## 👑 圈主权限

### 可以做什么

✅ **Flair 管理**
- 添加/编辑/删除 Flair
- 设置默认 Flair

✅ **内容管理**
- 设置/取消置顶帖（最多 3 条）
- 删除违规帖子和评论
- 置顶重要评论

✅ **成员管理**
- 添加/移除管理员
- 封禁/解封用户（临时或永久）

✅ **圈子设置**
- 编辑圈子简介和规则
- 上传封面图
- 设置主题色

✅ **数据统计**
- 查看成员增长
- 查看热门 Flair
- 查看活跃度数据

---

## 📊 数据模型

### 核心表

```
User (用户)
├─ Circle (圈子)
│  ├─ Flair (标签)
│  ├─ Post (帖子)
│  │  └─ Comment (评论)
│  └─ CircleMembership (成员关系)
```

### Post 字段（扩展）

```typescript
{
  id: string;
  circleId: string;         // 所属圈子
  flairIds: string[];       // Flair 列表（1-3个）
  title: string;
  content: string;
  imageUrls: string[];
  likeCount: number;
  dislikeCount: number;     // 新增
  commentCount: number;
  viewCount: number;        // 新增
  hotScore: number;         // 新增：热度分数
  isPinned: boolean;        // 新增：是否置顶
  // ...
}
```

---

## 🔌 关键 API

### 圈子

```typescript
GET    /circles                      // 获取圈子列表
GET    /circles/:id                  // 获取圈子详情
POST   /circles/:id/join             // 加入圈子
POST   /circles/:id/leave            // 退出圈子
```

### Flair

```typescript
GET    /circles/:id/flairs           // 获取圈子的 Flair
POST   /circles/:id/flairs           // 创建 Flair（圈主）
PUT    /flairs/:id                   // 更新 Flair
DELETE /flairs/:id                   // 删除 Flair
```

### 帖子（扩展）

```typescript
GET    /posts                        // 获取帖子列表
  ?circleId=xxx                      // 按圈子筛选
  &flairIds=xxx,yyy                  // 按 Flair 筛选
  &sort=hot|new|top                  // 排序方式
  &timeRange=day|week|month|all      // 时间范围

POST   /posts                        // 创建帖子（需要 flairIds）
POST   /posts/:id/pin                // 置顶帖子（圈主）
POST   /posts/:id/unpin              // 取消置顶
POST   /posts/:id/dislike            // 踩帖子
```

### Feed

```typescript
GET    /feed/home                    // 主页 Feed
GET    /feed/hot                     // 热门 Feed
GET    /feed/news                    // 资讯 Feed
```

### 评论

```typescript
GET    /posts/:id/comments           // 获取评论
POST   /posts/:id/comments           // 创建评论
POST   /comments/:id/like            // 点赞评论
POST   /comments/:id/dislike         // 踩评论
DELETE /comments/:id                 // 删除评论
```

---

## 🎯 实施优先级

### Phase 1: MVP (4周) ⭐⭐⭐
- 圈子基本功能
- Flair 系统
- 发帖（支持 Flair）
- Feed 切换
- 基础筛选和排序

### Phase 2: 社区功能 (3周) ⭐⭐
- 评论系统（嵌套）
- 置顶功能
- 高级排序和筛选

### Phase 3: 圈子管理 (2周) ⭐
- 圈主管理页面
- Flair 管理
- 成员管理
- 数据统计

### Phase 4: 优化 (2周)
- 性能优化
- 搜索功能
- 通知系统

---

## 🚀 技术栈

### 前端
- React Native 0.73+
- TypeScript
- React Navigation
- React Query (数据缓存)
- Zustand (状态管理)

### 后端
- Node.js + Express
- PostgreSQL (主数据库)
- Redis (缓存)
- Elasticsearch (搜索)
- 阿里云 OSS (图片存储)

---

## 📱 UI 组件清单

### 新增组件

```
community/
├── CircleCard.tsx           // 圈子卡片
├── FlairBadge.tsx          // Flair 标签
├── FlairSelector.tsx       // Flair 选择器
├── FeedSwitcher.tsx        // Feed 切换器
├── SortSelector.tsx        // 排序选择器
├── CommentItem.tsx         // 评论项（支持嵌套）
├── CommentInput.tsx        // 评论输入框
├── PinnedPostBanner.tsx    // 置顶帖横幅
└── CircleHeader.tsx        // 圈子头部
```

### 重构组件

```
posts/
├── PostCard.tsx            // 支持显示圈子和 Flair
├── PostList.tsx            // 支持多种排序
└── PublishDialog.tsx       // 支持选择 Flair
```

---

## 🌍 国际化

### 新增翻译 Key

```json
{
  "feed": {
    "home": "主页",
    "hot": "热门",
    "news": "资讯",
    "following": "关注的圈子"
  },
  "circle": {
    "join": "加入圈子",
    "joined": "已加入",
    "members": "成员",
    "posts": "帖子"
  },
  "post": {
    "select_flair": "选择 Flair",
    "max_flairs": "最多 {max} 个"
  }
}
```

---

## 📚 相关文档

1. **[REDDIT_COMMUNITY_PRD.md](./REDDIT_COMMUNITY_PRD.md)** - 完整产品需求文档
   - 产品概述
   - 社区架构设计
   - 核心功能详细设计
   - 数据模型
   - 用户交互流程
   - 技术实现方案
   - 产品路线图
   - 成功指标 (KPIs)

2. **[REDDIT_IMPLEMENTATION_GUIDE.md](./REDDIT_IMPLEMENTATION_GUIDE.md)** - 实现指南
   - 文件结构变更
   - 类型定义
   - API 客户端实现
   - 关键组件代码示例
   - 实施步骤清单

3. **[CLAUDE.md](./CLAUDE.md)** - 项目开发指南
   - 项目结构
   - 开发规范
   - 技术栈说明

---

## ✅ 下一步行动

1. ✅ **评审 PRD** - 团队讨论并确认方案
2. ⬜ **数据库设计** - 创建 PostgreSQL 表和索引
3. ⬜ **后端 API 开发** - 实现圈子、Flair、Feed API
4. ⬜ **UI 设计** - Figma 设计稿（如果还没完成）
5. ⬜ **前端开发** - 实现组件和页面
6. ⬜ **测试和优化** - 功能测试、性能优化
7. ⬜ **发布** - 部署到测试环境

---

## 💡 设计原则

### 1. 扁平化优先
- 避免多层嵌套
- 用 Flair 替代子社区

### 2. 灵活性
- Flair 可动态添加/删除
- 一篇帖子可有多个 Flair

### 3. 社区自治
- 圈主拥有管理权限
- 用户可举报违规内容

### 4. 内容优先
- 热度算法推荐优质内容
- 置顶帖突出重要信息

### 5. 用户体验
- 3 秒内完成常用操作
- 清晰的视觉层级
- 流畅的动画和交互

---

**祝开发顺利！🚀**
