# 快速开始指南

本指南将帮助您在 10 分钟内搭建并运行小路游社区后端服务。

## 前置条件

确保您的开发环境已安装:
- **Go 1.21+**: `go version`
- **MySQL 8.0+**: `mysql --version`
- **Git**: `git --version`
- **Make** (可选): `make --version`

## 步骤 1: 克隆项目

```bash
cd /Users/lihua/claude/LBS/deer_link
ls backend/  # 确认项目存在
```

## 步骤 2: 安装 MySQL

在云服务器 (47.107.130.240) 上执行:

```bash
cd /Users/lihua/claude/LBS/deer_link/backend/scripts
chmod +x install_mysql.sh
sudo ./install_mysql.sh
```

按照提示输入密码，脚本会自动:
- 安装 MySQL 8.0
- 创建数据库 `deer_link_community`
- 创建用户 `deer_link_user`
- 优化配置

详细步骤请查看: [docs/MYSQL_SETUP.md](docs/MYSQL_SETUP.md)

## 步骤 3: 初始化数据库

```bash
cd /Users/lihua/claude/LBS/deer_link/backend
mysql -u deer_link_user -p deer_link_community < scripts/init_db.sql
```

验证表创建:
```bash
mysql -u deer_link_user -p -e "USE deer_link_community; SHOW TABLES;"
```

预期输出:
```
+--------------------------------+
| Tables_in_deer_link_community |
+--------------------------------+
| users                          |
| posts                          |
| comments                       |
| likes                          |
| favorites                      |
| follows                        |
| images                         |
| ai_chat_history                |
+--------------------------------+
```

## 步骤 4: 配置应用

编辑 `configs/config.yaml`:

```yaml
database:
  host: 172.17.35.160         # 内网IP
  port: 3306
  user: deer_link_user
  password: YOUR_PASSWORD     # 修改为实际密码
  dbname: deer_link_community

jwt:
  secret: your-256-bit-secret-key-here-please-change  # 修改为随机字符串

storage:
  upload_path: /var/www/deer_link/storage/uploads
```

**生成 JWT Secret**:
```bash
openssl rand -base64 32
```

## 步骤 5: 创建存储目录

```bash
sudo mkdir -p /var/www/deer_link/storage/{uploads/images,uploads/thumbnails,backups}
sudo chown -R www-data:www-data /var/www/deer_link/storage
sudo chmod -R 755 /var/www/deer_link/storage
```

验证目录:
```bash
ls -la /var/www/deer_link/storage/
```

## 步骤 6: 安装 Go 依赖

```bash
cd /Users/lihua/claude/LBS/deer_link/backend
go mod download
go mod tidy
```

## 步骤 7: 构建应用

使用 Makefile:
```bash
make build
```

或手动构建:
```bash
go build -o build/deer_link_server cmd/server/main.go
```

## 步骤 8: 运行应用

### 开发模式

```bash
make run
# 或
go run cmd/server/main.go
```

### 生产模式

```bash
./build/deer_link_server
```

预期输出:
```
[GIN-debug] [WARNING] Running in "release" mode
[GIN-debug] GET    /api/v1/health           --> main.healthCheck
[GIN-debug] POST   /api/v1/auth/register    --> ...
[INFO] Server started on :8080
```

## 步骤 9: 测试接口

### 健康检查

```bash
curl http://localhost:8080/api/v1/health
```

预期响应:
```json
{
  "status": "healthy",
  "timestamp": "2025-01-11T10:00:00Z",
  "version": "1.0.0"
}
```

### 注册用户

```bash
curl -X POST http://localhost:8080/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "13800138000",
    "nickname": "测试用户",
    "password": "password123"
  }'
```

### 登录

```bash
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "13800138000",
    "password": "password123"
  }'
```

保存返回的 Token:
```json
{
  "code": 200,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user_id": "uuid-here"
  }
}
```

### 获取帖子列表

```bash
curl -X GET "http://localhost:8080/api/v1/posts?page=1&page_size=10" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 步骤 10: 配置 Nginx（可选，用于生产环境）

创建 Nginx 配置:

```bash
sudo vi /etc/nginx/sites-available/deer_link
```

配置内容:
```nginx
upstream deer_link_backend {
    server 127.0.0.1:8080;
}

