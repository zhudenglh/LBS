#!/bin/bash

# 阿里云服务器部署脚本
# 适用于 Alibaba Cloud Linux 3.2104
# 使用方法：ssh到服务器后执行此脚本

echo "====== 出行宝后端部署脚本 ======"

# 1. 安装 Node.js (如果未安装)
if ! command -v node &> /dev/null; then
    echo "正在安装 Node.js..."
    # Alibaba Cloud Linux 3 使用 dnf
    curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
    sudo dnf install -y nodejs
fi

echo "Node.js 版本: $(node -v)"
echo "npm 版本: $(npm -v)"

# 2. 创建应用目录
APP_DIR="/opt/chuxingbao-backend"
sudo mkdir -p $APP_DIR
sudo chown -R $USER:$USER $APP_DIR

# 3. 复制文件（需要先上传到服务器）
echo "请确保已将以下文件上传到服务器的 ~/chuxingbao-backend 目录："
echo "  - package.json"
echo "  - server.js"
echo "  - config.js"
echo ""

# 4. 安装依赖
cd $APP_DIR
npm install

# 5. 安装 PM2（进程管理器）
if ! command -v pm2 &> /dev/null; then
    echo "正在安装 PM2..."
    sudo npm install -g pm2
fi

# 6. 启动服务
echo "正在启动服务..."
pm2 stop chuxingbao-backend 2>/dev/null
pm2 start server.js --name chuxingbao-backend

# 7. 设置开机自启动
pm2 startup
pm2 save

# 8. 查看状态
pm2 status
pm2 logs chuxingbao-backend --lines 20

echo ""
echo "====== 部署完成 ======"
echo "服务运行在: http://YOUR_SERVER_IP:3000"
echo "健康检查: http://YOUR_SERVER_IP:3000/health"
echo ""
echo "常用命令："
echo "  查看日志: pm2 logs chuxingbao-backend"
echo "  重启服务: pm2 restart chuxingbao-backend"
echo "  停止服务: pm2 stop chuxingbao-backend"
