import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import SubredditHeader from '@components/community/SubredditHeader';
import TagFilterBar from '@components/community/TagFilterBar';
import PinnedPosts from '@components/community/PinnedPosts';
import PostCardWithFlair from '@components/community/PostCardWithFlair';
import SubredditBottomNav from '@components/community/SubredditBottomNav';
import CreatePostScreen from '@screens/CreatePostScreen';
import XIcon from '@components/common/XIcon';
import type { Post } from '@types';
import { formatTimeAgo } from '@utils/time';
import { getPosts } from '@api/posts';
import { useUser } from '@contexts/UserContext';

// 图片池 - 来自Figma设计
const POST_IMAGES = [
  'https://images.unsplash.com/photo-1665809544649-c389c3209976?w=400',
  'https://images.unsplash.com/photo-1648168982863-a5f9d18895ff?w=400',
  'https://images.unsplash.com/photo-1665482171703-afab88c87543?w=400',
];

// 用户头像池 - 来自Figma设计
const USER_AVATARS = [
  'https://images.unsplash.com/photo-1526876917250-9c7bcecd349f?w=200',
  'https://images.unsplash.com/photo-1672685667592-0392f458f46f?w=200',
  'https://images.unsplash.com/photo-1734764627104-6ad22c48af6a?w=200',
  'https://images.unsplash.com/photo-1699903905361-4d408679753f?w=200',
  'https://images.unsplash.com/photo-1705830337569-47a1a24b0ad2?w=200',
];

// 用户名池 - 来自Figma设计
const USER_NAMES = [
  '南京小王',
  '公交迷老李',
  '地铁通勤者',
  '南京通',
  '城市探索家',
  '交通观察员',
  '南京老司机',
  '公交达人',
  '地铁爱好者',
  '南京市民张三',
  '通勤小陈',
  '城市漫步者',
  '南京生活家',
  '公交小白',
  '地铁新手',
  '南京探路人',
  '交通小助手',
  '南京游客',
  '公交观察者',
  '地铁日常',
];

