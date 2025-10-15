#!/bin/bash

echo "正在检查服务器上的项目路径..."
echo "请输入服务器密码："
echo ""

ssh root@101.37.70.167 << 'EOF'
    echo "=== 检查可能的项目路径 ==="
    echo ""
    
    echo "1. 检查 /root 目录:"
    ls -la /root/ | grep -i chuxing || echo "  未找到"
    echo ""
    
    echo "2. 检查 /home 目录:"
    ls -la /home/ 2>/dev/null | grep -i chuxing || echo "  未找到或无权限"
    echo ""
    
    echo "3. 检查 /opt 目录:"
    ls -la /opt/ 2>/dev/null | grep -i chuxing || echo "  未找到"
    echo ""
    
    echo "4. 查找所有包含 server.js 的目录:"
    find /root /home /opt -name "server.js" 2>/dev/null | head -10
    echo ""
    
    echo "5. 查找所有包含 chuxing 的目录:"
    find / -maxdepth 3 -type d -iname "*chuxing*" 2>/dev/null
    echo ""
    
    echo "6. 当前运行的 node 进程:"
    ps aux | grep node | grep -v grep
    echo ""
EOF

echo ""
echo "检查完成！"
