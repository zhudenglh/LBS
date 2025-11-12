# 部署总结 - 2025-11-12

## 部署成功信息

### 服务器信息
- **公网 IP**: 47.107.130.240
- **私网 IP**: 172.17.35.160
- **操作系统**: Alibaba Cloud Linux 3.2104 U12
- **配置**: 2 vCPU, 2 GiB RAM, 40 GiB ESSD

### 已部署的服务
| 服务 | 状态 | 端口 | 说明 |
|------|------|------|------|
| deer_link | ✅ Active | 8080 | Go 后端应用 |
| MySQL 8.0 | ✅ Active | 3306 | 数据库服务 |
| Nginx | ✅ Active | 80 | 反向代理 + 静态文件 |

### 访问地址
- **健康检查**: http://47.107.130.240/health
- **API 基础路径**: http://47.107.130.240/api/v1/
- **静态文件**: http://47.107.130.240/storage/

### 重要凭据
**⚠️ 请妥善保管以下信息**

密码文件位置: **服务器** `/root/.deer_link_passwords`

```
MySQL root 密码: [已保存]
应用数据库密码: [已保存]
JWT Secret: [已保存]
```

### 数据库信息
- **数据库名**: deer_link_community
- **用户名**: deer_link_user
- **字符集**: UTF8MB4
- **已创建的表**: 8 个
  - users (用户表)
  - posts (帖子表)
  - comments (评论表)
  - likes (点赞表)
  - favorites (收藏表)
  - follows (关注表)
  - images (图片表)
  - ai_chat_history (AI 对话历史表)

---

## 部署过程中遇到的问题及解决方案

### 问题 1: SSH 主机密钥变更
**现象**:
```
WARNING: REMOTE HOST IDENTIFICATION HAS CHANGED!
```

**解决方案**:
```bash
ssh-keygen -R 47.107.130.240
```

**已自动化**: ✅ 在 `deploy.sh` 脚本中提示用户

---

### 问题 2: MySQL 只安装了客户端，没有服务端
**现象**:
```bash
$ mysql --version  # 成功
$ systemctl status mysqld  # 失败: Unit not found
```

**原因**: Alibaba Cloud Linux 3 默认只安装 MySQL 客户端

**解决方案**:
```bash
dnf install -y https://dev.mysql.com/get/mysql80-community-release-el8-9.noarch.rpm
dnf module disable -y mysql
dnf install -y mysql-community-server
```

**已自动化**: ✅ `server_setup.sh` v2.0 自动检测并安装

---

### 问题 3: Nginx 被 dnf exclude 排除
**现象**:
```bash
$ dnf install nginx
Error: All matches were filtered out by exclude filtering
```

**原因**: `/etc/dnf/dnf.conf` 中配置了:
```
exclude=httpd nginx php mysql mairadb python-psutil python2-psutil
```

**解决方案**:
```bash
# 方法1: 修改配置文件
sed -i 's/exclude=httpd nginx php/exclude=httpd php/g' /etc/dnf/dnf.conf

# 方法2: 临时禁用排除
dnf install --disableexcludes=main -y nginx
```

**已自动化**: ✅ `server_setup.sh` v2.0 自动检测并修复

---

### 问题 4: SSH 连接超时（长时间运行任务）
**现象**:
```
Read from remote host: Operation timed out
client_loop: send disconnect: Broken pipe
```

**原因**: MySQL 安装和 Go 依赖下载时间较长

**解决方案**:
1. 配置 SSH 保持连接（本地 `~/.ssh/config`）:
```
Host 47.107.130.240
    ServerAliveInterval 60
    ServerAliveCountMax 3
```

2. 使用 tmux/screen:
```bash
tmux new -s deploy
# 运行脚本...
# Ctrl+B, D 断开
# tmux attach -t deploy 重新连接
```

**已改进**: ✅ 脚本输出更频繁的进度信息

---

### 问题 5: Go 模块下载缓慢
**现象**: go mod download 超时

**解决方案**: 使用国内代理
```bash
export GOPROXY=https://goproxy.cn,direct
```

**已自动化**: ✅ `server_setup.sh` v2.0 自动配置

---

### 问题 6: Nginx 配置冲突警告
**现象**:
```
nginx: [warn] conflicting server name "_" on 0.0.0.0:80, ignored
```

**解决方案**: 禁用默认配置
```bash
mv /etc/nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf.disabled
```

**已自动化**: ✅ `server_setup.sh` v2.0 自动处理

---

## 改进的脚本和文档

### 新增文件
1. **docs/DEPLOYMENT_ISSUES.md** - 完整的问题解决手册
   - 10个常见问题及详细解决方案
   - 完整部署检查清单
   - 快速故障排查命令

2. **scripts/server_setup.sh v2.0** - 问题修复版
   - 13个自动化步骤（原12个）
   - 新增环境检查步骤
   - 自动检测并解决 MySQL/Nginx 问题
   - 更详细的错误提示和日志

