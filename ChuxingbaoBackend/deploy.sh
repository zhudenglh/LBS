#!/bin/bash

# 出行宝后端部署脚本
# 用于将本地代码部署到阿里云服务器

set -e

# 配置变量
SERVER_HOST="101.37.70.167"
SERVER_USER="root"
REMOTE_PATH="/root/ChuxingbaoBackend"  # 修改为你的服务器路径
LOCAL_PATH="/Users/bytedance/Documents/claude/ChuxingbaoBackend"

echo "======================================="
echo "出行宝后端部署脚本"
echo "======================================="
echo ""

# 检查 server.js 文件是否存在
if [ ! -f "$LOCAL_PATH/server.js" ]; then
    echo "❌ 错误：找不到 server.js 文件"
    exit 1
fi

echo "📦 准备上传文件到服务器..."
echo "服务器: $SERVER_USER@$SERVER_HOST"
echo "目标路径: $REMOTE_PATH"
echo ""

# 上传 server.js 到服务器
echo "⬆️  正在上传 server.js..."
scp "$LOCAL_PATH/server.js" "$SERVER_USER@$SERVER_HOST:$REMOTE_PATH/server.js"

if [ $? -eq 0 ]; then
    echo "✅ server.js 上传成功"
else
    echo "❌ server.js 上传失败"
    exit 1
fi

echo ""
echo "🔄 正在重启服务器上的后端服务..."

# SSH 登录服务器并重启服务
ssh "$SERVER_USER@$SERVER_HOST" << 'EOF'
    cd /root/ChuxingbaoBackend

    echo "停止旧进程..."
    pkill -f "node server.js" || true
    sleep 2

    echo "启动新进程..."
    nohup node server.js > server.log 2>&1 &
    sleep 2

    echo "检查进程状态..."
    if pgrep -f "node server.js" > /dev/null; then
        echo "✅ 后端服务已启动"
        echo "查看日志最后几行:"
        tail -n 5 server.log
    else
        echo "❌ 后端服务启动失败"
        echo "错误日志:"
        tail -n 20 server.log
        exit 1
    fi
EOF

if [ $? -eq 0 ]; then
    echo ""
    echo "======================================="
    echo "✅ 部署成功！"
    echo "======================================="
    echo ""
    echo "测试 API 接口:"
    echo "curl http://101.37.70.167:3000/health"
    echo ""

    # 测试健康检查接口
    echo "正在测试健康检查接口..."
    sleep 1
    curl -s http://101.37.70.167:3000/health
    echo ""
    echo ""
    echo "✨ 所有操作完成！"
else
    echo ""
    echo "======================================="
    echo "❌ 部署失败"
    echo "======================================="
    exit 1
fi
