#!/bin/bash

# 出行宝后端 - 通过 SSH 部署脚本
# 需要手动输入服务器密码

set -e

SERVER="101.37.70.167"
USER="root"
REMOTE_DIR="/opt/chuxingbao-backend"
LOCAL_FILE="./server.js"

echo "========================================="
echo "出行宝后端部署 - SSH 上传方式"
echo "========================================="
echo ""
echo "服务器: $SERVER"
echo "目标目录: $REMOTE_DIR"
echo ""

# 检查本地文件是否存在
if [ ! -f "$LOCAL_FILE" ]; then
    echo "错误: 找不到 server.js 文件"
    exit 1
fi

echo "准备上传 server.js 到服务器..."
echo "请在提示时输入服务器密码"
echo ""

# 使用 scp 上传文件
echo "步骤 1: 上传文件..."
scp "$LOCAL_FILE" "$USER@$SERVER:$REMOTE_DIR/server.js.new"

if [ $? -ne 0 ]; then
    echo "上传失败！"
    exit 1
fi

echo "上传成功！"
echo ""
echo "步骤 2: 执行部署命令..."
echo "请再次输入密码以执行远程命令"
echo ""

# 执行远程部署命令
ssh "$USER@$SERVER" << 'ENDSSH'
cd /opt/chuxingbao-backend
echo "备份当前版本..."
cp server.js server.js.backup.$(date +%Y%m%d_%H%M%S)
echo "替换新版本..."
mv server.js.new server.js
echo "重启服务..."
pm2 restart chuxingbao-backend
echo ""
echo "部署完成！服务状态："
pm2 status
echo ""
echo "最新日志："
pm2 logs chuxingbao-backend --lines 10 --nostream
ENDSSH

if [ $? -eq 0 ]; then
    echo ""
    echo "========================================="
    echo "部署成功！"
    echo "========================================="
else
    echo ""
    echo "部署过程中出现错误"
fi
