package handlers

import (
	"fmt"
	"io"
	"log"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/deer_link/community/internal/database"
	"github.com/deer_link/community/internal/models"
	"github.com/deer_link/community/pkg/response"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

const (
	// 上传目录配置
	uploadBasePath = "/var/www/deer_link/storage/uploads"
	imageSubPath   = "images"

	// 图片大小限制（10MB）
	maxImageSize = 10 * 1024 * 1024

	// 允许的图片类型
	allowedImageTypes = ".jpg,.jpeg,.png,.gif,.webp"
)

// UploadImageHandler 上传图片
func UploadImageHandler(c *gin.Context) {
	// 从 Context 获取当前用户 ID
	userID, exists := c.Get("user_id")
	if !exists {
		response.Unauthorized(c, "User not authenticated")
		return
	}

	// 获取上传的文件
	file, err := c.FormFile("image")
	if err != nil {
		response.BadRequest(c, "No image file provided")
		return
	}

	// 验证文件大小
	if file.Size > maxImageSize {
		response.BadRequest(c, "Image size exceeds 10MB limit")
		return
	}

	// 验证文件类型
	ext := strings.ToLower(filepath.Ext(file.Filename))
	if !strings.Contains(allowedImageTypes, ext) {
		response.BadRequest(c, "Invalid image type. Allowed: jpg, jpeg, png, gif, webp")
		return
	}

	// 生成唯一文件名
	imageID := uuid.New().String()
	filename := fmt.Sprintf("%s%s", imageID, ext)

	// 按日期组织目录
	dateDir := time.Now().Format("2006-01-02")
	fullPath := filepath.Join(uploadBasePath, imageSubPath, dateDir)

	// 确保目录存在
	if err := os.MkdirAll(fullPath, 0755); err != nil {
		log.Printf("Failed to create directory: %v", err)
		response.InternalError(c, "Failed to create upload directory")
		return
	}

	// 保存文件
	filePath := filepath.Join(fullPath, filename)
	if err := c.SaveUploadedFile(file, filePath); err != nil {
		log.Printf("Failed to save file: %v", err)
		response.InternalError(c, "Failed to save image")
		return
	}

	// 生成访问 URL
	imageURL := fmt.Sprintf("http://47.107.130.240/storage/images/%s/%s", dateDir, filename)

	// 保存图片记录到数据库
	db := database.GetDB()
	image := models.Image{
		ImageID:     imageID,
		UserID:      userID.(string),
		OriginalURL: imageURL,
		Filename:    filename,
		FileSize:    uint32(file.Size),
		MimeType:    "image/" + ext[1:],
	}

	if err := db.Create(&image).Error; err != nil {
		log.Printf("Failed to create image record: %v", err)
		// 文件已保存，只是数据库记录失败，仍然返回成功
	}

	response.SuccessWithMessage(c, "Image uploaded successfully", gin.H{
		"image_id":  imageID,
		"image_url": imageURL,
		"file_size": file.Size,
	})
}

// UploadMultipleImagesHandler 批量上传图片
func UploadMultipleImagesHandler(c *gin.Context) {
	// 从 Context 获取当前用户 ID
	userID, exists := c.Get("user_id")
	if !exists {
		response.Unauthorized(c, "User not authenticated")
		return
	}

	// 获取上传的文件
	form, err := c.MultipartForm()
	if err != nil {
		response.BadRequest(c, "Invalid form data")
		return
	}

	files := form.File["images"]
	if len(files) == 0 {
		response.BadRequest(c, "No image files provided")
		return
	}

	// 限制批量上传数量
	if len(files) > 9 {
		response.BadRequest(c, "Maximum 9 images allowed per upload")
		return
	}

	db := database.GetDB()
	uploadedImages := make([]gin.H, 0, len(files))

	// 按日期组织目录
	dateDir := time.Now().Format("2006-01-02")
	fullPath := filepath.Join(uploadBasePath, imageSubPath, dateDir)

	// 确保目录存在
	if err := os.MkdirAll(fullPath, 0755); err != nil {
		log.Printf("Failed to create directory: %v", err)
		response.InternalError(c, "Failed to create upload directory")
		return
	}

	// 处理每个文件
	for _, file := range files {
		// 验证文件大小
		if file.Size > maxImageSize {
			continue // 跳过过大的文件
		}

		// 验证文件类型
		ext := strings.ToLower(filepath.Ext(file.Filename))
		if !strings.Contains(allowedImageTypes, ext) {
			continue // 跳过不支持的类型
		}

		// 生成唯一文件名
		imageID := uuid.New().String()
		filename := fmt.Sprintf("%s%s", imageID, ext)

		// 保存文件
		filePath := filepath.Join(fullPath, filename)
		if err := c.SaveUploadedFile(file, filePath); err != nil {
			log.Printf("Failed to save file %s: %v", file.Filename, err)
			continue
		}

		// 生成访问 URL
		imageURL := fmt.Sprintf("http://47.107.130.240/storage/images/%s/%s", dateDir, filename)

		// 保存图片记录到数据库
		image := models.Image{
			ImageID:     imageID,
			UserID:      userID.(string),
			OriginalURL: imageURL,
			Filename:    filename,
			FileSize:    uint32(file.Size),
			MimeType:    "image/" + ext[1:],
		}

		if err := db.Create(&image).Error; err != nil {
			log.Printf("Failed to create image record: %v", err)
		}

		uploadedImages = append(uploadedImages, gin.H{
			"image_id":  imageID,
			"image_url": imageURL,
			"file_size": file.Size,
		})
	}

	if len(uploadedImages) == 0 {
		response.BadRequest(c, "No valid images uploaded")
		return
	}

	response.SuccessWithMessage(c, "Images uploaded successfully", gin.H{
		"images": uploadedImages,
		"count":  len(uploadedImages),
	})
}

// DeleteImageHandler 删除图片
func DeleteImageHandler(c *gin.Context) {
	imageID := c.Param("imageId")
	if imageID == "" {
		response.BadRequest(c, "Image ID is required")
		return
	}

	// 从 Context 获取当前用户 ID
	userID, exists := c.Get("user_id")
	if !exists {
		response.Unauthorized(c, "User not authenticated")
		return
	}

	db := database.GetDB()

	// 查询图片记录
	var image models.Image
	if err := db.Where("image_id = ?", imageID).First(&image).Error; err != nil {
		response.NotFound(c, "Image not found")
		return
	}

	// 验证是否是图片上传者
	if image.UserID != userID.(string) {
		response.Forbidden(c, "You can only delete your own images")
		return
	}

	// 删除数据库记录
	if err := db.Delete(&image).Error; err != nil {
		log.Printf("Failed to delete image record: %v", err)
		response.InternalError(c, "Failed to delete image")
		return
	}

	// 尝试删除文件（失败不影响响应）
	// 从 URL 解析文件路径
	// URL 格式: http://47.107.130.240/storage/images/2025-01-13/uuid.jpg
	urlParts := strings.Split(image.OriginalURL, "/storage/images/")
	if len(urlParts) == 2 {
		relativePath := urlParts[1]
		filePath := filepath.Join(uploadBasePath, imageSubPath, relativePath)
		if err := os.Remove(filePath); err != nil {
			log.Printf("Failed to delete file %s: %v", filePath, err)
		}
	}

	response.SuccessWithMessage(c, "Image deleted successfully", nil)
}

// DownloadImageHandler 下载图片（用于调试）
func DownloadImageHandler(c *gin.Context) {
	imageID := c.Param("imageId")
	if imageID == "" {
		response.BadRequest(c, "Image ID is required")
		return
	}

	db := database.GetDB()

	// 查询图片记录
	var image models.Image
	if err := db.Where("image_id = ?", imageID).First(&image).Error; err != nil {
		response.NotFound(c, "Image not found")
		return
	}

	// 从 URL 解析文件路径
	urlParts := strings.Split(image.OriginalURL, "/storage/images/")
	if len(urlParts) != 2 {
		response.InternalError(c, "Invalid image URL")
		return
	}

	relativePath := urlParts[1]
	filePath := filepath.Join(uploadBasePath, imageSubPath, relativePath)

	// 检查文件是否存在
	if _, err := os.Stat(filePath); os.IsNotExist(err) {
		response.NotFound(c, "Image file not found")
		return
	}

	// 打开文件
	file, err := os.Open(filePath)
	if err != nil {
		log.Printf("Failed to open file: %v", err)
		response.InternalError(c, "Failed to open image")
		return
	}
	defer file.Close()

	// 读取文件内容
	fileBytes, err := io.ReadAll(file)
	if err != nil {
		log.Printf("Failed to read file: %v", err)
		response.InternalError(c, "Failed to read image")
		return
	}

	// 设置响应头
	ext := strings.ToLower(filepath.Ext(filePath))
	contentType := "image/jpeg"
	switch ext {
	case ".png":
		contentType = "image/png"
	case ".gif":
		contentType = "image/gif"
	case ".webp":
		contentType = "image/webp"
	}

	c.Data(200, contentType, fileBytes)
}
