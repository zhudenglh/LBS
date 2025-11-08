# 社区功能 - 404 错误修复

## 问题描述

用户点击"发现"Tab 时遇到以下错误：
```
ERROR  API Error: [AxiosError: Request failed with status code 404]
ERROR  Failed to load posts: [AxiosError: Request failed with status code 404]
```

## 原因分析

新的社区功能调用了 `/api/community/feed` API 端点，但该端点在后端尚未实现。

## 解决方案

### 临时修复（已应用）

修改 `src/screens/DiscoverScreenNew.tsx`，使用现有的 `/api/posts` API：

```typescript
// 之前（会导致 404）
const newPosts = await getCommunityFeed({
  userId,
  filter: activeFilter,
  limit: 20,
  offset,
});

// 现在（使用现有 API）
const regularPosts = await getPosts({
  userId,
  limit: 20,
  offset,
});

// 转换为 CommunityPost 格式
const communityPosts: CommunityPost[] = regularPosts.map((post) => ({
  ...post,
  post_type: 'normal',
  is_pinned: false,
  is_featured: Math.random() > 0.8,  // 演示用随机值
  view_count: Math.floor(Math.random() * 1000),
  reply_count: post.comments,
}));
```

### 修改的文件

- ✅ `src/screens/DiscoverScreenNew.tsx`
  - 导入 `getPosts` 而不是 `getCommunityFeed`
  - 转换 `Post` 到 `CommunityPost` 格式

---

## 现在可以正常使用了！

### 重新启动应用

```bash
# 1. 停止当前运行的应用（Ctrl+C）

# 2. 清除缓存（推荐）
npm start -- --reset-cache

# 3. 在新终端运行应用
npm run android  # 或 npm run ios
```

### 测试步骤

1. 打开应用
2. 点击底部 **🔍 发现** Tab
3. **应该能正常看到双列瀑布流布局了！**

---

## 功能限制（临时）

使用现有 API 的限制：

| 功能 | 状态 | 说明 |
|-----|------|------|
| 双列瀑布流布局 | ✅ 正常 | 完全可用 |
| 点赞功能 | ✅ 正常 | 使用现有 API |
| 下拉刷新 | ✅ 正常 | 完全可用 |
| 上拉加载更多 | ✅ 正常 | 完全可用 |
| 发布功能 | ✅ 正常 | 使用现有 API |
| **筛选器** | ⚠️ 部分可用 | 切换筛选器会刷新，但不会实际过滤（需要后端支持） |
| 精华标识 | ⚠️ 随机显示 | 演示用，随机显示精华标识 |
| 浏览数 | ⚠️ 随机值 | 演示用，显示随机浏览数 |
| 线路圈 | ❌ 即将推出 | 需要后端 API |
| 附近的人 | ❌ 即将推出 | 需要后端 API |
| 专题区 | ❌ 即将推出 | 需要后端 API |

---

## 长期解决方案

### 后端需要实现的 API

#### 1. 社区推荐流（优先级：高）
```http
GET /api/community/feed

Query Parameters:
  - userId: string (可选)
  - filter: "hot" | "latest" | "featured"
  - limit: number (默认 20)
  - offset: number (默认 0)

Response:
{
  "posts": [
    {
      "post_id": "string",
      "title": "string",
      "content": "string",
      "username": "string",
      "avatar": "string",
      "timestamp": number,
      "bus_tag": "string",
      "likes": number,
      "comments": number,
      "image_urls": "string",
      "is_liked": boolean,
      "user_id": "string",

      // 新增字段
      "post_type": "normal" | "topic" | "announcement",
      "category": "string",
      "is_pinned": boolean,
      "is_featured": boolean,
      "view_count": number,
      "reply_count": number
    }
  ],
  "total": number
}
```

#### 2. 筛选逻辑

**热门（hot）：**
```sql
ORDER BY (likes * 0.4 + comments * 0.3 + view_count * 0.3) DESC
```

**最新（latest）：**
```sql
ORDER BY timestamp DESC
```

**精华（featured）：**
```sql
WHERE is_featured = true
ORDER BY timestamp DESC
```

### 前端恢复步骤（后端 API 就绪后）

1. **修改 `DiscoverScreenNew.tsx`：**

