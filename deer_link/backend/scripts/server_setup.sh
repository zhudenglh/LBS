#!/bin/bash
###########################################
# 小路游后端一键部署脚本（服务器端执行）
# 在阿里云 ECS 服务器上运行
# 自动完成所有部署步骤并处理常见问题
#
# 使用方法:
#   sudo ./server_setup.sh
#
# 常见问题参考: docs/DEPLOYMENT_ISSUES.md
###########################################

set -e

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# 配置变量
PROJECT_DIR="/opt/deer_link/backend"
STORAGE_DIR="/var/www/deer_link/storage"
NGINX_CONF="/etc/nginx/conf.d/deer_link.conf"
SYSTEMD_SERVICE="/etc/systemd/system/deer_link.service"

# 获取服务器内网 IP
PRIVATE_IP=$(hostname -I | awk '{print $1}')

print_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_step() {
    echo -e "${BLUE}[STEP $1/13]${NC} $2"
}

# 检查 root 权限
check_root() {
    if [[ $EUID -ne 0 ]]; then
        print_error "此脚本需要 root 权限运行"
        echo "请使用: sudo $0"
        exit 1
    fi
}

# 步骤0: 环境检查和准备
prepare_environment() {
    print_step 0 "环境检查和准备..."

    # 检查操作系统
    if [ -f /etc/os-release ]; then
        . /etc/os-release
        print_info "操作系统: $NAME $VERSION"
    fi

    # 检查网络连接
    if ! ping -c 1 8.8.8.8 &> /dev/null; then
        print_warn "网络连接可能存在问题"
    fi

    # 检查磁盘空间
    AVAILABLE_SPACE=$(df -BG / | tail -1 | awk '{print $4}' | sed 's/G//')
    if [ "$AVAILABLE_SPACE" -lt 10 ]; then
        print_error "磁盘空间不足 10GB，当前可用: ${AVAILABLE_SPACE}GB"
        exit 1
    fi

    print_info "✅ 环境检查通过"
}

# 步骤1: 安装基础工具
install_base_tools() {
    print_step 1 "安装基础工具..."

    dnf install -y wget curl git vim tar gzip rsync openssl || {
        print_error "基础工具安装失败"
        exit 1
    }

    print_info "✅ 基础工具安装完成"
}

# 步骤2: 安装 Go 1.21
install_go() {
    print_step 2 "安装 Go 1.21..."

    if command -v go &> /dev/null; then
        GO_VERSION=$(go version | awk '{print $3}')
        print_info "Go 已安装: $GO_VERSION"
        return 0
    fi

    print_info "下载 Go 1.21.10..."
    cd /tmp
    wget -q https://go.dev/dl/go1.21.10.linux-amd64.tar.gz || {
        print_error "Go 下载失败"
        exit 1
    }

    print_info "安装 Go..."
    rm -rf /usr/local/go
    tar -C /usr/local -xzf go1.21.10.linux-amd64.tar.gz

    # 配置环境变量
    if ! grep -q "/usr/local/go/bin" /etc/profile; then
        echo 'export PATH=$PATH:/usr/local/go/bin' >> /etc/profile
    fi
    if ! grep -q "/usr/local/go/bin" /root/.bashrc; then
        echo 'export PATH=$PATH:/usr/local/go/bin' >> /root/.bashrc
    fi

    export PATH=$PATH:/usr/local/go/bin
    source /root/.bashrc

    rm -f /tmp/go1.21.10.linux-amd64.tar.gz

    go version
    print_info "✅ Go 安装完成"
}

# 步骤3: 安装 MySQL 8.0（处理常见问题）
install_mysql() {
    print_step 3 "安装 MySQL 8.0..."

    # 检查是否已安装 MySQL Server
    if systemctl is-active --quiet mysqld 2>/dev/null; then
        print_info "MySQL 服务已运行"
        return 0
    fi

    # 检查是否只安装了客户端
    if command -v mysql &> /dev/null && ! systemctl list-unit-files | grep -q mysqld.service; then
        print_warn "检测到只安装了 MySQL 客户端，开始安装 MySQL Server..."
    fi

    # 添加 MySQL Yum 源
    print_info "添加 MySQL 8.0 Yum 源..."
    if [ ! -f /etc/yum.repos.d/mysql-community.repo ]; then
        dnf install -y https://dev.mysql.com/get/mysql80-community-release-el8-9.noarch.rpm
    fi

    # 禁用默认 mysql 模块
    print_info "禁用默认 MySQL 模块..."
    dnf module disable -y mysql 2>/dev/null || true

    # 安装 MySQL Server
    print_info "安装 MySQL Server..."
    dnf install -y mysql-community-server

    # 启动 MySQL
    print_info "启动 MySQL 服务..."
    systemctl start mysqld
    systemctl enable mysqld

    # 获取临时密码
    TEMP_PASSWORD=$(grep 'temporary password' /var/log/mysqld.log | tail -1 | awk '{print $NF}')
    echo "$TEMP_PASSWORD" > /root/mysql_temp_password.txt
    print_info "MySQL 临时密码已保存到: /root/mysql_temp_password.txt"

    print_info "✅ MySQL 安装完成"
}

