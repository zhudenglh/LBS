package utils

import (
	"errors"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

var jwtSecret = []byte("your-secret-key-change-in-production") // 应该从配置文件读取

// Claims JWT 声明
type Claims struct {
	UserID   string `json:"user_id"`
	Nickname string `json:"nickname"`
	jwt.RegisteredClaims
}

// GenerateToken 生成 JWT Token
func GenerateToken(userID, nickname string, expireHours int) (string, time.Time, error) {
	expiresAt := time.Now().Add(time.Hour * time.Duration(expireHours))

	claims := Claims{
		UserID:   userID,
		Nickname: nickname,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expiresAt),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			NotBefore: jwt.NewNumericDate(time.Now()),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(jwtSecret)
	if err != nil{
		return "", time.Time{}, err
	}

	return tokenString, expiresAt, nil
}

// ParseToken 解析 JWT Token
func ParseToken(tokenString string) (*Claims, error) {
	token, err := jwt.ParseWithClaims(tokenString, &Claims{}, func(token *jwt.Token) (interface{}, error) {
		return jwtSecret, nil
	})

	if err != nil {
		return nil, err
	}

	if claims, ok := token.Claims.(*Claims); ok && token.Valid {
		return claims, nil
	}

	return nil, errors.New("invalid token")
}

// RefreshToken 刷新 Token
func RefreshToken(tokenString string, expireHours int) (string, time.Time, error) {
	claims, err := ParseToken(tokenString)
	if err != nil {
		return "", time.Time{}, err
	}

	// 生成新 Token
	return GenerateToken(claims.UserID, claims.Nickname, expireHours)
}
