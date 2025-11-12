# 文件存储方案配置指南

## 概述

由于服务器资源限制（2GB 内存，40GB 硬盘），我们采用**本地文件系统存储 + Nginx 静态文件服务**的方案，替代阿里云 OSS 对象存储服务。

**优势**:
- 零成本（无需额外购买云服务）
- 低延迟（本地文件系统直接读取）
- 配置简单（Nginx 原生支持）

**限制**:
- 单机存储容量有限（40GB 硬盘）
- 无法自动扩容（需手动扩容硬盘）
- 无 CDN 加速（可后续接入）
- 无跨区域容灾（单点故障风险）

## 存储架构

```
/var/www/deer_link/storage/
├── uploads/                          # 上传文件根目录
│   ├── images/                       # 原图存储
│   │   ├── 2025/                     # 按年份分目录
│   │   │   ├── 01/                   # 按月份分目录
│   │   │   │   ├── 11/               # 按日期分目录
│   │   │   │   │   ├── uuid1.jpg
│   │   │   │   │   ├── uuid2.png
│   │   │   │   │   └── ...
│   │   │   │   └── 12/
│   │   │   └── 02/
│   │   └── 2026/
│   └── thumbnails/                   # 缩略图存储（对应原图路径）
│       ├── 2025/
│       │   ├── 01/
│       │   │   ├── 11/
│       │   │   │   ├── uuid1_thumb.jpg  (200x200)
│       │   │   │   └── uuid2_thumb.png
│       │   │   └── 12/
│       │   └── 02/
│       └── 2026/
└── backups/                          # 数据库备份文件
    ├── daily/
    ├── weekly/
    └── monthly/
```

**访问 URL 格式**:
- 原图: `http://47.107.130.240/storage/images/2025/01/11/uuid1.jpg`
- 缩略图: `http://47.107.130.240/storage/thumbnails/2025/01/11/uuid1_thumb.jpg`

## 存储目录配置

### 1. 创建存储目录

```bash
# 创建主目录结构
sudo mkdir -p /var/www/deer_link/storage/{uploads/images,uploads/thumbnails,backups}

# 创建备份子目录
sudo mkdir -p /var/www/deer_link/storage/backups/{daily,weekly,monthly}

# 设置所有者（www-data 是 Nginx/Apache 默认用户）
sudo chown -R www-data:www-data /var/www/deer_link/storage

# 设置权限
# 755: 所有者读写执行，组和其他用户读执行
sudo chmod -R 755 /var/www/deer_link/storage

# 验证目录创建
ls -la /var/www/deer_link/storage/
```

预期输出:
```
drwxr-xr-x 4 www-data www-data 4096 Jan 11 10:00 uploads
drwxr-xr-x 4 www-data www-data 4096 Jan 11 10:00 backups
```

### 2. 创建年月日目录（示例）

```bash
# 创建当前日期目录（应用会自动创建，这里仅作演示）
CURRENT_YEAR=$(date +%Y)
CURRENT_MONTH=$(date +%m)
CURRENT_DAY=$(date +%d)

sudo mkdir -p /var/www/deer_link/storage/uploads/images/$CURRENT_YEAR/$CURRENT_MONTH/$CURRENT_DAY
sudo mkdir -p /var/www/deer_link/storage/uploads/thumbnails/$CURRENT_YEAR/$CURRENT_MONTH/$CURRENT_DAY

sudo chown -R www-data:www-data /var/www/deer_link/storage/uploads
sudo chmod -R 755 /var/www/deer_link/storage/uploads
```

## Nginx 配置

### 1. 安装 Nginx

```bash
# CentOS
sudo yum install -y nginx

# Ubuntu
sudo apt install -y nginx

# 启动 Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# 查看状态
sudo systemctl status nginx
```

### 2. 配置静态文件服务

创建配置文件:

```bash
sudo vi /etc/nginx/sites-available/deer_link
```

配置内容:

