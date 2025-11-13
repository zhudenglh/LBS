// Mock Data Migration Script
// 将南京公交圈的mock数据迁移到数据库

const axios = require('axios');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');

const API_BASE_URL = 'http://47.107.130.240:8080/api/v1';

// 用户名池
const USER_NAMES = [
  '南京小王', '公交迷老李', '地铁通勤者', '南京通', '城市探索家',
  '交通观察员', '南京老司机', '公交达人', '地铁爱好者', '南京市民张三',
  '通勤小陈', '城市漫步者', '南京生活家', '公交小白', '地铁新手',
  '南京探路人', '交通小助手', '南京游客', '公交观察者', '地铁日常',
];

// 用户头像池
const USER_AVATARS = [
  'https://images.unsplash.com/photo-1526876917250-9c7bcecd349f?w=200',
  'https://images.unsplash.com/photo-1672685667592-0392f458f46f?w=200',
  'https://images.unsplash.com/photo-1734764627104-6ad22c48af6a?w=200',
  'https://images.unsplash.com/photo-1699903905361-4d408679753f?w=200',
  'https://images.unsplash.com/photo-1705830337569-47a1a24b0ad2?w=200',
];

// 帖子图片池
const POST_IMAGES = [
  'https://images.unsplash.com/photo-1665809544649-c389c3209976?w=400',
  'https://images.unsplash.com/photo-1648168982863-a5f9d18895ff?w=400',
  'https://images.unsplash.com/photo-1665482171703-afab88c87543?w=400',
];

