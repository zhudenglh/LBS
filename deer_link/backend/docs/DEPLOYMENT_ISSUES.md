# 部署问题总结与解决方案

本文档总结了在阿里云 ECS (Alibaba Cloud Linux 3) 上部署时遇到的所有问题和解决方案。

---

## 问题 1: SSH 主机密钥变更警告

### 现象

```
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@    WARNING: REMOTE HOST IDENTIFICATION HAS CHANGED!     @
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
IT IS POSSIBLE THAT SOMEONE IS DOING SOMETHING NASTY!
```

### 原因

服务器重装或更换后，SSH 密钥发生变化，但本地 `~/.ssh/known_hosts` 中仍保存着旧的密钥。

### 解决方案

```bash
# 方法1: 移除旧的主机密钥
ssh-keygen -R 47.107.130.240

# 方法2: 使用 StrictHostKeyChecking=accept-new 参数
ssh -o StrictHostKeyChecking=accept-new root@47.107.130.240
```

### 预防措施

在 `~/.ssh/config` 中添加配置：

```
Host 47.107.130.240
    StrictHostKeyChecking no
    UserKnownHostsFile=/dev/null
```

**⚠️ 注意**: 这会降低安全性，仅建议在开发环境使用。

---

## 问题 2: MySQL 客户端已安装但服务端不存在

### 现象

```bash
$ mysql --version
mysql  Ver 8.0.43 for Linux on x86_64 (Source distribution)

$ systemctl status mysqld
Unit mysqld.service could not be found.
```

### 原因

Alibaba Cloud Linux 3 默认只安装了 MySQL 客户端工具包，没有安装 MySQL Server。

### 解决方案

**步骤 1**: 添加 MySQL 官方 Yum 源

```bash
dnf install -y https://dev.mysql.com/get/mysql80-community-release-el8-9.noarch.rpm
```

**步骤 2**: 禁用默认 MySQL 模块（避免冲突）

```bash
dnf module disable -y mysql
```

**步骤 3**: 安装 MySQL Server

```bash
dnf install -y mysql-community-server
```

**步骤 4**: 启动服务

```bash
systemctl start mysqld
systemctl enable mysqld
```

**步骤 5**: 获取临时密码

```bash
grep 'temporary password' /var/log/mysqld.log | tail -1 | awk '{print $NF}'
```

### 验证

```bash
systemctl is-active mysqld
# 应输出: active
```

---

## 问题 3: Nginx 被 dnf 排除规则过滤

### 现象

```bash
$ dnf install -y nginx
Error: Unable to find a match: nginx
All matches were filtered out by exclude filtering for argument: nginx
```

### 原因

Alibaba Cloud Linux 3 的 `/etc/dnf/dnf.conf` 中默认排除了 nginx：

```ini
exclude=httpd nginx php mysql mairadb python-psutil python2-psutil
```

这是阿里云为了避免与自家服务（如函数计算、容器服务）冲突而设置的。

### 解决方案

**方法 1: 临时禁用排除规则（推荐）**

```bash
dnf install --disableexcludes=main -y nginx
```

**方法 2: 永久修改配置文件**

```bash
# 备份原配置
cp /etc/dnf/dnf.conf /etc/dnf/dnf.conf.bak

# 从 exclude 列表移除 nginx
sed -i 's/exclude=httpd nginx php/exclude=httpd php/g' /etc/dnf/dnf.conf

# 安装 Nginx
dnf install -y nginx
```

### 验证

```bash
nginx -v
# 应输出: nginx version: nginx/1.20.1
```

---

## 问题 4: Nginx 配置冲突警告

### 现象

```
nginx: [warn] conflicting server name "_" on 0.0.0.0:80, ignored
```

### 原因

Nginx 默认配置 `/etc/nginx/nginx.conf` 中已有一个 `server_name _`，与我们的配置冲突。

### 解决方案

**方法 1: 禁用默认配置**

```bash
mv /etc/nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf.disabled
```