```nginx
# 后端 API 上游服务器
upstream deer_link_backend {
    server 127.0.0.1:8080;
    keepalive 32;
}

server {
    listen 80;
    server_name 47.107.130.240;

    # 日志配置
    access_log /var/log/nginx/deer_link_access.log;
    error_log /var/log/nginx/deer_link_error.log;

    # 限制请求体大小（文件上传限制）
    client_max_body_size 10M;
    client_body_buffer_size 128k;

    # 超时设置
    proxy_connect_timeout 600;
    proxy_send_timeout 600;
    proxy_read_timeout 600;
    send_timeout 600;

    # API 代理
    location /api/ {
        proxy_pass http://deer_link_backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # WebSocket 支持（如果需要）
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }

    # 静态文件服务 - 图片
    location /storage/ {
        alias /var/www/deer_link/storage/uploads/;

        # 缓存控制
        expires 30d;
        add_header Cache-Control "public, immutable";

        # CORS 支持（允许移动应用访问）
        add_header Access-Control-Allow-Origin *;
        add_header Access-Control-Allow-Methods "GET, OPTIONS";

        # 安全头
        add_header X-Content-Type-Options nosniff;

        # 只允许 GET 请求
        limit_except GET {
            deny all;
        }

        # 日志（可选，生产环境可关闭以提高性能）
        access_log off;

        # Gzip 压缩（图片已压缩，无需再压）
        gzip off;

        # 404 错误处理
        try_files $uri =404;
    }

    # 健康检查接口
    location /health {
        proxy_pass http://deer_link_backend/api/health;
        access_log off;
    }

    # 默认路由（API 文档或欢迎页）
    location / {
        return 200 "Deer Link Community API Server";
        add_header Content-Type text/plain;
    }
}

# HTTPS 配置（可选，未来使用 Let's Encrypt）
# server {
#     listen 443 ssl http2;
#     server_name 47.107.130.240;
#
#     ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
#     ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
#
#     # 其他配置同上
# }
```

### 3. 启用配置

```bash
# CentOS (无 sites-available/enabled 目录)
# 直接编辑 /etc/nginx/conf.d/deer_link.conf
sudo cp /etc/nginx/sites-available/deer_link /etc/nginx/conf.d/deer_link.conf

# Ubuntu (使用软链接)
sudo ln -s /etc/nginx/sites-available/deer_link /etc/nginx/sites-enabled/

# 测试配置
sudo nginx -t

# 重新加载配置
sudo systemctl reload nginx
```

### 4. 验证静态文件服务

创建测试图片:

```bash
# 下载测试图片
sudo curl -o /var/www/deer_link/storage/uploads/images/test.jpg https://via.placeholder.com/300

# 设置权限
sudo chown www-data:www-data /var/www/deer_link/storage/uploads/images/test.jpg

# 测试访问
curl -I http://47.107.130.240/storage/images/test.jpg
```

预期输出:
```
HTTP/1.1 200 OK
Server: nginx
Content-Type: image/jpeg
Cache-Control: public, immutable
Expires: ...
```

## 图片处理策略

### 1. 上传流程

```
移动客户端
    ↓ (POST multipart/form-data)
Go 后端 (/api/v1/upload/image)
    ↓
1. 验证文件类型 (jpg, jpeg, png, gif)
2. 验证文件大小 (< 10MB)
3. 生成 UUID 文件名
4. 计算存储路径 (按日期分目录)
    ↓
5. 保存原图到 /uploads/images/YYYY/MM/DD/
6. 生成缩略图 (200x200) 到 /uploads/thumbnails/YYYY/MM/DD/
    ↓
7. 返回 URL
    - 原图: http://47.107.130.240/storage/images/2025/01/11/uuid.jpg
    - 缩略图: http://47.107.130.240/storage/thumbnails/2025/01/11/uuid_thumb.jpg
```

### 2. 图片压缩策略

**原图**:
- 最大宽度: 1920px
- 最大高度: 1080px
- 质量: 85%
- 格式: 保持原格式（JPEG/PNG/GIF）

**缩略图**:
- 尺寸: 200x200px（正方形裁剪）
- 质量: 80%
- 格式: JPEG（统一格式，减小体积）

**实现代码** (Go `internal/services/image.go`):

