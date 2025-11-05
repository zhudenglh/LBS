// Home Screen - Updated with animations

import React, { useEffect, useRef } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, Text, Animated } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import BusInfo from '../components/home/BusInfo';
import WiFiButton from '../components/home/WiFiButton';
import EmergencyServices from '../components/home/EmergencyServices';
import NearbyRecommend from '../components/home/NearbyRecommend';
import { colors, spacing, fontSize, borderRadius, shadows } from '@constants/theme';
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
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
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
          style={styles.aiChatButton}
          onPress={handleAIChatPress}
          activeOpacity={0.8}
        >
          <Text style={styles.aiChatIcon}>🐱</Text>
          <Text style={styles.aiChatText}>{t('home.ai_chat.title')}</Text>
        </TouchableOpacity>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
  },
  aiChatButton: {
    backgroundColor: colors.secondary,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.lg,
    ...shadows.md,
  },
  aiChatIcon: {
    fontSize: 24,
    marginRight: spacing.md,
  },
  aiChatText: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.white,
  },
});
