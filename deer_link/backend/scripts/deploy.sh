#!/bin/bash
###########################################
# 自动部署脚本（从本地上传到阿里云 ECS）
# 本脚本在本地开发机执行
# 目标服务器: 47.107.130.240 (Alibaba Cloud Linux 3)
###########################################

set -e

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# 配置变量
SERVER_IP="47.107.130.240"
SERVER_USER="root"
SERVER_PATH="/opt/deer_link/backend"
LOCAL_PATH="$(cd "$(dirname "$0")/.." && pwd)"

print_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 检查 SSH 连接
check_ssh() {
    print_info "检查 SSH 连接..."
    if ssh -o ConnectTimeout=5 ${SERVER_USER}@${SERVER_IP} "echo 2>&1" > /dev/null 2>&1; then
        print_info "SSH 连接成功"
    else
        print_error "无法连接到服务器 ${SERVER_IP}"
        echo "请确保:"
        echo "1. 服务器 IP 正确"
        echo "2. SSH 密钥已配置或密码正确"
        echo "3. 服务器防火墙允许 SSH (端口 22)"
        exit 1
    fi
}

# 同步代码到服务器
sync_code() {
    print_info "同步代码到服务器..."

    # 确保服务器目录存在
    ssh ${SERVER_USER}@${SERVER_IP} "mkdir -p ${SERVER_PATH}"
    
    # 检查并安装服务器端的 rsync
    print_info "检查服务器端 rsync 安装..."
    ssh ${SERVER_USER}@${SERVER_IP} "if ! command -v rsync &> /dev/null; then echo '[INFO] 在服务器上安装 rsync...'; yum install -y rsync || apt-get install -y rsync; else echo '[INFO] 服务器已安装 rsync'; fi"

    # 使用 rsync 同步代码
    rsync -avz --progress \
        --exclude 'storage/' \
        --exclude 'build/' \
        --exclude '.git/' \
        --exclude 'node_modules/' \
        --exclude '*.log' \
        --exclude '.DS_Store' \
        ${LOCAL_PATH}/ ${SERVER_USER}@${SERVER_IP}:${SERVER_PATH}/

    print_info "代码同步完成"
}

# 在服务器上构建
build_on_server() {
    print_info "在服务器上构建应用..."

    ssh ${SERVER_USER}@${SERVER_IP} << 'ENDSSH'
        set -e
        cd /opt/deer_link/backend

        # 检查 Go 是否安装，如未安装则自动安装
        if ! command -v go &> /dev/null; then
            echo "[INFO] Go 未安装，开始安装 Go 1.21..."
            # 安装必要的依赖
            yum install -y wget tar || apt-get install -y wget tar
            
            # 下载并安装 Go 1.21
            wget https://go.dev/dl/go1.21.10.linux-amd64.tar.gz -O /tmp/go.tar.gz
            rm -rf /usr/local/go && tar -C /usr/local -xzf /tmp/go.tar.gz
            echo 'export PATH=$PATH:/usr/local/go/bin' >> /etc/profile
            echo 'export PATH=$PATH:/usr/local/go/bin' >> /root/.bashrc
            source /root/.bashrc
            rm /tmp/go.tar.gz
            
            # 验证安装
            go version
            echo "[INFO] Go 安装完成"
        fi

        # 设置 Go 模块代理以加速下载
        export GOPROXY=https://goproxy.cn,direct
        export GO111MODULE=on
        
        # 下载依赖，添加超时机制
        echo "[INFO] 下载 Go 依赖...(使用代理加速)"
        timeout 600 go mod download || {
            echo "[WARN] 依赖下载超时，尝试重新下载..."
            timeout 600 go mod download
        }
        
        # 整理依赖
        echo "[INFO] 整理 Go 依赖..."
        go mod tidy

        # 构建应用
        echo "[INFO] 构建应用..."
        mkdir -p build
        go build -o build/deer_link_server cmd/server/main.go

        # 验证构建
        if [ -f build/deer_link_server ]; then
            echo "[INFO] 构建成功"
            ls -lh build/deer_link_server
        else
            echo "[ERROR] 构建失败"
            exit 1
        fi
ENDSSH

    print_info "构建完成"
}

# 重启服务
restart_service() {
    print_info "重启服务..."

    ssh ${SERVER_USER}@${SERVER_IP} << 'ENDSSH'
        set -e

        # 检查服务是否存在
        if systemctl list-unit-files | grep -q deer_link.service; then
            echo "[INFO] 重启 deer_link 服务..."
            systemctl restart deer_link
            sleep 2
            systemctl status deer_link --no-pager
        else
            echo "[WARN] deer_link 服务未配置，跳过重启"
            echo "请参考 docs/DEPLOY.md 配置 systemd 服务"
        fi
ENDSSH

    print_info "服务重启完成"
}

# 测试部署
test_deployment() {
    print_info "测试部署..."

    # 等待服务启动
    sleep 3

    # 测试健康检查接口
    if curl -s http://${SERVER_IP}/health > /dev/null 2>&1; then
        print_info "✅ 健康检查通过"
        curl -s http://${SERVER_IP}/health | head -n 5
    else
        print_warn "⚠️  健康检查失败，可能需要配置 Nginx 或服务未启动"
    fi
}

# 显示部署摘要
show_summary() {
    echo ""
    echo "========================================="
    echo "  部署完成！"
    echo "========================================="
    echo ""
    echo "服务器信息:"
    echo "  - IP: ${SERVER_IP}"
    echo "  - 路径: ${SERVER_PATH}"
    echo ""
    echo "下一步:"
    echo "  1. 登录服务器检查: ssh ${SERVER_USER}@${SERVER_IP}"
    echo "  2. 查看服务状态: systemctl status deer_link"
    echo "  3. 查看日志: journalctl -u deer_link -f"
    echo "  4. 测试 API: curl http://${SERVER_IP}/health"
    echo ""
    echo "========================================="
}

# 主流程
main() {
    echo "========================================="
    echo "  小路游后端自动部署脚本"
    echo "========================================="
    echo ""

    # 确认部署
    read -p "确认部署到 ${SERVER_IP}? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_warn "部署已取消"
        exit 0
    fi

    # 执行部署流程
    check_ssh
    sync_code
    build_on_server
    restart_service
    test_deployment
    show_summary
}

# 执行主流程
main "$@"
