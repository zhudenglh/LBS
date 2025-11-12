# 阿里云 ECS 部署指南

## 服务器信息

- **公网 IP**: 47.107.130.240
- **私网 IP**: 172.17.35.160
- **配置**: 2 vCPU, 2 GiB 内存, 40 GiB ESSD 云盘
- **操作系统**: CentOS 7.9 / Ubuntu 20.04
- **部署目录**: `/opt/deer_link/backend`

## 前置准备

### 1. 确保本地开发机可以 SSH 连接服务器

```bash
# 测试连接
ssh root@47.107.130.240

# 如果使用密钥登录
ssh -i ~/.ssh/your_key.pem root@47.107.130.240
```

### 2. 在服务器上安装必要软件

登录服务器后执行：

```bash
# 更新软件包
sudo yum update -y    # CentOS
# 或
sudo apt update && sudo apt upgrade -y  # Ubuntu

# 安装 Git
sudo yum install -y git  # CentOS
sudo apt install -y git  # Ubuntu

# 安装 Go 1.21+
cd /tmp
wget https://go.dev/dl/go1.21.6.linux-amd64.tar.gz
sudo rm -rf /usr/local/go
sudo tar -C /usr/local -xzf go1.21.6.linux-amd64.tar.gz

# 配置 Go 环境变量
echo 'export PATH=$PATH:/usr/local/go/bin' >> ~/.bashrc
echo 'export GOPATH=$HOME/go' >> ~/.bashrc
source ~/.bashrc

# 验证安装
go version
```

## 部署流程

### 方式一：使用 Git 部署（推荐）

#### 步骤 1: 在服务器上创建部署目录

```bash
# 登录服务器
ssh root@47.107.130.240

# 创建部署目录
sudo mkdir -p /opt/deer_link
cd /opt/deer_link

# 克隆代码（如果已有 Git 仓库）
# git clone https://github.com/your-repo/deer_link.git
# cd deer_link/backend

# 或者创建空目录等待上传
sudo mkdir -p backend
```

#### 步骤 2: 从本地上传代码到服务器

在**本地开发机**执行：

```bash
# 进入本地项目目录
cd /Users/lihua/claude/LBS/deer_link/backend

# 使用 rsync 上传代码（推荐，支持增量同步）
rsync -avz --progress \
  --exclude 'storage/' \
  --exclude 'build/' \
  --exclude '.git/' \
  --exclude 'node_modules/' \
  ./ root@47.107.130.240:/opt/deer_link/backend/

# 或使用 scp 上传（简单但不支持增量）
# scp -r ./* root@47.107.130.240:/opt/deer_link/backend/
```

**参数说明**:
- `-a`: 归档模式，保留权限
- `-v`: 显示详细信息
- `-z`: 压缩传输
- `--exclude`: 排除不需要上传的文件

#### 步骤 3: 在服务器上验证代码

```bash
# 登录服务器
ssh root@47.107.130.240

# 检查文件
cd /opt/deer_link/backend
ls -la

# 预期输出
# README.md  QUICKSTART.md  Makefile  go.mod  configs/  cmd/  scripts/  docs/  ...
```

### 方式二：使用部署脚本（自动化）

创建自动部署脚本在**本地**：

```bash
# 编辑 scripts/deploy.sh（已包含在项目中）
chmod +x /Users/lihua/claude/LBS/deer_link/backend/scripts/deploy.sh
```

执行部署：

```bash
cd /Users/lihua/claude/LBS/deer_link/backend
./scripts/deploy.sh
```

## 服务器端配置

### 1. 安装 MySQL

```bash
# 登录服务器
ssh root@47.107.130.240

# 进入脚本目录
cd /opt/deer_link/backend/scripts

# 添加执行权限
chmod +x install_mysql.sh

# 执行安装
sudo ./install_mysql.sh
```

按照提示输入：
1. MySQL root 密码
2. 应用数据库密码（记住此密码，后续配置需要）

### 2. 初始化数据库

```bash
cd /opt/deer_link/backend

# 初始化数据表
mysql -u deer_link_user -p deer_link_community < scripts/init_db.sql

# 验证表创建
mysql -u deer_link_user -p deer_link_community -e "SHOW TABLES;"
```

### 3. 创建存储目录

