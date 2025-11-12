#!/bin/bash
###########################################
# 数据库自动备份脚本
# 在阿里云 ECS 服务器上运行
# 建议通过 crontab 设置定时任务
###########################################

set -e

# 配置变量
DB_USER="deer_link_user"
DB_NAME="deer_link_community"
BACKUP_DIR="/var/www/deer_link/storage/backups"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="${BACKUP_DIR}/daily/backup_${DATE}.sql"

# 保留天数
DAILY_RETENTION=7    # 每日备份保留 7 天
WEEKLY_RETENTION=30  # 每周备份保留 30 天
MONTHLY_RETENTION=90 # 每月备份保留 90 天

# 颜色输出
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

print_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 创建备份目录
create_backup_dirs() {
    mkdir -p ${BACKUP_DIR}/{daily,weekly,monthly}
}

# 执行备份
do_backup() {
    print_info "开始备份数据库..."

    # 提示输入密码
    mysqldump -u ${DB_USER} -p ${DB_NAME} > ${BACKUP_FILE}

    # 压缩备份文件
    gzip ${BACKUP_FILE}
    BACKUP_FILE="${BACKUP_FILE}.gz"

    print_info "备份完成: ${BACKUP_FILE}"

    # 显示备份文件大小
    FILESIZE=$(du -h ${BACKUP_FILE} | awk '{print $1}')
    print_info "备份文件大小: ${FILESIZE}"
}

# 每周备份（每周日执行）
weekly_backup() {
    DAY_OF_WEEK=$(date +%u)
    if [ "$DAY_OF_WEEK" -eq 7 ]; then
        print_info "执行每周备份..."
        WEEKLY_FILE="${BACKUP_DIR}/weekly/backup_week_$(date +%Y%m%d).sql.gz"
        cp ${BACKUP_FILE} ${WEEKLY_FILE}
        print_info "每周备份保存到: ${WEEKLY_FILE}"
    fi
}

# 每月备份（每月1号执行）
monthly_backup() {
    DAY_OF_MONTH=$(date +%d)
    if [ "$DAY_OF_MONTH" -eq 01 ]; then
        print_info "执行每月备份..."
        MONTHLY_FILE="${BACKUP_DIR}/monthly/backup_month_$(date +%Y%m).sql.gz"
        cp ${BACKUP_FILE} ${MONTHLY_FILE}
        print_info "每月备份保存到: ${MONTHLY_FILE}"
    fi
}

# 清理过期备份
cleanup_old_backups() {
    print_info "清理过期备份文件..."

    # 清理每日备份
    find ${BACKUP_DIR}/daily -name "backup_*.sql.gz" -mtime +${DAILY_RETENTION} -delete
    print_info "清理 ${DAILY_RETENTION} 天前的每日备份"

    # 清理每周备份
    find ${BACKUP_DIR}/weekly -name "backup_*.sql.gz" -mtime +${WEEKLY_RETENTION} -delete
    print_info "清理 ${WEEKLY_RETENTION} 天前的每周备份"

    # 清理每月备份
    find ${BACKUP_DIR}/monthly -name "backup_*.sql.gz" -mtime +${MONTHLY_RETENTION} -delete
    print_info "清理 ${MONTHLY_RETENTION} 天前的每月备份"
}

# 显示备份统计
show_stats() {
    echo ""
    echo "========================================="
    echo "  备份统计"
    echo "========================================="
    echo ""

    echo "每日备份:"
    ls -lh ${BACKUP_DIR}/daily/ | tail -n 5
    echo ""

    echo "每周备份:"
    ls -lh ${BACKUP_DIR}/weekly/ | tail -n 3 || echo "  无每周备份"
    echo ""

    echo "每月备份:"
    ls -lh ${BACKUP_DIR}/monthly/ | tail -n 3 || echo "  无每月备份"
    echo ""

    # 计算总备份大小
    TOTAL_SIZE=$(du -sh ${BACKUP_DIR} | awk '{print $1}')
    echo "备份总大小: ${TOTAL_SIZE}"
    echo ""
    echo "========================================="
}

# 主流程
main() {
    print_info "数据库备份脚本"
    print_info "时间: $(date '+%Y-%m-%d %H:%M:%S')"
    echo ""

    create_backup_dirs
    do_backup
    weekly_backup
    monthly_backup
    cleanup_old_backups
    show_stats

    print_info "备份任务完成"
}

# 执行主流程
main "$@"
