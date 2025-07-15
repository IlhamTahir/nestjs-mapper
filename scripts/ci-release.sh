#!/bin/bash

# CI 发布脚本 - 专为 GitHub Actions 设计
# 使用方法: ./scripts/ci-release.sh [patch|minor|major]

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 日志函数
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
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

log_info "Starting CI release process for: $RELEASE_TYPE"

# 显示环境信息
log_info "Node version: $(node --version)"
log_info "NPM version: $(npm --version)"
log_info "PNPM version: $(pnpm --version)"
log_info "Git version: $(git --version)"

# 检查必要的环境变量
if [ -z "$NODE_AUTH_TOKEN" ]; then
    log_error "NODE_AUTH_TOKEN is not set"
    exit 1
fi

if [ -z "$GITHUB_TOKEN" ]; then
    log_error "GITHUB_TOKEN is not set"
    exit 1
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
git push --follow-tags origin HEAD

# 发布到 npm
log_info "Publishing packages to npm..."
pnpm run release:core
pnpm run release:nestjs

log_success "Release $NEW_VERSION completed successfully! 🎉"
log_info "Check the packages at:"
log_info "  - https://www.npmjs.com/package/@ilhamtahir/ts-mapper"
log_info "  - https://www.npmjs.com/package/@ilhamtahir/nestjs-mapper"
