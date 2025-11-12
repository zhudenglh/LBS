# 小路游社区 API 文档

## 基础信息

- **Base URL**: `http://47.107.130.240/api/v1`
- **认证方式**: JWT (JSON Web Token)
- **Content-Type**: `application/json`
- **字符编码**: UTF-8

## 通用响应格式

### 成功响应

```json
{
  "code": 200,
  "message": "success",
  "data": {
    // 具体数据
  }
}
```

### 错误响应

```json
{
  "code": 400,
  "message": "错误信息描述",
  "data": null
}
```

### 状态码说明

| 状态码 | 说明 |
|-------|------|
| 200 | 成功 |
| 400 | 请求参数错误 |
| 401 | 未认证或 Token 过期 |
| 403 | 无权限访问 |
| 404 | 资源不存在 |
| 429 | 请求过于频繁 |
| 500 | 服务器内部错误 |

## 认证流程

### 1. 注册

**接口**: `POST /auth/register`

**描述**: 用户注册

**请求参数**:

```json
{
  "phone": "13800138000",
  "nickname": "小路游用户",
  "password": "password123"
}
```

**响应示例**:

```json
{
  "code": 200,
  "message": "注册成功",
  "data": {
    "user_id": "uuid-user-id",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expires_at": "2025-01-18T10:00:00Z"
  }
}
```

### 2. 登录

**接口**: `POST /auth/login`

**描述**: 用户登录

**请求参数**:

```json
{
  "phone": "13800138000",
  "password": "password123"
}
```

**响应示例**:

```json
{
  "code": 200,
  "message": "登录成功",
  "data": {
    "user_id": "uuid-user-id",
    "nickname": "小路游用户",
    "avatar": "http://47.107.130.240/storage/images/avatar.jpg",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expires_at": "2025-01-18T10:00:00Z"
  }
}
```

### 3. 刷新 Token

**接口**: `POST /auth/refresh`

**描述**: 刷新认证 Token

**请求头**:
```
Authorization: Bearer <token>
```

**响应示例**:

```json
{
  "code": 200,
  "message": "Token 刷新成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expires_at": "2025-01-18T10:00:00Z"
  }
}
```

## 用户接口

### 1. 获取用户信息

**接口**: `GET /users/:userId`

**描述**: 获取指定用户的公开信息

**请求头**:
```
Authorization: Bearer <token>
```

**响应示例**:

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "user_id": "uuid-user-id",
    "nickname": "小路游用户",
    "avatar": "http://47.107.130.240/storage/images/avatar.jpg",
    "bio": "爱坐公交，爱生活",
    "gender": 1,
    "location": "南京市",
    "post_count": 15,
    "follower_count": 120,
    "following_count": 80,
    "created_at": "2025-01-01T10:00:00Z"
  }
}
```

### 2. 更新用户信息

**接口**: `PUT /users/:userId`

**描述**: 更新当前用户信息（只能更新自己）

**请求头**:
```
Authorization: Bearer <token>
```

**请求参数**:

```json
{
  "nickname": "新昵称",
  "avatar": "http://47.107.130.240/storage/images/new_avatar.jpg",
  "bio": "新的个人简介",
  "gender": 1,
  "birthday": "1990-01-01",
  "location": "南京市"
}
```

**响应示例**:

```json
{
  "code": 200,
  "message": "更新成功",
  "data": {
    "user_id": "uuid-user-id",
    "nickname": "新昵称",
    "avatar": "http://47.107.130.240/storage/images/new_avatar.jpg"
  }
}
```

### 3. 获取用户帖子列表

**接口**: `GET /users/:userId/posts`

**描述**: 获取指定用户发布的帖子列表

**请求参数**:

| 参数 | 类型 | 必填 | 说明 | 默认值 |
|-----|------|-----|------|--------|
| page | int | 否 | 页码 | 1 |
| page_size | int | 否 | 每页数量 | 20 |

**响应示例**:

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "posts": [
      {
        "post_id": "uuid-post-id",
        "user_id": "uuid-user-id",
        "user_nickname": "小路游用户",
        "user_avatar": "http://47.107.130.240/storage/images/avatar.jpg",
        "title": "33路公交今天很准时",
        "content": "今天坐33路去上班...",
        "images": [
          "http://47.107.130.240/storage/images/2025/01/11/uuid1.jpg"
        ],
        "bus_tag": "33路",
        "location": "东浦路",
        "like_count": 5,
        "comment_count": 2,
        "is_liked": false,
        "is_favorited": false,
        "created_at": "2025-01-11T10:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "page_size": 20,
      "total": 15
    }
  }
}
```

