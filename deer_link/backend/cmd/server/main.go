package main

import (
	"fmt"
	"log"
	"os"
	"os/signal"
	"strconv"
	"syscall"
	"time"

	"github.com/deer_link/community/internal/database"
	"github.com/deer_link/community/internal/handlers"
	"github.com/deer_link/community/internal/middleware"
	"github.com/deer_link/community/internal/models"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

// 版本信息（构建时注入）
var (
	Version   = "1.0.0"
	BuildTime = "unknown"
)

func main() {
	// 加载 .env 文件
	if err := godotenv.Load(); err != nil {
		log.Printf("[WARN] No .env file found, using environment variables")
	}

	// 打印版本信息
	fmt.Printf("Deer Link Community Backend Server\n")
	fmt.Printf("Version: %s\n", Version)
	fmt.Printf("Build Time: %s\n", BuildTime)
	fmt.Println("========================================")

	// 初始化数据库
	if err := initDatabase(); err != nil {
		log.Fatalf("Failed to initialize database: %v", err)
	}

	// 设置 Gin 模式
	gin.SetMode(gin.ReleaseMode)

	// 创建路由
	router := gin.New()
	router.Use(gin.Logger())
	router.Use(gin.Recovery())

	// 配置 CORS
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

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

// initDatabase 初始化数据库连接
func initDatabase() error {
	fmt.Println("[INFO] Initializing database connection...")

	// 从环境变量读取数据库配置
	dbHost := getEnv("DB_HOST", "127.0.0.1")
	dbPort, _ := strconv.Atoi(getEnv("DB_PORT", "3306"))
	dbUser := getEnv("DB_USER", "deer_link_user")
	dbPassword := getEnv("DB_PASSWORD", "")
	dbName := getEnv("DB_NAME", "deer_link_community")

	if dbPassword == "" {
		return fmt.Errorf("DB_PASSWORD environment variable is required")
	}

	// 数据库配置
	config := &database.Config{
		Host:         dbHost,
		Port:         dbPort,
		User:         dbUser,
		Password:     dbPassword,
		DBName:       dbName,
		Charset:      "utf8mb4",
		MaxIdleConns: 10,
		MaxOpenConns: 100,
	}

	// 连接数据库
	if err := database.InitMySQL(config); err != nil {
		return fmt.Errorf("failed to connect to database: %v", err)
	}

	// 自动迁移数据库表
	db := database.GetDB()
	fmt.Println("[INFO] Running database migrations...")

	if err := db.AutoMigrate(
		&models.User{},
		&models.Post{},
		&models.Comment{},
		&models.Like{},
		&models.Favorite{},
		&models.Image{},
	); err != nil {
		return fmt.Errorf("failed to migrate database: %v", err)
	}

	fmt.Println("[INFO] Database initialized successfully")
	return nil
}

// registerRoutes 注册所有路由
func registerRoutes(router *gin.Engine) {
	// API v1 路由组
	v1 := router.Group("/api/v1")
	{
		// 健康检查
		v1.GET("/health", healthCheck)

		// ===== 认证路由（公开）=====
		auth := v1.Group("/auth")
		{
			auth.POST("/register", handlers.RegisterHandler)
			auth.POST("/login", handlers.LoginHandler)
			auth.POST("/refresh", middleware.AuthRequired(), handlers.RefreshTokenHandler)
		}

		// ===== 用户路由 =====
		users := v1.Group("/users")
		{
			// 公开路由
			users.GET("/:userId", handlers.GetUserInfoHandler)
			users.GET("/:userId/posts", middleware.OptionalAuth(), handlers.GetUserPostsHandler)

			// 需要认证的路由
			users.PUT("/me", middleware.AuthRequired(), handlers.UpdateUserInfoHandler)
			users.GET("/me", middleware.AuthRequired(), handlers.GetCurrentUserInfoHandler)

			// 批量创建（数据同步用）
			users.POST("/batch", handlers.BatchCreateUsersHandler)
		}

		// ===== 帖子路由 =====
		posts := v1.Group("/posts")
		{
			// 公开路由（可选认证，用于判断点赞状态）
			posts.GET("", middleware.OptionalAuth(), handlers.GetPostsHandler)
			posts.GET("/:postId", middleware.OptionalAuth(), handlers.GetPostHandler)

			// 需要认证的路由
			posts.POST("", middleware.AuthRequired(), handlers.CreatePostHandler)
			posts.DELETE("/:postId", middleware.AuthRequired(), handlers.DeletePostHandler)

			// 点赞/收藏
			posts.POST("/:postId/like", middleware.AuthRequired(), handlers.LikePostHandler)
			posts.DELETE("/:postId/like", middleware.AuthRequired(), handlers.UnlikePostHandler)
			posts.POST("/:postId/favorite", middleware.AuthRequired(), handlers.FavoritePostHandler)
			posts.DELETE("/:postId/favorite", middleware.AuthRequired(), handlers.UnfavoritePostHandler)

			// 评论
			posts.GET("/:postId/comments", middleware.OptionalAuth(), handlers.GetCommentsHandler)
			posts.POST("/:postId/comments", middleware.AuthRequired(), handlers.CreateCommentHandler)

			// 批量创建（数据同步用）
			posts.POST("/batch", handlers.BatchCreatePostsHandler)
		}

		// ===== 评论路由 =====
		comments := v1.Group("/comments")
		{
			comments.DELETE("/:commentId", middleware.AuthRequired(), handlers.DeleteCommentHandler)
			comments.POST("/:commentId/like", middleware.AuthRequired(), handlers.LikeCommentHandler)
			comments.DELETE("/:commentId/like", middleware.AuthRequired(), handlers.UnlikeCommentHandler)
		}

		// ===== 文件上传路由 =====
		upload := v1.Group("/upload")
		{
			upload.POST("/image", middleware.AuthRequired(), handlers.UploadImageHandler)
			upload.POST("/images", middleware.AuthRequired(), handlers.UploadMultipleImagesHandler)
		}

		// ===== 图片管理路由 =====
		images := v1.Group("/images")
		{
			images.GET("/:imageId", handlers.DownloadImageHandler)
			images.DELETE("/:imageId", middleware.AuthRequired(), handlers.DeleteImageHandler)
		}
	}

	fmt.Println("[INFO] Routes registered successfully")
}

// healthCheck 健康检查
func healthCheck(c *gin.Context) {
	// 检查数据库连接
	db := database.GetDB()
	sqlDB, err := db.DB()
	if err != nil {
		c.JSON(503, gin.H{
			"status":    "unhealthy",
			"error":     "database connection error",
			"timestamp": time.Now().Format(time.RFC3339),
			"version":   Version,
		})
		return
	}

	if err := sqlDB.Ping(); err != nil {
		c.JSON(503, gin.H{
			"status":    "unhealthy",
			"error":     "database ping failed",
			"timestamp": time.Now().Format(time.RFC3339),
			"version":   Version,
		})
		return
	}

	c.JSON(200, gin.H{
		"status":    "healthy",
		"timestamp": time.Now().Format(time.RFC3339),
		"version":   Version,
		"database":  "connected",
	})
}

// getEnv 获取环境变量，如果不存在则返回默认值
func getEnv(key, defaultValue string) string {
	value := os.Getenv(key)
	if value == "" {
		return defaultValue
	}
	return value
}
