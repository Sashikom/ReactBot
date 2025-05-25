const TelegramBot = require('node-telegram-bot-api');

// 🔐 Твой токен
const token = '7780001573:AAGGLGO5V88dzrmOfRoif1nwu1sAMHUso3k';
const bot = new TelegramBot(token, { polling: true });

console.log('🤖 Бот запущен...');

// Главное меню с кнопками
function mainMenu() {
  return {
    reply_markup: {
      inline_keyboard: [
        [{ text: '💼 Мои проекты', callback_data: 'projects' }],
        [{ text: '💰 Стоимость услуг', callback_data: 'prices' }],
        [{ text: '📲 Связаться со мной', callback_data: 'contact' }]
      ]
    }
  };
}

// 💬 /start
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;

  bot.sendMessage(chatId, `
👋 Привет! Я бот Александра — разработчика сайтов и ботов из Беларуси.

Выбери, что тебе нужно:
• Посмотреть мои работы
• Узнать стоимость услуг
• Написать мне напрямую

📌 Жми на нужную кнопку.
`, mainMenu());
});

// 📁 Обработчик кнопок
bot.on('callback_query', (query) => {
  const chatId = query.message.chat.id;
  const data = query.data;

  if (data === 'projects') {
    bot.editMessageText(`📌 Вот некоторые из моих работ:\n\n1. Vite + React сайт — современный интерфейс\n2. CRM-панель — управление клиентами\n3. WhatsApp бот — автоматизация ответов\n4. Discord бот — модерация серверов`, {
      chat_id: chatId,
      message_id: query.message.message_id,
      ...mainMenu()
    });
  }

  if (data === 'prices') {
    bot.editMessageText(`💰 Примерные цены:\n\n- Лендинг: от $50\n- Telegram-бот: от $70\n- WhatsApp интеграция: от $80\n- Дизайн + верстка: от $60 за страницу`, {
      chat_id: chatId,
      message_id: query.message.message_id,
      ...mainMenu()
    });
  }

  if (data === 'contact') {
    bot.editMessageText(`📲 Свяжись со мной напрямую:\n\nTelegram: @alex_dev\nEmail: alex@example.com\nGitHub: github.com/alex-dev`, {
      chat_id: chatId,
      message_id: query.message.message_id,
      ...mainMenu()
    });
  }
});