## 帖子接口

### 1. 获取帖子列表

**接口**: `GET /posts`

**描述**: 获取帖子列表（支持筛选和排序）

**请求头**:
```
Authorization: Bearer <token>
```

**请求参数**:

| 参数 | 类型 | 必填 | 说明 | 默认值 |
|-----|------|-----|------|--------|
| page | int | 否 | 页码 | 1 |
| page_size | int | 否 | 每页数量 | 20 |
| sort_by | string | 否 | 排序方式: latest, hot | latest |
| bus_tag | string | 否 | 公交标签筛选 | - |
| user_id | string | 否 | 当前用户ID（用于判断点赞状态） | - |

**响应示例**: 同 "获取用户帖子列表"

### 2. 创建帖子

**接口**: `POST /posts`

**描述**: 发布新帖子

**请求头**:
```
Authorization: Bearer <token>
Content-Type: application/json
```

**请求参数**:

```json
{
  "title": "33路公交今天很准时",
  "content": "今天坐33路去上班，车来得很准时，司机师傅态度也很好！点赞！",
  "images": [
    "http://47.107.130.240/storage/images/2025/01/11/uuid1.jpg",
    "http://47.107.130.240/storage/images/2025/01/11/uuid2.jpg"
  ],
  "bus_tag": "33路",
  "location": "东浦路"
}
```

**响应示例**:

```json
{
  "code": 200,
  "message": "发布成功",
  "data": {
    "post_id": "uuid-post-id",
    "created_at": "2025-01-11T10:00:00Z"
  }
}
```

### 3. 获取帖子详情

**接口**: `GET /posts/:postId`

**描述**: 获取帖子详细信息

**请求头**:
```
Authorization: Bearer <token>
```

**请求参数**:

| 参数 | 类型 | 必填 | 说明 |
|-----|------|-----|------|
| user_id | string | 否 | 当前用户ID（用于判断点赞/收藏状态） |

**响应示例**:

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "post_id": "uuid-post-id",
    "user_id": "uuid-user-id",
    "user_nickname": "小路游用户",
    "user_avatar": "http://47.107.130.240/storage/images/avatar.jpg",
    "title": "33路公交今天很准时",
    "content": "今天坐33路去上班，车来得很准时，司机师傅态度也很好！点赞！",
    "images": [
      "http://47.107.130.240/storage/images/2025/01/11/uuid1.jpg"
    ],
    "bus_tag": "33路",
    "location": "东浦路",
    "like_count": 5,
    "comment_count": 2,
    "share_count": 0,
    "view_count": 120,
    "is_liked": false,
    "is_favorited": false,
    "created_at": "2025-01-11T10:00:00Z"
  }
}
```

### 4. 删除帖子

**接口**: `DELETE /posts/:postId`

**描述**: 删除帖子（只能删除自己的帖子）

**请求头**:
```
Authorization: Bearer <token>
```

**响应示例**:

```json
{
  "code": 200,
  "message": "删除成功",
  "data": null
}
```

## 互动接口

### 1. 点赞帖子

**接口**: `POST /posts/:postId/like`

**描述**: 点赞帖子

**请求头**:
```
Authorization: Bearer <token>
```

**响应示例**:

```json
{
  "code": 200,
  "message": "点赞成功",
  "data": {
    "like_count": 6
  }
}
```

### 2. 取消点赞

**接口**: `DELETE /posts/:postId/like`

**描述**: 取消点赞帖子

**请求头**:
```
Authorization: Bearer <token>
```

**响应示例**:

```json
{
  "code": 200,
  "message": "取消点赞成功",
  "data": {
    "like_count": 5
  }
}
```

### 3. 收藏帖子

**接口**: `POST /posts/:postId/favorite`

**描述**: 收藏帖子

**请求头**:
```
Authorization: Bearer <token>
```

**响应示例**:

```json
{
  "code": 200,
  "message": "收藏成功",
  "data": null
}
```

### 4. 取消收藏

**接口**: `DELETE /posts/:postId/favorite`

**描述**: 取消收藏帖子

**请求头**:
```
Authorization: Bearer <token>
```

**响应示例**:

```json
{
  "code": 200,
  "message": "取消收藏成功",
  "data": null
}
```

### 5. 获取评论列表

**接口**: `GET /posts/:postId/comments`

**描述**: 获取帖子的评论列表

**请求参数**:

| 参数 | 类型 | 必填 | 说明 | 默认值 |
|-----|------|-----|------|--------|
| page | int | 否 | 页码 | 1 |
| page_size | int | 否 | 每页数量 | 20 |
| sort_by | string | 否 | 排序: latest, hot | latest |

**响应示例**:

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "comments": [
      {
        "comment_id": "uuid-comment-id",
        "post_id": "uuid-post-id",
        "user_id": "uuid-user-id",
        "user_nickname": "评论者",
        "user_avatar": "http://47.107.130.240/storage/images/avatar2.jpg",
        "content": "确实准时，我也经常坐！",
        "like_count": 2,
        "reply_count": 1,
        "is_liked": false,
        "created_at": "2025-01-11T11:00:00Z",
        "replies": [
          {
            "comment_id": "uuid-reply-id",
            "parent_id": "uuid-comment-id",
            "user_id": "uuid-user-id-2",
            "user_nickname": "回复者",
            "user_avatar": "http://47.107.130.240/storage/images/avatar3.jpg",
            "reply_to_user_id": "uuid-user-id",
            "reply_to_nickname": "评论者",
            "content": "对啊，33路服务真的不错！",
            "like_count": 0,
            "created_at": "2025-01-11T12:00:00Z"
          }
        ]
      }
    ],
    "pagination": {
      "page": 1,
      "page_size": 20,
      "total": 2
    }
  }
}
```

