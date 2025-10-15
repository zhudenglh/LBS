const express = require('express');
const multer = require('multer');
const cors = require('cors');
const OSS = require('ali-oss');
const TableStore = require('tablestore');
const OpenAI = require('openai');
const config = require('./config');

const app = express();

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 配置 multer（内存存储）
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// 初始化 OSS 客户端
const ossClient = new OSS({
  region: config.oss.region,
  accessKeyId: config.oss.accessKeyId,
  accessKeySecret: config.oss.accessKeySecret,
  bucket: config.oss.bucket
});

// 初始化 Tablestore 客户端
const tablestoreClient = new TableStore.Client({
  accessKeyId: config.tablestore.accessKeyId,
  secretAccessKey: config.tablestore.accessKeySecret,
  endpoint: config.tablestore.endpoint,
  instancename: config.tablestore.instanceName
});

// 初始化通义千问 AI 客户端
const qwenClient = new OpenAI({
  apiKey: config.qwen.apiKey,
  baseURL: config.qwen.baseURL
});

// API: 健康检查
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'ChuxingBao Backend is running' });
});

// API: 创建/更新用户
app.post('/api/users', async (req, res) => {
  try {
    const { userId, nickname, avatar } = req.body;

    if (!userId || !nickname || !avatar) {
      return res.status(400).json({ error: '用户信息不完整' });
    }

    // 构建 Tablestore 参数（使用 users 表）
    const params = {
      tableName: 'users',
      condition: new TableStore.Condition(TableStore.RowExistenceExpectation.IGNORE, null),
      primaryKey: [{ 'user_id': userId }],
      attributeColumns: [
        { 'nickname': nickname },
        { 'avatar': avatar },
        { 'updated_at': Date.now() }
      ]
    };

    await tablestoreClient.putRow(params);

    console.log(`用户信息已保存: ${userId} - ${nickname}`);

    res.json({
      success: true,
      message: '用户信息保存成功'
    });
  } catch (error) {
    console.error('保存用户信息失败:', error);
    res.status(500).json({ error: '保存用户信息失败: ' + error.message });
  }
});

// API: 获取用户信息
app.get('/api/users/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const params = {
      tableName: 'users',
      primaryKey: [{ 'user_id': userId }]
    };

    const result = await tablestoreClient.getRow(params);

    if (!result.row) {
      return res.status(404).json({ error: '用户不存在' });
    }

    const user = {
      userId: result.row.primaryKey[0].value
    };

    for (const attr of result.row.attributes) {
      user[attr.columnName] = attr.columnValue;
    }

    res.json({
      success: true,
      user: user
    });
  } catch (error) {
    console.error('获取用户信息失败:', error);
    res.status(500).json({ error: '获取用户信息失败: ' + error.message });
  }
});

// API: 检查昵称是否存在
app.get('/api/users/check-nickname', async (req, res) => {
  try {
    const { nickname } = req.query;

    if (!nickname) {
      return res.status(400).json({ error: '昵称不能为空' });
    }

    // 扫描users表，查找是否有相同昵称
    const params = {
      tableName: 'users',
      direction: TableStore.Direction.FORWARD,
      inclusiveStartPrimaryKey: [{ 'user_id': TableStore.INF_MIN }],
      exclusiveEndPrimaryKey: [{ 'user_id': TableStore.INF_MAX }],
      limit: 1000,
      columnFilter: TableStore.CompositeCondition.singleColumnCondition(
        'nickname',
        nickname,
        TableStore.ComparatorType.EQUAL
      )
    };

    const result = await tablestoreClient.getRange(params);

    // 如果找到了匹配的行，说明昵称已存在
    const exists = result.rows && result.rows.length > 0;

    res.json({
      success: true,
      exists: exists
    });
  } catch (error) {
    console.error('检查昵称失败:', error);
    res.status(500).json({ error: '检查昵称失败: ' + error.message });
  }
});

