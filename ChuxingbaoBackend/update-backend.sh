#!/bin/bash

# 出行宝后端更新脚本
# 用途：上传 server.js 和 config.js 到服务器并重启服务

SERVER="101.37.70.167"
USER="root"
REMOTE_DIR="/opt/chuxingbao-backend"

echo "========================================="
echo "出行宝后端更新脚本"
echo "========================================="
echo "服务器: $SERVER"
echo "用户: $USER"
echo "目标目录: $REMOTE_DIR"
echo ""
echo "请准备好服务器密码（需要输入3次）"
echo ""
read -p "按回车键继续..."

# 上传 server.js
echo ""
echo "步骤 1/3: 上传 server.js..."
scp server.js "$USER@$SERVER:$REMOTE_DIR/server.js.new"

if [ $? -ne 0 ]; then
    echo "❌ 上传 server.js 失败"
    exit 1
fi

# 上传 config.js
echo ""
echo "步骤 2/3: 上传 config.js..."
scp config.js "$USER@$SERVER:$REMOTE_DIR/config.js.new"

if [ $? -ne 0 ]; then
    echo "❌ 上传 config.js 失败"
    exit 1
fi

# 在服务器上执行更新命令
echo ""
echo "步骤 3/3: 在服务器上更新并重启服务..."
ssh "$USER@$SERVER" << 'ENDSSH'
cd /opt/chuxingbao-backend

# 备份旧文件
echo "备份旧文件..."
cp server.js server.js.backup.$(date +%Y%m%d_%H%M%S)
cp config.js config.js.backup.$(date +%Y%m%d_%H%M%S)

# 替换新文件
echo "替换新文件..."
mv server.js.new server.js
mv config.js.new config.js

# 安装依赖
echo "安装 openai 依赖..."
npm install openai

# 重启服务
echo "重启 PM2 服务..."
pm2 restart chuxingbao-backend

# 显示状态
echo ""
echo "服务状态："
pm2 status

echo ""
echo "最近的日志："
pm2 logs chuxingbao-backend --lines 10 --nostream
ENDSSH

if [ $? -eq 0 ]; then
    echo ""
    echo "========================================="
    echo "✅ 后端更新成功！"
    echo "========================================="
    echo ""
    echo "可以使用以下命令查看实时日志："
    echo "ssh $USER@$SERVER 'pm2 logs chuxingbao-backend'"
else
    echo ""
    echo "❌ 更新失败，请检查错误信息"
    exit 1
fi
