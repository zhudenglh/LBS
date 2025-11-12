# 小路游社区后端服务 - 技术架构文档

## 项目概述

小路游（XiaoLuYou）社区后端服务，基于 Go 语言开发的高性能 RESTful API，为 React Native 移动应用提供社区功能支持。

**部署环境**:
- 阿里云 ECS: 47.107.130.240 (公网) / 172.17.35.160 (私有)
- 配置: 2 vCPU, 2 GiB 内存, 40 GiB ESSD 云盘
- 所有服务（应用、数据库、文件存储）均部署在单台服务器

## 技术选型

### 为什么选择 Go？

在 **Go vs Node.js** 的选择中，我们选择 Go 的关键理由：

| 对比维度 | Go | Node.js | 结论 |
|---------|-----|---------|------|
| **内存占用** | ~20-50MB (空载) | ~100-200MB (空载) | Go 优势明显，关键因素 |
| **并发模型** | Goroutine (轻量级) | Event Loop (单线程) | Go 更适合高并发 |
| **文件处理** | 原生高效 | 需额外库支持 | Go 处理图片上传更快 |
| **部署方式** | 单一二进制文件 | 需 Node.js 运行时 | Go 部署更简单 |
| **资源限制适应性** | 优秀 (2GB 内存足够) | 一般 (需更多内存) | Go 更适合资源受限环境 |
| **开发速度** | 中等 (强类型) | 快速 (动态类型) | Node.js 稍优 |
| **生态系统** | 成熟 (标准库强大) | 丰富 (npm 生态) | 各有优势 |
| **团队技术栈** | 新技术 | 与现有后端一致 | Node.js 更熟悉 |

**最终决策**: **Go** - 在 2GB 内存限制下，Go 的内存效率和并发性能是关键优势。

### 技术栈

