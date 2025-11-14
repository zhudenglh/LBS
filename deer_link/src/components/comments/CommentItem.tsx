// Comment Item - 单条评论
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import type { Comment } from '@types/comment';
import { formatTimeAgo } from '@utils/time';
import Avatar from '@components/common/Avatar';

interface CommentItemProps {
  comment: Comment;
  onLike?: (commentId: string, isLiked: boolean) => void;
  onReply?: (comment: Comment) => void;
  level?: number;
}

export default function CommentItem({
  comment,
  onLike,
  onReply,
  level = 0,
}: CommentItemProps) {
  const [isLiked, setIsLiked] = useState(comment.isLiked || false);
  const [likes, setLikes] = useState(comment.likes || 0);

  const handleLike = () => {
    const newIsLiked = !isLiked;
    setIsLiked(newIsLiked);
    setLikes(newIsLiked ? likes + 1 : likes - 1);
    onLike?.(comment.comment_id, newIsLiked);
  };

  return (
    <View className="py-3" style={{ paddingLeft: level * 16 }}>
      {/* Comment Header */}
      <View className="flex-row items-center mb-2">
        <View className="mr-2">
          <Avatar uri={comment.avatar} size={24} />
        </View>
        <Text className="text-xs font-medium text-gray-900">{comment.username}</Text>
        <Text className="text-xs text-gray-400 ml-2">
          {formatTimeAgo(comment.timestamp)}
        </Text>
      </View>

      {/* Comment Content */}
      <Text className="text-sm text-gray-800 leading-5 mb-2">{comment.content}</Text>

      {/* Comment Actions */}
      <View className="flex-row items-center gap-4">
        {/* Like */}
        <TouchableOpacity
          onPress={handleLike}
          className="flex-row items-center gap-1"
          activeOpacity={0.7}
        >
          <Icon
            name={isLiked ? 'arrow-up' : 'arrow-up-outline'}
            size={16}
            color={isLiked ? '#FF4500' : '#6B7280'}
          />
          <Text className={`text-xs ${isLiked ? 'text-orange-500' : 'text-gray-600'}`}>
            {likes}
          </Text>
        </TouchableOpacity>

        {/* Reply */}
        <TouchableOpacity
          onPress={() => onReply?.(comment)}
          className="flex-row items-center gap-1"
          activeOpacity={0.7}
        >
          <Icon name="chatbubble-outline" size={14} color="#6B7280" />
          <Text className="text-xs text-gray-600">回复</Text>
        </TouchableOpacity>
      </View>

      {/* Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <View className="mt-2">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.comment_id}
              comment={reply}
              onLike={onLike}
              onReply={onReply}
              level={level + 1}
            />
          ))}
        </View>
      )}
    </View>
  );
}
