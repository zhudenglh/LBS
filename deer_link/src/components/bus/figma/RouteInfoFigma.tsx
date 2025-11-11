/**
 * RouteInfo - Figma完整还原 (NativeWind)
 * 参考: /Users/lihua/claude/figma/Bus5
 */

import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Svg, { Path, G } from 'react-native-svg';
import LinearGradient from 'react-native-linear-gradient';

// 下车提醒图标（铃铛）
function ReminderIcon({ size = 14 }: { size?: number }) {
  return (
    <Svg width={size} height={size * 1.07} viewBox="0 0 28 30" fill="none">
      <G>
        <Path
          d="M22.8707 20.3218V12.389C22.8707 8.336 19.838 4.934 15.7605 3.9785V3.40625C15.7605 2.07975 14.6212 1 13.2177 1C11.8177 1 10.6767 2.07975 10.6767 3.40625V3.9785C6.5975 4.934 3.5665 8.336 3.5665 12.389V20.3848L2.625 23.1795V23.3458C2.625 24.177 3.325 24.856 4.1825 24.856H22.2355C23.1052 24.856 23.8105 24.1718 23.8105 23.33V23.1673L22.8707 20.3218ZM12.6927 3.40625C12.6927 3.2225 12.908 3.016 13.2177 3.016C13.5275 3.016 13.741 3.2225 13.741 3.40625V3.716C13.6412 3.7125 13.5485 3.70375 13.447 3.70375H12.985C12.8852 3.70375 12.7872 3.716 12.691 3.716V3.40625H12.6927ZM4.87025 22.84L5.5825 20.7173V12.3925C5.5825 8.7175 8.90225 5.72675 12.985 5.72675H13.447C17.5297 5.72675 20.8495 8.71925 20.8495 12.3943V20.6525L21.574 22.8435H4.8685V22.84H4.87025ZM13.4995 26.9875C12.5387 26.9875 11.7565 26.4958 11.7565 25.4843H9.73875C9.73875 27.502 11.4257 29.0018 13.5012 29.0018C15.5715 29.0018 17.2585 27.5003 17.2585 25.4843H15.2407C15.2425 26.4958 14.4602 26.9858 13.4995 26.9858V26.9875Z"
          fill="white"
        />
      </G>
    </Svg>
  );
}

interface RouteInfoProps {
  direction?: string;
  nextStation?: string;
  estimatedMinutes?: number;
}

export default function RouteInfoFigma({
  direction = '开往·张江高科方向',
  nextStation = '东浦路',
  estimatedMinutes = 3
}: RouteInfoProps) {
  const [reminderActive, setReminderActive] = useState(false);

  const handleReminderPress = () => {
    setReminderActive(!reminderActive);
  };

  return (
    <View className="bg-white px-[14px] mt-[8px]" style={{ paddingTop: 16, paddingBottom: 2 }}>
      <View className="flex-row items-center justify-between" style={{ minHeight: 70 }}>
        {/* 左侧：路线信息 */}
        <View className="flex-1 justify-center mr-[6px]" style={{ gap: 14 }}>
          <Text
            className="text-[#1c1e21] font-medium"
            style={{
              fontSize: 16,
              lineHeight: 22,
              includeFontPadding: false,
              textAlignVertical: 'center'
            }}
          >
            {direction}
          </Text>
          <Text
            className="text-[#1293fe] font-medium"
            style={{
              fontSize: 14,
              lineHeight: 20,
              includeFontPadding: false,
              textAlignVertical: 'center'
            }}
          >
            下一站·{nextStation}·预计{estimatedMinutes}分钟
          </Text>
        </View>

        {/* 右侧：下车提醒按钮 */}
        <TouchableOpacity onPress={handleReminderPress} activeOpacity={0.8}>
          <LinearGradient
            colors={reminderActive ? ['#FFB800', '#FFC700'] : ['#1293fe', '#1293fe']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 3,
              paddingHorizontal: 10,
              paddingVertical: 7,
              borderRadius: 20,
              height: 38,
              width: 105
            }}
          >
            <ReminderIcon size={14} />
            <Text
              className="text-white font-medium"
              style={{
                fontSize: 14,
                lineHeight: 20,
                includeFontPadding: false,
                textAlignVertical: 'center'
              }}
            >
              下车提醒
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}
