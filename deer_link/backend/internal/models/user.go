package models

import (
	"time"
)

// User 用户模型
type User struct {
	ID          uint       `gorm:"primaryKey" json:"id"`
	UserID      string     `gorm:"uniqueIndex;size:36;not null" json:"user_id"`
	CountryCode string     `gorm:"size:10;default:'+86'" json:"country_code"`      // 国家区域号码，默认+86（中国）
	Phone       string     `gorm:"uniqueIndex;size:20;not null" json:"phone"`      // 手机号必填，唯一索引
	Email       *string    `gorm:"uniqueIndex;size:100" json:"email,omitempty"`    // 邮箱可选，改为指针类型，空值存储为NULL
	Nickname    string     `gorm:"size:50;not null" json:"nickname"`
	Avatar      string     `gorm:"size:255" json:"avatar,omitempty"`
	Bio         string     `gorm:"type:text" json:"bio,omitempty"`
	Gender      int8       `gorm:"default:0" json:"gender"`    // 0-未知, 1-男, 2-女
	Age         *int       `json:"age,omitempty"`              // 年龄（可选）
	Birthday    *time.Time `json:"birthday,omitempty"`
	Location    string     `gorm:"size:100" json:"location,omitempty"`
	Password    string     `gorm:"size:255;not null" json:"-"` // 加密后的密码，不返回给前端
	Status      int8       `gorm:"default:1;index" json:"status"` // 1-正常, 2-封禁
	CreatedAt   time.Time  `gorm:"index" json:"created_at"`
	UpdatedAt   time.Time  `json:"updated_at"`
}

// TableName 指定表名
func (User) TableName() string {
	return "users"
}

// UserPublicInfo 用户公开信息（用于返回给前端）
type UserPublicInfo struct {
	UserID       string    `json:"user_id"`
	Nickname     string    `json:"nickname"`
	Avatar       string    `json:"avatar"`
	Bio          string    `json:"bio,omitempty"`
	Gender       int8      `json:"gender"`
	Location     string    `json:"location,omitempty"`
	PostCount    int       `json:"post_count,omitempty"`
	FollowerCount int      `json:"follower_count,omitempty"`
	FollowingCount int     `json:"following_count,omitempty"`
	CreatedAt    time.Time `json:"created_at"`
}

// ToPublicInfo 转换为公开信息
func (u *User) ToPublicInfo() *UserPublicInfo {
	return &UserPublicInfo{
		UserID:    u.UserID,
		Nickname:  u.Nickname,
		Avatar:    u.Avatar,
		Bio:       u.Bio,
		Gender:    u.Gender,
		Location:  u.Location,
		CreatedAt: u.CreatedAt,
	}
}
