// Modal Component

import React, { ReactNode } from 'react';
import {
  Modal as RNModal,
  View,
  Text,
  TouchableOpacity,
  ModalProps as RNModalProps,
} from 'react-native';

interface ModalProps extends RNModalProps {
  visible: boolean;
  title?: string;
  children: ReactNode;
  onClose: () => void;
  showCloseButton?: boolean;
}

export default function Modal({
  visible,
  title,
  children,
  onClose,
  showCloseButton = true,
  ...props
}: ModalProps) {
  return (
    <RNModal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      {...props}
    >
      <View className="flex-1 bg-[rgba(0,0,0,0.5)] justify-center items-center p-6">
        <View className="bg-white rounded-lg w-full max-w-[400px]">
          {title && (
            <View className="flex-row justify-between items-center p-4 border-b border-border">
              <Text className="text-lg font-bold text-text-primary">{title}</Text>
              {showCloseButton && (
                <TouchableOpacity onPress={onClose} className="p-1">
                  <Text className="text-xl text-text-secondary">✕</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
          <View className="p-4">{children}</View>
        </View>
      </View>
    </RNModal>
  );
}
