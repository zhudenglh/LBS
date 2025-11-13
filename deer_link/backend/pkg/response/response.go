package response

import (
	"github.com/gin-gonic/gin"
)

// Response 统一响应结构
type Response struct {
	Code    int         `json:"code"`
	Message string      `json:"message"`
	Data    interface{} `json:"data,omitempty"`
}

// Success 成功响应
func Success(c *gin.Context, data interface{}) {
	c.JSON(200, Response{
		Code:    200,
		Message: "success",
		Data:    data,
	})
}

// SuccessWithMessage 成功响应（自定义消息）
func SuccessWithMessage(c *gin.Context, message string, data interface{}) {
	c.JSON(200, Response{
		Code:    200,
		Message: message,
		Data:    data,
	})
}

// Error 错误响应
func Error(c *gin.Context, code int, message string) {
	c.JSON(code, Response{
		Code:    code,
		Message: message,
		Data:    nil,
	})
}

// BadRequest 400 错误请求
func BadRequest(c *gin.Context, message string) {
	Error(c, 400, message)
}

// Unauthorized 401 未认证
func Unauthorized(c *gin.Context, message string) {
	Error(c, 401, message)
}

// Forbidden 403 无权限
func Forbidden(c *gin.Context, message string) {
	Error(c, 403, message)
}

// NotFound 404 未找到
func NotFound(c *gin.Context, message string) {
	Error(c, 404, message)
}

// InternalError 500 服务器错误
func InternalError(c *gin.Context, message string) {
	Error(c, 500, message)
}