### 6. 发表评论

**接口**: `POST /posts/:postId/comments`

**描述**: 对帖子发表评论

**请求头**:
```
Authorization: Bearer <token>
```

**请求参数**:

```json
{
  "content": "确实准时，我也经常坐！",
  "parent_id": null,
  "reply_to_user_id": null
}
```

**字段说明**:
- `parent_id`: 父评论ID（二级评论/回复时必填）
- `reply_to_user_id`: 回复目标用户ID（二级评论时必填）

**响应示例**:

```json
{
  "code": 200,
  "message": "评论成功",
  "data": {
    "comment_id": "uuid-comment-id",
    "created_at": "2025-01-11T11:00:00Z"
  }
}
```

### 7. 删除评论

**接口**: `DELETE /comments/:commentId`

**描述**: 删除评论（只能删除自己的评论）

**请求头**:
```
Authorization: Bearer <token>
```

**响应示例**:

```json
{
  "code": 200,
  "message": "删除成功",
  "data": null
}
```

## 文件上传接口

### 1. 上传图片

**接口**: `POST /upload/image`

**描述**: 上传图片文件

**请求头**:
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**请求参数**:

| 参数 | 类型 | 必填 | 说明 |
|-----|------|-----|------|
| image | file | 是 | 图片文件 |

**文件限制**:
- 最大大小: 10MB
- 支持格式: JPG, JPEG, PNG, GIF

**响应示例**:

```json
{
  "code": 200,
  "message": "上传成功",
  "data": {
    "image_id": "uuid-image-id",
    "original_url": "http://47.107.130.240/storage/images/2025/01/11/uuid.jpg",
    "thumbnail_url": "http://47.107.130.240/storage/thumbnails/2025/01/11/uuid_thumb.jpg",
    "width": 1920,
    "height": 1080,
    "file_size": 524288
  }
}
```

### 2. 批量上传图片

**接口**: `POST /upload/images`

**描述**: 批量上传多张图片

**请求头**:
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**请求参数**:

| 参数 | 类型 | 必填 | 说明 |
|-----|------|-----|------|
| images[] | file | 是 | 图片文件数组（最多9张） |

**响应示例**:

