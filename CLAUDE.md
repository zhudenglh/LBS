# CLAUDE.md - Deer Link 本地生活社区APP

This file provides guidance to Claude Code when working with the Deer Link full-stack application.

## 项目概述

**Deer Link (小路游)** 是一个面向全国的本地生活社区APP，提供交通出行、本地服务、社区交流等功能。采用现代化技术栈，支持高并发、低延迟的移动端体验。

### 核心定位

- **地域范围**: 全国性本地生活服务平台
- **核心功能**: 公交/地铁出行社区、本地商户优惠、社交分享
- **用户群体**: 通勤族、学生、游客、本地生活服务需求者
- **竞争优势**: 交通 + 社交 + 本地生活三位一体

### 关键特性

1. **社区功能** - 发帖、评论、点赞、分享
2. **交通信息** - 公交/地铁实时信息、路线规划
3. **用户系统** - 邮箱注册、JWT认证、个人主页
4. **图片上传** - 多图上传、自动压缩、CDN加速
5. **多语言** - 中文、英文、印尼语国际化支持
6. **社区分类** - 按城市、线路、主题划分的子社区

## 技术架构

### 技术栈概览

```
┌─────────────────────────────────────────────────────────────┐
│                     Mobile Clients                           │
│  ┌──────────────────┐       ┌──────────────────┐            │
│  │  iOS (React Native)  │   │  Android (RN + Native) │       │
│  └──────────────────┘       └──────────────────┘            │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ HTTPS/REST API
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Backend Services                          │
│  ┌────────────────────────────────────────────────────┐     │
│  │  Go (Gin Framework) - Port 8080                    │     │
│  │  - RESTful API                                      │     │
│  │  - JWT Authentication                               │     │
│  │  - Image Processing                                 │     │
│  │  - Business Logic                                   │     │
│  └────────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────┘
                              │
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   Data & Storage Layer                       │
│  ┌──────────────────┐       ┌──────────────────┐            │
│  │  MySQL 8.0       │       │  Local Storage    │            │
│  │  - User Data     │       │  - Uploaded Images│            │
│  │  - Posts         │       │  - Avatar Files   │            │
│  │  - Comments      │       │  - Nginx CDN      │            │
│  └──────────────────┘       └──────────────────┘            │
└─────────────────────────────────────────────────────────────┘
```

### 前端技术栈 (React Native)

| 技术 | 版本 | 用途 |
|------|------|------|
| **React Native** | 0.73+ | 跨平台移动框架 |
| **TypeScript** | 5.0+ | 类型安全 |
| **React Navigation** | 6.x | 导航路由 |
| **Axios** | 1.6+ | HTTP客户端 |
| **react-i18next** | Latest | 国际化(i18n) |
| **AsyncStorage** | Latest | 本地存储 |
| **NativeWind** | Latest | Tailwind CSS for RN |
| **react-native-image-picker** | Latest | 图片选择 |
| **react-native-fast-image** | Latest | 图片缓存 |
| **react-native-vector-icons** | Latest | 图标库 |

### 后端技术栈 (Go)

| 技术 | 版本 | 用途 |
|------|------|------|
| **Go** | 1.21+ | 编程语言 |
| **Gin** | 1.9+ | Web框架 |
| **GORM** | 1.25+ | ORM框架 |
| **MySQL Driver** | Latest | 数据库驱动 |
| **JWT-Go** | Latest | JWT认证 |
| **bcrypt** | Latest | 密码加密 |
| **imaging** | Latest | 图片处理 |
| **viper** | Latest | 配置管理 |

### 为什么选择 Go 后端？

在 2GB 内存的 ECS 服务器上，Go 相比 Node.js 的优势：

- ✅ **内存占用**: ~20-50MB (Node.js: ~100-200MB)
- ✅ **并发性能**: Goroutine 轻量级协程 vs Event Loop
- ✅ **部署简单**: 单一二进制文件，无需运行时依赖
- ✅ **文件处理**: 原生高效，图片上传处理快
- ✅ **类型安全**: 编译期类型检查，减少运行时错误

## 项目结构

