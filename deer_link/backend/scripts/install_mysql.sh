#!/bin/bash
###########################################
# MySQL 8.0 自动化安装脚本
# 适用于: Alibaba Cloud Linux 3 / CentOS 8+ / Ubuntu 20.04+
# 作者: 小路游技术团队
# 日期: 2025-01-11
###########################################

set -e  # 遇到错误立即退出

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 打印函数
print_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 检查是否为 root 用户
check_root() {
    if [[ $EUID -ne 0 ]]; then
        print_error "此脚本需要 root 权限运行"
        echo "请使用: sudo $0"
        exit 1
    fi
}

# 检测操作系统
detect_os() {
    if [[ -f /etc/os-release ]]; then
        . /etc/os-release
        if [[ "$ID" == "alinux" ]]; then
            OS="alinux"
            print_info "检测到 Alibaba Cloud Linux 3 系统"
        elif [[ "$ID" == "centos" ]] || [[ "$ID" == "rhel" ]]; then
            OS="centos"
            print_info "检测到 CentOS/RHEL 系统"
        elif [[ "$ID" == "ubuntu" ]]; then
            OS="ubuntu"
            print_info "检测到 Ubuntu 系统"
        else
            print_error "不支持的操作系统: $ID"
            exit 1
        fi
    else
        print_error "无法检测操作系统"
        exit 1
    fi
}

# 安装 MySQL (Alibaba Cloud Linux 3 / CentOS 8+)
install_mysql_alinux() {
    print_info "开始在 Alibaba Cloud Linux 3 上安装 MySQL 8.0..."

    # 添加 MySQL 8.0 Yum 源
    print_info "添加 MySQL 8.0 Yum 源..."
    dnf install -y https://dev.mysql.com/get/mysql80-community-release-el8-9.noarch.rpm

    # 禁用默认的 mysql 模块（如果存在）
    dnf module disable -y mysql || true

    # 安装 MySQL Server
    print_info "安装 MySQL Server..."
    dnf install -y mysql-community-server

    # 启动 MySQL
    print_info "启动 MySQL 服务..."
    systemctl start mysqld
    systemctl enable mysqld

    # 获取临时密码
    TEMP_PASSWORD=$(grep 'temporary password' /var/log/mysqld.log | awk '{print $NF}')
    print_info "MySQL 临时密码: $TEMP_PASSWORD"
    echo "$TEMP_PASSWORD" > /root/mysql_temp_password.txt
    print_warn "临时密码已保存到: /root/mysql_temp_password.txt"
}

# 安装 MySQL (CentOS 7)
install_mysql_centos7() {
    print_info "开始在 CentOS 7 上安装 MySQL 8.0..."

    # 添加 MySQL Yum 源
    print_info "添加 MySQL 8.0 Yum 源..."
    yum install -y https://dev.mysql.com/get/mysql80-community-release-el7-7.noarch.rpm

    # 安装 MySQL Server
    print_info "安装 MySQL Server..."
    yum install -y mysql-community-server

    # 启动 MySQL
    print_info "启动 MySQL 服务..."
    systemctl start mysqld
    systemctl enable mysqld

    # 获取临时密码
    TEMP_PASSWORD=$(grep 'temporary password' /var/log/mysqld.log | awk '{print $NF}')
    print_info "MySQL 临时密码: $TEMP_PASSWORD"
    echo "$TEMP_PASSWORD" > /root/mysql_temp_password.txt
    print_warn "临时密码已保存到: /root/mysql_temp_password.txt"
}

# 安装 MySQL (Ubuntu)
install_mysql_ubuntu() {
    print_info "开始在 Ubuntu 上安装 MySQL 8.0..."

    # 更新软件包索引
    print_info "更新软件包索引..."
    apt update

    # 安装 MySQL Server
    print_info "安装 MySQL Server..."
    DEBIAN_FRONTEND=noninteractive apt install -y mysql-server

    # 启动 MySQL
    print_info "启动 MySQL 服务..."
    systemctl start mysql
    systemctl enable mysql

    print_info "Ubuntu MySQL 安装完成，无临时密码"
}

# 创建数据库和用户
setup_database() {
    print_info "配置数据库和用户..."

    read -p "请输入 MySQL root 密码: " -s ROOT_PASSWORD
    echo
    read -p "请输入应用数据库密码: " -s APP_PASSWORD
    echo

    # 创建 SQL 脚本
    cat > /tmp/setup_db.sql <<EOF
-- 创建数据库
CREATE DATABASE IF NOT EXISTS deer_link_community DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 创建用户（本地连接）
CREATE USER IF NOT EXISTS 'deer_link_user'@'localhost' IDENTIFIED BY '$APP_PASSWORD';

-- 创建用户（内网连接）
CREATE USER IF NOT EXISTS 'deer_link_user'@'172.17.35.160' IDENTIFIED BY '$APP_PASSWORD';

-- 授权
GRANT ALL PRIVILEGES ON deer_link_community.* TO 'deer_link_user'@'localhost';
GRANT ALL PRIVILEGES ON deer_link_community.* TO 'deer_link_user'@'172.17.35.160';

-- 刷新权限
FLUSH PRIVILEGES;
EOF

    # 执行 SQL
    if [[ "$OS" == "centos" ]]; then
        mysql -u root -p"$ROOT_PASSWORD" < /tmp/setup_db.sql
    else
        mysql -u root < /tmp/setup_db.sql
    fi

    rm -f /tmp/setup_db.sql
    print_info "数据库和用户创建成功"
}

