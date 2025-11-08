# 南京公交WiFi社区产品设计文档（PRD）

## 1. 产品背景

### 1.1 业务场景
- **基础设施**：南京 5500 辆公交车部署 WiFi 路由器
- **网络规模**：形成"南京公交免费WiFi"网络
- **用户场景**：用户在公交车上使用时间碎片化（平均 15-30 分钟）
- **现有功能**：已有基础的社区发布功能（单列列表展示）

### 1.2 产品目标
基于公交WiFi网络打造一个高效、有趣、有温度的社区平台，采用**混合布局方案**：
- **主界面双列流**：快速浏览、高效消费内容
- **专题区论坛模式**：深度交流、内容沉淀
- **垂直社区**：线路圈、车友圈等增强归属感

---

## 2. 核心设计方案

### 2.1 混合布局架构

```
发现 Tab
├── 顶部导航栏
│   ├── 推荐（双列流）
│   ├── 线路圈（双列流）
│   ├── 附近的人（双列流）
│   └── 专题区（列表模式）
├── 筛选器
│   ├── 热门
│   ├── 最新
│   └── 精华
└── 内容展示区
    ├── 双列瀑布流（卡片式）
    └── 单列列表（论坛式）
```

### 2.2 布局模式对比

| 维度 | 双列流（主界面） | 列表模式（专题区） |
|------|----------------|-------------------|
| **适用场景** | 快速浏览、碎片化时间 | 深度阅读、专题讨论 |
| **内容类型** | 图文并茂的生活分享 | 攻略、求助、投诉 |
| **信息密度** | 高（一屏展示更多） | 中等（突出标题和核心信息） |
| **交互深度** | 浅（点赞、快速评论） | 深（详细回复、楼中楼） |
| **商业化** | 信息流广告自然融入 | 专题推广、品牌合作 |

---

## 3. 功能模块设计

### 3.1 推荐流（双列瀑布流）

#### 3.1.1 卡片设计
```typescript
PostCard (Waterfall Layout)
├── 封面图片（3:4 比例）
├── 标题（1-2 行，自适应高度）
├── 内容预览（2 行）
├── 底部信息栏
│   ├── 头像 + 昵称
│   ├── 点赞数 + 评论数
│   └── 车次标签（如：2路）
└── 精华标识（可选）
```

#### 3.1.2 交互逻辑
- **点击卡片**：进入详情页
- **双击卡片**：快速点赞（动画效果）
- **长按卡片**：显示操作菜单（收藏、举报、分享）
- **下拉刷新**：加载最新内容
- **上拉加载**：分页加载更多

#### 3.1.3 排序算法
```
推荐权重 = 0.4 × 时间新鲜度 + 0.3 × 互动热度 + 0.2 × 图片质量 + 0.1 × 用户画像匹配
```

### 3.2 线路圈（双列流 + 筛选）

#### 3.2.1 功能特点
- **线路筛选器**：顶部下拉菜单选择线路（1路、2路、3路...）
- **内容来源**：该线路用户发布的内容
- **特色功能**：
  - "车上偶遇"：显示当前正在同一辆车上的其他用户
  - "站点打卡"：在特定站点发布内容可获得专属标识
  - "线路活动"：官方或用户发起的线路主题活动

#### 3.2.2 UI 组件
```typescript
RouteCircle
├── RouteSelector（线路下拉菜单）
├── OnlineUsersBar（当前在线用户横条）
├── WaterfallGrid（双列瀑布流）
└── FloatingActionButton（发布按钮）
```

### 3.3 附近的人（双列流 + 位置）

#### 3.3.1 功能特点
- **基于位置**：显示同车或附近公交站的用户动态
- **隐私保护**：用户可选择是否显示位置
- **实时更新**：每 30 秒刷新一次附近用户列表

#### 3.3.2 卡片扩展信息
- 用户头像 + 昵称
- 距离标识（如：同车、200m）
- 最近一条动态预览
- 在线状态标识

