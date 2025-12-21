const axios = require('axios');

// 测试前端API连接
async function testApiConnection() {
  try {
    console.log('测试前端API连接...');
    // 测试前端开发服务器是否运行
    const frontendResponse = await axios.get('http://localhost:5173', {
      timeout: 5000
    });
    console.log('✅ 前端开发服务器正常运行');
  } catch (error) {
    console.error('❌ 前端开发服务器未运行或无法访问:', error.message);
  }

  try {
    console.log('\n测试后端API连接...');
    // 测试后端API是否运行
    const backendResponse = await axios.get('http://localhost:8080/api/assets?userId=1', {
      timeout: 5000
    });
    console.log('✅ 后端API正常运行，返回数据:', backendResponse.data);
  } catch (error) {
    console.error('❌ 后端API未运行或无法访问:', error.message);
  }
}

testApiConnection();
