#!/bin/bash

# 查看服务器日志脚本
SERVER="root@101.37.70.167"

echo "========================================="
echo "查看出行宝后端服务器日志"
echo "========================================="
echo ""

ssh "$SERVER" << 'ENDSSH'
cd /opt/chuxingbao-backend

echo "=== 最新的 50 行日志 ==="
tail -n 50 server.log

echo ""
echo "=== PM2 进程状态 ==="
pm2 status

echo ""
echo "=== PM2 日志 ==="
pm2 logs --lines 30 --nostream
ENDSSH
