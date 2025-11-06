#!/bin/bash

# 分支切换快捷脚本
# 用法: ./scripts/branch-switch.sh [分支名]

set -e

BRANCH_NAME=$1
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_ROOT"

# 颜色
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}分支智能切换工具${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# 如果没有提供分支名，列出所有可用分支
if [ -z "$BRANCH_NAME" ]; then
    echo -e "${YELLOW}可用分支:${NC}"
    git branch -a
    echo ""
    
    # 显示配置的分支
    if [ -f ".branch-config.json" ]; then
        echo -e "${YELLOW}已配置环境的分支:${NC}"
        if command -v jq &> /dev/null; then
            jq -r 'keys[] as $k | "\($k): \(.[$k].description)"' .branch-config.json | while read -r line; do
                echo -e "  ${GREEN}$line${NC}"
            done
        else
            node -e "const config = require('./.branch-config.json'); Object.keys(config).forEach(k => console.log('  ' + k + ': ' + config[k].description));"
        fi
        echo ""
    fi
    
    read -p "请输入要切换的分支名: " BRANCH_NAME
    
    if [ -z "$BRANCH_NAME" ]; then
        echo -e "${RED}未提供分支名，退出${NC}"
        exit 1
    fi
fi

# 检查分支是否存在
if ! git rev-parse --verify "$BRANCH_NAME" >/dev/null 2>&1; then
    echo -e "${RED}错误: 分支 '$BRANCH_NAME' 不存在${NC}"
    echo ""
    read -p "是否创建新分支? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git checkout -b "$BRANCH_NAME"
        echo -e "${GREEN}✓ 已创建并切换到分支: $BRANCH_NAME${NC}"
    else
        exit 1
    fi
else
    echo -e "切换到分支: ${GREEN}$BRANCH_NAME${NC}"
    git checkout "$BRANCH_NAME"
fi

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}分支切换完成${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

# post-checkout hook 会自动运行
# 如果没有运行，手动提示
if [ ! -x ".git/hooks/post-checkout" ]; then
    echo -e "${YELLOW}提示: Git hook 未启用${NC}"
    echo -e "运行以下命令配置环境:"
    echo -e "  ${BLUE}./scripts/setup-branch-env.sh${NC}"
fi