```
deer_link/
├── backend/                    # Go 后端服务
│   ├── cmd/
│   │   └── server/
│   │       └── main.go         # 应用入口
│   ├── internal/
│   │   ├── config/             # 配置管理
│   │   ├── models/             # 数据模型 (GORM)
│   │   │   ├── user.go         # 用户模型
│   │   │   ├── post.go         # 帖子模型
│   │   │   ├── comment.go      # 评论模型
│   │   │   ├── like.go         # 点赞模型
│   │   │   └── image.go        # 图片模型
│   │   ├── handlers/           # HTTP 处理器 (Controller)
│   │   │   ├── auth.go         # 认证相关: 注册/登录
│   │   │   ├── user.go         # 用户相关: 资料/关注
│   │   │   ├── post.go         # 帖子相关: 发布/列表
│   │   │   ├── comment.go      # 评论相关
│   │   │   ├── like.go         # 点赞相关
│   │   │   └── upload.go       # 文件上传
│   │   ├── middleware/         # 中间件
│   │   │   ├── auth.go         # JWT 认证
│   │   │   ├── cors.go         # 跨域处理
│   │   │   └── logger.go       # 请求日志
│   │   ├── database/           # 数据库连接
│   │   │   └── mysql.go
│   │   └── routes/             # 路由配置
│   │       └── routes.go
│   ├── pkg/                    # 公共工具包
│   │   ├── response/           # 统一响应格式
│   │   └── utils/              # 工具函数
│   │       ├── jwt.go          # JWT 生成/验证
│   │       ├── hash.go         # 密码加密
│   │       └── validator.go    # 输入验证
│   ├── configs/                # 配置文件
│   │   └── config.yaml
│   ├── storage/                # 文件存储
│   │   ├── uploads/            # 上传图片
│   │   └── avatars/            # 用户头像
│   ├── scripts/                # 部署/运维脚本
│   ├── go.mod                  # Go 依赖管理
│   └── Makefile                # 构建命令
│
├── src/                        # React Native 前端
│   ├── api/                    # API 客户端
│   │   ├── client.ts           # Axios 配置
│   │   ├── auth.ts             # 认证 API
│   │   ├── posts.ts            # 帖子 API
│   │   ├── images.ts           # 图片上传 API
│   │   └── users.ts            # 用户 API
│   ├── components/             # 可复用组件
│   │   ├── common/             # 通用组件
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Avatar.tsx
│   │   │   └── Input.tsx
│   │   ├── posts/              # 帖子组件
│   │   │   ├── PostCard.tsx
│   │   │   ├── PostList.tsx
│   │   │   └── CreatePost.tsx
│   │   ├── community/          # 社区组件
│   │   │   ├── SubredditHeader.tsx
│   │   │   ├── FlairSelector.tsx
│   │   │   └── TagFilterBar.tsx
│   │   └── profile/            # 个人主页组件
│   ├── screens/                # 页面组件
│   │   ├── HomeScreen.tsx      # 首页
│   │   ├── DiscoverScreen.tsx  # 发现页
│   │   ├── ProfileScreen.tsx   # 个人主页
│   │   ├── RegisterScreen.tsx  # 注册页
│   │   ├── CreatePostScreen.tsx # 发帖页
│   │   └── community/
│   │       └── SubredditPage.tsx # 社区详情页
│   ├── navigation/             # 导航配置
│   │   └── MainNavigator.tsx
│   ├── contexts/               # React Context
│   │   └── UserContext.tsx     # 用户状态管理
│   ├── hooks/                  # 自定义 Hooks
│   │   ├── usePosts.ts
│   │   └── useAuth.ts
│   ├── i18n/                   # 国际化
│   │   ├── index.ts
│   │   └── locales/
│   │       ├── zh.json         # 中文
│   │       ├── en.json         # 英文
│   │       └── id.json         # 印尼语
│   ├── types/                  # TypeScript 类型定义
│   │   ├── api.ts
│   │   ├── post.ts
│   │   └── user.ts
│   ├── utils/                  # 工具函数
│   │   ├── storage.ts          # AsyncStorage 封装
│   │   ├── time.ts             # 时间格式化
│   │   └── validator.ts        # 表单验证
│   ├── constants/              # 常量配置
│   │   ├── api.ts              # API 端点
│   │   ├── config.ts           # 应用配置
│   │   └── theme.ts            # 主题配置
│   └── App.tsx                 # 应用根组件
│
├── android/                    # Android 原生代码
│   ├── app/
│   │   ├── build.gradle        # 构建配置
│   │   └── src/
│   │       └── main/
│   │           ├── AndroidManifest.xml
│   │           └── java/       # 原生 Java/Kotlin 代码
│   └── gradle/                 # Gradle 配置
│
├── ios/                        # iOS 原生代码 (如需要)
│
├── scripts/                    # 前端脚本
│   ├── migrateMockData.js      # 数据迁移脚本
│   └── syncMockData.ts         # Mock 数据同步
│
├── package.json                # npm 依赖
├── tsconfig.json               # TypeScript 配置
├── babel.config.js             # Babel 配置
├── metro.config.js             # Metro bundler 配置
├── tailwind.config.js          # Tailwind CSS 配置
└── CLAUDE.md                   # 本文档
```

