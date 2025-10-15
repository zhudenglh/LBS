#!/bin/bash

# 出行宝后端手动部署脚本（需要输入密码）

set -e

SERVER_HOST="101.37.70.167"
SERVER_USER="root"
REMOTE_PATH="/root/ChuxingbaoBackend"
LOCAL_PATH="/Users/bytedance/Documents/claude/ChuxingbaoBackend"

echo "======================================="
echo "出行宝后端部署脚本"
echo "======================================="
echo ""
echo "⚠️  注意：部署过程中需要输入服务器密码"
echo ""

# 检查文件
if [ ! -f "$LOCAL_PATH/server.js" ]; then
    echo "❌ 错误：找不到 server.js 文件"
    exit 1
fi

echo "📦 步骤 1/3: 上传文件到服务器"
echo "正在上传 server.js..."
echo ""

scp "$LOCAL_PATH/server.js" "$SERVER_USER@$SERVER_HOST:$REMOTE_PATH/"

if [ $? -ne 0 ]; then
    echo "❌ 上传失败"
    exit 1
fi

echo ""
echo "✅ 文件上传成功"
echo ""
echo "🔄 步骤 2/3: 重启服务器上的后端服务"
echo ""

ssh -t "$SERVER_USER@$SERVER_HOST" "
    cd $REMOTE_PATH && \
    echo '正在停止旧进程...' && \
    pkill -f 'node server.js' || true && \
    sleep 2 && \
    echo '正在启动新进程...' && \
    nohup node server.js > server.log 2>&1 & \
    sleep 2 && \
    echo '检查进程状态...' && \
    if pgrep -f 'node server.js' > /dev/null; then
        echo '✅ 后端服务已启动'
        echo '日志最后几行:'
        tail -n 5 server.log
    else
        echo '❌ 后端服务启动失败'
        tail -n 20 server.log
        exit 1
    fi
"

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 步骤 3/3: 验证部署"
    echo "正在测试健康检查接口..."
    sleep 2
    
    response=$(curl -s http://101.37.70.167:3000/health)
    
    if [ $? -eq 0 ]; then
        echo "API 响应: $response"
        echo ""
        echo "======================================="
        echo "✅ 部署成功！"
        echo "======================================="
        echo ""
        echo "新的点赞API已部署："
        echo "  - POST http://101.37.70.167:3000/api/posts/like"
        echo "  - POST http://101.37.70.167:3000/api/posts/unlike"
        echo ""
    else
        echo "⚠️  API测试失败，但服务可能正在启动中"
    fi
else
    echo ""
    echo "======================================="
    echo "❌ 部署失败"
    echo "======================================="
    exit 1
fi