```bash
# 创建存储目录结构
sudo mkdir -p /var/www/deer_link/storage/uploads/{images,thumbnails}
sudo mkdir -p /var/www/deer_link/storage/backups/{daily,weekly,monthly}

# 设置权限
sudo chown -R www-data:www-data /var/www/deer_link/storage  # Ubuntu
# 或
sudo chown -R nginx:nginx /var/www/deer_link/storage        # CentOS

sudo chmod -R 755 /var/www/deer_link/storage

# 验证
ls -la /var/www/deer_link/
```

### 4. 配置应用

```bash
cd /opt/deer_link/backend/configs

# 编辑配置文件
vi config.yaml
```

**必须修改的配置**:

```yaml
database:
  host: 172.17.35.160         # 服务器内网IP
  password: YOUR_DB_PASSWORD  # ⚠️ 修改为第1步设置的数据库密码

jwt:
  secret: YOUR_JWT_SECRET     # ⚠️ 生成随机密钥（见下方）

storage:
  upload_path: /var/www/deer_link/storage/uploads  # 服务器路径
```

**生成 JWT Secret**:

```bash
# 在服务器上执行
openssl rand -base64 32

# 复制输出结果到 config.yaml 的 jwt.secret
```

### 5. 安装 Go 依赖并构建

```bash
cd /opt/deer_link/backend

# 下载依赖
go mod download
go mod tidy

# 构建应用
make build
# 或手动构建
go build -o build/deer_link_server cmd/server/main.go

# 验证构建
ls -lh build/deer_link_server
./build/deer_link_server --version
```

### 6. 配置 systemd 服务

创建服务文件：

```bash
sudo vi /etc/systemd/system/deer_link.service
```

内容：

```ini
[Unit]
Description=Deer Link Community Backend Service
After=network.target mysql.service
Wants=mysql.service

[Service]
Type=simple
User=root
Group=root
WorkingDirectory=/opt/deer_link/backend
ExecStart=/opt/deer_link/backend/build/deer_link_server
Restart=on-failure
RestartSec=5s
StandardOutput=journal
StandardError=journal

# 环境变量
Environment="GIN_MODE=release"

# 资源限制
LimitNOFILE=65536

[Install]
WantedBy=multi-user.target
```

启动服务：

```bash
# 重新加载 systemd
sudo systemctl daemon-reload

# 启动服务
sudo systemctl start deer_link

# 查看状态
sudo systemctl status deer_link

# 开机自启
sudo systemctl enable deer_link

# 查看日志
sudo journalctl -u deer_link -f
```

### 7. 安装和配置 Nginx

#### 安装 Nginx

```bash
# CentOS
sudo yum install -y nginx

# Ubuntu
sudo apt install -y nginx

# 启动 Nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

#### 配置 Nginx

```bash
# 创建配置文件
sudo vi /etc/nginx/conf.d/deer_link.conf  # CentOS
# 或
sudo vi /etc/nginx/sites-available/deer_link  # Ubuntu
```

配置内容：

```nginx
# 后端上游服务器
upstream deer_link_backend {
    server 127.0.0.1:8080;
    keepalive 32;
}

server {
    listen 80;
    server_name 47.107.130.240;

    # 日志配置
    access_log /var/log/nginx/deer_link_access.log;
    error_log /var/log/nginx/deer_link_error.log;

    # 客户端上传大小限制
    client_max_body_size 10M;
    client_body_buffer_size 128k;

    # 超时设置
    proxy_connect_timeout 600;
    proxy_send_timeout 600;
    proxy_read_timeout 600;
    send_timeout 600;

    # API 代理
    location /api/ {
        proxy_pass http://deer_link_backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # WebSocket 支持
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }

    # 静态文件服务
    location /storage/ {
        alias /var/www/deer_link/storage/uploads/;

        # 缓存控制
        expires 30d;
        add_header Cache-Control "public, immutable";

        # CORS 支持
        add_header Access-Control-Allow-Origin *;
        add_header Access-Control-Allow-Methods "GET, OPTIONS";

        # 安全头
        add_header X-Content-Type-Options nosniff;

        # 只允许 GET 请求
        limit_except GET {
            deny all;
        }

        # 关闭日志（可选）
        access_log off;

        # 关闭 Gzip（图片已压缩）
        gzip off;
    }

    # 健康检查
    location /health {
        proxy_pass http://deer_link_backend/api/v1/health;
        access_log off;
    }

    # 默认路由
    location / {
        return 200 "Deer Link Community API Server\n";
        add_header Content-Type text/plain;
    }
}
```

#### 启用 Nginx 配置

```bash
# Ubuntu - 创建软链接
sudo ln -s /etc/nginx/sites-available/deer_link /etc/nginx/sites-enabled/

