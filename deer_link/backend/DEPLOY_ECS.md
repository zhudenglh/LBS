# 阿里云 ECS 快速部署指南

## 服务器信息

- **操作系统**: Alibaba Cloud Linux 3.2104 U12
- **公网 IP**: 47.107.130.240
- **私网 IP**: 172.17.35.160
- **配置**: 2 vCPU, 2 GiB 内存, 40 GiB ESSD 云盘

---

## 🚀 快速开始（一键部署） ⭐ 推荐

**适用场景**: 首次部署或完全重新部署

### 步骤1: 上传代码到服务器

在**本地 Mac** 执行：

```bash
cd /Users/lihua/claude/LBS/deer_link/backend
chmod +x scripts/deploy.sh
./scripts/deploy.sh
```

### 步骤2: 服务器一键部署

SSH 登录服务器后执行：

```bash
ssh root@47.107.130.240

cd /opt/deer_link/backend/scripts
chmod +x server_setup.sh
sudo ./server_setup.sh
```

**完成！** 脚本会自动完成所有13个部署步骤并处理常见问题：
- ✅ 环境检查（磁盘空间、网络连接）
- ✅ 安装 Go 1.21 和 MySQL 8.0
- ✅ **自动检测并解决 MySQL 只有客户端的问题**
- ✅ **自动修复 Nginx 被 dnf exclude 排除的问题**
- ✅ 配置数据库和初始化表结构
- ✅ 自动生成 JWT Secret
- ✅ 构建和部署应用（使用国内 Go 代理加速）
- ✅ 配置 Nginx 反向代理
- ✅ 配置防火墙和自动备份
- ✅ 测试健康检查（本地和公网）

部署完成后会显示所有重要信息（数据库密码、JWT Secret等），请妥善保管。

> 💡 **遇到问题？** 查看 [常见部署问题文档](docs/DEPLOYMENT_ISSUES.md) 获取详细解决方案

---

## 📖 手动逐步部署（可选）

**适用场景**: 需要自定义配置或调试部署过程

## 一、本地准备

### 1. 确保可以 SSH 连接服务器

```bash
# 测试连接
ssh root@47.107.130.240

# 如果需要配置密钥
ssh-keygen -t rsa -b 4096
ssh-copy-id root@47.107.130.240
```

### 2. 上传代码到服务器

在**本地开发机**执行：

```bash
cd /Users/lihua/claude/LBS/deer_link/backend

# 给部署脚本添加执行权限
chmod +x scripts/deploy.sh

# 执行自动部署
./scripts/deploy.sh
```

**部署脚本会自动**:
- 同步代码到服务器 `/opt/deer_link/backend/`
- 安装 Go 依赖
- 构建应用
- 重启服务

**首次部署**时，可能需要手动上传代码：

```bash
# 使用 rsync 上传（推荐）
rsync -avz --progress \
  --exclude 'storage/' \
  --exclude 'build/' \
  /Users/lihua/claude/LBS/deer_link/backend/ \
  root@47.107.130.240:/opt/deer_link/backend/

# 或使用 scp 上传
scp -r /Users/lihua/claude/LBS/deer_link/backend/* \
  root@47.107.130.240:/opt/deer_link/backend/
```

## 二、服务器端配置

SSH 登录服务器：

```bash
ssh root@47.107.130.240
```

### 1. 安装 Go

```bash
# 下载 Go 1.21.6
cd /tmp
wget https://go.dev/dl/go1.21.6.linux-amd64.tar.gz

# 安装
sudo rm -rf /usr/local/go
sudo tar -C /usr/local -xzf go1.21.6.linux-amd64.tar.gz

# 配置环境变量
echo 'export PATH=$PATH:/usr/local/go/bin' >> ~/.bashrc
echo 'export GOPATH=$HOME/go' >> ~/.bashrc
source ~/.bashrc

# 验证
go version
# 输出: go version go1.21.6 linux/amd64
```

### 2. 安装 MySQL

```bash
cd /opt/deer_link/backend/scripts

# 添加执行权限
chmod +x install_mysql.sh

# 执行安装（会自动检测 Alibaba Cloud Linux）
sudo ./install_mysql.sh
```

按照提示操作：
1. 输入 **MySQL root 密码**（记住此密码）
2. 输入 **应用数据库密码**（记住此密码，配置文件需要）
3. 等待安装完成

### 3. 初始化数据库

```bash
cd /opt/deer_link/backend

# 初始化数据表
mysql -u deer_link_user -p deer_link_community < scripts/init_db.sql
# 输入上一步设置的应用数据库密码

# 验证表创建
mysql -u deer_link_user -p deer_link_community -e "SHOW TABLES;"
```

### 4. 创建存储目录

```bash
# 创建目录结构
sudo mkdir -p /var/www/deer_link/storage/uploads/{images,thumbnails}
sudo mkdir -p /var/www/deer_link/storage/backups/{daily,weekly,monthly}

# 设置权限
sudo chown -R root:root /var/www/deer_link/storage
sudo chmod -R 755 /var/www/deer_link/storage

# 验证
ls -la /var/www/deer_link/storage/
```