// 50个真实帖子数据 - 完全来自Figma设计
const POSTS_DATA = [
  { id: 1, timeAgo: '1小时前', title: '📍【线路更新】1号线延伸段正式开通，新增5个站点！大家快来体验吧', imageUrl: POST_IMAGES[0], upvotes: 1245, comments: 87, flair: 's1路' },
  { id: 2, timeAgo: '3小时前', title: '早高峰观察：今天34路特别准时，司机师傅态度也很好👍', upvotes: 568, comments: 34, flair: '34路' },
  { id: 3, timeAgo: '5小时前', title: '新手求助：从南京南站到夫子庙坐地铁怎么走最快？', imageUrl: POST_IMAGES[1], upvotes: 892, comments: 125, flair: 's3路' },
  { id: 4, timeAgo: '7小时前', title: '🚌 整理了一份南京主城区常用公交线路图，希望对大家有帮助', imageUrl: POST_IMAGES[2], upvotes: 2156, comments: 198, flair: '攻略' },
  { id: 5, timeAgo: '10小时前', title: '刚才在地铁上捡到一个钱包，已交给站务员了，失主请联系车站', upvotes: 3421, comments: 267, awards: 5, flair: 's2路' },
  { id: 6, timeAgo: '12小时前', title: '吐槽：为什么周末的公交间隔时间那么长啊😭', upvotes: 1567, comments: 156, flair: '22路' },
  { id: 7, timeAgo: '15小时前', title: '地铁3号线今早故障延误了半小时，上班差点迟到', upvotes: 2893, comments: 312, flair: 's3路' },
  { id: 8, timeAgo: '1天前', title: '分享一个小技巧：用支付宝扫码乘车可以享受9折优惠', upvotes: 4567, comments: 423, flair: '优惠' },
  { id: 9, timeAgo: '1天前', title: '请问有人知道67路改线了吗？今天等了好久都没来', upvotes: 234, comments: 45, flair: '67路' },
  { id: 10, timeAgo: '1天前', title: '夸一下：昨天在公交上突然不舒服，司机师傅立即送我去医院，真的太感谢了🙏', imageUrl: POST_IMAGES[0], upvotes: 5678, comments: 534, awards: 8, flair: '5路' },
  { id: 11, timeAgo: '2天前', title: '📢【重要通知】2号线本周末将进行设备检修，部分时段限流', upvotes: 1890, comments: 156, flair: 's2路' },
  { id: 12, timeAgo: '2天前', title: '求助：老年卡在哪里办理？需要什么材料？', upvotes: 432, comments: 67, flair: '求助' },
  { id: 13, timeAgo: '2天前', title: '今天坐9路遇到一个特别可爱的小朋友，一直在数站点😊', upvotes: 2341, comments: 189, flair: '9路' },
  { id: 14, timeAgo: '2天前', title: '吐槽：为什么有些公交车夏天空调开得那么冷？', upvotes: 1234, comments: 234, flair: '106路' },
  { id: 15, timeAgo: '2天前', title: '地铁4号线灵山站附近有什么好吃的推荐吗？', imageUrl: POST_IMAGES[1], upvotes: 567, comments: 89, flair: 's4路' },
  { id: 16, timeAgo: '3天前', title: '刚刚在地铁上看到有人逃票，被工作人员当场抓住了', upvotes: 4521, comments: 678, flair: 's1路' },
  { id: 17, timeAgo: '3天前', title: '🚇 分享：南京地铁换乘攻略，教你如何快速换乘不迷路', imageUrl: POST_IMAGES[2], upvotes: 3456, comments: 412, flair: '攻略' },
  { id: 18, timeAgo: '3天前', title: '请问152路晚上最晚一班是几点？急！', upvotes: 123, comments: 34, flair: '152路' },
  { id: 19, timeAgo: '3天前', title: '建议：能不能在公交车上增加USB充电口？手机快没电了😢', upvotes: 2789, comments: 345, flair: '91路' },
  { id: 20, timeAgo: '3天前', title: '今天34路来了新车，座位特别舒服，还有空气净化器', imageUrl: POST_IMAGES[0], upvotes: 1567, comments: 123, flair: '34路' },
  { id: 21, timeAgo: '4天前', title: '有人知道南京公交卡在哪里可以退卡吗？', upvotes: 456, comments: 78, flair: '求助' },
  { id: 22, timeAgo: '4天前', title: '早上7点的地铁真的太挤了，建议大家错峰出行', upvotes: 2345, comments: 267, flair: 's2路' },
  { id: 23, timeAgo: '4天前', title: '赞一个：今天在公交上遇到主动让座的小伙子，暖心👍', upvotes: 3456, comments: 234, flair: '22路' },
  { id: 24, timeAgo: '4天前', title: '请问从禄口机场到市区坐地铁方便吗？大概多久？', imageUrl: POST_IMAGES[1], upvotes: 890, comments: 156, flair: 's1路' },
  { id: 25, timeAgo: '4天前', title: '吐槽：为什么有些司机开车那么猛？站都没站稳就开车了', upvotes: 1678, comments: 234, flair: '65路' },
  { id: 26, timeAgo: '5天前', title: '🎉好消息！5号线即将通车，沿线房价要涨了', imageUrl: POST_IMAGES[2], upvotes: 5678, comments: 789, awards: 3, flair: 's5路' },
  { id: 27, timeAgo: '5天前', title: '新人求助：学生卡怎么办理？在线等，挺急的', upvotes: 234, comments: 45, flair: '求助' },
  { id: 28, timeAgo: '5天前', title: '分享一个App推荐：南京公交实时查询，超级准确', upvotes: 4567, comments: 567, flair: '推荐' },
  { id: 29, timeAgo: '5天前', title: '今天坐地铁遇到街头艺人唱歌，水平真不错🎵', upvotes: 1234, comments: 167, flair: 's3路' },
  { id: 30, timeAgo: '5天前', title: '请问有人坐过夜间公交吗？安全吗？', upvotes: 678, comments: 89, flair: 'y1路' },
  { id: 31, timeAgo: '6天前', title: '轮渡21号线今天又延误了，这个月第三次了', upvotes: 3456, comments: 456, flair: '轮渡21路' },
  { id: 32, timeAgo: '6天前', title: '🚌 整理了一份雨天出行公交攻略，请收藏', imageUrl: POST_IMAGES[0], upvotes: 2345, comments: 234, flair: '攻略' },
  { id: 33, timeAgo: '6天前', title: '刚在公交上捡到一部手机，已交给司机师傅', upvotes: 1567, comments: 123, flair: '33路' },
  { id: 34, timeAgo: '6天前', title: '吐槽：为什么公交车报站声音那么小？', upvotes: 890, comments: 134, flair: '67路' },
  { id: 35, timeAgo: '6天前', title: '请问从新街口到江宁大学城怎么坐车最快？', upvotes: 456, comments: 67, flair: 's1路' },
  { id: 36, timeAgo: '7天前', title: '今天乘坐有轨电车，感觉挺新鲜的，推荐大家体验', imageUrl: POST_IMAGES[1], upvotes: 2789, comments: 345, flair: '有轨电车' },
  { id: 37, timeAgo: '7天前', title: '建议：能不能在车上增加更多扶手？老人孩子站不稳', upvotes: 3456, comments: 456, flair: '5路' },
  { id: 38, timeAgo: '7天前', title: '地铁2号线马群站的电梯又坏了，希望尽快维修', upvotes: 1234, comments: 167, flair: 's2路' },
  { id: 39, timeAgo: '7天前', title: '请问有人知道公交月卡怎么办理吗？划算吗？', upvotes: 567, comments: 78, flair: '求助' },
  { id: 40, timeAgo: '1周前', title: '夸一下：今天遇到一位特别耐心的公交司机，等我上车才开', upvotes: 4567, comments: 534, flair: '暖心' },
  { id: 41, timeAgo: '1周前', title: '🚇【攻略】南京地铁各线路首末班车时间汇总', imageUrl: POST_IMAGES[2], upvotes: 5678, comments: 678, awards: 4, flair: '攻略' },
  { id: 42, timeAgo: '1周前', title: '吐槽：为什么周末也要早起挤公交😭', upvotes: 1890, comments: 234, flair: '吐槽' },
  { id: 43, timeAgo: '1周前', title: '请问有人坐过机场巴士吗？体验怎么样？', upvotes: 678, comments: 89, flair: '机场巴士' },
  { id: 44, timeAgo: '1周前', title: '今天在地铁上看书，特别享受这段通勤时光📚', upvotes: 2345, comments: 267, flair: 's3路' },
  { id: 45, timeAgo: '1周前', title: '建议增加3号线的运行班次，高峰期实在太挤了', upvotes: 3456, comments: 412, flair: 's3路' },
  { id: 46, timeAgo: '8天前', title: '刚才在公交站遇到一个骗子，大家注意防范！', upvotes: 4521, comments: 567, flair: '22路' },
  { id: 47, timeAgo: '8天前', title: '请问65路改线后还经过中华门吗？', upvotes: 234, comments: 34, flair: '65路' },
  { id: 48, timeAgo: '8天前', title: '分享：如何在南京地铁上找到最舒适的车厢', imageUrl: POST_IMAGES[0], upvotes: 2789, comments: 345, flair: '地铁' },
  { id: 49, timeAgo: '8天前', title: '今天的106路来了双层巴士，太酷了🚌', upvotes: 3456, comments: 456, flair: '106路' },
  { id: 50, timeAgo: '8天前', title: '吐槽：为什么有些站点没有候车亭，下雨天太难受了', upvotes: 1567, comments: 189, flair: '34路' },
];

