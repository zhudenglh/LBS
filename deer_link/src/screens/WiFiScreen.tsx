// WiFi Screen with Figma Design

import React, { useState } from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import WiFiConnectionCard from '../components/wifi/WiFiConnectionCard';
import QuickActionGrid from '../components/wifi/QuickActionGrid';
import BusRouteCard from '../components/wifi/BusRouteCard';
import MerchantOfferCard from '../components/wifi/MerchantOfferCard';

interface MerchantOffer {
  id: string;
  name: string;
  category: string;
  distance: string;
  offer: string;
  imageUrl?: string;
}

export default function WiFiScreen() {
  const { t } = useTranslation();
  const [isConnected, setIsConnected] = useState(false);
  const [connectedNetwork, setConnectedNetwork] = useState<string | undefined>(undefined);

  // Quick action buttons
  const quickActions = [
    { id: '1', icon: '🚌', labelKey: 'wifi.actions.bus_routes', onPress: () => handleAction('bus') },
    { id: '2', icon: '💰', labelKey: 'wifi.actions.cashback', onPress: () => handleAction('cashback') },
    { id: '3', icon: '🏥', labelKey: 'wifi.actions.health', onPress: () => handleAction('health') },
    { id: '4', icon: '💼', labelKey: 'wifi.actions.savings', onPress: () => handleAction('savings') },
  ];

  // Mock merchant offers
  const merchantOffers: MerchantOffer[] = [
    {
      id: '1',
      name: t('wifi.merchants.starbucks'),
      category: t('wifi.categories.cafe'),
      distance: '120m',
      offer: t('wifi.offers.starbucks_offer'),
    },
    {
      id: '2',
      name: t('wifi.merchants.kfc'),
      category: t('wifi.categories.restaurant'),
      distance: '200m',
      offer: t('wifi.offers.kfc_offer'),
    },
    {
      id: '3',
      name: t('wifi.merchants.familymart'),
      category: t('wifi.categories.shop'),
      distance: '80m',
      offer: t('home.nearby.offers.student_20_off'),
    },
    {
      id: '4',
      name: t('wifi.merchants.cinema_paradise'),
      category: t('wifi.categories.entertainment'),
      distance: '350m',
      offer: t('wifi.offers.cinema_offer'),
    },
  ];

  const handleConnect = () => {
    if (isConnected) {
      Alert.alert(
        t('wifi.disconnect'),
        t('wifi.confirm_disconnect'),
        [
          { text: t('common.button.cancel'), style: 'cancel' },
          {
            text: t('common.button.confirm'),
            onPress: () => {
              setIsConnected(false);
              setConnectedNetwork(undefined);
              Alert.alert(t('wifi.disconnected'));
            },
          },
        ]
      );
    } else {
      setIsConnected(true);
      setConnectedNetwork(t('wifi.networks.nanjing_bus'));
      Alert.alert(t('wifi.connect_success'));
    }
  };

  const handleAction = (action: string) => {
    Alert.alert(t('common.coming_soon'), `${action} ${t('common.feature_coming_soon')}`);
  };

  const handleOfferPress = (offer: MerchantOffer) => {
    Alert.alert(offer.name, offer.offer);
  };

  // Split offers into two columns
  const leftColumnOffers = merchantOffers.filter((_, index) => index % 2 === 0);
  const rightColumnOffers = merchantOffers.filter((_, index) => index % 2 === 1);

  return (
    <View className="flex-1 bg-background">
      {/* Top Gradient Background - Using overlapping colored views */}
      <View className="absolute left-0 right-0 top-0 h-[250px] bg-gradient-start z-0" />
      <View className="absolute left-0 right-0 top-[250px] h-[81px] bg-gradient-end opacity-95 z-0" />

      <ScrollView className="flex-1 z-10">
        {/* WiFi Connection Card */}
        <WiFiConnectionCard
        isConnected={isConnected}
        networkName={connectedNetwork}
        onConnect={handleConnect}
      />

      {/* Quick Action Buttons */}
      <QuickActionGrid actions={quickActions} />

      {/* Bus Route Card */}
      <BusRouteCard
        routeName={t('home.bus.line')}
        currentStation={t('home.bus.station_xinjiekou')}
        nextStation={t('home.bus.station_zhujianglu')}
      />

      {/* Nearby Merchants Title */}
      <Text className="text-lg font-bold text-text-primary mx-lg mt-xl mb-md">{t('wifi.nearby_merchants')}</Text>

      {/* Merchant Offers Grid */}
      <View className="flex-row px-lg pb-xl">
        <View className="flex-1 mx-xs">
          {leftColumnOffers.map((offer) => (
            <MerchantOfferCard
              key={offer.id}
              offer={offer}
              onPress={() => handleOfferPress(offer)}
            />
          ))}
        </View>
        <View className="flex-1 mx-xs">
          {rightColumnOffers.map((offer) => (
            <MerchantOfferCard
              key={offer.id}
              offer={offer}
              onPress={() => handleOfferPress(offer)}
            />
          ))}
        </View>
      </View>
      </ScrollView>
    </View>
  );
}