```go
import "github.com/disintegration/imaging"

// ResizeImage 压缩原图
func ResizeImage(src string, dst string) error {
    img, err := imaging.Open(src)
    if err != nil {
        return err
    }

    // 获取原始尺寸
    bounds := img.Bounds()
    width := bounds.Dx()
    height := bounds.Dy()

    // 如果超过限制，等比例缩放
    if width > 1920 || height > 1080 {
        img = imaging.Fit(img, 1920, 1080, imaging.Lanczos)
    }

    // 保存（JPEG 质量 85）
    return imaging.Save(img, dst, imaging.JPEGQuality(85))
}

// GenerateThumbnail 生成缩略图
func GenerateThumbnail(src string, dst string) error {
    img, err := imaging.Open(src)
    if err != nil {
        return err
    }

    // 裁剪为 200x200 正方形
    img = imaging.Fill(img, 200, 200, imaging.Center, imaging.Lanczos)

    // 保存为 JPEG
    return imaging.Save(img, dst, imaging.JPEGQuality(80))
}
```

## 存储容量管理

### 1. 磁盘空间监控

```bash
# 查看整体磁盘使用
df -h

# 查看存储目录大小
du -sh /var/www/deer_link/storage/*

# 查看图片目录详细占用
du -h --max-depth=3 /var/www/deer_link/storage/uploads/
```

### 2. 存储容量预估

**假设**:
- 平均每张原图: 500KB (压缩后)
- 平均每张缩略图: 20KB
- 平均每篇帖子: 3 张图片
- 每日新增帖子: 100 篇

**每日存储增长**:
```
每日图片数 = 100 帖子 × 3 图片 = 300 张
每日原图存储 = 300 × 500KB = 150MB
每日缩略图存储 = 300 × 20KB = 6MB
每日总增长 = 150MB + 6MB ≈ 156MB
```

**可用时长**:
```
可用存储空间 = 40GB - 10GB (系统+MySQL) = 30GB
可用天数 = 30GB / 156MB ≈ 197 天 (约 6.5 个月)
```

### 3. 清理过期文件（扩容前应急方案）

创建清理脚本 `scripts/cleanup_old_images.sh`:

```bash
#!/bin/bash

# 清理 6 个月前的图片
find /var/www/deer_link/storage/uploads/images/ -type f -mtime +180 -delete
find /var/www/deer_link/storage/uploads/thumbnails/ -type f -mtime +180 -delete

# 清理 30 天前的备份
find /var/www/deer_link/storage/backups/daily/ -type f -mtime +30 -delete

echo "Cleanup completed at $(date)"
```

执行权限和定时任务:

```bash
chmod +x scripts/cleanup_old_images.sh

# 每月 1 号凌晨 3 点执行
crontab -e
# 添加:
0 3 1 * * /path/to/scripts/cleanup_old_images.sh >> /var/log/cleanup.log 2>&1
```

### 4. 磁盘扩容方案

当存储空间不足时:

**方案 1: 扩容云硬盘**
```bash
# 阿里云 ECS 控制台
1. 停止实例
2. 扩容系统盘（40GB → 100GB）
3. 启动实例
4. 扩展文件系统

# Linux 扩展分区
sudo growpart /dev/vda 1
sudo resize2fs /dev/vda1  # ext4 文件系统

# 验证
df -h
```

**方案 2: 挂载数据盘**
```bash
# 购买并挂载云盘（如 100GB 数据盘）
1. 阿里云控制台购买云盘
2. 挂载到实例
3. 格式化并挂载

sudo mkfs.ext4 /dev/vdb
sudo mkdir /mnt/data
sudo mount /dev/vdb /mnt/data

# 迁移数据
sudo rsync -av /var/www/deer_link/storage/ /mnt/data/storage/
sudo mv /var/www/deer_link/storage /var/www/deer_link/storage_old
sudo ln -s /mnt/data/storage /var/www/deer_link/storage

# 添加到 fstab 自动挂载
echo '/dev/vdb /mnt/data ext4 defaults 0 0' | sudo tee -a /etc/fstab
```

## 安全配置

### 1. 文件类型白名单

只允许上传特定类型:

