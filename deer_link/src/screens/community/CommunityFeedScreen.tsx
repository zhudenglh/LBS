import React, { useState } from 'react';
import {
  View,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import CommunityHeader, { ViewType } from '@components/community/CommunityHeader';
import PostCardWithFlair from '@components/community/PostCardWithFlair';

// 20个主页帖子数据 - 完全来自Figma设计
const HOME_POSTS = [
  {
    id: 1,
    subreddit: '南京公交',
    timeAgo: '1小时前',
    title: '【失物招领】今天在中山码头站捡到一个iPhone X，稍微有点旧',
    imageUrl: 'https://images.unsplash.com/photo-1636589150123-6d57c10527ce?w=400',
    upvotes: 892,
    comments: 67,
    isJoined: true,
  },
  {
    id: 2,
    subreddit: '旅游',
    timeAgo: '3小时前',
    title: '📍云南大理三日游攻略，人均2000元玩转洱海古城',
    imageUrl: 'https://images.unsplash.com/photo-1614088459293-5669fadc3448?w=400',
    upvotes: 3456,
    comments: 234,
    awards: 3,
    isJoined: true,
  },
  {
    id: 3,
    subreddit: '美食',
    timeAgo: '4小时前',
    title: '自己做的红烧肉，第一次尝试感觉还不错😋',
    imageUrl: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400',
    upvotes: 1890,
    comments: 167,
  },
  {
    id: 4,
    subreddit: '南京公交',
    timeAgo: '5小时前',
    title: '📍【线路更新】1号线延伸段正式开通，新增5个站点！',
    upvotes: 1245,
    comments: 87,
    isJoined: true,
  },
  {
    id: 5,
    subreddit: '游戏',
    timeAgo: '6小时前',
    title: '🎮 终于打通了《黑神话：悟空》全成就，分享一些心得',
    imageUrl: 'https://images.unsplash.com/photo-1635372708431-64774de60e20?w=400',
    upvotes: 5678,
    comments: 789,
    awards: 5,
  },
  {
    id: 6,
    subreddit: '健身',
    timeAgo: '7小时前',
    title: '坚持健身3个月的变化对比，努力终于有了回报💪',
    imageUrl: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=400',
    upvotes: 4321,
    comments: 345,
  },
  {
    id: 7,
    subreddit: '萌宠',
    timeAgo: '8小时前',
    title: '我家猫咪今天学会了握手，太聪明了🐱',
    imageUrl: 'https://images.unsplash.com/photo-1670665352766-400cebbd5575?w=400',
    upvotes: 6789,
    comments: 456,
    awards: 2,
  },
  {
    id: 8,
    subreddit: '数码',
    timeAgo: '10小时前',
    title: '入手了MacBook Pro M4，性能炸裂！',
    upvotes: 2567,
    comments: 312,
  },
  {
    id: 9,
    subreddit: '南京公交',
    timeAgo: '12小时前',
    title: '吐槽：为什么周末的公交间隔时间那么长啊😭',
    upvotes: 1567,
    comments: 156,
    isJoined: true,
  },
  {
    id: 10,
    subreddit: '读书',
    timeAgo: '14小时前',
    title: '推荐一本好书：《人类简史》读后感',
    upvotes: 890,
    comments: 123,
  },
  {
    id: 11,
    subreddit: '南京公交',
    timeAgo: '15小时前',
    title: '地铁3号线今早故障延误了半小时，上班差点迟到',
    upvotes: 2893,
    comments: 312,
    isJoined: true,
  },
  {
    id: 12,
    subreddit: '电影',
    timeAgo: '18小时前',
    title: '《沙丘2》观影感受：视觉盛宴，强烈推荐',
    upvotes: 3456,
    comments: 567,
  },
  {
    id: 13,
    subreddit: '南京公交',
    timeAgo: '1天前',
    title: '分享一个小技巧：用支付宝扫码乘车可以享受9折优惠',
    upvotes: 4567,
    comments: 423,
    isJoined: true,
  },
  {
    id: 14,
    subreddit: '学习',
    timeAgo: '1天前',
    title: '自学编程半年，成功转行成为程序员',
    upvotes: 5678,
    comments: 678,
    awards: 4,
  },
  {
    id: 15,
    subreddit: '音乐',
    timeAgo: '1天前',
    title: '分享我的私人歌单，适合深夜独自聆听🎵',
    upvotes: 1567,
    comments: 156,
  },
  {
    id: 16,
    subreddit: '南京公交',
    timeAgo: '1天前',
    title: '请问有人知道67路改线了吗？今天等了好久都没来',
    upvotes: 234,
    comments: 45,
    isJoined: true,
  },
  {
    id: 17,
    subreddit: '汽车',
    timeAgo: '1天前',
    title: '提车作业：比亚迪海豹DM-i用车感受',
    upvotes: 2789,
    comments: 412,
  },
  {
    id: 18,
    subreddit: '家居',
    timeAgo: '1天前',
    title: '花了3个月装修的新家，终于完工了🏠',
    upvotes: 4567,
    comments: 567,
  },
  {
    id: 19,
    subreddit: '育儿',
    timeAgo: '2天前',
    title: '宝宝今天会叫妈妈了，感动哭了😭',
    upvotes: 5678,
    comments: 345,
  },
  {
    id: 20,
    subreddit: '娱乐',
    timeAgo: '2天前',
    title: '《歌手2025》首期节目太精彩了！',
    upvotes: 3456,
    comments: 678,
  },
];

export default function CommunityFeedScreen() {
  const navigation = useNavigation();
  const [selectedView, setSelectedView] = useState<ViewType>('hot');

  function handleSubredditClick(subreddit: string) {
    if (subreddit === '南京公交') {
      // @ts-ignore - Navigation typing issue
      navigation.navigate('SubredditPage');
    }
  }

  return (
    <View className="flex-1 bg-background">
      {/* Header */}
      <CommunityHeader
        selectedView={selectedView}
        onViewChange={setSelectedView}
        onSearchPress={() => {}}
        onAvatarPress={() => {}}
      />

      {/* Main Content */}
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, gap: 12 }}
      >
        {HOME_POSTS.map((post) => (
          <PostCardWithFlair
            key={post.id}
            id={post.id.toString()}
            subreddit={post.subreddit}
            timeAgo={post.timeAgo}
            title={post.title}
            imageUrl={post.imageUrl}
            upvotes={post.upvotes}
            comments={post.comments}
            awards={post.awards}
            isJoined={post.isJoined}
            onSubredditClick={handleSubredditClick}
          />
        ))}
      </ScrollView>
    </View>
  );
}
