// BellIcon - 铃铛图标（精确Figma尺寸：24×24px）
// Node ID: 1:677 - Frame (到站提醒按钮图标)
// 设计说明：通知铃铛图标

import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface BellIconProps {
  size?: number;
  color?: string;
}

export default function BellIcon({
  size = 24,
  color = '#000000'
}: BellIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* 铃铛主体 */}
      <Path
        d="M12 4C9.79086 4 8 5.79086 8 8V10.382C8 10.735 7.89464 11.0796 7.69618 11.3712L6.19618 13.6288C5.5116 14.6328 6.2312 16 7.44721 16H16.5528C17.7688 16 18.4884 14.6328 17.8038 13.6288L16.3038 11.3712C16.1054 11.0796 16 10.735 16 10.382V8C16 5.79086 14.2091 4 12 4Z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* 铃铛下方摆动部分 */}
      <Path
        d="M10 18C10.2761 18.5982 10.8835 19 11.6 19H12.4C13.1165 19 13.7239 18.5982 14 18"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
