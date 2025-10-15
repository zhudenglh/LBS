#!/bin/bash

set -e

SERVER_HOST="101.37.70.167"
SERVER_USER="root"
LOCAL_FILE="/Users/bytedance/Documents/claude/ChuxingbaoBackend/server.js"

echo "======================================="
echo "出行宝后端智能部署脚本"
echo "======================================="
echo ""

# 检查本地文件
if [ ! -f "$LOCAL_FILE" ]; then
    echo "❌ 错误：找不到 server.js 文件"
    exit 1
fi

echo "📡 步骤 1/5: 检查服务器连接和路径"
echo "请输入服务器密码："
echo ""

# 检查并获取服务器上的实际路径
REMOTE_PATH=$(ssh "$SERVER_USER@$SERVER_HOST" "
    # 先检查常见路径
    if [ -d /root/ChuxingbaoBackend ]; then
        echo '/root/ChuxingbaoBackend'
    elif [ -d /root/chuxingbao-backend ]; then
        echo '/root/chuxingbao-backend'
    elif [ -d ~/ChuxingbaoBackend ]; then
        echo '~/ChuxingbaoBackend'
    else
        # 查找正在运行的 server.js 进程
        server_path=\$(ps aux | grep 'node.*server.js' | grep -v grep | awk '{for(i=1;i<=NF;i++) if(\$i~/server.js/) print \$i}' | head -1)
        if [ -n \"\$server_path\" ]; then
            dirname \"\$server_path\"
        else
            # 如果都找不到，创建新目录
            mkdir -p /root/ChuxingbaoBackend
            echo '/root/ChuxingbaoBackend'
        fi
    fi
")

if [ -z "$REMOTE_PATH" ]; then
    echo "❌ 无法确定服务器路径"
    exit 1
fi

echo "✅ 找到服务器路径: $REMOTE_PATH"
echo ""

echo "📦 步骤 2/5: 备份旧文件"
ssh "$SERVER_USER@$SERVER_HOST" "
    if [ -f $REMOTE_PATH/server.js ]; then
        cp $REMOTE_PATH/server.js $REMOTE_PATH/server.js.backup.\$(date +%Y%m%d_%H%M%S)
        echo '✅ 已备份旧文件'
    else
        echo '⚠️  未找到旧文件，跳过备份'
    fi
"
echo ""

echo "⬆️  步骤 3/5: 上传新文件"
scp "$LOCAL_FILE" "$SERVER_USER@$SERVER_HOST:$REMOTE_PATH/server.js"

if [ $? -ne 0 ]; then
    echo "❌ 上传失败"
    exit 1
fi
echo "✅ 文件上传成功"
echo ""

echo "🔄 步骤 4/5: 重启服务"
ssh "$SERVER_USER@$SERVER_HOST" "
    cd $REMOTE_PATH
    
    # 停止旧进程
    echo '正在停止旧进程...'
    pkill -f 'node server.js' || true
    sleep 2
    
    # 检查是否还有残留进程
    if pgrep -f 'node server.js' > /dev/null; then
        echo '强制结束残留进程...'
        pkill -9 -f 'node server.js' || true
        sleep 1
    fi
    
    # 启动新进程
    echo '正在启动新进程...'
    nohup node server.js > server.log 2>&1 &
    sleep 3
    
    # 检查启动状态
    if pgrep -f 'node server.js' > /dev/null; then
        echo '✅ 服务启动成功'
        echo ''
        echo '最新日志:'
        tail -n 10 server.log
    else
        echo '❌ 服务启动失败'
        echo ''
        echo '错误日志:'
        tail -n 20 server.log
        exit 1
    fi
"

if [ $? -ne 0 ]; then
    echo ""
    echo "❌ 服务启动失败"
    exit 1
fi

echo ""
echo "✅ 步骤 5/5: 验证部署"
sleep 2

response=$(curl -s -w "\n%{http_code}" http://101.37.70.167:3000/health)
http_code=$(echo "$response" | tail -n 1)
body=$(echo "$response" | head -n -1)

if [ "$http_code" = "200" ]; then
    echo "✅ API健康检查通过"
    echo "响应: $body"
    echo ""
    echo "======================================="
    echo "✅ 部署成功！"
    echo "======================================="
    echo ""
    echo "📍 服务器路径: $REMOTE_PATH"
    echo "🌐 API地址: http://101.37.70.167:3000"
    echo ""
    echo "新增的点赞API："
    echo "  - POST /api/posts/like"
    echo "  - POST /api/posts/unlike"
    echo ""
else
    echo "⚠️  API测试返回状态码: $http_code"
    echo "响应: $body"
    echo ""
    echo "服务可能正在启动中，请稍后手动测试："
    echo "curl http://101.37.70.167:3000/health"
fi
