#!/bin/bash

echo "🧪 開始運行測試套件..."
echo ""

# 檢查是否在正確的目錄（檢查是否有 frontend 和 backend 目錄）
if [ ! -d "frontend" ] || [ ! -d "backend" ]; then
    echo "❌ 錯誤：請在專案根目錄執行此腳本"
    echo "   專案根目錄應該包含 frontend/ 和 backend/ 目錄"
    exit 1
fi

# 安裝前端測試依賴
echo "📦 安裝前端測試依賴..."
cd frontend
npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event jest jest-environment-jsdom vite-jest

# 運行前端測試
echo ""
echo "🔍 運行前端測試..."
npm test -- --passWithNoTests

# 返回根目錄
cd ..

# 安裝後端測試依賴
echo ""
echo "📦 安裝後端測試依賴..."
cd backend
npm install --save-dev jest supertest nodemon

# 運行後端測試
echo ""
echo "🔍 運行後端測試..."
npm test -- --passWithNoTests

# 返回根目錄
cd ..

echo ""
echo "✅ 所有測試完成！"
echo ""
echo "📊 測試結果："
echo "   - 前端測試：查看 frontend/coverage/ 目錄"
echo "   - 後端測試：查看 backend/coverage/ 目錄"
echo ""
echo "🚀 單獨運行測試："
echo "   - 前端：cd frontend && npm test"
echo "   - 後端：cd backend && npm test"
echo "   - 監視模式：npm test -- --watch"
echo "   - 覆蓋率：npm test -- --coverage"
