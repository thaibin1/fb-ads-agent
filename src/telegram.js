const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const BASE_URL = `https://api.telegram.org/bot${BOT_TOKEN}`;

/**
 * Gửi tin nhắn văn bản (Markdown) qua Telegram.
 * @param {string} text - Nội dung muốn gửi.
 */
async function sendTelegramMessage(text) {
  try {
    const url = `${BASE_URL}/sendMessage`;
    const response = await axios.post(url, {
      chat_id: CHAT_ID,
      text: text,
      parse_mode: 'Markdown'
    });

    console.log('✅ Đã gửi báo cáo qua Telegram thành công!');
    return response.data;
  } catch (error) {
    console.error('Lỗi khi gửi Telegram:', error.response ? error.response.data : error.message);
    throw error;
  }
}

module.exports = {
  sendTelegramMessage
};
