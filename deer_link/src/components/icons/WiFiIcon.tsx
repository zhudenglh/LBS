// WiFiIcon - WiFi图标（精确Figma尺寸：30×30px）
// Node ID: 1:608 - wifi连接中
// 设计说明：WiFi信号波纹图标

import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface WiFiIconProps {
  size?: number;
  color?: string;
}

export default function WiFiIcon({
  size = 30,
  color = '#1c1e21'
}: WiFiIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* WiFi信号波纹 - 3层弧线 */}
      <Path
        d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9z"
        fill={color}
        opacity="0.3"
      />
      <Path
        d="M5 13l2 2c2.76-2.76 7.24-2.76 10 0l2-2c-3.87-3.87-10.13-3.87-14 0z"
        fill={color}
        opacity="0.6"
      />
      <Path
        d="M9 17l2 2c1.1-1.1 2.9-1.1 4 0l2-2c-2.21-2.21-5.79-2.21-8 0z"
        fill={color}
      />
      {/* WiFi中心点 */}
      <Path
        d="M12 21c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"
        fill={color}
      />
    </Svg>
  );
}
