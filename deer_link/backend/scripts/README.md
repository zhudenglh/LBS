# 脚本使用说明

本目录包含所有部署和运维脚本。请注意**执行位置**（本地 vs 服务器）。

## 📍 脚本执行位置

| 脚本名称 | 执行位置 | 用途 | 说明 |
|---------|---------|------|------|
| **deploy.sh** | 🖥️ 本地 Mac | 自动部署 | 从本地上传代码到服务器并构建 |
| **server_setup.sh** | ☁️ 阿里云 ECS | 一键部署 | 服务器端全自动部署（首次部署推荐） |
| **install_mysql.sh** | ☁️ 阿里云 ECS | 安装 MySQL | 在服务器上安装和配置 MySQL 8.0 |
| **init_db.sql** | ☁️ 阿里云 ECS | 初始化数据库 | 创建数据表和测试数据 |
| **backup.sh** | ☁️ 阿里云 ECS | 数据库备份 | 备份数据库（可配置定时任务） |

## 一、本地执行的脚本

### 1. deploy.sh - 自动部署脚本

**执行位置**: 本地开发机 (Mac)

**前置条件**:
- 能够 SSH 连接到服务器
- 本地已有完整代码

**使用方法**:

```bash
# 进入项目目录
cd /Users/lihua/claude/LBS/deer_link/backend

# 添加执行权限（首次）
chmod +x scripts/deploy.sh

# 执行部署
./scripts/deploy.sh
```

**脚本功能**:
1. ✅ 检查 SSH 连接
2. ✅ 同步代码到服务器 `/opt/deer_link/backend/`
3. ✅ 在服务器上安装 Go 依赖
4. ✅ 在服务器上构建应用
5. ✅ 重启服务
6. ✅ 测试部署

**输出示例**:

```
=========================================
  小路游后端自动部署脚本
=========================================

确认部署到 47.107.130.240? (y/N) y
[INFO] 检查 SSH 连接...
[INFO] SSH 连接成功
[INFO] 同步代码到服务器...
[INFO] 代码同步完成
[INFO] 在服务器上构建应用...
[INFO] 构建完成
[INFO] 重启服务...
[INFO] 服务重启完成
[INFO] ✅ 健康检查通过
```

## 二、服务器执行的脚本

### 1. server_setup.sh - 一键部署脚本 ⭐ 推荐

**执行位置**: 阿里云 ECS 服务器

**前置条件**:
- 已通过 deploy.sh 上传代码到服务器 `/opt/deer_link/backend/`
- 或者通过 rsync/scp 手动上传代码

**使用方法**:

```bash
# 1. 登录服务器
ssh root@47.107.130.240

# 2. 进入项目目录
cd /opt/deer_link/backend/scripts

# 3. 添加执行权限
chmod +x server_setup.sh

# 4. 执行一键部署
sudo ./server_setup.sh
```

**脚本功能**（自动完成所有12个步骤）:

1. ✅ 安装基础工具（wget, curl, git, vim等）
2. ✅ 安装 Go 1.21.10
3. ✅ 安装 MySQL 8.0（调用 install_mysql.sh）
4. ✅ 配置数据库和初始化表（调用 init_db.sql）
5. ✅ 创建存储目录（/var/www/deer_link/storage）
6. ✅ 配置应用（自动更新 config.yaml 中的密码和 JWT Secret）
7. ✅ 构建应用（go build）
8. ✅ 配置 systemd 服务（deer_link.service）
9. ✅ 配置 Nginx（反向代理 + 静态文件服务）
10. ✅ 配置防火墙（开放 HTTP/HTTPS 端口）
11. ✅ 配置自动备份（crontab 定时任务）
12. ✅ 测试部署（健康检查）

**交互提示**:

```
小路游后端一键部署脚本
========================================

确认开始部署? (y/N) y

[STEP 1/12] 安装基础工具...
[STEP 2/12] 安装 Go 1.21...
[STEP 3/12] 安装 MySQL 8.0...
请输入 MySQL root 密码: ********
请输入应用数据库密码: ********
[STEP 4/12] 配置数据库...
请输入 deer_link_user 数据库密码: ********
...
[STEP 12/12] 测试部署...
✅ 健康检查通过

========================================
🎉 部署完成！
========================================

重要信息:
  - 数据库密码: ********
  - JWT Secret: ********
  - 配置文件: /opt/deer_link/backend/configs/config.yaml

⚠️  请妥善保管以上密码信息！
```

**优势**:
- 🚀 一键完成所有部署步骤，无需手动逐步操作
- 🔐 自动生成 JWT Secret（openssl rand -base64 32）
- 📝 自动更新配置文件（数据库密码、JWT密钥、内网IP）
- ✅ 自动测试部署（健康检查、端口监听）
- 📋 部署完成后显示所有重要信息