# 步骤4: 配置数据库
configure_database() {
    print_step 4 "配置数据库..."

    # 生成密码
    TEMP_PASSWORD=$(cat /root/mysql_temp_password.txt 2>/dev/null || echo "")
    MYSQL_ROOT_PASSWORD=$(openssl rand -base64 16)
    DB_PASSWORD=$(openssl rand -base64 16)

    # 保存密码
    cat > /root/.deer_link_passwords << EOF
MYSQL_ROOT_PASSWORD=${MYSQL_ROOT_PASSWORD}
DB_PASSWORD=${DB_PASSWORD}
EOF
    chmod 600 /root/.deer_link_passwords

    if [ -n "$TEMP_PASSWORD" ]; then
        # 重置 root 密码
        print_info "重置 MySQL root 密码..."
        mysql --connect-expired-password -u root -p"${TEMP_PASSWORD}" << MYSQL_EOF
ALTER USER 'root'@'localhost' IDENTIFIED BY '${MYSQL_ROOT_PASSWORD}';
FLUSH PRIVILEGES;
MYSQL_EOF
    else
        print_warn "未找到 MySQL 临时密码，使用当前 root 密码"
    fi

    # 创建数据库和用户
    print_info "创建数据库和用户..."
    mysql -u root -p"${MYSQL_ROOT_PASSWORD}" << MYSQL_EOF 2>/dev/null || true
CREATE DATABASE IF NOT EXISTS deer_link_community DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS 'deer_link_user'@'localhost' IDENTIFIED BY '${DB_PASSWORD}';
CREATE USER IF NOT EXISTS 'deer_link_user'@'${PRIVATE_IP}' IDENTIFIED BY '${DB_PASSWORD}';
GRANT ALL PRIVILEGES ON deer_link_community.* TO 'deer_link_user'@'localhost';
GRANT ALL PRIVILEGES ON deer_link_community.* TO 'deer_link_user'@'${PRIVATE_IP}';
FLUSH PRIVILEGES;
MYSQL_EOF

    # 初始化表结构
    print_info "初始化数据表..."
    if [ -f "${PROJECT_DIR}/scripts/init_db.sql" ]; then
        mysql -u deer_link_user -p"${DB_PASSWORD}" deer_link_community < "${PROJECT_DIR}/scripts/init_db.sql"
        print_info "✅ 数据表初始化完成"
    else
        print_error "init_db.sql 文件不存在"
        exit 1
    fi

    # 保存 DB_PASSWORD 供后续使用
    export DB_PASSWORD
}

# 步骤5: 创建存储目录
create_storage() {
    print_step 5 "创建存储目录..."

    mkdir -p ${STORAGE_DIR}/uploads/{images,thumbnails}
    mkdir -p ${STORAGE_DIR}/backups/{daily,weekly,monthly}

    chown -R root:root ${STORAGE_DIR}
    chmod -R 755 ${STORAGE_DIR}

    print_info "✅ 存储目录创建完成: ${STORAGE_DIR}"
}

# 步骤6: 配置应用
configure_app() {
    print_step 6 "配置应用..."

    CONFIG_FILE="${PROJECT_DIR}/configs/config.yaml"

    if [[ ! -f "$CONFIG_FILE" ]]; then
        print_error "配置文件不存在: $CONFIG_FILE"
        exit 1
    fi

    # 生成 JWT Secret
    JWT_SECRET=$(openssl rand -base64 32)
    echo "JWT_SECRET=${JWT_SECRET}" >> /root/.deer_link_passwords

    # 备份原配置
    cp "$CONFIG_FILE" "${CONFIG_FILE}.bak.$(date +%Y%m%d_%H%M%S)"

    # 更新配置文件
    sed -i "s|host: .*|host: ${PRIVATE_IP}|g" "$CONFIG_FILE"
    sed -i "s|password: .*|password: ${DB_PASSWORD}|g" "$CONFIG_FILE"
    sed -i "s|secret: .*|secret: ${JWT_SECRET}|g" "$CONFIG_FILE"
    sed -i "s|upload_path: .*|upload_path: ${STORAGE_DIR}/uploads|g" "$CONFIG_FILE"

    print_info "✅ 配置文件更新完成"
}

