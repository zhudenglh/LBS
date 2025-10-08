#!/bin/bash
# 打包脚本 - 创建分发压缩包

echo "📦 正在打包视频字幕提取工具..."
echo ""

# 定义打包文件
PACKAGE_NAME="video-subtitle-tool"
VERSION="1.0.0"
OUTPUT_FILE="${PACKAGE_NAME}-v${VERSION}.zip"

# 要打包的文件
FILES=(
    "video_subtitle_agent.py"
    "requirements.txt"
    "install.sh"
    "run.sh"
    "使用说明.md"
    "分发指南.md"
)

# 检查文件是否存在
echo "检查文件..."
MISSING_FILES=()
for file in "${FILES[@]}"; do
    if [ ! -f "$file" ]; then
        MISSING_FILES+=("$file")
    else
        echo "✅ $file"
    fi
done

if [ ${#MISSING_FILES[@]} -ne 0 ]; then
    echo ""
    echo "❌ 缺少以下文件："
    for file in "${MISSING_FILES[@]}"; do
        echo "  - $file"
    done
    exit 1
fi

echo ""
echo "创建压缩包..."

# 删除旧的压缩包
if [ -f "$OUTPUT_FILE" ]; then
    rm "$OUTPUT_FILE"
    echo "已删除旧的压缩包"
fi

# 创建压缩包
zip -r "$OUTPUT_FILE" "${FILES[@]}"

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 打包成功！"
    echo ""
    echo "输出文件: $OUTPUT_FILE"
    echo "文件大小: $(du -h "$OUTPUT_FILE" | cut -f1)"
    echo ""
    echo "包含的文件："
    zipinfo -1 "$OUTPUT_FILE"
    echo ""
    echo "现在可以将 $OUTPUT_FILE 分享给其他人！"
else
    echo ""
    echo "❌ 打包失败"
    exit 1
fi