**适用场景**:
- ✅ 首次部署到新服务器
- ✅ 重新部署（会覆盖现有配置）
- ❌ 日常代码更新（请使用 deploy.sh）

### 2. install_mysql.sh - MySQL 安装脚本

**执行位置**: 阿里云 ECS 服务器

**使用方法**:

```bash
# 1. 登录服务器
ssh root@47.107.130.240

# 2. 进入脚本目录
cd /opt/deer_link/backend/scripts

# 3. 添加执行权限
chmod +x install_mysql.sh

# 4. 执行安装
sudo ./install_mysql.sh
```

**交互提示**:

```
MySQL 8.0 自动化安装脚本
========================================

[INFO] 检测到 Alibaba Cloud Linux 3 系统
[INFO] 开始安装 MySQL 8.0...
[INFO] 添加 MySQL 8.0 Yum 源...
[INFO] 安装 MySQL Server...
[INFO] 启动 MySQL 服务...
[INFO] MySQL 临时密码: kX5v&yT9mP#a
[WARN] 临时密码已保存到: /root/mysql_temp_password.txt

请输入 MySQL root 密码: ********
请输入应用数据库密码: ********
```

**重要**:
- 记住设置的密码，后续配置需要
- 临时密码保存在 `/root/mysql_temp_password.txt`

### 2. init_db.sql - 数据库初始化

**执行位置**: 阿里云 ECS 服务器

**使用方法**:

```bash
# 1. 登录服务器
ssh root@47.107.130.240

# 2. 执行初始化
cd /opt/deer_link/backend
mysql -u deer_link_user -p deer_link_community < scripts/init_db.sql

# 3. 输入密码（install_mysql.sh 步骤设置的应用数据库密码）

# 4. 验证表创建
mysql -u deer_link_user -p deer_link_community -e "SHOW TABLES;"
```

**预期输出**:

```
+--------------------------------+
| Tables_in_deer_link_community |
+--------------------------------+
| ai_chat_history                |
| comments                       |
| favorites                      |
| follows                        |
| images                         |
| likes                          |
| posts                          |
| users                          |
+--------------------------------+
```

### 3. backup.sh - 数据库备份脚本

**执行位置**: 阿里云 ECS 服务器

**手动执行**:

```bash
# 1. 登录服务器
ssh root@47.107.130.240

# 2. 执行备份
cd /opt/deer_link/backend/scripts
chmod +x backup.sh
sudo ./backup.sh
```

**配置定时任务**:

```bash
# 编辑 crontab
sudo crontab -e

# 添加以下行（每天凌晨2点自动备份）
0 2 * * * /opt/deer_link/backend/scripts/backup.sh >> /var/log/deer_link_backup.log 2>&1
```

**备份位置**:

```
/var/www/deer_link/storage/backups/
├── daily/      # 每日备份，保留 7 天
├── weekly/     # 每周备份，保留 30 天
└── monthly/    # 每月备份，保留 90 天
```

## 三、完整部署流程

### 方法一：一键部署 ⭐ 推荐

**适用场景**: 首次部署或完全重新部署

#### A. 在本地上传代码

```bash
# 上传代码到服务器
cd /Users/lihua/claude/LBS/deer_link/backend
./scripts/deploy.sh
```

#### B. 在服务器一键部署

```bash
# 登录服务器
ssh root@47.107.130.240

# 执行一键部署脚本
cd /opt/deer_link/backend/scripts
chmod +x server_setup.sh
sudo ./server_setup.sh
```

**完成！** 脚本会自动完成所有12个步骤，包括：
- 安装 Go 和 MySQL
- 配置数据库和应用
- 构建和部署服务
- 配置 Nginx 和防火墙
- 设置自动备份

---

### 方法二：手动逐步部署

**适用场景**: 需要自定义配置或调试

#### A. 在本地执行

```bash
# 1. 上传代码到服务器
cd /Users/lihua/claude/LBS/deer_link/backend
./scripts/deploy.sh
```

#### B. 在服务器执行