## 开发环境搭建

### 后端开发 (Go)

```bash
# 1. 安装 Go 1.21+
# https://go.dev/dl/

# 2. 进入后端目录
cd backend

# 3. 安装依赖
go mod download

# 4. 配置环境变量
cp configs/config.yaml.example configs/config.yaml
# 编辑 config.yaml 配置数据库连接等

# 5. 初始化数据库
mysql -u root -p < scripts/init_db.sql

# 6. 运行开发服务器
go run cmd/server/main.go

# 或使用 Make 命令
make run

# 7. 构建生产版本
make build
```

### 前端开发 (React Native)

```bash
# 1. 安装 Node.js 18+ 和 npm

# 2. 安装依赖
npm install

# 3. 配置 API 地址
# 编辑 src/constants/api.ts
export const API_BASE_URL = 'http://47.107.130.240:8080/api/v1';

# 4. 启动 Metro bundler
npm start

# 5. 运行 Android
npm run android

# 6. 运行 iOS (macOS only)
cd ios && pod install && cd ..
npm run ios

# 7. TypeScript 类型检查
npm run tsc

# 8. 代码检查
npm run lint
```

### Android 构建

```bash
# Debug 版本
cd android
./gradlew assembleDebug

# Release 版本
./gradlew assembleRelease

# 输出位置
# android/app/build/outputs/apk/release/app-arm64-v8a-release.apk
```

## API 接口文档

### 基础信息

- **Base URL**: `http://47.107.130.240:8080/api/v1`
- **认证方式**: JWT Bearer Token
- **Content-Type**: `application/json`

### 认证接口

#### 注册用户
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "nickname": "用户昵称",
  "avatar": "http://example.com/avatar.jpg",  // 可选
  "gender": 1,                                 // 可选: 0=保密, 1=男, 2=女
  "age": 25                                    // 可选
}

Response 200:
{
  "code": 200,
  "message": "Registration successful",
  "data": {
    "user_id": "uuid-string",
    "token": "jwt-token-string",
    "expires_at": "2025-11-20T15:04:05Z"
  }
}
```

#### 登录
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response 200:
{
  "code": 200,
  "message": "Login successful",
  "data": {
    "user_id": "uuid-string",
    "nickname": "用户昵称",
    "avatar": "http://...",
    "token": "jwt-token-string",
    "expires_at": "2025-11-20T15:04:05Z"
  }
}
```

#### 刷新 Token
```http
POST /auth/refresh
Authorization: Bearer <token>

Response 200:
{
  "code": 200,
  "data": {
    "token": "new-jwt-token",
    "expires_at": "2025-11-20T15:04:05Z"
  }
}
```

### 帖子接口

#### 创建帖子
```http
POST /posts
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "帖子标题",
  "content": "帖子内容",           // 可选
  "images": ["url1", "url2"],    // 可选
  "bus_tag": "s1路",             // 可选: 线路标签
  "community_id": "nanjing"       // 可选: 社区ID
}

Response 200:
{
  "code": 200,
  "data": {
    "post_id": "uuid-string",
    "created_at": "2025-11-13T..."
  }
}
```

#### 获取帖子列表
```http
GET /posts?page=1&page_size=20&community_id=nanjing&sort_by=created_at
Authorization: Bearer <token>  // 可选，用于返回点赞状态

Response 200:
{
  "code": 200,
  "data": {
    "posts": [
      {
        "post_id": "uuid",
        "user_id": "uuid",
        "username": "昵称",
        "avatar": "头像URL",
        "title": "标题",
        "content": "内容",
        "images": ["url1"],
        "bus_tag": "s1路",
        "likes": 123,
        "comments": 45,
        "is_liked": false,
        "is_favorited": false,
        "created_at": "2025-11-13T..."
      }
    ],
    "pagination": {
      "page": 1,
      "page_size": 20,
      "total": 100,
      "total_pages": 5
    }
  }
}
```