# 配置 MySQL
configure_mysql() {
    print_info "优化 MySQL 配置..."

    # 备份原配置
    if [[ "$OS" == "centos" ]]; then
        CONFIG_FILE="/etc/my.cnf"
    else
        CONFIG_FILE="/etc/mysql/mysql.conf.d/mysqld.cnf"
    fi

    cp "$CONFIG_FILE" "${CONFIG_FILE}.bak"

    # 追加配置
    cat >> "$CONFIG_FILE" <<'EOF'

# ===== 小路游社区后端优化配置 =====
[mysqld]
# 监听地址（只监听内网）
bind-address = 172.17.35.160

# 字符集
character-set-server = utf8mb4
collation-server = utf8mb4_unicode_ci

# InnoDB 配置（2GB 内存优化）
innodb_buffer_pool_size = 512M
innodb_log_file_size = 128M
innodb_log_buffer_size = 16M
innodb_flush_log_at_trx_commit = 2
innodb_file_per_table = 1
innodb_flush_method = O_DIRECT

# 连接配置
max_connections = 200
max_connect_errors = 10

# 慢查询日志
slow_query_log = 1
slow_query_log_file = /var/log/mysql/slow-query.log
long_query_time = 2

# 二进制日志
log_bin = /var/log/mysql/mysql-bin.log
expire_logs_days = 7
max_binlog_size = 100M

# 临时表
tmp_table_size = 64M
max_heap_table_size = 64M

# 缓存
thread_cache_size = 50
table_open_cache = 2000
EOF

    # 创建日志目录
    mkdir -p /var/log/mysql
    chown -R mysql:mysql /var/log/mysql
    chmod 750 /var/log/mysql

    # 重启 MySQL
    print_info "重启 MySQL 应用配置..."
    systemctl restart mysqld 2>/dev/null || systemctl restart mysql

    print_info "MySQL 配置优化完成"
}

# 安全加固
secure_mysql() {
    print_info "MySQL 安全加固..."

    # 防火墙配置提示
    print_warn "请确保防火墙未开放 3306 端口到公网！"

    if command -v firewall-cmd &> /dev/null; then
        print_info "检查防火墙配置..."
        if firewall-cmd --query-service=mysql; then
            print_warn "检测到 MySQL 服务已对外开放，建议移除:"
            print_warn "  sudo firewall-cmd --permanent --remove-service=mysql"
            print_warn "  sudo firewall-cmd --reload"
        fi
    fi
}

# 测试连接
test_connection() {
    print_info "测试数据库连接..."

    read -p "请输入应用数据库密码: " -s APP_PASSWORD
    echo

    if mysql -u deer_link_user -p"$APP_PASSWORD" -e "USE deer_link_community; SELECT 'Connection successful!' AS status;"; then
        print_info "数据库连接测试成功！"
    else
        print_error "数据库连接测试失败"
        exit 1
    fi
}

# 显示安装信息
print_summary() {
    echo ""
    echo "========================================="
    echo "  MySQL 8.0 安装完成！"
    echo "========================================="
    echo ""
    echo "数据库信息:"
    echo "  - 数据库名: deer_link_community"
    echo "  - 用户名: deer_link_user"
    echo "  - 监听地址: 172.17.35.160:3306"
    echo ""
    echo "下一步:"
    echo "  1. 初始化数据表:"
    echo "     mysql -u deer_link_user -p deer_link_community < scripts/init_db.sql"
    echo ""
    echo "  2. 修改应用配置文件 configs/config.yaml 中的数据库密码"
    echo ""
    echo "  3. 查看 MySQL 状态:"
    echo "     systemctl status mysqld  # CentOS"
    echo "     systemctl status mysql   # Ubuntu"
    echo ""
    echo "========================================="
}

# 主流程
main() {
    print_info "MySQL 8.0 自动化安装脚本"
    echo "========================================"
    echo ""

    check_root
    detect_os

    # 根据操作系统选择安装方式
    if [[ "$OS" == "alinux" ]] || [[ "$OS" == "centos" ]]; then
        # Alibaba Cloud Linux 3 或 CentOS 8+ 使用 dnf
        if command -v dnf &> /dev/null; then
            install_mysql_alinux
        else
            # CentOS 7 使用 yum
            install_mysql_centos7
        fi
    elif [[ "$OS" == "ubuntu" ]]; then
        install_mysql_ubuntu
    else
        print_error "不支持的操作系统"
        exit 1
    fi

    # 配置数据库
    setup_database

    # 优化配置
    configure_mysql

    # 安全加固
    secure_mysql

    # 测试连接
    test_connection

    # 显示总结
    print_summary
}

# 执行主流程
main "$@"
