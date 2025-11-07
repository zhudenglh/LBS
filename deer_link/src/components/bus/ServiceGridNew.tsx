// Service Grid Component - 便民服务网格（完全按照Figma还原）

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Image } from 'react-native';
import { colors, spacing } from '../../constants/theme';
import RemoteSvg from '../common/RemoteSvg';
import { getFigmaAssetUrl } from '../../utils/figma';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export interface ServiceItem {
  type: 'toilet' | 'store' | 'pharmacy';
  name: string;
  distance: string;
  icon: string;                                 // 使用Figma图片URL（品牌logo）
  brandIcon?: string;                           // 品牌图标URL（可选）
}

interface ServiceGridProps {
  title: string;
  services: ServiceItem[];
  onServicePress?: (service: ServiceItem) => void;
  areaTitle?: string;                           // 区域标题（如"便民服务·东浦路"）
  showAreaTitle?: boolean;                      // 是否显示区域标题
}

// Figma图片资源
const FIGMA_IMAGES = {
  toiletIcon: 'http://localhost:3845/assets/7077eaa97425335352e3ab56f42205c41778037a.svg',
  storeIcon: 'http://localhost:3845/assets/8d8aa485478eeff5b3aad3210e6f40643709dea7.svg',
  pharmacyIcon: 'http://localhost:3845/assets/4667c4f81e1863df773ace76d13e126ae02bacbe.svg',
  locationIcon: 'http://localhost:3845/assets/d6dfb9ac9d46e65c66bf93008c9f32a7cddffd81.svg',
  cardBg: 'http://localhost:3845/assets/c91d8e109b6f6e592e8c90360c4d60b46dc0c0e4.svg',
  moreArrow: 'http://localhost:3845/assets/394c3b6c38e62d4a113ac138fe357650f8786c6d.svg',
};