### 5. 配置应用

```bash
cd /opt/deer_link/backend/configs

# 编辑配置文件
vi config.yaml
```

**必须修改**:

```yaml
database:
  host: 172.17.35.160         # 内网IP
  password: YOUR_DB_PASSWORD  # ⚠️ 改为步骤2设置的密码

jwt:
  secret: YOUR_JWT_SECRET     # ⚠️ 改为随机字符串（见下方）

storage:
  upload_path: /var/www/deer_link/storage/uploads
```

**生成 JWT Secret**:

```bash
# 在服务器执行
openssl rand -base64 32
# 复制输出结果到 config.yaml 的 jwt.secret
```

保存并退出（`:wq`）

### 6. 构建应用

```bash
cd /opt/deer_link/backend

# 下载依赖
go mod download
go mod tidy

# 构建
mkdir -p build
go build -o build/deer_link_server cmd/server/main.go

# 验证
ls -lh build/deer_link_server
./build/deer_link_server &
# 测试启动（Ctrl+C 停止）
```

### 7. 配置 systemd 服务

创建服务文件：

```bash
sudo vi /etc/systemd/system/deer_link.service
```

内容：

```ini
[Unit]
Description=Deer Link Community Backend Service
After=network.target mysqld.service
Wants=mysqld.service

[Service]
Type=simple
User=root
WorkingDirectory=/opt/deer_link/backend
ExecStart=/opt/deer_link/backend/build/deer_link_server
Restart=on-failure
RestartSec=5s
StandardOutput=journal
StandardError=journal

Environment="GIN_MODE=release"

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

# 设置开机自启
sudo systemctl enable deer_link

# 查看日志
sudo journalctl -u deer_link -f
# (Ctrl+C 退出)
```

### 8. 安装 Nginx

```bash
# 安装 Nginx
sudo dnf install -y nginx

# 启动 Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# 验证
curl http://localhost
```

创建配置：

```bash
sudo vi /etc/nginx/conf.d/deer_link.conf
```

内容：

```nginx
upstream deer_link_backend {
    server 127.0.0.1:8080;
    keepalive 32;
}

server {
    listen 80;
    server_name 47.107.130.240;

    access_log /var/log/nginx/deer_link_access.log;
    error_log /var/log/nginx/deer_link_error.log;

    client_max_body_size 10M;

    # API 代理
    location /api/ {
        proxy_pass http://deer_link_backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_http_version 1.1;
    }

    # 静态文件服务
    location /storage/ {
        alias /var/www/deer_link/storage/uploads/;
        expires 30d;
        add_header Cache-Control "public, immutable";
        add_header Access-Control-Allow-Origin *;
    }

    # 健康检查
    location /health {
        proxy_pass http://deer_link_backend/api/v1/health;
        access_log off;
    }
}
```

重启 Nginx：

```bash
# 测试配置
sudo nginx -t

# 重新加载
sudo systemctl reload nginx
```

### 9. 配置防火墙

```bash
# 开放 HTTP 端口
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload

# 确保 MySQL 未对外开放
sudo firewall-cmd --list-all | grep 3306
# 应该没有输出
```

## 三、测试部署

### 1. 测试健康检查

```bash
curl http://47.107.130.240/health
```

预期输出：

```json
{
  "status": "healthy",
  "timestamp": "2025-01-11T10:00:00Z",
  "version": "1.0.0"
}
```

### 2. 测试 API

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

## 四、配置自动备份

```bash
cd /opt/deer_link/backend/scripts

# 添加执行权限
chmod +x backup.sh

# 测试备份
sudo ./backup.sh

# 设置定时任务（每天凌晨2点自动备份）
sudo crontab -e
```

添加以下内容：

```
0 2 * * * /opt/deer_link/backend/scripts/backup.sh >> /var/log/deer_link_backup.log 2>&1
```

保存退出。

## 五、常用命令

### 服务管理

```bash
# 启动服务
sudo systemctl start deer_link

# 停止服务
sudo systemctl stop deer_link

# 重启服务
sudo systemctl restart deer_link

# 查看状态
sudo systemctl status deer_link

# 查看日志
sudo journalctl -u deer_link -f
```

### Nginx 管理

```bash
# 重新加载配置
sudo systemctl reload nginx

# 重启 Nginx
sudo systemctl restart nginx

# 测试配置
sudo nginx -t

# 查看错误日志
sudo tail -f /var/log/nginx/deer_link_error.log
```

### MySQL 管理

```bash
# 登录 MySQL
mysql -u deer_link_user -p deer_link_community

# 查看表
SHOW TABLES;

# 重启 MySQL
sudo systemctl restart mysqld
```

### 更新代码

在**本地**执行：

