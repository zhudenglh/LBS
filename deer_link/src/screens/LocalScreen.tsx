// LocalScreen - 本地tab页面（精确Figma设计复刻）
// Node ID: 1:530 - 公交-在车上
// 尺寸：750×1624px (设计稿)

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';
import type { MainTabParamList } from '../types';
import LinearGradient from 'react-native-linear-gradient';
import SearchBar from '../components/ui/SearchBar';
import WiFiConnectionCard from '../components/wifi/WiFiConnectionCard';
import QuickActionGrid from '../components/wifi/QuickActionGrid';
import BusRouteCard from '../components/wifi/BusRouteCard';
import { BusIcon, CashbackIcon, HealthIcon, WalletIcon } from '../components/wifi/QuickActionIcons';
import { colors, spacing, borderRadius } from '../constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// 商户优惠数据类型
interface MerchantOffer {
  id: string;
  name: string;
  imageUrl: string;
  price: string;
  originalPrice: string;
  sales: string;
  distance: string;
  badge: string;
  badgeColor: string;
}

export default function LocalScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation<NavigationProp<MainTabParamList>>();
  const [isConnected, setIsConnected] = useState(false);

  // 常量
  const FREE_WIFI_COUNT = 33;

  // 快捷操作数据（精确Figma图标尺寸68×68px/2 = 34×34px）
  const quickActions = [
    {
      id: '1',
      icon: <BusIcon size={34} />,
      labelKey: 'wifi.actions.bus_routes',
      onPress: () => navigation.navigate('Bus'),
      backgroundColor: '#E8F5E9',
    },
    {
      id: '2',
      icon: <CashbackIcon size={34} />,
      labelKey: 'wifi.actions.cashback',
      onPress: () => console.log('返利团'),
      backgroundColor: '#FFF9E6',
    },
    {
      id: '3',
      icon: <HealthIcon size={34} />,
      labelKey: 'wifi.actions.health',
      onPress: () => console.log('小鹿健康'),
      backgroundColor: '#E3F2FD',
    },
    {
      id: '4',
      icon: <WalletIcon size={34} />,
      labelKey: 'wifi.actions.savings',
      onPress: () => console.log('省钱包'),
      backgroundColor: '#FFEBE9',
    },
  ];

  // 商户优惠数据（精确Figma数据）
  const merchantOffers: MerchantOffer[] = [
    {
      id: '1',
      name: '爸爸吐司面包｜限时【上新】抹茶脑袋必冲好...',
      imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=500&fit=crop&q=80', // 抹茶蛋糕
      price: '10.9',
      originalPrice: '16',
      sales: '半年售2.5万+',
      distance: '1.6km',
      badge: '团购',
      badgeColor: colors.badge.orange,
    },
    {
      id: '2',
      name: '爸爸吐司面包｜限时【上新】抹茶脑袋必冲好...',
      imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=500&fit=crop&q=80', // 烧烤拼盘
      price: '10.9',
      originalPrice: '16',
      sales: '半年售2.5万+',
      distance: '1.6km',
      badge: '团购',
      badgeColor: colors.badge.orange,
    },
    {
      id: '3',
      name: '爸爸吐司面包｜限时【上新】抹茶脑袋必冲好...',
      imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=500&fit=crop&q=80', // 烤肉
      price: '10.9',
      originalPrice: '16',
      sales: '半年售2.5万+',
      distance: '1.6km',
      badge: '团购',
      badgeColor: colors.badge.orange,
    },
    {
      id: '4',
      name: '爸爸吐司面包｜限时【上新】抹茶脑袋必冲好...',
      imageUrl: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=500&fit=crop&q=80', // 甜品
      price: '10.9',
      originalPrice: '16',
      sales: '半年售2.5万+',
      distance: '1.6km',
      badge: '团购',
      badgeColor: colors.badge.orange,
    },
    {
      id: '5',
      name: '爸爸吐司面包｜限时【上新】抹茶脑袋必冲好...',
      imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=500&fit=crop&q=80',
      price: '10.9',
      originalPrice: '16',
      sales: '半年售2.5万+',
      distance: '1.6km',
      badge: '团购',
      badgeColor: colors.badge.orange,
    },
    {
      id: '6',
      name: '爸爸吐司面包｜限时【上新】抹茶脑袋必冲好...',
      imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=500&fit=crop&q=80',
      price: '10.9',
      originalPrice: '16',
      sales: '半年售2.5万+',
      distance: '1.6km',
      badge: '团购',
      badgeColor: colors.badge.orange,
    },
  ];

  // 分成左右两列
  const leftColumnOffers = merchantOffers.filter((_, index) => index % 2 === 0);
  const rightColumnOffers = merchantOffers.filter((_, index) => index % 2 === 1);

  // 处理函数
  const handleSearch = () => {
    console.log('搜索');
  };

  const handleScan = () => {
    console.log('扫码');
  };

  const handleWiFiConnect = () => {
    setIsConnected(!isConnected);
  };

  const handleBusReminder = () => {
    console.log('到站提醒');
  };

  return (
    <View style={styles.container}>
      {/* 黄色渐变背景 - 精确Figma: 331px高，从#f9de47到#f6f8f7，75%位置 */}
      <LinearGradient
        colors={[colors.localYellow, colors.localGradientEnd]}
        locations={[0, 0.75]}
        style={styles.gradientBackground}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 搜索栏 - 精确Figma尺寸 */}
        <View style={styles.searchBarContainer}>
          <SearchBar
            onSearchPress={handleSearch}
            onScanPress={handleScan}
            placeholder="南京市的人气酒店"
            location="南京"
          />
        </View>

        {/* WiFi连接+快捷操作卡片 - 精确Figma: 白色圆角卡片，包含WiFi和快捷操作 */}
        <View style={styles.wifiCard}>
          <WiFiConnectionCard
            isConnected={isConnected}
            networkName="Nanjing_Bus_Free_WiFi"
            nearbyCount={FREE_WIFI_COUNT}
            onConnect={handleWiFiConnect}
            buttonColor={[colors.localYellow, colors.localYellow]} // 黄色按钮
          />

          {/* 分割线 - 精确Figma: 1px高, #e0e1e6颜色, 左右各留28px */}
          <View style={styles.divider} />

          {/* 快捷操作网格 - 在同一个卡片内 */}
          <QuickActionGrid actions={quickActions} />
        </View>

        {/* 公交路线卡片 - 精确Figma间距15px */}
        <View style={styles.contentContainer}>
          <BusRouteCard
            routeName={t('home.bus.line') || '71路'}
            direction="开往·张江高科方向"
            nextStation="华拓路站"
            estimatedTime="3"
            onReminderPress={handleBusReminder}
            buttonColor={colors.localYellow} // 黄色按钮
          />
        </View>

        {/* 商户优惠瀑布流 - 精确Figma: 12px列间距 */}
        <View style={styles.offersGrid}>
          {/* 左列 */}
          <View style={styles.column}>
            {leftColumnOffers.map((offer) => (
              <MerchantCard key={offer.id} offer={offer} />
            ))}
          </View>

          {/* 右列 */}
          <View style={styles.column}>
            {rightColumnOffers.map((offer) => (
              <MerchantCard key={offer.id} offer={offer} />
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

// 商户卡片组件（精确Figma设计）
function MerchantCard({ offer }: { offer: MerchantOffer }) {
  return (
    <View style={cardStyles.container}>
      {/* 图片区域 - 精确Figma: 354×464px (设计稿) → 177×232px (实际) */}
      <View style={cardStyles.imageContainer}>
        <Image
          source={{ uri: offer.imageUrl }}
          style={cardStyles.image}
          resizeMode="cover"
        />
        {/* 标签：团购+距离 */}
        <View style={cardStyles.badgeContainer}>
          <View style={[cardStyles.badge, { backgroundColor: offer.badgeColor }]}>
            <Text style={cardStyles.badgeText}>{offer.badge}</Text>
          </View>
          <View style={[cardStyles.badge, cardStyles.distanceBadge]}>
            <Text style={cardStyles.badgeText}>{offer.distance}</Text>
          </View>
        </View>
      </View>

      {/* 文字区域 - 精确Figma: padding 14px */}
      <View style={cardStyles.textArea}>
        {/* 标题 - 精确Figma: 26px Regular, #333333, lineHeight 38px */}
        <Text style={cardStyles.title} numberOfLines={2}>
          {offer.name}
        </Text>

        {/* 销量 - 精确Figma: 22px Regular, #878c99, lineHeight 28px */}
        <Text style={cardStyles.sales}>{offer.sales}</Text>

        {/* 价格区域 - 精确Figma间距 */}
        <View style={cardStyles.priceRow}>
          <View style={cardStyles.priceMain}>
            {/* ¥符号 - 22px */}
            <Text style={cardStyles.priceCurrency}>¥</Text>
            {/* 价格数字 - 32px Medium */}
            <Text style={cardStyles.priceNumber}>{offer.price}</Text>
            {/* 划线价 - 22px, 删除线 */}
            <Text style={cardStyles.priceOriginal}>¥{offer.originalPrice}</Text>
          </View>
          {/* 折扣标签 - 22px Regular, #ff3b30 */}
          <Text style={cardStyles.discountLabel}>低至2.1折</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  // 黄色渐变背景 - 精确Figma高度331px
  gradientBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 331,
    zIndex: 0,
  },

  scrollView: {
    flex: 1,
    zIndex: 1,
  },

  scrollContent: {
    paddingBottom: spacing.xxl,
  },

  // 搜索栏容器 - 精确Figma: 左右边距
  searchBarContainer: {
    paddingHorizontal: 15,
    paddingTop: spacing.md,
  },

  // WiFi+快捷操作白色卡片 - 精确Figma: 白色背景, 圆角20px/2=10px, padding 24px/2=12px
  wifiCard: {
    backgroundColor: colors.white,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 12,
    marginHorizontal: 15,
    marginTop: 15,
  },

  // 分割线 - 精确Figma: 1px高, #e0e1e6, 左右各留28px/2=14px
  divider: {
    height: 1,
    backgroundColor: '#e0e1e6',
    marginHorizontal: 14,
    marginVertical: 12,
  },

  // 内容容器 - 精确Figma: 左右边距15px, 上边距15px
  contentContainer: {
    paddingHorizontal: 15,
    marginTop: 15,
  },

  // 商户瀑布流 - 精确Figma: 列间距12px, 行间距12px
  offersGrid: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    marginTop: 15,
    gap: 12, // 精确Figma列间距
  },

  column: {
    flex: 1,
    gap: 12, // 精确Figma行间距
  },
});

// 商户卡片样式（精确Figma - 所有尺寸除以2）
const cardStyles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 6,
    backgroundColor: colors.white,
    borderRadius: 10,
    overflow: 'hidden',
  },

  // 图片容器 - 精确Figma: 354×464px/2 = 177×232px
  imageContainer: {
    width: '100%',
    height: 232,
    position: 'relative',
  },

  image: {
    width: '100%',
    height: '100%',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },

  // 标签容器（左下角）
  badgeContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    flexDirection: 'row',
  },

  // 通用标签样式 - 精确Figma: height 38px/2 = 19px, padding 2px 6px
  badge: {
    height: 19,
    paddingHorizontal: 6,
    paddingVertical: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // 距离标签 - 精确Figma: rgba(0,0,0,0.4), 右上圆角5px
  distanceBadge: {
    backgroundColor: colors.badge.darkBg,
    borderTopRightRadius: 5,
  },

  // 标签文字 - 精确Figma: 22px/2 = 11px Regular, white, lineHeight 14px
  badgeText: {
    fontFamily: 'Source Han Sans CN',
    fontWeight: '400',
    fontSize: 11,
    lineHeight: 14,
    color: colors.white,
    letterSpacing: -0.24,
  },

  // 文字区域 - 精确Figma: padding 14px/2 = 7px
  textArea: {
    padding: 7,
  },

  // 标题 - 精确Figma: 26px/2 = 13px Regular, #333333, lineHeight 19px
  title: {
    fontFamily: 'Noto Sans CJK SC',
    fontWeight: '400',
    fontSize: 13,
    lineHeight: 19,
    color: colors.text.merchantTitle,
    letterSpacing: -0.24,
    marginBottom: 3,
  },

  // 销量 - 精确Figma: 22px/2 = 11px Regular, #878c99, lineHeight 14px
  sales: {
    fontFamily: 'Source Han Sans CN',
    fontWeight: '400',
    fontSize: 11,
    lineHeight: 14,
    color: colors.text.merchantSales,
    letterSpacing: -0.24,
    marginBottom: 4,
  },

  // 价格行 - 精确Figma: gap 20px/2 = 10px
  priceRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },

  // 价格主区域 - 精确Figma: gap 4px/2 = 2px
  priceMain: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 2,
  },

  // ¥符号 - 精确Figma: 22px/2 = 11px Regular, #ee6757, lineHeight 15px
  priceCurrency: {
    fontFamily: 'Source Han Sans CN',
    fontWeight: '400',
    fontSize: 11,
    lineHeight: 15,
    color: colors.price.current,
    letterSpacing: -0.24,
  },

  // 价格数字 - 精确Figma: 32px/2 = 16px Medium, #ee6757, lineHeight 19px
  priceNumber: {
    fontFamily: 'Noto Sans CJK SC',
    fontWeight: '500',
    fontSize: 16,
    lineHeight: 19,
    color: colors.price.current,
  },

  // 划线价 - 精确Figma: 22px/2 = 11px Regular, #878c99, lineHeight 15px, 删除线
  priceOriginal: {
    fontFamily: 'Source Han Sans CN',
    fontWeight: '400',
    fontSize: 11,
    lineHeight: 15,
    color: colors.price.original,
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid',
    letterSpacing: -0.24,
  },

  // 折扣标签 - 精确Figma: 22px/2 = 11px Regular, #ff3b30, lineHeight 14px
  discountLabel: {
    fontFamily: 'Source Han Sans CN',
    fontWeight: '400',
    fontSize: 11,
    lineHeight: 14,
    color: colors.price.discount,
    letterSpacing: -0.24,
  },
});
