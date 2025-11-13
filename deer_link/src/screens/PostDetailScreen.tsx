// Post Detail Screen - 帖子详情页
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import FastImage from 'react-native-fast-image';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import CommentItem from '@components/comments/CommentItem';
import CommentInput from '@components/comments/CommentInput';
import BackButtonIcon from '@components/common/BackButtonIcon';
import { useUser } from '@contexts/UserContext';
import { getFlairColor } from '@utils/flairColors';
import { formatTimeAgo } from '@utils/time';
import type { Post } from '@types';
import type { Comment } from '@types/comment';

type PostDetailScreenRouteProp = RouteProp<
  { PostDetail: { postId: string; post?: Post } },
  'PostDetail'
>;

export default function PostDetailScreen() {
  const route = useRoute<PostDetailScreenRouteProp>();
  const navigation = useNavigation();
  const { userId, nickname, avatar } = useUser();

  const { postId, post: initialPost } = route.params;
  const [post, setPost] = useState<Post | null>(initialPost || null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(!initialPost);
  const [replyingTo, setReplyingTo] = useState<Comment | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(0);

  useEffect(() => {
    loadPostAndComments();
  }, [postId]);

  const loadPostAndComments = async () => {
    try {
      setLoading(true);
      // TODO: Load post and comments from API
      // const postData = await getPost(postId);
      // const commentsData = await getComments(postId);

      // Mock data for now
      if (initialPost) {
        setPost(initialPost);
        // Handle both isLiked and is_liked fields
        setIsLiked(initialPost.isLiked || initialPost.is_liked || false);
        setLikes(initialPost.likes || 0);
      }

      // Mock comments
      setComments([
        {
          comment_id: '1',
          post_id: postId,
          user_id: 'user1',
          username: '南京小王',
          avatar: 'https://images.unsplash.com/photo-1526876917250-9c7bcecd349f?w=200',
          content: '这个信息很有用，感谢分享！',
          timestamp: Date.now() - 3600000,
          likes: 12,
          isLiked: false,
          replies: [
            {
              comment_id: '2',
              post_id: postId,
              user_id: 'user2',
              username: '公交迷老李',
              avatar: 'https://images.unsplash.com/photo-1672685667592-0392f458f46f?w=200',
              content: '同意，这条线路确实很方便',
              timestamp: Date.now() - 1800000,
              likes: 5,
              isLiked: false,
              parent_id: '1',
            },
          ],
        },
        {
          comment_id: '3',
          post_id: postId,
          user_id: 'user3',
          username: '地铁通勤者',
          avatar: 'https://images.unsplash.com/photo-1734764627104-6ad22c48af6a?w=200',
          content: '我也经常坐这条线路，体验不错',
          timestamp: Date.now() - 7200000,
          likes: 8,
          isLiked: false,
        },
      ]);
    } catch (error) {
      console.error('Failed to load post details:', error);
      Alert.alert('错误', '加载帖子详情失败');
    } finally {
      setLoading(false);
    }
  };

  const handleLikePost = () => {
    const newIsLiked = !isLiked;
    setIsLiked(newIsLiked);
    setLikes(newIsLiked ? likes + 1 : likes - 1);
    // TODO: Call API to like/unlike post
  };

  const handleSubmitComment = (content: string) => {
    const newComment: Comment = {
      comment_id: `comment_${Date.now()}`,
      post_id: postId,
      user_id: userId,
      username: nickname,
      avatar,
      content,
      timestamp: Date.now(),
      likes: 0,
      isLiked: false,
      parent_id: replyingTo?.comment_id || null,
    };

    if (replyingTo) {
      // Add as reply
      setComments(
        comments.map((c) => {
          if (c.comment_id === replyingTo.comment_id) {
            return {
              ...c,
              replies: [...(c.replies || []), newComment],
            };
          }
          return c;
        })
      );
      setReplyingTo(null);
    } else {
      // Add as new comment
      setComments([newComment, ...comments]);
    }
    // TODO: Call API to create comment
  };

  const handleReply = (comment: Comment) => {
    setReplyingTo(comment);
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <ActivityIndicator size="large" color="#0285f0" />
      </View>
    );
  }

  if (!post) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <Text className="text-gray-500">帖子不存在</Text>
      </View>
    );
  }

  const flairColors = post.bus_tag ? getFlairColor(post.bus_tag) : null;

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <BackButtonIcon size={32} />
        </TouchableOpacity>
        <Text className="text-base font-medium text-gray-900">帖子详情</Text>
        <View className="w-8" />
      </View>

      <ScrollView className="flex-1">
        {/* Post Content */}
        <View className="bg-white mb-2">
          <View className="p-4">
            {/* Post Header */}
            <View className="flex-row items-center mb-3">
              <Image
                source={{ uri: post.avatar }}
                className="w-8 h-8 rounded-full mr-2"
              />
              <View>
                <Text className="text-sm font-medium text-gray-900">{post.username}</Text>
                <Text className="text-xs text-gray-500">
                  {formatTimeAgo(post.timestamp)}
                </Text>
              </View>
            </View>

            {/* Title */}
            <Text className="text-lg font-medium text-gray-900 mb-2">{post.title}</Text>

            {/* Flair */}
            {post.bus_tag && flairColors && (
              <View
                className="self-start px-3 py-1 rounded-full mb-3"
                style={{ backgroundColor: flairColors.bg }}
              >
                <Text className="text-xs font-medium" style={{ color: flairColors.text }}>
                  {post.bus_tag}
                </Text>
              </View>
            )}

            {/* Content */}
            {post.content && (
              <Text className="text-sm text-gray-800 leading-5 mb-3">{post.content}</Text>
            )}

            {/* Images */}
            {post.image_urls && (
              <View className="mb-3">
                {(Array.isArray(post.image_urls) ? post.image_urls : [post.image_urls])
                  .filter(url => url && url.trim() !== '')
                  .map((url, index) => (
                    <FastImage
                      key={index}
                      source={{ uri: url, priority: FastImage.priority.normal }}
                      className="w-full h-64 rounded-lg mb-2"
                      resizeMode={FastImage.resizeMode.cover}
                    />
                  ))}
              </View>
            )}

            {/* Actions */}
            <View className="flex-row items-center gap-4 pt-2">
              {/* Like */}
              <TouchableOpacity
                onPress={handleLikePost}
                className="flex-row items-center gap-2 bg-gray-100 rounded-full px-3 py-1.5"
                activeOpacity={0.7}
              >
                <Icon
                  name={isLiked ? 'arrow-up' : 'arrow-up-outline'}
                  size={18}
                  color={isLiked ? '#FF4500' : '#374151'}
                />
                <Text className={`text-sm ${isLiked ? 'text-orange-500' : 'text-gray-800'}`}>
                  {likes}
                </Text>
              </TouchableOpacity>

              {/* Comment Count */}
              <View className="flex-row items-center gap-2 bg-gray-100 rounded-full px-3 py-1.5">
                <Icon name="chatbubble-outline" size={16} color="#374151" />
                <Text className="text-sm text-gray-800">{comments.length}</Text>
              </View>

              {/* Share */}
              <TouchableOpacity
                className="flex-row items-center gap-2 bg-gray-100 rounded-full px-3 py-1.5 ml-auto"
                activeOpacity={0.7}
              >
                <Icon name="share-outline" size={16} color="#374151" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Comments Section */}
        <View className="bg-white">
          <View className="px-4 py-3 border-b border-gray-200">
            <Text className="text-sm font-medium text-gray-900">
              评论 ({comments.length})
            </Text>
          </View>
          <View className="px-4">
            {comments.length === 0 ? (
              <View className="py-8 items-center">
                <Icon name="chatbubbles-outline" size={48} color="#D1D5DB" />
                <Text className="text-sm text-gray-400 mt-2">还没有评论，来发表第一条吧</Text>
              </View>
            ) : (
              comments.map((comment) => (
                <CommentItem
                  key={comment.comment_id}
                  comment={comment}
                  onReply={handleReply}
                />
              ))
            )}
          </View>
        </View>
      </ScrollView>

      {/* Comment Input */}
      <CommentInput
        onSubmit={handleSubmitComment}
        replyTo={replyingTo?.username || null}
        onCancelReply={() => setReplyingTo(null)}
      />
    </SafeAreaView>
  );
}
