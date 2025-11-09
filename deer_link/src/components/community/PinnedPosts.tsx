import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { colors, spacing, fontSize, borderRadius } from '@constants/theme';

const { width } = Dimensions.get('window');

interface PinnedPost {
  id: number;
  title: string;
  tag?: string;
  imageUrl?: string;
}

interface PinnedPostsProps {
  posts?: PinnedPost[];
  onPostPress?: (postId: number) => void;
}

const DEFAULT_PINNED_POSTS: PinnedPost[] = [
  {
    id: 1,
    title: '今天在中山码头站捡到一个iPhone X，稍微有点旧',
    tag: '失物招领',
    imageUrl:
      'https://images.unsplash.com/photo-1636589150123-6d57c10527ce?w=400',
  },
  {
    id: 2,
    title: '建邺区夜未央银泰城胖东来新开了，人挤人',
    tag: '新店开业',
    imageUrl:
      'https://images.unsplash.com/photo-1742036626607-3ae1ac406cae?w=400',
  },
  {
    id: 3,
    title: '有没有发现现在的蚊子进化了',
    tag: '讨论',
    imageUrl:
      'https://images.unsplash.com/photo-1728204609442-aae7eba17b61?w=400',
  },
];

export default function PinnedPosts({
  posts = DEFAULT_PINNED_POSTS,
  onPostPress,
}: PinnedPostsProps) {
  const cardWidth = (width - 56) / 2.25;

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <TouchableOpacity style={styles.header} activeOpacity={0.7}>
          <View style={styles.headerLeft}>
            <Text style={styles.pinIcon}>📌</Text>
            <Text style={styles.headerText}>社区置顶贴</Text>
          </View>
          <Text style={styles.chevronDown}>▼</Text>
        </TouchableOpacity>

        {/* Horizontal Scroll */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          snapToInterval={cardWidth + spacing.md}
          decelerationRate="fast"
        >
          {posts.map((post) => (
            <TouchableOpacity
              key={post.id}
              style={[styles.card, { width: cardWidth }]}
              onPress={() => onPostPress?.(post.id)}
              activeOpacity={0.9}
            >
              {post.imageUrl ? (
                <>
                  <Image
                    source={{ uri: post.imageUrl }}
                    style={styles.cardImage}
                    resizeMode="cover"
                  />
                  <View style={styles.overlay}>
                    <Text style={styles.cardTitle} numberOfLines={3}>
                      {post.title}
                    </Text>
                    {post.tag && (
                      <View style={styles.tag}>
                        <Text style={styles.tagText}>{post.tag}</Text>
                      </View>
                    )}
                  </View>
                </>
              ) : (
                <View style={styles.noImageCard}>
                  <Text style={styles.cardTitle} numberOfLines={4}>
                    {post.title}
                  </Text>
                  {post.tag && (
                    <View style={[styles.tag, styles.blueTag]}>
                      <Text style={styles.tagText}>{post.tag}</Text>
                    </View>
                  )}
                </View>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
    paddingVertical: spacing.xs,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  pinIcon: {
    fontSize: 14,
  },
  headerText: {
    fontSize: fontSize.sm,
    color: colors.text.primary,
  },
  chevronDown: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  scrollContent: {
    paddingRight: spacing.lg,
    gap: spacing.md,
  },
  card: {
    aspectRatio: 1,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    backgroundColor: '#1F2937',
  },
  cardImage: {
    width: '100%',
    height: '100%',
    opacity: 0.8,
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.md,
    justifyContent: 'flex-end',
  },
  cardTitle: {
    color: colors.white,
    fontSize: fontSize.xs,
    lineHeight: 16,
    marginBottom: spacing.xs,
  },
  tag: {
    alignSelf: 'flex-start',
    backgroundColor: '#EA580C',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  blueTag: {
    backgroundColor: '#2563EB',
  },
  tagText: {
    color: colors.white,
    fontSize: fontSize.xs,
  },
  noImageCard: {
    flex: 1,
    backgroundColor: '#374151',
    padding: spacing.md,
    justifyContent: 'flex-end',
  },
});
