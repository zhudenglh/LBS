const TableStore = require('tablestore');
const config = require('./config');

// 初始化 Tablestore 客户端
const client = new TableStore.Client({
  accessKeyId: config.tablestore.accessKeyId,
  secretAccessKey: config.tablestore.accessKeySecret,
  endpoint: config.tablestore.endpoint,
  instancename: config.tablestore.instanceName
});

async function createLikesTable() {
  const params = {
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

  try {
    const result = await client.createTable(params);
    console.log('✅ likes表创建成功！');
    console.log(result);
  } catch (error) {
    if (error.code === 'OTSObjectAlreadyExist') {
      console.log('⚠️  likes表已存在，无需重复创建');
    } else {
      console.error('❌ 创建likes表失败:', error);
      throw error;
    }
  }
}

// 执行创建
createLikesTable()
  .then(() => {
    console.log('\n创建完成！');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n创建失败:', error.message);
    process.exit(1);
  });