### 3.4 专题区（列表模式）

#### 3.4.1 专题分类
```
专题区
├── 🔥 热门话题（热度排序）
├── 🚌 线路攻略（精华内容）
├── ❓ 失物招领（最新优先）
├── 💡 建议反馈（按回复数排序）
└── 📢 官方公告（置顶）
```

#### 3.4.2 列表卡片设计
```typescript
ForumPostCard
├── 顶部标签（专题分类）
├── 标题（大字号、加粗）
├── 内容摘要（3 行）
├── 底部信息栏
│   ├── 发布者头像 + 昵称
│   ├── 发布时间
│   ├── 浏览数 + 回复数
│   └── 最后回复者（如有）
└── 精华/置顶标识
```

#### 3.4.3 详情页设计
- **楼层结构**：主楼 + 回复楼层
- **楼中楼**：支持对回复进行回复
- **富文本编辑器**：支持图片、@用户、表情
- **版主功能**：置顶、加精、删除

---

## 4. 技术架构设计

### 4.1 组件结构

```
src/screens/
├── DiscoverScreen.tsx（主控制器）
│   ├── TabNavigator（顶部标签）
│   ├── FilterBar（筛选器）
│   └── ContentContainer（内容容器）
│
src/components/community/
├── waterfall/
│   ├── WaterfallGrid.tsx（双列瀑布流容器）
│   ├── WaterfallPostCard.tsx（瀑布流卡片）
│   └── WaterfallSkeleton.tsx（骨架屏）
├── forum/
│   ├── ForumList.tsx（论坛列表）
│   ├── ForumPostCard.tsx（论坛卡片）
│   ├── ForumDetailScreen.tsx（详情页）
│   └── ReplyList.tsx（回复列表）
├── route/
│   ├── RouteSelector.tsx（线路选择器）
│   ├── OnlineUsersBar.tsx（在线用户条）
│   └── RouteCircleScreen.tsx（线路圈页面）
└── nearby/
    ├── NearbyUsersScreen.tsx（附近的人）
    └── LocationPermissionDialog.tsx（位置权限）
```

### 4.2 数据模型扩展

```typescript
// 扩展现有 Post 类型
export interface CommunityPost extends Post {
  post_type: 'normal' | 'topic' | 'announcement'; // 帖子类型
  category: string; // 专题分类
  is_pinned: boolean; // 是否置顶
  is_featured: boolean; // 是否精华
  view_count: number; // 浏览数
  reply_count: number; // 回复数
  last_reply_user?: string; // 最后回复者
  last_reply_time?: number; // 最后回复时间
  route_number?: string; // 关联线路号
  location?: {
    latitude: number;
    longitude: number;
    station_name?: string;
  };
}

// 回复数据结构
export interface PostReply {
  reply_id: string;
  post_id: string;
  user_id: string;
  username: string;
  avatar: string;
  content: string;
  images?: string[];
  timestamp: number;
  likes: number;
  parent_reply_id?: string; // 楼中楼
}

// 专题分类
export enum TopicCategory {
  HOT = 'hot',
  GUIDE = 'guide',
  LOST_FOUND = 'lost_found',
  FEEDBACK = 'feedback',
  ANNOUNCEMENT = 'announcement'
}
```

### 4.3 API 扩展需求

```typescript
// 新增 API 端点
export const COMMUNITY_API = {
  // 获取推荐流（支持分页）
  GET_FEED: '/api/community/feed',

  // 获取线路圈内容
  GET_ROUTE_POSTS: '/api/community/route/:routeNumber',

  // 获取附近的人
  GET_NEARBY_USERS: '/api/community/nearby',

  // 获取专题内容
  GET_TOPIC_POSTS: '/api/community/topic/:category',

  // 发布回复
  POST_REPLY: '/api/posts/:postId/reply',

  // 获取回复列表
  GET_REPLIES: '/api/posts/:postId/replies',

  // 点赞回复
  LIKE_REPLY: '/api/replies/:replyId/like',
};
```

