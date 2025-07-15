#!/bin/bash

# 文档部署脚本
# 用于本地测试文档构建和部署流程

set -e

echo "🚀 开始文档部署流程..."

# 检查是否在项目根目录
if [ ! -f "package.json" ]; then
    echo "❌ 错误：请在项目根目录运行此脚本"
    exit 1
fi

# 检查是否安装了依赖
if [ ! -d "node_modules" ]; then
    echo "📦 安装依赖..."
    pnpm install --frozen-lockfile
fi

# 构建文档
echo "🔨 构建文档..."
pnpm docs:build

# 检查构建结果
if [ ! -d "docs/.vitepress/dist" ]; then
    echo "❌ 错误：文档构建失败"
    exit 1
fi

echo "✅ 文档构建成功！"
echo "📁 构建结果位于: docs/.vitepress/dist"

# 可选：启动预览服务器
read -p "🌐 是否启动预览服务器？(y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🌐 启动预览服务器..."
    pnpm docs:preview
fi

echo "🎉 部署流程完成！"