```bash
# 2. 登录服务器
ssh root@47.107.130.240

# 3. 安装 Go
cd /tmp
wget https://go.dev/dl/go1.21.6.linux-amd64.tar.gz
sudo tar -C /usr/local -xzf go1.21.6.linux-amd64.tar.gz
echo 'export PATH=$PATH:/usr/local/go/bin' >> ~/.bashrc
source ~/.bashrc
go version

# 4. 安装 MySQL
cd /opt/deer_link/backend/scripts
chmod +x install_mysql.sh
sudo ./install_mysql.sh

# 5. 初始化数据库
cd /opt/deer_link/backend
mysql -u deer_link_user -p deer_link_community < scripts/init_db.sql

# 6. 创建存储目录
sudo mkdir -p /var/www/deer_link/storage/uploads/{images,thumbnails}
sudo mkdir -p /var/www/deer_link/storage/backups/{daily,weekly,monthly}
sudo chmod -R 755 /var/www/deer_link/storage

# 7. 配置应用
vi /opt/deer_link/backend/configs/config.yaml
# 修改 database.password 和 jwt.secret

# 8. 构建应用
cd /opt/deer_link/backend
go mod download
go mod tidy
make build

# 9. 配置 systemd 服务
sudo vi /etc/systemd/system/deer_link.service
# 复制服务配置（见 DEPLOY_ECS.md）

sudo systemctl daemon-reload
sudo systemctl start deer_link
sudo systemctl enable deer_link

# 10. 安装 Nginx
sudo dnf install -y nginx
sudo vi /etc/nginx/conf.d/deer_link.conf
# 复制 Nginx 配置（见 DEPLOY_ECS.md）

sudo nginx -t
sudo systemctl start nginx
sudo systemctl enable nginx

# 11. 配置防火墙
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --reload

# 12. 配置自动备份
cd /opt/deer_link/backend/scripts
chmod +x backup.sh
sudo crontab -e
# 添加: 0 2 * * * /opt/deer_link/backend/scripts/backup.sh >> /var/log/deer_link_backup.log 2>&1
```

### 后续更新代码

#### 只需在本地执行：

```bash
cd /Users/lihua/claude/LBS/deer_link/backend
./scripts/deploy.sh
```

脚本会自动：
1. 上传最新代码
2. 重新构建
3. 重启服务

## 四、故障排查

### 部署脚本连接失败

```bash
# 检查 SSH 连接
ssh root@47.107.130.240

# 检查 SSH 密钥
ls ~/.ssh/
cat ~/.ssh/config

# 测试网络
ping 47.107.130.240
```

### MySQL 安装失败

```bash
# 查看日志
sudo tail -f /var/log/mysqld.log

# 检查服务状态
sudo systemctl status mysqld

# 重新安装
sudo dnf remove -y mysql-*
cd /opt/deer_link/backend/scripts
sudo ./install_mysql.sh
```

### 构建失败

```bash
# 检查 Go 版本
go version

# 清理并重新构建
cd /opt/deer_link/backend
rm -rf build/
go clean
make build

# 查看详细错误
go build -v -o build/deer_link_server cmd/server/main.go
```

## 五、常用命令参考

```bash
# ===== 本地操作 =====
cd /Users/lihua/claude/LBS/deer_link/backend
./scripts/deploy.sh                        # 一键部署

# ===== 服务器操作 =====
ssh root@47.107.130.240                    # 登录服务器

# 服务管理
systemctl status deer_link                 # 查看状态
systemctl restart deer_link                # 重启
journalctl -u deer_link -f                 # 查看日志

# 数据库
mysql -u deer_link_user -p                 # 登录 MySQL
systemctl status mysqld                    # 查看 MySQL 状态

# Nginx
systemctl reload nginx                     # 重新加载配置
nginx -t                                   # 测试配置
tail -f /var/log/nginx/deer_link_error.log # 查看错误日志

# 备份
cd /opt/deer_link/backend/scripts
./backup.sh                                # 手动备份
```

## 六、注意事项

### ⚠️ 安全提示

1. **不要将密码提交到 Git**
   - `config.yaml` 中的密码
   - MySQL root 密码

2. **定期更换密码**
   - MySQL 密码
   - JWT Secret

3. **备份密码和配置**
   - 将配置文件备份到安全位置
   - `/root/mysql_temp_password.txt` 需要备份

### ✅ 最佳实践

1. **使用 SSH 密钥**
   - 禁用密码登录
   - 使用强密钥

2. **定期备份**
   - 数据库每天自动备份
   - 定期下载备份到本地

3. **监控日志**
   - 定期查看应用日志
   - 设置告警机制

4. **测试后部署**
   - 本地测试通过后再部署
   - 使用版本控制（Git）

## 七、获取帮助

- **快速部署指南**: `../DEPLOY_ECS.md`
- **完整部署文档**: `../docs/DEPLOY.md`
- **API 文档**: `../docs/API.md`
- **技术架构**: `../README.md`

---

**更新时间**: 2025-01-11
**适用环境**: Alibaba Cloud Linux 3 @ 47.107.130.240