# CentOS - 配置已自动生效（在 conf.d/ 目录）

# 测试配置
sudo nginx -t

# 重新加载 Nginx
sudo systemctl reload nginx
```

### 8. 配置防火墙

```bash
# CentOS 7 (firewalld)
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload

# Ubuntu (ufw)
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw reload

# 确保 MySQL 端口未对外开放
sudo firewall-cmd --list-all | grep 3306  # 应该没有输出
```

## 测试部署

### 1. 本地测试连接

```bash
# 健康检查
curl http://47.107.130.240/health

# 预期输出
{
  "status": "healthy",
  "timestamp": "2025-01-11T10:00:00Z",
  "version": "1.0.0"
}
```

### 2. 测试 API 接口

```bash
# 注册用户
curl -X POST http://47.107.130.240/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "13800138000",
    "nickname": "测试用户",
    "password": "password123"
  }'

# 获取帖子列表
curl http://47.107.130.240/api/v1/posts
```

### 3. 测试文件上传

```bash
# 上传测试图片
curl -X POST http://47.107.130.240/api/v1/upload/image \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "image=@/path/to/test.jpg"
```

## 更新代码

### 快速更新流程

在**本地开发机**执行：

```bash
# 1. 同步代码到服务器
cd /Users/lihua/claude/LBS/deer_link/backend
rsync -avz --progress \
  --exclude 'storage/' \
  --exclude 'build/' \
  ./ root@47.107.130.240:/opt/deer_link/backend/

# 2. SSH 到服务器重新构建
ssh root@47.107.130.240 << 'EOF'
cd /opt/deer_link/backend
make build
sudo systemctl restart deer_link
sudo systemctl status deer_link
EOF
```

### 使用部署脚本更新

创建自动化部署脚本：

```bash
# 本地执行
cd /Users/lihua/claude/LBS/deer_link/backend
./scripts/deploy.sh
```

## 监控和运维

### 查看日志

```bash
# 应用日志
sudo journalctl -u deer_link -f

# Nginx 访问日志
sudo tail -f /var/log/nginx/deer_link_access.log

# Nginx 错误日志
sudo tail -f /var/log/nginx/deer_link_error.log

# MySQL 错误日志
sudo tail -f /var/log/mysql/error.log
```

### 服务管理

```bash
# 重启服务
sudo systemctl restart deer_link

# 停止服务
sudo systemctl stop deer_link

# 查看状态
sudo systemctl status deer_link

# 重新加载配置（无需重启）
# 需要在代码中实现信号处理
sudo systemctl reload deer_link
```

### 性能监控

```bash
# 查看进程资源占用
ps aux | grep deer_link_server

# 查看内存使用
free -h

# 查看磁盘使用
df -h

# 查看 MySQL 连接数
mysql -u root -p -e "SHOW PROCESSLIST;"

# 查看端口监听
ss -tulpn | grep -E '(8080|3306|80)'
```

### 数据备份

```bash
# 手动备份
cd /opt/deer_link/backend/scripts
chmod +x backup.sh
sudo ./backup.sh

# 设置自动备份（crontab）
sudo crontab -e

# 添加以下行：
# 每天凌晨 2 点备份
0 2 * * * /opt/deer_link/backend/scripts/backup.sh >> /var/log/deer_link_backup.log 2>&1
```

## 故障排查

### 问题 1: 服务无法启动

```bash
# 查看服务状态
sudo systemctl status deer_link

# 查看详细日志
sudo journalctl -u deer_link -n 100

# 检查配置文件
cat /opt/deer_link/backend/configs/config.yaml

# 测试数据库连接
mysql -u deer_link_user -p -h 172.17.35.160 deer_link_community
```

### 问题 2: Nginx 502 错误

```bash
# 检查后端服务是否运行
sudo systemctl status deer_link

# 检查端口监听
ss -tulpn | grep 8080

# 查看 Nginx 错误日志
sudo tail -f /var/log/nginx/deer_link_error.log

# 测试后端直接访问
curl http://127.0.0.1:8080/api/v1/health
```

### 问题 3: 文件上传失败

```bash
# 检查存储目录权限
ls -la /var/www/deer_link/storage/