// 50个帖子数据
const POSTS_DATA = [
  { id: 1, timeAgo: '1小时前', title: '📍【线路更新】1号线延伸段正式开通，新增5个站点！大家快来体验吧', imageUrl: POST_IMAGES[0], upvotes: 1245, comments: 87, flair: 's1路' },
  { id: 2, timeAgo: '3小时前', title: '早高峰观察：今天34路特别准时，司机师傅态度也很好👍', upvotes: 568, comments: 34, flair: '34路' },
  { id: 3, timeAgo: '5小时前', title: '新手求助：从南京南站到夫子庙坐地铁怎么走最快？', imageUrl: POST_IMAGES[1], upvotes: 892, comments: 125, flair: 's3路' },
  { id: 4, timeAgo: '7小时前', title: '🚌 整理了一份南京主城区常用公交线路图，希望对大家有帮助', imageUrl: POST_IMAGES[2], upvotes: 2156, comments: 198, flair: '攻略' },
  { id: 5, timeAgo: '10小时前', title: '刚才在地铁上捡到一个钱包，已交给站务员了，失主请联系车站', upvotes: 3421, comments: 267, flair: 's2路' },
  { id: 6, timeAgo: '12小时前', title: '吐槽：为什么周末的公交间隔时间那么长啊😭', upvotes: 1567, comments: 156, flair: '22路' },
  { id: 7, timeAgo: '15小时前', title: '地铁3号线今早故障延误了半小时，上班差点迟到', upvotes: 2893, comments: 312, flair: 's3路' },
  { id: 8, timeAgo: '1天前', title: '分享一个小技巧：用支付宝扫码乘车可以享受9折优惠', upvotes: 4567, comments: 423, flair: '优惠' },
  { id: 9, timeAgo: '1天前', title: '请问有人知道67路改线了吗？今天等了好久都没来', upvotes: 234, comments: 45, flair: '67路' },
  { id: 10, timeAgo: '1天前', title: '夸一下：昨天在公交上突然不舒服，司机师傅立即送我去医院，真的太感谢了🙏', imageUrl: POST_IMAGES[0], upvotes: 5678, comments: 534, flair: '5路' },
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
  { id: 26, timeAgo: '5天前', title: '🎉好消息！5号线即将通车，沿线房价要涨了', imageUrl: POST_IMAGES[2], upvotes: 5678, comments: 789, flair: 's5路' },
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
  { id: 41, timeAgo: '1周前', title: '🚇【攻略】南京地铁各线路首末班车时间汇总', imageUrl: POST_IMAGES[2], upvotes: 5678, comments: 678, flair: '攻略' },
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

// 工具函数：生成随机邮箱
function generateEmail(username, index) {
  const domains = ['163.com', 'qq.com', '126.com', 'gmail.com', 'sina.com'];
  const sanitizedName = username.replace(/[^a-zA-Z0-9]/g, '').toLowerCase() || `user${index}`;
  const randomNum = Math.floor(Math.random() * 1000);
  const domain = domains[Math.floor(Math.random() * domains.length)];
  return `${sanitizedName}${randomNum}@${domain}`;
}

// 工具函数：生成随机性别 (0=保密, 1=男, 2=女)
function randomGender() {
  return Math.floor(Math.random() * 3);
}

// 工具函数：生成随机年龄 (18-65岁)
function randomAge() {
  return Math.floor(Math.random() * 48) + 18;
}

// 工具函数：下载图片
async function downloadImage(url) {
  try {
    console.log(`  📥 下载图片: ${url}`);
    const response = await axios.get(url, {
      responseType: 'arraybuffer',
      timeout: 30000,
    });
    return Buffer.from(response.data);
  } catch (error) {
    console.error(`  ❌ 下载失败: ${error.message}`);
    return null;
  }
}

// 工具函数：上传图片到OSS
async function uploadImageToOSS(imageBuffer, filename) {
  try {
    const form = new FormData();
    form.append('image', imageBuffer, {
      filename: filename,
      contentType: 'image/jpeg',
    });

    const response = await axios.post(`${API_BASE_URL}/upload/image`, form, {
      headers: {
        ...form.getHeaders(),
      },
      timeout: 60000,
    });

    if (response.data && response.data.data && response.data.data.url) {
      console.log(`  ✅ 上传成功: ${response.data.data.url}`);
      return response.data.data.url;
    } else {
      console.error('  ❌ 上传失败：返回格式错误', response.data);
      return null;
    }
  } catch (error) {
    console.error(`  ❌ 上传失败: ${error.message}`);
    if (error.response) {
      console.error('  响应数据:', error.response.data);
    }
    return null;
  }
}

// 步骤1：注册用户
async function registerUsers() {
  console.log('\n=== 步骤1: 注册用户 ===\n');

  const userMap = {}; // { nickname: { email, token, userId, avatar } }

  for (let i = 0; i < USER_NAMES.length; i++) {
    const username = USER_NAMES[i];
    const email = generateEmail(username, i);
    const gender = randomGender();
    const age = randomAge();
    const avatarUrl = USER_AVATARS[i % USER_AVATARS.length];

    console.log(`📝 注册用户 ${i + 1}/${USER_NAMES.length}: ${username}`);
    console.log(`   邮箱: ${email}, 性别: ${gender}, 年龄: ${age}`);

    try {
      // 直接使用头像URL（跳过下载）
      const uploadedAvatar = avatarUrl;

      // 注册用户
      const response = await axios.post(`${API_BASE_URL}/auth/register`, {
        email: email,
        password: 'password123', // 统一密码
        nickname: username,
        avatar: uploadedAvatar,
        gender: gender,
        age: age,
      });

      if (response.data && response.data.data) {
        userMap[username] = {
          email: email,
          token: response.data.data.token,
          userId: response.data.data.user_id,
          avatar: uploadedAvatar,
        };
        console.log(`   ✅ 注册成功! User ID: ${response.data.data.user_id}`);
      } else {
        console.log(`   ❌ 注册失败`);
      }
    } catch (error) {
      if (error.response && error.response.status === 400 &&
          error.response.data.message &&
          error.response.data.message.includes('already registered')) {
        console.log(`   ⚠️  用户已存在，跳过`);
      } else {
        console.error(`   ❌ 注册失败:`, error.response?.data || error.message);
      }
    }

    // 避免请求过快
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  return userMap;
}

// 步骤2：创建帖子
async function createPosts(userMap) {
  console.log('\n=== 步骤2: 创建帖子 ===\n');

  const userNames = Object.keys(userMap);
  if (userNames.length === 0) {
    console.error('❌ 没有可用的用户，无法创建帖子');
    return;
  }

  for (let i = 0; i < POSTS_DATA.length; i++) {
    const post = POSTS_DATA[i];
    const username = userNames[i % userNames.length];
    const user = userMap[username];

    console.log(`📝 创建帖子 ${i + 1}/${POSTS_DATA.length}: ${post.title.substring(0, 30)}...`);
    console.log(`   作者: ${username}`);

    try {
      // 直接使用图片URL（跳过下载）
      let imageUrls = [];
      if (post.imageUrl) {
        imageUrls.push(post.imageUrl);
      }

      // 创建帖子
      const response = await axios.post(
        `${API_BASE_URL}/posts`,
        {
          title: post.title,
          content: '', // Mock数据没有content
          images: imageUrls,
          bus_tag: post.flair,
        },
        {
          headers: {
            'Authorization': `Bearer ${user.token}`,
          },
        }
      );

      if (response.data && response.data.data) {
        console.log(`   ✅ 创建成功! Post ID: ${response.data.data.post_id}`);
      } else {
        console.log(`   ❌ 创建失败`);
      }
    } catch (error) {
      console.error(`   ❌ 创建失败:`, error.response?.data || error.message);
    }

    // 避免请求过快
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}

// 主函数
async function main() {
  console.log('🚀 开始迁移 Mock 数据到数据库...\n');
  console.log(`📊 统计信息:`);
  console.log(`   - 用户数量: ${USER_NAMES.length}`);
  console.log(`   - 帖子数量: ${POSTS_DATA.length}`);
  console.log(`   - 图片数量: ${POSTS_DATA.filter(p => p.imageUrl).length}`);

  try {
    // 步骤1: 注册用户
    const userMap = await registerUsers();

    console.log(`\n✅ 用户注册完成! 成功注册 ${Object.keys(userMap).length} 个用户`);

    // 步骤2: 创建帖子
    await createPosts(userMap);

    console.log('\n🎉 迁移完成！');
  } catch (error) {
    console.error('\n❌ 迁移失败:', error);
  }
}

// 运行脚本
main();
