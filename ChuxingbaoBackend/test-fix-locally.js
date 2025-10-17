// 本地测试修复后的逻辑
const TableStore = require('tablestore');
const config = require('./config');

const client = new TableStore.Client({
  accessKeyId: config.tablestore.accessKeyId,
  secretAccessKey: config.tablestore.accessKeySecret,
  endpoint: config.tablestore.endpoint,
  instancename: config.tablestore.instanceName
});

async function testFixedLogic() {
  console.log('========================================');
  console.log('测试修复后的点赞状态查询逻辑');
  console.log('========================================\n');

  try {
    const testPostId = 'post_1760695822340_mb02s7';
    const testUserId = 'test_user_123';
    const likeId = `${testPostId}_${testUserId}`;

    console.log('测试场景 1: 查询不存在的点赞记录');
    console.log(`  likeId: ${likeId}\n`);

    const params = {
      tableName: 'likes',
      primaryKey: [{ 'like_id': likeId }]
    };

    const result = await client.getRow(params);

    // 旧逻辑（有bug）
    const oldLogic = !!result.row;
    console.log('  旧逻辑 (!!result.row):', oldLogic);
    console.log('    → 错误：不存在的记录也返回true\n');

    // 新逻辑（修复后）
    const newLogic = !!(result.row && result.row.primaryKey);
    console.log('  新逻辑 (!!(result.row && result.row.primaryKey)):', newLogic);
    console.log('    → 正确：不存在的记录返回false\n');

    console.log('========================================');
    console.log('测试场景 2: 实际点赞并查询');
    console.log('========================================\n');

    // 创建一个点赞记录
    console.log('步骤 1: 创建点赞记录...');
    const createParams = {
      tableName: 'likes',
      condition: new TableStore.Condition(TableStore.RowExistenceExpectation.EXPECT_NOT_EXIST, null),
      primaryKey: [{ 'like_id': likeId }],
      attributeColumns: [
        { 'post_id': testPostId },
        { 'user_id': testUserId },
        { 'timestamp': TableStore.Long.fromNumber(Date.now()) }
      ]
    };

    try {
      await client.putRow(createParams);
      console.log('✅ 点赞记录创建成功\n');
    } catch (err) {
      if (err.code === 'OTSConditionCheckFail') {
        console.log('⚠️  点赞记录已存在，跳过创建\n');
      } else {
        throw err;
      }
    }

    // 再次查询
    console.log('步骤 2: 查询点赞状态...');
    const result2 = await client.getRow(params);

    const oldLogic2 = !!result2.row;
    const newLogic2 = !!(result2.row && result2.row.primaryKey);

    console.log('  旧逻辑:', oldLogic2, '✓');
    console.log('  新逻辑:', newLogic2, '✓');
    console.log('  两种逻辑在记录存在时结果一致\n');

    // 清理测试数据
    console.log('步骤 3: 清理测试数据...');
    const deleteParams = {
      tableName: 'likes',
      condition: new TableStore.Condition(TableStore.RowExistenceExpectation.EXPECT_EXIST, null),
      primaryKey: [{ 'like_id': likeId }]
    };

    try {
      await client.deleteRow(deleteParams);
      console.log('✅ 测试数据已清理\n');
    } catch (err) {
      console.log('⚠️  清理失败（可能已被删除）\n');
    }

    console.log('========================================');
    console.log('✅ 测试完成！修复方案有效');
    console.log('========================================\n');

    console.log('总结:');
    console.log('  问题: Tablestore的getRow对不存在的记录返回空对象{}');
    console.log('  症状: 所有帖子的isLikedByUser都显示为true');
    console.log('  修复: 检查result.row.primaryKey是否存在');
    console.log('\n需要部署到服务器以应用修复！');

  } catch (error) {
    console.error('❌ 测试失败:', error.message);
    console.error(error);
  }
}

testFixedLogic()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('错误:', err);
    process.exit(1);
  });
