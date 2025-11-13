package handlers

import (
	"log"

	"github.com/deer_link/community/internal/database"
	"github.com/deer_link/community/internal/models"
	"github.com/deer_link/community/pkg/response"
	"github.com/deer_link/community/pkg/utils"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// RegisterRequest 注册请求
type RegisterRequest struct {
	Phone    string `json:"phone" binding:"required,min=11,max=11"`
	Nickname string `json:"nickname" binding:"required,min=2,max=50"`
	Password string `json:"password" binding:"required,min=6,max=50"`
}

// LoginRequest 登录请求
type LoginRequest struct {
	Phone    string `json:"phone" binding:"required"`
	Password string `json:"password" binding:"required"`
}

// RegisterHandler 用户注册
func RegisterHandler(c *gin.Context) {
	var req RegisterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, "Invalid request parameters")
		return
	}

	db := database.GetDB()

	// 检查手机号是否已注册
	var existingUser models.User
	if err := db.Where("phone = ?", req.Phone).First(&existingUser).Error; err == nil {
		response.BadRequest(c, "Phone number already registered")
		return
	}

	// 加密密码
	hashedPassword, err := utils.HashPassword(req.Password)
	if err != nil {
		log.Printf("Failed to hash password: %v", err)
		response.InternalError(c, "Failed to register user")
		return
	}

	// 创建用户
	userID := uuid.New().String()
	user := models.User{
		UserID:   userID,
		Phone:    req.Phone,
		Nickname: req.Nickname,
		Password: hashedPassword,
		Avatar:   "http://47.107.130.240/storage/images/default_avatar.jpg", // 默认头像
		Status:   1,
	}

	if err := db.Create(&user).Error; err != nil {
		log.Printf("Failed to create user: %v", err)
		response.InternalError(c, "Failed to register user")
		return
	}

	// 生成 JWT Token
	token, expiresAt, err := utils.GenerateToken(userID, req.Nickname, 168) // 7天有效期
	if err != nil {
		log.Printf("Failed to generate token: %v", err)
		response.InternalError(c, "Failed to generate token")
		return
	}

	response.SuccessWithMessage(c, "Registration successful", gin.H{
		"user_id":    userID,
		"token":      token,
		"expires_at": expiresAt.Format("2006-01-02T15:04:05Z07:00"),
	})
}

// LoginHandler 用户登录
func LoginHandler(c *gin.Context) {
	var req LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, "Invalid request parameters")
		return
	}

	db := database.GetDB()

	// 查询用户
	var user models.User
	if err := db.Where("phone = ?", req.Phone).First(&user).Error; err != nil {
		response.BadRequest(c, "Invalid phone number or password")
		return
	}

	// 验证密码
	if !utils.CheckPassword(req.Password, user.Password) {
		response.BadRequest(c, "Invalid phone number or password")
		return
	}

	// 检查用户状态
	if user.Status != 1 {
		response.Forbidden(c, "User account is disabled")
		return
	}

	// 生成 JWT Token
	token, expiresAt, err := utils.GenerateToken(user.UserID, user.Nickname, 168) // 7天有效期
	if err != nil {
		log.Printf("Failed to generate token: %v", err)
		response.InternalError(c, "Failed to generate token")
		return
	}

	response.SuccessWithMessage(c, "Login successful", gin.H{
		"user_id":    user.UserID,
		"nickname":   user.Nickname,
		"avatar":     user.Avatar,
		"token":      token,
		"expires_at": expiresAt.Format("2006-01-02T15:04:05Z07:00"),
	})
}

// RefreshTokenHandler 刷新 Token
func RefreshTokenHandler(c *gin.Context) {
	// 从 Context 获取当前用户信息（由中间件注入）
	userID, exists := c.Get("user_id")
	if !exists {
		response.Unauthorized(c, "User not authenticated")
		return
	}

	nickname, _ := c.Get("nickname")

	// 生成新 Token
	token, expiresAt, err := utils.GenerateToken(userID.(string), nickname.(string), 168)
	if err != nil {
		log.Printf("Failed to generate token: %v", err)
		response.InternalError(c, "Failed to refresh token")
		return
	}

	response.SuccessWithMessage(c, "Token refreshed successfully", gin.H{
		"token":      token,
		"expires_at": expiresAt.Format("2006-01-02T15:04:05Z07:00"),
	})
}