export default function ServiceGridNew({ title, services, onServicePress, showAreaTitle = false }: ServiceGridProps) {
  // 计算每个卡片宽度（3列，精确按Figma）
  const cardWidth = 109;                        // Figma: 218px ÷ 2

  // 获取服务类型对应的图标
  const getServiceIcon = (type: string) => {
    switch (type) {
      case 'toilet':
        return FIGMA_IMAGES.toiletIcon;
      case 'store':
        return FIGMA_IMAGES.storeIcon;
      case 'pharmacy':
        return FIGMA_IMAGES.pharmacyIcon;
      default:
        return FIGMA_IMAGES.toiletIcon;
    }
  };

  // 获取卡片高度（有logo的卡片更高）
  const getCardHeight = (service: ServiceItem) => {
    return service.brandIcon ? 91.5 : 64;       // 有logo: 183px÷2, 无logo: 128px÷2
  };

  // 获取标题图标（使用第一个服务的类型）
  const titleIconUri = services.length > 0 ? getServiceIcon(services[0].type) : FIGMA_IMAGES.toiletIcon;

  return (
    <View style={styles.container}>
      {/* 小标题行（如"厕所"、"便利店"等） */}
      <View style={styles.subTitleRow}>
        <RemoteSvg
          uri={titleIconUri}
          width={14}
          height={14}
        />
        <Text style={styles.subTitle}>{title}</Text>
      </View>

      {/* 服务网格 */}
      <View style={styles.grid}>
        {services.map((service, index) => {
          const cardHeight = getCardHeight(service);
          return (
            <TouchableOpacity
              key={`${service.type}-${index}`}
              style={[styles.card, { width: cardWidth, height: cardHeight }]}
              onPress={() => onServicePress?.(service)}
              activeOpacity={0.7}
            >
              {/* 卡片背景 */}
              <View style={styles.cardBg}>
                <RemoteSvg
                  uri={FIGMA_IMAGES.cardBg}
                  width={109}
                  height={cardHeight}
                />
              </View>

              {/* 服务名称 */}
              <Text
                style={[
                  styles.serviceName,
                  service.brandIcon ? styles.serviceNameWithLogo : styles.serviceNameNoLogo
                ]}
                numberOfLines={1}
              >
                {service.name}
              </Text>

              {/* 距离 */}
              <View
                style={[
                  styles.distanceRow,
                  service.brandIcon ? styles.distanceRowWithLogo : styles.distanceRowNoLogo
                ]}
              >
                <RemoteSvg
                  uri={FIGMA_IMAGES.locationIcon}
                  width={10.5}
                  height={10.5}
                />
                <Text style={styles.distance}>{service.distance}</Text>
              </View>

              {/* 品牌图标（放在最后渲染，确保在最上层） */}
              {service.brandIcon && (
                <View style={styles.brandIconContainer}>
                  <Image
                    source={{ uri: getFigmaAssetUrl(service.brandIcon) }}
                    style={styles.brandIcon}
                    resizeMode="contain"
                  />
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 14,                      // Figma: 28px ÷ 2
    paddingTop: 0,                              // 去除顶部间距，整体向上移动
    paddingBottom: 15,                          // Figma: 30px ÷ 2
    backgroundColor: colors.white,
  },

  // 小标题行（如"厕所"、"便利店"等）
  subTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,                                     // Figma: 8px ÷ 2
    marginBottom: 12,                           // Figma: 24px ÷ 2
    marginTop: 4,                               // 减少顶部间距
  },

  subTitle: {
    fontSize: 14,                               // Figma: 28px ÷ 2
    lineHeight: 18,                             // 14 × 1.29 (防止截断)
    fontWeight: '500',
    color: colors.text.primary,                 // #333333
  },

  // 网格
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,                                    // Figma: 20px ÷ 2 (卡片之间的间距)
    rowGap: 15,                                 // Figma: 30px ÷ 2 (行间距)
  },

  // 卡片（高度动态设置：有logo 91.5px，无logo 64px）
  card: {
    position: 'relative',
  },

  cardBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },

  // 品牌图标容器
  brandIconContainer: {
    position: 'absolute',
    top: 10,                                    // Figma: 20px ÷ 2
    left: 10,                                   // Figma: 20px ÷ 2 (ml-[20px] = margin-left)
    width: 25,                                  // Figma: 50px ÷ 2
    height: 25,                                 // Figma: 50px ÷ 2
    borderRadius: 4,                            // Figma: 8px ÷ 2
    overflow: 'hidden',                         // 确保圆角生效
    backgroundColor: 'transparent',             // 确保透明背景
  },

  // 品牌图标
  brandIcon: {
    width: '100%',
    height: '100%',
  },

  serviceName: {
    fontSize: 13,                               // Figma: 26px ÷ 2
    lineHeight: 14,                             // 13 × 1.08
    fontWeight: '500',
    color: colors.text.primary,                 // #333333
    textAlign: 'left',
    width: 89,                                  // 限制宽度避免溢出
  },

  // 有logo的卡片：文字在logo下方
  serviceNameWithLogo: {
    position: 'absolute',
    top: 52,                                    // Figma: 104px ÷ 2
    left: 10,                                   // Figma: 20px ÷ 2
  },

  // 无logo的卡片：文字居中
  serviceNameNoLogo: {
    position: 'absolute',
    top: 21,                                    // Figma: 42px ÷ 2 (垂直居中)
    left: 10,                                   // Figma: 20px ÷ 2
  },

  distanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2.5,                                   // Figma: 5px ÷ 2
  },

  // 有logo的卡片：距离在文字下方
  distanceRowWithLogo: {
    position: 'absolute',
    top: 69.5,                                  // Figma: 139px ÷ 2
    left: 10,                                   // Figma: 20px ÷ 2
  },

  // 无logo的卡片：距离在文字下方
  distanceRowNoLogo: {
    position: 'absolute',
    top: 38,                                    // Figma: 76px ÷ 2
    left: 10,                                   // Figma: 20px ÷ 2
  },

  locationIcon: {
    width: 10.5,                                // Figma: 21px ÷ 2
    height: 10.5,
  },

  distance: {
    fontSize: 12,                               // Figma: 24px ÷ 2
    lineHeight: 15,                             // 12 × 1.25 (防止截断)
    fontWeight: '400',
    color: colors.busPage.serviceDistance,      // #6a6e81
  },
});
