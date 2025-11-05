// Animation Utilities

import { Animated, Easing } from 'react-native';

export const animations = {
  // Fade in animation
  fadeIn: (value: Animated.Value, duration: number = 300) => {
    return Animated.timing(value, {
      toValue: 1,
      duration,
      useNativeDriver: true,
      easing: Easing.ease,
    });
  },

  // Fade out animation
  fadeOut: (value: Animated.Value, duration: number = 300) => {
    return Animated.timing(value, {
      toValue: 0,
      duration,
      useNativeDriver: true,
      easing: Easing.ease,
    });
  },

  // Slide up animation
  slideUp: (value: Animated.Value, duration: number = 300) => {
    return Animated.timing(value, {
      toValue: 0,
      duration,
      useNativeDriver: true,
      easing: Easing.out(Easing.cubic),
    });
  },

  // Slide down animation
  slideDown: (value: Animated.Value, toValue: number, duration: number = 300) => {
    return Animated.timing(value, {
      toValue,
      duration,
      useNativeDriver: true,
      easing: Easing.in(Easing.cubic),
    });
  },

  // Scale animation
  scale: (value: Animated.Value, toValue: number, duration: number = 200) => {
    return Animated.spring(value, {
      toValue,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    });
  },

  // Bounce animation
  bounce: (value: Animated.Value) => {
    return Animated.sequence([
      Animated.timing(value, {
        toValue: 1.1,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(value, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]);
  },

  // Shake animation
  shake: (value: Animated.Value) => {
    return Animated.sequence([
      Animated.timing(value, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(value, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(value, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(value, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]);
  },
};

// Custom hooks for animations
export function useFadeAnimation(initialValue: number = 0) {
  const fadeAnim = React.useRef(new Animated.Value(initialValue)).current;

  const fadeIn = () => animations.fadeIn(fadeAnim).start();
  const fadeOut = () => animations.fadeOut(fadeAnim).start();

  return { fadeAnim, fadeIn, fadeOut };
}

export function useScaleAnimation(initialValue: number = 1) {
  const scaleAnim = React.useRef(new Animated.Value(initialValue)).current;

  const scaleUp = () => animations.scale(scaleAnim, 1.1).start();
  const scaleDown = () => animations.scale(scaleAnim, 1).start();

  return { scaleAnim, scaleUp, scaleDown };
}

import React from 'react';
