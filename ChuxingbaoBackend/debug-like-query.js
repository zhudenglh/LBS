const TableStore = require('tablestore');
const config = require('./config');

const client = new TableStore.Client({
  accessKeyId: config.tablestore.accessKeyId,
  secretAccessKey: config.tablestore.accessKeySecret,
  endpoint: config.tablestore.endpoint,
  instancename: config.tablestore.instanceName
});

async function debugLikeQuery() {
  console.log('========================================');
  console.log('调试点赞状态查询');
  console.log('========================================\n');

  try {
    const testPostId = 'post_1760695822340_mb02s7';
    const testUserId = 'test_user_123';
    const likeId = `${testPostId}_${testUserId}`;

    console.log(`测试数据:`);
    console.log(`  postId: ${testPostId}`);
    console.log(`  userId: ${testUserId}`);
    console.log(`  likeId: ${likeId}\n`);

    // 查询点赞记录
    const params = {
      tableName: 'likes',
      primaryKey: [{ 'like_id': likeId }]
    };

    console.log('执行查询...\n');
    const result = await client.getRow(params);

    console.log('查询结果:');
    console.log('  result:', result);
    console.log('  result.row:', result.row);
    console.log('  typeof result.row:', typeof result.row);
    console.log('  !!result.row:', !!result.row);
    console.log('  result.row === undefined:', result.row === undefined);
    console.log('  result.row === null:', result.row === null);

    if (result.row) {
      console.log('\n  result.row 内容:');
      console.log('    primaryKey:', result.row.primaryKey);
      console.log('    attributes:', result.row.attributes);
    }

    console.log('\n========================================');
    console.log('结论: isLikedByUser =', !!result.row);
    console.log('========================================');

  } catch (error) {
    console.error('❌ 查询失败:', error.message);
    console.error('详细信息:', error);
  }
}

debugLikeQuery()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('错误:', err);
    process.exit(1);
  });
