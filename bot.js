const TelegramBot = require('node-telegram-bot-api');

// 🔐 Твой токен от BotFather
const token = '7603034984:AAH9n7DmxVFStq52NdXnKjWGC-_PIgE5VeA';
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

// 💬 Приветствие по команде /start (с исправлением для ПК)
bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  const messageId = msg.message_id;

  // Удаляем старое сообщение (если оно есть)
  try {
    await bot.deleteMessage(chatId, messageId);
  } catch (err) {
    // Если удалить не удалось (например, нет предыдущего сообщения)
    console.log('Старое сообщение не найдено');
  }

  // Отправляем новое приветствие
  bot.sendMessage(chatId, `
👋 Привет! Я бот Александра — разработчика сайтов и ботов из Беларуси

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
  const messageId = query.message.message_id;
  const data = query.data;

  if (data === 'projects') {
    bot.editMessageText(`
📌 Вот некоторые из моих работ:

1. Vite + React сайт — современный интерфейс
2. CRM-панель — управление клиентами
3. WhatsApp бот — автоматизация ответов
4. Discord бот — модерация серверов

⬅️ Назад`, {
      chat_id: chatId,
      message_id: messageId,
      ...mainMenu()
    });
  }

  if (data === 'prices') {
    bot.editMessageText(`
💰 Примерные цены:

- Лендинг: от $50
- Telegram-бот: от $70
- WhatsApp интеграция: от $80
- Дизайн + верстка: от $60 за страницу

⬅️ Назад`, {
      chat_id: chatId,
      message_id: messageId,
      ...mainMenu()
    });
  }

  if (data === 'contact') {
    bot.editMessageText(`
📲 Свяжись со мной напрямую:

Telegram: @alex_dev  
Email: alex@example.com  
GitHub: github.com/alex-dev  

⬅️ Назад`, {
      chat_id: chatId,
      message_id: messageId,
      ...mainMenu()
    });
  }
});