```bash
cd /Users/lihua/claude/LBS/deer_link/backend
./scripts/deploy.sh
```

或手动上传：

```bash
# 同步代码
rsync -avz --progress \
  --exclude 'storage/' --exclude 'build/' \
  /Users/lihua/claude/LBS/deer_link/backend/ \
  root@47.107.130.240:/opt/deer_link/backend/

# SSH 到服务器重新构建
ssh root@47.107.130.240 "cd /opt/deer_link/backend && make build && systemctl restart deer_link"
```

## 六、故障排查

### 服务无法启动

```bash
# 查看详细日志
sudo journalctl -u deer_link -n 100

# 检查配置文件
cat /opt/deer_link/backend/configs/config.yaml

# 测试数据库连接
mysql -u deer_link_user -p -h 172.17.35.160 deer_link_community
```

### Nginx 502 错误

```bash
# 检查后端服务
sudo systemctl status deer_link

# 检查端口监听
ss -tulpn | grep 8080

# 查看 Nginx 错误日志
sudo tail -f /var/log/nginx/deer_link_error.log
```

### 文件上传失败

```bash
# 检查目录权限
ls -la /var/www/deer_link/storage/

# 检查磁盘空间
df -h

# 修复权限
sudo chmod -R 755 /var/www/deer_link/storage/
```

## 七、监控和维护

### 资源监控

```bash
# 查看 CPU 和内存
top

# 查看进程
ps aux | grep deer_link

# 查看磁盘使用
df -h
du -sh /var/www/deer_link/storage/*

# 查看 MySQL 连接
mysql -u root -p -e "SHOW PROCESSLIST;"
```

### 日志管理

```bash
# 应用日志
sudo journalctl -u deer_link --since "1 hour ago"

# Nginx 日志
sudo tail -f /var/log/nginx/deer_link_access.log
sudo tail -f /var/log/nginx/deer_link_error.log

# MySQL 日志
sudo tail -f /var/log/mysqld.log
```

## 八、完整部署检查清单

- [ ] Go 1.21+ 已安装
- [ ] MySQL 8.0 已安装并运行
- [ ] 数据库表已初始化
- [ ] 存储目录已创建并设置权限
- [ ] config.yaml 已配置（数据库密码、JWT密钥）
- [ ] 应用已构建 (build/deer_link_server)
- [ ] systemd 服务已配置并运行
- [ ] Nginx 已安装并配置
- [ ] 防火墙规则已设置
- [ ] 健康检查接口可访问
- [ ] 自动备份已配置

## 九、快速命令参考

```bash
# ===== 一键部署（本地执行） =====
cd /Users/lihua/claude/LBS/deer_link/backend && ./scripts/deploy.sh

# ===== 服务器操作 =====
ssh root@47.107.130.240                    # 登录服务器
systemctl status deer_link                 # 查看服务状态
journalctl -u deer_link -f                 # 查看日志
systemctl restart deer_link                # 重启服务

# ===== 测试 =====
curl http://47.107.130.240/health          # 健康检查
curl http://47.107.130.240/api/v1/posts    # 测试API
```

## 十、常见部署问题

在部署过程中可能遇到以下问题，详细解决方案请参考 [DEPLOYMENT_ISSUES.md](docs/DEPLOYMENT_ISSUES.md)

### 1. SSH 主机密钥变更
```bash
# 快速修复
ssh-keygen -R 47.107.130.240
```

### 2. MySQL 只有客户端没有服务端
**现象**: `mysql --version` 可用，但 `systemctl status mysqld` 报错

**解决**: `server_setup.sh` v2.0 已自动检测并安装 MySQL Server

### 3. Nginx 被 dnf exclude 排除
**现象**: `dnf install nginx` 报错 "filtered out by exclude filtering"

**解决**: `server_setup.sh` v2.0 已自动修复此问题

### 4. 公网无法访问
**检查清单**:
- [ ] 阿里云安全组已开放 80 端口
- [ ] 服务器防火墙已允许 HTTP: `firewall-cmd --list-all`
- [ ] Nginx 正在运行: `systemctl status nginx`

### 5. Go 依赖下载慢
**解决**: 已配置国内代理 `GOPROXY=https://goproxy.cn,direct`

### 更多问题
查看完整文档: [docs/DEPLOYMENT_ISSUES.md](docs/DEPLOYMENT_ISSUES.md)

---

## 十一、获取帮助

- **常见问题文档**: `/opt/deer_link/backend/docs/DEPLOYMENT_ISSUES.md`
- **完整部署文档**: `/opt/deer_link/backend/docs/DEPLOY.md`
- **API 文档**: `/opt/deer_link/backend/docs/API.md`
- **数据库文档**: `/opt/deer_link/backend/docs/MYSQL_SETUP.md`

---

**编写时间**: 2025-01-12 (更新)
**适用服务器**: Alibaba Cloud Linux 3 @ 47.107.130.240
**脚本版本**: server_setup.sh v2.0 (问题修复版)
