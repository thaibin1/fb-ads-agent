const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const FB_ACCESS_TOKEN = process.env.FB_ACCESS_TOKEN;
const AD_ACCOUNT_ID = process.env.FB_AD_ACCOUNT_ID;
const API_VERSION = 'v19.0';
const BASE_URL = `https://graph.facebook.com/${API_VERSION}`;

/**
 * Lấy danh sách Insights của các Campaign đang chạy trong ngày hôm nay.
 */
async function getTodaysCampaignInsights() {
  try {
    const url = `${BASE_URL}/${AD_ACCOUNT_ID}/insights`;
    
    // Các trường dữ liệu muốn lấy
    const fields = [
      'campaign_name',
      'spend',
      'impressions',
      'clicks',
      'cpc',
      'cpm',
      'ctr',
      'actions', // Để tính purchase, messages, v.v.
      'cost_per_action_type'
    ].join(',');

    const params = {
      access_token: FB_ACCESS_TOKEN,
      level: 'campaign', // Trích xuất theo cấp độ chiến dịch
      date_preset: 'today', // Dữ liệu hôm nay
      fields: fields
    };

    const response = await axios.get(url, { params });
    const data = response.data.data;
    
    // Cấu trúc lại dữ liệu cho gọn, phân tách các actions (mua hàng, tin nhắn...)
    const formattedData = data.map(campaign => {
      // Tìm số lượng mua hàng (purchase)
      const purchaseAction = campaign.actions ? campaign.actions.find(a => a.action_type === 'purchase') : null;
      const purchases = purchaseAction ? parseInt(purchaseAction.value) : 0;
      
      return {
        name: campaign.campaign_name,
        spend: parseFloat(campaign.spend),
        impressions: parseInt(campaign.impressions),
        clicks: parseInt(campaign.clicks),
        cpc: campaign.cpc ? parseFloat(campaign.cpc) : 0,
        ctr: campaign.ctr ? parseFloat(campaign.ctr) : 0,
        purchases: purchases,
        cpa: purchases > 0 ? parseFloat(campaign.spend) / purchases : 0,
      };
    });

    return formattedData;

  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu Facebook Ads:', error.response ? error.response.data : error.message);
    throw error;
  }
}

async function getCustomCampaignInsights(since, until) {
  try {
    const url = `${BASE_URL}/${AD_ACCOUNT_ID}/insights`;
    
    const fields = [
      'campaign_name',
      'spend',
      'impressions',
      'clicks',
      'cpc',
      'cpm',
      'ctr',
      'actions',
      'cost_per_action_type'
    ].join(',');

    const params = {
      access_token: FB_ACCESS_TOKEN,
      level: 'campaign',
      time_range: JSON.stringify({ since: since, until: until }),
      fields: fields
    };

    const response = await axios.get(url, { params });
    const data = response.data.data;
    
    const formattedData = data.map(campaign => {
      const purchaseAction = campaign.actions ? campaign.actions.find(a => a.action_type === 'purchase') : null;
      const purchases = purchaseAction ? parseInt(purchaseAction.value) : 0;
      
      return {
        name: campaign.campaign_name,
        spend: parseFloat(campaign.spend),
        impressions: parseInt(campaign.impressions),
        clicks: parseInt(campaign.clicks),
        cpc: campaign.cpc ? parseFloat(campaign.cpc) : 0,
        ctr: campaign.ctr ? parseFloat(campaign.ctr) : 0,
        purchases: purchases,
        cpa: purchases > 0 ? parseFloat(campaign.spend) / purchases : 0,
      };
    });

    return formattedData;

  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu Facebook Ads tuỳ chỉnh:', error.response ? error.response.data : error.message);
    throw error;
  }
}

module.exports = {
  getTodaysCampaignInsights,
  getCustomCampaignInsights
};
