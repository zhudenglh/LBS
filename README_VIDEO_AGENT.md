# 视频字幕提取Agent

自动从视频链接提取字幕的Python工具，支持下载视频、提取音频、语音识别，并生成Markdown格式的字幕文件。

## 功能特性

- ✅ 下载视频（支持YouTube、B站等多平台）
- ✅ 视频转音频提取
- ✅ 音频转文字（使用OpenAI Whisper）
- ✅ 保存为Markdown文档
- ✅ 自动附加原始视频链接

## 安装依赖

### 1. 安装系统依赖

**macOS:**
```bash
brew install ffmpeg
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install ffmpeg
```

**Windows:**
下载并安装 [FFmpeg](https://ffmpeg.org/download.html)

### 2. 安装Python依赖

```bash
pip install -r requirements.txt
```

或手动安装：
```bash
pip install yt-dlp openai-whisper
```

## 使用方法

### 命令行使用

```bash
# 基本用法
python video_subtitle_agent.py <视频链接>

# 指定输出文件名
python video_subtitle_agent.py <视频链接> <输出文件名>
```

### 示例

```bash
# 示例1: YouTube视频
python video_subtitle_agent.py "https://www.youtube.com/watch?v=dQw4w9WgXcQ"

# 示例2: 指定输出文件名
python video_subtitle_agent.py "https://www.youtube.com/watch?v=dQw4w9WgXcQ" my_video

# 示例3: B站视频
python video_subtitle_agent.py "https://www.bilibili.com/video/BV1xx411c7mu"
```

### Python代码使用

```python
from video_subtitle_agent import VideoSubtitleAgent

# 创建Agent实例
agent = VideoSubtitleAgent(output_dir="./my_subtitles")

# 处理视频
video_url = "https://www.youtube.com/watch?v=xxxxx"
result = agent.process_video(video_url, output_name="my_video")

if result:
    print(f"字幕文件已生成: {result}")
```

## 输出格式

生成的Markdown文件格式如下：

```markdown
# 视频字幕

## 内容

[这里是识别出的字幕内容...]

---

## 原始视频地址

https://www.youtube.com/watch?v=xxxxx
```

## 配置选项

### Whisper模型选择

在 `audio_to_text` 方法中可以修改Whisper模型：

- `tiny`: 最快，精度较低（~1GB显存）
- `base`: 较快，适中精度（~1GB显存）
- `small`: 平衡选择（~2GB显存）
- `medium`: 高精度（~5GB显存）
- `large`: 最高精度（~10GB显存）

```python
cmd = [
    "whisper",
    audio_path,
    "--model", "small",  # 修改这里
    ...
]
```

### 语言设置

默认识别中文，可修改为其他语言：

```python
"--language", "English",  # 英文
"--language", "Japanese", # 日文
# 或自动检测
# "--task", "transcribe"  # 不指定语言
```

## 工作流程

1. **下载视频**: 使用 `yt-dlp` 从给定URL下载视频
2. **提取音频**: 使用 `ffmpeg` 将视频转换为16kHz单声道WAV音频
3. **语音识别**: 使用 `Whisper` 将音频转换为文字
4. **生成文档**: 创建包含字幕和原始链接的Markdown文件

## 常见问题

### Q: 下载失败怎么办？
A: 确保安装了最新版本的 `yt-dlp`：
```bash
pip install -U yt-dlp
```

### Q: Whisper识别速度慢？
A: 可以使用更小的模型（如 `tiny` 或 `base`），或使用GPU加速：
```bash
pip install openai-whisper[gpu]
```

### Q: 支持哪些视频平台？
A: 支持 `yt-dlp` 支持的所有平台，包括：
- YouTube
- Bilibili
- Twitter/X
- TikTok
- 等1000+网站

完整列表见：https://github.com/yt-dlp/yt-dlp/blob/master/supportedsites.md

## 许可证

MIT License

## 贡献

欢迎提交Issue和Pull Request！
