# 视频字幕提取工具

一键提取视频字幕，支持 YouTube、Bilibili 等 1000+ 平台

## ✨ 特性

- 🎥 支持 YouTube、Bilibili 等 1000+ 视频平台
- 🎤 使用 OpenAI Whisper 进行高精度语音识别
- 🔄 自动繁简转换（简体中文输出）
- 📝 使用视频标题作为文件名
- 💾 生成 Markdown 格式字幕文件
- 🌍 保留英文术语不翻译

## 🚀 快速开始

### 安装

```bash
# 1. 解压下载的文件
unzip video-subtitle-tool-v1.0.0.zip
cd video-subtitle-tool

# 2. 运行安装脚本
./install.sh
```

### 使用

```bash
# 提取视频字幕
./run.sh "视频链接"

# 示例
./run.sh "https://www.bilibili.com/video/BV1xx411c7mu"
./run.sh "https://www.youtube.com/watch?v=xxxxx"
```

## 📋 系统要求

- **macOS**: 10.13+
- **Linux**: Ubuntu 18.04+ / Debian 10+ / CentOS 7+
- **磁盘空间**: 2GB+
- **网络**: 稳定的互联网连接

## 📚 文档

- [使用说明.md](使用说明.md) - 详细使用教程
- [分发指南.md](分发指南.md) - 如何分享给他人

## 🛠️ 技术栈

- **yt-dlp** - 视频下载
- **FFmpeg** - 音视频处理
- **OpenAI Whisper** - 语音识别
- **OpenCC** - 繁简转换
- **Python 3.12** - 主程序语言

## 📦 包含文件

```
video-subtitle-tool/
├── video_subtitle_agent.py    # 主程序
├── requirements.txt            # Python 依赖
├── install.sh                  # 安装脚本
├── run.sh                      # 运行脚本
├── 使用说明.md                 # 详细文档
├── 分发指南.md                 # 分发说明
└── README.md                   # 本文件
```

## 🎯 使用示例

### 基本用法

```bash
./run.sh "https://www.bilibili.com/video/BV1E6nvzvE5n"
```

输出文件：
```
/Users/bytedance/Documents/lin_knowledge/视频标题.md
```

### 自定义文件名

```bash
./run.sh "视频链接" "我的笔记"
```

输出文件：
```
/Users/bytedance/Documents/lin_knowledge/我的笔记.md
```

## 📄 输出格式

```markdown
# 视频字幕

## 内容

这里是识别出的字幕内容...

---

## 原始视频地址

https://原始视频链接
```

## ❓ 常见问题

### Q: 支持哪些视频平台？

A: 支持 1000+ 平台，包括 YouTube、Bilibili、Twitter、TikTok 等。
完整列表：https://github.com/yt-dlp/yt-dlp/blob/master/supportedsites.md

### Q: 识别准确率如何？

A: 使用 OpenAI Whisper 模型，中文识别准确率通常在 85-95% 之间，取决于音频质量。

### Q: 如何提高识别准确率？

A:
1. 修改代码使用更大的模型（medium 或 large）
2. 确保视频音质清晰
3. 避免背景噪音过大的视频

### Q: 处理一个视频需要多久？

A:
- 5 分钟视频：约 1-2 分钟
- 10 分钟视频：约 2-4 分钟
- 30 分钟视频：约 6-12 分钟

时间取决于视频长度、模型大小和系统性能。

### Q: 可以批量处理吗？

A: 可以。创建包含多个视频链接的文件，然后用脚本批量处理：

```bash
while read url; do
    ./run.sh "$url"
done < videos.txt
```

## 🔧 高级配置

### 修改输出目录

编辑 `video_subtitle_agent.py` 第 20 行：

```python
def __init__(self, output_dir: str = "/你的/路径"):
```

### 更换 Whisper 模型

编辑 `video_subtitle_agent.py` 第 118 行：

```python
"--model", "medium",  # tiny, base, small, medium, large
```

## 📄 许可证

MIT License - 可自由使用、修改和分发

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 💬 反馈

如有问题或建议，欢迎反馈。

---

**开始提取你的视频字幕吧！** 🎉
