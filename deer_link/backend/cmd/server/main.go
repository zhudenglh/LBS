package main

import (
	"fmt"
	"log"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/gin-gonic/gin"
)

// 版本信息（构建时注入）
var (
	Version   = "1.0.0"
	BuildTime = "unknown"
)

func main() {
	// 打印版本信息
	fmt.Printf("Deer Link Community Backend Server\n")
	fmt.Printf("Version: %s\n", Version)
	fmt.Printf("Build Time: %s\n", BuildTime)
	fmt.Println("========================================")

	// 设置 Gin 模式
	gin.SetMode(gin.ReleaseMode)

	// 创建路由
	router := gin.New()
	router.Use(gin.Logger())
	router.Use(gin.Recovery())

	// 注册路由
	registerRoutes(router)

	// 启动服务器
	port := ":8080"
	fmt.Printf("[INFO] Server starting on %s\n", port)

	// 优雅关闭
	go func() {
		if err := router.Run(port); err != nil {
			log.Fatalf("Failed to start server: %v", err)
		}
	}()

	// 等待中断信号
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	fmt.Println("\n[INFO] Shutting down server...")
	time.Sleep(1 * time.Second)
	fmt.Println("[INFO] Server stopped")
}

// registerRoutes 注册所有路由
func registerRoutes(router *gin.Engine) {
	// API v1 路由组
	v1 := router.Group("/api/v1")
	{
		// 健康检查
		v1.GET("/health", healthCheck)

		// 认证路由
		auth := v1.Group("/auth")
		{
			auth.POST("/register", registerHandler)
			auth.POST("/login", loginHandler)
			auth.POST("/refresh", refreshTokenHandler)
		}

		// 用户路由
		users := v1.Group("/users")
		{
			users.GET("/:userId", getUserHandler)
			users.PUT("/:userId", updateUserHandler)
			users.GET("/:userId/posts", getUserPostsHandler)
		}

		// 帖子路由
		posts := v1.Group("/posts")
		{
			posts.GET("", getPostsHandler)
			posts.POST("", createPostHandler)
			posts.GET("/:postId", getPostHandler)
			posts.DELETE("/:postId", deletePostHandler)

			// 帖子互动
			posts.POST("/:postId/like", likePostHandler)
			posts.DELETE("/:postId/like", unlikePostHandler)
			posts.POST("/:postId/favorite", favoritePostHandler)
			posts.DELETE("/:postId/favorite", unfavoritePostHandler)

			// 评论
			posts.GET("/:postId/comments", getCommentsHandler)
			posts.POST("/:postId/comments", createCommentHandler)
		}

		// 评论路由
		comments := v1.Group("/comments")
		{
			comments.DELETE("/:commentId", deleteCommentHandler)
		}

		// 文件上传路由
		upload := v1.Group("/upload")
		{
			upload.POST("/image", uploadImageHandler)
			upload.POST("/images", uploadImagesHandler)
		}

		// AI 聊天路由
		ai := v1.Group("/ai")
		{
			ai.POST("/chat", aiChatHandler)
			ai.GET("/chat/history", aiChatHistoryHandler)
		}
	}

	fmt.Println("[INFO] Routes registered successfully")
}

// ============================================
// Handler 函数（示例实现）
// 实际开发中，这些函数应该在各自的 handler 文件中实现
// ============================================

// healthCheck 健康检查
func healthCheck(c *gin.Context) {
	c.JSON(200, gin.H{
		"status":    "healthy",
		"timestamp": time.Now().Format(time.RFC3339),
		"version":   Version,
	})
}

// registerHandler 用户注册
func registerHandler(c *gin.Context) {
	// TODO: 实现用户注册逻辑
	// 1. 验证请求参数
	// 2. 检查手机号是否已注册
	// 3. 加密密码
	// 4. 创建用户记录
	// 5. 生成 JWT Token
	// 6. 返回响应

	c.JSON(200, gin.H{
		"code":    200,
		"message": "注册成功（示例响应）",
		"data": gin.H{
			"user_id": "uuid-user-id",
			"token":   "sample-jwt-token",
		},
	})
}

// loginHandler 用户登录
func loginHandler(c *gin.Context) {
	// TODO: 实现用户登录逻辑
	c.JSON(200, gin.H{
		"code":    200,
		"message": "登录成功（示例响应）",
		"data": gin.H{
			"user_id":  "uuid-user-id",
			"nickname": "测试用户",
			"token":    "sample-jwt-token",
		},
	})
}

// refreshTokenHandler 刷新 Token
func refreshTokenHandler(c *gin.Context) {
	c.JSON(200, gin.H{
		"code":    200,
		"message": "Token 刷新成功",
		"data": gin.H{
			"token": "new-jwt-token",
		},
	})
}

// getUserHandler 获取用户信息
func getUserHandler(c *gin.Context) {
	userId := c.Param("userId")
	c.JSON(200, gin.H{
		"code":    200,
		"message": "success",
		"data": gin.H{
			"user_id":  userId,
			"nickname": "示例用户",
			"avatar":   "http://47.107.130.240/storage/images/default_avatar.jpg",
		},
	})
}

// updateUserHandler 更新用户信息
func updateUserHandler(c *gin.Context) {
	c.JSON(200, gin.H{
		"code":    200,
		"message": "更新成功",
		"data":    nil,
	})
}

