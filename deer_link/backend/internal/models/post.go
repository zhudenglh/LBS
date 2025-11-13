package models

import (
	"database/sql/driver"
	"encoding/json"
	"time"
)

// StringArray 用于存储 JSON 数组
type StringArray []string

// Scan 实现 sql.Scanner 接口
func (s *StringArray) Scan(value interface{}) error {
	if value == nil {
		*s = []string{}
		return nil
	}
	bytes, ok := value.([]byte)
	if !ok {
		*s = []string{}
		return nil
	}
	return json.Unmarshal(bytes, s)
}

// Value 实现 driver.Valuer 接口
func (s StringArray) Value() (driver.Value, error) {
	if len(s) == 0 {
		return "[]", nil
	}
	return json.Marshal(s)
}

// Post 帖子模型
type Post struct {
	ID           uint        `gorm:"primaryKey" json:"id"`
	PostID       string      `gorm:"uniqueIndex;size:36;not null" json:"post_id"`
	UserID       string      `gorm:"size:36;not null;index" json:"user_id"`
	Title        string      `gorm:"size:200" json:"title,omitempty"`
	Content      string      `gorm:"type:text;not null" json:"content"`
	Images       StringArray `gorm:"type:json" json:"images,omitempty"`
	BusTag       string      `gorm:"size:50;index" json:"bus_tag,omitempty"`
	Location     string      `gorm:"size:100" json:"location,omitempty"`
	LikeCount    uint32      `gorm:"default:0" json:"like_count"`
	CommentCount uint32      `gorm:"default:0" json:"comment_count"`
	ShareCount   uint32      `gorm:"default:0" json:"share_count"`
	ViewCount    uint32      `gorm:"default:0" json:"view_count"`
	Status       int8        `gorm:"default:1;index" json:"status"` // 1-正常, 2-隐藏, 3-删除
	IsTop        int8        `gorm:"default:0" json:"is_top"` // 0-否, 1-是
	CreatedAt    time.Time   `gorm:"index" json:"created_at"`
	UpdatedAt    time.Time   `json:"updated_at"`
}

// TableName 指定表名
func (Post) TableName() string {
	return "posts"
}

// PostWithUser 帖子及用户信息（用于返回给前端）
type PostWithUser struct {
	PostID       string      `json:"post_id"`
	UserID       string      `json:"user_id"`
	Username     string      `json:"username"`      // 用户昵称
	UserAvatar   string      `json:"user_avatar"`   // 用户头像
	Title        string      `json:"title,omitempty"`
	Content      string      `json:"content"`
	Images       []string    `json:"images,omitempty"`
	BusTag       string      `json:"bus_tag,omitempty"`
	Location     string      `json:"location,omitempty"`
	LikeCount    uint32      `json:"like_count"`
	CommentCount uint32      `json:"comment_count"`
	ShareCount   uint32      `json:"share_count"`
	ViewCount    uint32      `json:"view_count"`
	IsLiked      bool        `json:"is_liked"`      // 当前用户是否点赞
	IsFavorited  bool        `json:"is_favorited"`  // 当前用户是否收藏
	CreatedAt    time.Time   `json:"created_at"`
}

// ToPostWithUser 转换为带用户信息的帖子
func (p *Post) ToPostWithUser(user *User, isLiked, isFavorited bool) *PostWithUser {
	return &PostWithUser{
		PostID:       p.PostID,
		UserID:       p.UserID,
		Username:     user.Nickname,
		UserAvatar:   user.Avatar,
		Title:        p.Title,
		Content:      p.Content,
		Images:       p.Images,
		BusTag:       p.BusTag,
		Location:     p.Location,
		LikeCount:    p.LikeCount,
		CommentCount: p.CommentCount,
		ShareCount:   p.ShareCount,
		ViewCount:    p.ViewCount,
		IsLiked:      isLiked,
		IsFavorited:  isFavorited,
		CreatedAt:    p.CreatedAt,
	}
}
