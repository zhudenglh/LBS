// Station Map Component - 站点地图时间轴（完全按照Figma还原）

import React from 'react';
import { View, Text, ScrollView, StyleSheet, Image } from 'react-native';
import { colors, spacing } from '../../constants/theme';
import RemoteSvg from '../common/RemoteSvg';
import { getFigmaAssetUrl } from '../../utils/figma';

export interface Station {
  name: string;
  passed?: boolean;
}

interface StationMapProps {
  stations: Station[];
  busAtIndex: number;        // 公交车当前位置（显示小车的站点）
  nextStationIndex: number;  // 下一站（大圆点）
}

// Figma图片资源（完全按照Figma节点ID对应）
const FIGMA_IMAGES = {
  carIcon: 'http://localhost:3845/assets/a8d42e06c91b5723291a168b7116d780ebc1d791.png',
  carShadow: 'http://localhost:3845/assets/fb23fc2749601be9fc18281f1de2e3e163580700.svg',

  // 连接线
  linePassedGray: 'http://localhost:3845/assets/ff1ec933214bc415ef5661e5cf53196074fb5883.svg',  // 灰色实线（已过站）
  lineFutureGreen: 'http://localhost:3845/assets/cb14ed788c537eb9990c9d495d65a141bfaa6edc.svg', // 绿色实线（未来站）

  // 虚线箭头（单个白色箭头）- Node 95:308
  dashedArrow: 'http://localhost:3845/assets/d8465e5e980eaece3c42795dca38c903bb3f1788.svg',

  // 圆点（按照Figma节点顺序）
  dotPassedGray: 'http://localhost:3845/assets/2060b5c8a1ddbbe78172d4533f2c67498b8465b6.svg',     // 灰色小圆点（已过站）- Node 95:400
  dotBusGray: 'http://localhost:3845/assets/e7db8fdc5418c49cad7db51a0990a2401d5aa8cc.svg',         // 灰色小圆点（公交车位置）- Node 95:409
  dotNextBigGreen: 'http://localhost:3845/assets/1fc795ef90105b1abf9e72571d6a1e8e57730422.svg',    // 大绿圆点（下一站）- Node 95:411
  dotFutureGreen: 'http://localhost:3845/assets/1945f4af92a0204f09245b30bfff5509e65ec6c7.svg',     // 绿色小圆点（未来站）- Node 95:413
};