#### 获取帖子详情
```http
GET /posts/:post_id
Authorization: Bearer <token>  // 可选

Response 200:
{
  "code": 200,
  "data": {
    "post": { /* 帖子详情 */ }
  }
}
```

#### 删除帖子
```http
DELETE /posts/:post_id
Authorization: Bearer <token>

Response 200:
{
  "code": 200,
  "message": "Post deleted successfully"
}
```

### 点赞接口

#### 点赞帖子
```http
POST /posts/:post_id/like
Authorization: Bearer <token>

Response 200:
{
  "code": 200,
  "data": {
    "likes": 124  // 更新后的点赞数
  }
}
```

#### 取消点赞
```http
DELETE /posts/:post_id/like
Authorization: Bearer <token>

Response 200:
{
  "code": 200,
  "data": {
    "likes": 123
  }
}
```

### 图片上传

#### 上传图片
```http
POST /upload/image
Authorization: Bearer <token>
Content-Type: multipart/form-data

Form Data:
- image: <binary file>

Response 200:
{
  "code": 200,
  "data": {
    "url": "http://47.107.130.240/storage/uploads/xxx.jpg"
  }
}
```

### 错误响应

```json
{
  "code": 400,
  "message": "Invalid request parameters"
}
```

常见错误码：
- `400` - 请求参数错误
- `401` - 未认证或 Token 过期
- `403` - 无权限
- `404` - 资源不存在
- `500` - 服务器内部错误

## 前端架构原则

### 1. 组件大小限制

- **最大 200 行/组件** - 超过则拆分成更小的组件
- 使用自定义 Hooks 提取复杂逻辑
- UI 逻辑与业务逻辑分离

### 2. 无硬编码字符串

- **所有用户可见文本使用 i18n** - `t('key')` from react-i18next
- 按功能组织翻译键
- 动态内容使用插值: `t('greeting', { name: 'User' })`

### 3. 类型安全

- 所有 API 响应必须有 TypeScript 接口定义
- 使用 `tsconfig.json` 严格模式
- 避免 `any` 类型，使用 `unknown` 或明确类型

### 4. 状态管理

- 全局状态使用 React Context (用户、主题)
- 组件局部状态使用 `useState`
- 复杂状态逻辑使用 `useReducer`

### 5. 代码组织

- 一个文件一个组件
- 相关组件按目录分组
- 使用桶式导出 (index.ts) 简化导入

## 后端架构原则

### 1. 分层架构

```
HTTP Request
    ↓
Handler (Controller) - 处理 HTTP 请求/响应
    ↓
Service - 业务逻辑
    ↓
Repository - 数据访问
    ↓
Database
```

### 2. 错误处理

```go
// 统一错误响应
response.BadRequest(c, "Invalid parameters")
response.Unauthorized(c, "Token expired")
response.InternalError(c, "Server error")
```

### 3. 数据库迁移

```bash
# 自动迁移（开发环境）
db.AutoMigrate(&models.User{}, &models.Post{})

# 生产环境使用 SQL 脚本
mysql -u root -p deer_link_community < migration.sql
```

### 4. 日志规范

```go
log.Printf("[INFO] User %s logged in", userID)
log.Printf("[ERROR] Failed to create post: %v", err)
```

## 前端核心功能实现

### 用户认证流程

```typescript
// 1. 注册
const response = await registerWithEmail({
  email: 'user@example.com',
  password: 'password123',
  nickname: '用户昵称',
  gender: 1,
  age: 25
});

// 2. 保存 token 到 AsyncStorage
await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, response.token);
await AsyncStorage.setItem(STORAGE_KEYS.USER_ID, response.user_id);

// 3. Axios 自动注入 token
apiClient.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### 发帖流程

```typescript
// 1. 选择图片
const result = await launchImageLibrary({
  mediaType: 'photo',
  maxWidth: 1024,
  maxHeight: 1024,
  quality: 0.8
});

// 2. 上传图片
const imageUrls = await uploadMultipleImages(result.assets);

