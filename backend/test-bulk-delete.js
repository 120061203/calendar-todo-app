const axios = require('axios');

const API_BASE = 'http://localhost:4000/api';

async function testBulkDelete() {
  try {
    console.log('🧪 開始測試批量刪除功能...\n');

    // 1. 先獲取所有待辦事項
    console.log('1. 獲取所有待辦事項');
    const todosResponse = await axios.get(`${API_BASE}/todos`);
    console.log(`   總數: ${todosResponse.data.length}`);
    
    // 2. 將幾個項目標記為已完成
    console.log('\n2. 將幾個項目標記為已完成');
    const todosToComplete = todosResponse.data.slice(0, 3); // 取前3個
    const completedTodos = [];
    
    for (const todo of todosToComplete) {
      const updateResponse = await axios.put(`${API_BASE}/todos/${todo.id}`, { completed: true });
      completedTodos.push(updateResponse.data);
      console.log(`   標記完成: ${todo.title} (ID: ${todo.id})`);
    }
    
    // 3. 驗證已完成項目
    console.log('\n3. 驗證已完成項目');
    const updatedTodosResponse = await axios.get(`${API_BASE}/todos`);
    const completedCount = updatedTodosResponse.data.filter(todo => todo.completed).length;
    console.log(`   已完成項目數: ${completedCount}`);
    
    // 4. 測試批量刪除
    console.log('\n4. 測試批量刪除已完成項目');
    for (const todo of completedTodos) {
      const deleteResponse = await axios.delete(`${API_BASE}/todos/${todo.id}`);
      console.log(`   刪除: ${todo.title} (ID: ${todo.id}) - ${deleteResponse.data.message}`);
    }
    
    // 5. 驗證刪除結果
    console.log('\n5. 驗證刪除結果');
    const finalTodosResponse = await axios.get(`${API_BASE}/todos`);
    console.log(`   剩餘項目數: ${finalTodosResponse.data.length}`);
    
    console.log('\n✅ 批量刪除測試完成！');
    
  } catch (error) {
    console.error('❌ 測試失敗:', error.message);
    if (error.response) {
      console.error('   響應狀態:', error.response.status);
      console.error('   錯誤詳情:', error.response.data);
    }
  }
}

// 如果直接執行此腳本
if (require.main === module) {
  testBulkDelete();
}

module.exports = testBulkDelete;
