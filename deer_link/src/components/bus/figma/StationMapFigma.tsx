/**
 * StationMap - Figma完整还原
 * 站点进度条 + 小车图标 + 站点名称
 * 修复：所有圆点垂直对齐
 */

import React from 'react';
import { View, Text, Image, ScrollView, StyleSheet } from 'react-native';
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
    <Svg width={20} height={20} viewBox="0 0 41 41" fill="none">
      <Circle cx="20.5" cy="20.5" r="13" fill="#C6C8CF" stroke="white" strokeWidth="4" />
    </Svg>
  );
}

// 站点圆点（下一站 - 大绿点）
function StationDotNext() {
  return (
    <Svg width={24} height={24} viewBox="0 0 50 50" fill="none">
      <Circle cx="25" cy="25" r="22.9592" fill="#00C57A" stroke="white" strokeWidth="4.08163" />
    </Svg>
  );
}

// 站点圆点（未来站点 - 小绿点）
function StationDotFuture() {
  return (
    <Svg width={20} height={20} viewBox="0 0 41 41" fill="none">
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
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scrollView}
      >
        <View style={styles.stationsContainer}>
          {stations.map((station, index) => {
            const isNext = index === nextStationIndex;
            const isCurrent = index === currentIndex;
            const isPassed = index < currentIndex;

            return (
              <View key={index} style={styles.stationItem}>
                {/* 站点名称 - 下一站在上方 */}
                {isNext && (
                  <Text
                    style={[styles.stationNameAbsolute, styles.stationNameTop, styles.stationNameNext]}
                    numberOfLines={2}
                  >
                    {station.name}
                  </Text>
                )}

                {/* 小车图标 - 绝对定位 */}
                {isCurrent && (
                  <Image
                    source={BUS_IMAGES.busIcon}
                    style={styles.busIconAbsolute}
                    resizeMode="contain"
                  />
                )}

                {/* 站点圆点 - 绝对定位，垂直居中 */}
                <View style={styles.dotAbsolute}>
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
                    style={[
                      styles.connectionLine,
                      {
                        backgroundColor: index <= currentIndex ? '#00C57A' : '#C6C8CF',
                      }
                    ]}
                  />
                )}

                {/* 站点名称 - 非下一站在下方 */}
                {!isNext && (
                  <Text
                    style={[styles.stationNameAbsolute, styles.stationNameBottom]}
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

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    marginTop: 8,
    paddingVertical: 24,
  },
  scrollView: {
    paddingHorizontal: 16,
  },
  stationsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
  },
  stationItem: {
    width: 100,
    height: 120, // 固定高度，确保所有站点对齐
    position: 'relative',
  },
  stationNameAbsolute: {
    position: 'absolute',
    left: 5,
    right: 5,
    color: '#5d606a',
    fontSize: 11,
    fontWeight: '400',
    textAlign: 'center',
  },
  stationNameTop: {
    top: 0,
  },
  stationNameBottom: {
    bottom: 0,
  },
  stationNameNext: {
    fontSize: 14,
    fontWeight: '500',
  },
  busIconAbsolute: {
    position: 'absolute',
    top: 48, // 圆点上方约10px
    left: 35, // 水平居中 (100 - 30) / 2 = 35
    width: 30,
    height: 14,
  },
  dotAbsolute: {
    position: 'absolute',
    top: 60, // 垂直居中位置
    left: 40, // 水平居中 (100 - 20) / 2 = 40
    height: 24,
    width: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  connectionLine: {
    position: 'absolute',
    top: 70, // 圆点中心：60 + 24/2 = 72，线段高度3，所以 72 - 3/2 ≈ 70
    left: 50, // 从stationItem中心开始
    width: 100, // 延伸到下一个stationItem中心
    height: 3,
  },
});
