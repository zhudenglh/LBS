# ANDROID_HOME 环境变量设置指南

## ✅ 已完成的操作

我已经为你在 `~/.zshrc` 文件中添加了以下环境变量：

```bash
# Android SDK 环境变量
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
```

## 🚀 使设置生效的方法

### 方法1: 重启终端（推荐）
最简单的方法是关闭当前终端窗口，然后重新打开一个新的终端窗口。

### 方法2: 重新加载配置文件
在当前终端中运行：
```bash
source ~/.zshrc
```

### 方法3: 为新的终端会话
每次打开新的终端窗口时，环境变量会自动加载。

## 🔍 验证设置是否成功

### 快速验证
运行验证脚本：
```bash
cd /Users/lihua/claude/LBS/deer_link
./verify_android_setup.sh
```

### 手动验证
```bash
# 1. 检查ANDROID_HOME
echo $ANDROID_HOME
# 应该输出: /Users/lihua/Library/Android/sdk

# 2. 检查adb工具
adb --version
# 应该显示Android Debug Bridge版本信息

# 3. 检查Android SDK路径
ls -la $ANDROID_HOME
# 应该显示SDK目录内容
```

## 📍 Android SDK 位置

你的Android SDK安装在：
```
/Users/lihua/Library/Android/sdk
```

这是Android Studio在macOS上的默认安装位置。

## 🛠️ PATH环境变量说明

添加到PATH的目录作用：

1. **$ANDROID_HOME/emulator**
   - Android模拟器可执行文件
   - 允许你运行 `emulator` 命令

2. **$ANDROID_HOME/platform-tools**
   - 包含adb、fastboot等工具
   - 允许你运行 `adb devices` 等命令

3. **$ANDROID_HOME/tools**
   - Android SDK工具
   - 包含各种开发工具

4. **$ANDROID_HOME/tools/bin**
   - SDK管理工具
   - 包含sdkmanager、avdmanager等

## 🖥️ 如果使用Bash Shell

如果你的系统使用bash而不是zsh，需要编辑 `~/.bash_profile` 或 `~/.bashrc`：

```bash
# 添加到 ~/.bash_profile 或 ~/.bashrc
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin

# 然后重新加载
source ~/.bash_profile  # 或 source ~/.bashrc
```

## ⚠️ 常见问题

### 问题1: 运行 `echo $ANDROID_HOME` 显示为空

**原因**: 配置文件未生效

**解决方案**:
```bash
# 重新加载配置
source ~/.zshrc

# 或者重启终端
```

### 问题2: `adb` 命令找不到

**原因**: PATH设置未生效或Android SDK未安装platform-tools

**解决方案**:
```bash
# 1. 检查platform-tools是否存在
ls -la ~/Library/Android/sdk/platform-tools

# 2. 如果不存在，在Android Studio中安装:
# Tools → SDK Manager → SDK Tools → Android SDK Platform-Tools

# 3. 重新加载配置
source ~/.zshrc
```

### 问题3: Android Studio找不到SDK

**解决方案**:
1. 打开Android Studio
2. Configure → SDK Manager
3. Android SDK Location应该是: `/Users/lihua/Library/Android/sdk`

## 📱 下一步：运行React Native应用

设置完成后，你可以运行：

```bash
cd /Users/lihua/claude/LBS/deer_link

# 确保环境变量已加载
echo $ANDROID_HOME

# 启动Metro bundler
npm start

# 在另一个终端运行（需要模拟器或连接的设备）
npm run android
```

## 🎯 测试命令

运行以下命令测试设置：

```bash
# 1. 检查环境变量
echo "ANDROID_HOME: $ANDROID_HOME"

# 2. 检查adb
adb --version

# 3. 列出已连接的设备
adb devices

# 4. 列出可用的模拟器
emulator -list-avds

# 5. 检查Android SDK包
ls $ANDROID_HOME
```

## 📝 查看当前配置

查看添加的环境变量：
```bash
cat ~/.zshrc | grep -A 6 "Android SDK"
```

## 🔄 如果需要更改SDK位置

如果你的Android SDK安装在其他位置：

1. 编辑 `~/.zshrc`：
```bash
nano ~/.zshrc
# 或
vim ~/.zshrc
```

2. 修改ANDROID_HOME路径：
```bash
export ANDROID_HOME=/your/custom/path/to/android-sdk
```

3. 保存并重新加载：
```bash
source ~/.zshrc
```

## ✨ 完成！

环境变量已设置完成。关闭并重新打开终端后，所有Android开发工具将可用。

---

**创建时间**: 2025-11-05
**适用系统**: macOS with zsh
**SDK位置**: ~/Library/Android/sdk
