#!/bin/bash

echo "════════════════════════════════════════════════════════"
echo "  Android环境验证脚本"
echo "════════════════════════════════════════════════════════"
echo ""

# 检查ANDROID_HOME
if [ -z "$ANDROID_HOME" ]; then
    echo "❌ ANDROID_HOME 未设置"
    echo "   请运行: source ~/.zshrc"
else
    echo "✅ ANDROID_HOME = $ANDROID_HOME"
fi

echo ""

# 检查Android SDK目录
if [ -d "$HOME/Library/Android/sdk" ]; then
    echo "✅ Android SDK 已安装在: $HOME/Library/Android/sdk"
else
    echo "❌ Android SDK 未找到"
fi

echo ""

# 检查adb
if command -v adb &> /dev/null; then
    echo "✅ adb 已安装"
    adb --version 2>&1 | grep "Android Debug Bridge"
else
    echo "❌ adb 未找到"
fi

echo ""

# 检查Java
if command -v java &> /dev/null; then
    echo "✅ Java 已安装"
    java -version 2>&1 | grep "version"
else
    echo "❌ Java 未找到"
fi

echo ""

# 检查模拟器
if [ -d "$HOME/Library/Android/sdk/emulator" ]; then
    echo "✅ Android模拟器目录存在"
else
    echo "⚠️  Android模拟器目录未找到"
fi

echo ""
echo "════════════════════════════════════════════════════════"

# 检查可用的模拟器
if command -v emulator &> /dev/null; then
    echo ""
    echo "可用的模拟器列表:"
    emulator -list-avds
fi
