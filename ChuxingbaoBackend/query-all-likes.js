const TableStore = require('tablestore');
const config = require('./config');

const client = new TableStore.Client({
  accessKeyId: config.tablestore.accessKeyId,
  secretAccessKey: config.tablestore.accessKeySecret,
  endpoint: config.tablestore.endpoint,
  instancename: config.tablestore.instanceName
});

async function queryAllLikes() {
  console.log('========================================');
  console.log('查询 likes 表中的所有记录');
  console.log('========================================\n');

  try {
    const params = {
      tableName: 'likes',
      direction: TableStore.Direction.FORWARD,
      inclusiveStartPrimaryKey: [{ 'like_id': TableStore.INF_MIN }],
      exclusiveEndPrimaryKey: [{ 'like_id': TableStore.INF_MAX }],
      limit: 1000
    };

    const result = await client.getRange(params);
    console.log(`共找到 ${result.rows.length} 条记录\n`);

    if (result.rows.length === 0) {
      console.log('✅ likes 表是空的');
      return;
    }

    // 显示所有记录
    result.rows.forEach((row, index) => {
      const likeId = row.primaryKey[0].value;
      let postId = '';
      let userId = '';
      let timestamp = '';

      if (row.attributes && Array.isArray(row.attributes)) {
        for (const attr of row.attributes) {
          if (attr.columnName === 'post_id') postId = attr.columnValue;
          if (attr.columnName === 'user_id') userId = attr.columnValue;
          if (attr.columnName === 'timestamp') timestamp = attr.columnValue;
        }
      }

      console.log(`记录 ${index + 1}:`);
      console.log(`  like_id: ${likeId}`);
      console.log(`  post_id: ${postId}`);
      console.log(`  user_id: ${userId}`);
      console.log(`  时间: ${timestamp ? new Date(Number(timestamp)).toLocaleString('zh-CN') : 'N/A'}`);
      console.log('');
    });

    console.log('========================================');
    console.log('如需清空，请运行: node clean-like-data.js');
    console.log('========================================');

  } catch (error) {
    console.error('查询失败:', error.message);
    process.exit(1);
  }
}

queryAllLikes().then(() => process.exit(0));
