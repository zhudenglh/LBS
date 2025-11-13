package models

import (
	"time"
)

// Comment 评论模型
type Comment struct {
	ID            uint       `gorm:"primaryKey" json:"id"`
	CommentID     string     `gorm:"uniqueIndex;size:36;not null" json:"comment_id"`
	PostID        string     `gorm:"size:36;not null;index" json:"post_id"`
	UserID        string     `gorm:"size:36;not null;index" json:"user_id"`
	ParentID      *string    `gorm:"size:36;index" json:"parent_id,omitempty"` // NULL 表示一级评论
	ReplyToUserID *string    `gorm:"size:36" json:"reply_to_user_id,omitempty"`
	Content       string     `gorm:"type:text;not null" json:"content"`
	LikeCount     uint32     `gorm:"default:0" json:"like_count"`
	ReplyCount    uint32     `gorm:"default:0" json:"reply_count"`
	Status        int8       `gorm:"default:1;index" json:"status"` // 1-正常, 2-隐藏, 3-删除
	CreatedAt     time.Time  `gorm:"index" json:"created_at"`
	UpdatedAt     time.Time  `json:"updated_at"`
}

// TableName 指定表名
func (Comment) TableName() string {
	return "comments"
}

// CommentWithUser 评论及用户信息（用于返回给前端）
type CommentWithUser struct {
	CommentID        string                `json:"comment_id"`
	PostID           string                `json:"post_id"`
	UserID           string                `json:"user_id"`
	UserNickname     string                `json:"user_nickname"`
	UserAvatar       string                `json:"user_avatar"`
	ParentID         *string               `json:"parent_id,omitempty"`
	ReplyToUserID    *string               `json:"reply_to_user_id,omitempty"`
	ReplyToNickname  string                `json:"reply_to_nickname,omitempty"`
	Content          string                `json:"content"`
	LikeCount        uint32                `json:"like_count"`
	ReplyCount       uint32                `json:"reply_count"`
	IsLiked          bool                  `json:"is_liked"`
	CreatedAt        time.Time             `json:"created_at"`
	Replies          []*CommentWithUser    `json:"replies,omitempty"`
}

// ToCommentWithUser 转换为带用户信息的评论
func (c *Comment) ToCommentWithUser(user *User, isLiked bool) *CommentWithUser {
	return &CommentWithUser{
		CommentID:    c.CommentID,
		PostID:       c.PostID,
		UserID:       c.UserID,
		UserNickname: user.Nickname,
		UserAvatar:   user.Avatar,
		ParentID:     c.ParentID,
		ReplyToUserID: c.ReplyToUserID,
		Content:      c.Content,
		LikeCount:    c.LikeCount,
		ReplyCount:   c.ReplyCount,
		IsLiked:      isLiked,
		CreatedAt:    c.CreatedAt,
		Replies:      []*CommentWithUser{},
	}
}
