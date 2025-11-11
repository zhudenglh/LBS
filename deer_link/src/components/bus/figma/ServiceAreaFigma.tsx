/**
 * ServiceArea - Figma完整还原
 * 便民服务区域：厕所、便利店、药店（Tab切换）
 */

import React, { useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import Svg, { Path, G, Rect, Circle, Defs, LinearGradient as SvgLinearGradient, Stop } from 'react-native-svg';
import { scaleWidth as sw, scaleHeight as sh, scaleFont as sf } from '../../../utils/responsive';
import { BUS_IMAGES } from '../../../constants/busAssets';

interface ServiceItem {
  name: string;
  distance: string;
  logo?: any;
}

interface ServiceAreaProps {
  title?: string;
  toilets?: ServiceItem[];
  stores?: ServiceItem[];
  pharmacies?: ServiceItem[];
}

// 箭头图标
function ArrowRightIcon({ size = 14 }: { size?: number }) {
  return (
    <Svg width={size} height={size * 1.64} viewBox="0 0 14 23" fill="none">
      <Path
        d="M2 1.25L12 11.25L2 21.25"
        stroke="#909497"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

// 位置图标
function LocationIcon({ size = 21 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 21 21" fill="none">
      <Path
        d="M17.2225 5.77051C16.8554 4.90303 16.3304 4.12373 15.6618 3.45518C14.9933 2.78662 14.214 2.26162 13.3465 1.89453C12.4483 1.51309 11.4926 1.32031 10.5103 1.32031C9.52589 1.32031 8.57228 1.51309 7.67404 1.89248C6.80656 2.25957 6.02726 2.78457 5.3587 3.45312C4.69015 4.12168 4.16515 4.90098 3.79806 5.76846C3.41866 6.6667 3.22589 7.62031 3.22589 8.60469C3.22589 10.272 4.40304 12.6283 6.72247 15.6081C8.41437 17.786 10.1329 19.523 10.1514 19.5395C10.2457 19.6358 10.377 19.6892 10.5103 19.6892C10.6456 19.6892 10.7748 19.6358 10.8692 19.5395C10.8856 19.523 12.6041 17.784 14.2981 15.6102C16.6195 12.6324 17.7967 10.2761 17.7967 8.60674C17.7967 7.62441 17.6039 6.66875 17.2225 5.77051ZM10.4734 11.3999C8.99884 11.3999 7.79913 10.2002 7.79913 8.72568C7.79913 7.25117 8.99884 6.05147 10.4734 6.05147C11.9479 6.05147 13.1476 7.25117 13.1476 8.72568C13.1476 10.2002 11.9479 11.3999 10.4734 11.3999Z"
        fill="#878C99"
      />
    </Svg>
  );
}

// 厕所图标
function ToiletIcon({ size = 36 }: { size?: number }) {
  return (
    <Svg width={size} height={size * 0.86} viewBox="0 0 29 31" fill="none">
      <Defs>
        <SvgLinearGradient id="toiletGrad1" x1="21.8521" y1="0" x2="21.8521" y2="30.8" gradientUnits="userSpaceOnUse">
          <Stop stopColor="#FF99B1" />
          <Stop offset="1" stopColor="#FF4484" />
        </SvgLinearGradient>
        <SvgLinearGradient id="toiletGrad2" x1="13.6699" y1="0" x2="13.6699" y2="20.9417" gradientUnits="userSpaceOnUse">
          <Stop stopColor="#5CCFFE" />
          <Stop offset="1" stopColor="#2D95FF" />
        </SvgLinearGradient>
      </Defs>
      <Path
        d="M21.8516 6.14496C22.7482 6.14797 23.5053 5.84719 24.1258 5.24262C24.7463 4.63805 25.0566 3.90113 25.0566 3.03789C25.0566 2.17164 24.7463 1.44676 24.1258 0.869258C23.5053 0.28875 22.7482 0 21.8516 0C20.958 0.00300781 20.1979 0.291758 19.5774 0.86625C18.9568 1.44375 18.6466 2.16863 18.6466 3.03488C18.6466 3.90113 18.9568 4.63805 19.5774 5.23961C20.1979 5.84418 20.958 6.14496 21.8516 6.14496ZM28.5439 20.1854L24.9852 9.83254C24.4392 8.38578 23.4184 7.66391 21.926 7.66391H21.7771C20.2848 7.66391 19.2671 8.38578 18.7179 9.83254L15.1592 20.1854C14.9297 20.8532 15.4416 21.545 16.1707 21.545H19.4657V29.7142C19.4657 30.3157 19.9683 30.8 20.5857 30.8H23.1174C23.738 30.8 24.2375 30.3127 24.2375 29.7142V21.545H27.5325C28.2616 21.545 28.7766 20.8532 28.5439 20.1854Z"
        fill="url(#toiletGrad1)"
      />
      <Path
        d="M6.11173 6.14497C6.98502 6.14797 7.72792 5.84719 8.33437 5.24262C8.94081 4.63805 9.24404 3.90114 9.24404 3.0379C9.24404 2.17165 8.94081 1.44676 8.33437 0.869264C7.72792 0.288756 6.98502 6.10352e-06 6.11173 6.10352e-06C5.23845 6.10352e-06 4.49555 0.288756 3.8891 0.866256C3.28265 1.44376 2.97943 2.16864 2.97943 3.03489C2.97943 3.90114 3.28265 4.63805 3.8891 5.23962C4.49555 5.84419 5.23542 6.14497 6.11173 6.14497ZM9.08504 7.66391H3.1354C2.31063 7.66391 1.57986 7.97672 0.949152 8.60536C0.318446 9.23098 6.08961e-05 9.95587 6.08961e-05 10.774V18.1401C6.08961e-05 18.7417 0.491284 19.232 1.10076 19.232H2.65202V29.7202C2.65202 30.3188 3.14021 30.8 3.74059 30.8H8.47075C9.07416 30.8 9.55932 30.3157 9.55932 29.7202V19.232H11.1106C11.717 19.232 12.2113 18.7447 12.2113 18.1401V10.774C12.2113 9.95587 11.8959 9.23098 11.2622 8.60536C10.6406 7.97672 9.9098 7.66391 9.08504 7.66391Z"
        fill="url(#toiletGrad2)"
      />
    </Svg>
  );
}

// 便利店图标
function StoreIcon({ size = 36 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 36 36" fill="none">
      <Defs>
        <SvgLinearGradient id="storeGrad" x1="18" y1="10.5" x2="18" y2="32.5" gradientUnits="userSpaceOnUse">
          <Stop stopColor="#FFC21C" />
          <Stop offset="1" stopColor="#FF6200" />
        </SvgLinearGradient>
      </Defs>
      <Path
        d="M3.45167 14.4024C3.21109 12.3238 4.83602 10.5 6.92846 10.5H29.0715C31.164 10.5 32.7889 12.3238 32.5483 14.4024L30.5807 31.4024C30.3764 33.1679 28.8813 34.5 27.1039 34.5H8.89605C7.11873 34.5 5.6236 33.1679 5.41926 31.4024L3.45167 14.4024Z"
        fill="url(#storeGrad)"
      />
      <Path
        d="M24.0635 14.5C24.6591 13.4704 25 12.275 25 11C25 7.13401 21.866 4 18 4C14.134 4 11 7.13401 11 11C11 12.275 11.3409 13.4704 11.9365 14.5"
        stroke="#FFC800"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <Path
        d="M23.3029 25.8032C20.374 28.7322 15.6252 28.7322 12.6963 25.8032"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </Svg>
  );
}

// 药店图标
function PharmacyIcon({ size = 36 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 23 36" fill="none">
      <Defs>
        <SvgLinearGradient id="pharmacyGrad" x1="11.1177" y1="0" x2="11.1177" y2="36" gradientUnits="userSpaceOnUse">
          <Stop stopColor="#FFB9C9" />
          <Stop offset="1" stopColor="#FF4283" />
        </SvgLinearGradient>
      </Defs>
      <Rect x="0" y="0" width="22.2353" height="36" rx="11.1176" fill="url(#pharmacyGrad)" />
      <Path
        d="M2.64703 11.1179C2.64703 6.4397 6.43945 2.64729 11.1176 2.64729C15.7958 2.64729 19.5882 6.4397 19.5882 11.1179V18.6908H2.64703V11.1179Z"
        fill="#FD628F"
        opacity="0.6"
      />
      <Path
        d="M6.52189 14.1109L6.52189 9.64144"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </Svg>
  );
}

const defaultToilets: ServiceItem[] = [
  { name: '公共厕所', distance: '36m' },
  { name: '长泰广场厕所', distance: '256m' },
  { name: '洗手间(曙光...', distance: '382m' },
];

const defaultStores: ServiceItem[] = [
  { name: '7-11便利店', distance: '120m', logo: BUS_IMAGES.logo711 },
  { name: '全家便利店', distance: '440m', logo: BUS_IMAGES.logoFamilyMart },
  { name: '罗森便利店', distance: '656m', logo: BUS_IMAGES.logoLawson },
];

const defaultPharmacies: ServiceItem[] = [
  { name: '同仁堂药店', distance: '46m', logo: BUS_IMAGES.logoTongrentang },
  { name: '海王星辰药店', distance: '130m', logo: BUS_IMAGES.logoNeptune },
  { name: '老百姓大药房', distance: '356m', logo: BUS_IMAGES.logoLaobaixing },
];

type TabType = 'toilet' | 'store' | 'pharmacy';

export default function ServiceAreaFigma({
  title = '便民服务·东浦路',
  toilets = defaultToilets,
  stores = defaultStores,
  pharmacies = defaultPharmacies,
}: ServiceAreaProps) {
  const [activeTab, setActiveTab] = useState<TabType>('toilet');

  const renderServiceCard = (item: ServiceItem, index: number) => {
    const hasLogo = !!item.logo;
    const cardHeight = hasLogo ? sh(183) : sh(128);

    return (
      <View
        key={index}
        className="bg-[#f8faff] rounded-2xl overflow-hidden"
        style={{
          width: sw(218),
          height: cardHeight,
          marginRight: index < 2 ? sw(20) : 0,
        }}
      >
        {hasLogo && (
          <Image
            source={item.logo}
            className="rounded-lg"
            style={{
              width: sw(50),
              height: sh(50),
              marginLeft: sw(20),
              marginTop: sh(20),
            }}
            resizeMode="contain"
          />
        )}
        <View style={{ marginTop: hasLogo ? sh(18) : sh(42), paddingHorizontal: sw(20) }}>
          <Text
            className="text-black font-medium"
            style={{
              fontSize: sf(26),
              lineHeight: sf(36),
              includeFontPadding: false,
              textAlignVertical: 'center'
            }}
            numberOfLines={1}
          >
            {item.name}
          </Text>
          <View className="flex-row items-center mt-2">
            <LocationIcon size={sw(21)} />
            <Text
              className="text-[#6a6e81] ml-1"
              style={{
                fontSize: sf(24),
                lineHeight: sf(34),
                includeFontPadding: false,
                textAlignVertical: 'center'
              }}
            >
              {item.distance}
            </Text>
          </View>
        </View>
        {hasLogo && <View className="bg-[#f8faff] h-full" style={{ marginTop: sh(3) }} />}
      </View>
    );
  };

  const currentData =
    activeTab === 'toilet' ? toilets : activeTab === 'store' ? stores : pharmacies;

  return (
    <View className="bg-white" style={{ marginTop: sh(12), paddingBottom: sh(40) }}>
      {/* 标题栏 */}
      <View className="flex-row items-center justify-between px-4" style={{ paddingTop: sh(32) }}>
        <Text
          className="text-black font-bold"
          style={{
            fontSize: sf(32),
            lineHeight: sf(44),
            includeFontPadding: false,
            textAlignVertical: 'center'
          }}
        >
          {title}
        </Text>
        <View className="flex-row items-center">
          <Text
            className="text-black/40 mr-1"
            style={{
              fontSize: sf(28),
              lineHeight: sf(38),
              includeFontPadding: false,
              textAlignVertical: 'center'
            }}
          >
            全部服务
          </Text>
          <ArrowRightIcon size={sw(14)} />
        </View>
      </View>

      {/* Tab标签栏 */}
      <View className="flex-row px-4 mt-6" style={{ gap: sw(30) }}>
        {/* 厕所Tab */}
        <TouchableOpacity
          onPress={() => setActiveTab('toilet')}
          activeOpacity={0.8}
          className="flex-row items-center"
        >
          <ToiletIcon size={sw(36)} />
          <Text
            className={`ml-2 ${activeTab === 'toilet' ? 'text-black font-medium' : 'text-[#999999]'}`}
            style={{
              fontSize: sf(30),
              lineHeight: sf(42),
              includeFontPadding: false,
              textAlignVertical: 'center'
            }}
          >
            厕所
          </Text>
        </TouchableOpacity>

        {/* 便利店Tab */}
        <TouchableOpacity
          onPress={() => setActiveTab('store')}
          activeOpacity={0.8}
          className="flex-row items-center"
        >
          <StoreIcon size={sw(36)} />
          <Text
            className={`ml-2 ${activeTab === 'store' ? 'text-black font-medium' : 'text-[#999999]'}`}
            style={{
              fontSize: sf(30),
              lineHeight: sf(42),
              includeFontPadding: false,
              textAlignVertical: 'center'
            }}
          >
            便利店
          </Text>
        </TouchableOpacity>

        {/* 药店Tab */}
        <TouchableOpacity
          onPress={() => setActiveTab('pharmacy')}
          activeOpacity={0.8}
          className="flex-row items-center"
        >
          <PharmacyIcon size={sw(22)} />
          <Text
            className={`ml-2 ${activeTab === 'pharmacy' ? 'text-black font-medium' : 'text-[#999999]'}`}
            style={{
              fontSize: sf(30),
              lineHeight: sf(42),
              includeFontPadding: false,
              textAlignVertical: 'center'
            }}
          >
            药店
          </Text>
        </TouchableOpacity>
      </View>

      {/* 服务卡片列表 */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="mt-6 px-4"
        contentContainerStyle={{ gap: sw(20) }}
      >
        {currentData.map((item, index) => renderServiceCard(item, index))}
      </ScrollView>
    </View>
  );
}
