#!/bin/bash
# 快速检查ANDROID_HOME设置

source ~/.zshrc 2>/dev/null

echo "════════════════════════════════════════════"
echo "  快速检查 ANDROID_HOME"
echo "════════════════════════════════════════════"
echo ""

if [ -z "$ANDROID_HOME" ]; then
    echo "❌ ANDROID_HOME 未设置"
    echo ""
    echo "解决方法:"
    echo "1. 关闭这个终端窗口"
    echo "2. 打开一个新的终端窗口"
    echo "3. 运行: echo \$ANDROID_HOME"
    echo ""
    echo "或者在当前窗口运行:"
    echo "source ~/.zshrc"
    exit 1
else
    echo "✅ ANDROID_HOME 已设置"
    echo "   $ANDROID_HOME"
fi

echo ""

# 检查SDK目录
if [ -d "$ANDROID_HOME" ]; then
    echo "✅ Android SDK 目录存在"
else
    echo "❌ Android SDK 目录不存在"
    exit 1
fi

echo ""

# 检查关键工具
echo "检查Android工具..."
if command -v adb &> /dev/null; then
    echo "✅ adb: $(which adb)"
else
    echo "❌ adb 未找到"
fi

echo ""
echo "════════════════════════════════════════════"
echo "  🎉 设置检查完成！"
echo "════════════════════════════════════════════"
echo ""
echo "你现在可以运行:"
echo "  cd /Users/lihua/claude/LBS/deer_link"
echo "  npm run android"
echo ""
