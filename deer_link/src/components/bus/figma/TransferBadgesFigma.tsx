/**
 * TransferBadges - Figma完整还原 (NativeWind)
 * 参考: /Users/lihua/claude/figma/Bus5
 */

import React from 'react';
import { View, Text } from 'react-native';
import Svg, { Path } from 'react-native-svg';

interface TransferLine {
  number: string;
  bgColor: string;
  textColor: string;
  type: 'metro' | 'bus';
}

interface TransferBadgesProps {
  lines?: TransferLine[];
}

// 箭头图标
function ArrowRightIcon() {
  return (
    <Svg width={7} height={11} viewBox="0 0 13 23" fill="none">
      <Path
        d="M1.25 1.25L11.25 11.25L1.25 21.25"
        stroke="black"
        strokeOpacity="0.4"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

// 更多图标（三个点）
function MoreDotsIcon() {
  return (
    <Svg width={11.5} height={2.5} viewBox="0 0 23 5" fill="none">
      <Path
        d="M2.5 0C3.88071 0 5 1.11929 5 2.5C5 3.88071 3.88071 5 2.5 5C1.11929 5 0 3.88071 0 2.5C0 1.11929 1.11929 0 2.5 0ZM11.5 0C12.8807 0 14 1.11929 14 2.5C14 3.88071 12.8807 5 11.5 5C10.1193 5 9 3.88071 9 2.5C9 1.11929 10.1193 0 11.5 0ZM20.5 0C21.8807 0 23 1.11929 23 2.5C23 3.88071 21.8807 5 20.5 5C19.1193 5 18 3.88071 18 2.5C18 1.11929 19.1193 0 20.5 0Z"
        fill="#7C84A1"
      />
    </Svg>
  );
}

const defaultLines: TransferLine[] = [
  { number: '4号线', bgColor: '#8565c4', textColor: '#FFFFFF', type: 'metro' },
  { number: 'S3号线', bgColor: '#c779bc', textColor: '#FFFFFF', type: 'metro' },
  { number: '33路', bgColor: '#dbefff', textColor: '#0285f0', type: 'bus' },
];

export default function TransferBadgesFigma({ lines = defaultLines }: TransferBadgesProps) {
  return (
    <View className="flex items-center mt-[4px]">
      <View className="bg-[#f4f6fa] rounded-[4px] px-[7px] py-[5px] w-[347px] relative h-[24px]">
        {/* 使用绝对定位的Grid布局 */}
        {/* 标题：可换乘 - 左侧 */}
        <View className="absolute left-0 top-[3px] h-[14px] flex items-center justify-center ml-0 mt-[3px]">
          <Text className="text-[#5d606a] text-[14px] leading-[14px]">可换乘</Text>
        </View>

        {/* 更多按钮 - 右侧 */}
        <View className="absolute right-0 top-[4.5px] h-[11px] w-[35px] flex-row items-center justify-center">
          <Text className="text-[rgba(0,0,0,0.4)] text-[12px] leading-[14px]">更多</Text>
          <View className="ml-[2px]">
            <ArrowRightIcon />
          </View>
        </View>

        {/* 徽章列表 - 中间 */}
        <View className="absolute left-[52px] top-0 h-full flex-row items-center justify-center gap-[5px]">
          {lines.map((line, index) => (
            <View
              key={index}
              className="h-[19px] w-[47.5px] items-center justify-center rounded-[4px] px-[5px] py-[4.5px]"
              style={{ backgroundColor: line.bgColor }}
            >
              <Text className="text-[12px] leading-[11px] text-center" style={{ color: line.textColor }}>
                {line.number}
              </Text>
            </View>
          ))}

          {/* 更多图标 */}
          <View className="h-[20px] w-[14px] items-center justify-center px-[5px] py-[4.5px]">
            <MoreDotsIcon />
          </View>
        </View>
      </View>
    </View>
  );
}
