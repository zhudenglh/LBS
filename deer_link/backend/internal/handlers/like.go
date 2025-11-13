package handlers

import (
	"log"

	"github.com/deer_link/community/internal/database"
	"github.com/deer_link/community/internal/models"
	"github.com/deer_link/community/pkg/response"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// LikePostHandler 点赞帖子
func LikePostHandler(c *gin.Context) {
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

	// 验证帖子是否存在
	var post models.Post
	if err := db.Where("post_id = ? AND status = ?", postID, 1).First(&post).Error; err != nil {
		response.NotFound(c, "Post not found")
		return
	}

	// 检查是否已点赞
	var existingLike models.Like
	err := db.Where("user_id = ? AND target_id = ? AND target_type = ?",
		userID.(string), postID, 1).First(&existingLike).Error

	if err == nil {
		// 已经点赞过了
		response.BadRequest(c, "You have already liked this post")
		return
	}

	// 创建点赞记录
	like := models.Like{
		UserID:     userID.(string),
		TargetID:   postID,
		TargetType: 1, // 1=帖子
	}

	// 使用事务：创建点赞记录 + 更新帖子点赞数
	err = db.Transaction(func(tx *gorm.DB) error {
		if err := tx.Create(&like).Error; err != nil {
			return err
		}
		if err := tx.Model(&post).Update("like_count", post.LikeCount+1).Error; err != nil {
			return err
		}
		return nil
	})

	if err != nil {
		log.Printf("Failed to like post: %v", err)
		response.InternalError(c, "Failed to like post")
		return
	}

	response.SuccessWithMessage(c, "Post liked successfully", gin.H{
		"likes": post.LikeCount + 1,
	})
}

// UnlikePostHandler 取消点赞帖子
func UnlikePostHandler(c *gin.Context) {
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

	// 验证帖子是否存在
	var post models.Post
	if err := db.Where("post_id = ? AND status = ?", postID, 1).First(&post).Error; err != nil {
		response.NotFound(c, "Post not found")
		return
	}

	// 查找点赞记录
	var like models.Like
	if err := db.Where("user_id = ? AND target_id = ? AND target_type = ?",
		userID.(string), postID, 1).First(&like).Error; err != nil {
		response.BadRequest(c, "You have not liked this post")
		return
	}

	// 使用事务：删除点赞记录 + 更新帖子点赞数
	err := db.Transaction(func(tx *gorm.DB) error {
		if err := tx.Delete(&like).Error; err != nil {
			return err
		}
		newLikes := post.LikeCount - 1
		if newLikes < 0 {
			newLikes = 0
		}
		if err := tx.Model(&post).Update("like_count", newLikes).Error; err != nil {
			return err
		}
		return nil
	})

	if err != nil {
		log.Printf("Failed to unlike post: %v", err)
		response.InternalError(c, "Failed to unlike post")
		return
	}

	newLikes := post.LikeCount - 1
	if newLikes < 0 {
		newLikes = 0
	}

	response.SuccessWithMessage(c, "Post unliked successfully", gin.H{
		"likes": newLikes,
	})
}

// FavoritePostHandler 收藏帖子
func FavoritePostHandler(c *gin.Context) {
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

	// 验证帖子是否存在
	var post models.Post
	if err := db.Where("post_id = ? AND status = ?", postID, 1).First(&post).Error; err != nil {
		response.NotFound(c, "Post not found")
		return
	}

	// 检查是否已收藏
	var existingFavorite models.Favorite
	err := db.Where("user_id = ? AND post_id = ?",
		userID.(string), postID).First(&existingFavorite).Error

	if err == nil {
		// 已经收藏过了
		response.BadRequest(c, "You have already favorited this post")
		return
	}

	// 创建收藏记录
	favorite := models.Favorite{
		UserID:     userID.(string),
		PostID:     postID,
	}

	// 使用事务：创建收藏记录
	err = db.Transaction(func(tx *gorm.DB) error {
		if err := tx.Create(&favorite).Error; err != nil {
			return err
		}
		return nil
	})

	if err != nil {
		log.Printf("Failed to favorite post: %v", err)
		response.InternalError(c, "Failed to favorite post")
		return
	}

	response.SuccessWithMessage(c, "Post favorited successfully", nil)
}

// UnfavoritePostHandler 取消收藏帖子
func UnfavoritePostHandler(c *gin.Context) {
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

	// 验证帖子是否存在
	var post models.Post
	if err := db.Where("post_id = ? AND status = ?", postID, 1).First(&post).Error; err != nil {
		response.NotFound(c, "Post not found")
		return
	}

	// 查找收藏记录
	var favorite models.Favorite
	if err := db.Where("user_id = ? AND post_id = ?",
		userID.(string), postID).First(&favorite).Error; err != nil {
		response.BadRequest(c, "You have not favorited this post")
		return
	}

	// 使用事务：删除收藏记录
	err := db.Transaction(func(tx *gorm.DB) error {
		if err := tx.Delete(&favorite).Error; err != nil {
			return err
		}
		return nil
	})

	if err != nil {
		log.Printf("Failed to unfavorite post: %v", err)
		response.InternalError(c, "Failed to unfavorite post")
		return
	}

	response.SuccessWithMessage(c, "Post unfavorited successfully", nil)
}

// LikeCommentHandler 点赞评论
func LikeCommentHandler(c *gin.Context) {
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

	// 验证评论是否存在
	var comment models.Comment
	if err := db.Where("comment_id = ?", commentID).First(&comment).Error; err != nil {
		response.NotFound(c, "Comment not found")
		return
	}

	// 检查是否已点赞
	var existingLike models.Like
	err := db.Where("user_id = ? AND target_id = ? AND target_type = ?",
		userID.(string), commentID, 2).First(&existingLike).Error

	if err == nil {
		response.BadRequest(c, "You have already liked this comment")
		return
	}

	// 创建点赞记录
	like := models.Like{
		UserID:     userID.(string),
		TargetID:   commentID,
		TargetType: 2, // 2=评论
	}

	// 使用事务：创建点赞记录 + 更新评论点赞数
	err = db.Transaction(func(tx *gorm.DB) error {
		if err := tx.Create(&like).Error; err != nil {
			return err
		}
		if err := tx.Model(&comment).Update("like_count", comment.LikeCount+1).Error; err != nil {
			return err
		}
		return nil
	})

	if err != nil {
		log.Printf("Failed to like comment: %v", err)
		response.InternalError(c, "Failed to like comment")
		return
	}

	response.SuccessWithMessage(c, "Comment liked successfully", gin.H{
		"likes": comment.LikeCount + 1,
	})
}

// UnlikeCommentHandler 取消点赞评论
func UnlikeCommentHandler(c *gin.Context) {
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

	// 验证评论是否存在
	var comment models.Comment
	if err := db.Where("comment_id = ?", commentID).First(&comment).Error; err != nil {
		response.NotFound(c, "Comment not found")
		return
	}

	// 查找点赞记录
	var like models.Like
	if err := db.Where("user_id = ? AND target_id = ? AND target_type = ?",
		userID.(string), commentID, 2).First(&like).Error; err != nil {
		response.BadRequest(c, "You have not liked this comment")
		return
	}

	// 使用事务：删除点赞记录 + 更新评论点赞数
	err := db.Transaction(func(tx *gorm.DB) error {
		if err := tx.Delete(&like).Error; err != nil {
			return err
		}
		newLikes := comment.LikeCount - 1
		if newLikes < 0 {
			newLikes = 0
		}
		if err := tx.Model(&comment).Update("like_count", newLikes).Error; err != nil {
			return err
		}
		return nil
	})

	if err != nil {
		log.Printf("Failed to unlike comment: %v", err)
		response.InternalError(c, "Failed to unlike comment")
		return
	}

	newLikes := comment.LikeCount - 1
	if newLikes < 0 {
		newLikes = 0
	}

	response.SuccessWithMessage(c, "Comment unliked successfully", gin.H{
		"likes": newLikes,
	})
}
