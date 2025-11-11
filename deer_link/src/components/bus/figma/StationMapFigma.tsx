/**
 * StationMap - Figma完整还原 (NativeWind)
 * 站点进度条 + 小车图标 + 站点名称
 * 修复：所有圆点垂直对齐
 */

import React, { useRef, useEffect } from 'react';
import { View, Text, Image, ScrollView, Dimensions } from 'react-native';
import Svg, { Circle, Path, Line } from 'react-native-svg';
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
    <Svg width={41} height={41} viewBox="0 0 41 41" fill="none">
      <Circle cx="20.5" cy="20.5" r="13" fill="#C6C8CF" stroke="white" strokeWidth="4" />
    </Svg>
  );
}

// 站点圆点（下一站 - 大绿点）
function StationDotNext() {
  return (
    <Svg width={50} height={50} viewBox="0 0 50 50" fill="none">
      <Circle cx="25" cy="25" r="22.9592" fill="#00C57A" stroke="white" strokeWidth="4.08163" />
    </Svg>
  );
}

// 站点圆点（未来站点 - 小绿点）
function StationDotFuture() {
  return (
    <Svg width={41} height={41} viewBox="0 0 41 41" fill="none">
      <Circle cx="20.5" cy="20.5" r="18.5" fill="#00C57A" stroke="white" strokeWidth="4" />
    </Svg>
  );
}

// 箭头图标（从Bus5复制）
function ArrowIcon() {
  return (
    <Svg width={40} height={36} viewBox="0 0 14 12" fill="none">
      <Path
        d="M13.3311 6L7.04395 12H0L6.28711 6L0 0H7.04395L13.3311 6Z"
        fill="white"
      />
    </Svg>
  );
}

const defaultStations: Station[] = [
  { name: '11 那宁路', passed: true },
  { name: '南坪东路鼓楼医院', passed: true },
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
  const scrollViewRef = useRef<ScrollView>(null);
  const screenWidth = Dimensions.get('window').width;

  useEffect(() => {
    // 延迟滚动以确保布局完成
    const timer = setTimeout(() => {
      if (scrollViewRef.current) {
        // 计算中兴路（currentIndex）的位置，使其居中显示
        const stationWidth = 150;
        const scrollToX = currentIndex * stationWidth - (screenWidth / 2) + (stationWidth / 2);
        scrollViewRef.current.scrollTo({ x: scrollToX, y: 0, animated: true });
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [currentIndex, screenWidth]);

  return (
    <View className="bg-white" style={{ marginTop: 10, paddingTop: 12, paddingBottom: 4 }}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16 }}
      >
        <View className="flex-row">
          {stations.map((station, index) => {
            const isNext = index === nextStationIndex;
            const isCurrent = index === currentIndex;
            const isPassed = index < currentIndex;

            return (
              <View key={index} className="relative" style={{ width: 150, height: 140 }}>
                {/* 站点名称 - 下一站与小车图标中心对齐 */}
                {isNext && (
                  <Text
                    className="absolute text-[#5d606a] font-medium text-center"
                    numberOfLines={2}
                    style={{
                      top: 0,
                      left: 7.5,
                      right: 7.5,
                      fontSize: 21,
                      lineHeight: 30,
                      includeFontPadding: false,
                      textAlignVertical: 'center'
                    }}
                  >
                    {station.name}
                  </Text>
                )}

                {/* 小车图标 - 绝对定位，保持不动 */}
                {isCurrent && (
                  <Image
                    source={BUS_IMAGES.busIcon}
                    className="absolute"
                    style={{
                      top: 18,
                      left: 52.5,
                      width: 45,
                      height: 21
                    }}
                    resizeMode="contain"
                  />
                )}

                {/* 站点圆点 - 绝对定位，垂直居中 */}
                <View
                  className="absolute items-center justify-center"
                  style={{
                    top: 36,
                    left: 50,
                    width: 50,
                    height: 50
                  }}
                >
                  {isNext ? (
                    <StationDotNext />
                  ) : isPassed ? (
                    <StationDotPassed />
                  ) : (
                    <StationDotFuture />
                  )}
                </View>

                {/* 连接线 - 绝对定位，不接触圆点 */}
                {index < stations.length - 1 && (
                  <View>
                    {/* 中兴路到东浦路的虚线段（绿色） */}
                    {index === currentIndex ? (
                      <View
                        className="absolute"
                        style={{
                          top: 61,
                          left: 105,
                          width: 120,
                          height: 4.5,
                        }}
                      >
                        <Svg width={120} height={4.5} viewBox="0 0 120 4.5">
                          <Line
                            x1="0"
                            y1="2.25"
                            x2="120"
                            y2="2.25"
                            stroke="#00C57A"
                            strokeWidth="4.5"
                            strokeDasharray="8,6"
                            strokeLinecap="round"
                          />
                        </Svg>
                      </View>
                    ) : (
                      <View
                        className="absolute"
                        style={{
                          top: 61,
                          left: 105,
                          width: 120,
                          height: 4.5,
                          backgroundColor: index < nextStationIndex ? '#C6C8CF' : '#00C57A',
                        }}
                      />
                    )}
                    {/* 箭头图标 - 显示在中兴路和东浦路之间 */}
                    {index === currentIndex && (
                      <View
                        className="absolute items-center justify-center"
                        style={{
                          top: 43,
                          left: 145
                        }}
                      >
                        <ArrowIcon />
                      </View>
                    )}
                  </View>
                )}

                {/* 站点名称 - 非下一站在下方 */}
                {!isNext && (
                  <Text
                    className="absolute text-[#5d606a] text-center"
                    numberOfLines={2}
                    style={{
                      top: 88,
                      left: 7.5,
                      right: 7.5,
                      fontSize: 16,
                      lineHeight: 24,
                      includeFontPadding: false,
                      textAlignVertical: 'center'
                    }}
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
