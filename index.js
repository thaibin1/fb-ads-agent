const express = require('express');
const app = express();
const cron = require('node-cron');
const { getTodaysCampaignInsights } = require('./src/fb-api');
const { analyzeAdsPerformance } = require('./src/ai-analyzer');
const { sendTelegramMessage } = require('./src/telegram');

async function runReport() {
  console.log('--- Bắt đầu lấy số liệu Facebook Ads... ---');
  try {
    // 1. Lấy dữ liệu
    const fbData = await getTodaysCampaignInsights();
    console.log(`Đã lấy xong dữ liệu của ${fbData.length} chiến dịch.`);

    // 2. AI Phân tích
    console.log('Đang chờ AI phân tích...');
    const reportText = await analyzeAdsPerformance(fbData);

    // 3. Gửi Telegram
    await sendTelegramMessage(reportText);

  } catch (error) {
    console.error('❌ Lỗi toàn trính:', error.message);
    // Có lỗi cũng báo về Telegram để biết BOT hỏng
    await sendTelegramMessage(`⚠️ *BOT BÁO LỖI*: Không thể chạy báo cáo.\nLý do: _${error.message}_`).catch(e => console.error(e));
  }
  console.log('-------------------------------------------');
}

// Lên lịch: Chạy vào phút thứ 0 của mỗi giờ (VD: 8h00, 9h00, 10h00...)
// Để test: Bạn có thể đổi lại '* * * * *' (chạy mỗi phút)
console.log('⏳ Bot đã khởi động. Đang chờ đến lịch chạy tiếp theo...');
cron.schedule('0 * * * *', () => {
  const time = new Date().toLocaleString('vi-VN');
  console.log(`[${time}] Bắt đầu thực thi cron job báo cáo hàng giờ.`);
  runReport();
});

// --- Server giả lập để giữ Bot sống trên nền tảng Cloud (Render/Railway) ---
const PORT = process.env.PORT || 3000;
app.get('/', (req, res) => {
  res.send('Trạng thái: Bot Facebook Ads đang hoạt động bình thường! 🟢');
});
app.listen(PORT, () => {
  console.log(`🌐 Máy chủ Web đã khởi động trên port ${PORT}`);
});

// --- Chạy 1 lần cho GitHub Actions ---
if (process.argv.includes('--run-once')) {
  console.log('🚀 Chạy bot ở chế độ manual (1 lần) cho GitHub Actions...');
  runReport().then(() => {
    console.log('✅ Hoàn thành 1 vòng chạy, thoát an toàn.');
    process.exit(0);
  }).catch((err) => {
    console.error('❌ Lỗi:', err);
    process.exit(1);
  });
}
