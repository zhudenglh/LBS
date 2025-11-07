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
              {/* 站点圆点容器 - 统一基准线 */}
              <View style={styles.dotArea}>
                {/* 连接线（左侧） - 绝对定位在圆点中心 */}
                {index > 0 && (
                  <View style={[
                    styles.lineContainer,
                    isNextStation && styles.lineContainerBig,
                  ]}>
                    {/* 如果是中兴路→东浦路，显示绿色虚线箭头 */}
                    {index === nextStationIndex && busAtIndex === index - 1 ? (
                      <View style={styles.dashedArrowContainer}>
                        <RemoteSvg uri={FIGMA_IMAGES.dashedArrow} width={10} height={12} fill="#00C57A" />
                        <RemoteSvg uri={FIGMA_IMAGES.dashedArrow} width={10} height={12} fill="#00C57A" />
                        <RemoteSvg uri={FIGMA_IMAGES.dashedArrow} width={10} height={12} fill="#00C57A" />
                        <RemoteSvg uri={FIGMA_IMAGES.dashedArrow} width={10} height={12} fill="#00C57A" />
                      </View>
                    ) : (
                      <View style={styles.lineSegment}>
                        <View
                          style={{
                            width: 60,
                            height: 12,
                            backgroundColor: isPassed || isBusLocation ? '#909497' : '#00C57A',
                          }}
                        />
                      </View>
                    )}
                  </View>
                )}
                {/* 公交车位置：显示小汽车图标 */}
                {isBusLocation && (
                  <View style={styles.carContainer}>
                    <View style={styles.carShadow}>
                      <RemoteSvg uri={FIGMA_IMAGES.carShadow} width={48} height={3} />
                    </View>
                    <Image
                      source={{ uri: getFigmaAssetUrl(FIGMA_IMAGES.carIcon) }}
                      style={styles.carIcon}
                    />
                  </View>
                )}
                {/* 下一站名称 - 绝对定位在圆点上方 */}
                {isNextStation && (
                  <Text
                    style={[
                      styles.stationName,
                      styles.stationNameNext,
                      styles.stationNameAbove,
                    ]}
                    numberOfLines={1}
                  >
                    {station.name}
                  </Text>
                )}

                {/* 站点圆点 */}
                <View style={[
                  styles.dotWrapper,
                  isNextStation && styles.dotWrapperBig,
                ]}>
                  {isNextStation ? (
                    <RemoteSvg uri={FIGMA_IMAGES.dotNextBigGreen} width={50} height={50} />
                  ) : isBusLocation ? (
                    <RemoteSvg uri={FIGMA_IMAGES.dotBusGray} width={30} height={30} />
                  ) : isPassed ? (
                    <RemoteSvg uri={FIGMA_IMAGES.dotPassedGray} width={30} height={30} />
                  ) : (
                    <RemoteSvg uri={FIGMA_IMAGES.dotFutureGreen} width={30} height={30} />
                  )}
                </View>

                {/* 普通站点名称 - 绝对定位在圆点下方 */}
                {!isNextStation && (
                  <Text
                    style={[
                      styles.stationName,
                      styles.stationNameBelow,
                      (isPassed || isBusLocation) && styles.stationNamePassed,
                    ]}
                    numberOfLines={1}
                  >
                    {station.name}
                  </Text>
                )}
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 0,                              // Figma: 去除顶部间距，更靠近"可换乘"
    paddingBottom: 0,                           // 去除底部间距，让便民服务更靠近
    backgroundColor: colors.white,
    overflow: 'visible',                        // 允许内容溢出显示
  },

  scrollContent: {
    paddingHorizontal: 14,                      // Figma: 28px ÷ 2
    alignItems: 'flex-start',                   // 改为顶部对齐，避免裁剪
    paddingTop: 40,                             // 减少顶部空间，让整体向上移动
    paddingBottom: 10,                          // 进一步减少底部空间，让便民服务更靠近
  },

  stationItem: {
    position: 'relative',
    width: 80,
    height: 80,                                 // 增加高度以容纳圆点和文字
    marginRight: 10,
    overflow: 'visible',                        // 允许内容溢出显示
  },

  // 圆点区域容器 - 建立统一基准线
  dotArea: {
    position: 'relative',
    height: 30,                                 // 基准高度：小圆点的高度
    width: 80,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 'auto',                   // 水平居中
    overflow: 'visible',                        // 允许大圆点和文字溢出显示
  },

  // 连接线容器 - 绝对定位到dotArea
  lineContainer: {
    position: 'absolute',
    left: -35,                                  // 从上一个圆点位置开始
    top: 9,                                     // 对齐到dotArea中心: 15 - 6(线段高度一半) = 9
    width: 60,
    height: 12,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,                                  // 确保线段在圆点下方
  },

  // 连接线容器 - 大圆点站（大圆点和小圆点中心都在15px）
  lineContainerBig: {
    top: 9,                                     // 基准线中心在15px，线段top = 15 - 6 = 9（与小圆点相同）
  },

  // 线段包装
  lineSegment: {
    width: 60,
    height: 12,
  },

  // 虚线箭头容器
  dashedArrowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 12,
  },

  // 圆点包装 - 小圆点30x30（居中对齐）
  dotWrapper: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,                                  // 确保圆点在线段上方
  },

  // 圆点包装 - 大圆点50x50（绝对定位，向上偏移）
  dotWrapperBig: {
    position: 'absolute',
    width: 50,
    height: 50,
    top: -10,                                   // 大圆点中心在25px，向上偏移10px使中心对齐到基准线15px
    left: '50%',                                // 水平居中
    marginLeft: -25,                            // 居中偏移（50px / 2）
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,                                  // 确保大圆点在线段上方
  },

  // 站点名称（基础样式）
  stationName: {
    fontSize: 14,                               // Figma: 28px ÷ 2
    lineHeight: 18,                             // 14 × 1.29
    fontWeight: '400',
    color: colors.busPage.stationText,          // #5d606a
    textAlign: 'center',
    width: 80,                                  // 匹配 dotArea 宽度
  },

  // 下一站名称样式
  stationNameNext: {
    fontSize: 16,                               // Figma: 32px ÷ 2 (下一站稍大)
    lineHeight: 20,                             // 16 × 1.25
    fontWeight: '500',
    color: colors.busPage.stationText,
  },

  // 已过站名称样式
  stationNamePassed: {
    color: colors.text.disabled,                // 已过站和公交车位置都是灰色
  },

  // 下一站名称显示在圆点上方（绝对定位）
  stationNameAbove: {
    position: 'absolute',
    bottom: '100%',                             // 定位在dotArea上方
    marginBottom: 4,                            // 文字和圆点之间的间距
    left: 0,
    right: 0,
    textAlign: 'center',
    zIndex: 5,                                  // 确保文字在圆点上方
  },

  // 普通站点名称显示在圆点下方（绝对定位）
  stationNameBelow: {
    position: 'absolute',
    top: '100%',                                // 定位在dotArea下方
    marginTop: 6,                               // 圆点和文字之间的间距（增加以确保可见）
    left: 0,
    right: 0,
    textAlign: 'center',
    whiteSpace: 'nowrap',                       // 防止文字换行
  },

  // 小汽车容器（绝对定位在dotArea内）
  carContainer: {
    position: 'absolute',
    bottom: '100%',                             // 定位在dotArea上方（圆点上方）
    marginBottom: 2,                            // 小车和圆点之间的间距
    left: '50%',                                // 水平居中
    marginLeft: -24,                            // 居中偏移（48px / 2）
    alignItems: 'center',
    width: 48,
    height: 24,
    zIndex: 10,
  },

  carShadow: {
    position: 'absolute',
    bottom: 0,
  },

  carIcon: {
    width: 48,
    height: 22,
    resizeMode: 'contain',
  },
});