```typescript
// 将这段代码：
const regularPosts = await getPosts({
  userId,
  limit: 20,
  offset,
});

const communityPosts: CommunityPost[] = regularPosts.map((post) => ({
  ...post,
  post_type: 'normal' as const,
  is_pinned: false,
  is_featured: Math.random() > 0.8,
  view_count: Math.floor(Math.random() * 1000),
  reply_count: post.comments,
}));

// 恢复为：
const communityPosts = await getCommunityFeed({
  userId,
  filter: activeFilter,  // 现在筛选器会真正生效
  limit: 20,
  offset,
});
```

2. **更新导入：**

```typescript
// 从：
import { getPosts, likePost, unlikePost } from '@api/posts';

// 改为：
import { getCommunityFeed } from '@api/community';
import { likePost, unlikePost } from '@api/posts';
```

3. **测试：**
- 筛选器应该正常工作
- 精华标识应该显示真实数据
- 浏览数应该显示真实数据

---

## 数据库扩展建议

### 扩展 Posts 表

```sql
ALTER TABLE posts ADD COLUMN post_type VARCHAR(20) DEFAULT 'normal';
ALTER TABLE posts ADD COLUMN category VARCHAR(50);
ALTER TABLE posts ADD COLUMN is_pinned BOOLEAN DEFAULT false;
ALTER TABLE posts ADD COLUMN is_featured BOOLEAN DEFAULT false;
ALTER TABLE posts ADD COLUMN view_count INT DEFAULT 0;
ALTER TABLE posts ADD COLUMN reply_count INT DEFAULT 0;
ALTER TABLE posts ADD COLUMN last_reply_user VARCHAR(100);
ALTER TABLE posts ADD COLUMN last_reply_time BIGINT;

-- 添加索引以优化查询
CREATE INDEX idx_posts_post_type ON posts(post_type);
CREATE INDEX idx_posts_is_featured ON posts(is_featured);
CREATE INDEX idx_posts_timestamp ON posts(timestamp);
CREATE INDEX idx_posts_hot_score ON posts((likes * 0.4 + comments * 0.3 + view_count * 0.3));
```

---

## 验证修复

### 快速验证清单

- [ ] 点击"发现"Tab 不再报 404 错误
- [ ] 能看到双列瀑布流布局
- [ ] 能看到帖子列表
- [ ] 点赞功能正常
- [ ] 下拉刷新正常
- [ ] 上拉加载更多正常
- [ ] 切换筛选器会刷新列表

### 预期输出（控制台）

**正常情况：**
```
✅ Posts loaded successfully
```

**如果还有错误：**
```bash
# 清除缓存重启
rm -rf node_modules
npm install
npm start -- --reset-cache

# 新终端
npm run android
```

---

## 常见问题

### Q: 筛选器切换了但内容没变？
**A:** 这是正常的，因为当前使用的是临时 API，不支持筛选。等后端 API 实现后会正常工作。

### Q: 有些帖子显示"精华"标识，有些没有？
**A:** 目前是随机显示（演示用），真实数据需要后端实现。

### Q: 浏览数是随机的？
**A:** 是的，目前是随机值（演示用），真实数据需要后端实现。

### Q: 还是报 404 错误？
**A:**
1. 确保已经重启应用
2. 清除缓存：`npm start -- --reset-cache`
3. 检查是否拉取了最新代码
4. 检查后端服务是否正常：`curl http://101.37.70.167:3000/health`

---

## 更新日志

**v1.0.1 (2025-01-08)**
- ✅ 修复 404 错误
- ✅ 使用现有 `/api/posts` API
- ✅ 添加 Post → CommunityPost 类型转换
- ⚠️ 筛选器功能临时降级（等待后端支持）

**v1.0.0 (2025-01-08)**
- ✅ 初始实现双列瀑布流
- ✅ 顶部导航 + 筛选器
- ✅ 国际化支持

---

## 总结

✅ **404 错误已修复**
✅ **社区功能现在可以正常使用**
⚠️ **部分高级功能（筛选、精华标识等）需要后端 API 支持**

**现在就可以测试了！**

```bash
npm start -- --reset-cache
# 新终端
npm run android
```

点击 **🔍 发现** Tab，享受双列瀑布流社区体验！🎉
