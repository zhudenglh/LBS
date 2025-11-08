#!/bin/bash

echo "🔧 修复 React Native CLI 依赖..."

cd /Users/lihua/claude/LBS/deer_link

# 重新安装依赖
echo "📦 重新安装依赖..."
npm install

# 验证 CLI
echo "✅ 验证 React Native CLI..."
npx react-native --version

echo ""
echo "✅ 修复完成！"
echo ""
echo "🚀 现在可以运行："
echo "   npm start -- --reset-cache"
echo ""