// 生成带用户信息的帖子
function getPostsWithUsers(): Post[] {
  return POSTS_DATA.map((post, index) => {
    const nameIndex = index % USER_NAMES.length;
    const avatarIndex = index % USER_AVATARS.length;

    // 将timeAgo转换为timestamp (模拟时间戳)
    const timeMap: { [key: string]: number } = {
      '1小时前': Date.now() - 3600000,
      '3小时前': Date.now() - 3 * 3600000,
      '5小时前': Date.now() - 5 * 3600000,
      '7小时前': Date.now() - 7 * 3600000,
      '10小时前': Date.now() - 10 * 3600000,
      '12小时前': Date.now() - 12 * 3600000,
      '15小时前': Date.now() - 15 * 3600000,
      '1天前': Date.now() - 86400000,
      '2天前': Date.now() - 2 * 86400000,
      '3天前': Date.now() - 3 * 86400000,
      '4天前': Date.now() - 4 * 86400000,
      '5天前': Date.now() - 5 * 86400000,
      '6天前': Date.now() - 6 * 86400000,
      '7天前': Date.now() - 7 * 86400000,
      '1周前': Date.now() - 7 * 86400000,
      '8天前': Date.now() - 8 * 86400000,
    };

    return {
      post_id: post.id.toString(),
      title: post.title,
      content: post.title,
      username: USER_NAMES[nameIndex],
      avatar: USER_AVATARS[avatarIndex],
      timestamp: timeMap[post.timeAgo] || Date.now(),
      bus_tag: post.flair,
      likes: post.upvotes,
      comments: post.comments,
      image_urls: post.imageUrl ? [post.imageUrl] : [],
      isLiked: false,
      is_liked: false,
      user_id: `user_${index + 1}`,
    };
  });
}

