const { GoogleGenAI } = require('@google/genai');
const dotenv = require('dotenv');

dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

/**
 * Phân tích dữ liệu bằng Gemini AI.
 * @param {Array} fbData - Mảng định dạng từ file fb-api.js.
 */
async function analyzeAdsPerformance(fbData) {
  if (!fbData || fbData.length === 0) {
    return '⚠️ Hiện tại không có chiến dịch quảng cáo nào đang chạy hoặc không có dữ liệu.';
  }

  // Tóm tắt lại dữ liệu để gửi cho AI nhẹ hơn
  const promptData = JSON.stringify(fbData, null, 2);

  const prompt = `Bạn là một chuyên gia về Facebook Ads. Hãy giúp tôi phân tích số liệu quảng cáo của ngày hôm nay.
Tôn chỉ: Báo cáo cực kỳ ngắn gọn, sắc bén, format dễ đọc trên điện thoại, bằng tiếng Việt.

Dưới đây là một mảng JSON chứa số liệu các chiến dịch (Campaign) đang chạy:
\`\`\`json
${promptData}
\`\`\`

Yêu cầu báo cáo:
1. Tổng quan Spend (Chi tiêu), và tổng Purchases (Mua hàng) hoặc actions chính.
2. Liệt kê top 1-2 chiến dịch TỐT NHẤT (dựa vào CPA rẻ, CTR cao).
3. Cảnh báo 1-2 chiến dịch TỆ NHẤT (cần tắt ngay, ví dụ CPA cao bất thường, Spend nhiều mà 0 đơn).
4. Khuyến nghị hành động (VD: "Tắt campaign X, dồn ngân sách cho campaign Y").

Chú ý:
- Phải dùng emoji hợp lý (🔥, 🔴, 📉, 📈)
- Để in đậm, TUYỆT ĐỐI CHỈ DÙNG 1 dấu sao bao quanh chữ (Ví dụ: *Chữ in đậm*). KHÔNG dùng 2 dấu sao (**).
- KHÔNG dùng dấu gạch dưới (_) vì dễ gây lỗi Markdown.
- KHÔNG CẦN CHÀO HỎI DÀI DÒNG, vào thẳng vấn đề luôn.
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error('Lỗi khi gọi Gemini AI:', error);
    return '🔴 Lỗi hệ thống AI khi phân tích số liệu quảng cáo!';
  }
}

module.exports = {
  analyzeAdsPerformance
};