export default function StationMapNew({ stations, busAtIndex, nextStationIndex }: StationMapProps) {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {stations.map((station, index) => {
          const isBusLocation = index === busAtIndex;           // 公交车在这里
          const isNextStation = index === nextStationIndex;     // 下一站（大圆点）
          const isPassed = index < busAtIndex;                  // 已过站（灰色）
          const isFuture = index > nextStationIndex;            // 未来站（绿色）

          return (
            <View key={`station-${index}`} style={styles.stationItem}>
              {/* 连接线（左侧） */}
              {index > 0 && (
                <View style={styles.lineContainer}>
                  {/* 如果是中兴路→东浦路，显示绿色虚线箭头 */}
                  {index === nextStationIndex && busAtIndex === index - 1 ? (
                    <View style={styles.dashedArrowContainer}>
                      <RemoteSvg uri={FIGMA_IMAGES.dashedArrow} width={10} height={14} fill="#00C57A" />
                      <RemoteSvg uri={FIGMA_IMAGES.dashedArrow} width={10} height={14} fill="#00C57A" />
                      <RemoteSvg uri={FIGMA_IMAGES.dashedArrow} width={10} height={14} fill="#00C57A" />
                      <RemoteSvg uri={FIGMA_IMAGES.dashedArrow} width={10} height={14} fill="#00C57A" />
                    </View>
                  ) : (
                    <View
                      style={{
                        width: 60,
                        height: 12,
                        backgroundColor: isPassed || isBusLocation ? '#909497' : '#00C57A',
                      }}
                    />
                  )}
                </View>
              )}

              {/* 站点圆点 */}
              <View style={styles.dotContainer}>
                {isNextStation ? (
                  /* 下一站：大绿圆点 */
                  <RemoteSvg uri={FIGMA_IMAGES.dotNextBigGreen} width={50} height={50} />
                ) : isBusLocation ? (
                  /* 公交车位置：灰色小圆点 */
                  <RemoteSvg uri={FIGMA_IMAGES.dotBusGray} width={30} height={30} />
                ) : isPassed ? (
                  /* 已过站：灰色小圆点 */
                  <RemoteSvg uri={FIGMA_IMAGES.dotPassedGray} width={30} height={30} />
                ) : (
                  /* 未来站：绿色小圆点 */
                  <RemoteSvg uri={FIGMA_IMAGES.dotFutureGreen} width={30} height={30} />
                )}
              </View>

              {/* 站点名称 */}
              <Text
                style={[
                  styles.stationName,
                  isNextStation && styles.stationNameNext,
                  (isPassed || isBusLocation) && styles.stationNamePassed,
                ]}
                numberOfLines={1}
              >
                {station.name}
              </Text>

              {/* 公交车位置：显示小汽车图标 */}
              {isBusLocation && (
                <View style={styles.carContainer}>
                  {/* 小车阴影 */}
                  <View style={styles.carShadow}>
                    <RemoteSvg uri={FIGMA_IMAGES.carShadow} width={56} height={4} />
                  </View>
                  {/* 小车图标 */}
                  <Image
                    source={{ uri: getFigmaAssetUrl(FIGMA_IMAGES.carIcon) }}
                    style={styles.carIcon}
                  />
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
    paddingVertical: 20,                        // 增加垂直空间以容纳小车
    backgroundColor: colors.white,
  },

  scrollContent: {
    paddingHorizontal: 14,                      // Figma: 28px ÷ 2
    alignItems: 'center',
    paddingTop: 40,                             // 为小车图标预留空间
  },

  stationItem: {
    alignItems: 'center',
    position: 'relative',
    width: 80,                                  // 大幅减小，让圆点靠近
    marginRight: 10,                            // 圆点之间距离很短
    overflow: 'visible',                        // 确保小车不被裁剪
  },

  // 连接线容器
  lineContainer: {
    position: 'absolute',
    left: -35,                                  // 从上一个圆点右边缘开始（-50+15=-35）
    top: 19,                                    // 圆点中心(25) - 线段高度一半(6) = 19
    width: 60,                                  // 连接两个圆点（25-(-35)=60）
    height: 12,                                 // 线段粗细
    justifyContent: 'center',                   // 居中对齐
    alignItems: 'center',
  },

  // 虚线箭头容器（4个白色小箭头）
  dashedArrowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,                                    // 箭头间距
  },

  // 站点圆点容器
  dotContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,                            // 圆点和文字间距（紧凑）
    height: 50,                                 // 为大圆点预留空间
    width: 50,                                  // 固定宽度，确保对齐
  },

  // 站点名称
  stationName: {
    fontSize: 14,                               // Figma: 28px ÷ 2
    lineHeight: 18,                             // 14 × 1.29
    fontWeight: '400',
    color: colors.busPage.stationText,          // #5d606a
    textAlign: 'center',
    width: 80,                                  // 匹配 stationItem 宽度
  },

  stationNameNext: {
    fontSize: 16,                               // Figma: 32px ÷ 2 (下一站稍大)
    lineHeight: 20,                             // 16 × 1.25
    fontWeight: '500',
    color: colors.busPage.stationText,
  },

  stationNamePassed: {
    color: colors.text.disabled,                // 已过站和公交车位置都是灰色
  },

  // 小汽车容器
  carContainer: {
    position: 'absolute',
    top: -40,                                   // 在圆点上方，增加距离
    alignSelf: 'center',                        // 水平居中
    alignItems: 'center',
    width: 58,
    height: 30,
    zIndex: 10,                                 // 确保在最上层
  },

  carShadow: {
    position: 'absolute',
    bottom: 0,                                  // 阴影在小车下方
  },

  carIcon: {
    width: 58,                                  // Figma: 58px
    height: 26,                                 // Figma: 26px
    resizeMode: 'contain',
  },
});
