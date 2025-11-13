package models

import (
	"time"
)

// Like 点赞模型
type Like struct {
	ID         uint      `gorm:"primaryKey" json:"id"`
	UserID     string    `gorm:"size:36;not null" json:"user_id"`
	TargetType int8      `gorm:"not null" json:"target_type"` // 1-帖子, 2-评论
	TargetID   string    `gorm:"size:36;not null" json:"target_id"`
	CreatedAt  time.Time `gorm:"index" json:"created_at"`
}

// TableName 指定表名
func (Like) TableName() string {
	return "likes"
}

// Favorite 收藏模型
type Favorite struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	UserID    string    `gorm:"size:36;not null" json:"user_id"`
	PostID    string    `gorm:"size:36;not null" json:"post_id"`
	CreatedAt time.Time `gorm:"index" json:"created_at"`
}

// TableName 指定表名
func (Favorite) TableName() string {
	return "favorites"
}
