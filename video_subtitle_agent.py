#!/usr/bin/env python3
"""
视频字幕提取Agent
功能：下载视频 -> 提取音频 -> 转换为文字 -> 保存为Markdown文件
"""

import os
import sys
from pathlib import Path
from typing import Optional, Tuple
import subprocess
import tempfile
import json
import re


class VideoSubtitleAgent:
    """视频字幕提取代理"""

    def __init__(self, output_dir: str = "/Users/bytedance/Documents/lin_knowledge"):
        """
        初始化Agent

        Args:
            output_dir: 字幕文件输出目录
        """
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(parents=True, exist_ok=True)

    def get_video_title(self, video_url: str) -> Optional[str]:
        """
        获取视频标题

        Args:
            video_url: 视频链接

        Returns:
            视频标题，失败返回None
        """
        try:
            print(f"📝 正在获取视频标题...")

            cmd = [
                "yt-dlp",
                "--print", "%(title)s",
                "--no-warnings",
                video_url
            ]

            result = subprocess.run(cmd, capture_output=True, text=True)

            if result.returncode == 0:
                title = result.stdout.strip()
                # 清理文件名中的非法字符
                title = re.sub(r'[<>:"/\\|?*]', '_', title)
                # 限制文件名长度
                if len(title) > 100:
                    title = title[:100]
                print(f"✅ 视频标题: {title}")
                return title
            else:
                print(f"⚠️  获取标题失败，使用默认文件名")
                return None

        except Exception as e:
            print(f"⚠️  获取标题出错: {str(e)}，使用默认文件名")
            return None

    def convert_to_simplified(self, text: str) -> str:
        """
        将繁体中文转换为简体中文

        Args:
            text: 输入文本

        Returns:
            简体中文文本
        """
        try:
            # 尝试使用 opencc 转换
            result = subprocess.run(
                ["opencc", "-c", "t2s"],
                input=text,
                capture_output=True,
                text=True,
                timeout=30
            )

            if result.returncode == 0:
                return result.stdout
            else:
                print("⚠️  opencc转换失败，尝试使用Python库...")
                # 如果opencc命令失败，尝试使用Python库
                try:
                    from opencc import OpenCC
                    cc = OpenCC('t2s')
                    return cc.convert(text)
                except ImportError:
                    print("⚠️  未安装opencc-python-reimplemented，返回原文本")
                    return text
        except Exception as e:
            print(f"⚠️  繁简转换出错: {str(e)}，返回原文本")
            return text

    def download_video(self, video_url: str, output_path: str) -> bool:
        """
        下载视频

        Args:
            video_url: 视频链接
            output_path: 输出路径

        Returns:
            是否成功
        """
        try:
            print(f"📥 正在下载视频: {video_url}")

            # 使用yt-dlp下载视频
            cmd = [
                "yt-dlp",
                "-o", output_path,
                video_url
            ]

            result = subprocess.run(cmd, capture_output=True, text=True)

            if result.returncode == 0:
                print(f"✅ 视频下载成功: {output_path}")
                return True
            else:
                print(f"❌ 视频下载失败: {result.stderr}")
                return False

        except Exception as e:
            print(f"❌ 下载过程出错: {str(e)}")
            return False

    def video_to_audio(self, video_path: str, audio_path: str) -> bool:
        """
        视频转音频

        Args:
            video_path: 视频文件路径
            audio_path: 音频输出路径

        Returns:
            是否成功
        """
        try:
            print(f"🔊 正在提取音频: {video_path}")

            # 使用ffmpeg提取音频
            cmd = [
                "ffmpeg",
                "-i", video_path,
                "-vn",  # 不处理视频
                "-acodec", "pcm_s16le",  # 音频编码
                "-ar", "16000",  # 采样率16kHz (whisper推荐)
                "-ac", "1",  # 单声道
                "-y",  # 覆盖输出文件
                audio_path
            ]

            result = subprocess.run(cmd, capture_output=True, text=True)

            if result.returncode == 0:
                print(f"✅ 音频提取成功: {audio_path}")
                return True
            else:
                print(f"❌ 音频提取失败: {result.stderr}")
                return False

        except Exception as e:
            print(f"❌ 音频提取出错: {str(e)}")
            return False

    def audio_to_text(self, audio_path: str) -> Optional[str]:
        """
        音频转文字

        Args:
            audio_path: 音频文件路径

        Returns:
            识别的文字内容，失败返回None
        """
        try:
            print(f"🎤 正在转录音频: {audio_path}")

            # 使用whisper进行语音识别
            cmd = [
                "whisper",
                audio_path,
                "--model", "base",  # 可选: tiny, base, small, medium, large
                "--language", "Chinese",  # 指定中文
                "--output_format", "txt",
                "--output_dir", str(self.output_dir)
            ]

            result = subprocess.run(cmd, capture_output=True, text=True)

            if result.returncode == 0:
                # 读取生成的txt文件
                audio_name = Path(audio_path).stem
                txt_path = self.output_dir / f"{audio_name}.txt"

                if txt_path.exists():
                    with open(txt_path, 'r', encoding='utf-8') as f:
                        text = f.read().strip()
                    print(f"✅ 音频转录成功，共 {len(text)} 个字符")
                    return text
                else:
                    print(f"❌ 未找到转录文件: {txt_path}")
                    return None
            else:
                print(f"❌ 音频转录失败: {result.stderr}")
                return None

        except Exception as e:
            print(f"❌ 音频转录出错: {str(e)}")
            return None

    def save_to_markdown(self, text: str, video_url: str, output_filename: str) -> str:
        """
        保存字幕为Markdown文件

        Args:
            text: 字幕文本
            video_url: 原始视频链接
            output_filename: 输出文件名

        Returns:
            保存的文件路径
        """
        md_path = self.output_dir / output_filename

        with open(md_path, 'w', encoding='utf-8') as f:
            f.write(f"# 视频字幕\n\n")
            f.write(f"## 内容\n\n")
            f.write(f"{text}\n\n")
            f.write(f"---\n\n")
            f.write(f"## 原始视频地址\n\n")
            f.write(f"{video_url}\n")

        print(f"✅ 字幕已保存至: {md_path}")
        return str(md_path)

    def process_video(self, video_url: str, output_name: Optional[str] = None) -> Optional[str]:
        """
        处理视频的完整流程

        Args:
            video_url: 视频链接
            output_name: 输出文件名（不含扩展名），默认使用视频标题

        Returns:
            生成的Markdown文件路径，失败返回None
        """
        import time

        # 步骤0: 获取视频标题作为文件名
        if output_name is None:
            video_title = self.get_video_title(video_url)
            if video_title:
                output_name = video_title
            else:
                output_name = f"subtitle_{int(time.time())}"

        # 创建临时目录
        with tempfile.TemporaryDirectory() as temp_dir:
            temp_dir = Path(temp_dir)

            # 步骤1: 下载视频
            video_path = temp_dir / f"video.mp4"
            if not self.download_video(video_url, str(video_path)):
                return None

            # 步骤2: 视频转音频
            audio_path = temp_dir / f"audio.wav"
            if not self.video_to_audio(str(video_path), str(audio_path)):
                return None

            # 步骤3: 音频转文字
            text = self.audio_to_text(str(audio_path))
            if text is None:
                return None

            # 步骤4: 繁简转换
            print(f"🔄 正在转换为简体中文...")
            text = self.convert_to_simplified(text)

            # 步骤5: 保存为Markdown
            md_path = self.save_to_markdown(
                text=text,
                video_url=video_url,
                output_filename=f"{output_name}.md"
            )

            return md_path


def main():
    """主函数"""
    if len(sys.argv) < 2:
        print("使用方法: python video_subtitle_agent.py <视频链接> [输出文件名]")
        print("示例: python video_subtitle_agent.py https://www.youtube.com/watch?v=xxxxx my_video")
        sys.exit(1)

    video_url = sys.argv[1]
    output_name = sys.argv[2] if len(sys.argv) > 2 else None

    # 创建agent并处理视频
    agent = VideoSubtitleAgent(output_dir="/Users/bytedance/Documents/lin_knowledge")
    result = agent.process_video(video_url, output_name)

    if result:
        print(f"\n🎉 处理完成！字幕文件: {result}")
    else:
        print(f"\n❌ 处理失败")
        sys.exit(1)


if __name__ == "__main__":
    main()
