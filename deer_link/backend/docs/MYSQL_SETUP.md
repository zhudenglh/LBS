# MySQL 8.0 安装配置指南

## 服务器信息

- **公网 IP**: 47.107.130.240
- **私网 IP**: 172.17.35.160
- **配置**: 2 vCPU, 2 GiB 内存, 40 GiB ESSD 云盘
- **系统**: CentOS 7.9 / Ubuntu 20.04

## 安装步骤

### 方式一: 使用自动化脚本（推荐）

```bash
# 下载并执行安装脚本
cd /Users/lihua/claude/LBS/deer_link/backend/scripts
chmod +x install_mysql.sh
sudo ./install_mysql.sh
```

### 方式二: 手动安装

#### 1. 检查系统版本

```bash
# CentOS
cat /etc/redhat-release

# Ubuntu
lsb_release -a
```

#### 2. 安装 MySQL 8.0

##### CentOS 7 安装步骤

```bash
# 1. 添加 MySQL 8.0 官方 Yum 源
sudo yum install -y https://dev.mysql.com/get/mysql80-community-release-el7-7.noarch.rpm

# 2. 安装 MySQL Server
sudo yum install -y mysql-community-server

# 3. 启动 MySQL 服务
sudo systemctl start mysqld
sudo systemctl enable mysqld

# 4. 查看服务状态
sudo systemctl status mysqld
```

##### Ubuntu 20.04 安装步骤

```bash
# 1. 更新软件包索引
sudo apt update

# 2. 安装 MySQL Server
sudo apt install -y mysql-server

# 3. 启动 MySQL 服务
sudo systemctl start mysql
sudo systemctl enable mysql

# 4. 查看服务状态
sudo systemctl status mysql
```

#### 3. 获取临时 root 密码（仅 CentOS）

```bash
# CentOS 会生成临时密码，查看日志获取
sudo grep 'temporary password' /var/log/mysqld.log
```

输出示例:
```
[Note] A temporary password is generated for root@localhost: kX5v&yT9mP#a
```

**注意**: Ubuntu 默认无密码，可以直接 `sudo mysql` 登录。

#### 4. MySQL 安全配置

```bash
# 运行安全配置向导
sudo mysql_secure_installation
```

配置选项:

```
# 1. 输入当前 root 密码 (CentOS 使用临时密码, Ubuntu 直接回车)

# 2. 设置新 root 密码
New password: YOUR_STRONG_PASSWORD
Re-enter new password: YOUR_STRONG_PASSWORD

# 3. 移除匿名用户？
Remove anonymous users? (Press y|Y for Yes, any other key for No) : y

# 4. 禁止 root 远程登录？(选择 No，因为我们需要内网访问)
Disallow root login remotely? (Press y|Y for Yes, any other key for No) : n

# 5. 移除测试数据库？
Remove test database and access to it? (Press y|Y for Yes, any other key for No) : y

# 6. 重新加载权限表？
Reload privilege tables now? (Press y|Y for Yes, any other key for No) : y
```

## 数据库配置

### 1. 登录 MySQL

```bash
mysql -u root -p
```

### 2. 创建应用数据库和用户

```sql
-- 创建数据库
CREATE DATABASE deer_link_community DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 创建应用用户（只允许本地连接）
CREATE USER 'deer_link_user'@'localhost' IDENTIFIED BY 'YOUR_STRONG_PASSWORD_HERE';

-- 创建应用用户（允许内网 IP 连接，用于应用服务器访问）
CREATE USER 'deer_link_user'@'172.17.35.160' IDENTIFIED BY 'YOUR_STRONG_PASSWORD_HERE';

-- 授予数据库权限
GRANT ALL PRIVILEGES ON deer_link_community.* TO 'deer_link_user'@'localhost';
GRANT ALL PRIVILEGES ON deer_link_community.* TO 'deer_link_user'@'172.17.35.160';

-- 刷新权限
FLUSH PRIVILEGES;

-- 验证用户创建
SELECT user, host FROM mysql.user WHERE user = 'deer_link_user';

-- 退出
EXIT;
```

### 3. 测试数据库连接

```bash
# 本地连接测试
mysql -u deer_link_user -p deer_link_community

# 如果成功，执行测试查询
mysql -u deer_link_user -p deer_link_community -e "SELECT DATABASE(), USER();"
```

预期输出:
```
+------------------------+---------------------------+
| DATABASE()             | USER()                    |
+------------------------+---------------------------+
| deer_link_community    | deer_link_user@localhost  |
+------------------------+---------------------------+
```

## MySQL 配置优化

### 1. 编辑配置文件

```bash
# CentOS
sudo vi /etc/my.cnf

# Ubuntu
sudo vi /etc/mysql/mysql.conf.d/mysqld.cnf
```

### 2. 推荐配置 (针对 2GB 内存)

在 `[mysqld]` 部分添加/修改:

```ini
[mysqld]
# 基础配置
port = 3306
bind-address = 172.17.35.160  # 只监听内网 IP，增强安全性
max_connections = 200          # 最大连接数
max_connect_errors = 10        # 最大连接错误数

# 字符集配置
character-set-server = utf8mb4
collation-server = utf8mb4_unicode_ci

# InnoDB 配置（针对 2GB 内存优化）
innodb_buffer_pool_size = 512M        # InnoDB 缓冲池大小（约 25% 内存）
innodb_log_file_size = 128M           # 日志文件大小
innodb_log_buffer_size = 16M          # 日志缓冲区
innodb_flush_log_at_trx_commit = 2    # 提高性能（略微降低安全性）
innodb_file_per_table = 1             # 每个表独立表空间
innodb_flush_method = O_DIRECT        # 避免双缓冲

# 查询缓存（MySQL 8.0 已移除，无需配置）
# query_cache_type = 0
# query_cache_size = 0

# 慢查询日志
slow_query_log = 1
slow_query_log_file = /var/log/mysql/slow-query.log
long_query_time = 2                   # 超过 2 秒的查询记录

# 二进制日志（用于备份恢复）
log_bin = /var/log/mysql/mysql-bin.log
expire_logs_days = 7                  # 保留 7 天
max_binlog_size = 100M

# 错误日志
log_error = /var/log/mysql/error.log

# 临时表配置
tmp_table_size = 64M
max_heap_table_size = 64M

# 线程缓存
thread_cache_size = 50

# 表缓存
table_open_cache = 2000
```

### 3. 创建日志目录

```bash
# 创建日志目录
sudo mkdir -p /var/log/mysql

# 设置权限
sudo chown -R mysql:mysql /var/log/mysql
sudo chmod 750 /var/log/mysql
```

### 4. 重启 MySQL 应用配置

```bash
# 检查配置文件语法
sudo mysqld --validate-config

# 重启服务
sudo systemctl restart mysqld    # CentOS
# 或
sudo systemctl restart mysql     # Ubuntu

# 查看状态
sudo systemctl status mysqld     # CentOS
# 或
sudo systemctl status mysql      # Ubuntu
```

## 初始化数据表

### 1. 执行 SQL 脚本

```bash
cd /Users/lihua/claude/LBS/deer_link/backend/scripts
mysql -u deer_link_user -p deer_link_community < init_db.sql
```

### 2. 验证表创建

```bash
mysql -u deer_link_user -p deer_link_community
```

```sql
-- 查看所有表
SHOW TABLES;

-- 查看表结构
DESC users;
DESC posts;
DESC comments;
DESC likes;

-- 退出
EXIT;
```

## 安全加固

### 1. 防火墙配置

**重要**: MySQL 只允许内网访问，不对外网开放！

```bash
# CentOS 7 (firewalld)
# 查看当前防火墙状态
sudo firewall-cmd --state

# MySQL 端口不应对外开放，确保没有开放 3306 到公网
sudo firewall-cmd --list-all

# 如果误开放了，移除规则
sudo firewall-cmd --permanent --remove-service=mysql
sudo firewall-cmd --reload

# Ubuntu (ufw)
# 查看防火墙状态
sudo ufw status

# 确保 3306 端口未开放
sudo ufw status numbered

# 如果开放了，删除规则（替换 N 为规则编号）
sudo ufw delete N
```

### 2. 修改默认端口（可选，增强安全性）

如果希望更高安全性，可以修改默认 3306 端口:

```bash
# 编辑配置文件
sudo vi /etc/my.cnf  # CentOS
# 或
sudo vi /etc/mysql/mysql.conf.d/mysqld.cnf  # Ubuntu
```

修改端口:
```ini
[mysqld]
port = 13306  # 自定义端口
```

重启服务并更新防火墙规则（如果需要）。

### 3. 定期更新密码

```sql
-- 登录 MySQL
mysql -u root -p

-- 修改应用用户密码
ALTER USER 'deer_link_user'@'localhost' IDENTIFIED BY 'NEW_STRONG_PASSWORD';
ALTER USER 'deer_link_user'@'172.17.35.160' IDENTIFIED BY 'NEW_STRONG_PASSWORD';

-- 刷新权限
FLUSH PRIVILEGES;
```

## 数据备份

### 1. 手动备份

```bash
# 完整备份
mysqldump -u deer_link_user -p deer_link_community > /var/www/deer_link/storage/backups/backup_$(date +%Y%m%d_%H%M%S).sql

# 备份单张表
mysqldump -u deer_link_user -p deer_link_community posts > posts_backup.sql
```

### 2. 自动备份脚本

脚本位置: `backend/scripts/backup.sh`