// API: 上传图片
app.post('/api/upload-image', upload.single('image'), async (req, res) => {
  try {
    console.log('收到图片上传请求');
    console.log('Content-Type:', req.headers['content-type']);
    console.log('File:', req.file);

    if (!req.file) {
      console.error('没有收到文件数据');
      return res.status(400).json({ error: '没有上传文件' });
    }

    console.log('文件大小:', req.file.size, 'bytes');

    // 生成唯一文件名
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(7);
    const filename = `images/${timestamp}_${randomStr}.jpg`;

    // 上传到 OSS
    const result = await ossClient.put(filename, req.file.buffer);

    // 返回图片 URL
    const imageUrl = `https://${config.oss.bucket}.${config.oss.region}.aliyuncs.com/${filename}`;

    console.log('图片上传成功:', imageUrl);

    res.json({
      success: true,
      url: imageUrl
    });
  } catch (error) {
    console.error('上传图片失败:', error);
    res.status(500).json({ error: '上传图片失败: ' + error.message });
  }
});

// API: 创建帖子
app.post('/api/posts', async (req, res) => {
  try {
    const { title, content, busTag, imageUrls, userId, username, avatar } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: '标题和内容不能为空' });
    }

    // 生成帖子 ID
    const postId = `post_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    // 构建 Tablestore 参数
    const params = {
      tableName: config.tablestore.tableName,
      condition: new TableStore.Condition(TableStore.RowExistenceExpectation.EXPECT_NOT_EXIST, null),
      primaryKey: [{ 'post_id': postId }],
      attributeColumns: [
        { 'title': title },
        { 'content': content },
        { 'user_id': userId || '' },
        { 'username': username || '匿名用户' },
        { 'avatar': avatar || '👤' },
        { 'timestamp': Date.now() },
        { 'bus_tag': busTag || '' },
        { 'likes': 0 },
        { 'comments': 0 },
        { 'image_urls': Array.isArray(imageUrls) ? imageUrls.join(',') : '' }
      ],
      returnContent: { returnType: TableStore.ReturnType.Primarykey }
    };

    // 保存到 Tablestore
    await tablestoreClient.putRow(params);

    console.log(`帖子创建成功: ${postId} by ${username}`);

    res.json({
      success: true,
      postId: postId,
      message: '发布成功'
    });
  } catch (error) {
    console.error('创建帖子失败:', error);
    res.status(500).json({ error: '创建帖子失败: ' + error.message });
  }
});

// API: 获取帖子列表
app.get('/api/posts', async (req, res) => {
  try {
    const params = {
      tableName: config.tablestore.tableName,
      direction: TableStore.Direction.FORWARD,
      inclusiveStartPrimaryKey: [{ 'post_id': TableStore.INF_MIN }],
      exclusiveEndPrimaryKey: [{ 'post_id': TableStore.INF_MAX }],
      limit: 100
    };

    const result = await tablestoreClient.getRange(params);
    const posts = [];

    for (const row of result.rows) {
      const post = {
        post_id: row.primaryKey[0].value
      };

      // 解析属性列
      for (const attr of row.attributes) {
        post[attr.columnName] = attr.columnValue;
      }

      // 如果有user_id，查询最新的用户信息
      if (post.user_id) {
        try {
          const userParams = {
            tableName: 'users',
            primaryKey: [{ 'user_id': post.user_id }]
          };
          const userResult = await tablestoreClient.getRow(userParams);

          if (userResult.row) {
            // 使用最新的用户昵称和头像
            for (const attr of userResult.row.attributes) {
              if (attr.columnName === 'nickname') {
                post.username = attr.columnValue;
              } else if (attr.columnName === 'avatar') {
                post.avatar = attr.columnValue;
              }
            }
          }
        } catch (err) {
          console.error(`查询用户 ${post.user_id} 信息失败:`, err);
          // 如果查询失败，使用帖子中保存的快照信息
        }
      }

      posts.push(post);
    }

    // 按时间戳倒序排列
    posts.sort((a, b) => b.timestamp - a.timestamp);

    console.log(`返回 ${posts.length} 条帖子`);

    res.json({
      success: true,
      posts: posts
    });
  } catch (error) {
    console.error('获取帖子失败:', error);
    res.status(500).json({ error: '获取帖子失败: ' + error.message });
  }
});

// API: 点赞帖子
app.post('/api/posts/like', async (req, res) => {
  try {
    const { postId, userId } = req.body;

    if (!postId || !userId) {
      return res.status(400).json({ error: '帖子ID和用户ID不能为空' });
    }

    // 1. 检查用户是否已经点赞过
    const likeId = `${postId}_${userId}`;
    const checkParams = {
      tableName: 'likes',
      primaryKey: [{ 'like_id': likeId }]
    };

    try {
      const checkResult = await tablestoreClient.getRow(checkParams);
      if (checkResult.row) {
        // 已经点赞过，返回当前点赞数
        const postParams = {
          tableName: config.tablestore.tableName,
          primaryKey: [{ 'post_id': postId }]
        };
        const postResult = await tablestoreClient.getRow(postParams);

        let currentLikes = 0;
        if (postResult.row) {
          for (const attr of postResult.row.attributes) {
            if (attr.columnName === 'likes') {
              currentLikes = attr.columnValue;
              break;
            }
          }
        }

        return res.json({
          success: true,
          likes: currentLikes,
          message: '已经点赞过了'
        });
      }
    } catch (err) {
      // 如果查询失败（比如表不存在），继续执行点赞逻辑
      console.log('检查点赞状态失败，继续执行点赞:', err.message);
    }

    // 2. 保存点赞记录
    const likesParams = {
      tableName: 'likes',
      condition: new TableStore.Condition(TableStore.RowExistenceExpectation.EXPECT_NOT_EXIST, null),
      primaryKey: [{ 'like_id': likeId }],
      attributeColumns: [
        { 'post_id': postId },
        { 'user_id': userId },
        { 'timestamp': Date.now() }
      ]
    };

    await tablestoreClient.putRow(likesParams);

    // 3. 更新帖子的点赞数
    const getPostParams = {
      tableName: config.tablestore.tableName,
      primaryKey: [{ 'post_id': postId }]
    };

    const postResult = await tablestoreClient.getRow(getPostParams);

    if (!postResult.row) {
      return res.status(404).json({ error: '帖子不存在' });
    }

    // 获取当前点赞数
    let currentLikes = 0;
    const postAttributes = [];
    for (const attr of postResult.row.attributes) {
      if (attr.columnName === 'likes') {
        currentLikes = attr.columnValue;
      }
      postAttributes.push({ [attr.columnName]: attr.columnValue });
    }

    // 增加点赞数
    const newLikes = currentLikes + 1;

    // 更新帖子
    const updateParams = {
      tableName: config.tablestore.tableName,
      condition: new TableStore.Condition(TableStore.RowExistenceExpectation.EXPECT_EXIST, null),
      primaryKey: [{ 'post_id': postId }],
      updateOfAttributeColumns: [
        { 'PUT': [{ 'likes': newLikes }] }
      ]
    };

    await tablestoreClient.updateRow(updateParams);

    console.log(`用户 ${userId} 点赞帖子 ${postId}，当前点赞数: ${newLikes}`);

    res.json({
      success: true,
      likes: newLikes,
      message: '点赞成功'
    });
  } catch (error) {
    console.error('点赞失败:', error);
    res.status(500).json({ error: '点赞失败: ' + error.message });
  }
});

// API: 取消点赞
app.post('/api/posts/unlike', async (req, res) => {
  try {
    const { postId, userId } = req.body;

    if (!postId || !userId) {
      return res.status(400).json({ error: '帖子ID和用户ID不能为空' });
    }

    // 1. 检查用户是否点赞过
    const likeId = `${postId}_${userId}`;
    const checkParams = {
      tableName: 'likes',
      primaryKey: [{ 'like_id': likeId }]
    };

    const checkResult = await tablestoreClient.getRow(checkParams);

    if (!checkResult.row) {
      // 没有点赞过，返回当前点赞数
      const postParams = {
        tableName: config.tablestore.tableName,
        primaryKey: [{ 'post_id': postId }]
      };
      const postResult = await tablestoreClient.getRow(postParams);

      let currentLikes = 0;
      if (postResult.row) {
        for (const attr of postResult.row.attributes) {
          if (attr.columnName === 'likes') {
            currentLikes = attr.columnValue;
            break;
          }
        }
      }

      return res.json({
        success: true,
        likes: currentLikes,
        message: '未点赞过'
      });
    }

    // 2. 删除点赞记录
    const deleteParams = {
      tableName: 'likes',
      condition: new TableStore.Condition(TableStore.RowExistenceExpectation.EXPECT_EXIST, null),
      primaryKey: [{ 'like_id': likeId }]
    };

    await tablestoreClient.deleteRow(deleteParams);

    // 3. 更新帖子的点赞数
    const getPostParams = {
      tableName: config.tablestore.tableName,
      primaryKey: [{ 'post_id': postId }]
    };

    const postResult = await tablestoreClient.getRow(getPostParams);

    if (!postResult.row) {
      return res.status(404).json({ error: '帖子不存在' });
    }

    // 获取当前点赞数
    let currentLikes = 0;
    for (const attr of postResult.row.attributes) {
      if (attr.columnName === 'likes') {
        currentLikes = attr.columnValue;
        break;
      }
    }

    // 减少点赞数（但不能小于0）
    const newLikes = Math.max(0, currentLikes - 1);

    // 更新帖子
    const updateParams = {
      tableName: config.tablestore.tableName,
      condition: new TableStore.Condition(TableStore.RowExistenceExpectation.EXPECT_EXIST, null),
      primaryKey: [{ 'post_id': postId }],
      updateOfAttributeColumns: [
        { 'PUT': [{ 'likes': newLikes }] }
      ]
    };

    await tablestoreClient.updateRow(updateParams);

    console.log(`用户 ${userId} 取消点赞帖子 ${postId}，当前点赞数: ${newLikes}`);

    res.json({
      success: true,
      likes: newLikes,
      message: '取消点赞成功'
    });
  } catch (error) {
    console.error('取消点赞失败:', error);
    res.status(500).json({ error: '取消点赞失败: ' + error.message });
  }
});

// API: AI 聊天助手
app.post('/api/ai/chat', async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message) {
      return res.status(400).json({ error: '消息不能为空' });
    }

    // 构建消息历史
    const messages = [
      {
        role: 'system',
        content: `你是"出行宝"应用的 AI 助手，专门为用户提供公交出行相关的帮助。你的职责包括：