```go
// Go 后端验证
var AllowedMimeTypes = map[string]string{
    "image/jpeg": ".jpg",
    "image/png":  ".png",
    "image/gif":  ".gif",
}

func ValidateFileType(file *multipart.FileHeader) error {
    buffer := make([]byte, 512)
    f, _ := file.Open()
    defer f.Close()

    _, err := f.Read(buffer)
    if err != nil {
        return err
    }

    mimeType := http.DetectContentType(buffer)
    if _, ok := AllowedMimeTypes[mimeType]; !ok {
        return errors.New("invalid file type")
    }

    return nil
}
```

### 2. 文件名随机化

防止路径遍历攻击:

```go
import "github.com/google/uuid"

// 生成安全文件名
func GenerateFileName(originalExt string) string {
    return uuid.New().String() + originalExt
}
```

### 3. 访问控制

Nginx 配置只允许 GET 请求:

```nginx
location /storage/ {
    limit_except GET {
        deny all;
    }
}
```

### 4. 防盗链（可选）

限制只能从特定域名访问:

```nginx
location /storage/ {
    valid_referers none blocked 47.107.130.240 yourdomain.com;
    if ($invalid_referer) {
        return 403;
    }
}
```

## 备份策略

### 1. 文件备份

```bash
# 每周备份图片文件
sudo tar -czf /var/www/deer_link/storage/backups/weekly/images_$(date +%Y%m%d).tar.gz \
    /var/www/deer_link/storage/uploads/images/

# 保留最近 4 周
find /var/www/deer_link/storage/backups/weekly/ -type f -mtime +28 -delete
```

### 2. 数据库备份

参考 `MYSQL_SETUP.md` 中的备份方案。

## 性能优化

### 1. Nginx 缓存配置

```nginx
# 在 http 块添加缓存配置
http {
    proxy_cache_path /var/cache/nginx/deer_link levels=1:2 keys_zone=deer_link_cache:10m max_size=1g inactive=60m use_temp_path=off;
}

# 在 location 块启用缓存
location /storage/ {
    proxy_cache deer_link_cache;
    proxy_cache_valid 200 30d;
    add_header X-Cache-Status $upstream_cache_status;
}
```

### 2. CDN 加速（未来扩展）

当流量增长时，可接入阿里云 CDN:

```
用户请求
    ↓
阿里云 CDN (最近节点)
    ↓ (回源)
Nginx 静态文件服务 (47.107.130.240)
```

## 故障排查

### 问题 1: 图片无法访问

```bash
# 检查文件是否存在
ls -la /var/www/deer_link/storage/uploads/images/2025/01/11/

# 检查权限
ls -la /var/www/deer_link/storage/

# 检查 Nginx 配置
sudo nginx -t

# 查看 Nginx 错误日志
sudo tail -f /var/log/nginx/deer_link_error.log

# 检查 Nginx 用户
ps aux | grep nginx
```

### 问题 2: 上传失败

```bash
# 检查磁盘空间
df -h

# 检查目录权限
ls -la /var/www/deer_link/storage/uploads/

# 检查 Nginx 上传限制
sudo grep client_max_body_size /etc/nginx/nginx.conf

# 查看应用日志
sudo journalctl -u deer_link -n 50
```

### 问题 3: 缩略图未生成

```bash
# 检查 Go 应用是否安装 imaging 库
go list -m github.com/disintegration/imaging

# 检查应用日志
sudo journalctl -u deer_link -f
```

## 相关工具

### 图片处理库（Go）

```bash
# 安装 imaging 库
go get github.com/disintegration/imaging
```

### 图片优化工具

```bash
# 安装 ImageMagick（可选）
sudo yum install -y ImageMagick  # CentOS
sudo apt install -y imagemagick  # Ubuntu

# 批量压缩图片（手动优化）
find /var/www/deer_link/storage/uploads/images/ -name "*.jpg" -exec mogrify -quality 85 {} \;
```

## 进阶优化（未来）

1. **对象存储迁移**: 当流量和存储需求增长后，迁移到阿里云 OSS
2. **CDN 加速**: 接入阿里云 CDN，全国节点加速
3. **图片懒加载**: 移动端实现图片懒加载，减少带宽
4. **WebP 格式**: 支持 WebP 格式，进一步压缩体积

---

**更新时间**: 2025-01-11
**适用版本**: Nginx 1.18+, Go 1.21+
