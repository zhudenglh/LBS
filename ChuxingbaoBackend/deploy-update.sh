#!/bin/bash

# 出行宝后端部署脚本 - 更新用户昵称动态查询功能
# 使用方法：在阿里云 Workbench 中执行此脚本

set -e

echo "========================================="
echo "出行宝后端部署 - 更新用户信息动态查询"
echo "========================================="

# 进入后端目录
cd /opt/chuxingbao-backend

# 备份当前版本
echo "备份当前版本..."
cp server.js server.js.backup.$(date +%Y%m%d_%H%M%S)

# 写入新的 server.js
echo "写入更新后的 server.js..."
cat > server.js << 'EOFSERVERJS'
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const OSS = require('ali-oss');
const TableStore = require('tablestore');
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

    console.log(\`用户信息已保存: \${userId} - \${nickname}\`);

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
    const filename = \`images/\${timestamp}_\${randomStr}.jpg\`;

    // 上传到 OSS
    const result = await ossClient.put(filename, req.file.buffer);

    // 返回图片 URL
    const imageUrl = \`https://\${config.oss.bucket}.\${config.oss.region}.aliyuncs.com/\${filename}\`;

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
    const postId = \`post_\${Date.now()}_\${Math.random().toString(36).substring(7)}\`;

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

    console.log(\`帖子创建成功: \${postId} by \${username}\`);

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
          console.error(\`查询用户 \${post.user_id} 信息失败:\`, err);
          // 如果查询失败，使用帖子中保存的快照信息
        }
      }

      posts.push(post);
    }

    // 按时间戳倒序排列
    posts.sort((a, b) => b.timestamp - a.timestamp);

    console.log(\`返回 \${posts.length} 条帖子\`);

    res.json({
      success: true,
      posts: posts
    });
  } catch (error) {
    console.error('获取帖子失败:', error);
    res.status(500).json({ error: '获取帖子失败: ' + error.message });
  }
});

// 启动服务器
const PORT = config.server.port;
app.listen(PORT, () => {
  console.log(\`出行宝后端服务运行在 http://localhost:\${PORT}\`);
  console.log(\`健康检查: http://localhost:\${PORT}/health\`);
});
EOFSERVERJS

# 重启服务
echo "重启后端服务..."
pm2 restart chuxingbao-backend

echo ""
echo "========================================="
echo "部署完成！"
echo "========================================="
echo ""
echo "检查服务状态："
pm2 status

echo ""
echo "查看最新日志："
pm2 logs chuxingbao-backend --lines 20
