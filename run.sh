#!/bin/bash
# 视频字幕提取工具启动脚本

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "${SCRIPT_DIR}"

# 检查虚拟环境是否存在
if [ ! -d "venv" ]; then
    echo "❌ 错误：虚拟环境不存在"
    echo "请先运行安装脚本：./install.sh"
    exit 1
fi

# 激活虚拟环境
source venv/bin/activate

# 检查参数
if [ $# -eq 0 ]; then
    echo "使用方法: ./run.sh <视频链接> [可选的输出文件名]"
    echo ""
    echo "示例："
    echo "  ./run.sh \"https://www.bilibili.com/video/BV1xx411c7mu\""
    echo "  ./run.sh \"https://www.youtube.com/watch?v=xxxxx\" my_video"
    exit 1
fi

# 运行程序
python video_subtitle_agent.py "$@"
