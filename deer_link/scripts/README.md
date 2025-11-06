# 分支环境管理工具

快速使用指南

## 🎯 三种使用方式

### 1️⃣ 使用 npm 命令（推荐）

```bash
# 配置当前分支环境
npm run branch:setup

# 智能切换分支
npm run branch:switch
npm run branch:switch feature/rn-0.74
```

### 2️⃣ 直接运行脚本

```bash
# 配置环境
./scripts/setup-branch-env.sh

# 切换分支
./scripts/branch-switch.sh
./scripts/branch-switch.sh main
```

### 3️⃣ 自动模式（需要 Git Hook）

```bash
# 一次性设置（已自动完成）
chmod +x .git/hooks/post-checkout

# 之后每次 git checkout 会自动提示
git checkout feature/rn-0.74
# => 自动检测并提示配置环境
```

## 📋 命令对照表

| 操作 | npm 命令 | 脚本命令 | Git 命令 |
|------|----------|----------|----------|
| 配置环境 | `npm run branch:setup` | `./scripts/setup-branch-env.sh` | - |
| 切换分支 | `npm run branch:switch` | `./scripts/branch-switch.sh` | `git checkout` (自动) |
| 列出分支 | `npm run branch:switch` | `./scripts/branch-switch.sh` | `git branch` |

## 🔧 配置说明

编辑 `.branch-config.json` 添加或修改分支配置：

```json
{
  "你的分支名": {
    "description": "分支描述",
    "reactNativeVersion": "0.73.2",
    "cliVersion": "12.3.0",
    "dependencies": {
      "react-native": "0.73.2",
      "@react-native-community/cli": "^12.3.0"
    },
    "postCheckout": [
      "npm install",
      "cd android && ./gradlew clean"
    ]
  }
}
```

## 📚 完整文档

查看 `BRANCH_ENV.md` 获取详细文档。

## ❓ 常见问题

**Q: 切换分支后需要做什么？**  
A: 如果启用了 Git Hook，会自动提示。否则运行 `npm run branch:setup`

**Q: 如何恢复环境？**  
A: 运行 `mv package.json.backup package.json && npm install`

**Q: 脚本没有执行权限？**  
A: 运行 `chmod +x scripts/*.sh`
