import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';

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
    <View className="bg-white border-b border-border">
      <View className="px-4 py-3">
        {/* Header */}
        <TouchableOpacity className="flex-row items-center justify-between mb-3 py-1" activeOpacity={0.7}>
          <View className="flex-row items-center gap-2">
            <Text className="text-sm">📌</Text>
            <Text className="text-sm text-text-primary">社区置顶贴</Text>
          </View>
          <Text className="text-[12px] text-text-secondary">▼</Text>
        </TouchableOpacity>

        {/* Horizontal Scroll */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingRight: 16, gap: 12 }}
          snapToInterval={cardWidth + 12}
          decelerationRate="fast"
        >
          {posts.map((post) => (
            <TouchableOpacity
              key={post.id}
              className="rounded-lg overflow-hidden bg-[#1F2937]"
              style={{ width: cardWidth, aspectRatio: 1 }}
              onPress={() => onPostPress?.(post.id)}
              activeOpacity={0.9}
            >
              {post.imageUrl ? (
                <>
                  <Image
                    source={{ uri: post.imageUrl }}
                    className="w-full h-full opacity-80"
                    resizeMode="cover"
                  />
                  <View className="absolute bottom-0 left-0 right-0 p-3 justify-end">
                    <Text className="text-white text-xs leading-4 mb-1" numberOfLines={3}>
                      {post.title}
                    </Text>
                    {post.tag && (
                      <View className="self-start bg-[#EA580C] px-2 py-0.5 rounded-sm">
                        <Text className="text-white text-xs">{post.tag}</Text>
                      </View>
                    )}
                  </View>
                </>
              ) : (
                <View className="flex-1 bg-[#374151] p-3 justify-end">
                  <Text className="text-white text-xs leading-4 mb-1" numberOfLines={4}>
                    {post.title}
                  </Text>
                  {post.tag && (
                    <View className="self-start bg-[#2563EB] px-2 py-0.5 rounded-sm">
                      <Text className="text-white text-xs">{post.tag}</Text>
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