1. 回答关于公交线路、换乘方案的问题
2. 提供出行建议和旅行攻略
3. 介绍附近的生活服务设施
4. 解答其他与出行、旅行相关的问题

请用友好、专业的语气回答用户的问题，保持简洁明了。如果遇到不确定的信息，诚实告知用户。`
      }
    ];

    // 添加历史对话（如果有）
    if (Array.isArray(history) && history.length > 0) {
      messages.push(...history);
    }

    // 添加当前用户消息
    messages.push({
      role: 'user',
      content: message
    });

    console.log('调用通义千问 API...');

    // 调用通义千问 API
    const completion = await qwenClient.chat.completions.create({
      model: config.qwen.model,
      messages: messages,
      temperature: 0.7,
      max_tokens: 1000
    });

    const reply = completion.choices[0].message.content;

    console.log(`AI 回复: ${reply.substring(0, 50)}...`);

    res.json({
      success: true,
      reply: reply,
      timestamp: Date.now()
    });
  } catch (error) {
    console.error('AI 聊天失败:', error);
    res.status(500).json({
      error: 'AI 聊天失败: ' + error.message,
      details: error.toString()
    });
  }
});

// 启动服务器
const PORT = config.server.port;
app.listen(PORT, () => {
  console.log(`出行宝后端服务运行在 http://localhost:${PORT}`);
  console.log(`健康检查: http://localhost:${PORT}/health`);
});
