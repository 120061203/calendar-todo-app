const axios = require('axios');

const API_BASE = 'http://localhost:4000/api';

async function testAPI() {
  try {
    console.log('🧪 開始測試 API...\n');

    // 測試獲取 todos
    console.log('1. 測試 GET /api/todos');
    const todosResponse = await axios.get(`${API_BASE}/todos`);
    console.log(`   狀態: ${todosResponse.status}`);
    console.log(`   資料筆數: ${todosResponse.data.length}`);
    console.log(`   最新一筆: ${JSON.stringify(todosResponse.data[0], null, 2)}\n`);

    // 測試新增 todo
    console.log('2. 測試 POST /api/todos');
    const newTodo = {
      title: `測試待辦事項 ${Date.now()}`,
      due_date: '2024-12-31'
    };
    const addTodoResponse = await axios.post(`${API_BASE}/todos`, newTodo);
    console.log(`   狀態: ${addTodoResponse.status}`);
    console.log(`   新增的資料: ${JSON.stringify(addTodoResponse.data, null, 2)}\n`);

    // 測試獲取 events
    console.log('3. 測試 GET /api/events');
    const eventsResponse = await axios.get(`${API_BASE}/events`);
    console.log(`   狀態: ${eventsResponse.status}`);
    console.log(`   資料筆數: ${eventsResponse.data.length}\n`);

    // 測試新增 event
    console.log('4. 測試 POST /api/events');
    const newEvent = {
      title: `測試事件 ${Date.now()}`,
      start_time: '2024-12-31 10:00:00',
      end_time: '2024-12-31 11:00:00'
    };
    const addEventResponse = await axios.post(`${API_BASE}/events`, newEvent);
    console.log(`   狀態: ${addEventResponse.status}`);
    console.log(`   新增的資料: ${JSON.stringify(addEventResponse.data, null, 2)}\n`);

    console.log('✅ 所有 API 測試完成！');

  } catch (error) {
    console.error('❌ API 測試失敗:', error.message);
    if (error.response) {
      console.error('   響應狀態:', error.response.status);
      console.error('   錯誤詳情:', error.response.data);
    }
  }
}

// 如果直接執行此腳本
if (require.main === module) {
  testAPI();
}

module.exports = testAPI;
