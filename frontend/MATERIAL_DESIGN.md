# Material Design 功能說明

## 🎨 設計特色

這個應用程式完全採用 Material Design 3 的設計原則，提供現代化、一致性的使用者體驗。

### 主要元件

#### 1. 待辦事項清單 (TodoList)
- **Material Cards**: 使用陰影和圓角設計
- **Material TextField**: 帶有焦點狀態的輸入框
- **Material Button**: 懸停效果和點擊動畫
- **Material List**: 響應式列表項目
- **Material Chip**: 日期標籤顯示
- **Material Icons**: 語義化圖示

#### 2. 行事曆檢視 (CalendarView)
- **Material Dialog**: 新增事件的模態對話框
- **Material Form Controls**: 日期時間選擇器
- **FullCalendar 整合**: 自定義樣式符合 Material Design
- **Responsive Design**: 支援不同螢幕尺寸

#### 3. 整體佈局
- **Material AppBar**: 頂部導航欄
- **Material Container**: 響應式容器
- **Material Theme**: 統一的色彩和字體系統

### 色彩系統

- **Primary**: #1976d2 (藍色)
- **Secondary**: #dc004e (粉紅色)
- **Background**: #f5f5f5 (淺灰色)
- **Surface**: #ffffff (白色)
- **Text**: #212121 (深灰色)

### 動畫效果

- **Hover Effects**: 卡片懸停時陰影變化
- **Button Animations**: 按鈕點擊時輕微上移
- **Transitions**: 平滑的狀態轉換
- **Focus States**: 清晰的焦點指示

### 響應式設計

- **Mobile First**: 優先考慮行動裝置體驗
- **Breakpoints**: 支援 xs, sm, md, lg, xl 斷點
- **Flexbox Layout**: 靈活的佈局系統
- **Touch Friendly**: 適合觸控操作的元件尺寸

## 🚀 技術實現

### 使用的 Material-UI 元件
- `@mui/material`: 核心元件庫
- `@mui/icons-material`: Material Design 圖示
- `@emotion/react` & `@emotion/styled`: 樣式引擎

### 自定義主題
- 統一的設計語言
- 可擴展的元件樣式
- 一致的間距和圓角系統

### 無障礙設計
- 語義化 HTML 結構
- 適當的 ARIA 標籤
- 鍵盤導航支援
- 高對比度色彩

## 📱 使用方式

1. **新增待辦事項**: 在輸入框中輸入文字，按 Enter 或點擊新增按鈕
2. **新增行事曆事件**: 點擊「新增事件」按鈕，填寫事件詳情
3. **響應式佈局**: 在小螢幕上會自動調整為垂直佈局
4. **主題一致性**: 所有元件都遵循相同的設計原則

## 🔧 自定義

可以在 `src/theme.js` 中修改：
- 色彩配置
- 字體設定
- 元件樣式
- 間距系統
- 陰影效果
