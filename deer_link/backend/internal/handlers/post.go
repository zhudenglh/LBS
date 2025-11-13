package handlers

import (
	"log"
	"strconv"

	"github.com/deer_link/community/internal/database"
	"github.com/deer_link/community/internal/models"
	"github.com/deer_link/community/pkg/response"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// CreatePostRequest 创建帖子请求
type CreatePostRequest struct {
	Title      string   `json:"title" binding:"required,min=1,max=200"`
	Content    string   `json:"content" binding:"required,min=1"`
	Images     []string `json:"images"`
	Videos     []string `json:"videos"`
	Links      []string `json:"links"`
	BusTag     string   `json:"bus_tag"`
	CommunityID string  `json:"community_id"`
	Flair      string   `json:"flair"`
}

// BatchCreatePostsRequest 批量创建帖子请求
type BatchCreatePostsRequest struct {
	Posts []struct {
		UserID     string   `json:"user_id" binding:"required"`
		Title      string   `json:"title" binding:"required"`
		Content    string   `json:"content" binding:"required"`
		Images     []string `json:"images"`
		Videos     []string `json:"videos"`
		Links      []string `json:"links"`
		BusTag     string   `json:"bus_tag"`
		CommunityID string  `json:"community_id"`
		Flair      string   `json:"flair"`
	} `json:"posts" binding:"required,min=1"`
}

// GetPostsHandler 获取帖子列表
func GetPostsHandler(c *gin.Context) {
	db := database.GetDB()

	// 获取查询参数
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	pageSize, _ := strconv.Atoi(c.DefaultQuery("page_size", "20"))
	communityID := c.Query("community_id")
	sortBy := c.DefaultQuery("sort_by", "created_at") // created_at, likes, comments

	// 分页参数验证
	if page < 1 {
		page = 1
	}
	if pageSize < 1 || pageSize > 100 {
		pageSize = 20
	}
	offset := (page - 1) * pageSize

	// 获取当前用户 ID（用于判断点赞状态）
	currentUserID, _ := c.Get("user_id")

	// 构建查询
	query := db.Model(&models.Post{}).Where("status = ?", 1) // 只查询已发布的帖子

	// 按社区筛选
	if communityID != "" {
		query = query.Where("community_id = ?", communityID)
	}

	// 排序
	switch sortBy {
	case "likes":
		query = query.Order("likes DESC, created_at DESC")
	case "comments":
		query = query.Order("comments DESC, created_at DESC")
	default:
		query = query.Order("created_at DESC")
	}

	// 查询帖子列表
	var posts []models.Post
	if err := query.Limit(pageSize).Offset(offset).Find(&posts).Error; err != nil {
		log.Printf("Failed to get posts: %v", err)
		response.InternalError(c, "Failed to get posts")
		return
	}

	// 查询总数
	var total int64
	countQuery := db.Model(&models.Post{}).Where("status = ?", 1)
	if communityID != "" {
		countQuery = countQuery.Where("community_id = ?", communityID)
	}
	countQuery.Count(&total)

	// 获取帖子作者信息和点赞状态
	postsWithUser := make([]*models.PostWithUser, 0, len(posts))
	for _, post := range posts {
		// 查询用户信息
		var user models.User
		if err := db.Where("user_id = ?", post.UserID).First(&user).Error; err != nil {
			log.Printf("Failed to get user %s: %v", post.UserID, err)
			continue
		}

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

	response.SuccessWithMessage(c, "Posts retrieved successfully", gin.H{
		"posts": postsWithUser,
		"pagination": gin.H{
			"page":       page,
			"page_size":  pageSize,
			"total":      total,
			"total_pages": (total + int64(pageSize) - 1) / int64(pageSize),
		},
	})
}

// CreatePostHandler 创建帖子
func CreatePostHandler(c *gin.Context) {
	var req CreatePostRequest
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

	// 验证用户是否存在
	var user models.User
	if err := db.Where("user_id = ?", userID.(string)).First(&user).Error; err != nil {
		response.BadRequest(c, "User not found")
		return
	}

	// 创建帖子
	postID := uuid.New().String()
	post := models.Post{
		PostID:       postID,
		UserID:       userID.(string),
		Title:        req.Title,
		Content:      req.Content,
		Images:       models.StringArray(req.Images),
		BusTag:       req.BusTag,
		Status:       1, // 1=已发布
		LikeCount:    0,
		CommentCount: 0,
		ShareCount:   0,
		ViewCount:    0,
	}

	if err := db.Create(&post).Error; err != nil {
		log.Printf("Failed to create post: %v", err)
		response.InternalError(c, "Failed to create post")
		return
	}

	response.SuccessWithMessage(c, "Post created successfully", gin.H{
		"post_id":    postID,
		"created_at": post.CreatedAt.Format("2006-01-02T15:04:05Z07:00"),
	})
}

// GetPostHandler 获取单个帖子详情
func GetPostHandler(c *gin.Context) {
	postID := c.Param("postId")
	if postID == "" {
		response.BadRequest(c, "Post ID is required")
		return
	}

	db := database.GetDB()

	// 查询帖子
	var post models.Post
	if err := db.Where("post_id = ? AND status = ?", postID, 1).First(&post).Error; err != nil {
		response.NotFound(c, "Post not found")
		return
	}

	// 查询用户信息
	var user models.User
	if err := db.Where("user_id = ?", post.UserID).First(&user).Error; err != nil {
		log.Printf("Failed to get user %s: %v", post.UserID, err)
		response.InternalError(c, "Failed to get user info")
		return
	}

	// 获取当前用户 ID（用于判断点赞和收藏状态）
	isLiked := false
	isFavorited := false
	currentUserID, exists := c.Get("user_id")
	if exists {
		// 查询是否点赞
		var like models.Like
		err := db.Where("user_id = ? AND target_id = ? AND target_type = ?",
			currentUserID.(string), postID, 1).First(&like).Error
		isLiked = (err == nil)

		// 查询是否收藏
		var favorite models.Favorite
		err = db.Where("user_id = ? AND post_id = ?",
			currentUserID.(string), postID).First(&favorite).Error
		isFavorited = (err == nil)
	}

	postWithUser := post.ToPostWithUser(&user, isLiked, isFavorited)

	// 增加浏览次数
	db.Model(&post).Update("view_count", post.ViewCount+1)

	response.SuccessWithMessage(c, "Post retrieved successfully", gin.H{
		"post": postWithUser,
	})
}

// DeletePostHandler 删除帖子（软删除）
func DeletePostHandler(c *gin.Context) {
	postID := c.Param("postId")
	if postID == "" {
		response.BadRequest(c, "Post ID is required")
		return
	}

	// 从 Context 获取当前用户 ID
	userID, exists := c.Get("user_id")
	if !exists {
		response.Unauthorized(c, "User not authenticated")
		return
	}

	db := database.GetDB()

	// 查询帖子
	var post models.Post
	if err := db.Where("post_id = ?", postID).First(&post).Error; err != nil {
		response.NotFound(c, "Post not found")
		return
	}

	// 验证是否是帖子作者
	if post.UserID != userID.(string) {
		response.Forbidden(c, "You can only delete your own posts")
		return
	}

	// 软删除（设置 status = 3）
	if err := db.Model(&post).Update("status", 3).Error; err != nil {
		log.Printf("Failed to delete post: %v", err)
		response.InternalError(c, "Failed to delete post")
		return
	}

	response.SuccessWithMessage(c, "Post deleted successfully", nil)
}

// BatchCreatePostsHandler 批量创建帖子（用于数据同步）
func BatchCreatePostsHandler(c *gin.Context) {
	var req BatchCreatePostsRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, "Invalid request parameters")
		return
	}

	db := database.GetDB()

	// 验证所有用户是否存在
	userIDSet := make(map[string]bool)
	for _, p := range req.Posts {
		userIDSet[p.UserID] = true
	}

	userIDs := make([]string, 0, len(userIDSet))
	for userID := range userIDSet {
		userIDs = append(userIDs, userID)
	}

	var users []models.User
	if err := db.Where("user_id IN ?", userIDs).Find(&users).Error; err != nil {
		log.Printf("Failed to query users: %v", err)
		response.InternalError(c, "Failed to validate users")
		return
	}

	if len(users) != len(userIDs) {
		response.BadRequest(c, "Some users do not exist")
		return
	}

	// 批量创建帖子
	posts := make([]models.Post, 0, len(req.Posts))
	postIDs := make([]string, 0, len(req.Posts))

	for _, p := range req.Posts {
		postID := uuid.New().String()
		postIDs = append(postIDs, postID)

		post := models.Post{
			PostID:       postID,
			UserID:       p.UserID,
			Title:        p.Title,
			Content:      p.Content,
			Images:       models.StringArray(p.Images),
			BusTag:       p.BusTag,
			Status:       1,
			LikeCount:    0,
			CommentCount: 0,
			ShareCount:   0,
			ViewCount:    0,
		}
		posts = append(posts, post)
	}

	// 批量插入
	if err := db.CreateInBatches(posts, 100).Error; err != nil {
		log.Printf("Failed to batch create posts: %v", err)
		response.InternalError(c, "Failed to create posts")
		return
	}

	response.SuccessWithMessage(c, "Posts created successfully", gin.H{
		"post_ids": postIDs,
		"count":    len(postIDs),
	})
}
