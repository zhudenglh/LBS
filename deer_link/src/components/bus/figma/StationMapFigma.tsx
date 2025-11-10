/**
 * StationMap - Figma完整还原 (NativeWind)
 * 站点进度条 + 小车图标 + 站点名称
 * 修复：所有圆点垂直对齐
 */

import React from 'react';
import { View, Text, Image, ScrollView } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { BUS_IMAGES } from '../../../constants/busAssets';

interface Station {
  name: string;
  passed: boolean;
}

interface StationMapProps {
  stations?: Station[];
  currentIndex?: number;
  nextStationIndex?: number;
}

// 站点圆点（已过站 - 灰色）
function StationDotPassed() {
  return (
    <Svg width={10} height={10} viewBox="0 0 41 41" fill="none">
      <Circle cx="20.5" cy="20.5" r="13" fill="#C6C8CF" stroke="white" strokeWidth="4" />
    </Svg>
  );
}

// 站点圆点（下一站 - 大绿点）
function StationDotNext() {
  return (
    <Svg width={12} height={12} viewBox="0 0 50 50" fill="none">
      <Circle cx="25" cy="25" r="22.9592" fill="#00C57A" stroke="white" strokeWidth="4.08163" />
    </Svg>
  );
}

// 站点圆点（未来站点 - 小绿点）
function StationDotFuture() {
  return (
    <Svg width={10} height={10} viewBox="0 0 41 41" fill="none">
      <Circle cx="20.5" cy="20.5" r="18.5" fill="#00C57A" stroke="white" strokeWidth="4" />
    </Svg>
  );
}

const defaultStations: Station[] = [
  { name: '11 那宁路', passed: true },
  { name: '12 南坪东路鼓楼医院', passed: true },
  { name: '石板路', passed: true },
  { name: '中兴路', passed: false },
  { name: '东浦路', passed: false },
  { name: '招呼站', passed: false },
  { name: '18 蔡伦路', passed: false },
  { name: '19 中科路', passed: false },
];

export default function StationMapFigma({
  stations = defaultStations,
  currentIndex = 3,
  nextStationIndex = 4
}: StationMapProps) {
  return (
    <View className="bg-white mt-2 py-6">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="px-4"
      >
        <View className="flex-row px-4">
          {stations.map((station, index) => {
            const isNext = index === nextStationIndex;
            const isCurrent = index === currentIndex;
            const isPassed = index < currentIndex;

            return (
              <View key={index} className="w-[50px] h-[60px] relative">
                {/* 站点名称 - 下一站在上方 */}
                {isNext && (
                  <Text
                    className="absolute left-[2.5px] right-[2.5px] top-0 text-[#5d606a] text-[7px] font-medium text-center"
                    numberOfLines={2}
                  >
                    {station.name}
                  </Text>
                )}

                {/* 小车图标 - 绝对定位 */}
                {isCurrent && (
                  <Image
                    source={BUS_IMAGES.busIcon}
                    className="absolute w-[15px] h-[7px]"
                    style={{ top: 24, left: 17.5 }}
                    resizeMode="contain"
                  />
                )}

                {/* 站点圆点 - 绝对定位，垂直居中 */}
                <View
                  className="absolute items-center justify-center h-[12px] w-[12px]"
                  style={{ top: 30, left: 20 }}
                >
                  {isNext ? (
                    <StationDotNext />
                  ) : isPassed ? (
                    <StationDotPassed />
                  ) : (
                    <StationDotFuture />
                  )}
                </View>

                {/* 连接线 - 绝对定位，与圆点中心对齐 */}
                {index < stations.length - 1 && (
                  <View
                    className="absolute h-[1.5px]"
                    style={{
                      top: 35,
                      left: 25,
                      width: 50,
                      backgroundColor: index <= currentIndex ? '#00C57A' : '#C6C8CF',
                    }}
                  />
                )}

                {/* 站点名称 - 非下一站在下方 */}
                {!isNext && (
                  <Text
                    className="absolute left-[2.5px] right-[2.5px] bottom-0 text-[#5d606a] text-[5.5px] text-center"
                    numberOfLines={2}
                  >
                    {station.name}
                  </Text>
                )}
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}
