#!/bin/bash

# 出行宝后端一键部署脚本
# 在阿里云服务器上执行

echo "====== 出行宝后端一键部署 ======"
echo ""

# 解压文件
cd ~
if [ -f "chuxingbao-backend.tar.gz" ]; then
    echo "✓ 找到部署包"
    tar -xzf chuxingbao-backend.tar.gz
else
    echo "✗ 未找到 chuxingbao-backend.tar.gz"
    echo "请先上传部署包到服务器根目录"
    exit 1
fi

# 创建目录
echo "✓ 创建应用目录"
mkdir -p /opt/chuxingbao-backend

# 移动文件
echo "✓ 移动文件"
mv ~/package.json ~/server.js ~/config.js ~/deploy.sh /opt/chuxingbao-backend/ 2>/dev/null

# 进入目录
cd /opt/chuxingbao-backend

# 执行部署脚本
echo "✓ 开始部署..."
chmod +x deploy.sh
./deploy.sh

echo ""
echo "====== 部署完成 ======"
echo "访问: http://101.37.70.167:3000/health"