// 3. 创建帖子
await createPost({
  title: '帖子标题',
  content: '帖子内容',
  images: imageUrls,
  bus_tag: 's1路'
});

// 4. 刷新帖子列表
loadPosts();
```

### 下拉刷新

```typescript
const [refreshing, setRefreshing] = useState(false);

const handleRefresh = async () => {
  setRefreshing(true);
  await loadPosts();
  setRefreshing(false);
};

<ScrollView
  refreshControl={
    <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
  }
>
  {/* 内容 */}
</ScrollView>
```

## 部署架构

### 服务器配置

- **云服务商**: 阿里云 ECS
- **公网 IP**: 47.107.130.240
- **私有 IP**: 172.17.35.160
- **配置**: 2 vCPU, 2 GB 内存, 40 GB ESSD
- **操作系统**: Ubuntu 20.04 LTS

### 服务部署

```bash
# 后端服务
/opt/deer_link/backend/deer_link_server  # Go 二进制文件
# 端口: 8080

# MySQL 数据库
# 端口: 3306
# 数据库: deer_link_community

# Nginx 静态文件服务
# 端口: 80
# 静态目录: /opt/deer_link/backend/storage/
```

### 部署步骤

```bash
# 1. 连接服务器
ssh root@47.107.130.240

# 2. 进入后端目录
cd /opt/deer_link/backend

# 3. 拉取最新代码 (如使用 Git)
git pull origin main

# 4. 编译 Go 程序
go build -o deer_link_server cmd/server/main.go

# 5. 重启服务
pkill -f deer_link_server
nohup ./deer_link_server > server.log 2>&1 &

# 6. 检查服务状态
ps aux | grep deer_link_server
tail -f server.log

# 7. 测试 API
curl http://47.107.130.240:8080/api/v1/posts
```

### 数据库备份

```bash
# 备份
mysqldump -u root -p deer_link_community > backup_$(date +%Y%m%d).sql

# 恢复
mysql -u root -p deer_link_community < backup_20251113.sql
```

## 常见问题排查

### 1. 401 认证错误

**问题**: API 返回 401 Unauthorized

**原因**:
- Token 未设置或已过期
- Token 格式错误

**解决**:
```typescript
// 检查 token 是否存在
const token = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);
console.log('Token:', token);

// 检查 token 是否在请求头中
console.log('Request headers:', config.headers);

// 重新登录获取新 token
await loginWithEmail(email, password);
```

### 2. 400 参数错误

**问题**: API 返回 400 Bad Request

**原因**:
- 必填字段缺失
- 字段类型错误
- 字段名不匹配

**解决**:
```typescript
// 检查字段名是否匹配后端要求
// 前端: busTag → 后端: bus_tag
// 前端: imageUrls → 后端: images

// 转换字段名
const requestData = {
  title: data.title,
  content: data.content,
  images: data.imageUrls,     // ✅ imageUrls → images
  bus_tag: data.busTag,       // ✅ busTag → bus_tag
};
```

### 3. 图片上传失败

**问题**: 图片无法上传

**原因**:
- 文件过大 (>10MB)
- 网络超时
- 服务器存储空间不足

**解决**:
```typescript
// 压缩图片
const result = await launchImageLibrary({
  mediaType: 'photo',
  maxWidth: 1024,        // 限制宽度
  maxHeight: 1024,       // 限制高度
  quality: 0.8,          // 压缩质量
});

// 增加超时时间
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000,        // 60秒
});
```

### 4. Android 构建失败

**问题**: Gradle 构建失败

**解决**:
```bash
# 清理构建缓存
cd android
./gradlew clean

# 重新构建
./gradlew assembleRelease

# 检查 Java 版本 (需要 JDK 11+)
java -version
```

### 5. 后端服务无响应

**问题**: API 请求超时

**解决**:
```bash
# 检查服务是否运行
ps aux | grep deer_link_server

# 检查端口是否监听
netstat -tlnp | grep 8080

# 查看日志
tail -100 /opt/deer_link/backend/server.log