### 4.4 性能优化策略

#### 4.4.1 双列瀑布流优化
```typescript
// 使用 react-native-masonry-list 或自实现
- 虚拟滚动：只渲染可见区域
- 图片懒加载：进入视口才加载
- 预加载：提前加载下一屏数据
- 缓存策略：已加载图片缓存到本地
```

#### 4.4.2 分页加载
```
首次加载：20 条
上拉加载：每次 20 条
下拉刷新：最新 20 条
缓存时效：5 分钟
```

#### 4.4.3 图片优化
```typescript
// 使用 react-native-fast-image
<FastImage
  source={{ uri: imageUrl, priority: FastImage.priority.normal }}
  resizeMode={FastImage.resizeMode.cover}
  style={styles.image}
/>

// 图片压缩策略
- 缩略图：宽度 400px（双列流卡片）
- 详情图：宽度 800px（详情页）
- 原图：用户点击查看时加载
```

---

## 5. UI/UX 设计规范

### 5.1 双列瀑布流规范

```css
容器布局：
- 列间距：8px
- 卡片间距：12px
- 左右边距：12px

卡片设计：
- 圆角：8px
- 阴影：iOS shadowRadius:4, Android elevation:2
- 背景：白色
- 点击态：opacity 0.8

图片尺寸：
- 最小高度：120px
- 最大高度：400px
- 宽度：(屏幕宽度 - 32px) / 2
- 比例：保持原图比例，最大 3:4
```

### 5.2 字体规范

```typescript
标题：
- 瀑布流卡片标题：14px, fontWeight: '600'
- 论坛列表标题：16px, fontWeight: 'bold'
- 详情页标题：18px, fontWeight: 'bold'

正文：
- 内容预览：13px, lineHeight: 18
- 详情正文：15px, lineHeight: 22
- 辅助信息：12px, color: #999999

标签：
- 车次标签：12px, backgroundColor: #0285f0/20
- 专题标签：12px, backgroundColor: #FF5722/20
```

### 5.3 交互动画

```typescript
// 点赞动画
Animated.sequence([
  Animated.spring(scale, { toValue: 1.2, useNativeDriver: true }),
  Animated.spring(scale, { toValue: 1, useNativeDriver: true }),
]);

// 卡片进入动画
Animated.stagger(50, cards.map((_, i) =>
  Animated.parallel([
    Animated.timing(opacity, { toValue: 1, duration: 300 }),
    Animated.spring(translateY, { toValue: 0, useNativeDriver: true }),
  ])
));

// 下拉刷新动画
RefreshControl with custom indicator
```

---

## 6. 国际化（i18n）规范

### 6.1 新增翻译键

```json
{
  "community": {
    "tabs": {
      "recommend": "推荐",
      "route_circle": "线路圈",
      "nearby_people": "附近的人",
      "topics": "专题区"
    },
    "filters": {
      "hot": "热门",
      "latest": "最新",
      "featured": "精华"
    },
    "route_circle": {
      "select_route": "选择线路",
      "online_users": "{{count}}人在车上",
      "check_in": "站点打卡",
      "route_activity": "线路活动"
    },
    "nearby": {
      "same_bus": "同车",
      "distance": "{{distance}}m",
      "online": "在线",
      "location_permission": "需要位置权限才能查看附近的人"
    },
    "topics": {
      "hot_topics": "热门话题",
      "route_guide": "线路攻略",
      "lost_found": "失物招领",
      "feedback": "建议反馈",
      "announcement": "官方公告"
    },
    "post": {
      "views": "{{count}}次浏览",
      "replies": "{{count}}条回复",
      "last_reply": "最后回复",
      "pinned": "置顶",
      "featured": "精华"
    }
  }
}
```

---

## 7. 开发计划

### 7.1 Phase 1：双列瀑布流（2-3 天）
- [x] 分析现有代码结构
- [ ] 实现 WaterfallGrid 组件
- [ ] 实现 WaterfallPostCard 组件
- [ ] 添加双列流布局逻辑
- [ ] 集成图片懒加载
- [ ] 添加骨架屏加载效果

