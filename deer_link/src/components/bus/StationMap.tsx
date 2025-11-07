// Station Map Component - 站点地图时间轴

import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';
import { colors, spacing } from '../../constants/theme';

export interface Station {
  name: string;       // 站点名称
  passed?: boolean;   // 是否已经过站
}

interface StationMapProps {
  stations: Station[];
  currentIndex: number;  // 当前站点索引
}

// 小汽车图标SVG
function CarIcon() {
  return (
    <Svg width="26" height="13" viewBox="0 0 26 13" fill="none">
      <Path
        d="M3 10H23C24.1046 10 25 9.10457 25 8V5C25 3.89543 24.1046 3 23 3H19L17 1H9L7 3H3C1.89543 3 1 3.89543 1 5V8C1 9.10457 1.89543 10 3 10Z"
        fill="#1293fe"
        stroke="#1293fe"
        strokeWidth="1.5"
      />
      <Rect x="4" y="5" width="4" height="3" rx="0.5" fill="white" />
      <Rect x="18" y="5" width="4" height="3" rx="0.5" fill="white" />
      <Path d="M5 10V11.5C5 12 5.5 12.5 6 12.5C6.5 12.5 7 12 7 11.5V10" stroke="#1293fe" strokeWidth="1.5" />
      <Path d="M19 10V11.5C19 12 19.5 12.5 20 12.5C20.5 12.5 21 12 21 11.5V10" stroke="#1293fe" strokeWidth="1.5" />
    </Svg>
  );
}

export default function StationMap({ stations, currentIndex }: StationMapProps) {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {stations.map((station, index) => {
          const isCurrent = index === currentIndex;
          const isPassed = index < currentIndex;
          const isFuture = index > currentIndex;

          return (
            <View key={`station-${index}`} style={styles.stationItem}>
              {/* 连接线（前半段） */}
              {index > 0 && (
                <View
                  style={[
                    styles.lineLeft,
                    isPassed && styles.linePassed,
                  ]}
                />
              )}

              {/* 站点圆点 */}
              <View
                style={[
                  styles.dot,
                  isCurrent && styles.dotCurrent,
                  isPassed && styles.dotPassed,
                  isFuture && styles.dotFuture,
                ]}
              >
                {isCurrent && <View style={styles.dotInner} />}
              </View>

              {/* 连接线（后半段） */}
              {index < stations.length - 1 && (
                <View
                  style={[
                    styles.lineRight,
                    isPassed && styles.linePassed,
                  ]}
                />
              )}

              {/* 站点名称 */}
              <Text
                style={[
                  styles.stationName,
                  isCurrent && styles.stationNameCurrent,
                  isPassed && styles.stationNamePassed,
                ]}
                numberOfLines={1}
              >
                {station.name}
              </Text>

              {/* 当前站点：显示小汽车图标 */}
              {isCurrent && (
                <View style={styles.carIconContainer}>
                  <CarIcon />
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.lg,        // 16px
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  scrollContent: {
    paddingHorizontal: spacing.lg,      // 16px
    alignItems: 'center',
  },

  stationItem: {
    alignItems: 'center',
    marginRight: spacing.xl,            // 24px between stations
    position: 'relative',
    minWidth: 60,
  },

  // 连接线
  lineLeft: {
    position: 'absolute',
    left: -spacing.xl / 2,              // 12px
    top: 10,
    width: spacing.xl / 2,
    height: 2,
    backgroundColor: colors.border,
  },

  lineRight: {
    position: 'absolute',
    right: -spacing.xl / 2,             // 12px
    top: 10,
    width: spacing.xl / 2,
    height: 2,
    backgroundColor: colors.border,
  },

  linePassed: {
    backgroundColor: colors.primary,     // 已过站用蓝色
  },

  // 站点圆点
  dot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.white,
    marginBottom: spacing.xs,           // 4px
    alignItems: 'center',
    justifyContent: 'center',
  },

  dotCurrent: {
    borderColor: colors.primary,        // 当前站用蓝色边框
    borderWidth: 3,
    width: 24,
    height: 24,
    borderRadius: 12,
  },

  dotPassed: {
    backgroundColor: colors.primary,     // 已过站填充蓝色
    borderColor: colors.primary,
  },

  dotFuture: {
    borderColor: colors.border,
    backgroundColor: colors.white,
  },

  dotInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },

  // 站点名称
  stationName: {
    fontSize: 11,                       // Figma: 22px ÷ 2
    lineHeight: 14,                     // 11 × 1.27
    fontWeight: '400',
    color: colors.busPage.timeText,     // #999999
    textAlign: 'center',
    maxWidth: 60,
  },

  stationNameCurrent: {
    fontSize: 12,                       // 当前站稍大
    lineHeight: 15,
    fontWeight: '600',
    color: colors.primary,
  },

  stationNamePassed: {
    color: colors.text.disabled,        // 已过站灰色
  },

  // 小汽车图标容器
  carIconContainer: {
    position: 'absolute',
    top: -20,                            // 在圆点上方
    left: '50%',
    transform: [{ translateX: -13 }],   // 居中对齐（26px宽度的一半）
  },
});
