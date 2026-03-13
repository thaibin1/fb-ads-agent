require('dotenv').config();
const { getTodaysCampaignInsights } = require('./src/fb-api');
const { analyzeAdsPerformance } = require('./src/ai-analyzer');
const { sendTelegramMessage } = require('./src/telegram');

async function testRun() {
  console.log('--- KHỞI ĐỘNG BẢN CHẠY TEST ---');
  try {
    console.log('1. Lấy dữ liệu Facebook...');
    const fbData = await getTodaysCampaignInsights();
    console.log('➡️ Dữ liệu thô:', fbData);

    console.log('\n2. AI Đang Phân Tích...');
    const reportText = await analyzeAdsPerformance(fbData);
    console.log('➡️ Nội dung báo cáo:\n', reportText);

    console.log('\n3. Gửi Telegram...');
    await sendTelegramMessage(reportText);

  } catch (error) {
    console.error('❌ Có lỗi xảy ra trong lúc test:', error.response?.data || error.message);
  }
}

testRun();
