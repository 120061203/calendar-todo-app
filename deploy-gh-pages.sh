#!/bin/bash

# GitHub Pages 部署腳本

echo "🚀 開始部署到 GitHub Pages..."

# 進入前端目錄
cd frontend

# 構建生產版本
echo "📦 構建前端..."
npm run build

# 檢查構建是否成功
if [ ! -d "dist" ]; then
    echo "❌ 構建失敗：dist 目錄不存在"
    exit 1
fi

echo "✅ 前端構建成功！"

# 返回根目錄
cd ..

# 創建 gh-pages 分支（如果不存在）
echo "🌿 創建 gh-pages 分支..."
git checkout -b gh-pages 2>/dev/null || git checkout gh-pages

# 清空分支內容（保留 .git 目錄）
echo "🧹 清空分支內容..."
git rm -rf . 2>/dev/null || true
git reset --hard HEAD 2>/dev/null || true

# 複製前端構建文件
echo "📁 複製前端文件..."
cp -r frontend/dist/* .

# 添加所有文件
git add .

# 提交更改
echo "💾 提交更改..."
git commit -m "Deploy to GitHub Pages - $(date)"

# 推送到 GitHub
echo "🚀 推送到 GitHub..."
git push origin gh-pages --force

# 返回 main 分支
echo "🔄 返回 main 分支..."
git checkout main

# 刪除本地 gh-pages 分支
git branch -D gh-pages

echo "🎉 部署完成！"
echo "🌐 你的網站將在以下地址可用："
echo "   https://120061203.github.io/calendar-todo-app/"
echo ""
echo "⚠️  注意：可能需要幾分鐘時間才能生效"
