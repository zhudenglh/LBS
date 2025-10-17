# 点赞功能修复部署说明

## 问题诊断

### 根本原因
Tablestore的`getRow()`方法在查询不存在的记录时，返回的是**空对象`{}`**而不是`undefined`或`null`。

导致以下代码判断错误：
```javascript
const likeResult = await tablestoreClient.getRow(likeParams);
post.isLikedByUser = !!likeResult.row;  // !!{} 永远为 true
```

### 表现症状
1. 所有帖子的`isLikedByUser`都显示为`true`
2. 第一次点击点赞显示"取消点赞"（因为初始状态错误地认为已点赞）
3. 点赞数字不正确
4. likes表中没有数据（实际点赞操作被当作取消点赞处理）

## 修复内容

已修复3处代码（server.js）：

### 1. GET /api/posts - 查询帖子列表时的点赞状态（第304行）
```javascript
// 修复前
post.isLikedByUser = !!likeResult.row;

// 修复后
post.isLikedByUser = !!(likeResult.row && likeResult.row.primaryKey);
```

### 2. POST /api/posts/like - 点赞时检查是否已点赞（第348行）
```javascript
// 修复前
if (checkResult.row) {

// 修复后
if (checkResult.row && checkResult.row.primaryKey) {
```

### 3. POST /api/posts/unlike - 取消点赞时检查是否已点赞（第491行）
```javascript
// 修复前
if (!checkResult.row) {

// 修复后
if (!checkResult.row || !checkResult.row.primaryKey) {
```

## 部署步骤

### 方法1：使用快速部署脚本（推荐）
```bash
cd /Users/bytedance/Documents/claude/ChuxingbaoBackend
bash quick-deploy.sh
```
输入服务器密码后，脚本会自动：
- 上传修复后的server.js
- 重启pm2服务
- 验证部署

### 方法2：手动部署
```bash
# 1. 上传文件
scp server.js root@101.37.70.167:/opt/chuxingbao-backend/server.js

# 2. SSH登录服务器
ssh root@101.37.70.167

# 3. 重启服务
cd /opt/chuxingbao-backend
pm2 restart all
pm2 status

# 4. 退出
exit
```

### 方法3：直接在服务器上修改
```bash
# 1. SSH登录
ssh root@101.37.70.167

# 2. 备份原文件
cd /opt/chuxingbao-backend
cp server.js server.js.backup

# 3. 编辑文件
vim server.js

# 4. 找到以下3处，进行修改：
#    - 第304行：post.isLikedByUser = !!(likeResult.row && likeResult.row.primaryKey);
#    - 第348行：if (checkResult.row && checkResult.row.primaryKey) {
#    - 第491行：if (!checkResult.row || !checkResult.row.primaryKey) {

# 5. 重启服务
pm2 restart all

# 6. 退出
exit
```

## 验证部署

部署完成后，运行测试脚本验证：
```bash
cd /Users/bytedance/Documents/claude/ChuxingbaoBackend
bash test-like-api.sh
```

### 预期结果
1. 初始状态：`isLikedByUser: false`，`likes: 0`
2. 第一次点赞：`likes: 1`，message: "点赞成功"
3. 再次获取：`isLikedByUser: true`，`likes: 1`
4. 取消点赞：`likes: 0`，message: "取消点赞成功"
5. 最后状态：`isLikedByUser: false`，`likes: 0`

## 测试点赞功能

部署后，使用Android应用测试：
1. 打开应用，进入发现页面
2. 查看帖子，确认点赞图标是👍（未点赞状态）
3. 点击点赞按钮
   - 图标变为❤️
   - 点赞数+1
   - 提示"已点赞"
4. 再次点击取消点赞
   - 图标变回👍
   - 点赞数-1
   - 提示"取消点赞"
5. 检查likes表确认有数据：
   ```bash
   node query-all-likes.js
   ```

## 技术细节

### Tablestore getRow返回值结构
```javascript
// 记录存在时
{
  consumed: {...},
  row: {
    primaryKey: [{name: 'like_id', value: 'xxx'}],
    attributes: [...]
  },
  RequestId: 'xxx'
}

// 记录不存在时
{
  consumed: {...},
  row: {},  // 空对象，不是 undefined 或 null！
  RequestId: 'xxx'
}
```

### 正确的判断方式
```javascript
// ❌ 错误：空对象也会被判断为true
const exists = !!result.row;

// ✅ 正确：检查primaryKey是否存在
const exists = !!(result.row && result.row.primaryKey);
```

## 相关文件
- `server.js` - 后端服务器代码（已修复）
- `test-like-api.sh` - API测试脚本
- `test-fix-locally.js` - 本地修复验证脚本
- `debug-like-query.js` - 调试脚本
- `query-all-likes.js` - 查询likes表数据
- `quick-deploy.sh` - 快速部署脚本

## 注意事项
- 部署前请确保备份原文件
- 部署后需要重启pm2服务
- 建议先在测试环境验证后再部署到生产环境
- 如果仍有问题，检查服务器日志：`pm2 logs`