# 检查磁盘空间
df -h

# 检查 Nginx 配置
sudo nginx -t

# 查看 Nginx 错误日志
sudo tail -f /var/log/nginx/error.log
```

### 问题 4: 数据库连接失败

```bash
# 检查 MySQL 状态
sudo systemctl status mysqld  # CentOS
sudo systemctl status mysql   # Ubuntu

# 检查 MySQL 监听地址
sudo netstat -tulpn | grep 3306

# 测试连接
mysql -u deer_link_user -p -h 172.17.35.160 deer_link_community

# 查看 MySQL 错误日志
sudo tail -f /var/log/mysql/error.log
```

## 安全加固

### 1. 配置 SSH 密钥登录

```bash
# 在本地生成密钥（如果没有）
ssh-keygen -t rsa -b 4096

# 上传公钥到服务器
ssh-copy-id root@47.107.130.240

# 服务器上禁用密码登录
sudo vi /etc/ssh/sshd_config
# 修改: PasswordAuthentication no
sudo systemctl restart sshd
```

### 2. 配置 Fail2ban（防暴力破解）

```bash
# 安装 Fail2ban
sudo yum install -y fail2ban  # CentOS
sudo apt install -y fail2ban  # Ubuntu

# 启动服务
sudo systemctl start fail2ban
sudo systemctl enable fail2ban
```

### 3. 定期更新系统

```bash
# CentOS
sudo yum update -y

# Ubuntu
sudo apt update && sudo apt upgrade -y
```

## 性能优化

### 1. 启用 Gzip 压缩

在 Nginx 配置中添加：

```nginx
http {
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain application/json application/javascript text/css;
}
```

### 2. 优化 MySQL

参考 `docs/MYSQL_SETUP.md` 中的优化配置。

### 3. 配置日志轮转

```bash
sudo vi /etc/logrotate.d/deer_link
```

内容：

```
/var/log/nginx/deer_link_*.log {
    daily
    rotate 30
    compress
    delaycompress
    notifempty
    create 0640 nginx nginx
    sharedscripts
    postrotate
        systemctl reload nginx
    endscript
}
```

## 快速命令参考

```bash
# ===== 服务管理 =====
sudo systemctl start deer_link      # 启动
sudo systemctl stop deer_link       # 停止
sudo systemctl restart deer_link    # 重启
sudo systemctl status deer_link     # 状态
sudo journalctl -u deer_link -f     # 日志

# ===== Nginx 管理 =====
sudo systemctl reload nginx         # 重新加载配置
sudo nginx -t                       # 测试配置
sudo systemctl restart nginx        # 重启

# ===== 数据库管理 =====
sudo systemctl restart mysqld       # 重启 MySQL
mysql -u deer_link_user -p          # 登录数据库

# ===== 代码同步 =====
# 在本地执行
rsync -avz --progress --exclude 'storage/' --exclude 'build/' \
  /Users/lihua/claude/LBS/deer_link/backend/ \
  root@47.107.130.240:/opt/deer_link/backend/

# ===== 快速重新部署 =====
# 在服务器执行
cd /opt/deer_link/backend
git pull  # 如果使用 Git
make build
sudo systemctl restart deer_link
```

## 备份和恢复

### 完整备份

```bash
# 备份代码
tar -czf deer_link_code_$(date +%Y%m%d).tar.gz /opt/deer_link/backend

# 备份数据库
mysqldump -u deer_link_user -p deer_link_community > \
  /var/www/deer_link/storage/backups/db_backup_$(date +%Y%m%d).sql

# 备份文件
tar -czf deer_link_storage_$(date +%Y%m%d).tar.gz \
  /var/www/deer_link/storage/uploads/
```

### 恢复

```bash
# 恢复数据库
mysql -u deer_link_user -p deer_link_community < backup.sql

# 恢复文件
tar -xzf deer_link_storage_backup.tar.gz -C /
```

## 下一步

1. **完善代码**: 实现 `internal/` 和 `pkg/` 目录下的业务逻辑
2. **配置 HTTPS**: 使用 Let's Encrypt 申请免费 SSL 证书
3. **添加监控**: 配置 Prometheus + Grafana 监控系统
4. **配置 CDN**: 如预算允许，接入阿里云 CDN 加速静态资源

---

**编写时间**: 2025-01-11
**适用服务器**: 阿里云 ECS 47.107.130.240
