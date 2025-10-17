#!/bin/bash

# 出行宝后端快速部署脚本
# 使用方法: bash quick-deploy.sh

set -e

SERVER="root@101.37.70.167"
REMOTE_PATH="/opt/chuxingbao-backend"
LOCAL_FILE="./server.js"

echo "========================================="
echo "🚀 出行宝后端快速部署"
echo "========================================="
echo ""

# 检查本地文件
if [ ! -f "$LOCAL_FILE" ]; then
    echo "❌ 错误：找不到 server.js 文件"
    exit 1
fi

echo "📤 步骤 1/3: 上传 server.js"
echo "请输入服务器密码："
scp "$LOCAL_FILE" "$SERVER:$REMOTE_PATH/server.js"

if [ $? -ne 0 ]; then
    echo "❌ 上传失败"
    exit 1
fi

echo "✅ 文件上传成功"
echo ""

echo "🔄 步骤 2/3: 重启服务"
echo "请再次输入服务器密码："
ssh "$SERVER" << 'ENDSSH'
cd /opt/chuxingbao-backend
pm2 restart all
pm2 status
ENDSSH

if [ $? -ne 0 ]; then
    echo "❌ 重启失败"
    exit 1
fi

echo ""
echo "✅ 服务重启成功"
echo ""

echo "✅ 步骤 3/3: 验证部署"
sleep 2

# 测试健康检查
response=$(curl -s http://101.37.70.167:3000/health)
if echo "$response" | grep -q "ok"; then
    echo "✅ API健康检查通过"
    echo ""
    echo "========================================="
    echo "🎉 部署成功！"
    echo "========================================="
    echo ""
    echo "🌐 API地址: http://101.37.70.167:3000"
    echo "📝 新功能："
    echo "  - GET /api/posts?userId=xxx (返回用户点赞状态)"
    echo "  - POST /api/posts/like (点赞)"
    echo "  - POST /api/posts/unlike (取消点赞)"
    echo ""
else
    echo "⚠️  健康检查失败，但服务可能正在启动"
    echo "请手动测试: curl http://101.37.70.167:3000/health"
fi