# 步骤7: 构建应用
build_app() {
    print_step 7 "构建应用..."

    cd ${PROJECT_DIR}

    # 设置 Go 代理（解决国内网络问题）
    export GOPROXY=https://goproxy.cn,direct
    export GO111MODULE=on
    export PATH=$PATH:/usr/local/go/bin

    print_info "下载 Go 依赖..."
    go mod download 2>/dev/null || {
        print_warn "依赖下载失败，重试..."
        go mod download
    }

    go mod tidy

    print_info "构建应用..."
    mkdir -p build
    go build -o build/deer_link_server cmd/server/main.go || {
        print_error "构建失败"
        exit 1
    }

    if [[ -f build/deer_link_server ]]; then
        print_info "✅ 构建成功"
        ls -lh build/deer_link_server
    else
        print_error "构建失败: 可执行文件不存在"
        exit 1
    fi
}

# 步骤8: 配置 systemd 服务
configure_systemd() {
    print_step 8 "配置 systemd 服务..."

    cat > ${SYSTEMD_SERVICE} <<'EOF'
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
EOF

    systemctl daemon-reload
    systemctl enable deer_link
    systemctl start deer_link

    sleep 2

    if systemctl is-active --quiet deer_link; then
        print_info "✅ 服务启动成功"
    else
        print_error "服务启动失败"
        journalctl -u deer_link -n 50
        exit 1
    fi
}

# 步骤9: 处理 Nginx 排除问题并安装
fix_and_install_nginx() {
    print_step 9 "处理 Nginx 排除问题并安装..."

    # 检查 Nginx 是否已安装
    if command -v nginx &> /dev/null; then
        print_info "Nginx 已安装"
        return 0
    fi

    # 检查 dnf.conf 中的排除规则
    if grep -q "exclude=.*nginx" /etc/dnf/dnf.conf 2>/dev/null; then
        print_warn "检测到 Nginx 被 dnf exclude 排除，正在修复..."

        # 备份原配置
        cp /etc/dnf/dnf.conf /etc/dnf/dnf.conf.bak

        # 从 exclude 列表移除 nginx
        sed -i 's/exclude=\(.*\)nginx\(.*\)/exclude=\1\2/g' /etc/dnf/dnf.conf
        sed -i 's/exclude= /exclude=/g' /etc/dnf/dnf.conf

        print_info "已从 exclude 列表移除 nginx"
    fi

    # 安装 Nginx
    print_info "安装 Nginx..."
    dnf install -y nginx || {
        print_warn "常规安装失败，尝试禁用排除规则安装..."
        dnf install --disableexcludes=main -y nginx
    }

    print_info "✅ Nginx 安装完成"
}