```json
{
  "code": 200,
  "message": "上传成功",
  "data": {
    "images": [
      {
        "image_id": "uuid-1",
        "original_url": "http://47.107.130.240/storage/images/2025/01/11/uuid1.jpg",
        "thumbnail_url": "http://47.107.130.240/storage/thumbnails/2025/01/11/uuid1_thumb.jpg"
      },
      {
        "image_id": "uuid-2",
        "original_url": "http://47.107.130.240/storage/images/2025/01/11/uuid2.jpg",
        "thumbnail_url": "http://47.107.130.240/storage/thumbnails/2025/01/11/uuid2_thumb.jpg"
      }
    ]
  }
}
```

## AI 聊天接口

### 1. 发送消息

**接口**: `POST /ai/chat`

**描述**: 与 AI 助手（金陵妙）对话

**请求头**:
```
Authorization: Bearer <token>
```

**请求参数**:

```json
{
  "message": "南京有哪些好吃的？",
  "chat_id": "uuid-chat-id"
}
```

**字段说明**:
- `chat_id`: 会话ID（可选，不传则创建新会话）

**响应示例**:

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "chat_id": "uuid-chat-id",
    "reply": "南京有很多美食呢！比如鸭血粉丝汤、盐水鸭、小笼包...",
    "created_at": "2025-01-11T10:00:00Z"
  }
}
```

### 2. 获取对话历史

**接口**: `GET /ai/chat/history`

**描述**: 获取用户与 AI 的对话历史

**请求头**:
```
Authorization: Bearer <token>
```

**请求参数**:

| 参数 | 类型 | 必填 | 说明 | 默认值 |
|-----|------|-----|------|--------|
| chat_id | string | 否 | 会话ID | - |
| limit | int | 否 | 返回消息数量 | 50 |

**响应示例**:

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "chat_id": "uuid-chat-id",
    "messages": [
      {
        "role": "user",
        "content": "南京有哪些好吃的？",
        "created_at": "2025-01-11T10:00:00Z"
      },
      {
        "role": "assistant",
        "content": "南京有很多美食呢！比如鸭血粉丝汤、盐水鸭、小笼包...",
        "created_at": "2025-01-11T10:00:05Z"
      }
    ]
  }
}
```

## 健康检查

### 1. 健康检查

**接口**: `GET /health`

**描述**: 服务健康检查接口

**响应示例**:

```json
{
  "status": "healthy",
  "timestamp": "2025-01-11T10:00:00Z",
  "version": "1.0.0"
}
```

## 限流规则

- 默认: 10 请求/秒
- 突发: 20 请求
- 超出限制返回 429 状态码

## 错误码详细说明

| 错误码 | 错误信息 | 说明 |
|-------|---------|------|
| 40001 | Invalid parameters | 请求参数错误 |
| 40002 | Invalid token | Token 无效 |
| 40003 | Token expired | Token 已过期 |
| 40004 | File too large | 文件过大 |
| 40005 | Invalid file type | 文件类型不支持 |
| 40101 | User not found | 用户不存在 |
| 40102 | Post not found | 帖子不存在 |
| 40103 | Comment not found | 评论不存在 |
| 40301 | Permission denied | 无权限操作 |
| 40401 | Resource not found | 资源不存在 |
| 42901 | Too many requests | 请求过于频繁 |
| 50001 | Internal server error | 服务器内部错误 |
| 50002 | Database error | 数据库错误 |
| 50003 | File upload error | 文件上传失败 |

## 测试工具

### cURL 示例

```bash
# 登录
curl -X POST http://47.107.130.240/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"phone":"13800138000","password":"password123"}'

# 获取帖子列表
curl -X GET "http://47.107.130.240/api/v1/posts?page=1&page_size=20" \
  -H "Authorization: Bearer YOUR_TOKEN"

# 上传图片
curl -X POST http://47.107.130.240/api/v1/upload/image \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "image=@/path/to/image.jpg"

# 发布帖子
curl -X POST http://47.107.130.240/api/v1/posts \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "测试帖子",
    "content": "这是一条测试帖子",
    "images": ["http://47.107.130.240/storage/images/test.jpg"],
    "bus_tag": "33路"
  }'
```

### Postman Collection

完整的 Postman Collection 可在项目根目录找到：
- `postman_collection.json`

---

**版本**: v1.0.0
**更新时间**: 2025-01-11
**维护者**: 小路游技术团队
