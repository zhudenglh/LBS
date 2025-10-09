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
    const { title, content, busTag, imageUrls } = req.body;

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
        { 'username': '我' },
        { 'avatar': '👤' },
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

    console.log(`帖子创建成功: ${postId}`);

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

// 启动服务器
const PORT = config.server.port;
app.listen(PORT, () => {
  console.log(`出行宝后端服务运行在 http://localhost:${PORT}`);
  console.log(`健康检查: http://localhost:${PORT}/health`);
});
