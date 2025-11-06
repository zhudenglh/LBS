#!/bin/bash

# 分支环境自动配置脚本
# 用于在切换分支时自动设置正确的依赖版本

set -e

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CONFIG_FILE="$PROJECT_ROOT/.branch-config.json"
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}分支环境配置工具${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo -e "当前分支: ${GREEN}$CURRENT_BRANCH${NC}"

# 检查配置文件是否存在
if [ ! -f "$CONFIG_FILE" ]; then
    echo -e "${YELLOW}警告: 配置文件 .branch-config.json 不存在${NC}"
    echo -e "${YELLOW}将使用默认配置运行 npm install${NC}"
    npm install
    exit 0
fi

# 检查是否安装了 jq（JSON 处理工具）
if ! command -v jq &> /dev/null; then
    echo -e "${YELLOW}警告: 未安装 jq 工具，将使用 node 解析 JSON${NC}"
    USE_NODE_JSON=true
else
    USE_NODE_JSON=false
fi

# 读取分支配置
get_config_value() {
    local key=$1
    if [ "$USE_NODE_JSON" = true ]; then
        node -e "const config = require('$CONFIG_FILE'); const branch = config['$CURRENT_BRANCH'] || {}; console.log(branch.$key || '');"
    else
        jq -r ".\"$CURRENT_BRANCH\".$key // empty" "$CONFIG_FILE"
    fi
}

# 检查当前分支是否有配置
BRANCH_DESCRIPTION=$(get_config_value "description")

if [ -z "$BRANCH_DESCRIPTION" ]; then
    echo -e "${YELLOW}当前分支没有特定配置，将使用默认设置${NC}"
    echo -e "${YELLOW}提示: 可在 .branch-config.json 中为此分支添加配置${NC}"
    echo ""
    read -p "是否继续运行 npm install? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        npm install
    fi
    exit 0
fi

echo -e "分支说明: ${BLUE}$BRANCH_DESCRIPTION${NC}"
echo ""

# 显示当前分支配置
RN_VERSION=$(get_config_value "reactNativeVersion")
CLI_VERSION=$(get_config_value "cliVersion")
NODE_VERSION=$(get_config_value "nodeVersion")

echo -e "${GREEN}分支配置:${NC}"
echo -e "  React Native: ${YELLOW}$RN_VERSION${NC}"
echo -e "  CLI Version:  ${YELLOW}$CLI_VERSION${NC}"
echo -e "  Node Version: ${YELLOW}$NODE_VERSION${NC}"
echo ""

# 检查 Node 版本
CURRENT_NODE_VERSION=$(node -v | sed 's/v//')
echo -e "当前 Node 版本: ${YELLOW}$CURRENT_NODE_VERSION${NC}"

# 备份当前 package.json
echo -e "${BLUE}备份 package.json...${NC}"
cp package.json package.json.backup

# 询问用户是否继续
echo ""
read -p "是否继续设置环境? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}已取消${NC}"
    rm package.json.backup
    exit 0
fi

# 更新依赖
echo -e "${BLUE}更新依赖版本...${NC}"

if [ "$USE_NODE_JSON" = true ]; then
    # 使用 Node.js 更新 package.json
    node << 'NODESCRIPT'
const fs = require('fs');
const path = require('path');

const configPath = process.env.CONFIG_FILE;
const branch = process.env.CURRENT_BRANCH;
const packagePath = path.join(process.env.PROJECT_ROOT, 'package.json');

const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
const branchConfig = config[branch];
const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

if (branchConfig && branchConfig.dependencies) {
    for (const [name, version] of Object.entries(branchConfig.dependencies)) {
        if (pkg.dependencies && pkg.dependencies[name]) {
            pkg.dependencies[name] = version;
        } else if (pkg.devDependencies && pkg.devDependencies[name]) {
            pkg.devDependencies[name] = version;
        }
    }
    fs.writeFileSync(packagePath, JSON.stringify(pkg, null, 2) + '\n');
    console.log('✓ 已更新 package.json');
}
NODESCRIPT
else
    # 使用 jq 更新 package.json
    TEMP_PKG=$(mktemp)
    jq --arg branch "$CURRENT_BRANCH" \
       --slurpfile config "$CONFIG_FILE" \
       'reduce ($config[0][$branch].dependencies | to_entries[]) as $dep (.; 
        if .dependencies[$dep.key] then .dependencies[$dep.key] = $dep.value
        elif .devDependencies[$dep.key] then .devDependencies[$dep.key] = $dep.value
        else . end)' \
       package.json > "$TEMP_PKG" && mv "$TEMP_PKG" package.json
    echo -e "${GREEN}✓ 已更新 package.json${NC}"
fi

# 清理缓存
echo -e "${BLUE}清理缓存...${NC}"
rm -rf node_modules/.cache
rm -rf $TMPDIR/react-* 2>/dev/null || true
echo -e "${GREEN}✓ 缓存已清理${NC}"

# 安装依赖
echo -e "${BLUE}安装依赖...${NC}"
npm install

# 执行 postCheckout 命令
echo ""
echo -e "${BLUE}执行分支后置命令...${NC}"

if [ "$USE_NODE_JSON" = true ]; then
    POST_COMMANDS=$(node -e "const config = require('$CONFIG_FILE'); const cmds = config['$CURRENT_BRANCH']?.postCheckout || []; console.log(JSON.stringify(cmds));")
    echo "$POST_COMMANDS" | node -e "
        const cmds = JSON.parse(require('fs').readFileSync(0, 'utf-8'));
        cmds.forEach((cmd, i) => console.log(\`  \${i + 1}. \${cmd}\`));
    "
else
    jq -r ".\"$CURRENT_BRANCH\".postCheckout[]? // empty" "$CONFIG_FILE" | while read -r cmd; do
        echo -e "  执行: ${YELLOW}$cmd${NC}"
        eval "$cmd" || echo -e "${RED}  命令失败: $cmd${NC}"
    done
fi

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}环境配置完成！${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "已备份原 package.json 到: ${YELLOW}package.json.backup${NC}"
echo -e "如需恢复，运行: ${YELLOW}mv package.json.backup package.json${NC}"