**方法 2: 修改我们的配置使用具体域名**

```nginx
server {
    listen 80;
    server_name yourdomain.com;  # 替换 _ 为具体域名
    # ...
}
```

### 验证

```bash
nginx -t
# 应无警告
```

---

## 问题 5: Go 环境变量未生效

### 现象

```bash
$ go version
bash: go: command not found
```

即使已安装 Go 并配置了 `/etc/profile`。

### 原因

修改 `/etc/profile` 后需要重新加载，且对当前 SSH 会话可能不生效。

### 解决方案

**方法 1: 重新登录 SSH**

```bash
exit
ssh root@47.107.130.240
```

**方法 2: 手动 source**

```bash
source /etc/profile
source ~/.bashrc
```

**方法 3: 直接使用完整路径**

```bash
/usr/local/go/bin/go version
```

**方法 4: 在脚本中临时设置（推荐）**

```bash
export PATH=$PATH:/usr/local/go/bin
go version
```

---

## 问题 6: MySQL 连接超时导致 SSH 断开

### 现象

```
Read from remote host 47.107.130.240: Operation timed out
client_loop: send disconnect: Broken pipe
```

### 原因

长时间运行的命令（如 MySQL 安装、Go 依赖下载）可能导致 SSH 连接超时。

### 解决方案

**方法 1: 使用 tmux/screen（推荐）**

```bash
# 安装 tmux
dnf install -y tmux

# 创建会话
tmux new -s deploy

# 运行部署脚本
./scripts/server_setup.sh

# 断开连接: Ctrl+B, D
# 重新连接: tmux attach -t deploy
```

**方法 2: 配置 SSH 保持连接**

在本地 `~/.ssh/config` 添加：

```
Host 47.107.130.240
    ServerAliveInterval 60
    ServerAliveCountMax 3
```

**方法 3: 使用 nohup 后台运行**

```bash
nohup ./scripts/server_setup.sh > /tmp/deploy.log 2>&1 &
tail -f /tmp/deploy.log
```

---

## 问题 7: 防火墙未开放 HTTP 端口

### 现象

公网无法访问 `http://47.107.130.240/health`，但本地 `curl localhost/health` 正常。

### 原因

可能是阿里云安全组或服务器防火墙未开放 80 端口。

### 解决方案

**步骤 1: 检查阿里云安全组规则**

登录阿里云控制台 → ECS → 安全组 → 配置规则

添加入方向规则：
- 端口范围: 80/80
- 授权对象: 0.0.0.0/0
- 协议类型: TCP

**步骤 2: 检查服务器防火墙**

```bash
# 查看防火墙状态
firewall-cmd --state

# 开放 HTTP 端口
firewall-cmd --permanent --add-service=http
firewall-cmd --permanent --add-service=https
firewall-cmd --reload

# 验证
firewall-cmd --list-all
```

### 验证

```bash
# 从外网测试
curl http://47.107.130.240/health
```

---

## 问题 8: 数据库初始化 SQL 执行失败

### 现象

```
ERROR 1064 (42000): You have an error in your SQL syntax
```

### 原因

可能是 SQL 文件中存在不兼容的语法或字符编码问题。

### 解决方案

**步骤 1: 检查 SQL 文件编码**

```bash
file scripts/init_db.sql
# 应为: UTF-8 Unicode text
```

**步骤 2: 手动执行并查看错误**

```bash
mysql -u deer_link_user -p deer_link_community < scripts/init_db.sql
```

**步骤 3: 分段执行**

```bash
# 逐表执行
mysql -u deer_link_user -p deer_link_community -e "CREATE TABLE users (...);"
```

### 验证

```bash
mysql -u deer_link_user -p deer_link_community -e "SHOW TABLES;"
```

---

## 问题 9: Go 模块下载缓慢或失败

### 现象

```
go: downloading github.com/gin-gonic/gin v1.9.1
timeout: operation timed out
```

### 原因

国内访问 GitHub 等国外服务器较慢。