- **Web 框架**: [Gin](https://gin-gonic.com/) - 高性能 HTTP 框架
- **数据库**: MySQL 8.0 - 关系型数据库
- **ORM**: [GORM](https://gorm.io/) - Go 标准 ORM 框架
- **认证**: JWT (JSON Web Token)
- **文件存储**: 本地文件系统 + Nginx 静态文件服务
- **图片处理**: [imaging](https://github.com/disintegration/imaging) - 图片压缩、缩略图生成
- **日志**: [zap](https://github.com/uber-go/zap) - 高性能结构化日志
- **配置管理**: [viper](https://github.com/spf13/viper) - 配置文件管理
- **进程管理**: systemd - Linux 系统服务管理

## 项目结构

```
backend/
├── cmd/
│   └── server/
│       └── main.go                 # 应用入口
├── internal/
│   ├── config/
│   │   └── config.go               # 配置加载
│   ├── models/
│   │   ├── user.go                 # 用户模型
│   │   ├── post.go                 # 帖子模型
│   │   ├── comment.go              # 评论模型
│   │   ├── like.go                 # 点赞模型
│   │   └── image.go                # 图片模型
│   ├── handlers/
│   │   ├── auth.go                 # 认证处理
│   │   ├── user.go                 # 用户处理
│   │   ├── post.go                 # 帖子处理
│   │   ├── comment.go              # 评论处理
│   │   ├── like.go                 # 点赞处理
│   │   └── upload.go               # 文件上传处理
│   ├── middleware/
│   │   ├── auth.go                 # JWT 认证中间件
│   │   ├── cors.go                 # CORS 中间件
│   │   ├── logger.go               # 日志中间件
│   │   └── rate_limit.go           # 限流中间件
│   ├── services/
│   │   ├── user.go                 # 用户业务逻辑
│   │   ├── post.go                 # 帖子业务逻辑
│   │   ├── image.go                # 图片处理逻辑
│   │   └── auth.go                 # 认证逻辑
│   ├── repository/
│   │   ├── user.go                 # 用户数据访问
│   │   ├── post.go                 # 帖子数据访问
│   │   └── comment.go              # 评论数据访问
│   └── database/
│       └── mysql.go                # 数据库连接
├── pkg/
│   ├── logger/
│   │   └── logger.go               # 日志工具
│   ├── response/
│   │   └── response.go             # 统一响应格式
│   └── utils/
│       ├── jwt.go                  # JWT 工具
│       ├── hash.go                 # 密码加密
│       └── file.go                 # 文件处理工具
├── configs/
│   ├── config.yaml                 # 主配置文件
│   └── config.prod.yaml            # 生产环境配置
├── scripts/
│   ├── install_mysql.sh            # MySQL 安装脚本
│   ├── init_db.sql                 # 数据库初始化 SQL
│   ├── deploy.sh                   # 部署脚本
│   └── backup.sh                   # 数据备份脚本
├── storage/
│   ├── uploads/                    # 上传文件存储
│   │   ├── images/                 # 原图
│   │   └── thumbnails/             # 缩略图
│   └── backups/                    # 数据库备份
├── docs/
│   ├── MYSQL_SETUP.md              # MySQL 安装指南
│   ├── STORAGE_SETUP.md            # 文件存储配置
│   ├── API.md                      # API 文档
│   └── DEPLOY.md                   # 部署指南
├── go.mod                          # Go 模块依赖
├── go.sum                          # 依赖版本锁定
├── Makefile                        # 构建脚本
└── README.md                       # 本文档
```

## 核心功能模块

### 1. 用户系统
- 用户注册/登录 (手机号 + 验证码 / 微信授权)
- 用户资料管理 (昵称、头像、简介)
- JWT Token 认证

### 2. 帖子系统
- 发布帖子 (文字 + 多图)
- 帖子列表 (分页、筛选)
- 帖子详情
- 删除帖子

### 3. 互动系统
- 点赞/取消点赞
- 评论/回复
- 评论点赞

### 4. 文件系统
- 图片上传 (支持多图)
- 图片压缩 (原图 + 缩略图)
- 图片 CDN 访问 (Nginx 静态服务)

### 5. AI 聊天
- 接入第三方 AI API (OpenAI/Azure/阿里云)
- 本地对话历史存储

## 数据库设计

### 核心表结构

```sql
-- 用户表
CREATE TABLE users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(32) UNIQUE NOT NULL COMMENT '用户唯一ID',
    phone VARCHAR(20) UNIQUE COMMENT '手机号',
    nickname VARCHAR(50) NOT NULL COMMENT '昵称',
    avatar VARCHAR(255) COMMENT '头像URL',
    bio TEXT COMMENT '个人简介',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_phone (phone)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 帖子表
CREATE TABLE posts (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    post_id VARCHAR(32) UNIQUE NOT NULL COMMENT '帖子唯一ID',
    user_id VARCHAR(32) NOT NULL COMMENT '作者ID',
    title VARCHAR(200) COMMENT '标题',
    content TEXT NOT NULL COMMENT '内容',
    images JSON COMMENT '图片URL数组',
    bus_tag VARCHAR(50) COMMENT '公交标签',
    like_count INT UNSIGNED DEFAULT 0 COMMENT '点赞数',
    comment_count INT UNSIGNED DEFAULT 0 COMMENT '评论数',
    view_count INT UNSIGNED DEFAULT 0 COMMENT '浏览数',
    status TINYINT DEFAULT 1 COMMENT '状态: 1-正常, 2-隐藏, 3-删除',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_post_id (post_id),
    INDEX idx_user_id (user_id),
    INDEX idx_created_at (created_at),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 点赞表
CREATE TABLE likes (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(32) NOT NULL COMMENT '用户ID',
    post_id VARCHAR(32) NOT NULL COMMENT '帖子ID',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_user_post (user_id, post_id),
    INDEX idx_post_id (post_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 评论表
CREATE TABLE comments (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    comment_id VARCHAR(32) UNIQUE NOT NULL COMMENT '评论唯一ID',
    post_id VARCHAR(32) NOT NULL COMMENT '帖子ID',
    user_id VARCHAR(32) NOT NULL COMMENT '评论者ID',
    parent_id VARCHAR(32) COMMENT '父评论ID (回复)',
    content TEXT NOT NULL COMMENT '评论内容',
    like_count INT UNSIGNED DEFAULT 0 COMMENT '点赞数',
    status TINYINT DEFAULT 1 COMMENT '状态',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_comment_id (comment_id),
    INDEX idx_post_id (post_id),
    INDEX idx_user_id (user_id),
    INDEX idx_parent_id (parent_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

## API 接口

详细 API 文档请查看: [docs/API.md](docs/API.md)

### 核心接口列表

```
# 认证
POST   /api/v1/auth/register          # 注册
POST   /api/v1/auth/login             # 登录
POST   /api/v1/auth/refresh           # 刷新 Token

# 用户
GET    /api/v1/users/:userId          # 获取用户信息
PUT    /api/v1/users/:userId          # 更新用户信息
GET    /api/v1/users/:userId/posts    # 获取用户帖子

# 帖子
GET    /api/v1/posts                  # 获取帖子列表
POST   /api/v1/posts                  # 创建帖子
GET    /api/v1/posts/:postId          # 获取帖子详情
DELETE /api/v1/posts/:postId          # 删除帖子

# 互动
POST   /api/v1/posts/:postId/like     # 点赞
DELETE /api/v1/posts/:postId/like     # 取消点赞
GET    /api/v1/posts/:postId/comments # 获取评论
POST   /api/v1/posts/:postId/comments # 发表评论

# 文件上传
POST   /api/v1/upload/image           # 上传图片
```

## 部署架构

```
┌──────────────────────────────────────────────────────────┐
│                    阿里云 ECS 服务器                       │
│                47.107.130.240 (2C2G)                      │
├──────────────────────────────────────────────────────────┤
│                                                            │
│  ┌────────────────┐      ┌──────────────────────┐        │
│  │  Nginx (80)    │      │  Go Backend (8080)   │        │
│  │  - 反向代理     │ ───> │  - Gin Framework     │        │
│  │  - 静态文件     │      │  - JWT Auth          │        │
│  └────────────────┘      │  - Business Logic    │        │
│                          └──────────────────────┘        │
│          │                        │                       │
│          │                        ▼                       │
│          │               ┌──────────────────────┐        │
│          │               │  MySQL 8.0 (3306)    │        │
│          │               │  - 社区数据           │        │
│          │               │  - InnoDB 引擎        │        │
│          │               └──────────────────────┘        │
│          │                                                │
│          ▼                                                │
│  ┌────────────────────────────────────┐                  │
│  │  Local File System                 │                  │
│  │  /var/www/deer_link/storage/       │                  │
│  │  ├── uploads/images/     (原图)     │                  │
│  │  └── uploads/thumbnails/ (缩略图)   │                  │
│  └────────────────────────────────────┘                  │
│                                                            │
└──────────────────────────────────────────────────────────┘
```

## 快速开始

### 前置要求

- Go 1.21+
- MySQL 8.0+
- Nginx
- Linux (CentOS 7+ / Ubuntu 20.04+)

### 1. 安装 MySQL

```bash
cd /Users/lihua/claude/LBS/deer_link/backend/scripts
chmod +x install_mysql.sh
sudo ./install_mysql.sh
```

详细步骤请参考: [docs/MYSQL_SETUP.md](docs/MYSQL_SETUP.md)

### 2. 配置文件存储

```bash
# 创建存储目录
sudo mkdir -p /var/www/deer_link/storage/{uploads/images,uploads/thumbnails,backups}
sudo chown -R www-data:www-data /var/www/deer_link/storage
sudo chmod -R 755 /var/www/deer_link/storage
```

详细配置请参考: [docs/STORAGE_SETUP.md](docs/STORAGE_SETUP.md)

### 3. 初始化数据库

```bash
mysql -u root -p < scripts/init_db.sql
```

### 4. 配置应用

编辑 `configs/config.yaml`:

```yaml
server:
  port: 8080
  mode: release  # debug, release

database:
  host: 172.17.35.160
  port: 3306
  user: deer_link_user
  password: YOUR_PASSWORD
  dbname: deer_link_community
  charset: utf8mb4
  max_idle_conns: 10
  max_open_conns: 100

storage:
  upload_path: /var/www/deer_link/storage/uploads
  max_size: 10485760  # 10MB
  allowed_types: [jpg, jpeg, png, gif]

jwt:
  secret: YOUR_SECRET_KEY
  expire_hours: 168  # 7天
```

### 5. 构建应用

```bash
# 安装依赖
go mod download

# 构建
make build

# 或手动构建
go build -o deer_link_server cmd/server/main.go
```

### 6. 运行应用

```bash
# 开发环境
make run

# 生产环境 (使用 systemd)
sudo systemctl start deer_link
sudo systemctl enable deer_link
```

### 7. 配置 Nginx

```nginx
# /etc/nginx/sites-available/deer_link
upstream deer_link_backend {
    server 127.0.0.1:8080;
}

server {
    listen 80;
    server_name 47.107.130.240;

    # API 代理
    location /api/ {
        proxy_pass http://deer_link_backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;

        # 文件上传大小限制
        client_max_body_size 10M;
    }

    # 静态文件服务
    location /storage/ {
        alias /var/www/deer_link/storage/uploads/;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
```

启用配置:

```bash
sudo ln -s /etc/nginx/sites-available/deer_link /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## 开发指南

### 本地开发

```bash
# 启动开发服务器
make dev

# 运行测试
make test

# 代码格式化
make fmt

# 代码检查
make lint
```

### 添加新接口

1. 在 `internal/models/` 定义数据模型
2. 在 `internal/handlers/` 添加处理函数
3. 在 `internal/services/` 添加业务逻辑
4. 在 `cmd/server/main.go` 注册路由
5. 更新 `docs/API.md` API 文档

## 运维管理

### 日志管理

```bash
# 查看应用日志
sudo journalctl -u deer_link -f

# 查看 Nginx 日志
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### 数据备份

```bash
# 自动备份 (每天凌晨 2 点)
# 添加到 crontab
0 2 * * * /path/to/backend/scripts/backup.sh

# 手动备份
./scripts/backup.sh
```

### 性能监控

```bash
# 内存使用
ps aux | grep deer_link_server

# 端口监听
ss -tulpn | grep 8080

# MySQL 连接数
mysql -u root -p -e "SHOW PROCESSLIST;"
```

## 安全建议

1. **数据库安全**
   - 使用强密码
   - 限制 MySQL 远程访问
   - 定期备份数据

2. **应用安全**
   - JWT Secret 定期更换
   - 实施 API 限流
   - 输入验证和过滤

3. **服务器安全**
   - 配置防火墙 (只开放 80, 443, 22)
   - 定期更新系统补丁
   - 使用 SSH 密钥认证

## 性能优化

1. **数据库优化**
   - 添加合适的索引
   - 使用连接池
   - 定期清理过期数据

2. **缓存策略**
   - 静态文件 CDN 缓存 (Nginx)
   - 热门帖子 Redis 缓存 (未来)

3. **资源限制**
   - 限制上传文件大小 (10MB)
   - API 请求频率限制
   - 图片自动压缩

## 故障排查

### 应用无法启动

```bash
# 检查端口占用
sudo lsof -i :8080

# 检查配置文件
cat configs/config.yaml

# 查看错误日志
sudo journalctl -u deer_link -n 50
```

### 数据库连接失败

```bash
# 检查 MySQL 状态
sudo systemctl status mysql

# 测试连接
mysql -h 172.17.35.160 -u deer_link_user -p

# 检查防火墙
sudo firewall-cmd --list-all
```

### 文件上传失败

```bash
# 检查目录权限
ls -la /var/www/deer_link/storage/uploads

# 检查磁盘空间
df -h

# 检查 Nginx 配置
sudo nginx -t
```

## 后续优化方向

1. **缓存层**: 引入 Redis 缓存热点数据
2. **消息队列**: 使用 RabbitMQ 处理异步任务
3. **CDN 加速**: 接入阿里云 CDN (如预算允许)
4. **监控告警**: Prometheus + Grafana 监控系统
5. **日志分析**: ELK Stack 日志聚合分析
6. **自动扩容**: 根据负载自动扩容 (需更大预算)

## 相关文档

- [MySQL 安装配置](docs/MYSQL_SETUP.md)
- [文件存储配置](docs/STORAGE_SETUP.md)
- [API 接口文档](docs/API.md)
- [部署操作指南](docs/DEPLOY.md)

## 技术支持

如有问题，请查看:
1. 相关文档目录 `docs/`
2. 脚本目录 `scripts/`
3. 配置文件 `configs/`

---

**版本**: v1.0.0
**更新时间**: 2025-01-11
**维护者**: 小路游技术团队
