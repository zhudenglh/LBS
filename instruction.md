# 视频字幕提取工具 - 使用说明

## 📖 简介

这是一个自动从视频链接提取字幕的工具，支持 YouTube、Bilibili 等 1000+ 视频平台。

### ✨ 主要功能

- ✅ 自动下载视频
- ✅ 提取音频并转换为文字
- ✅ 自动繁简转换（简体中文）
- ✅ 保留英文术语不翻译
- ✅ 使用视频标题作为文件名
- ✅ 生成 Markdown 格式字幕文件

## 🚀 快速开始

### 第一次使用

1. **运行安装脚本**
   ```bash
   ./install.sh
   ```

   等待安装完成（大约 5-10 分钟）

2. **提取视频字幕**
   ```bash
   ./run.sh "视频链接"
   ```

### 日常使用

```bash
# 基本用法
./run.sh "视频链接"

# 自定义输出文件名
./run.sh "视频链接" "自定义文件名"
```

## 📚 使用示例

### 示例 1：Bilibili 视频

```bash
./run.sh "https://www.bilibili.com/video/BV1xx411c7mu"
```

输出：
- 文件名：使用视频标题
- 位置：`/Users/bytedance/Documents/lin_knowledge/`
- 格式：Markdown (.md)

### 示例 2：YouTube 视频

```bash
./run.sh "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
```

### 示例 3：自定义文件名

```bash
./run.sh "https://www.bilibili.com/video/BV1xx411c7mu" "我的视频"
```

输出文件：`我的视频.md`

## 📂 输出格式

生成的 Markdown 文件格式：

```markdown
# 视频字幕

## 内容

[这里是识别出的字幕内容，已转换为简体中文]

---

## 原始视频地址

https://视频链接
```

## ⚙️ 高级设置

### 修改输出目录

编辑 `video_subtitle_agent.py` 文件第 20 行：

```python
def __init__(self, output_dir: str = "/你的/自定义/路径"):
```

### 调整 Whisper 模型

编辑 `video_subtitle_agent.py` 文件第 118 行：

```python
"--model", "base",  # 可选: tiny, base, small, medium, large
```

**模型说明：**
- `tiny`：最快，精度最低（约 1 分钟处理 10 分钟视频）
- `base`：较快，适中精度（约 2 分钟处理 10 分钟视频）⭐ 默认
- `small`：平衡选择（约 5 分钟处理 10 分钟视频）
- `medium`：高精度（约 10 分钟处理 10 分钟视频）
- `large`：最高精度（约 20 分钟处理 10 分钟视频）

### 修改识别语言

编辑 `video_subtitle_agent.py` 文件第 119 行：

```python
"--language", "Chinese",  # 中文
# "--language", "English",  # 英文
# "--language", "Japanese",  # 日文
```

## 🌐 支持的视频平台

通过 `yt-dlp` 支持 1000+ 平台，包括：

- YouTube
- Bilibili（哔哩哔哩）
- Twitter/X
- TikTok
- Vimeo
- Dailymotion
- Facebook
- Instagram
- 更多...

完整列表：https://github.com/yt-dlp/yt-dlp/blob/master/supportedsites.md

## ❓ 常见问题

### Q1: 下载视频失败

**原因：** 网络问题或平台限制

**解决方法：**
1. 检查网络连接
2. 尝试更新 yt-dlp：
   ```bash
   source venv/bin/activate
   pip install -U yt-dlp
   ```
3. 某些平台可能需要登录，暂不支持

### Q2: 字幕识别不准确

**解决方法：**
1. 使用更大的 Whisper 模型（如 `medium` 或 `large`）
2. 确保视频音质清晰
3. 对于特定语言，在代码中指定正确的语言

### Q3: 繁简转换失败

**原因：** opencc 未正确安装

**解决方法：**
```bash
brew install opencc  # macOS
sudo apt-get install opencc  # Linux
```

### Q4: 处理速度慢

**优化方法：**
1. 使用更小的 Whisper 模型（如 `tiny` 或 `base`）
2. 使用 GPU 加速（需要支持 CUDA 的显卡）
3. 减少视频长度

### Q5: 如何批量处理视频？

创建一个包含多个视频链接的文件 `videos.txt`：
```
https://www.bilibili.com/video/BV1xx411c7mu
https://www.bilibili.com/video/BV1yy411c7mu
https://www.bilibili.com/video/BV1zz411c7mu
```

然后运行：
```bash
while read url; do
    ./run.sh "$url"
done < videos.txt
```

## 🔧 系统要求

- **macOS**: 10.13 或更高
- **Linux**: Ubuntu 18.04+ / Debian 10+ / CentOS 7+
- **磁盘空间**: 至少 2GB
- **内存**: 建议 4GB 以上
- **网络**: 稳定的互联网连接

## 📊 性能参考

| 视频时长 | Whisper 模型 | 处理时间（估算） |
|---------|-------------|-----------------|
| 5 分钟   | tiny        | ~30 秒          |
| 5 分钟   | base        | ~1 分钟         |
| 5 分钟   | small       | ~2.5 分钟       |
| 10 分钟  | base        | ~2 分钟         |
| 30 分钟  | base        | ~6 分钟         |

*实际时间取决于系统性能和网络速度

## 🛠️ 故障排查

### 检查安装

```bash
# 检查 ffmpeg
which ffmpeg
ffmpeg -version

# 检查 opencc
which opencc
opencc --version

# 检查 Python 环境
source venv/bin/activate
python --version
pip list | grep -E "yt-dlp|whisper"
```

### 查看详细日志

运行程序时会显示每个步骤的进度：
- 📝 获取视频标题
- 📥 下载视频
- 🔊 提取音频
- 🎤 转录音频
- 🔄 繁简转换
- ✅ 保存文件

如果某个步骤失败，会显示 ❌ 错误信息

## 💡 使用技巧

1. **指定输出文件名**：对于重要视频，建议自定义文件名
2. **批量处理**：可以写脚本批量处理多个视频
3. **定期更新**：定期更新 yt-dlp 以支持最新的网站
4. **网络问题**：下载大视频时建议使用稳定网络

## 📞 获取帮助

如遇问题，请检查：
1. 所有依赖是否正确安装
2. 虚拟环境是否激活
3. 视频链接是否有效
4. 网络连接是否正常

---

**享受高效的字幕提取体验！** 🎉