### 7.2 Phase 2：顶部导航 + 筛选器（1-2 天）
- [ ] 实现顶部 Tab 导航（推荐/线路圈/附近的人/专题区）
- [ ] 实现筛选器（热门/最新/精华）
- [ ] 添加标签切换动画
- [ ] 实现筛选逻辑

### 7.3 Phase 3：线路圈功能（2-3 天）
- [ ] 实现线路选择器组件
- [ ] 实现在线用户横条
- [ ] 添加线路筛选 API 集成
- [ ] 实现站点打卡功能

### 7.4 Phase 4：专题区（列表模式）（2-3 天）
- [ ] 实现 ForumPostCard 组件
- [ ] 实现 ForumList 组件
- [ ] 实现详情页（楼层结构）
- [ ] 实现回复功能（楼中楼）
- [ ] 添加富文本编辑器

### 7.5 Phase 5：附近的人（1-2 天）
- [ ] 实现位置权限请求
- [ ] 实现附近用户列表
- [ ] 添加距离计算逻辑
- [ ] 实现实时位置更新

### 7.6 Phase 6：优化 + 测试（2-3 天）
- [ ] 性能优化（虚拟滚动、图片缓存）
- [ ] 添加单元测试
- [ ] iOS 真机测试
- [ ] Android 真机测试
- [ ] 修复 bug

---

## 8. 成功指标（KPI）

### 8.1 用户参与度
- **日活跃用户（DAU）**：目标 5000+（假设 5500 辆车，每车平均日均 30 人使用）
- **发帖量**：目标 200+ 帖/天
- **互动率**：点赞/评论/分享总数 / 浏览数 > 15%

### 8.2 内容质量
- **精华帖占比**：> 5%
- **举报率**：< 1%
- **图片帖占比**：> 60%（双列流更适合图文）

### 8.3 商业化指标
- **广告点击率（CTR）**：> 2%（信息流广告）
- **商户优惠领取率**：> 10%
- **用户停留时长**：平均 > 8 分钟/次

---

## 9. 风险与应对

### 9.1 技术风险
| 风险 | 影响 | 应对措施 |
|------|------|---------|
| 瀑布流性能问题 | 滑动卡顿 | 使用虚拟滚动、限制渲染数量 |
| 图片加载慢 | 用户体验差 | 使用 CDN、渐进式加载、骨架屏 |
| 后端 API 不支持 | 无法实现功能 | 与后端团队协调，优先开发核心 API |

### 9.2 产品风险
| 风险 | 影响 | 应对措施 |
|------|------|---------|
| 内容质量低 | 用户流失 | 引入内容审核机制、推荐算法优化 |
| 用户冷启动 | 社区活跃度低 | 运营团队发布优质内容、引导用户参与 |
| 隐私问题 | 用户投诉 | "附近的人"功能可选、明确隐私政策 |

---

## 10. 附录

### 10.1 参考设计
- **小红书**：双列瀑布流典范
- **即刻**：社区氛围营造
- **百度贴吧**：论坛模式经典
- **微信读书**：想法流设计

### 10.2 技术栈
- React Native 0.73+
- TypeScript 5.0+
- react-native-fast-image：图片优化
- react-native-masonry-list：瀑布流布局（或自实现）
- @react-navigation：路由导航
- react-i18next：国际化

### 10.3 设计资源
- Figma 设计稿：[待补充]
- UI 组件库：NativeBase / React Native Paper
- 图标库：Emoji（现有方案）

---

## 文档版本

| 版本 | 日期 | 作者 | 修改内容 |
|------|------|------|---------|
| v1.0 | 2025-01-08 | Claude Code | 初始版本 |

---

**审批流程**
- [ ] 产品经理审批
- [ ] 技术负责人审批
- [ ] UI 设计师审批
- [ ] 后端团队确认 API 支持
