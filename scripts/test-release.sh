#!/bin/bash

# 测试发布脚本（不实际发布到 npm）
# 使用方法: ./scripts/test-release.sh [patch|minor|major]

set -e

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
if [[ ! "$RELEASE_TYPE" =~ ^(patch|minor|major)$ ]]; then
    log_error "Invalid release type. Use: patch, minor, or major"
    exit 1
fi

log_info "🧪 Testing release process for: $RELEASE_TYPE"

# 检查工作目录是否干净
if [[ -n $(git status --porcelain) ]]; then
    log_warning "Working directory is not clean. This is a test, so we'll continue."
fi

# 运行预发布检查
log_info "📋 Running pre-release checks..."
if pnpm run pre-release; then
    log_success "✅ Pre-release checks passed!"
else
    log_error "❌ Pre-release checks failed!"
    exit 1
fi

# 模拟版本生成（不实际修改文件）
log_info "🏷️  Simulating version generation..."
CURRENT_VERSION=$(node -p "require('./package.json').version")
log_info "Current version: $CURRENT_VERSION"

# 计算新版本号
IFS='.' read -ra VERSION_PARTS <<< "$CURRENT_VERSION"
MAJOR=${VERSION_PARTS[0]}
MINOR=${VERSION_PARTS[1]}
PATCH=${VERSION_PARTS[2]}

case $RELEASE_TYPE in
    "major")
        NEW_VERSION="$((MAJOR + 1)).0.0"
        ;;
    "minor")
        NEW_VERSION="$MAJOR.$((MINOR + 1)).0"
        ;;
    "patch")
        NEW_VERSION="$MAJOR.$MINOR.$((PATCH + 1))"
        ;;
esac

log_info "New version would be: $NEW_VERSION"

# 检查包构建
log_info "🔨 Testing package builds..."
if pnpm run build; then
    log_success "✅ All packages built successfully!"
else
    log_error "❌ Package build failed!"
    exit 1
fi

# 检查包内容
log_info "📦 Checking package contents..."
for package in "packages/core" "packages/nestjs"; do
    if [[ -d "$package/dist" ]]; then
        log_success "✅ $package/dist exists"
        log_info "   Files: $(ls -la $package/dist | wc -l) items"
    else
        log_error "❌ $package/dist not found"
        exit 1
    fi
done

# 模拟 npm pack（不实际创建 tarball）
log_info "📦 Simulating npm pack..."
log_info "   @ilhamtahir/ts-mapper would be packed from packages/core"
log_info "   @ilhamtahir/nest-mapper would be packed from packages/nestjs"

# 检查 package.json 文件
log_info "📄 Validating package.json files..."
for package in "packages/core" "packages/nestjs"; do
    if [[ -f "$package/package.json" ]]; then
        PACKAGE_NAME=$(node -p "require('./$package/package.json').name")
        PACKAGE_VERSION=$(node -p "require('./$package/package.json').version")
        log_success "✅ $PACKAGE_NAME@$PACKAGE_VERSION"
    else
        log_error "❌ $package/package.json not found"
        exit 1
    fi
done

# 检查必要的文件
log_info "📋 Checking required files..."
REQUIRED_FILES=("README.md" "CHANGELOG.md" "LICENSE")
for file in "${REQUIRED_FILES[@]}"; do
    if [[ -f "$file" ]]; then
        log_success "✅ $file exists"
    else
        log_warning "⚠️  $file not found (recommended)"
    fi
done

# 检查 Git 状态
log_info "🔍 Checking Git status..."
BRANCH=$(git branch --show-current)
log_info "Current branch: $BRANCH"

if [[ "$BRANCH" == "main" || "$BRANCH" == "master" ]]; then
    log_success "✅ On main branch"
else
    log_warning "⚠️  Not on main branch"
fi

# 总结
log_success "🎉 Test release process completed successfully!"
echo
log_info "📊 Summary:"
log_info "   Current version: $CURRENT_VERSION"
log_info "   New version: $NEW_VERSION"
log_info "   Release type: $RELEASE_TYPE"
log_info "   Branch: $BRANCH"
echo
log_info "🚀 To perform actual release, run:"
log_info "   ./scripts/release.sh $RELEASE_TYPE"
echo
log_warning "⚠️  Remember to:"
log_warning "   1. Commit all changes"
log_warning "   2. Be on main/master branch"
log_warning "   3. Have npm publish permissions"
log_warning "   4. Set NPM_TOKEN in CI environment"
