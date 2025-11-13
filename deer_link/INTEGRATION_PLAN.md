# 小路游社区 - 前后端联调技术方案

**版本**: v1.0.0
**创建时间**: 2025-01-13
**作者**: 技术团队

---

## 📋 目录

1. [项目概述](#项目概述)
2. [当前状态分析](#当前状态分析)
3. [数据模型对齐](#数据模型对齐)
4. [API 接口对齐](#api-接口对齐)
5. [核心功能实现](#核心功能实现)
6. [开发任务分解](#开发任务分解)
7. [实施步骤](#实施步骤)
8. [测试方案](#测试方案)
9. [风险与应对](#风险与应对)

---

## 项目概述

### 技术栈

**后端 (Backend)**
- 语言: Go 1.21+
- 框架: Gin Web Framework
- 数据库: MySQL 8.0
- ORM: GORM
- 认证: JWT
- 部署: 阿里云 ECS (47.107.130.240)

**前端 (React Native)**
- 框架: React Native 0.73+
- 语言: TypeScript 5.0+
- 导航: React Navigation 6.x
- HTTP: Axios
- 状态管理: React Context + Hooks

### 项目目标

将 React Native 客户端与 Go 后端服务完全对接，实现：
1. ✅ 用户数据同步（Mock 用户→服务端）
2. ✅ 帖子数据同步（Mock 帖子→服务端）
3. ✅ 点赞功能实时交互
4. ✅ 评论功能实时交互
5. ✅ 发帖功能（文字、图片、视频、链接、投票）

---

## 当前状态分析

### 后端现状

| 模块 | 状态 | 说明 |
|-----|------|-----|
| 数据库设计 | ✅ 完成 | 8张表，完整的索引设计 |
| API 规范 | ✅ 完成 | 完整的 RESTful API 文档 |
| 路由注册 | ✅ 完成 | 所有路由已定义 |
| Handler 实现 | ⚠️ 部分完成 | 仅返回 Mock 数据，无实际业务逻辑 |
| 数据库连接 | ❌ 待实现 | 需配置 MySQL 连接 |
| JWT 认证 | ❌ 待实现 | 中间件未实现 |
| 文件上传 | ❌ 待实现 | 图片/视频上传逻辑 |

**关键文件位置**:
- 数据库初始化: `/backend/scripts/init_db.sql`
- API 文档: `/backend/docs/API.md`
- 路由定义: `/backend/cmd/server/main.go`

### 前端现状

| 模块 | 状态 | 说明 |
|-----|------|-----|
| UI 组件 | ✅ 完成 | 所有页面和组件已实现 |
| Mock 数据 | ✅ 完成 | 50+ 帖子，20+ 用户，Mock 评论 |
| API 客户端 | ⚠️ 部分完成 | Axios 已配置，端点定义不全 |
| 数据类型定义 | ⚠️ 部分完成 | 类型定义存在不一致 |
| 图片上传 | ❌ 待实现 | react-native-image-picker 未集成 |
| 视频上传 | ❌ 待实现 | 视频选择和上传功能 |
| 投票功能 | ❌ 待实现 | UI 和逻辑均未实现 |
| 实时刷新 | ❌ 待实现 | 发帖/点赞/评论后列表刷新 |

**关键文件位置**:
- API 客户端: `/src/api/`
- Mock 数据: `/src/screens/community/SubredditPage.tsx` (POSTS_DATA)
- 类型定义: `/src/types/`

---

## 数据模型对齐

### 核心数据模型映射

#### 1. 用户模型 (User)

**数据库字段 (Go Backend)**:
```go
type User struct {
    ID        uint      `gorm:"primaryKey"`
    UserID    string    `gorm:"uniqueIndex;size:32"`
    Phone     string    `gorm:"uniqueIndex;size:20"`
    Nickname  string    `gorm:"size:50"`
    Avatar    string    `gorm:"size:255"`
    Bio       string    `gorm:"type:text"`
    Gender    int8      `gorm:"default:0"` // 0-未知, 1-男, 2-女
    Birthday  time.Time
    Location  string    `gorm:"size:100"`
    Status    int8      `gorm:"default:1"` // 1-正常, 2-封禁
    CreatedAt time.Time
    UpdatedAt time.Time
}
```

**TypeScript 类型 (React Native)**:
```typescript
export interface User {
  user_id: string;        // ✅ 对齐
  phone?: string;         // ✅ 对齐
  nickname: string;       // ✅ 对齐
  avatar?: string;        // ✅ 对齐
  bio?: string;           // ✅ 对齐
  gender?: number;        // ✅ 对齐
  birthday?: string;      // ✅ 对齐 (ISO 8601)
  location?: string;      // ✅ 对齐
  created_at?: string;    // ✅ 对齐 (ISO 8601)
}
```

**Mock 数据示例**:
```typescript
const USER_NAMES = [
  '南京小王', '公交迷老李', '地铁通勤者', '南京通',
  '城市探索家', '交通观察员', '南京老司机', '公交达人'
];

const USER_AVATARS = [
  'https://images.unsplash.com/photo-1526876917250-9c7bcecd349f?w=200',
  'https://images.unsplash.com/photo-1672685667592-0392f458f46f?w=200',
  // ... 更多头像
];
```

#### 2. 帖子模型 (Post)

**数据库字段 (Go Backend)**:
```go
type Post struct {
    ID           uint      `gorm:"primaryKey"`
    PostID       string    `gorm:"uniqueIndex;size:32"`
    UserID       string    `gorm:"size:32;index"`
    Title        string    `gorm:"size:200"`
    Content      string    `gorm:"type:text"`
    Images       string    `gorm:"type:json"` // JSON 数组
    BusTag       string    `gorm:"size:50;index"`
    Location     string    `gorm:"size:100"`
    LikeCount    uint32    `gorm:"default:0"`
    CommentCount uint32    `gorm:"default:0"`
    ShareCount   uint32    `gorm:"default:0"`
    ViewCount    uint32    `gorm:"default:0"`
    Status       int8      `gorm:"default:1;index"`
    IsTop        int8      `gorm:"default:0"`
    CreatedAt    time.Time `gorm:"index"`
    UpdatedAt    time.Time
}
```

**TypeScript 类型 (React Native)**:
```typescript
export interface Post {
  post_id: string;          // ✅ 对齐
  user_id: string;          // ✅ 对齐
  username?: string;        // ⚠️ 需要 JOIN 用户表
  avatar?: string;          // ⚠️ 需要 JOIN 用户表
  title?: string;           // ✅ 对齐
  content?: string;         // ✅ 对齐
  image_urls?: string[];    // ⚠️ 后端是 JSON string，需解析
  bus_tag: string;          // ✅ 对齐
  location?: string;        // ✅ 对齐
  likes: number;            // ✅ 对齐 (like_count)
  comments: number;         // ✅ 对齐 (comment_count)
  timestamp: number;        // ⚠️ 需将 created_at 转换为时间戳
  isLiked?: boolean;        // ⚠️ 需查询 likes 表
  is_liked?: boolean;       // ⚠️ 需查询 likes 表
}
```

**Mock 数据示例**:
```typescript
const POSTS_DATA = [
  {
    id: 1,
    timeAgo: '1小时前',
    title: '📍【线路更新】1号线延伸段正式开通，新增5个站点！',
    imageUrl: 'https://images.unsplash.com/photo-1665809544649-c389c3209976?w=400',
    upvotes: 1245,
    comments: 87,
    flair: 's1路'
  },
  // ... 50个帖子
];
```

#### 3. 评论模型 (Comment)

**数据库字段 (Go Backend)**:
```go
type Comment struct {
    ID            uint      `gorm:"primaryKey"`
    CommentID     string    `gorm:"uniqueIndex;size:32"`
    PostID        string    `gorm:"size:32;index"`
    UserID        string    `gorm:"size:32;index"`
    ParentID      *string   `gorm:"size:32;index"` // NULL = 一级评论
    ReplyToUserID *string   `gorm:"size:32"`
    Content       string    `gorm:"type:text"`
    LikeCount     uint32    `gorm:"default:0"`
    ReplyCount    uint32    `gorm:"default:0"`
    Status        int8      `gorm:"default:1"`
    CreatedAt     time.Time
    UpdatedAt     time.Time
}
```

**TypeScript 类型 (React Native)**:
```typescript
export interface Comment {
  comment_id: string;       // ✅ 对齐
  post_id: string;          // ✅ 对齐
  user_id: string;          // ✅ 对齐
  username: string;         // ⚠️ 需要 JOIN 用户表
  avatar: string;           // ⚠️ 需要 JOIN 用户表
  content: string;          // ✅ 对齐
  timestamp: number;        // ⚠️ 需转换 created_at
  likes: number;            // ✅ 对齐 (like_count)
  isLiked?: boolean;        // ⚠️ 需查询 likes 表
  replies?: Comment[];      // ⚠️ 需递归查询子评论
  parent_id?: string | null;// ✅ 对齐
}
```

#### 4. 点赞模型 (Like)

**数据库字段 (Go Backend)**:
```go
type Like struct {
    ID         uint      `gorm:"primaryKey"`
    UserID     string    `gorm:"size:32"`
    TargetType int8      // 1-帖子, 2-评论
    TargetID   string    `gorm:"size:32"`
    CreatedAt  time.Time
}
```

**TypeScript 类型 (React Native)**:
```typescript
export interface LikePostRequest {
  postId: string;   // ✅ 对齐 (target_id, target_type=1)
  userId: string;   // ✅ 对齐
}
```

### 数据类型不一致问题

| 字段 | 前端 | 后端 | 解决方案 |
|-----|------|------|---------|
| 时间戳 | `number` (Unix timestamp) | `time.Time` (RFC3339) | 后端返回 ISO 8601 字符串，前端转换 |
| 图片数组 | `string[]` | `JSON string` | 后端解析 JSON，前端直接使用数组 |
| 用户信息 | `username`, `avatar` | 需 JOIN 查询 | 后端实现 JOIN，返回完整对象 |
| 点赞状态 | `isLiked: boolean` | 需查询 `likes` 表 | 后端根据 `user_id` 查询返回 |

---

## API 接口对齐

### 前端 API 端点配置

**当前配置** (`src/constants/api.ts`):
```typescript
export const API_BASE_URL = 'http://101.37.70.167:3000/api';

export const API_ENDPOINTS = {
  UPLOAD_IMAGE: '/upload-image',        // ❌ 不一致
  POSTS: '/posts',                      // ❌ 缺少 /v1
  POSTS_LIKE: '/posts/like',            // ❌ 不符合 RESTful
  POSTS_UNLIKE: '/posts/unlike',        // ❌ 不符合 RESTful
  AI_CHAT: '/ai/chat',                  // ❌ 缺少 /v1
  USER_SYNC: '/users/sync',             // ❌ 后端无此接口
};
```

**后端 API 规范**:
```
Base URL: http://47.107.130.240/api/v1
```

### 需要修改的接口

| 功能 | 前端当前 | 后端实际 | 需要修改 |
|-----|---------|---------|---------|
| 上传图片 | `POST /upload-image` | `POST /v1/upload/image` | ✅ 前端 |
| 获取帖子 | `GET /posts` | `GET /v1/posts` | ✅ 前端 |
| 点赞帖子 | `POST /posts/like` | `POST /v1/posts/:postId/like` | ✅ 前端 |
| 取消点赞 | `POST /posts/unlike` | `DELETE /v1/posts/:postId/like` | ✅ 前端 |
| AI 聊天 | `POST /ai/chat` | `POST /v1/ai/chat` | ✅ 前端 |

### 缺失的接口

| 功能 | HTTP Method | 后端端点 | 前端状态 |
|-----|------------|---------|---------|
| 获取评论 | GET | `/v1/posts/:postId/comments` | ❌ 未定义 |
| 发表评论 | POST | `/v1/posts/:postId/comments` | ❌ 未定义 |
| 删除评论 | DELETE | `/v1/comments/:commentId` | ❌ 未定义 |
| 上传视频 | POST | `/v1/upload/video` | ❌ 后端未实现 |
| 创建投票 | POST | `/v1/polls` | ❌ 后端未实现 |

---

## 核心功能实现

### 1. 用户数据同步

**目标**: 将现有 Mock 用户数据批量写入数据库

**实现步骤**:

#### 后端实现 (Go)

```go
// internal/handlers/user.go
package handlers

import (
    "github.com/gin-gonic/gin"
    "github.com/google/uuid"
    "golang.org/x/crypto/bcrypt"
)

// 批量创建用户 (仅用于初始化)
func BatchCreateUsersHandler(c *gin.Context) {
    var req struct {
        Users []struct {
            Nickname string `json:"nickname"`
            Avatar   string `json:"avatar"`
            Bio      string `json:"bio"`
            Location string `json:"location"`
        } `json:"users"`
    }

    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(400, gin.H{"code": 400, "message": "Invalid request"})
        return
    }

    var createdUsers []User
    for _, u := range req.Users {
        user := User{
            UserID:   uuid.New().String(),
            Nickname: u.Nickname,
            Avatar:   u.Avatar,
            Bio:      u.Bio,
            Location: u.Location,
            Status:   1,
        }

        if err := db.Create(&user).Error; err != nil {
            c.JSON(500, gin.H{"code": 500, "message": "Failed to create user"})
            return
        }
        createdUsers = append(createdUsers, user)
    }

    c.JSON(200, gin.H{
        "code":    200,
        "message": "Users created successfully",
        "data":    createdUsers,
    })
}
```

#### 前端实现 (TypeScript)

```typescript
// src/api/users.ts
export async function batchCreateUsers(users: {
  nickname: string;
  avatar: string;
  bio?: string;
  location?: string;
}[]): Promise<User[]> {
  const response = await apiClient.post('/v1/users/batch', { users });
  return response.data.data;
}

// src/scripts/syncMockData.ts
async function syncMockUsers() {
  const mockUsers = USER_NAMES.map((name, index) => ({
    nickname: name,
    avatar: USER_AVATARS[index % USER_AVATARS.length],
    bio: `这是${name}的个人简介`,
    location: '南京市',
  }));

  const createdUsers = await batchCreateUsers(mockUsers);
  console.log(`✅ Created ${createdUsers.length} users`);
  return createdUsers;
}
```

### 2. 帖子数据同步

**目标**: 将现有 50 个 Mock 帖子写入数据库

**实现步骤**:

#### 后端实现 (Go)

```go
// internal/handlers/post.go
func BatchCreatePostsHandler(c *gin.Context) {
    var req struct {
        Posts []struct {
            UserID  string   `json:"user_id"`
            Title   string   `json:"title"`
            Content string   `json:"content"`
            Images  []string `json:"images"`
            BusTag  string   `json:"bus_tag"`
        } `json:"posts"`
    }

    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(400, gin.H{"code": 400, "message": "Invalid request"})
        return
    }

    var createdPosts []Post
    for _, p := range req.Posts {
        imagesJSON, _ := json.Marshal(p.Images)

        post := Post{
            PostID:  uuid.New().String(),
            UserID:  p.UserID,
            Title:   p.Title,
            Content: p.Content,
            Images:  string(imagesJSON),
            BusTag:  p.BusTag,
            Status:  1,
        }

        if err := db.Create(&post).Error; err != nil {
            c.JSON(500, gin.H{"code": 500, "message": "Failed to create post"})
            return
        }
        createdPosts = append(createdPosts, post)
    }

    c.JSON(200, gin.H{
        "code":    200,
        "message": "Posts created successfully",
        "data":    createdPosts,
    })
}
```

#### 前端实现 (TypeScript)

```typescript
// src/api/posts.ts
export async function batchCreatePosts(posts: {
  user_id: string;
  title: string;
  content: string;
  images?: string[];
  bus_tag: string;
}[]): Promise<Post[]> {
  const response = await apiClient.post('/v1/posts/batch', { posts });
  return response.data.data;
}

// src/scripts/syncMockData.ts
async function syncMockPosts(users: User[]) {
  const mockPosts = POSTS_DATA.map((post, index) => ({
    user_id: users[index % users.length].user_id,
    title: post.title,
    content: post.title,
    images: post.imageUrl ? [post.imageUrl] : [],
    bus_tag: post.flair,
  }));

  const createdPosts = await batchCreatePosts(mockPosts);
  console.log(`✅ Created ${createdPosts.length} posts`);
  return createdPosts;
}
```

### 3. 点赞功能实时交互

**目标**: 点击点赞按钮立即同步到服务器

**实现步骤**:

#### 后端实现 (Go)

```go
// internal/handlers/like.go
func LikePostHandler(c *gin.Context) {
    postID := c.Param("postId")
    userID := c.GetString("user_id") // 从 JWT 中获取

    // 检查是否已点赞
    var existingLike Like
    if err := db.Where("user_id = ? AND target_type = 1 AND target_id = ?", userID, postID).
        First(&existingLike).Error; err == nil {
        c.JSON(400, gin.H{"code": 400, "message": "Already liked"})
        return
    }

    // 创建点赞记录
    like := Like{
        UserID:     userID,
        TargetType: 1, // 1-帖子
        TargetID:   postID,
    }

    if err := db.Create(&like).Error; err != nil {
        c.JSON(500, gin.H{"code": 500, "message": "Failed to like"})
        return
    }

    // 更新帖子点赞数
    db.Model(&Post{}).Where("post_id = ?", postID).
        UpdateColumn("like_count", gorm.Expr("like_count + 1"))

    // 获取最新点赞数
    var post Post
    db.Where("post_id = ?", postID).First(&post)

    c.JSON(200, gin.H{
        "code":    200,
        "message": "Liked successfully",
        "data":    gin.H{"like_count": post.LikeCount},
    })
}

func UnlikePostHandler(c *gin.Context) {
    postID := c.Param("postId")
    userID := c.GetString("user_id")

    // 删除点赞记录
    result := db.Where("user_id = ? AND target_type = 1 AND target_id = ?", userID, postID).
        Delete(&Like{})

    if result.RowsAffected == 0 {
        c.JSON(400, gin.H{"code": 400, "message": "Not liked yet"})
        return
    }

    // 更新帖子点赞数
    db.Model(&Post{}).Where("post_id = ?", postID).
        UpdateColumn("like_count", gorm.Expr("like_count - 1"))

    // 获取最新点赞数
    var post Post
    db.Where("post_id = ?", postID).First(&post)

    c.JSON(200, gin.H{
        "code":    200,
        "message": "Unliked successfully",
        "data":    gin.H{"like_count": post.LikeCount},
    })
}
```

#### 前端实现 (TypeScript)

```typescript
// src/api/posts.ts
export async function likePost(postId: string, userId: string): Promise<{ like_count: number }> {
  const response = await apiClient.post(`/v1/posts/${postId}/like`, { userId });
  return response.data.data;
}

export async function unlikePost(postId: string, userId: string): Promise<{ like_count: number }> {
  const response = await apiClient.delete(`/v1/posts/${postId}/like`, { data: { userId } });
  return response.data.data;
}

// src/components/posts/PostCard.tsx
const handleLike = async () => {
  try {
    if (isLiked) {
      const result = await unlikePost(postId, userId);
      setLikes(result.like_count);
      setIsLiked(false);
    } else {
      const result = await likePost(postId, userId);
      setLikes(result.like_count);
      setIsLiked(true);
    }
  } catch (error) {
    Alert.alert('错误', '操作失败，请重试');
  }
};
```

### 4. 评论功能实时交互

**目标**: 发表评论后立即显示，支持二级回复

**实现步骤**:

#### 后端实现 (Go)

```go
// internal/handlers/comment.go
func GetCommentsHandler(c *gin.Context) {
    postID := c.Param("postId")
    userID := c.Query("user_id") // 可选，用于判断点赞状态

    // 获取一级评论
    var comments []Comment
    db.Where("post_id = ? AND parent_id IS NULL AND status = 1", postID).
        Order("created_at DESC").
        Find(&comments)

    // 构建响应
    var result []gin.H
    for _, comment := range comments {
        // 获取评论者信息
        var user User
        db.Where("user_id = ?", comment.UserID).First(&user)

        // 获取回复
        var replies []Comment
        db.Where("parent_id = ? AND status = 1", comment.CommentID).
            Order("created_at ASC").
            Find(&replies)

        // 判断是否点赞
        isLiked := false
        if userID != "" {
            var like Like
            if err := db.Where("user_id = ? AND target_type = 2 AND target_id = ?",
                userID, comment.CommentID).First(&like).Error; err == nil {
                isLiked = true
            }
        }

        commentData := gin.H{
            "comment_id":  comment.CommentID,
            "post_id":     comment.PostID,
            "user_id":     comment.UserID,
            "user_nickname": user.Nickname,
            "user_avatar": user.Avatar,
            "content":     comment.Content,
            "like_count":  comment.LikeCount,
            "is_liked":    isLiked,
            "created_at":  comment.CreatedAt.Format(time.RFC3339),
            "replies":     []gin.H{},
        }

        // 处理回复
        for _, reply := range replies {
            var replyUser User
            db.Where("user_id = ?", reply.UserID).First(&replyUser)

            var replyToUser User
            if reply.ReplyToUserID != nil {
                db.Where("user_id = ?", *reply.ReplyToUserID).First(&replyToUser)
            }

            replyData := gin.H{
                "comment_id":        reply.CommentID,
                "parent_id":         reply.ParentID,
                "user_id":           reply.UserID,
                "user_nickname":     replyUser.Nickname,
                "user_avatar":       replyUser.Avatar,
                "reply_to_user_id":  reply.ReplyToUserID,
                "reply_to_nickname": replyToUser.Nickname,
                "content":           reply.Content,
                "like_count":        reply.LikeCount,
                "created_at":        reply.CreatedAt.Format(time.RFC3339),
            }

            commentData["replies"] = append(commentData["replies"].([]gin.H), replyData)
        }

        result = append(result, commentData)
    }

    c.JSON(200, gin.H{
        "code":    200,
        "message": "success",
        "data": gin.H{
            "comments": result,
        },
    })
}

func CreateCommentHandler(c *gin.Context) {
    postID := c.Param("postId")
    userID := c.GetString("user_id") // 从 JWT 获取

    var req struct {
        Content       string  `json:"content" binding:"required"`
        ParentID      *string `json:"parent_id"`
        ReplyToUserID *string `json:"reply_to_user_id"`
    }

    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(400, gin.H{"code": 400, "message": "Invalid request"})
        return
    }

    comment := Comment{
        CommentID:     uuid.New().String(),
        PostID:        postID,
        UserID:        userID,
        ParentID:      req.ParentID,
        ReplyToUserID: req.ReplyToUserID,
        Content:       req.Content,
        Status:        1,
    }

    if err := db.Create(&comment).Error; err != nil {
        c.JSON(500, gin.H{"code": 500, "message": "Failed to create comment"})
        return
    }

    // 更新帖子评论数
    db.Model(&Post{}).Where("post_id = ?", postID).
        UpdateColumn("comment_count", gorm.Expr("comment_count + 1"))

    // 如果是回复，更新父评论的回复数
    if req.ParentID != nil {
        db.Model(&Comment{}).Where("comment_id = ?", *req.ParentID).
            UpdateColumn("reply_count", gorm.Expr("reply_count + 1"))
    }

    c.JSON(200, gin.H{
        "code":    200,
        "message": "Comment created successfully",
        "data": gin.H{
            "comment_id": comment.CommentID,
            "created_at": comment.CreatedAt.Format(time.RFC3339),
        },
    })
}
```

#### 前端实现 (TypeScript)

```typescript
// src/api/comments.ts
export async function getComments(postId: string, userId?: string): Promise<Comment[]> {
  const params = userId ? { user_id: userId } : {};
  const response = await apiClient.get(`/v1/posts/${postId}/comments`, { params });
  return response.data.data.comments;
}

export async function createComment(
  postId: string,
  content: string,
  parentId?: string | null,
  replyToUserId?: string | null
): Promise<{ comment_id: string; created_at: string }> {
  const response = await apiClient.post(`/v1/posts/${postId}/comments`, {
    content,
    parent_id: parentId,
    reply_to_user_id: replyToUserId,
  });
  return response.data.data;
}

// src/screens/PostDetailScreen.tsx
const loadComments = async () => {
  try {
    const fetchedComments = await getComments(postId, userId);
    setComments(fetchedComments);
  } catch (error) {
    Alert.alert('错误', '加载评论失败');
  }
};

const handleSubmitComment = async (content: string) => {
  try {
    await createComment(
      postId,
      content,
      replyingTo?.comment_id || null,
      replyingTo?.user_id || null
    );

    // 刷新评论列表
    await loadComments();
    setReplyingTo(null);
  } catch (error) {
    Alert.alert('错误', '发表评论失败');
  }
};
```

### 5. 发帖功能（完整实现）

**目标**: 支持文字、图片、视频、链接、投票

#### 功能矩阵

| 内容类型 | 前端 UI | 后端 API | 数据库 | 优先级 |
|---------|--------|---------|--------|--------|
| 纯文字 | ✅ 已有 | ⚠️ 需完善 | ✅ 已有 | P0 |
| 图片（多图） | ⚠️ 需完善 | ⚠️ 需完善 | ✅ 已有 | P0 |
| 视频 | ❌ 待实现 | ❌ 待实现 | ❌ 需新增表 | P1 |
| 链接预览 | ❌ 待实现 | ❌ 待实现 | ❌ 需新增字段 | P2 |
| 投票 | ❌ 待实现 | ❌ 待实现 | ❌ 需新增表 | P2 |

#### 5.1 图片上传

**后端实现 (Go)**:

```go
// internal/handlers/upload.go
func UploadImagesHandler(c *gin.Context) {
    userID := c.GetString("user_id")

    // 解析 multipart form
    form, err := c.MultipartForm()
    if err != nil {
        c.JSON(400, gin.H{"code": 400, "message": "Invalid form data"})
        return
    }

    files := form.File["images"]
    if len(files) == 0 || len(files) > 9 {
        c.JSON(400, gin.H{"code": 400, "message": "Please upload 1-9 images"})
        return
    }

    var uploadedImages []gin.H
    for _, file := range files {
        // 验证文件类型
        if !isAllowedImageType(file.Filename) {
            continue
        }

        // 验证文件大小 (10MB)
        if file.Size > 10*1024*1024 {
            continue
        }

        // 生成唯一文件名
        imageID := uuid.New().String()
        ext := filepath.Ext(file.Filename)
        filename := imageID + ext

        // 保存路径
        datePath := time.Now().Format("2006/01/02")
        originalPath := filepath.Join("/var/www/deer_link/storage/uploads/images", datePath, filename)
        thumbnailPath := filepath.Join("/var/www/deer_link/storage/uploads/thumbnails", datePath, filename)

        // 创建目录
        os.MkdirAll(filepath.Dir(originalPath), 0755)
        os.MkdirAll(filepath.Dir(thumbnailPath), 0755)

        // 保存原图
        if err := c.SaveUploadedFile(file, originalPath); err != nil {
            continue
        }

        // 生成缩略图 (800x600)
        if err := createThumbnail(originalPath, thumbnailPath, 800, 600); err != nil {
            log.Printf("Failed to create thumbnail: %v", err)
        }

        // URL
        baseURL := "http://47.107.130.240/storage"
        originalURL := fmt.Sprintf("%s/images/%s/%s", baseURL, datePath, filename)
        thumbnailURL := fmt.Sprintf("%s/thumbnails/%s/%s", baseURL, datePath, filename)

        // 获取图片尺寸
        width, height := getImageDimensions(originalPath)

        // 保存到数据库
        image := Image{
            ImageID:      imageID,
            UserID:       userID,
            OriginalURL:  originalURL,
            ThumbnailURL: thumbnailURL,
            Filename:     filename,
            FileSize:     uint32(file.Size),
            MimeType:     file.Header.Get("Content-Type"),
            Width:        uint32(width),
            Height:       uint32(height),
            Status:       1,
        }
        db.Create(&image)

        uploadedImages = append(uploadedImages, gin.H{
            "image_id":      imageID,
            "original_url":  originalURL,
            "thumbnail_url": thumbnailURL,
            "width":         width,
            "height":        height,
        })
    }

    c.JSON(200, gin.H{
        "code":    200,
        "message": "Upload successful",
        "data": gin.H{
            "images": uploadedImages,
        },
    })
}

// 辅助函数：创建缩略图
func createThumbnail(srcPath, dstPath string, maxWidth, maxHeight int) error {
    img, err := imaging.Open(srcPath)
    if err != nil {
        return err
    }

    // 保持宽高比缩放
    thumbnail := imaging.Fit(img, maxWidth, maxHeight, imaging.Lanczos)

    return imaging.Save(thumbnail, dstPath)
}

// 辅助函数：检查文件类型
func isAllowedImageType(filename string) bool {
    ext := strings.ToLower(filepath.Ext(filename))
    allowedExts := []string{".jpg", ".jpeg", ".png", ".gif", ".webp"}
    for _, allowed := range allowedExts {
        if ext == allowed {
            return true
        }
    }
    return false
}

// 辅助函数：获取图片尺寸
func getImageDimensions(path string) (int, int) {
    img, err := imaging.Open(path)
    if err != nil {
        return 0, 0
    }
    bounds := img.Bounds()
    return bounds.Dx(), bounds.Dy()
}
```

**前端实现 (React Native)**:

```typescript
// src/api/upload.ts
import { launchImageLibrary } from 'react-native-image-picker';

export async function uploadImages(imageUris: string[]): Promise<string[]> {
  const formData = new FormData();

  imageUris.forEach((uri, index) => {
    formData.append('images', {
      uri,
      type: 'image/jpeg',
      name: `image_${index}.jpg`,
    } as any);
  });

  const response = await apiClient.post('/v1/upload/images', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data.data.images.map((img: any) => img.original_url);
}

// src/screens/CreatePostScreen.tsx
const handlePickImages = async () => {
  const result = await launchImageLibrary({
    mediaType: 'photo',
    selectionLimit: 9,
    quality: 0.8,
  });

  if (result.assets) {
    const uris = result.assets.map(asset => asset.uri!);
    setSelectedImages(uris);
  }
};

const handlePublishPost = async () => {
  try {
    setLoading(true);

    // 1. 上传图片
    let imageUrls: string[] = [];
    if (selectedImages.length > 0) {
      imageUrls = await uploadImages(selectedImages);
    }

    // 2. 创建帖子
    await createPost({
      title,
      content,
      imageUrls,
      busTag,
      userId,
      username: nickname,
      avatar,
    });

    Alert.alert('成功', '帖子发布成功');
    navigation.goBack();
  } catch (error) {
    Alert.alert('错误', '发布失败，请重试');
  } finally {
    setLoading(false);
  }
};
```

#### 5.2 视频上传 (P1)

**数据库设计**:

```sql
-- 新增视频表
CREATE TABLE IF NOT EXISTS videos (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    video_id VARCHAR(32) UNIQUE NOT NULL COMMENT '视频唯一ID',
    user_id VARCHAR(32) NOT NULL COMMENT '上传用户ID',
    original_url VARCHAR(255) NOT NULL COMMENT '原视频URL',
    thumbnail_url VARCHAR(255) COMMENT '视频封面URL',
    filename VARCHAR(255) NOT NULL COMMENT '文件名',
    file_size INT UNSIGNED NOT NULL COMMENT '文件大小',
    duration INT UNSIGNED COMMENT '视频时长(秒)',
    width INT UNSIGNED COMMENT '视频宽度',
    height INT UNSIGNED COMMENT '视频高度',
    status TINYINT DEFAULT 1 COMMENT '状态',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_video_id (video_id),
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='视频表';

-- 修改帖子表，添加视频字段
ALTER TABLE posts ADD COLUMN videos JSON COMMENT '视频URL数组';
```

**后端实现**:

```go
// internal/handlers/upload.go
func UploadVideoHandler(c *gin.Context) {
    // 与图片上传类似，限制大小为 100MB
    // 使用 FFmpeg 提取封面帧
    // 保存视频和封面到 storage/uploads/videos/
}
```

**前端实现**:

```typescript
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

const handlePickVideo = async () => {
  const result = await launchImageLibrary({
    mediaType: 'video',
    videoQuality: 'medium',
  });

  if (result.assets && result.assets[0]) {
    setSelectedVideo(result.assets[0].uri);
  }
};
```

#### 5.3 链接预览 (P2)

**数据库设计**:

```sql
-- 修改帖子表，添加链接字段
ALTER TABLE posts ADD COLUMN link_url VARCHAR(500) COMMENT '外部链接';
ALTER TABLE posts ADD COLUMN link_title VARCHAR(200) COMMENT '链接标题';
ALTER TABLE posts ADD COLUMN link_description TEXT COMMENT '链接描述';
ALTER TABLE posts ADD COLUMN link_image VARCHAR(255) COMMENT '链接预览图';
```

**后端实现**:

```go
// internal/handlers/link.go
func FetchLinkPreviewHandler(c *gin.Context) {
    var req struct {
        URL string `json:"url" binding:"required,url"`
    }

    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(400, gin.H{"code": 400, "message": "Invalid URL"})
        return
    }

    // 使用 goquery 解析网页
    doc, err := goquery.NewDocument(req.URL)
    if err != nil {
        c.JSON(400, gin.H{"code": 400, "message": "Failed to fetch URL"})
        return
    }

    // 提取 Open Graph 信息
    title := doc.Find("meta[property='og:title']").AttrOr("content", "")
    description := doc.Find("meta[property='og:description']").AttrOr("content", "")
    image := doc.Find("meta[property='og:image']").AttrOr("content", "")

    // 如果没有 OG 标签，使用 title 和 meta description
    if title == "" {
        title = doc.Find("title").Text()
    }
    if description == "" {
        description = doc.Find("meta[name='description']").AttrOr("content", "")
    }

    c.JSON(200, gin.H{
        "code":    200,
        "message": "success",
        "data": gin.H{
            "title":       title,
            "description": description,
            "image":       image,
            "url":         req.URL,
        },
    })
}
```

**前端实现**:

```typescript
// src/api/links.ts
export async function fetchLinkPreview(url: string) {
  const response = await apiClient.post('/v1/links/preview', { url });
  return response.data.data;
}

// src/components/posts/LinkInput.tsx
const handleUrlInput = async (url: string) => {
  if (!isValidUrl(url)) return;

  setLoading(true);
  try {
    const preview = await fetchLinkPreview(url);
    setLinkPreview(preview);
  } catch (error) {
    Alert.alert('提示', '无法获取链接预览');
  } finally {
    setLoading(false);
  }
};
```

#### 5.4 投票功能 (P2)

**数据库设计**:

```sql
-- 投票表
CREATE TABLE IF NOT EXISTS polls (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    poll_id VARCHAR(32) UNIQUE NOT NULL COMMENT '投票唯一ID',
    post_id VARCHAR(32) NOT NULL COMMENT '关联帖子ID',
    question VARCHAR(200) NOT NULL COMMENT '投票问题',
    poll_type TINYINT DEFAULT 1 COMMENT '投票类型: 1-单选, 2-多选',
    end_time TIMESTAMP COMMENT '结束时间',
    total_votes INT UNSIGNED DEFAULT 0 COMMENT '总投票数',
    status TINYINT DEFAULT 1 COMMENT '状态',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_poll_id (poll_id),
    INDEX idx_post_id (post_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='投票表';

-- 投票选项表
CREATE TABLE IF NOT EXISTS poll_options (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    option_id VARCHAR(32) UNIQUE NOT NULL COMMENT '选项唯一ID',
    poll_id VARCHAR(32) NOT NULL COMMENT '投票ID',
    option_text VARCHAR(200) NOT NULL COMMENT '选项文本',
    vote_count INT UNSIGNED DEFAULT 0 COMMENT '得票数',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_option_id (option_id),
    INDEX idx_poll_id (poll_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='投票选项表';

-- 用户投票记录表
CREATE TABLE IF NOT EXISTS poll_votes (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(32) NOT NULL COMMENT '用户ID',
    poll_id VARCHAR(32) NOT NULL COMMENT '投票ID',
    option_id VARCHAR(32) NOT NULL COMMENT '选项ID',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_user_poll_option (user_id, poll_id, option_id),
    INDEX idx_user_id (user_id),
    INDEX idx_poll_id (poll_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户投票记录表';
```

**后端实现**:

```go
// internal/handlers/poll.go
func CreatePollHandler(c *gin.Context) {
    var req struct {
        PostID   string   `json:"post_id" binding:"required"`
        Question string   `json:"question" binding:"required"`
        Options  []string `json:"options" binding:"required,min=2,max=10"`
        PollType int8     `json:"poll_type"` // 1-单选, 2-多选
        EndTime  *time.Time `json:"end_time"`
    }

    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(400, gin.H{"code": 400, "message": "Invalid request"})
        return
    }

    pollID := uuid.New().String()

    // 创建投票
    poll := Poll{
        PollID:   pollID,
        PostID:   req.PostID,
        Question: req.Question,
        PollType: req.PollType,
        EndTime:  req.EndTime,
        Status:   1,
    }

    if err := db.Create(&poll).Error; err != nil {
        c.JSON(500, gin.H{"code": 500, "message": "Failed to create poll"})
        return
    }

    // 创建选项
    for _, optionText := range req.Options {
        option := PollOption{
            OptionID:   uuid.New().String(),
            PollID:     pollID,
            OptionText: optionText,
        }
        db.Create(&option)
    }

    c.JSON(200, gin.H{
        "code":    200,
        "message": "Poll created successfully",
        "data":    gin.H{"poll_id": pollID},
    })
}

func VotePollHandler(c *gin.Context) {
    pollID := c.Param("pollId")
    userID := c.GetString("user_id")

    var req struct {
        OptionIDs []string `json:"option_ids" binding:"required"`
    }

    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(400, gin.H{"code": 400, "message": "Invalid request"})
        return
    }

    // 检查投票类型
    var poll Poll
    db.Where("poll_id = ?", pollID).First(&poll)

    if poll.PollType == 1 && len(req.OptionIDs) > 1 {
        c.JSON(400, gin.H{"code": 400, "message": "Single choice poll"})
        return
    }

    // 检查是否已投票
    var existingVote PollVote
    if err := db.Where("user_id = ? AND poll_id = ?", userID, pollID).
        First(&existingVote).Error; err == nil {
        c.JSON(400, gin.H{"code": 400, "message": "Already voted"})
        return
    }

    // 记录投票
    for _, optionID := range req.OptionIDs {
        vote := PollVote{
            UserID:   userID,
            PollID:   pollID,
            OptionID: optionID,
        }
        db.Create(&vote)

        // 更新选项得票数
        db.Model(&PollOption{}).Where("option_id = ?", optionID).
            UpdateColumn("vote_count", gorm.Expr("vote_count + 1"))
    }

    // 更新投票总数
    db.Model(&Poll{}).Where("poll_id = ?", pollID).
        UpdateColumn("total_votes", gorm.Expr("total_votes + 1"))

    c.JSON(200, gin.H{
        "code":    200,
        "message": "Voted successfully",
        "data":    nil,
    })
}
```

**前端实现**:

```typescript
// src/components/polls/PollCreator.tsx
interface PollOption {
  id: string;
  text: string;
}

function PollCreator({ onCreatePoll }: { onCreatePoll: (poll: any) => void }) {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState<PollOption[]>([
    { id: '1', text: '' },
    { id: '2', text: '' },
  ]);
  const [pollType, setPollType] = useState<1 | 2>(1); // 1-单选, 2-多选

  const addOption = () => {
    if (options.length >= 10) return;
    setOptions([...options, { id: Date.now().toString(), text: '' }]);
  };

  const handleCreate = () => {
    const validOptions = options.filter(opt => opt.text.trim() !== '');

    if (validOptions.length < 2) {
      Alert.alert('提示', '至少需要2个选项');
      return;
    }

    onCreatePoll({
      question,
      options: validOptions.map(opt => opt.text),
      poll_type: pollType,
    });
  };

  return (
    <View>
      <TextInput
        placeholder="输入投票问题"
        value={question}
        onChangeText={setQuestion}
      />

      <View>
        <TouchableOpacity onPress={() => setPollType(1)}>
          <Text>单选</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setPollType(2)}>
          <Text>多选</Text>
        </TouchableOpacity>
      </View>

      {options.map((option, index) => (
        <TextInput
          key={option.id}
          placeholder={`选项 ${index + 1}`}
          value={option.text}
          onChangeText={text => {
            const newOptions = [...options];
            newOptions[index].text = text;
            setOptions(newOptions);
          }}
        />
      ))}

      <TouchableOpacity onPress={addOption}>
        <Text>+ 添加选项</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleCreate}>
        <Text>创建投票</Text>
      </TouchableOpacity>
    </View>
  );
}

// src/components/polls/PollViewer.tsx
function PollViewer({ poll, onVote }: { poll: Poll; onVote: (optionIds: string[]) => void }) {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const handleSelectOption = (optionId: string) => {
    if (poll.poll_type === 1) {
      // 单选
      setSelectedOptions([optionId]);
    } else {
      // 多选
      if (selectedOptions.includes(optionId)) {
        setSelectedOptions(selectedOptions.filter(id => id !== optionId));
      } else {
        setSelectedOptions([...selectedOptions, optionId]);
      }
    }
  };

  const handleSubmitVote = () => {
    if (selectedOptions.length === 0) {
      Alert.alert('提示', '请选择至少一个选项');
      return;
    }
    onVote(selectedOptions);
  };

  return (
    <View>
      <Text>{poll.question}</Text>

      {poll.options.map(option => {
        const percentage = poll.total_votes > 0
          ? (option.vote_count / poll.total_votes) * 100
          : 0;

        return (
          <TouchableOpacity
            key={option.option_id}
            onPress={() => handleSelectOption(option.option_id)}
          >
            <View>
              <Text>{option.option_text}</Text>
              {poll.has_voted && (
                <>
                  <View style={{ width: `${percentage}%`, backgroundColor: '#4CAF50' }} />
                  <Text>{option.vote_count} 票 ({percentage.toFixed(1)}%)</Text>
                </>
              )}
              {!poll.has_voted && selectedOptions.includes(option.option_id) && (
                <Text>✓</Text>
              )}
            </View>
          </TouchableOpacity>
        );
      })}

      {!poll.has_voted && (
        <TouchableOpacity onPress={handleSubmitVote}>
          <Text>提交</Text>
        </TouchableOpacity>
      )}

      <Text>总投票数: {poll.total_votes}</Text>
    </View>
  );
}
```

---

## 开发任务分解

### Phase 1: 基础设施 (Week 1)

#### 后端任务

| 任务 | 负责人 | 工作量 | 优先级 | 状态 |
|-----|-------|--------|--------|------|
| MySQL 数据库部署和配置 | 后端 | 0.5天 | P0 | ⏳ |
| 数据库连接和 GORM 配置 | 后端 | 0.5天 | P0 | ⏳ |
| JWT 认证中间件实现 | 后端 | 1天 | P0 | ⏳ |
| CORS 中间件配置 | 后端 | 0.5天 | P0 | ⏳ |
| 用户模型和 Repository | 后端 | 1天 | P0 | ⏳ |
| 帖子模型和 Repository | 后端 | 1天 | P0 | ⏳ |
| 评论模型和 Repository | 后端 | 1天 | P0 | ⏳ |

#### 前端任务

| 任务 | 负责人 | 工作量 | 优先级 | 状态 |
|-----|-------|--------|--------|------|
| 修改 API Base URL 为服务器地址 | 前端 | 0.5天 | P0 | ⏳ |
| 统一 API 端点定义 (/v1 前缀) | 前端 | 0.5天 | P0 | ⏳ |
| 修复 Post 类型定义不一致 | 前端 | 1天 | P0 | ⏳ |
| 添加评论相关 API 客户端 | 前端 | 1天 | P0 | ⏳ |
| 实现 JWT Token 存储和刷新 | 前端 | 1天 | P0 | ⏳ |
| 添加全局错误处理 | 前端 | 1天 | P0 | ⏳ |

### Phase 2: 核心功能联调 (Week 2-3)

#### 后端任务

| 任务 | 负责人 | 工作量 | 优先级 | 状态 |
|-----|-------|--------|--------|------|
| 实现用户注册/登录 API | 后端 | 2天 | P0 | ⏳ |
| 实现获取帖子列表 API (含 JOIN) | 后端 | 2天 | P0 | ⏳ |
| 实现创建帖子 API | 后端 | 1天 | P0 | ⏳ |
| 实现点赞/取消点赞 API | 后端 | 1天 | P0 | ⏳ |
| 实现获取评论列表 API (含嵌套) | 后端 | 2天 | P0 | ⏳ |
| 实现发表评论 API | 后端 | 1天 | P0 | ⏳ |
| 批量导入用户接口 (临时) | 后端 | 1天 | P1 | ⏳ |
| 批量导入帖子接口 (临时) | 后端 | 1天 | P1 | ⏳ |

#### 前端任务

| 任务 | 负责人 | 工作量 | 优先级 | 状态 |
|-----|-------|--------|--------|------|
| 实现登录功能（使用真实 API） | 前端 | 1天 | P0 | ⏳ |
| 帖子列表对接真实 API | 前端 | 1天 | P0 | ⏳ |
| 帖子详情对接真实 API | 前端 | 1天 | P0 | ⏳ |
| 点赞功能对接真实 API | 前端 | 1天 | P0 | ⏳ |
| 评论列表对接真实 API | 前端 | 1天 | P0 | ⏳ |
| 发表评论对接真实 API | 前端 | 1天 | P0 | ⏳ |
| 编写数据同步脚本 (Mock→DB) | 前端 | 2天 | P1 | ⏳ |

### Phase 3: 文件上传 (Week 4)

#### 后端任务

| 任务 | 负责人 | 工作量 | 优先级 | 状态 |
|-----|-------|--------|--------|------|
| 实现单张图片上传 API | 后端 | 1天 | P0 | ⏳ |
| 实现多张图片上传 API | 后端 | 1天 | P0 | ⏳ |
| 实现图片压缩和缩略图生成 | 后端 | 2天 | P0 | ⏳ |
| 配置 Nginx 静态文件服务 | 后端 | 1天 | P0 | ⏳ |
| 实现视频上传 API | 后端 | 2天 | P1 | ⏳ |
| 实现视频封面提取 | 后端 | 1天 | P1 | ⏳ |

#### 前端任务

| 任务 | 负责人 | 工作量 | 优先级 | 状态 |
|-----|-------|--------|--------|------|
| 集成 react-native-image-picker | 前端 | 0.5天 | P0 | ⏳ |
| 实现图片选择和预览 | 前端 | 1天 | P0 | ⏳ |
| 实现多图上传进度显示 | 前端 | 1天 | P0 | ⏳ |
| 集成视频选择器 | 前端 | 1天 | P1 | ⏳ |
| 实现视频上传和进度显示 | 前端 | 1天 | P1 | ⏳ |

### Phase 4: 高级功能 (Week 5-6)

#### 后端任务

| 任务 | 负责人 | 工作量 | 优先级 | 状态 |
|-----|-------|--------|--------|------|
| 实现链接预览 API | 后端 | 2天 | P2 | ⏳ |
| 实现投票创建 API | 后端 | 2天 | P2 | ⏳ |
| 实现投票查询 API | 后端 | 1天 | P2 | ⏳ |
| 实现投票 API | 后端 | 1天 | P2 | ⏳ |
| 实现投票结果统计 | 后端 | 1天 | P2 | ⏳ |

#### 前端任务

| 任务 | 负责人 | 工作量 | 优先级 | 状态 |
|-----|-------|--------|--------|------|
| 实现链接输入和预览组件 | 前端 | 2天 | P2 | ⏳ |
| 实现投票创建组件 | 前端 | 2天 | P2 | ⏳ |
| 实现投票展示组件 | 前端 | 2天 | P2 | ⏳ |
| 实现投票交互逻辑 | 前端 | 1天 | P2 | ⏳ |

### Phase 5: 优化和测试 (Week 7)

| 任务 | 负责人 | 工作量 | 优先级 | 状态 |
|-----|-------|--------|--------|------|
| 添加 API 请求缓存 | 前端 | 1天 | P1 | ⏳ |
| 实现下拉刷新 | 前端 | 1天 | P1 | ⏳ |
| 实现上拉加载更多 | 前端 | 1天 | P1 | ⏳ |
| 添加乐观更新 (点赞/评论) | 前端 | 1天 | P1 | ⏳ |
| 后端 API 性能优化 | 后端 | 2天 | P1 | ⏳ |
| 编写集成测试 | 全栈 | 2天 | P1 | ⏳ |
| 编写 E2E 测试 | 全栈 | 2天 | P2 | ⏳ |

---

## 实施步骤

### Step 1: 环境准备

#### 1.1 后端环境

```bash
# SSH 登录服务器
ssh root@47.107.130.240

# 检查 MySQL 状态
systemctl status mysql

# 如果 MySQL 未安装
cd /path/to/backend/scripts
chmod +x install_mysql.sh
./install_mysql.sh

# 初始化数据库
mysql -u root -p < init_db.sql

# 创建配置文件
cp configs/config.yaml.example configs/config.yaml
vim configs/config.yaml
# 填入 MySQL 连接信息

# 构建应用
cd /path/to/backend
make build

# 启动服务
./deer_link_server
```

#### 1.2 前端环境

```bash
cd /Users/lihua/claude/LBS/deer_link

# 安装依赖
npm install
cd ios && pod install && cd ..

# 修改 API Base URL
vim src/constants/api.ts
# 改为: export const API_BASE_URL = 'http://47.107.130.240/api/v1';

# 运行应用
npm run ios
# 或
npm run android
```

### Step 2: 数据同步

#### 2.1 创建同步脚本

```typescript
// src/scripts/syncMockData.ts
import { batchCreateUsers, batchCreatePosts } from '@api';

async function main() {
  console.log('🚀 Starting data sync...\n');

  // 1. 同步用户
  console.log('📝 Syncing users...');
  const users = await syncMockUsers();
  console.log(`✅ Synced ${users.length} users\n`);

  // 2. 同步帖子
  console.log('📝 Syncing posts...');
  const posts = await syncMockPosts(users);
  console.log(`✅ Synced ${posts.length} posts\n`);

  console.log('🎉 Data sync completed!');
}

main().catch(console.error);
```

#### 2.2 执行同步

```bash
# 编译 TypeScript
npx tsc src/scripts/syncMockData.ts

# 执行同步脚本
node src/scripts/syncMockData.js
```

### Step 3: 功能联调

#### 3.1 测试点赞功能

**测试步骤**:
1. 打开 App，进入社区主页
2. 点击任意帖子的点赞按钮
3. 观察：
   - ✅ 点赞按钮变为已点赞状态（橙色）
   - ✅ 点赞数 +1
   - ✅ 刷新页面后点赞状态保持

**验证 API**:
```bash
# 点赞
curl -X POST http://47.107.130.240/api/v1/posts/test-post-1/like \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json"

# 取消点赞
curl -X DELETE http://47.107.130.240/api/v1/posts/test-post-1/like \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json"
```

#### 3.2 测试评论功能

**测试步骤**:
1. 点击进入帖子详情
2. 查看现有评论列表
3. 输入评论内容并发送
4. 观察：
   - ✅ 评论立即显示在列表顶部
   - ✅ 评论数 +1
   - ✅ 刷新页面后评论依然存在

**验证 API**:
```bash
# 获取评论
curl -X GET "http://47.107.130.240/api/v1/posts/test-post-1/comments?user_id=test-user-1" \
  -H "Authorization: Bearer YOUR_TOKEN"

# 发表评论
curl -X POST http://47.107.130.240/api/v1/posts/test-post-1/comments \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "这是一条测试评论",
    "parent_id": null,
    "reply_to_user_id": null
  }'
```

#### 3.3 测试发帖功能

**测试步骤**:
1. 点击"发帖"按钮
2. 输入标题和内容
3. 选择 1-3 张图片
4. 选择公交标签
5. 点击发布
6. 观察：
   - ✅ 图片上传进度显示
   - ✅ 发布成功提示
   - ✅ 返回列表后新帖子出现在顶部

**验证 API**:
```bash
# 上传图片
curl -X POST http://47.107.130.240/api/v1/upload/images \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "images=@/path/to/image1.jpg" \
  -F "images=@/path/to/image2.jpg"

# 创建帖子
curl -X POST http://47.107.130.240/api/v1/posts \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "测试帖子",
    "content": "这是一条测试帖子内容",
    "images": [
      "http://47.107.130.240/storage/images/2025/01/13/uuid1.jpg",
      "http://47.107.130.240/storage/images/2025/01/13/uuid2.jpg"
    ],
    "bus_tag": "33路"
  }'
```

### Step 4: 持续集成

#### 4.1 后端自动化部署

```bash
# 创建部署脚本
cat > /path/to/backend/deploy.sh << 'EOF'
#!/bin/bash
set -e

echo "🚀 Starting deployment..."

# 拉取最新代码
git pull origin main

# 构建
make build

# 停止旧服务
systemctl stop deer_link

# 启动新服务
systemctl start deer_link

# 检查状态
sleep 3
systemctl status deer_link

echo "✅ Deployment completed!"
EOF

chmod +x deploy.sh
```

#### 4.2 前端 OTA 更新

```bash
# 使用 CodePush (可选)
npm install -g code-push-cli

# 配置 CodePush
code-push app add deer-link-ios ios react-native
code-push app add deer-link-android android react-native

# 发布更新
code-push release-react deer-link-ios ios
code-push release-react deer-link-android android
```

---

## 测试方案

### 单元测试

#### 后端单元测试 (Go)

```go
// internal/handlers/post_test.go
package handlers

import (
    "bytes"
    "encoding/json"
    "net/http"
    "net/http/httptest"
    "testing"

    "github.com/gin-gonic/gin"
    "github.com/stretchr/testify/assert"
)

func TestCreatePostHandler(t *testing.T) {
    gin.SetMode(gin.TestMode)

    // 设置测试数据库
    setupTestDB()
    defer teardownTestDB()

    router := gin.New()
    router.POST("/posts", CreatePostHandler)

    postData := map[string]interface{}{
        "title":   "Test Post",
        "content": "This is a test post",
        "bus_tag": "33路",
        "images":  []string{},
    }

    body, _ := json.Marshal(postData)
    req, _ := http.NewRequest("POST", "/posts", bytes.NewBuffer(body))
    req.Header.Set("Content-Type", "application/json")
    req.Header.Set("Authorization", "Bearer test-token")

    w := httptest.NewRecorder()
    router.ServeHTTP(w, req)

    assert.Equal(t, 200, w.Code)

    var response map[string]interface{}
    json.Unmarshal(w.Body.Bytes(), &response)

    assert.Equal(t, float64(200), response["code"])
    assert.NotNil(t, response["data"])
}

func TestLikePostHandler(t *testing.T) {
    // 类似的测试逻辑
}
```

#### 前端单元测试 (TypeScript)

```typescript
// src/api/__tests__/posts.test.ts
import { likePost, unlikePost } from '../posts';
import { apiClient } from '../client';

jest.mock('../client');

describe('Posts API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should like a post successfully', async () => {
    const mockResponse = {
      data: {
        code: 200,
        data: { like_count: 10 },
      },
    };

    (apiClient.post as jest.Mock).mockResolvedValue(mockResponse);

    const result = await likePost('test-post-1', 'test-user-1');

    expect(result.like_count).toBe(10);
    expect(apiClient.post).toHaveBeenCalledWith(
      '/v1/posts/test-post-1/like',
      { userId: 'test-user-1' }
    );
  });

  it('should unlike a post successfully', async () => {
    const mockResponse = {
      data: {
        code: 200,
        data: { like_count: 9 },
      },
    };

    (apiClient.delete as jest.Mock).mockResolvedValue(mockResponse);

    const result = await unlikePost('test-post-1', 'test-user-1');

    expect(result.like_count).toBe(9);
  });
});
```

### 集成测试

```typescript
// tests/integration/post-flow.test.ts
describe('Post Flow Integration', () => {
  let testUser: User;
  let authToken: string;

  beforeAll(async () => {
    // 创建测试用户
    testUser = await createTestUser();
    authToken = await loginTestUser(testUser.phone, 'password');
  });

  afterAll(async () => {
    // 清理测试数据
    await deleteTestUser(testUser.user_id);
  });

  it('should complete full post lifecycle', async () => {
    // 1. 上传图片
    const images = await uploadTestImages(['/path/to/test1.jpg']);
    expect(images).toHaveLength(1);

    // 2. 创建帖子
    const post = await createPost({
      title: 'Integration Test Post',
      content: 'Testing post creation',
      imageUrls: images,
      busTag: '33路',
      userId: testUser.user_id,
      username: testUser.nickname,
      avatar: testUser.avatar,
    });
    expect(post.post_id).toBeDefined();

    // 3. 获取帖子列表
    const posts = await getPosts();
    const createdPost = posts.find(p => p.post_id === post.post_id);
    expect(createdPost).toBeDefined();

    // 4. 点赞帖子
    const likeResult = await likePost(post.post_id, testUser.user_id);
    expect(likeResult.like_count).toBeGreaterThan(0);

    // 5. 发表评论
    const comment = await createComment(post.post_id, 'Test comment', null, null);
    expect(comment.comment_id).toBeDefined();

    // 6. 获取评论列表
    const comments = await getComments(post.post_id, testUser.user_id);
    expect(comments).toHaveLength(1);

    // 7. 取消点赞
    const unlikeResult = await unlikePost(post.post_id, testUser.user_id);
    expect(unlikeResult.like_count).toBe(0);

    // 8. 删除帖子
    await deletePost(post.post_id);
  });
});
```

### E2E 测试 (Detox)

```typescript
// e2e/post-creation.e2e.ts
describe('Post Creation E2E', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should create a post with images', async () => {
    // 1. 登录
    await element(by.id('login-phone-input')).typeText('13800138000');
    await element(by.id('login-password-input')).typeText('password');
    await element(by.id('login-button')).tap();

    // 2. 进入社区
    await element(by.id('discover-tab')).tap();

    // 3. 点击发帖
    await element(by.id('create-post-button')).tap();

    // 4. 输入标题
    await element(by.id('post-title-input')).typeText('E2E Test Post');

    // 5. 输入内容
    await element(by.id('post-content-input')).typeText('This is an E2E test post');

    // 6. 选择图片
    await element(by.id('select-images-button')).tap();
    // 模拟图片选择...

    // 7. 发布
    await element(by.id('publish-post-button')).tap();

    // 8. 验证成功
    await expect(element(by.text('发布成功'))).toBeVisible();

    // 9. 返回列表
    await element(by.text('确定')).tap();

    // 10. 验证帖子出现在列表中
    await expect(element(by.text('E2E Test Post'))).toBeVisible();
  });
});
```

### 性能测试

```bash
# 使用 Apache Bench 进行压力测试
ab -n 1000 -c 10 -H "Authorization: Bearer test-token" \
  http://47.107.130.240/api/v1/posts

# 使用 wrk 进行更详细的性能测试
wrk -t4 -c100 -d30s --latency \
  -H "Authorization: Bearer test-token" \
  http://47.107.130.240/api/v1/posts
```

---

## 风险与应对

### 技术风险

| 风险 | 可能性 | 影响 | 应对措施 |
|-----|--------|------|---------|
| 数据库性能瓶颈 | 中 | 高 | 1. 添加索引优化<br>2. 实施查询缓存<br>3. 考虑读写分离 |
| 图片上传慢 | 高 | 中 | 1. 前端压缩图片<br>2. 使用 CDN<br>3. 实施分片上传 |
| JWT Token 泄露 | 低 | 高 | 1. 使用 HTTPS<br>2. 短期 Token + 刷新机制<br>3. 实施 IP 白名单 |
| 服务器内存不足 | 中 | 高 | 1. 优化查询减少内存占用<br>2. 实施限流<br>3. 考虑扩容 |
| API 响应慢 | 中 | 中 | 1. 添加缓存层<br>2. 优化数据库查询<br>3. 实施分页 |

### 数据风险

| 风险 | 可能性 | 影响 | 应对措施 |
|-----|--------|------|---------|
| 数据类型不匹配 | 高 | 中 | 1. 完善类型定义<br>2. 后端验证输入<br>3. 前端数据转换 |
| 用户数据丢失 | 低 | 高 | 1. 每日自动备份<br>2. 实施数据校验<br>3. 添加恢复机制 |
| Mock 数据重复导入 | 中 | 低 | 1. 添加幂等性检查<br>2. 使用唯一约束<br>3. 导入前清空测试数据 |

### 进度风险

| 风险 | 可能性 | 影响 | 应对措施 |
|-----|--------|------|---------|
| 后端开发延期 | 中 | 高 | 1. 前端使用 Mock Server<br>2. 调整优先级<br>3. 增加人力 |
| 前端集成困难 | 中 | 中 | 1. 提前对齐数据格式<br>2. 编写详细文档<br>3. 结对编程 |
| API 设计变更 | 低 | 中 | 1. 版本化 API<br>2. 向后兼容<br>3. 提前评审 |

---

## 附录

### A. API 端点速查表

| 功能 | Method | 端点 | 认证 | 状态 |
|-----|--------|-----|------|------|
| 注册 | POST | `/v1/auth/register` | ❌ | ⏳ |
| 登录 | POST | `/v1/auth/login` | ❌ | ⏳ |
| 刷新 Token | POST | `/v1/auth/refresh` | ✅ | ⏳ |
| 获取用户信息 | GET | `/v1/users/:userId` | ✅ | ⏳ |
| 更新用户信息 | PUT | `/v1/users/:userId` | ✅ | ⏳ |
| 获取帖子列表 | GET | `/v1/posts` | ✅ | ⏳ |
| 创建帖子 | POST | `/v1/posts` | ✅ | ⏳ |
| 获取帖子详情 | GET | `/v1/posts/:postId` | ✅ | ⏳ |
| 删除帖子 | DELETE | `/v1/posts/:postId` | ✅ | ⏳ |
| 点赞帖子 | POST | `/v1/posts/:postId/like` | ✅ | ⏳ |
| 取消点赞 | DELETE | `/v1/posts/:postId/like` | ✅ | ⏳ |
| 获取评论 | GET | `/v1/posts/:postId/comments` | ✅ | ⏳ |
| 发表评论 | POST | `/v1/posts/:postId/comments` | ✅ | ⏳ |
| 删除评论 | DELETE | `/v1/comments/:commentId` | ✅ | ⏳ |
| 上传图片 | POST | `/v1/upload/image` | ✅ | ⏳ |
| 批量上传图片 | POST | `/v1/upload/images` | ✅ | ⏳ |
| AI 聊天 | POST | `/v1/ai/chat` | ✅ | ⏳ |
| 健康检查 | GET | `/v1/health` | ❌ | ✅ |

### B. 数据库表速查

| 表名 | 记录数 | 主要字段 | 索引 |
|-----|--------|---------|------|
| users | 20+ | user_id, nickname, avatar | user_id, phone |
| posts | 50+ | post_id, user_id, title, content | post_id, user_id, bus_tag |
| comments | 100+ | comment_id, post_id, user_id, content | comment_id, post_id, parent_id |
| likes | 500+ | user_id, target_type, target_id | user+target unique |
| images | 100+ | image_id, user_id, original_url | image_id, user_id |
| polls | 0 | poll_id, post_id, question | poll_id, post_id |
| poll_options | 0 | option_id, poll_id, option_text | option_id, poll_id |
| poll_votes | 0 | user_id, poll_id, option_id | user+poll+option unique |

### C. 环境变量配置

**后端 (.env)**:
```bash
# 服务器配置
SERVER_PORT=8080
SERVER_MODE=release

# 数据库配置
DB_HOST=172.17.35.160
DB_PORT=3306
DB_USER=deer_link_user
DB_PASSWORD=your_secure_password
DB_NAME=deer_link_community
DB_CHARSET=utf8mb4
DB_MAX_IDLE_CONNS=10
DB_MAX_OPEN_CONNS=100

# JWT 配置
JWT_SECRET=your_jwt_secret_key_change_in_production
JWT_EXPIRE_HOURS=168

# 文件存储配置
STORAGE_PATH=/var/www/deer_link/storage/uploads
STORAGE_BASE_URL=http://47.107.130.240/storage
MAX_UPLOAD_SIZE=10485760

# AI 配置 (可选)
AI_API_KEY=your_openai_api_key
AI_MODEL=gpt-3.5-turbo
```

**前端 (.env)**:
```bash
API_BASE_URL=http://47.107.130.240/api/v1
ENVIRONMENT=production
```

### D. 常用命令

**后端**:
```bash
# 构建
make build

# 运行
make run

# 测试
make test

# 格式化
make fmt

# 部署
./deploy.sh

# 查看日志
journalctl -u deer_link -f

# 重启服务
systemctl restart deer_link
```

**前端**:
```bash
# 安装依赖
npm install

# iOS
npm run ios

# Android
npm run android

# 清理缓存
npm run clean

# 构建
npm run build

# 测试
npm test

# E2E 测试
npm run e2e
```

---

## 总结

本技术方案覆盖了从基础设施到高级功能的完整实施路径，包括：

✅ **明确的目标**: 实现前后端完全对接
✅ **详细的任务分解**: 7周开发计划，优先级清晰
✅ **完整的技术实现**: 代码示例覆盖所有核心功能
✅ **全面的测试方案**: 单元测试、集成测试、E2E 测试
✅ **风险管理**: 识别风险并提供应对措施

**关键成功因素**:
1. 严格遵循 API 规范，确保前后端数据格式一致
2. 优先实现 P0 功能（用户、帖子、点赞、评论）
3. 及时同步进度，快速解决集成问题
4. 充分测试，确保功能稳定性

**下一步行动**:
1. 后端团队：完成 MySQL 部署和数据库连接配置
2. 前端团队：修改 API Base URL 和端点定义
3. 全团队：执行 Mock 数据同步脚本
4. 开始 Phase 1 任务，每日站会同步进度

---

**文档版本**: v1.0.0
**最后更新**: 2025-01-13
**维护者**: 技术团队
