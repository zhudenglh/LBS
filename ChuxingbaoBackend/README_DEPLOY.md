# 阿里云服务器部署指南

## 一、购买阿里云服务器

1. 访问阿里云官网：https://www.aliyun.com/
2. 选择 **云服务器ECS** 或 **轻量应用服务器**
3. 推荐配置：
   - CPU：1核
   - 内存：2GB
   - 带宽：1-5Mbps
   - 操作系统：**CentOS 7.9** 或 **Ubuntu 20.04**
   - 地域：选择离您最近的（如华东-杭州）

## 二、配置服务器安全组

1. 登录阿里云控制台
2. 进入 ECS 实例管理
3. 点击 **安全组** → **配置规则**
4. 添加入方向规则：
   - 端口范围：**3000/3000**
   - 授权对象：**0.0.0.0/0**
   - 协议类型：TCP

## 三、部署后端服务

### 步骤1：连接到服务器

```bash
# 使用SSH连接（替换YOUR_SERVER_IP为您的服务器公网IP）
ssh root@YOUR_SERVER_IP
```

### 步骤2：上传代码

**方法A：使用 scp 命令**
```bash
# 在本地电脑执行（Mac/Linux）
cd /Users/bytedance/Documents/claude/ChuxingbaoBackend
scp package.json server.js config.js root@YOUR_SERVER_IP:~/chuxingbao-backend/
```

**方法B：使用 Git**
```bash
# 在服务器上执行
cd ~
git clone YOUR_GIT_REPO chuxingbao-backend
cd chuxingbao-backend
```

**方法C：手动上传**
- 使用 FileZilla 或其他 FTP 工具
- 上传 `package.json`, `server.js`, `config.js` 到服务器

### 步骤3：执行部署脚本

```bash
# 在服务器上执行
cd /opt/chuxingbao-backend
chmod +x deploy.sh
./deploy.sh
```

### 步骤4：验证部署

```bash
# 访问健康检查接口
curl http://YOUR_SERVER_IP:3000/health

# 应该返回：
# {"status":"ok","message":"ChuxingBao Backend is running"}
```

## 四、修改Android APP配置

修改 `ApiClient.java` 中的服务器地址：

```java
// 原来的地址
private static final String BASE_URL = "http://192.168.1.111:3000/api";

// 改为云服务器地址
private static final String BASE_URL = "http://YOUR_SERVER_IP:3000/api";
```

然后重新编译APK：
```bash
./gradlew assembleDebug
```

## 五、常用运维命令

```bash
# 查看服务状态
pm2 status

# 查看日志
pm2 logs chuxingbao-backend

# 重启服务
pm2 restart chuxingbao-backend

# 停止服务
pm2 stop chuxingbao-backend

# 查看实时日志
pm2 logs chuxingbao-backend --lines 50 -f
```

## 六、故障排查

### 1. 无法访问服务

**检查服务是否运行：**
```bash
pm2 status
```

**检查端口是否监听：**
```bash
netstat -tlnp | grep 3000
```

**检查防火墙：**
```bash
# CentOS
sudo firewall-cmd --list-ports
sudo firewall-cmd --add-port=3000/tcp --permanent
sudo firewall-cmd --reload

# Ubuntu
sudo ufw status
sudo ufw allow 3000/tcp
```

### 2. 阿里云连接失败

**检查AccessKey是否正确：**
```bash
cat config.js
```

**测试OSS连接：**
- 访问阿里云OSS控制台，确认Bucket存在
- 检查网络类型是否允许公网访问

### 3. 查看详细错误日志

```bash
pm2 logs chuxingbao-backend --err --lines 100
```

## 七、性能优化（可选）

### 使用Nginx反向代理

1. 安装Nginx：
```bash
sudo yum install -y nginx  # CentOS
# 或
sudo apt install -y nginx  # Ubuntu
```

2. 配置Nginx：
```bash
sudo vi /etc/nginx/conf.d/chuxingbao.conf
```

添加配置：
```nginx
server {
    listen 80;
    server_name YOUR_DOMAIN_OR_IP;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

3. 重启Nginx：
```bash
sudo systemctl restart nginx
```

这样就可以使用80端口访问，无需输入`:3000`

## 八、备份建议

定期备份Tablestore数据：
- 使用阿里云Tablestore的数据备份功能
- 或定期导出重要数据

## 九、成本估算

- 轻量应用服务器：¥60-100/月
- OSS存储：¥0.12/GB/月（按实际使用量）
- Tablestore：免费额度足够小规模使用
- 总计：约¥60-120/月

## 十、获取帮助

如果遇到问题：
1. 检查 `pm2 logs` 中的错误信息
2. 检查阿里云安全组配置
3. 确认AccessKey配置正确
