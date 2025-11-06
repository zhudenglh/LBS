# 分支环境管理指南

这个项目使用自动化工具来管理不同分支的 React Native 和依赖版本，避免手动配置的麻烦。

## 📋 目录

- [快速开始](#快速开始)
- [工作原理](#工作原理)
- [配置文件说明](#配置文件说明)
- [使用方法](#使用方法)
- [常见问题](#常见问题)

---

## 🚀 快速开始

### 1. 切换分支（推荐方式）

使用提供的快捷脚本：

```bash
# 列出所有分支并选择
./scripts/branch-switch.sh

# 直接切换到指定分支
./scripts/branch-switch.sh main
./scripts/branch-switch.sh feature/rn-0.74
```

### 2. 手动切换分支

如果使用 `git checkout`，切换后会自动提示：

```bash
git checkout feature/rn-0.74
# => 自动检测 package.json 变化
# => 提示是否运行环境配置脚本
```

### 3. 手动配置环境

如果跳过了自动配置，可以随时运行：

```bash
./scripts/setup-branch-env.sh
```

---

## ⚙️ 工作原理

### 自动化流程

```
分支切换 (git checkout)
    ↓
Git post-checkout hook 触发
    ↓
检测 package.json 是否变化
    ↓
提示运行环境配置脚本
    ↓
读取 .branch-config.json
    ↓
更新 package.json 中的依赖版本
    ↓
运行 npm install
    ↓
执行分支特定的后置命令
    ↓
完成！
```

### 文件结构

```
deer_link/
├── .branch-config.json          # 分支配置文件（核心）
├── .git/hooks/post-checkout     # Git 钩子（自动触发）
├── scripts/
│   ├── setup-branch-env.sh      # 环境配置脚本
│   └── branch-switch.sh         # 分支切换快捷脚本
└── BRANCH_ENV.md                # 本文档
```

---

## 📝 配置文件说明

### .branch-config.json 格式

```json
{
  "分支名": {
    "description": "分支说明",
    "reactNativeVersion": "0.73.2",
    "cliVersion": "12.3.0",
    "nodeVersion": ">=18",
    "dependencies": {
      "依赖包名": "版本号"
    },
    "postCheckout": [
      "切换后要执行的命令"
    ]
  }
}
```

### 当前配置的分支

#### main - 主分支（RN 0.73.2）

```json
{
  "reactNativeVersion": "0.73.2",
  "cliVersion": "12.3.0",
  "dependencies": {
    "react-native": "0.73.2",
    "@react-native-community/cli": "^12.3.0",
    "react-native-svg": "^14.1.0"
  },
  "postCheckout": [
    "npm install",
    "cd android && ./gradlew clean"
  ]
}
```

#### feature/rn-0.74 - 升级分支（RN 0.74.x）

```json
{
  "reactNativeVersion": "0.74.0",
  "cliVersion": "13.6.0",
  "dependencies": {
    "react-native": "0.74.0",
    "@react-native-community/cli": "^13.6.0",
    "react-native-svg": "^15.0.0"
  },
  "postCheckout": [
    "npm install",
    "cd android && ./gradlew clean",
    "watchman watch-del-all"
  ]
}
```

### 添加新分支配置

编辑 `.branch-config.json`，添加新的分支配置：

```bash
# 编辑配置文件
vim .branch-config.json

# 或使用你喜欢的编辑器
code .branch-config.json
```

示例：添加 RN 0.75 分支

```json
{
  "feature/rn-0.75": {
    "description": "测试分支 - RN 0.75.x",
    "reactNativeVersion": "0.75.0",
    "cliVersion": "14.0.0",
    "nodeVersion": ">=20",
    "dependencies": {
      "react-native": "0.75.0",
      "@react-native-community/cli": "^14.0.0",
      "@react-native-community/cli-platform-android": "^14.0.0",
      "@react-native-community/cli-platform-ios": "^14.0.0",
      "react-native-svg": "^15.2.0"
    },
    "postCheckout": [
      "npm install",
      "cd ios && pod install && cd ..",
      "cd android && ./gradlew clean && cd ..",
      "watchman watch-del-all",
      "rm -rf node_modules/.cache"
    ]
  }
}
```

---

## 📖 使用方法

### 日常开发

#### 场景 1: 在 main 分支开发

```bash
# 当前在 main 分支，一切正常
git status
# On branch main

# 开发你的功能...
```

#### 场景 2: 切换到 RN 0.74 测试分支

```bash
# 方式一：使用快捷脚本（推荐）
./scripts/branch-switch.sh feature/rn-0.74

# 方式二：使用 git checkout（会自动提示）
git checkout feature/rn-0.74
# => 提示: package.json 已变化！
# => 是否立即运行环境配置脚本? (y/n) y
# => 自动配置环境...
```

#### 场景 3: 创建新功能分支

```bash
# 从 main 创建新分支
git checkout -b feature/my-new-feature

# 如果需要特定的 RN 版本，先在 .branch-config.json 中配置
# 然后运行
./scripts/setup-branch-env.sh
```

### 跨项目切换

当你在多个 React Native 项目之间切换时：

```bash
# 项目 A (RN 0.73)
cd ~/projects/project-a
./scripts/branch-switch.sh main

# 项目 B (RN 0.74)  
cd ~/projects/project-b
./scripts/branch-switch.sh main
```

每个项目会自动使用正确的依赖版本！

---

## 🛠️ 常见问题

### Q1: Git hook 没有自动运行怎么办？

**A:** 检查 hook 是否可执行：

```bash
chmod +x .git/hooks/post-checkout
```

### Q2: 我不想自动提示，只想手动运行怎么办？

**A:** 可以删除或重命名 Git hook：

```bash
mv .git/hooks/post-checkout .git/hooks/post-checkout.disabled
```

需要时手动运行：

```bash
./scripts/setup-branch-env.sh
```

### Q3: 安装依赖时出错怎么办？

**A:** 先清理环境，再重试：

```bash
# 清理所有缓存
rm -rf node_modules
rm -rf android/build
rm -rf ios/build
rm -rf $TMPDIR/react-*
watchman watch-del-all

# 重新配置
./scripts/setup-branch-env.sh
```

### Q4: 如何恢复到切换前的状态？

**A:** 配置脚本会自动备份 package.json：

```bash
# 恢复备份
mv package.json.backup package.json

# 重新安装
npm install
```

### Q5: 不同分支使用不同的 Node 版本怎么办？

**A:** 配合 `nvm` 使用：

```bash
# 在 .branch-config.json 中指定 nodeVersion
{
  "feature/rn-0.75": {
    "nodeVersion": ">=20"
  }
}

# 手动切换 Node 版本
nvm use 20

# 或创建 .nvmrc 文件
echo "20" > .nvmrc
nvm use
```

### Q6: 可以为每个分支设置不同的环境变量吗？

**A:** 可以！在 `postCheckout` 中添加：

```json
{
  "postCheckout": [
    "npm install",
    "echo 'API_URL=https://dev-api.example.com' > .env",
    "cd android && ./gradlew clean"
  ]
}
```

### Q7: 如何禁用某个分支的自动配置？

**A:** 只需不在 `.branch-config.json` 中添加该分支的配置即可。

### Q8: 可以用于其他类型的项目吗？

**A:** 可以！这个方案适用于任何使用 Git 和 npm/yarn 的项目。只需修改 `dependencies` 和 `postCheckout` 配置。

---

## 🎯 最佳实践

### 1. 提交前检查

```bash
# 不要提交 package.json.backup
echo "package.json.backup" >> .gitignore

# 确保 .branch-config.json 已提交
git add .branch-config.json
git commit -m "chore: add branch environment config"
```

### 2. 团队协作

将以下文件提交到 Git：

```bash
git add .branch-config.json
git add scripts/
git add BRANCH_ENV.md
git commit -m "chore: add branch environment management"

# 不要提交 Git hooks（每个开发者需自行设置）
# Git hooks 在 .git/hooks/ 中，不会被 Git 追踪
```

团队成员克隆项目后，只需：

```bash
# 启用 Git hook（一次性操作）
chmod +x .git/hooks/post-checkout

# 之后分支切换会自动提示
```

### 3. CI/CD 集成

在 CI 环境中：

```bash
# .github/workflows/build.yml

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup environment for branch
        run: |
          BRANCH_NAME=${GITHUB_REF#refs/heads/}
          ./scripts/setup-branch-env.sh
          
      - name: Build
        run: npm run build
```

---

## 📚 相关资源

- [React Native 版本对应关系](https://reactnative.dev/versions)
- [React Native CLI 版本历史](https://github.com/react-native-community/cli/releases)
- [Git Hooks 文档](https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks)

---

## 🆘 获取帮助

遇到问题？

1. 查看本文档的[常见问题](#常见问题)
2. 检查 `.branch-config.json` 配置是否正确
3. 查看脚本输出的错误信息
4. 联系团队技术负责人

---

**祝开发愉快！🎉**