3. **docs/DEPLOYMENT_SUMMARY.md** - 本文档
   - 部署成功信息汇总
   - 问题及解决方案总结
   - 下次部署建议

### 更新的文件
1. **DEPLOY_ECS.md**
   - 添加常见问题章节
   - 引用详细问题文档
   - 更新脚本版本信息

2. **scripts/README.md**
   - 添加 `server_setup.sh` 说明
   - 更新部署流程

---

## 下次部署建议

### 在相同配置的新服务器上部署

**步骤 1: 本地上传代码**
```bash
cd /Users/lihua/claude/LBS/deer_link/backend
./scripts/deploy.sh
```

**步骤 2: 服务器一键部署**
```bash
ssh root@新服务器IP
cd /opt/deer_link/backend/scripts
chmod +x server_setup.sh
sudo ./server_setup.sh
```

✅ 所有问题已自动化处理，无需手动干预

### 在不同操作系统上部署

`server_setup.sh` v2.0 支持：
- ✅ Alibaba Cloud Linux 3
- ✅ CentOS 8+
- ⚠️  Ubuntu 20.04+ (可能需要微调)

### 部署前检查清单

- [ ] 服务器内存 ≥ 2GB
- [ ] 磁盘空间 ≥ 40GB（可用 ≥10GB）
- [ ] 安全组已开放 22 (SSH), 80 (HTTP) 端口
- [ ] 准备好 SSH 密钥或密码
- [ ] 确认服务器网络正常

### 常用管理命令

```bash
# 查看所有服务状态
systemctl status deer_link mysqld nginx

# 查看密码
ssh root@47.107.130.240 "cat /root/.deer_link_passwords"

# 查看日志
journalctl -u deer_link -f
tail -f /var/log/nginx/deer_link_error.log

# 重启服务
systemctl restart deer_link
systemctl restart nginx

# 测试访问
curl http://47.107.130.240/health
```

---

## 性能和监控建议

### 1. 设置监控

**磁盘使用监控**:
```bash
# 添加到 crontab，每天检查
0 0 * * * df -h | mail -s "Disk Usage" admin@example.com
```

**服务健康检查**:
```bash
# 每5分钟检查一次
*/5 * * * * curl -f http://localhost/health || systemctl restart deer_link
```

### 2. 日志轮转

配置 logrotate 防止日志文件过大:
```bash
cat > /etc/logrotate.d/deer_link <<EOF
/var/log/nginx/deer_link_*.log {
    daily
    rotate 30
    compress
    delaycompress
    missingok
    notifempty
    create 0640 nginx adm
}
EOF
```

### 3. 数据库优化

已配置自动备份（每天凌晨2点），备份保留策略：
- 每日备份: 7 天
- 每周备份: 30 天
- 每月备份: 90 天

### 4. 性能调优

**应用服务器**:
- 当前配置: 单进程运行
- 建议: 4GB 内存时可考虑多进程部署

**Nginx**:
- 已配置 keepalive 连接复用
- 已配置静态文件 30 天缓存

**MySQL**:
- 已针对 2GB 内存优化
- InnoDB buffer pool: 512MB

---

## 安全加固建议

### 1. SSH 安全

```bash
# 禁用密码登录，只允许密钥
vi /etc/ssh/sshd_config
# PasswordAuthentication no

# 修改 SSH 端口（可选）
# Port 2222
```

### 2. 配置 HTTPS

使用 Let's Encrypt 免费证书:
```bash
dnf install -y certbot python3-certbot-nginx
certbot --nginx -d yourdomain.com
```

### 3. 定期更新

```bash
# 每周检查安全更新
dnf upgrade-minimal --security
```

### 4. 数据库安全

- ✅ MySQL 只监听内网 IP
- ✅ 防火墙未开放 3306 端口
- ✅ 使用强密码
- ⚠️  建议定期更换密码

---

## 文档索引

| 文档 | 路径 | 用途 |
|------|------|------|
| 快速开始 | DEPLOY_ECS.md | 一键部署指南 |
| 常见问题 | docs/DEPLOYMENT_ISSUES.md | 问题排查手册 |
| 完整部署 | docs/DEPLOY.md | 详细部署文档 |
| API 文档 | docs/API.md | 接口说明 |
| 数据库文档 | docs/MYSQL_SETUP.md | MySQL 配置 |
| 存储文档 | docs/STORAGE_SETUP.md | 文件存储配置 |
| 脚本说明 | scripts/README.md | 脚本使用指南 |
| 本总结 | docs/DEPLOYMENT_SUMMARY.md | 部署总结 |

---

**总结编写时间**: 2025-11-12
**部署服务器**: 47.107.130.240 (Alibaba Cloud Linux 3)
**脚本版本**: server_setup.sh v2.0
**部署状态**: ✅ 成功