// getUserPostsHandler 获取用户帖子列表
func getUserPostsHandler(c *gin.Context) {
	c.JSON(200, gin.H{
		"code":    200,
		"message": "success",
		"data": gin.H{
			"posts": []gin.H{},
			"pagination": gin.H{
				"page":      1,
				"page_size": 20,
				"total":     0,
			},
		},
	})
}

// getPostsHandler 获取帖子列表
func getPostsHandler(c *gin.Context) {
	c.JSON(200, gin.H{
		"code":    200,
		"message": "success",
		"data": gin.H{
			"posts": []gin.H{
				{
					"post_id":  "test-post-1",
					"title":    "33路公交今天很准时",
					"content":  "今天坐33路去上班...",
					"bus_tag":  "33路",
					"images":   []string{},
					"user_id":  "test-user-1",
					"nickname": "测试用户",
				},
			},
			"pagination": gin.H{
				"page":      1,
				"page_size": 20,
				"total":     1,
			},
		},
	})
}

// createPostHandler 创建帖子
func createPostHandler(c *gin.Context) {
	c.JSON(200, gin.H{
		"code":    200,
		"message": "发布成功",
		"data": gin.H{
			"post_id": "new-post-id",
		},
	})
}

// getPostHandler 获取帖子详情
func getPostHandler(c *gin.Context) {
	postId := c.Param("postId")
	c.JSON(200, gin.H{
		"code":    200,
		"message": "success",
		"data": gin.H{
			"post_id": postId,
			"title":   "示例帖子",
			"content": "这是一条示例帖子内容",
		},
	})
}

// deletePostHandler 删除帖子
func deletePostHandler(c *gin.Context) {
	c.JSON(200, gin.H{
		"code":    200,
		"message": "删除成功",
		"data":    nil,
	})
}

// likePostHandler 点赞帖子
func likePostHandler(c *gin.Context) {
	c.JSON(200, gin.H{
		"code":    200,
		"message": "点赞成功",
		"data": gin.H{
			"like_count": 10,
		},
	})
}

// unlikePostHandler 取消点赞
func unlikePostHandler(c *gin.Context) {
	c.JSON(200, gin.H{
		"code":    200,
		"message": "取消点赞成功",
		"data": gin.H{
			"like_count": 9,
		},
	})
}

// favoritePostHandler 收藏帖子
func favoritePostHandler(c *gin.Context) {
	c.JSON(200, gin.H{
		"code":    200,
		"message": "收藏成功",
		"data":    nil,
	})
}

// unfavoritePostHandler 取消收藏
func unfavoritePostHandler(c *gin.Context) {
	c.JSON(200, gin.H{
		"code":    200,
		"message": "取消收藏成功",
		"data":    nil,
	})
}

// getCommentsHandler 获取评论列表
func getCommentsHandler(c *gin.Context) {
	c.JSON(200, gin.H{
		"code":    200,
		"message": "success",
		"data": gin.H{
			"comments":   []gin.H{},
			"pagination": gin.H{"page": 1, "page_size": 20, "total": 0},
		},
	})
}

// createCommentHandler 创建评论
func createCommentHandler(c *gin.Context) {
	c.JSON(200, gin.H{
		"code":    200,
		"message": "评论成功",
		"data": gin.H{
			"comment_id": "new-comment-id",
		},
	})
}

// deleteCommentHandler 删除评论
func deleteCommentHandler(c *gin.Context) {
	c.JSON(200, gin.H{
		"code":    200,
		"message": "删除成功",
		"data":    nil,
	})
}

// uploadImageHandler 上传单张图片
func uploadImageHandler(c *gin.Context) {
	// TODO: 实现图片上传逻辑
	// 1. 接收 multipart/form-data
	// 2. 验证文件类型和大小
	// 3. 生成 UUID 文件名
	// 4. 保存原图
	// 5. 生成缩略图
	// 6. 返回 URL

	c.JSON(200, gin.H{
		"code":    200,
		"message": "上传成功",
		"data": gin.H{
			"image_id":      "new-image-id",
			"original_url":  "http://47.107.130.240/storage/images/2025/01/11/sample.jpg",
			"thumbnail_url": "http://47.107.130.240/storage/thumbnails/2025/01/11/sample_thumb.jpg",
		},
	})
}

// uploadImagesHandler 上传多张图片
func uploadImagesHandler(c *gin.Context) {
	c.JSON(200, gin.H{
		"code":    200,
		"message": "上传成功",
		"data": gin.H{
			"images": []gin.H{},
		},
	})
}

// aiChatHandler AI 聊天
func aiChatHandler(c *gin.Context) {
	c.JSON(200, gin.H{
		"code":    200,
		"message": "success",
		"data": gin.H{
			"chat_id": "sample-chat-id",
			"reply":   "这是 AI 助手的示例回复",
		},
	})
}

// aiChatHistoryHandler 获取聊天历史
func aiChatHistoryHandler(c *gin.Context) {
	c.JSON(200, gin.H{
		"code":    200,
		"message": "success",
		"data": gin.H{
			"chat_id":  "sample-chat-id",
			"messages": []gin.H{},
		},
	})
}
