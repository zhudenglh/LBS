.PHONY: all build run dev test clean fmt lint deps help

# 变量定义
APP_NAME=deer_link_server
BUILD_DIR=./build
CMD_DIR=./cmd/server
GO=go
GOFLAGS=-v

# 默认目标
all: build

# 构建应用
build:
	@echo "Building $(APP_NAME)..."
	@mkdir -p $(BUILD_DIR)
	@$(GO) build $(GOFLAGS) -o $(BUILD_DIR)/$(APP_NAME) $(CMD_DIR)/main.go
	@echo "Build complete: $(BUILD_DIR)/$(APP_NAME)"

# 运行应用（开发模式）
run:
	@echo "Running $(APP_NAME)..."
	@$(GO) run $(CMD_DIR)/main.go

# 开发模式（带热重载，需安装 air）
dev:
	@echo "Starting development server with hot reload..."
	@if command -v air >/dev/null 2>&1; then \
		air; \
	else \
		echo "air not found. Installing..."; \
		$(GO) install github.com/cosmtrek/air@latest; \
		air; \
	fi

# 运行测试
test:
	@echo "Running tests..."
	@$(GO) test -v ./...

# 代码覆盖率测试
test-coverage:
	@echo "Running tests with coverage..."
	@$(GO) test -coverprofile=coverage.out ./...
	@$(GO) tool cover -html=coverage.out -o coverage.html
	@echo "Coverage report: coverage.html"

# 清理构建文件
clean:
	@echo "Cleaning build artifacts..."
	@rm -rf $(BUILD_DIR)
	@rm -f coverage.out coverage.html
	@echo "Clean complete"

# 格式化代码
fmt:
	@echo "Formatting code..."
	@$(GO) fmt ./...
	@echo "Format complete"

# 代码检查
lint:
	@echo "Running linter..."
	@if command -v golangci-lint >/dev/null 2>&1; then \
		golangci-lint run; \
	else \
		echo "golangci-lint not found. Installing..."; \
		$(GO) install github.com/golangci/golangci-lint/cmd/golangci-lint@latest; \
		golangci-lint run; \
	fi

# 安装依赖
deps:
	@echo "Downloading dependencies..."
	@$(GO) mod download
	@$(GO) mod tidy
	@echo "Dependencies installed"

# 生成 API 文档（需安装 swag）
swagger:
	@echo "Generating Swagger documentation..."
	@if command -v swag >/dev/null 2>&1; then \
		swag init -g $(CMD_DIR)/main.go -o ./docs/swagger; \
	else \
		echo "swag not found. Installing..."; \
		$(GO) install github.com/swaggo/swag/cmd/swag@latest; \
		swag init -g $(CMD_DIR)/main.go -o ./docs/swagger; \
	fi

# 构建生产版本（带优化）
build-prod:
	@echo "Building production version..."
	@mkdir -p $(BUILD_DIR)
	@CGO_ENABLED=0 GOOS=linux GOARCH=amd64 $(GO) build \
		-ldflags="-s -w -X main.Version=$(shell git describe --tags --always) -X main.BuildTime=$(shell date +%Y-%m-%d_%H:%M:%S)" \
		-o $(BUILD_DIR)/$(APP_NAME) $(CMD_DIR)/main.go
	@echo "Production build complete: $(BUILD_DIR)/$(APP_NAME)"

# 部署到服务器
deploy:
	@echo "Deploying to server..."
	@./scripts/deploy.sh

# 数据库迁移
db-init:
	@echo "Initializing database..."
	@mysql -u deer_link_user -p deer_link_community < scripts/init_db.sql
	@echo "Database initialization complete"

# 备份数据库
db-backup:
	@echo "Backing up database..."
	@./scripts/backup.sh

# 查看日志
logs:
	@echo "Viewing logs..."
	@sudo journalctl -u deer_link -f

# 安装开发工具
install-tools:
	@echo "Installing development tools..."
	@$(GO) install github.com/cosmtrek/air@latest
	@$(GO) install github.com/golangci/golangci-lint/cmd/golangci-lint@latest
	@$(GO) install github.com/swaggo/swag/cmd/swag@latest
	@echo "Development tools installed"

# 帮助信息
help:
	@echo "Available targets:"
	@echo "  build         - Build the application"
	@echo "  run           - Run the application"
	@echo "  dev           - Run in development mode with hot reload"
	@echo "  test          - Run tests"
	@echo "  test-coverage - Run tests with coverage report"
	@echo "  clean         - Clean build artifacts"
	@echo "  fmt           - Format code"
	@echo "  lint          - Run linter"
	@echo "  deps          - Download dependencies"
	@echo "  swagger       - Generate Swagger API documentation"
	@echo "  build-prod    - Build production version"
	@echo "  deploy        - Deploy to server"
	@echo "  db-init       - Initialize database"
	@echo "  db-backup     - Backup database"
	@echo "  logs          - View application logs"
	@echo "  install-tools - Install development tools"
	@echo "  help          - Show this help message"
