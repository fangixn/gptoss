// 测试后端API的脚本
const fetch = global.fetch || require('node-fetch');

async function testBackendAPI() {
  console.log('🧪 测试后端API集成...\n');

  try {
    // 测试获取后端配置的模型
    console.log('1️⃣ 测试获取后端配置模型...');
    const response = await fetch('http://localhost:3000/api/chat');
    const data = await response.json();
    
    if (data.success) {
      console.log('✅ 成功获取后端配置模型:');
      data.availableModels.forEach(model => {
        console.log(`   - ${model.name} (${model.model})`);
      });
      console.log(`   总计: ${data.totalConfigured} 个模型\n`);
    } else {
      console.log('❌ 获取后端模型失败\n');
    }

    // 测试聊天API (需要环境变量)
    if (process.env.FIREWORKS_API_KEY) {
      console.log('2️⃣ 测试GPT-OSS模型聊天 (Fireworks AI)...');
      const chatResponse = await fetch('http://localhost:3000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-oss-20b',
          prompt: 'Hello, this is a test message for Fireworks API.',
          useBackendKey: true
        })
      });

      const chatData = await chatResponse.json();
      
      if (chatData.success) {
        console.log('✅ Fireworks GPT-OSS模型响应成功:');
        console.log(`   回复: ${chatData.response.substring(0, 100)}...\n`);
      } else {
        console.log('❌ Fireworks GPT-OSS模型测试失败:');
        console.log(`   错误: ${chatData.error}\n`);
      }
    } else {
      console.log('2️⃣ 跳过聊天测试 (未设置 FIREWORKS_API_KEY)\n');
    }

    console.log('🎉 测试完成!');
    
  } catch (error) {
    console.error('❌ 测试过程中出现错误:', error.message);
  }
}

// 运行测试
testBackendAPI();
