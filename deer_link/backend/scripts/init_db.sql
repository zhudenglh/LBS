-- 小路游社区数据库初始化脚本
-- 创建时间: 2025-01-11
-- 数据库版本: MySQL 8.0+

-- 使用数据库
USE deer_link_community;

-- =====================================
-- 用户表 (users)
-- =====================================
CREATE TABLE IF NOT EXISTS users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '自增ID',
    user_id VARCHAR(32) UNIQUE NOT NULL COMMENT '用户唯一ID (UUID)',
    phone VARCHAR(20) UNIQUE COMMENT '手机号',
    nickname VARCHAR(50) NOT NULL COMMENT '昵称',
    avatar VARCHAR(255) COMMENT '头像URL',
    bio TEXT COMMENT '个人简介',
    gender TINYINT DEFAULT 0 COMMENT '性别: 0-未知, 1-男, 2-女',
    birthday DATE COMMENT '生日',
    location VARCHAR(100) COMMENT '所在地',
    status TINYINT DEFAULT 1 COMMENT '状态: 1-正常, 2-封禁',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_user_id (user_id),
    INDEX idx_phone (phone),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';

-- =====================================
-- 帖子表 (posts)
-- =====================================
CREATE TABLE IF NOT EXISTS posts (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '自增ID',
    post_id VARCHAR(32) UNIQUE NOT NULL COMMENT '帖子唯一ID (UUID)',
    user_id VARCHAR(32) NOT NULL COMMENT '作者用户ID',
    title VARCHAR(200) COMMENT '标题',
    content TEXT NOT NULL COMMENT '内容',
    images JSON COMMENT '图片URL数组 ["url1", "url2", ...]',
    bus_tag VARCHAR(50) COMMENT '公交标签 (如: 33路)',
    location VARCHAR(100) COMMENT '位置',
    like_count INT UNSIGNED DEFAULT 0 COMMENT '点赞数',
    comment_count INT UNSIGNED DEFAULT 0 COMMENT '评论数',
    share_count INT UNSIGNED DEFAULT 0 COMMENT '分享数',
    view_count INT UNSIGNED DEFAULT 0 COMMENT '浏览数',
    status TINYINT DEFAULT 1 COMMENT '状态: 1-正常, 2-隐藏, 3-删除',
    is_top TINYINT DEFAULT 0 COMMENT '是否置顶: 0-否, 1-是',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_post_id (post_id),
    INDEX idx_user_id (user_id),
    INDEX idx_bus_tag (bus_tag),
    INDEX idx_status (status),
    INDEX idx_is_top (is_top),
    INDEX idx_created_at (created_at),
    INDEX idx_like_count (like_count),
    FULLTEXT INDEX ft_content (content) WITH PARSER ngram COMMENT '内容全文索引'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='帖子表';

-- =====================================
-- 点赞表 (likes)
-- =====================================
CREATE TABLE IF NOT EXISTS likes (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '自增ID',
    user_id VARCHAR(32) NOT NULL COMMENT '用户ID',
    target_type TINYINT NOT NULL COMMENT '目标类型: 1-帖子, 2-评论',
    target_id VARCHAR(32) NOT NULL COMMENT '目标ID (帖子ID或评论ID)',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    UNIQUE KEY uk_user_target (user_id, target_type, target_id) COMMENT '用户+目标唯一索引',
    INDEX idx_target (target_type, target_id),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='点赞表';

-- =====================================
-- 评论表 (comments)
-- =====================================
CREATE TABLE IF NOT EXISTS comments (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '自增ID',
    comment_id VARCHAR(32) UNIQUE NOT NULL COMMENT '评论唯一ID (UUID)',
    post_id VARCHAR(32) NOT NULL COMMENT '帖子ID',
    user_id VARCHAR(32) NOT NULL COMMENT '评论者用户ID',
    parent_id VARCHAR(32) DEFAULT NULL COMMENT '父评论ID (NULL表示一级评论)',
    reply_to_user_id VARCHAR(32) DEFAULT NULL COMMENT '回复目标用户ID',
    content TEXT NOT NULL COMMENT '评论内容',
    like_count INT UNSIGNED DEFAULT 0 COMMENT '点赞数',
    reply_count INT UNSIGNED DEFAULT 0 COMMENT '回复数',
    status TINYINT DEFAULT 1 COMMENT '状态: 1-正常, 2-隐藏, 3-删除',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_comment_id (comment_id),
    INDEX idx_post_id (post_id),
    INDEX idx_user_id (user_id),
    INDEX idx_parent_id (parent_id),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='评论表';

-- =====================================
-- 收藏表 (favorites)
-- =====================================
CREATE TABLE IF NOT EXISTS favorites (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '自增ID',
    user_id VARCHAR(32) NOT NULL COMMENT '用户ID',
    post_id VARCHAR(32) NOT NULL COMMENT '帖子ID',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    UNIQUE KEY uk_user_post (user_id, post_id) COMMENT '用户+帖子唯一索引',
    INDEX idx_user_id (user_id),
    INDEX idx_post_id (post_id),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='收藏表';

-- =====================================
-- 关注表 (follows)
-- =====================================
CREATE TABLE IF NOT EXISTS follows (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '自增ID',
    follower_id VARCHAR(32) NOT NULL COMMENT '关注者用户ID',
    followee_id VARCHAR(32) NOT NULL COMMENT '被关注者用户ID',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    UNIQUE KEY uk_follower_followee (follower_id, followee_id) COMMENT '关注关系唯一索引',
    INDEX idx_follower_id (follower_id),
    INDEX idx_followee_id (followee_id),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='关注表';

-- =====================================
-- 图片表 (images)
-- =====================================
CREATE TABLE IF NOT EXISTS images (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '自增ID',
    image_id VARCHAR(32) UNIQUE NOT NULL COMMENT '图片唯一ID (UUID)',
    user_id VARCHAR(32) NOT NULL COMMENT '上传用户ID',
    original_url VARCHAR(255) NOT NULL COMMENT '原图URL',
    thumbnail_url VARCHAR(255) COMMENT '缩略图URL',
    filename VARCHAR(255) NOT NULL COMMENT '文件名',
    file_size INT UNSIGNED NOT NULL COMMENT '文件大小 (字节)',
    mime_type VARCHAR(50) NOT NULL COMMENT 'MIME类型',
    width INT UNSIGNED COMMENT '图片宽度',
    height INT UNSIGNED COMMENT '图片高度',
    status TINYINT DEFAULT 1 COMMENT '状态: 1-正常, 2-删除',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    INDEX idx_image_id (image_id),
    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='图片表';

-- =====================================
-- AI对话历史表 (ai_chat_history)
-- =====================================
CREATE TABLE IF NOT EXISTS ai_chat_history (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '自增ID',
    chat_id VARCHAR(32) UNIQUE NOT NULL COMMENT '对话唯一ID (UUID)',
    user_id VARCHAR(32) NOT NULL COMMENT '用户ID',
    role VARCHAR(20) NOT NULL COMMENT '角色: user, assistant',
    content TEXT NOT NULL COMMENT '对话内容',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    INDEX idx_chat_id (chat_id),
    INDEX idx_user_id (user_id),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='AI对话历史表';

-- =====================================
-- 插入测试数据 (可选)
-- =====================================

-- 测试用户
INSERT INTO users (user_id, phone, nickname, avatar, bio, gender, location) VALUES
('test_user_001', '13800138000', '小路游体验用户', 'http://47.107.130.240/storage/images/default_avatar.jpg', '这是一个测试用户', 1, '南京市'),
('test_user_002', '13900139000', '公交达人', 'http://47.107.130.240/storage/images/default_avatar.jpg', '爱坐公交，爱生活', 2, '南京市');

-- 测试帖子
INSERT INTO posts (post_id, user_id, title, content, images, bus_tag, location, like_count, comment_count, view_count) VALUES
('test_post_001', 'test_user_001', '33路公交今天很准时', '今天坐33路去上班，车来得很准时，司机师傅态度也很好！点赞！', '["http://47.107.130.240/storage/images/test1.jpg"]', '33路', '东浦路', 5, 2, 120),
('test_post_002', 'test_user_002', '新开通的地铁站好方便', '新开的地铁站就在家门口，以后上班不用挤公交了，太方便了！', '["http://47.107.130.240/storage/images/test2.jpg","http://47.107.130.240/storage/images/test3.jpg"]', NULL, '南坪东路', 12, 5, 350);

-- =====================================
-- 查看表结构
-- =====================================

SHOW TABLES;

SELECT
    TABLE_NAME AS '表名',
    TABLE_COMMENT AS '表注释',
    TABLE_ROWS AS '行数',
    DATA_LENGTH / 1024 / 1024 AS '数据大小(MB)',
    INDEX_LENGTH / 1024 / 1024 AS '索引大小(MB)'
FROM information_schema.TABLES
WHERE TABLE_SCHEMA = 'deer_link_community'
ORDER BY TABLE_NAME;

-- 初始化完成提示
SELECT 'Database initialized successfully!' AS '状态';
