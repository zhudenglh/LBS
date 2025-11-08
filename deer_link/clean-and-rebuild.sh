#!/bin/bash

echo "🧹 开始清理缓存..."

# 清理 node_modules
echo "📦 清理 node_modules..."
rm -rf node_modules
rm -rf package-lock.json

# 清理 Metro 缓存
echo "🚇 清理 Metro 缓存..."
rm -rf $TMPDIR/react-*
rm -rf $TMPDIR/metro-*

# 清理 Watchman
echo "👁️  清理 Watchman..."
watchman watch-del-all 2>/dev/null || echo "Watchman not installed, skipping..."

# 清理 Android 构建
echo "🤖 清理 Android 构建..."
cd android
./gradlew clean
cd ..

# 重新安装依赖
echo "📦 重新安装依赖..."
npm install

echo ""
echo "✅ 清理和安装完成！"
echo ""
echo "🚀 接下来运行："
echo "   1. npm start -- --reset-cache"
echo "   2. (新终端) npm run android"
echo ""
echo "💡 提示：不要直接用 react-native 命令"
echo "   ❌ 错误: react-native start"
echo "   ✅ 正确: npm start"
echo ""
