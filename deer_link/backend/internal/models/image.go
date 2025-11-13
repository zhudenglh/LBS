package models

import (
	"time"
)

// Image 图片模型
type Image struct {
	ID           uint      `gorm:"primaryKey" json:"id"`
	ImageID      string    `gorm:"uniqueIndex;size:36;not null" json:"image_id"`
	UserID       string    `gorm:"size:36;not null;index" json:"user_id"`
	OriginalURL  string    `gorm:"size:255;not null" json:"original_url"`
	ThumbnailURL string    `gorm:"size:255" json:"thumbnail_url,omitempty"`
	Filename     string    `gorm:"size:255;not null" json:"filename"`
	FileSize     uint32    `gorm:"not null" json:"file_size"`
	MimeType     string    `gorm:"size:50;not null" json:"mime_type"`
	Width        uint32    `json:"width,omitempty"`
	Height       uint32    `json:"height,omitempty"`
	Status       int8      `gorm:"default:1;index" json:"status"` // 1-正常, 2-删除
	CreatedAt    time.Time `gorm:"index" json:"created_at"`
}

// TableName 指定表名
func (Image) TableName() string {
	return "images"
}
