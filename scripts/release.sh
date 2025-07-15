#!/bin/bash

# 发布脚本
# 使用方法: ./scripts/release.sh [patch|minor|major]

set -e

# 确保使用 bash
if [ -z "$BASH_VERSION" ]; then
    echo "This script requires bash"
    exit 1
fi

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 日志函数
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 检查参数
RELEASE_TYPE=${1:-"patch"}
if [ "$RELEASE_TYPE" != "patch" ] && [ "$RELEASE_TYPE" != "minor" ] && [ "$RELEASE_TYPE" != "major" ]; then
    log_error "Invalid release type. Use: patch, minor, or major"
    exit 1
fi

log_info "Starting release process for: $RELEASE_TYPE"

# 在 CI 环境中跳过交互式检查
if [ "$CI" != "true" ]; then
    # 检查工作目录是否干净
    if [ -n "$(git status --porcelain)" ]; then
        log_error "Working directory is not clean. Please commit or stash your changes."
        exit 1
    fi

    # 检查是否在主分支
    CURRENT_BRANCH=$(git branch --show-current)
    if [ "$CURRENT_BRANCH" != "main" ] && [ "$CURRENT_BRANCH" != "master" ]; then
        log_warning "You are not on the main branch. Current branch: $CURRENT_BRANCH"
        read -p "Continue anyway? (y/N): " -n 1 -r
        echo
        if [ "$REPLY" != "y" ] && [ "$REPLY" != "Y" ]; then
            log_info "Release cancelled."
            exit 0
        fi
    fi

    # 拉取最新代码
    log_info "Pulling latest changes..."
    git pull origin $CURRENT_BRANCH
else
    log_info "Running in CI environment, skipping interactive checks..."
    CURRENT_BRANCH=$(git branch --show-current)
fi

# 运行预发布检查
log_info "Running pre-release checks..."
pnpm run pre-release

# 生成版本和 changelog
log_info "Generating version and changelog..."
pnpm run version:$RELEASE_TYPE

# 获取新版本号
NEW_VERSION=$(node -p "require('./package.json').version")
log_success "New version: $NEW_VERSION"

# 推送到远程仓库
log_info "Pushing changes to remote repository..."
git push --follow-tags origin $CURRENT_BRANCH

# 发布到 npm
log_info "Publishing packages to npm..."
pnpm run release:core
pnpm run release:nestjs

log_success "Release $NEW_VERSION completed successfully! 🎉"
log_info "Check the packages at:"
log_info "  - https://www.npmjs.com/package/@ilhamtahir/ts-mapper"
log_info "  - https://www.npmjs.com/package/@ilhamtahir/nestjs-mapper"