server {
    listen 80;
    server_name 47.107.130.240;

    location /api/ {
        proxy_pass http://deer_link_backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        client_max_body_size 10M;
    }

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

## 步骤 11: 配置 systemd 服务（生产环境）

创建服务文件:
```bash
sudo vi /etc/systemd/system/deer_link.service
```

内容:
```ini
[Unit]
Description=Deer Link Community Backend Service
After=network.target mysql.service

[Service]
Type=simple
User=www-data
WorkingDirectory=/Users/lihua/claude/LBS/deer_link/backend
ExecStart=/Users/lihua/claude/LBS/deer_link/backend/build/deer_link_server
Restart=on-failure
RestartSec=5s

[Install]
WantedBy=multi-user.target
```

启动服务:
```bash
sudo systemctl daemon-reload
sudo systemctl start deer_link
sudo systemctl enable deer_link
sudo systemctl status deer_link
```

## 常用命令

### 开发

```bash
# 运行开发服务器（带热重载）
make dev

# 格式化代码
make fmt

# 运行测试
make test

# 代码检查
make lint
```

### 构建

```bash
# 开发构建
make build

# 生产构建
make build-prod
```

### 数据库

```bash
# 初始化数据库
make db-init

# 备份数据库
make db-backup
```

### 运维

```bash
# 查看日志
make logs
# 或
sudo journalctl -u deer_link -f

# 重启服务
sudo systemctl restart deer_link

# 查看状态
sudo systemctl status deer_link
```

## 故障排查

### 问题 1: 无法连接数据库

```bash
# 检查 MySQL 状态
sudo systemctl status mysqld  # CentOS
# 或
sudo systemctl status mysql   # Ubuntu

# 测试连接
mysql -u deer_link_user -p -h 172.17.35.160 deer_link_community

# 检查配置文件
cat configs/config.yaml | grep -A 10 "database"
```

### 问题 2: 端口被占用

```bash
# 查看端口占用
sudo lsof -i :8080

# 杀死进程
sudo kill -9 PID

# 或修改配置文件中的端口
vi configs/config.yaml  # 修改 server.port
```

### 问题 3: 文件上传失败

```bash
# 检查目录权限
ls -la /var/www/deer_link/storage/

# 修复权限
sudo chown -R www-data:www-data /var/www/deer_link/storage
sudo chmod -R 755 /var/www/deer_link/storage

# 检查磁盘空间
df -h
```

### 问题 4: Nginx 502 错误

```bash
# 检查后端服务是否运行
sudo systemctl status deer_link

# 检查 Nginx 配置
sudo nginx -t

# 查看 Nginx 错误日志
sudo tail -f /var/log/nginx/error.log

# 查看应用日志
sudo journalctl -u deer_link -n 50
```

## 下一步

1. **阅读 API 文档**: [docs/API.md](docs/API.md)
2. **配置文件存储**: [docs/STORAGE_SETUP.md](docs/STORAGE_SETUP.md)
3. **了解部署流程**: [docs/DEPLOY.md](docs/DEPLOY.md)
4. **开始开发**: 查看项目结构说明 [README.md](README.md)

## 开发工具推荐

### VS Code 扩展

- **Go**: 官方 Go 扩展
- **Rest Client**: 测试 API 接口
- **MySQL**: 数据库管理
- **GitLens**: Git 增强

### API 测试工具

- **Postman**: 导入 `postman_collection.json`
- **cURL**: 命令行测试
- **HTTPie**: 更友好的 HTTP 客户端

## 性能优化建议

1. **启用 Gzip 压缩** (Nginx)
2. **配置 Redis 缓存** (未来)
3. **优化 MySQL 索引**
4. **启用 CDN** (未来)

## 安全建议

1. **定期更新密码**
2. **配置防火墙规则**
3. **定期备份数据库**
4. **监控服务器资源**

## 获取帮助

- **技术文档**: `backend/docs/`
- **API 文档**: `backend/docs/API.md`
- **Issue 提交**: GitHub Issues

---

**编写时间**: 2025-01-11
**适用版本**: v1.0.0
