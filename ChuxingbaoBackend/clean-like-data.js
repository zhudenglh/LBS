const TableStore = require('tablestore');
const config = require('./config');

// 初始化 Tablestore 客户端
const client = new TableStore.Client({
  accessKeyId: config.tablestore.accessKeyId,
  secretAccessKey: config.tablestore.accessKeySecret,
  endpoint: config.tablestore.endpoint,
  instancename: config.tablestore.instanceName
});

async function cleanLikeData() {
  console.log('========================================');
  console.log('清理 likes 表数据');
  console.log('========================================\n');

  try {
    // 1. 查询所有likes记录
    console.log('步骤 1: 查询所有点赞记录...');
    const queryParams = {
      tableName: 'likes',
      direction: TableStore.Direction.FORWARD,
      inclusiveStartPrimaryKey: [{ 'like_id': TableStore.INF_MIN }],
      exclusiveEndPrimaryKey: [{ 'like_id': TableStore.INF_MAX }],
      limit: 1000
    };
    const queryResult = await client.getRange(queryParams);
    console.log(`找到 ${queryResult.rows.length} 条点赞记录\n`);

    if (queryResult.rows.length === 0) {
      console.log('✅ likes表是空的，无需清理');
      return;
    }

    // 显示前几条记录
    console.log('前5条记录：');
    for (const row of queryResult.rows.slice(0, 5)) {
      const likeId = row.primaryKey[0].value;
      let postId = '';
      let userId = '';

      if (row.attributes && Array.isArray(row.attributes)) {
        for (const attr of row.attributes) {
          if (attr.columnName === 'post_id') postId = attr.columnValue;
          if (attr.columnName === 'user_id') userId = attr.columnValue;
        }
      }

      console.log(`  - ${likeId} (post: ${postId}, user: ${userId})`);
    }

    // 2. 删除所有记录
    console.log('\n步骤 2: 删除所有点赞记录...');
    let deletedCount = 0;
    for (const row of queryResult.rows) {
      const likeId = row.primaryKey[0].value;
      const deleteParams = {
        tableName: 'likes',
        condition: new TableStore.Condition(TableStore.RowExistenceExpectation.IGNORE, null),
        primaryKey: [{ 'like_id': likeId }]
      };

      try {
        await client.deleteRow(deleteParams);
        deletedCount++;
      } catch (err) {
        console.error(`删除 ${likeId} 失败:`, err.message);
      }
    }

    console.log(`✅ 已删除 ${deletedCount} 条记录\n`);

    // 3. 重置所有帖子的点赞数为0
    console.log('步骤 3: 重置所有帖子的点赞数...');
    const postsParams = {
      tableName: config.tablestore.tableName,
      direction: TableStore.Direction.FORWARD,
      inclusiveStartPrimaryKey: [{ 'post_id': TableStore.INF_MIN }],
      exclusiveEndPrimaryKey: [{ 'post_id': TableStore.INF_MAX }],
      limit: 100
    };
    const postsResult = await client.getRange(postsParams);

    let updatedCount = 0;
    for (const row of postsResult.rows) {
      const postId = row.primaryKey[0].value;

      // 检查当前likes值
      let currentLikes = 0;
      if (row.attributes && Array.isArray(row.attributes)) {
        for (const attr of row.attributes) {
          if (attr.columnName === 'likes') {
            currentLikes = attr.columnValue;
            break;
          }
        }
      }

      // 只更新非0的点赞数
      if (currentLikes !== 0) {
        const updateParams = {
          tableName: config.tablestore.tableName,
          condition: new TableStore.Condition(TableStore.RowExistenceExpectation.EXPECT_EXIST, null),
          primaryKey: [{ 'post_id': postId }],
          updateOfAttributeColumns: [
            { 'PUT': [{ 'likes': 0 }] }
          ]
        };

        try {
          await client.updateRow(updateParams);
          console.log(`  - ${postId}: ${currentLikes} -> 0`);
          updatedCount++;
        } catch (err) {
          console.error(`更新 ${postId} 失败:`, err.message);
        }
      }
    }

    console.log(`✅ 已重置 ${updatedCount} 个帖子的点赞数\n`);

    console.log('========================================');
    console.log('✅ 清理完成！');
    console.log('========================================');

  } catch (error) {
    console.error('\n❌ 清理失败:', error.message);
    console.error('详细信息:', error);
    process.exit(1);
  }
}

// 执行清理
cleanLikeData()
  .then(() => {
    console.log('\n操作完成！');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n操作失败:', error.message);
    process.exit(1);
  });
