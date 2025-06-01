// index.js
const express = require('express');
const line = require('@line/bot-sdk');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// LINE Bot 設定
const config = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET,
};

const client = new line.Client(config);

// Middleware：處理來自 LINE 的 webhook 事件
app.post('/webhook', line.middleware(config), (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
    .catch((err) => {
      console.error('Webhook Error:', err);
      res.status(500).end();
    });
});

// 測試用首頁路徑
app.get('/', (req, res) => {
  res.send('✅ Nora is running 🧠');
});

// 回應處理邏輯
function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null);
  }

  const replyText = `您剛才說的是：「${event.message.text}」🤖\n我是 Nora，有什麼需要幫忙的嗎？`;

  return client.replyMessage(event.replyToken, {
    type: 'text',
    text: replyText,
  });
}

// 啟動伺服器
app.listen(port, () => {
  console.log(`🚀 Nora is listening on port ${port}`);
});
