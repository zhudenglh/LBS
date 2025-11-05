// Modal Component

import React, { ReactNode } from 'react';
import {
  Modal as RNModal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ModalProps as RNModalProps,
} from 'react-native';
import { colors, spacing, fontSize, borderRadius } from '@constants/theme';

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
      <View style={styles.overlay}>
        <View style={styles.container}>
          {title && (
            <View style={styles.header}>
              <Text style={styles.title}>{title}</Text>
              {showCloseButton && (
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <Text style={styles.closeIcon}>✕</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
          <View style={styles.content}>{children}</View>
        </View>
      </View>
    </RNModal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  container: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    width: '100%',
    maxWidth: 400,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: fontSize.lg,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  closeButton: {
    padding: spacing.xs,
  },
  closeIcon: {
    fontSize: 20,
    color: colors.text.secondary,
  },
  content: {
    padding: spacing.lg,
  },
});
