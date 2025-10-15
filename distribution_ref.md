# 视频字幕提取工具 - 分发指南

## 📦 如何分享给其他人

### 方法一：完整打包（推荐）

将以下文件打包成一个 ZIP 压缩包发送给他人：

```
video-subtitle-tool.zip
├── video_subtitle_agent.py    # 主程序
├── requirements.txt            # Python依赖列表
├── install.sh                  # 自动安装脚本
├── run.sh                      # 运行脚本
└── 使用说明.md                 # 使用文档
```

**创建压缩包命令：**
```bash
zip -r video-subtitle-tool.zip \
    video_subtitle_agent.py \
    requirements.txt \
    install.sh \
    run.sh \
    使用说明.md
```

### 方法二：上传到 GitHub

1. 创建 GitHub 仓库
2. 上传所有文件
3. 分享仓库链接给他人

他人只需：
```bash
git clone https://github.com/你的用户名/video-subtitle-tool.git
cd video-subtitle-tool
./install.sh
./run.sh "视频链接"
```

## 📋 接收者使用步骤

### macOS 用户

1. **解压文件**
   ```bash
   unzip video-subtitle-tool.zip
   cd video-subtitle-tool
   ```

2. **运行安装脚本**
   ```bash
   ./install.sh
   ```

   安装脚本会自动：
   - 安装 Homebrew（如果未安装）
   - 安装 ffmpeg、opencc、Python 3.12
   - 创建虚拟环境
   - 安装 Python 依赖

3. **使用工具**
   ```bash
   ./run.sh "视频链接"
   ```

### Linux 用户

1. **解压文件**
   ```bash
   unzip video-subtitle-tool.zip
   cd video-subtitle-tool
   ```

2. **运行安装脚本**
   ```bash
   chmod +x install.sh run.sh
   ./install.sh
   ```

3. **使用工具**
   ```bash
   ./run.sh "视频链接"
   ```

### Windows 用户

Windows 用户需要手动安装依赖：

1. **安装 Python 3.12**
   - 访问 https://www.python.org/downloads/
   - 下载并安装 Python 3.12

2. **安装 FFmpeg**
   - 访问 https://ffmpeg.org/download.html
   - 下载 Windows 版本
   - 解压并添加到系统 PATH

3. **安装 OpenCC**
   - 访问 https://github.com/BYVoid/OpenCC/releases
   - 下载 Windows 版本
   - 安装并添加到系统 PATH

4. **安装 Python 依赖**
   ```cmd
   python -m venv venv
   venv\Scripts\activate
   pip install -r requirements.txt
   ```

5. **运行程序**
   ```cmd
   venv\Scripts\activate
   python video_subtitle_agent.py "视频链接"
   ```

## 🔧 系统要求

### macOS
- macOS 10.13 或更高版本
- 至少 2GB 可用磁盘空间
- 网络连接（用于下载依赖和视频）

### Linux
- Ubuntu 18.04+ / Debian 10+ / CentOS 7+
- 至少 2GB 可用磁盘空间
- root 权限（用于安装系统依赖）

### Windows
- Windows 10 或更高版本
- 至少 2GB 可用磁盘空间

## 📝 常见问题

### Q: 安装失败怎么办？
A: 检查网络连接，尝试重新运行 `./install.sh`

### Q: ffmpeg 安装太慢？
A: macOS 可以使用国内镜像：
```bash
export HOMEBREW_BOTTLE_DOMAIN=https://mirrors.tuna.tsinghua.edu.cn/homebrew-bottles
brew install ffmpeg
```

### Q: Python 依赖安装失败？
A: 使用国内镜像：
```bash
pip install -i https://pypi.tuna.tsinghua.edu.cn/simple -r requirements.txt
```

### Q: 如何更改输出目录？
A: 修改 `video_subtitle_agent.py` 第 20 行：
```python
def __init__(self, output_dir: str = "/你的/自定义/路径"):
```

## 📄 开源许可

MIT License - 可自由使用、修改和分发

## 🤝 技术支持

遇到问题请检查：
1. 系统依赖是否正确安装
2. Python 版本是否为 3.12+
3. 虚拟环境是否正确激活
4. 视频链接是否有效

---

**祝使用愉快！** 🎉
