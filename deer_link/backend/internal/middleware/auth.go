package middleware

import (
	"strings"

	"github.com/deer_link/community/pkg/response"
	"github.com/deer_link/community/pkg/utils"
	"github.com/gin-gonic/gin"
)

// AuthRequired JWT 认证中间件
func AuthRequired() gin.HandlerFunc {
	return func(c *gin.Context) {
		// 从 Header 获取 Token
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			response.Unauthorized(c, "Missing authorization header")
			c.Abort()
			return
		}

		// 验证 Bearer Token 格式
		parts := strings.SplitN(authHeader, " ", 2)
		if len(parts) != 2 || parts[0] != "Bearer" {
			response.Unauthorized(c, "Invalid authorization header format")
			c.Abort()
			return
		}

		tokenString := parts[1]

		// 解析 Token
		claims, err := utils.ParseToken(tokenString)
		if err != nil {
			response.Unauthorized(c, "Invalid or expired token")
			c.Abort()
			return
		}

		// 将用户信息注入到 Context
		c.Set("user_id", claims.UserID)
		c.Set("nickname", claims.Nickname)

		c.Next()
	}
}

// OptionalAuth 可选认证中间件（用于某些既支持登录也支持未登录的接口）
func OptionalAuth() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			// 没有 Token，继续执行，但不设置用户信息
			c.Next()
			return
		}

		parts := strings.SplitN(authHeader, " ", 2)
		if len(parts) == 2 && parts[0] == "Bearer" {
			tokenString := parts[1]
			claims, err := utils.ParseToken(tokenString)
			if err == nil {
				// Token 有效，注入用户信息
				c.Set("user_id", claims.UserID)
				c.Set("nickname", claims.Nickname)
			}
		}

		c.Next()
	}
}
