// Remote SVG Component - 从网络URL加载并渲染SVG
import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { getFigmaAssetUrl } from '../../utils/figma';

interface RemoteSvgProps {
  uri: string;
  width: number;
  height: number;
  fill?: string;
}

/**
 * 清理SVG XML，移除React Native不支持的特性
 */
function cleanSvgXml(xml: string, shouldRemoveFill: boolean = false): string {
  let cleaned = xml;

  // 1. 移除CSS变量（如 var(--stroke-0, #909497)）
  // 替换为fallback颜色值
  cleaned = cleaned.replace(/var\([^,]+,\s*([^)]+)\)/g, '$1');

  // 2. 移除不支持的CSS变量引用（没有fallback的）
  cleaned = cleaned.replace(/var\([^)]+\)/g, '#000000');

  // 3. 移除style标签及其内容
  cleaned = cleaned.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');

  // 4. 移除所有style属性（包括 style="display: block;" 等）
  cleaned = cleaned.replace(/\s+style="[^"]*"/g, '');

  // 5. 移除class属性（CSS类在RN中不起作用）
  cleaned = cleaned.replace(/\s+class="[^"]*"/g, '');

  // 6. 移除preserveAspectRatio="none"（可能导致问题）
  cleaned = cleaned.replace(/\s+preserveAspectRatio="none"/g, '');

  // 7. 移除overflow属性
  cleaned = cleaned.replace(/\s+overflow="[^"]*"/g, '');

  // 8. 移除width="100%" height="100%"（SvgXml不支持百分比）
  cleaned = cleaned.replace(/\s+width="100%"/g, '');
  cleaned = cleaned.replace(/\s+height="100%"/g, '');

  // 9. 移除fill属性（如果需要使用外部传入的fill颜色）
  if (shouldRemoveFill) {
    cleaned = cleaned.replace(/\s+fill="[^"]*"/g, '');
  }

  // 10. 处理transform中的scale，确保正确格式
  cleaned = cleaned.replace(/transform="([^"]*)"/g, (match, content) => {
    // 简化transform，只保留基本的translate、rotate、scale
    let simplified = content
      .replace(/matrix\([^)]+\)/g, '') // 移除matrix
      .trim();
    return simplified ? `transform="${simplified}"` : '';
  });

  return cleaned;
}

/**
 * 从Figma localhost或网络URL加载并渲染SVG
 * 使用SvgXml而不是SvgUri，因为SvgUri在某些情况下不可靠
 */
export default function RemoteSvg({ uri, width, height, fill }: RemoteSvgProps) {
  const [svgXml, setSvgXml] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadSvg() {
      try {
        setLoading(true);
        setError(false);

        // 转换URL以支持Android模拟器
        const url = getFigmaAssetUrl(uri);

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        let xml = await response.text();

        // 清理SVG，移除不支持的特性
        // 如果传入了fill颜色，移除SVG内部的fill属性，让外部颜色生效
        xml = cleanSvgXml(xml, !!fill);

        if (!cancelled) {
          setSvgXml(xml);
          setLoading(false);
        }
      } catch (err) {
        console.error('Failed to load SVG:', uri, err);
        if (!cancelled) {
          setError(true);
          setLoading(false);
        }
      }
    }

    loadSvg();

    return () => {
      cancelled = true;
    };
  }, [uri, fill]);

  if (loading) {
    return (
      <View style={{ width, height, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="small" color="#999" />
      </View>
    );
  }

  if (error || !svgXml) {
    // 静默失败 - 显示空白View
    return <View style={{ width, height }} />;
  }

  return (
    <SvgXml
      xml={svgXml}
      width={width}
      height={height}
      fill={fill}
    />
  );
}
