// Home Screen - Updated with animations

import React, { useEffect, useRef } from 'react';
import { ScrollView, TouchableOpacity, Text, Animated } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import BusInfo from '../components/home/BusInfo';
import WiFiButton from '../components/home/WiFiButton';
import EmergencyServices from '../components/home/EmergencyServices';
import NearbyRecommend from '../components/home/NearbyRecommend';
import { animations } from '@utils/animations';

export default function HomeScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    // Fade in and slide up animation on mount
    Animated.parallel([
      animations.fadeIn(fadeAnim, 500),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleWiFiConnect = () => {
    // Navigate to WiFi screen or show success message
    console.log('WiFi connected!');
  };

  const handleServicePress = (type: string, place: string) => {
    console.log(`Opening ${type}: ${place}`);
  };

  const handleAIChatPress = () => {
    navigation.navigate('AIChat' as never);
  };

  return (
    <ScrollView className="flex-1 bg-background" contentContainerStyle={{ padding: 16 }}>
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        }}
      >
        {/* Bus Information */}
        <BusInfo
          busLine={t('home.bus.line')}
          currentStation={t('home.bus.station_xinjiekou')}
          nextStation={t('home.bus.station_zhujianglu')}
          stationsLeft={5}
        />

        {/* WiFi Connection Button */}
        <WiFiButton onPress={handleWiFiConnect} />

        {/* Emergency Services */}
        <EmergencyServices onServicePress={handleServicePress} />

        {/* Nearby Recommendations */}
        <NearbyRecommend />

        {/* AI Chat Button */}
        <TouchableOpacity
          className="bg-secondary p-lg rounded-lg flex-row items-center justify-center mt-lg ios:shadow-md-rn android:elevation-3"
          onPress={handleAIChatPress}
          activeOpacity={0.8}
        >
          <Text className="text-2xl mr-md">🐱</Text>
          <Text className="text-lg font-semibold text-white">{t('home.ai_chat.title')}</Text>
        </TouchableOpacity>
      </Animated.View>
    </ScrollView>
  );
}
