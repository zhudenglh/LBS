# 出行宝后端部署指南

## 方法一：使用密码部署（推荐新手）

直接运行部署脚本，系统会提示你输入服务器密码（需要输入2次）：

```bash
cd /Users/bytedance/Documents/claude/ChuxingbaoBackend
./deploy-manual.sh
```

输入密码后，脚本会自动：
1. 上传 server.js 到服务器
2. 重启后端服务
3. 验证部署是否成功

---

## 方法二：配置SSH密钥（推荐常用）

配置后可以免密码登录，更方便快捷。

### 1. 生成SSH密钥（如果还没有）

```bash
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
```

按提示操作，可以直接回车使用默认设置。

### 2. 上传公钥到服务器

```bash
ssh-copy-id root@101.37.70.167
```

输入服务器密码后，公钥会自动配置到服务器。

### 3. 测试SSH连接

```bash
ssh root@101.37.70.167 "echo '连接成功'"
```

如果不需要输入密码就能连接成功，说明配置完成。

### 4. 使用自动部署脚本

```bash
./deploy.sh
```

---

## 方法三：手动部署

如果脚本有问题，可以手动执行以下命令：

### 1. 上传文件

```bash
scp /Users/bytedance/Documents/claude/ChuxingbaoBackend/server.js root@101.37.70.167:/root/ChuxingbaoBackend/
```

### 2. SSH登录服务器

```bash
ssh root@101.37.70.167
```

### 3. 在服务器上重启服务

```bash
cd /root/ChuxingbaoBackend

# 停止旧进程
pkill -f "node server.js" || true
sleep 2

# 启动新进程
nohup node server.js > server.log 2>&1 &
sleep 2

# 检查是否启动成功
ps aux | grep "node server.js" | grep -v grep

# 查看日志
tail -f server.log
```

### 4. 测试API

```bash
curl http://101.37.70.167:3000/health
```

---

## 验证部署

部署成功后，测试新的点赞API：

### 点赞测试

```bash
curl -X POST http://101.37.70.167:3000/api/posts/like \
  -H "Content-Type: application/json" \
  -d '{"postId":"post_xxx","userId":"user_xxx"}'
```

### 取消点赞测试

```bash
curl -X POST http://101.37.70.167:3000/api/posts/unlike \
  -H "Content-Type: application/json" \
  -d '{"postId":"post_xxx","userId":"user_xxx"}'
```

---

## 常见问题

### Q: 提示 "Permission denied"
A: 需要输入服务器密码，或者配置SSH密钥

### Q: 服务启动失败
A: SSH登录服务器，运行 `tail -f /root/ChuxingbaoBackend/server.log` 查看错误日志

### Q: 端口被占用
A: 运行 `pkill -f "node server.js"` 停止旧进程

### Q: 需要修改服务器路径
A: 编辑 deploy.sh 或 deploy-manual.sh，修改 REMOTE_PATH 变量

---

## 服务器信息

- 服务器IP: 101.37.70.167
- 用户名: root
- 后端路径: /root/ChuxingbaoBackend
- API端口: 3000

---

## 新增API端点

本次部署新增了以下API：

- `POST /api/posts/like` - 点赞帖子
- `POST /api/posts/unlike` - 取消点赞

详细API文档请查看 server.js 源码。