export default function SubredditPage() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { userId } = useUser();
  const [selectedFlair, setSelectedFlair] = useState<string | null>(null);
  const [createPostVisible, setCreatePostVisible] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // 加载帖子列表
  const loadPosts = async () => {
    try {
      const data = await getPosts({ userId });
      setPosts(data);
    } catch (error) {
      console.error('Failed to load posts:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    loadPosts();
  };

  function handleFlairClick(flair: string) {
    if (selectedFlair === flair) {
      setSelectedFlair(null); // Toggle off
    } else {
      setSelectedFlair(flair); // Apply filter
    }
  }

  function handleClearFilter() {
    setSelectedFlair(null);
  }

  function handlePostClick(postId: string) {
    // @ts-ignore - Navigation typing
    navigation.navigate('PostDetail', {
      postId: postId,
      post: posts.find((p) => p.post_id === postId),
    });
  }

  const handlePostSuccess = () => {
    // 发帖成功后刷新列表
    loadPosts();
  };

  const filteredPosts = selectedFlair
    ? posts.filter((post) => post.bus_tag === selectedFlair)
    : posts;

  return (
    <View className="flex-1 bg-background">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {/* Subreddit Header */}
        <SubredditHeader
          name="南京公交"
          members="15.8万成员"
          avatarUrl="https://images.unsplash.com/photo-1756723701257-46513cd36fc1?w=200"
          bannerUrl="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800"
          isJoined={true}
          weeklyVisitors="近3万5千访客"
          weeklyContributors="近4千1百贡献"
          description="搭载移动城市智能体，是能聊路线、拼生活、寻同路人的暖心城市出行社区"
          ranking="#7 in 出行"
          onBack={() => navigation.goBack()}
          onJoinToggle={() => {}}
          onNotifications={() => {}}
        />

        {/* Tag Filter Bar */}
        <TagFilterBar
          selectedTag={selectedFlair}
          onTagChange={setSelectedFlair}
        />

        {/* Pinned Posts - only show when no Flair filter active */}
        {!selectedFlair && <PinnedPosts />}

        {/* Filter Banner - show when Flair filter active */}
        {selectedFlair && (
          <View className="bg-[#EFF6FF] border-b border-border px-4 py-3">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-1">
                <Text className="text-sm text-text-secondary">
                  {t('subreddit.filtering_by')}:
                </Text>
                <Text className="text-sm font-semibold text-primary">{selectedFlair}</Text>
                <Text className="text-xs text-text-disabled">
                  ({filteredPosts.length} 个帖子)
                </Text>
              </View>
              <TouchableOpacity
                onPress={handleClearFilter}
                activeOpacity={0.7}
                className="p-1 rounded-full active:bg-gray-100"
              >
                <XIcon size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Posts List */}
        <View className="p-4 gap-3">
          {loading ? (
            <ActivityIndicator size="large" color="#007AFF" className="my-8" />
          ) : filteredPosts.length === 0 ? (
            <Text className="text-center text-gray-500 my-8">
              暂无帖子，快来发布第一条吧！
            </Text>
          ) : (
            filteredPosts.map((post) => {
              const imageUrl = Array.isArray(post.image_urls) ? post.image_urls[0] : undefined;
              if (post.image_urls && post.image_urls.length > 0) {
                console.log('[SubredditPage] Post', post.post_id, 'has images:', post.image_urls, '-> displaying:', imageUrl);
              }
              return (
                <PostCardWithFlair
                  key={post.post_id}
                  id={post.post_id}
                  userName={post.username}
                  userAvatar={post.avatar}
                  timeAgo={formatTimeAgo(post.timestamp)}
                  title={post.title}
                  imageUrl={imageUrl}
                  upvotes={post.likes}
                  comments={post.comments}
                  flair={post.bus_tag}
                  isJoined={true}
                  onPress={() => handlePostClick(post.post_id)}
                  onFlairClick={handleFlairClick}
                />
              );
            })
          )}
        </View>

        {/* No Results */}
        {!loading && filteredPosts.length === 0 && selectedFlair && (
          <View className="p-6 items-center">
            <Text className="text-base text-text-disabled">
              {t('subreddit.no_posts_found')}
            </Text>
          </View>
        )}

        {/* Bottom padding for floating nav */}
        <View className="h-20" />
      </ScrollView>

      {/* Bottom Navigation */}
      <SubredditBottomNav onCreatePost={() => setCreatePostVisible(true)} />

      {/* Create Post Modal */}
      <Modal
        visible={createPostVisible}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={() => setCreatePostVisible(false)}
      >
        <CreatePostScreen
          onClose={() => setCreatePostVisible(false)}
          onSuccess={() => {
            setCreatePostVisible(false);
            handlePostSuccess();
          }}
          subredditName="南京公交"
        />
      </Modal>
    </View>
  );
}