```bash
# 添加执行权限
chmod +x backend/scripts/backup.sh

# 手动执行备份
./backend/scripts/backup.sh

# 添加到 crontab（每天凌晨 2 点自动备份）
crontab -e

# 添加以下行:
0 2 * * * /path/to/backend/scripts/backup.sh >> /var/log/mysql_backup.log 2>&1
```

### 3. 恢复数据

```bash
# 恢复整个数据库
mysql -u deer_link_user -p deer_link_community < backup_file.sql

# 恢复前先删除现有数据（谨慎操作！）
mysql -u root -p -e "DROP DATABASE deer_link_community; CREATE DATABASE deer_link_community CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
mysql -u deer_link_user -p deer_link_community < backup_file.sql
```

## 性能监控

### 1. 查看连接数

```sql
-- 查看当前连接
SHOW PROCESSLIST;

-- 查看连接统计
SHOW STATUS LIKE 'Threads_connected';
SHOW STATUS LIKE 'Max_used_connections';
```

### 2. 查看缓冲池使用情况

```sql
-- InnoDB 缓冲池状态
SHOW STATUS LIKE 'Innodb_buffer_pool%';
```

### 3. 查看慢查询

```bash
# 查看慢查询日志
sudo tail -f /var/log/mysql/slow-query.log

# 分析慢查询（使用 mysqldumpslow）
sudo mysqldumpslow -s t -t 10 /var/log/mysql/slow-query.log
```

### 4. 优化表

```sql
-- 分析表
ANALYZE TABLE posts;

-- 优化表
OPTIMIZE TABLE posts;

-- 查看表状态
SHOW TABLE STATUS LIKE 'posts'\G
```

## 故障排查

### 问题 1: 无法启动 MySQL

```bash
# 查看错误日志
sudo tail -n 50 /var/log/mysql/error.log

# 检查端口占用
sudo lsof -i :3306

# 检查配置文件
sudo mysqld --validate-config

# 查看 systemd 日志
sudo journalctl -u mysqld -n 50  # CentOS
# 或
sudo journalctl -u mysql -n 50   # Ubuntu
```

### 问题 2: 连接被拒绝

```bash
# 检查 MySQL 是否运行
sudo systemctl status mysqld

# 检查监听地址
sudo netstat -tulpn | grep 3306

# 检查用户权限
mysql -u root -p -e "SELECT user, host FROM mysql.user;"
```

### 问题 3: 内存不足

```bash
# 查看 MySQL 内存使用
ps aux | grep mysqld

# 降低 innodb_buffer_pool_size
# 编辑配置文件，将 512M 降低到 256M 或 128M
sudo vi /etc/my.cnf
```

### 问题 4: 磁盘空间不足

```bash
# 查看磁盘使用
df -h

# 查看 MySQL 数据目录大小
sudo du -sh /var/lib/mysql/*

# 清理二进制日志
mysql -u root -p -e "PURGE BINARY LOGS BEFORE DATE_SUB(NOW(), INTERVAL 3 DAY);"

# 清理慢查询日志
sudo truncate -s 0 /var/log/mysql/slow-query.log
```

## 常用命令速查

```bash
# 启动服务
sudo systemctl start mysqld    # CentOS
sudo systemctl start mysql     # Ubuntu

# 停止服务
sudo systemctl stop mysqld     # CentOS
sudo systemctl stop mysql      # Ubuntu

# 重启服务
sudo systemctl restart mysqld  # CentOS
sudo systemctl restart mysql   # Ubuntu

# 查看状态
sudo systemctl status mysqld   # CentOS
sudo systemctl status mysql    # Ubuntu

# 开机自启
sudo systemctl enable mysqld   # CentOS
sudo systemctl enable mysql    # Ubuntu

# 查看版本
mysql --version

# 查看错误日志
sudo tail -f /var/log/mysql/error.log

# 查看慢查询日志
sudo tail -f /var/log/mysql/slow-query.log
```

## 性能基准

在 2GB 内存配置下的预期性能:

- **并发连接**: 50-100 个
- **QPS (查询每秒)**: 500-1000
- **平均响应时间**: < 100ms
- **缓冲池命中率**: > 95%

如果超过此负载，考虑:
1. 增加服务器内存
2. 添加 Redis 缓存层
3. 读写分离（主从复制）

## 进阶优化（未来考虑）

1. **主从复制**: 读写分离，提高读性能
2. **分库分表**: 数据量增长后的横向扩展
3. **连接池优化**: 应用层连接池配置
4. **索引优化**: 根据查询模式优化索引

## 相关文档

- [官方文档: MySQL 8.0 Reference Manual](https://dev.mysql.com/doc/refman/8.0/en/)
- [性能优化指南](https://dev.mysql.com/doc/refman/8.0/en/optimization.html)
- [InnoDB 存储引擎](https://dev.mysql.com/doc/refman/8.0/en/innodb-storage-engine.html)

---

**更新时间**: 2025-01-11
**适用版本**: MySQL 8.0+