# 步骤10: 配置 Nginx
configure_nginx() {
    print_step 10 "配置 Nginx..."

    # 禁用默认配置（避免冲突）
    if [ -f /etc/nginx/conf.d/default.conf ]; then
        mv /etc/nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf.disabled
    fi

    # 创建配置文件
    cat > ${NGINX_CONF} <<'EOF'
upstream deer_link_backend {
    server 127.0.0.1:8080;
    keepalive 32;
}

server {
    listen 80;
    server_name _;

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
        proxy_set_header Connection "";
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
EOF

    # 测试配置
    nginx -t || {
        print_error "Nginx 配置测试失败"
        exit 1
    }

    # 启动 Nginx
    systemctl enable nginx
    systemctl restart nginx

    print_info "✅ Nginx 配置完成"
}

# 步骤11: 配置防火墙
configure_firewall() {
    print_step 11 "配置防火墙..."

    if command -v firewall-cmd &> /dev/null; then
        print_info "配置 firewalld..."

        # 开放 HTTP/HTTPS
        firewall-cmd --permanent --add-service=http 2>/dev/null || true
        firewall-cmd --permanent --add-service=https 2>/dev/null || true
        firewall-cmd --reload 2>/dev/null || true

        # 确保 MySQL 未对外开放
        if firewall-cmd --query-service=mysql 2>/dev/null; then
            print_warn "检测到 MySQL 对外开放，正在关闭..."
            firewall-cmd --permanent --remove-service=mysql
            firewall-cmd --reload
        fi

        print_info "✅ 防火墙配置完成"
    else
        print_warn "firewalld 未安装，跳过防火墙配置"
        print_warn "请确保阿里云安全组已开放 80 和 443 端口"
    fi
}

# 步骤12: 配置自动备份
configure_backup() {
    print_step 12 "配置自动备份..."

    if [[ -f "${PROJECT_DIR}/scripts/backup.sh" ]]; then
        chmod +x "${PROJECT_DIR}/scripts/backup.sh"

        # 添加到 crontab
        CRON_JOB="0 2 * * * ${PROJECT_DIR}/scripts/backup.sh >> /var/log/deer_link_backup.log 2>&1"

        if ! crontab -l 2>/dev/null | grep -q "backup.sh"; then
            (crontab -l 2>/dev/null; echo "$CRON_JOB") | crontab -
            print_info "✅ 自动备份已配置（每天凌晨2点）"
        else
            print_info "自动备份已存在"
        fi
    else
        print_warn "backup.sh 脚本不存在，跳过自动备份配置"
    fi
}

# 步骤13: 测试部署
test_deployment() {
    print_step 13 "测试部署..."

    sleep 3

    # 测试后端服务
    print_info "测试后端服务（8080）..."
    if curl -s http://localhost:8080/api/v1/health > /dev/null 2>&1; then
        print_info "  ✅ 后端服务正常"
    else
        print_error "  ❌ 后端服务异常"
        journalctl -u deer_link -n 20
    fi

    # 测试 Nginx 代理
    print_info "测试 Nginx 代理（80）..."
    if curl -s http://localhost/health > /dev/null 2>&1; then
        print_info "  ✅ Nginx 代理正常"
    else
        print_error "  ❌ Nginx 代理异常"
        tail -n 20 /var/log/nginx/deer_link_error.log
    fi

    # 测试公网访问
    print_info "测试公网访问..."
    PUBLIC_IP=$(curl -s ifconfig.me)
    if curl -s --connect-timeout 5 "http://${PUBLIC_IP}/health" > /dev/null 2>&1; then
        print_info "  ✅ 公网访问成功: http://${PUBLIC_IP}/health"
    else
        print_warn "  ⚠️  公网访问失败（可能需要配置安全组）"
        print_warn "  请在阿里云控制台开放 80 端口"
    fi

    # 检查端口监听
    print_info "检查端口监听..."
    ss -tulpn | grep -E ":(80|8080|3306)" | head -10
}

# 显示部署摘要
show_summary() {
    # 读取密码
    source /root/.deer_link_passwords 2>/dev/null || true
    PUBLIC_IP=$(curl -s ifconfig.me)

    echo ""
    echo "========================================="
    echo "  🎉 部署完成！"
    echo "========================================="
    echo ""
    echo "📊 服务状态:"
    echo "  deer_link: $(systemctl is-active deer_link 2>/dev/null)"
    echo "  MySQL: $(systemctl is-active mysqld 2>/dev/null)"
    echo "  Nginx: $(systemctl is-active nginx 2>/dev/null)"
    echo ""
    echo "🔒 重要凭据（已保存到 /root/.deer_link_passwords）:"
    echo "  MySQL root 密码: ${MYSQL_ROOT_PASSWORD}"
    echo "  应用数据库密码: ${DB_PASSWORD}"
    echo "  JWT Secret: ${JWT_SECRET}"
    echo ""
    echo "🌐 访问地址:"
    echo "  http://${PUBLIC_IP}/health"
    echo "  http://${PUBLIC_IP}/api/v1/health"
    echo ""
    echo "📁 重要文件:"
    echo "  密码: /root/.deer_link_passwords"
    echo "  应用配置: ${PROJECT_DIR}/configs/config.yaml"
    echo "  Nginx配置: ${NGINX_CONF}"
    echo "  存储目录: ${STORAGE_DIR}"
    echo ""
    echo "📝 常用命令:"
    echo "  查看应用日志: journalctl -u deer_link -f"
    echo "  查看Nginx日志: tail -f /var/log/nginx/deer_link_error.log"
    echo "  重启应用: systemctl restart deer_link"
    echo "  查看服务状态: systemctl status deer_link mysqld nginx"
    echo ""
    echo "⚠️  重要提醒:"
    echo "  1. 请妥善保管密码文件: /root/.deer_link_passwords"
    echo "  2. 请在阿里云安全组开放 80/443 端口"
    echo "  3. 建议配置 HTTPS (使用 Let's Encrypt)"
    echo "  4. 数据库已配置自动备份（每天凌晨2点）"
    echo ""
    echo "📖 文档参考:"
    echo "  常见问题: ${PROJECT_DIR}/docs/DEPLOYMENT_ISSUES.md"
    echo "  API 文档: ${PROJECT_DIR}/docs/API.md"
    echo ""
    echo "========================================="
}

# 主流程
main() {
    echo ""
    echo "========================================="
    echo "  小路游后端一键部署脚本"
    echo "  Alibaba Cloud Linux 3"
    echo "  Version: 2.0 (问题修复版)"
    echo "========================================="
    echo ""

    # 确认部署
    read -p "确认开始部署? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_warn "部署已取消"
        exit 0
    fi

    print_info "开始部署..."
    echo ""

    check_root
    prepare_environment
    install_base_tools
    install_go
    install_mysql
    configure_database
    create_storage
    configure_app
    build_app
    configure_systemd
    fix_and_install_nginx
    configure_nginx
    configure_firewall
    configure_backup
    test_deployment
    show_summary

    print_info "部署完成！"
}

# 执行主流程
main "$@"