# 重启服务
pkill -f deer_link_server
cd /opt/deer_link/backend
./deer_link_server > server.log 2>&1 &
```

## 性能优化

### 前端优化

1. **图片优化**
   - 使用 FastImage 替代 Image 组件
   - 启用图片缓存
   - 延迟加载图片

2. **列表优化**
   - 使用 FlatList 替代 ScrollView
   - 实现虚拟化长列表
   - 添加 key 属性

3. **组件优化**
   - 使用 React.memo 缓存组件
   - 使用 useCallback 缓存函数
   - 使用 useMemo 缓存计算结果

### 后端优化

1. **数据库优化**
   - 添加索引 (user_id, post_id, created_at)
   - 使用分页查询
   - 优化查询语句

2. **缓存策略**
   - 热门帖子缓存
   - 用户信息缓存
   - CDN 静态资源

3. **并发控制**
   - 使用 Goroutine 池
   - 限流中间件
   - 数据库连接池

## 数据库 Schema

### users 表
```sql
CREATE TABLE users (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL UNIQUE,
  phone VARCHAR(20) UNIQUE,
  email VARCHAR(100) UNIQUE,
  nickname VARCHAR(50) NOT NULL,
  avatar VARCHAR(255),
  bio TEXT,
  gender TINYINT DEFAULT 0,        -- 0=保密, 1=男, 2=女
  age INT,
  birthday DATETIME,
  location VARCHAR(100),
  password VARCHAR(255) NOT NULL,
  status TINYINT DEFAULT 1,        -- 1=正常, 2=封禁
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  INDEX idx_users_email (email),
  INDEX idx_users_status (status)
);
```

### posts 表
```sql
CREATE TABLE posts (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  post_id VARCHAR(36) NOT NULL UNIQUE,
  user_id VARCHAR(36) NOT NULL,
  title VARCHAR(200) NOT NULL,
  content TEXT,
  images JSON,                     -- 图片 URL 数组
  videos JSON,
  links JSON,
  bus_tag VARCHAR(50),             -- 线路标签
  community_id VARCHAR(50),
  flair VARCHAR(50),
  status TINYINT DEFAULT 1,        -- 1=已发布, 2=草稿, 3=已删除
  like_count INT DEFAULT 0,
  comment_count INT DEFAULT 0,
  share_count INT DEFAULT 0,
  view_count INT DEFAULT 0,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  INDEX idx_posts_user_id (user_id),
  INDEX idx_posts_community_id (community_id),
  INDEX idx_posts_status (status),
  INDEX idx_posts_created_at (created_at)
);
```

## 安全考虑

1. **密码安全**
   - bcrypt 加密存储
   - 最小长度 6 位

2. **Token 安全**
   - JWT 7 天过期
   - HTTPS 传输（生产环境）
   - 不在 URL 中传递 token

3. **输入验证**
   - 前端验证 (用户体验)
   - 后端验证 (安全保障)
   - SQL 注入防护 (GORM 参数化查询)

4. **文件上传**
   - 文件类型验证
   - 文件大小限制 (10MB)
   - 文件名随机化

## 项目文档

- **后端文档**: `backend/README.md`
- **部署文档**: `backend/DEPLOY_ECS.md`
- **快速开始**: `backend/QUICKSTART.md`
- **API 文档**: `backend/docs/API.md`

## 开发规范

### Git 提交规范

```
feat: 新功能
fix: 修复 bug
docs: 文档更新
style: 代码格式调整
refactor: 重构
test: 测试相关
chore: 构建/工具链更新
```

### 代码审查清单

- [ ] 代码符合 ESLint/Go fmt 规范
- [ ] 所有字符串已国际化
- [ ] API 接口有错误处理
- [ ] 敏感信息不在代码中硬编码
- [ ] 数据库查询使用参数化
- [ ] 添加必要的注释
- [ ] 组件不超过 200 行

## 资源链接

### React Native
- [React Native 官方文档](https://reactnative.dev/)
- [React Navigation](https://reactnavigation.org/)
- [NativeWind](https://www.nativewind.dev/)

### Go 后端
- [Gin 框架](https://gin-gonic.com/)
- [GORM 文档](https://gorm.io/)
- [Go 语言之旅](https://tour.golang.org/)

### 工具
- [Postman](https://www.postman.com/) - API 测试
- [DBeaver](https://dbeaver.io/) - 数据库管理
- [React Native Debugger](https://github.com/jhen0409/react-native-debugger)

---

**最后更新**: 2025-11-14
**维护者**: Deer Link 开发团队
