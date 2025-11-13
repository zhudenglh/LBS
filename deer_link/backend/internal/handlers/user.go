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

// UpdateUserInfoRequest 更新用户信息请求
type UpdateUserInfoRequest struct {
	Nickname string `json:"nickname" binding:"omitempty,min=2,max=50"`
	Avatar   string `json:"avatar" binding:"omitempty,url"`
	Bio      string `json:"bio" binding:"omitempty,max=200"`
}

// BatchCreateUsersRequest 批量创建用户请求
type BatchCreateUsersRequest struct {
	Users []struct {
		Phone    string `json:"phone" binding:"required,min=11,max=11"`
		Nickname string `json:"nickname" binding:"required,min=2,max=50"`
		Password string `json:"password" binding:"required,min=6,max=50"`
		Avatar   string `json:"avatar"`
	} `json:"users" binding:"required,min=1"`
}

// GetUserInfoHandler 获取用户信息
func GetUserInfoHandler(c *gin.Context) {
	userID := c.Param("userId")
	if userID == "" {
		response.BadRequest(c, "User ID is required")
		return
	}

	db := database.GetDB()

	// 查询用户
	var user models.User
	if err := db.Where("user_id = ?", userID).First(&user).Error; err != nil {
		response.NotFound(c, "User not found")
		return
	}

	// 返回公开信息（不包含密码、手机号等敏感信息）
	response.SuccessWithMessage(c, "User info retrieved successfully", gin.H{
		"user": user.ToPublicInfo(),
	})
}

// GetCurrentUserInfoHandler 获取当前登录用户信息
func GetCurrentUserInfoHandler(c *gin.Context) {
	// 从 Context 获取当前用户 ID
	userID, exists := c.Get("user_id")
	if !exists {
		response.Unauthorized(c, "User not authenticated")
		return
	}

	db := database.GetDB()

	// 查询用户
	var user models.User
	if err := db.Where("user_id = ?", userID.(string)).First(&user).Error; err != nil {
		response.NotFound(c, "User not found")
		return
	}

	// 返回完整信息（包含手机号）
	response.SuccessWithMessage(c, "User info retrieved successfully", gin.H{
		"user_id":    user.UserID,
		"phone":      user.Phone,
		"nickname":   user.Nickname,
		"avatar":     user.Avatar,
		"bio":        user.Bio,
		"status":     user.Status,
		"created_at": user.CreatedAt.Format("2006-01-02T15:04:05Z07:00"),
	})
}

// UpdateUserInfoHandler 更新用户信息
func UpdateUserInfoHandler(c *gin.Context) {
	var req UpdateUserInfoRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, "Invalid request parameters")
		return
	}

	// 从 Context 获取当前用户 ID
	userID, exists := c.Get("user_id")
	if !exists {
		response.Unauthorized(c, "User not authenticated")
		return
	}

	db := database.GetDB()

	// 查询用户
	var user models.User
	if err := db.Where("user_id = ?", userID.(string)).First(&user).Error; err != nil {
		response.NotFound(c, "User not found")
		return
	}

	// 更新字段
	updates := make(map[string]interface{})
	if req.Nickname != "" {
		updates["nickname"] = req.Nickname
	}
	if req.Avatar != "" {
		updates["avatar"] = req.Avatar
	}
	if req.Bio != "" {
		updates["bio"] = req.Bio
	}

	if len(updates) == 0 {
		response.BadRequest(c, "No fields to update")
		return
	}

	// 更新数据库
	if err := db.Model(&user).Updates(updates).Error; err != nil {
		log.Printf("Failed to update user info: %v", err)
		response.InternalError(c, "Failed to update user info")
		return
	}

	// 重新查询用户信息
	db.Where("user_id = ?", userID.(string)).First(&user)

	response.SuccessWithMessage(c, "User info updated successfully", gin.H{
		"user": user.ToPublicInfo(),
	})
}

// GetUserPostsHandler 获取用户发布的帖子
func GetUserPostsHandler(c *gin.Context) {
	userID := c.Param("userId")
	if userID == "" {
		response.BadRequest(c, "User ID is required")
		return
	}

	db := database.GetDB()

	// 验证用户是否存在
	var user models.User
	if err := db.Where("user_id = ?", userID).First(&user).Error; err != nil {
		response.NotFound(c, "User not found")
		return
	}

	// 查询用户的帖子
	var posts []models.Post
	if err := db.Where("user_id = ? AND status = ?", userID, 1).
		Order("created_at DESC").Find(&posts).Error; err != nil {
		log.Printf("Failed to get user posts: %v", err)
		response.InternalError(c, "Failed to get user posts")
		return
	}

	// 获取当前用户 ID（用于判断点赞状态）
	currentUserID, _ := c.Get("user_id")

	// 转换为 PostWithUser 格式
	postsWithUser := make([]*models.PostWithUser, 0, len(posts))
	for _, post := range posts {
		// 查询当前用户是否点赞和收藏
		isLiked := false
		isFavorited := false
		if currentUserID != nil {
			var like models.Like
			err := db.Where("user_id = ? AND target_id = ? AND target_type = ?",
				currentUserID.(string), post.PostID, 1).First(&like).Error
			isLiked = (err == nil)

			var favorite models.Favorite
			err = db.Where("user_id = ? AND post_id = ?",
				currentUserID.(string), post.PostID).First(&favorite).Error
			isFavorited = (err == nil)
		}

		postWithUser := post.ToPostWithUser(&user, isLiked, isFavorited)
		postsWithUser = append(postsWithUser, postWithUser)
	}

	response.SuccessWithMessage(c, "User posts retrieved successfully", gin.H{
		"posts": postsWithUser,
		"total": len(postsWithUser),
	})
}

// BatchCreateUsersHandler 批量创建用户（用于数据同步）
func BatchCreateUsersHandler(c *gin.Context) {
	var req BatchCreateUsersRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, "Invalid request parameters")
		return
	}

	db := database.GetDB()

	// 检查手机号是否重复
	phones := make([]string, 0, len(req.Users))
	for _, u := range req.Users {
		phones = append(phones, u.Phone)
	}

	var existingUsers []models.User
	db.Where("phone IN ?", phones).Find(&existingUsers)

	if len(existingUsers) > 0 {
		// 提取已存在的手机号
		existingPhones := make([]string, 0)
		for _, u := range existingUsers {
			existingPhones = append(existingPhones, u.Phone)
		}
		response.BadRequest(c, "Some phone numbers already exist")
		return
	}

	// 批量创建用户
	users := make([]models.User, 0, len(req.Users))
	userIDs := make([]string, 0, len(req.Users))

	for _, u := range req.Users {
		// 加密密码
		hashedPassword, err := utils.HashPassword(u.Password)
		if err != nil {
			log.Printf("Failed to hash password: %v", err)
			response.InternalError(c, "Failed to hash password")
			return
		}

		userID := uuid.New().String()
		userIDs = append(userIDs, userID)

		avatar := u.Avatar
		if avatar == "" {
			avatar = "http://47.107.130.240/storage/images/default_avatar.jpg"
		}

		user := models.User{
			UserID:   userID,
			Phone:    u.Phone,
			Nickname: u.Nickname,
			Password: hashedPassword,
			Avatar:   avatar,
			Status:   1,
		}
		users = append(users, user)
	}

	// 批量插入
	if err := db.CreateInBatches(users, 100).Error; err != nil {
		log.Printf("Failed to batch create users: %v", err)
		response.InternalError(c, "Failed to create users")
		return
	}

	response.SuccessWithMessage(c, "Users created successfully", gin.H{
		"user_ids": userIDs,
		"count":    len(userIDs),
	})
}