### 解决方案

**使用国内 Go 代理**

```bash
export GOPROXY=https://goproxy.cn,direct
export GO111MODULE=on

go mod download
```

**常用国内代理：**
- `https://goproxy.cn` (七牛云)
- `https://goproxy.io` (官方中国代理)
- `https://mirrors.aliyun.com/goproxy/` (阿里云)

### 验证

```bash
go env GOPROXY
# 应输出: https://goproxy.cn,direct
```

---

## 问题 10: 存储目录权限不足

### 现象

```
[ERROR] Failed to save file: permission denied
```

### 原因

应用运行用户（通常是 root）对存储目录没有写权限。

### 解决方案

```bash
# 创建存储目录
mkdir -p /var/www/deer_link/storage/uploads/{images,thumbnails}
mkdir -p /var/www/deer_link/storage/backups/{daily,weekly,monthly}

# 设置所有者和权限
chown -R root:root /var/www/deer_link/storage
chmod -R 755 /var/www/deer_link/storage

# 验证
ls -la /var/www/deer_link/storage/
```

---

## 完整部署检查清单

在新服务器上部署前，请确认以下事项：

### 服务器要求

- [ ] 操作系统: Alibaba Cloud Linux 3 / CentOS 8+ / Ubuntu 20.04+
- [ ] 内存: 至少 2GB
- [ ] 磁盘: 至少 40GB
- [ ] 网络: 公网 IP 可访问

### 网络配置

- [ ] SSH 22 端口可访问
- [ ] HTTP 80 端口已在安全组开放
- [ ] HTTPS 443 端口已在安全组开放（可选）
- [ ] 防火墙规则已配置

### 软件依赖

- [ ] Go 1.21+ 已安装或将自动安装
- [ ] MySQL 8.0 已安装或将自动安装
- [ ] Nginx 已安装或将自动安装
- [ ] rsync 已安装或将自动安装

### 配置文件

- [ ] 已准备 MySQL root 密码
- [ ] 已准备应用数据库密码
- [ ] 已生成 JWT Secret（或自动生成）
- [ ] 已更新 config.yaml 中的内网 IP

### 部署后验证

- [ ] 服务状态正常: `systemctl status deer_link`
- [ ] MySQL 运行: `systemctl status mysqld`
- [ ] Nginx 运行: `systemctl status nginx`
- [ ] 本地健康检查通过: `curl localhost/health`
- [ ] 公网访问正常: `curl http://公网IP/health`
- [ ] 数据库连接正常: `mysql -u deer_link_user -p`
- [ ] 日志无错误: `journalctl -u deer_link -n 50`

---

## 快速故障排查命令

```bash
# 1. 检查所有服务状态
systemctl status deer_link mysqld nginx

# 2. 检查端口监听
ss -tulpn | grep -E ":(80|8080|3306)"

# 3. 查看最近日志
journalctl -u deer_link -n 100 --no-pager
tail -n 100 /var/log/nginx/deer_link_error.log

# 4. 测试数据库连接
mysql -u deer_link_user -p -h 172.17.35.160 -e "SELECT 1;"

# 5. 测试后端服务
curl -v http://localhost:8080/api/v1/health

# 6. 测试 Nginx 代理
curl -v http://localhost/health

# 7. 检查配置文件
cat /opt/deer_link/backend/configs/config.yaml
nginx -t

# 8. 检查磁盘空间
df -h
du -sh /var/www/deer_link/storage/*

# 9. 检查内存使用
free -h
ps aux | grep -E "deer_link|mysql|nginx"

# 10. 查看进程
ps aux | grep deer_link_server
```

---

## 联系与支持

如遇到其他问题：
1. 查看应用日志: `journalctl -u deer_link -f`
2. 查看 Nginx 日志: `tail -f /var/log/nginx/deer_link_error.log`
3. 查看 MySQL 日志: `tail -f /var/log/mysqld.log`

**最后更新**: 2025-11-12
