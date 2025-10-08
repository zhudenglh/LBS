#!/bin/bash
# 视频字幕提取工具自动安装脚本

set -e

echo "================================================"
echo "视频字幕提取工具 - 自动安装脚本"
echo "================================================"
echo ""

# 检测操作系统
OS="$(uname -s)"
case "${OS}" in
    Darwin*)    PLATFORM="macOS";;
    Linux*)     PLATFORM="Linux";;
    *)          PLATFORM="UNKNOWN";;
esac

echo "检测到操作系统: ${PLATFORM}"
echo ""

# macOS 安装
if [ "${PLATFORM}" = "macOS" ]; then
    echo "步骤 1/5: 检查 Homebrew..."
    if ! command -v brew &> /dev/null; then
        echo "❌ 未安装 Homebrew，正在安装..."
        /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    else
        echo "✅ Homebrew 已安装"
    fi
    echo ""

    echo "步骤 2/5: 安装系统依赖..."
    echo "正在安装 ffmpeg, opencc, python@3.12..."
    brew install ffmpeg opencc python@3.12
    echo "✅ 系统依赖安装完成"
    echo ""

    # 设置 Python 路径
    PYTHON_PATH="/opt/homebrew/bin/python3.12"
    PIP_PATH="/opt/homebrew/bin/pip3.12"

# Linux 安装
elif [ "${PLATFORM}" = "Linux" ]; then
    echo "步骤 1/5: 检查包管理器..."
    if command -v apt-get &> /dev/null; then
        PKG_MANAGER="apt-get"
    elif command -v yum &> /dev/null; then
        PKG_MANAGER="yum"
    else
        echo "❌ 不支持的包管理器"
        exit 1
    fi
    echo "✅ 使用 ${PKG_MANAGER}"
    echo ""

    echo "步骤 2/5: 安装系统依赖..."
    if [ "${PKG_MANAGER}" = "apt-get" ]; then
        sudo apt-get update
        sudo apt-get install -y ffmpeg opencc python3 python3-pip python3-venv
    else
        sudo yum install -y ffmpeg opencc python3 python3-pip
    fi
    echo "✅ 系统依赖安装完成"
    echo ""

    PYTHON_PATH="python3"
    PIP_PATH="pip3"
else
    echo "❌ 不支持的操作系统"
    exit 1
fi

echo "步骤 3/5: 创建虚拟环境..."
if [ ! -d "venv" ]; then
    ${PYTHON_PATH} -m venv venv
    echo "✅ 虚拟环境创建完成"
else
    echo "✅ 虚拟环境已存在"
fi
echo ""

echo "步骤 4/5: 安装 Python 依赖..."
source venv/bin/activate
pip install -i https://pypi.tuna.tsinghua.edu.cn/simple yt-dlp openai-whisper
echo "✅ Python 依赖安装完成"
echo ""

echo "步骤 5/5: 创建启动脚本..."

# 创建启动脚本
cat > run.sh << 'EOF'
#!/bin/bash
# 视频字幕提取工具启动脚本

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "${SCRIPT_DIR}"

# 激活虚拟环境
source venv/bin/activate

# 运行程序
python video_subtitle_agent.py "$@"
EOF

chmod +x run.sh

echo "✅ 启动脚本创建完成"
echo ""

echo "================================================"
echo "✅ 安装完成！"
echo "================================================"
echo ""
echo "使用方法："
echo "  ./run.sh \"视频链接\""
echo ""
echo "示例："
echo "  ./run.sh \"https://www.bilibili.com/video/BV1xx411c7mu\""
echo ""
