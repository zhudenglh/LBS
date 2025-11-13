package handlers

import (
	"log"

	"github.com/deer_link/community/internal/database"
	"github.com/deer_link/community/internal/models"
	"github.com/deer_link/community/pkg/response"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

// CreateCommentRequest 创建评论请求
type CreateCommentRequest struct {
	Content       string  `json:"content" binding:"required,min=1,max=1000"`
	ParentID      *string `json:"parent_id"`       // 父评论 ID（如果是回复）
	ReplyToUserID *string `json:"reply_to_user_id"` // 被回复用户 ID（如果是回复）
}

// GetCommentsHandler 获取帖子的评论列表（含嵌套回复）
func GetCommentsHandler(c *gin.Context) {
	postID := c.Param("postId")
	if postID == "" {
		response.BadRequest(c, "Post ID is required")
		return
	}

	db := database.GetDB()

	// 验证帖子是否存在
	var post models.Post
	if err := db.Where("post_id = ? AND status = ?", postID, 1).First(&post).Error; err != nil {
		response.NotFound(c, "Post not found")
		return
	}

	// 查询所有评论（按创建时间排序）
	var comments []models.Comment
	if err := db.Where("post_id = ?", postID).Order("created_at ASC").Find(&comments).Error; err != nil {
		log.Printf("Failed to get comments: %v", err)
		response.InternalError(c, "Failed to get comments")
		return
	}

	// 查询所有涉及的用户 ID
	userIDs := make([]string, 0)
	for _, comment := range comments {
		userIDs = append(userIDs, comment.UserID)
		if comment.ReplyToUserID != nil {
			userIDs = append(userIDs, *comment.ReplyToUserID)
		}
	}

	// 查询用户信息
	var users []models.User
	if len(userIDs) > 0 {
		if err := db.Where("user_id IN ?", userIDs).Find(&users).Error; err != nil {
			log.Printf("Failed to get users: %v", err)
			response.InternalError(c, "Failed to get user info")
			return
		}
	}

	// 构建用户 ID 到用户信息的映射
	userMap := make(map[string]*models.User)
	for i := range users {
		userMap[users[i].UserID] = &users[i]
	}

	// 获取当前用户 ID（用于判断点赞状态）
	currentUserID, _ := c.Get("user_id")

	// 构建评论树形结构
	commentMap := make(map[string]*models.CommentWithUser)
	rootComments := make([]*models.CommentWithUser, 0)

	// 第一遍：创建所有 CommentWithUser 对象
	for _, comment := range comments {
		user := userMap[comment.UserID]
		if user == nil {
			continue
		}

		// 查询当前用户是否点赞
		isLiked := false
		if currentUserID != nil {
			var like models.Like
			err := db.Where("user_id = ? AND target_id = ? AND target_type = ?",
				currentUserID.(string), comment.CommentID, 2).First(&like).Error
			isLiked = (err == nil)
		}

		commentWithUser := comment.ToCommentWithUser(user, isLiked)

		// 设置被回复用户信息
		if comment.ReplyToUserID != nil {
			replyToUser := userMap[*comment.ReplyToUserID]
			if replyToUser != nil {
				commentWithUser.ReplyToNickname = replyToUser.Nickname
			}
		}

		commentMap[comment.CommentID] = commentWithUser
	}

	// 第二遍：构建树形结构
	for _, comment := range comments {
		commentWithUser := commentMap[comment.CommentID]
		if commentWithUser == nil {
			continue
		}

		if comment.ParentID == nil {
			// 顶层评论
			rootComments = append(rootComments, commentWithUser)
		} else {
			// 回复评论，添加到父评论的 Replies 列表
			parentComment := commentMap[*comment.ParentID]
			if parentComment != nil {
				if parentComment.Replies == nil {
					parentComment.Replies = make([]*models.CommentWithUser, 0)
				}
				parentComment.Replies = append(parentComment.Replies, commentWithUser)
			} else {
				// 父评论不存在（可能已被删除），将其作为顶层评论
				rootComments = append(rootComments, commentWithUser)
			}
		}
	}

	response.SuccessWithMessage(c, "Comments retrieved successfully", gin.H{
		"comments": rootComments,
		"total":    len(comments),
	})
}

// CreateCommentHandler 创建评论
func CreateCommentHandler(c *gin.Context) {
	postID := c.Param("postId")
	if postID == "" {
		response.BadRequest(c, "Post ID is required")
		return
	}

	var req CreateCommentRequest
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

	// 验证帖子是否存在
	var post models.Post
	if err := db.Where("post_id = ? AND status = ?", postID, 1).First(&post).Error; err != nil {
		response.NotFound(c, "Post not found")
		return
	}

	// 如果是回复，验证父评论是否存在
	if req.ParentID != nil {
		var parentComment models.Comment
		if err := db.Where("comment_id = ?", *req.ParentID).First(&parentComment).Error; err != nil {
			response.BadRequest(c, "Parent comment not found")
			return
		}

		// 验证父评论属于同一个帖子
		if parentComment.PostID != postID {
			response.BadRequest(c, "Parent comment does not belong to this post")
			return
		}
	}

	// 创建评论
	commentID := uuid.New().String()
	comment := models.Comment{
		CommentID:     commentID,
		PostID:        postID,
		UserID:        userID.(string),
		Content:       req.Content,
		ParentID:      req.ParentID,
		ReplyToUserID: req.ReplyToUserID,
	}

	// 使用事务：创建评论 + 更新帖子评论数
	err := db.Transaction(func(tx *gorm.DB) error {
		if err := tx.Create(&comment).Error; err != nil {
			return err
		}
		if err := tx.Model(&post).Update("comment_count", post.CommentCount+1).Error; err != nil {
			return err
		}
		return nil
	})

	if err != nil {
		log.Printf("Failed to create comment: %v", err)
		response.InternalError(c, "Failed to create comment")
		return
	}

	response.SuccessWithMessage(c, "Comment created successfully", gin.H{
		"comment_id": commentID,
		"created_at": comment.CreatedAt.Format("2006-01-02T15:04:05Z07:00"),
	})
}

// DeleteCommentHandler 删除评论
func DeleteCommentHandler(c *gin.Context) {
	commentID := c.Param("commentId")
	if commentID == "" {
		response.BadRequest(c, "Comment ID is required")
		return
	}

	// 从 Context 获取当前用户 ID
	userID, exists := c.Get("user_id")
	if !exists {
		response.Unauthorized(c, "User not authenticated")
		return
	}

	db := database.GetDB()

	// 查询评论
	var comment models.Comment
	if err := db.Where("comment_id = ?", commentID).First(&comment).Error; err != nil {
		response.NotFound(c, "Comment not found")
		return
	}

	// 验证是否是评论作者
	if comment.UserID != userID.(string) {
		response.Forbidden(c, "You can only delete your own comments")
		return
	}

	// 查询帖子
	var post models.Post
	if err := db.Where("post_id = ?", comment.PostID).First(&post).Error; err != nil {
		response.NotFound(c, "Post not found")
		return
	}

	// 查询该评论的所有子回复
	var childComments []models.Comment
	db.Where("parent_id = ?", commentID).Find(&childComments)

	// 使用事务：删除评论 + 删除子回复 + 更新帖子评论数
	err := db.Transaction(func(tx *gorm.DB) error {
		// 删除所有子回复
		if len(childComments) > 0 {
			if err := tx.Where("parent_id = ?", commentID).Delete(&models.Comment{}).Error; err != nil {
				return err
			}
		}

		// 删除评论本身
		if err := tx.Delete(&comment).Error; err != nil {
			return err
		}

		// 更新帖子评论数（减去评论本身 + 所有子回复）
		totalDeleted := 1 + len(childComments)
		newComments := int(post.CommentCount) - totalDeleted
		if newComments < 0 {
			newComments = 0
		}
		if err := tx.Model(&post).Update("comment_count", uint32(newComments)).Error; err != nil {
			return err
		}

		return nil
	})

	if err != nil {
		log.Printf("Failed to delete comment: %v", err)
		response.InternalError(c, "Failed to delete comment")
		return
	}

	response.SuccessWithMessage(c, "Comment deleted successfully", nil)
}
