const TableStore = require('tablestore');
const config = require('./config');

// 初始化 Tablestore 客户端
const client = new TableStore.Client({
  accessKeyId: config.tablestore.accessKeyId,
  secretAccessKey: config.tablestore.accessKeySecret,
  endpoint: config.tablestore.endpoint,
  instancename: config.tablestore.instanceName
});

async function checkAndFixLikesTable() {
  console.log('========================================');
  console.log('检查和修复 likes 表');
  console.log('========================================\n');

  try {
    // 1. 尝试查询 likes 表
    console.log('步骤 1: 检查 likes 表是否存在...');
    try {
      const describeParams = {
        tableName: 'likes'
      };
      const result = await client.describeTable(describeParams);
      console.log('✅ likes 表已存在');
      console.log('表信息:', JSON.stringify(result.tableOptions, null, 2));

      // 尝试查询一些数据
      console.log('\n步骤 2: 查询 likes 表中的数据...');
      const queryParams = {
        tableName: 'likes',
        direction: TableStore.Direction.FORWARD,
        inclusiveStartPrimaryKey: [{ 'like_id': TableStore.INF_MIN }],
        exclusiveEndPrimaryKey: [{ 'like_id': TableStore.INF_MAX }],
        limit: 10
      };
      const queryResult = await client.getRange(queryParams);
      console.log(`✅ 找到 ${queryResult.rows.length} 条点赞记录`);

      if (queryResult.rows.length > 0) {
        console.log('\n前几条记录:');
        for (const row of queryResult.rows.slice(0, 5)) {
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

          console.log(`  - like_id: ${likeId}`);
          console.log(`    post_id: ${postId}, user_id: ${userId}`);
        }
      }

    } catch (error) {
      if (error.code === 'OTSObjectNotExist') {
        console.log('❌ likes 表不存在！');
        console.log('\n步骤 2: 创建 likes 表...');

        const createParams = {
          tableMeta: {
            tableName: 'likes',
            primaryKey: [
              {
                name: 'like_id',
                type: 'STRING'
              }
            ]
          },
          reservedThroughput: {
            capacityUnit: {
              read: 0,
              write: 0
            }
          },
          tableOptions: {
            timeToLive: -1, // 数据永不过期
            maxVersions: 1   // 只保留1个版本
          }
        };

        await client.createTable(createParams);
        console.log('✅ likes 表创建成功！');
      } else {
        throw error;
      }
    }

    console.log('\n========================================');
    console.log('✅ 检查完成！likes 表正常');
    console.log('========================================');

  } catch (error) {
    console.error('\n❌ 发生错误:', error.message);
    console.error('详细信息:', error);
    process.exit(1);
  }
}

// 执行检查
checkAndFixLikesTable()
  .then(() => {
    console.log('\n操作完成！');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n操作失败:', error.message);
    process.exit(1);
  });
