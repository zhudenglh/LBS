// Bus Icon - 公交车图标（简化版SVG）

import React from 'react';
import { View } from 'react-native';
import Svg, { Path, Rect, Circle } from 'react-native-svg';

interface BusIconProps {
  size?: number;
  color?: string;
}

export default function BusIcon({ size = 40, color = '#4CAF50' }: BusIconProps) {
  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size} viewBox="0 0 40 40" fill="none">
        {/* 公交车主体 */}
        <Rect x="8" y="10" width="24" height="20" rx="2" fill={color} />

        {/* 车窗 */}
        <Rect x="11" y="14" width="7" height="6" rx="1" fill="white" />
        <Rect x="22" y="14" width="7" height="6" rx="1" fill="white" />

        {/* 车轮 */}
        <Circle cx="14" cy="32" r="2.5" fill="#333" />
        <Circle cx="26" cy="32" r="2.5" fill="#333" />

        {/* 车顶标志 */}
        <Rect x="16" y="7" width="8" height="3" rx="1" fill={color} />
      </Svg>
    </View>
  );
}
