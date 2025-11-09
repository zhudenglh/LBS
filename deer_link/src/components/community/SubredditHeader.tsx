import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import BackButtonIcon from '@components/common/BackButtonIcon';
import { colors, spacing, fontSize, borderRadius, shadows } from '@constants/theme';

const { width } = Dimensions.get('window');

interface SubredditHeaderProps {
  name: string;
  members: string;
  avatarUrl?: string;
  bannerUrl?: string;
  isJoined?: boolean;
  weeklyVisitors?: string;
  weeklyContributors?: string;
  description?: string;
  ranking?: string;
  onBack?: () => void;
  onJoinToggle?: () => void;
  onNotifications?: () => void;
}

export default function SubredditHeader({
  name,
  members,
  avatarUrl,
  bannerUrl,
  isJoined = false,
  weeklyVisitors = '近3万5千访客',
  weeklyContributors = '近4千1百贡献',
  description = '搭载移动城市智能体，是能聊路线、拼生活、寻同路人的暖心城市出行社区',
  ranking = '#7 in 出行',
  onBack,
  onJoinToggle,
  onNotifications,
}: SubredditHeaderProps) {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      {/* Banner Image */}
      <View style={styles.bannerContainer}>
        {bannerUrl ? (
          <Image
            source={{ uri: bannerUrl }}
            style={styles.banner}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.bannerPlaceholder} />
        )}

        {/* Icon Buttons Overlay */}
        <View style={styles.iconButtons}>
          {/* Back Button */}
          <TouchableOpacity
            onPress={onBack}
            activeOpacity={0.7}
          >
            <BackButtonIcon size={40} />
          </TouchableOpacity>

          {/* Right Buttons */}
          <View style={styles.rightButtons}>
            <TouchableOpacity style={styles.iconButton} activeOpacity={0.7}>
              <Text style={styles.iconText}>🔍</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} activeOpacity={0.7}>
              <Text style={styles.iconText}>🔗</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} activeOpacity={0.7}>
              <Text style={styles.iconText}>⋮</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Subreddit Info */}
      <View style={styles.infoContainer}>
        {/* Main Row: Avatar + Name + Join Button */}
        <View style={styles.mainRow}>
          {/* Left: Avatar + Name + Stats */}
          <View style={styles.leftSection}>
            {/* Avatar */}
            <Image
              source={{
                uri:
                  avatarUrl ||
                  'https://images.unsplash.com/photo-1756723701257-46513cd36fc1?w=200',
              }}
              style={styles.avatar}
            />

            {/* Name and Stats */}
            <View style={styles.nameSection}>
              <Text style={styles.name}>圈/{name}</Text>
              <View style={styles.stats}>
                <Text style={styles.statText}>{weeklyVisitors}</Text>
                <Text style={styles.dot}>•</Text>
                <Text style={styles.statText}>{weeklyContributors}</Text>
              </View>
            </View>
          </View>

          {/* Right: Join Button + Bell */}
          <View style={styles.rightSection}>
            {isJoined ? (
              <>
                <TouchableOpacity
                  style={styles.joinedButton}
                  onPress={onJoinToggle}
                  activeOpacity={0.7}
                >
                  <Text style={styles.joinedButtonText}>已加入</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.bellButton}
                  onPress={onNotifications}
                  activeOpacity={0.7}
                >
                  <Text style={styles.bellIcon}>🔔</Text>
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity
                style={styles.joinButton}
                onPress={onJoinToggle}
                activeOpacity={0.7}
              >
                <Text style={styles.joinButtonText}>加入</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Separator */}
        <View style={styles.separator} />

        {/* Description */}
        <Text style={styles.description}>{description}</Text>

        {/* View More + Ranking */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.viewMore} activeOpacity={0.7}>
            <Text style={styles.viewMoreText}>查看更多内容</Text>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
          <View style={styles.rankingContainer}>
            <Text style={styles.trendingIcon}>📈</Text>
            <Text style={styles.rankingText}>{ranking}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
  },
  bannerContainer: {
    height: 96,
    position: 'relative',
  },
  banner: {
    width: '100%',
    height: '100%',
  },
  bannerPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#FB923C', // orange-400
  },
  iconButtons: {
    position: 'absolute',
    bottom: 4,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    color: colors.white,
    fontSize: 20,
  },
  rightButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  infoContainer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  mainRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
    gap: spacing.md,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: colors.white,
    backgroundColor: colors.white,
  },
  nameSection: {
    flex: 1,
  },
  name: {
    fontSize: fontSize.lg,
    fontWeight: '500',
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  statText: {
    fontSize: fontSize.xs,
    color: colors.text.secondary,
  },
  dot: {
    fontSize: fontSize.xs,
    color: colors.text.disabled,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  joinButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.round,
  },
  joinButtonText: {
    color: colors.white,
    fontSize: fontSize.xs,
    fontWeight: '500',
  },
  joinedButton: {
    borderWidth: 1,
    borderColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.round,
  },
  joinedButtonText: {
    color: colors.primary,
    fontSize: fontSize.xs,
    fontWeight: '500',
  },
  bellButton: {
    padding: spacing.sm,
  },
  bellIcon: {
    fontSize: 16,
  },
  separator: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
  },
  description: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    lineHeight: 20,
    marginBottom: spacing.md,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  viewMore: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewMoreText: {
    fontSize: fontSize.sm,
    color: colors.primary,
  },
  chevron: {
    fontSize: 18,
    color: colors.primary,
  },
  rankingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  trendingIcon: {
    fontSize: 14,
  },
  rankingText: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
  },
});
