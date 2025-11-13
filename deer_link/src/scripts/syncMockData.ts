/**
 * 数据同步脚本：将前端 Mock 数据同步到后端数据库
 *
 * 使用方法：
 * npx ts-node src/scripts/syncMockData.ts
 */

import axios from 'axios';

const API_BASE_URL = 'http://47.107.130.240/api/v1';

// 用户头像池
const USER_AVATARS = [
  'https://images.unsplash.com/photo-1526876917250-9c7bcecd349f?w=200',
  'https://images.unsplash.com/photo-1672685667592-0392f458f46f?w=200',
  'https://images.unsplash.com/photo-1734764627104-6ad22c48af6a?w=200',
  'https://images.unsplash.com/photo-1699903905361-4d408679753f?w=200',
  'https://images.unsplash.com/photo-1705830337569-47a1a24b0ad2?w=200',
];

// 用户名池
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
];

// 帖子图片池
const POST_IMAGES = [
  'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=800',
  'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=800',
  'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800',
];

// 主页帖子数据
const HOME_POSTS = [
  { id: 1, subreddit: '南京公交', timeAgo: '1小时前', title: '【失物招领】今天在中山码头站捡到一个iPhone X，稍微有点旧', imageUrl: 'https://images.unsplash.com/photo-1636589150123-6d57c10527ce?w=400', upvotes: 892, comments: 67 },
  { id: 2, subreddit: '旅游', timeAgo: '3小时前', title: '📍云南大理三日游攻略，人均2000元玩转洱海古城', imageUrl: 'https://images.unsplash.com/photo-1614088459293-5669fadc3448?w=400', upvotes: 3456, comments: 234 },
  { id: 3, subreddit: '美食', timeAgo: '4小时前', title: '自己做的红烧肉，第一次尝试感觉还不错😋', imageUrl: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400', upvotes: 1890, comments: 167 },
  { id: 4, subreddit: '南京公交', timeAgo: '5小时前', title: '📍【线路更新】1号线延伸段正式开通，新增5个站点！', upvotes: 1245, comments: 87 },
  { id: 5, subreddit: '游戏', timeAgo: '6小时前', title: '🎮 终于打通了《黑神话：悟空》全成就，分享一些心得', imageUrl: 'https://images.unsplash.com/photo-1635372708431-64774de60e20?w=400', upvotes: 5678, comments: 789 },
  { id: 6, subreddit: '健身', timeAgo: '7小时前', title: '坚持健身3个月的变化对比，努力终于有了回报💪', imageUrl: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=400', upvotes: 4321, comments: 345 },
  { id: 7, subreddit: '萌宠', timeAgo: '8小时前', title: '我家猫咪今天学会了握手，太聪明了🐱', imageUrl: 'https://images.unsplash.com/photo-1670665352766-400cebbd5575?w=400', upvotes: 6789, comments: 456 },
  { id: 8, subreddit: '数码', timeAgo: '10小时前', title: '入手了MacBook Pro M4，性能炸裂！', upvotes: 2567, comments: 312 },
  { id: 9, subreddit: '南京公交', timeAgo: '12小时前', title: '吐槽：为什么周末的公交间隔时间那么长啊😭', upvotes: 1567, comments: 156 },
  { id: 10, subreddit: '读书', timeAgo: '14小时前', title: '推荐一本好书：《人类简史》读后感', upvotes: 890, comments: 123 },
  { id: 11, subreddit: '南京公交', timeAgo: '15小时前', title: '地铁3号线今早故障延误了半小时，上班差点迟到', upvotes: 2893, comments: 312 },
  { id: 12, subreddit: '电影', timeAgo: '18小时前', title: '《沙丘2》观影感受：视觉盛宴，强烈推荐', upvotes: 3456, comments: 567 },
  { id: 13, subreddit: '南京公交', timeAgo: '1天前', title: '分享一个小技巧：用支付宝扫码乘车可以享受9折优惠', upvotes: 4567, comments: 423 },
  { id: 14, subreddit: '学习', timeAgo: '1天前', title: '自学编程半年，成功转行成为程序员', upvotes: 5678, comments: 678 },
  { id: 15, subreddit: '音乐', timeAgo: '1天前', title: '分享我的私人歌单，适合深夜独自聆听🎵', upvotes: 1567, comments: 156 },
  { id: 16, subreddit: '南京公交', timeAgo: '1天前', title: '请问有人知道67路改线了吗？今天等了好久都没来', upvotes: 234, comments: 45 },
  { id: 17, subreddit: '汽车', timeAgo: '1天前', title: '提车作业：比亚迪海豹DM-i用车感受', upvotes: 2789, comments: 412 },
  { id: 18, subreddit: '家居', timeAgo: '1天前', title: '花了3个月装修的新家，终于完工了🏠', upvotes: 4567, comments: 567 },
  { id: 19, subreddit: '育儿', timeAgo: '2天前', title: '宝宝今天会叫妈妈了，感动哭了😭', upvotes: 5678, comments: 345 },
  { id: 20, subreddit: '娱乐', timeAgo: '2天前', title: '《歌手2025》首期节目太精彩了！', upvotes: 3456, comments: 678 },
];

// 南京公交圈帖子数据
const POSTS_DATA = [
  { id: 21, timeAgo: '1小时前', title: '📍【线路更新】1号线延伸段正式开通，新增5个站点！大家快来体验吧', imageUrl: POST_IMAGES[0], upvotes: 1245, comments: 87, flair: 's1路' },
  { id: 22, timeAgo: '3小时前', title: '早高峰观察：今天34路特别准时，司机师傅态度也很好👍', upvotes: 568, comments: 34, flair: '34路' },
  { id: 23, timeAgo: '5小时前', title: '新手求助：从南京南站到夫子庙坐地铁怎么走最快？', imageUrl: POST_IMAGES[1], upvotes: 892, comments: 125, flair: 's3路' },
  { id: 24, timeAgo: '7小时前', title: '🚌 整理了一份南京主城区常用公交线路图，希望对大家有帮助', imageUrl: POST_IMAGES[2], upvotes: 2156, comments: 198, flair: '攻略' },
  { id: 25, timeAgo: '10小时前', title: '刚才在地铁上捡到一个钱包，已交给站务员了，失主请联系车站', upvotes: 3421, comments: 267, flair: 's2路' },
  { id: 26, timeAgo: '12小时前', title: '吐槽：为什么周末的公交间隔时间那么长啊😭', upvotes: 1567, comments: 156, flair: '22路' },
  { id: 27, timeAgo: '15小时前', title: '地铁3号线今早故障延误了半小时，上班差点迟到', upvotes: 2893, comments: 312, flair: 's3路' },
  { id: 28, timeAgo: '1天前', title: '分享一个小技巧：用支付宝扫码乘车可以享受9折优惠', upvotes: 4567, comments: 423, flair: '优惠' },
  { id: 29, timeAgo: '1天前', title: '请问有人知道67路改线了吗？今天等了好久都没来', upvotes: 234, comments: 45, flair: '67路' },
  { id: 30, timeAgo: '1天前', title: '夸一下：昨天在公交上突然不舒服，司机师傅立即送我去医院，真的太感谢了🙏', imageUrl: POST_IMAGES[0], upvotes: 5678, comments: 534, flair: '5路' },
  { id: 31, timeAgo: '2天前', title: '📢【重要通知】2号线本周末将进行设备检修，部分时段限流', upvotes: 1890, comments: 156, flair: 's2路' },
  { id: 32, timeAgo: '2天前', title: '求助：老年卡在哪里办理？需要什么材料？', upvotes: 432, comments: 67, flair: '求助' },
  { id: 33, timeAgo: '2天前', title: '今天坐9路遇到一个特别可爱的小朋友，一直在数站点😊', upvotes: 2341, comments: 189, flair: '9路' },
  { id: 34, timeAgo: '2天前', title: '吐槽：为什么有些公交车夏天空调开得那么冷？', upvotes: 1234, comments: 234, flair: '106路' },
  { id: 35, timeAgo: '2天前', title: '地铁4号线灵山站附近有什么好吃的推荐吗？', imageUrl: POST_IMAGES[1], upvotes: 567, comments: 89, flair: 's4路' },
  { id: 36, timeAgo: '3天前', title: '刚刚在地铁上看到有人逃票，被工作人员当场抓住了', upvotes: 4521, comments: 678, flair: 's1路' },
  { id: 37, timeAgo: '3天前', title: '🚇 分享：南京地铁换乘攻略，教你如何快速换乘不迷路', imageUrl: POST_IMAGES[2], upvotes: 3456, comments: 412, flair: '攻略' },
  { id: 38, timeAgo: '3天前', title: '请问152路晚上最晚一班是几点？急！', upvotes: 123, comments: 34, flair: '152路' },
  { id: 39, timeAgo: '3天前', title: '建议：能不能在公交车上增加USB充电口？手机快没电了😢', upvotes: 2789, comments: 345, flair: '91路' },
  { id: 40, timeAgo: '3天前', title: '今天34路来了新车，座位特别舒服，还有空气净化器', imageUrl: POST_IMAGES[0], upvotes: 1567, comments: 123, flair: '34路' },
  { id: 41, timeAgo: '4天前', title: '有人知道南京公交卡在哪里可以退卡吗？', upvotes: 456, comments: 78, flair: '求助' },
  { id: 42, timeAgo: '4天前', title: '早上7点的地铁真的太挤了，建议大家错峰出行', upvotes: 2345, comments: 267, flair: 's2路' },
  { id: 43, timeAgo: '4天前', title: '赞一个：今天在公交上遇到主动让座的小伙子，暖心👍', upvotes: 3456, comments: 234, flair: '22路' },
  { id: 44, timeAgo: '4天前', title: '请问从禄口机场到市区坐地铁方便吗？大概多久？', imageUrl: POST_IMAGES[1], upvotes: 890, comments: 156, flair: 's1路' },
  { id: 45, timeAgo: '4天前', title: '吐槽：为什么有些司机开车那么猛？站都没站稳就开车了', upvotes: 1678, comments: 234, flair: '65路' },
  { id: 46, timeAgo: '5天前', title: '🎉好消息！5号线即将通车，沿线房价要涨了', imageUrl: POST_IMAGES[2], upvotes: 5678, comments: 789, flair: 's5路' },
  { id: 47, timeAgo: '5天前', title: '新人求助：学生卡怎么办理？在线等，挺急的', upvotes: 234, comments: 45, flair: '求助' },
  { id: 48, timeAgo: '5天前', title: '分享一个App推荐：南京公交实时查询，超级准确', upvotes: 4567, comments: 567, flair: '推荐' },
  { id: 49, timeAgo: '5天前', title: '今天坐地铁遇到街头艺人唱歌，水平真不错🎵', upvotes: 1234, comments: 167, flair: 's3路' },
  { id: 50, timeAgo: '5天前', title: '请问有人坐过夜间公交吗？安全吗？', upvotes: 678, comments: 89, flair: 'y1路' },
  { id: 51, timeAgo: '6天前', title: '轮渡21号线今天又延误了，这个月第三次了', upvotes: 3456, comments: 456, flair: '轮渡21路' },
  { id: 52, timeAgo: '6天前', title: '🚌 整理了一份雨天出行公交攻略，请收藏', imageUrl: POST_IMAGES[0], upvotes: 2345, comments: 234, flair: '攻略' },
  { id: 53, timeAgo: '6天前', title: '刚在公交上捡到一部手机，已交给司机师傅', upvotes: 1567, comments: 123, flair: '33路' },
  { id: 54, timeAgo: '6天前', title: '吐槽：为什么公交车报站声音那么小？', upvotes: 890, comments: 134, flair: '67路' },
  { id: 55, timeAgo: '6天前', title: '请问从新街口到江宁大学城怎么坐车最快？', upvotes: 456, comments: 67, flair: 's1路' },
  { id: 56, timeAgo: '7天前', title: '今天乘坐有轨电车，感觉挺新鲜的，推荐大家体验', imageUrl: POST_IMAGES[1], upvotes: 2789, comments: 345, flair: '有轨电车' },
  { id: 57, timeAgo: '7天前', title: '建议：能不能在车上增加更多扶手？老人孩子站不稳', upvotes: 3456, comments: 456, flair: '5路' },
  { id: 58, timeAgo: '7天前', title: '地铁2号线马群站的电梯又坏了，希望尽快维修', upvotes: 1234, comments: 167, flair: 's2路' },
  { id: 59, timeAgo: '7天前', title: '请问有人知道公交月卡怎么办理吗？划算吗？', upvotes: 567, comments: 78, flair: '求助' },
  { id: 60, timeAgo: '1周前', title: '夸一下：今天遇到一位特别耐心的公交司机，等我上车才开', upvotes: 4567, comments: 534, flair: '暖心' },
  { id: 61, timeAgo: '1周前', title: '🚇【攻略】南京地铁各线路首末班车时间汇总', imageUrl: POST_IMAGES[2], upvotes: 5678, comments: 678, flair: '攻略' },
  { id: 62, timeAgo: '1周前', title: '吐槽：为什么周末也要早起挤公交😭', upvotes: 1890, comments: 234, flair: '吐槽' },
  { id: 63, timeAgo: '1周前', title: '请问有人坐过机场巴士吗？体验怎么样？', upvotes: 678, comments: 89, flair: '机场巴士' },
  { id: 64, timeAgo: '1周前', title: '今天在地铁上看书，特别享受这段通勤时光📚', upvotes: 2345, comments: 267, flair: 's3路' },
  { id: 65, timeAgo: '1周前', title: '建议增加3号线的运行班次，高峰期实在太挤了', upvotes: 3456, comments: 412, flair: 's3路' },
  { id: 66, timeAgo: '8天前', title: '刚才在公交站遇到一个骗子，大家注意防范！', upvotes: 4521, comments: 567, flair: '22路' },
  { id: 67, timeAgo: '8天前', title: '请问65路改线后还经过中华门吗？', upvotes: 234, comments: 34, flair: '65路' },
  { id: 68, timeAgo: '8天前', title: '分享：如何在南京地铁上找到最舒适的车厢', imageUrl: POST_IMAGES[0], upvotes: 2789, comments: 345, flair: '地铁' },
  { id: 69, timeAgo: '8天前', title: '今天的106路来了双层巴士，太酷了🚌', upvotes: 3456, comments: 456, flair: '106路' },
  { id: 70, timeAgo: '8天前', title: '吐槽：为什么有些站点没有候车亭，下雨天太难受了', upvotes: 1567, comments: 189, flair: '34路' },
];

// 合并所有帖子
const ALL_POSTS = [...HOME_POSTS, ...POSTS_DATA];

// 生成用户数据
function generateUsers() {
  return USER_NAMES.map((name, index) => ({
    phone: `1380000${String(index).padStart(4, '0')}`, // 生成手机号
    nickname: name,
    password: 'password123', // 默认密码
    avatar: USER_AVATARS[index % USER_AVATARS.length],
  }));
}

// 批量创建用户
async function batchCreateUsers() {
  console.log('📝 开始创建用户...');

  const users = generateUsers();

  try {
    const response = await axios.post(`${API_BASE_URL}/users/batch`, {
      users,
    });

    console.log(`✅ 成功创建 ${response.data.data.count} 个用户`);
    console.log('用户 IDs:', response.data.data.user_ids);

    return response.data.data.user_ids;
  } catch (error: any) {
    console.error('❌ 创建用户失败:', error.response?.data || error.message);
    throw error;
  }
}

// 将时间描述转换为时间戳
function timeAgoToTimestamp(timeAgo: string): number {
  const now = Date.now();
  const timeMap: { [key: string]: number } = {
    '1小时前': now - 3600000,
    '3小时前': now - 3 * 3600000,
    '4小时前': now - 4 * 3600000,
    '5小时前': now - 5 * 3600000,
    '6小时前': now - 6 * 3600000,
    '7小时前': now - 7 * 3600000,
    '8小时前': now - 8 * 3600000,
    '10小时前': now - 10 * 3600000,
    '12小时前': now - 12 * 3600000,
    '14小时前': now - 14 * 3600000,
    '15小时前': now - 15 * 3600000,
    '18小时前': now - 18 * 3600000,
    '1天前': now - 86400000,
    '2天前': now - 2 * 86400000,
    '3天前': now - 3 * 86400000,
    '4天前': now - 4 * 86400000,
    '5天前': now - 5 * 86400000,
    '6天前': now - 6 * 86400000,
    '7天前': now - 7 * 86400000,
    '1周前': now - 7 * 86400000,
    '8天前': now - 8 * 86400000,
  };

  return timeMap[timeAgo] || now;
}

// 批量创建帖子
async function batchCreatePosts(userIds: string[]) {
  console.log('\n📝 开始创建帖子...');

  const posts = ALL_POSTS.map((post, index) => {
    const userIndex = index % userIds.length;
    const busTag = 'flair' in post ? post.flair : post.subreddit;
    const communityId = busTag.includes('路') || busTag.includes('s') ? 'nanjing_bus' : 'general';

    return {
      user_id: userIds[userIndex],
      title: post.title,
      content: post.title, // 使用标题作为内容
      images: post.imageUrl ? [post.imageUrl] : [],
      videos: [],
      links: [],
      bus_tag: busTag,
      community_id: communityId,
      flair: busTag,
    };
  });

  try {
    const response = await axios.post(`${API_BASE_URL}/posts/batch`, {
      posts,
    });

    console.log(`✅ 成功创建 ${response.data.data.count} 个帖子`);
    console.log(`帖子 IDs 样例:`, response.data.data.post_ids.slice(0, 5));

    return response.data.data.post_ids;
  } catch (error: any) {
    console.error('❌ 创建帖子失败:', error.response?.data || error.message);
    throw error;
  }
}

// 主函数
async function main() {
  console.log('🚀 开始数据同步...\n');
  console.log(`API Base URL: ${API_BASE_URL}\n`);
  console.log('=' .repeat(60));

  try {
    // 1. 创建用户
    const userIds = await batchCreateUsers();

    // 2. 创建帖子
    await batchCreatePosts(userIds);

    console.log('\n' + '='.repeat(60));
    console.log('🎉 数据同步完成！');
    console.log(`✅ 用户数: ${USER_NAMES.length}`);
    console.log(`✅ 帖子数: ${ALL_POSTS.length}`);
    console.log('=' .repeat(60));
  } catch (error) {
    console.log('\n' + '='.repeat(60));
    console.error('❌ 数据同步失败');
    console.log('='.repeat(60));
    process.exit(1);
  }
}

// 执行
main();
