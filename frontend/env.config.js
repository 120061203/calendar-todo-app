// frontend/env.config.js
const getApiUrl = () => {
  // 檢查是否在生產環境
  if (import.meta.env.PROD) {
    // 生產環境使用 Vercel 部署的後端
    return 'https://calendar-todo-app-pi.vercel.app/api';
  }
  
  // 開發環境使用本地後端
  return 'http://localhost:4000/api';
};

export const API_URL = getApiUrl();
