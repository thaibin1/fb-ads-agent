require('dotenv').config();
const { getCustomCampaignInsights } = require('./src/fb-api');
const { analyzeAdsPerformance } = require('./src/ai-analyzer');
const { sendTelegramMessage } = require('./src/telegram');

async function runCustomReport() {
  const since = '2026-02-27';
  const until = '2026-03-12';
  
  console.log(`--- KHỞI ĐỘNG BÁO CÁO TỪ ${since} ĐẾN ${until} ---`);
  try {
    console.log('1. Lấy dữ liệu Facebook...');
    const fbData = await getCustomCampaignInsights(since, until);
    console.log('➡️ Dữ liệu thô:', fbData);

    console.log('\n2. AI Đang Phân Tích...');
    const reportText = await analyzeAdsPerformance(fbData);
    
    // Thêm mốc thời gian vào báo cáo để dễ nhận diện
    const customReportText = `📅 *BÁO CÁO KỲ: ${since} đến ${until}*\n\n` + reportText;
    
    console.log('➡️ Nội dung báo cáo:\n', customReportText);

    console.log('\n3. Gửi Telegram...');
    await sendTelegramMessage(customReportText);

  } catch (error) {
    console.error('❌ Có lỗi xảy ra trong lúc test:', error.response?.data || error.message);
  }
}

runCustomReport();
