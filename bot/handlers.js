const { mainMenu, backButton } = require('./keyboards');
const { getUserName } = require('./utils');

// Обработка /start
async function handleStart(bot, msg) {
  const chatId = msg.chat.id;
  const args = msg.text.split(' ')[1];

  if (!args) {
    await bot.sendMessage(chatId, '👋 Привет! Я бот Александра. Выберите, что хотите узнать:', mainMenu());
    return;
  }

  // ... (весь код из /start, но с использованием mainMenu())
}

// Обработка кнопок
async function handleCallback(bot, query) {
  const chatId = query.message.chat.id;
  const messageId = query.message.message_id;
  const data = query.data;

  // ... (весь код из callback_query)
}

module.exports = { handleStart, handleCallback };