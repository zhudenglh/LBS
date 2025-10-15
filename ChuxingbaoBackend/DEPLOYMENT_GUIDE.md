# 出行宝后端部署指南

## 问题说明
刚才的错误是因为部署脚本在本地执行了，而不是在云服务器上执行。

## 正确的部署方法

### 方法一：使用阿里云 Workbench（推荐）

1. **登录阿里云控制台**
   - 打开 https://ecs.console.aliyun.com
   - 找到你的 ECS 实例（IP: 101.37.70.167）

2. **使用 Workbench 连接**
   - 点击实例右侧的"远程连接"
   - 选择"Workbench 远程连接"
   - 输入用户名和密码登录

3. **上传更新的 server.js 文件**

   方式 A - 使用 Workbench 文件上传功能：
   - 在 Workbench 界面点击"上传文件"
   - 选择本地的 `/Users/bytedance/Documents/claude/ChuxingbaoBackend/server.js`
   - 上传到服务器的临时目录（如 /tmp/）
   - 然后在终端执行：
     ```bash
     sudo cp /tmp/server.js /opt/chuxingbao-backend/server.js
     ```

   方式 B - 直接编辑文件：
   - 在终端执行以下命令：
     ```bash
     cd /opt/chuxingbao-backend
     sudo cp server.js server.js.backup.$(date +%Y%m%d_%H%M%S)
     sudo nano server.js
     ```
   - 然后手动粘贴更新后的代码

4. **重启服务**
   ```bash
   pm2 restart chuxingbao-backend
   pm2 status
   pm2 logs chuxingbao-backend --lines 20
   ```

### 方法二：使用 SCP 上传（如果配置了 SSH）

从本地电脑执行：
```bash
scp /Users/bytedance/Documents/claude/ChuxingbaoBackend/server.js root@101.37.70.167:/opt/chuxingbao-backend/server.js.new
```

然后 SSH 登录服务器：
```bash
ssh root@101.37.70.167
cd /opt/chuxingbao-backend
cp server.js server.js.backup.$(date +%Y%m%d_%H%M%S)
mv server.js.new server.js
pm2 restart chuxingbao-backend
```

## 核心改动说明

这次更新主要修改了 `GET /api/posts` 接口，在第 256-279 行添加了动态查询用户信息的逻辑：

```javascript
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
  }
}
```

这样当用户修改昵称或头像后，他之前发布的所有帖子都会显示最新的用户信息。

## 验证部署

部署完成后，可以测试：

1. 修改 App 中的用户昵称
2. 查看该用户之前发布的帖子
3. 确认帖子显示的是新昵称

## 需要帮助？

如果遇到问题，请提供：
- 执行的具体命令
- 完整的错误信息
- pm2 logs 的输出
