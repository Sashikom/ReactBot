const TelegramBot = require('node-telegram-bot-api');

// 🔐 Токен бота
const token = '8813807927:AAFNWSAZjqEC_CnRSN8YoIA0gBxFAbvz55A';
const bot = new TelegramBot(token, { polling: true });

console.log('🤖 Бот запущен...');

// Главное меню
function mainMenu() {
  return {
    reply_markup: {
      inline_keyboard: [
        [{ text: '💼 Мои проекты', callback_data: 'projects' }],
        [{ text: '💰 Цены', callback_data: 'prices' }],
        [{ text: '📲 Связаться', callback_data: 'contact' }]
      ]
    }
  };
}

// /start — стартовое сообщение
bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  const args = msg.text.split(' ')[1]; // Получаем параметр после /start

  if (!args) {
    await bot.sendMessage(chatId, '👋 Привет! Я бот Александра. Выберите, что хотите узнать:', mainMenu());
    return;
  }

  // Обработка параметров из сайта
  if (args === 'react-site') {
    await bot.sendMessage(chatId, '🚀 Вы выбрали Vite + React сайт. Какой тип сайта вам нужен?\n\n1. Лендинг\n2. Портфолио\n3. CRM-панель', {
      reply_markup: {
        inline_keyboard: [
          [{ text: '📝 Лендинг', callback_data: 'react-landing' }],
          [{ text: '🎨 Портфолио', callback_data: 'react-portfolio' }],
          [{ text: '📊 CRM', callback_data: 'react-crm' }],
          [{ text: '⬅️ Назад', callback_data: 'back_to_menu' }]
        ]
      }
    });
  } else if (args === 'portfolio') {
    await bot.sendMessage(chatId, '🎨 Вы выбрали сайт-портфолио. Какие работы показать?', {
      reply_markup: {
        inline_keyboard: [
          [{ text: '🖼️ Дизайн', callback_data: 'portfolio-design' }],
          [{ text: '🧩 UI/UX', callback_data: 'portfolio-ui' }],
          [{ text: '🤖 Боты', callback_data: 'portfolio-bots' }],
          [{ text: '⬅️ Назад', callback_data: 'back_to_menu' }]
        ]
      }
    });
  } else if (args === 'tg-bot') {
    await bot.sendMessage(chatId, '🤖 Вы выбрали Telegram-бота. Какие функции нужны?', {
      reply_markup: {
        inline_keyboard: [
          [{ text: '📋 Квиз', callback_data: 'tg-quiz' }],
          [{ text: '✉️ Форма', callback_data: 'tg-form' }],
          [{ text: '💬 Автоответчик', callback_data: 'tg-auto' }],
          [{ text: '⬅️ Назад', callback_data: 'back_to_menu' }]
        ]
      }
    });
  } else if (args === 'ui-components') {
    await bot.sendMessage(chatId, '🧩 Вы выбрали UI-компоненты. Какие нужны:\n\n1. Кнопки\n2. Модальные окна\n3. Формы', {
      reply_markup: {
        inline_keyboard: [
          [{ text: '🔘 Кнопки', callback_data: 'ui-buttons' }],
          [{ text: '📦 Модалки', callback_data: 'ui-modal' }],
          [{ text: '📝 Формы', callback_data: 'ui-forms' }],
          [{ text: '⬅️ Назад', callback_data: 'back_to_menu' }]
        ]
      }
    });
  } else if (args === 'form') {
    await bot.sendMessage(chatId, '✉️ Вы выбрали контактную форму. Какие данные собирать?\n\n1. Имя + Email + Сообщение\n2. Телефон + Тема\n3. Полный профиль клиента', {
      reply_markup: {
        inline_keyboard: [
          [{ text: '✍️ Минимальная', callback_data: 'form-min' }],
          [{ text: '📄 Средняя', callback_data: 'form-mid' }],
          [{ text: '📊 Полная', callback_data: 'form-full' }],
          [{ text: '⬅️ Назад', callback_data: 'back_to_menu' }]
        ]
      }
    });
  } else {
    await bot.sendMessage(chatId, '👋 Привет! Я бот Александра. Выберите, что хотите узнать:', mainMenu());
  }
});

// Обработка нажатия на кнопки
bot.on('callback_query', async (query) => {
  const chatId = query.message.chat.id;
  const messageId = query.message.message_id;

  if (query.data === 'projects') {
    await bot.editMessageText(`📌 Вот мои проекты:\n\n1. Vite + React сайт — современный интерфейс\n2. CRM-панель — управление клиентами`, {
      chat_id: chatId,
      message_id: messageId,
      ...mainMenu()
    });
  }

  if (query.data === 'prices') {
    await bot.editMessageText(`💰 Примерные цены:\n\n- Лендинг: от 150 BYN\n- Telegram-бот: от 200 BYN\n- WhatsApp интеграция: от 230 BYN`, {
      chat_id: chatId,
      message_id: messageId,
      ...mainMenu()
    });
  }

  if (query.data === 'contact') {
    const contactText = 
` *Свяжись со мной напрямую!*

Я всегда на связи и готов обсудить твой проект.

️ *Email:* 
\`makalaleksandr@gmail.com\`

💬 *Telegram:* 
@MaqBobot`;

    const options = {
      chat_id: query.message.chat.id,
      message_id: query.message.message_id,
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [
            { text: '🌐 Открыть Портфолио', url: 'https://darling-genie-9f2976.netlify.app/#projects' }
          ],
          [
            { text: '💬 Написать мне в Telegram', url: 'https://t.me/MaqBobot' }
          ],
          [
            { text: '⬅️ Назад в главное меню', callback_data: 'back_to_menu' } // ВОТ ЭТА СТРОКА!
          ]
        ]
      }
    };

    try {
      await bot.editMessageText(contactText, options);
    } catch (error) {
      if (error.description && error.description.includes('message is not modified')) {
        console.log('✅ Сообщение уже актуально.');
      } else {
        console.error('❌ Ошибка редактирования:', error);
      }
    }
    
    await bot.answerCallbackQuery(query.id); 
  }      

  if (query.data === 'back_to_menu') {
    await bot.editMessageText('👋 Привет! Я бот Александра. Выберите, что хотите узнать:', {
      chat_id: chatId,
      message_id: messageId,
      ...mainMenu()
    });
  }

  // --- Подробности по услугам ---

  if (query.data === 'react-landing') {
    await bot.sendMessage(chatId, '📝 Лендинг — быстро, чётко, под ключ.\n\n👉 Отправьте тему сайта и целевую аудиторию.');
  }

  if (query.data === 'react-portfolio') {
    await bot.sendMessage(chatId, '🎨 Сайт-портфолио — покажу ваши работы красиво и удобно.\n\n👉 Пришлите примеры своих проектов.');
  }

  if (query.data === 'react-crm') {
    await bot.sendMessage(chatId, '📊 CRM-панель — управление заказами и клиентами.\n\n👉 Опишите вашу систему управления.');
  }

  if (query.data === 'tg-quiz') {
    await bot.sendMessage(chatId, '📋 Квиз — собираю задачу через вопросы.\n\n👉 Расскажите, какие услуги вы предлагаете.');
  }

  if (query.data === 'tg-form') {
    await bot.sendMessage(chatId, '✉️ Форма связи — работает через сайт.\n\n👉 Нужно ли добавить её к вам на страницу?');
  }

  if (query.data === 'tg-auto') {
    await bot.sendMessage(chatId, '💬 Автоответчик — отвечает за вас.\n\n👉 Какие шаблоны ответов использовать?');
  }

  if (query.data === 'form-min') {
    await bot.sendMessage(chatId, '✍️ Минимальная форма:\n\nИмя + Email + Сообщение\n\n👉 Хотите её внедрить на сайт?');
  }

  if (query.data === 'form-mid') {
    await bot.sendMessage(chatId, '📄 Средняя форма:\n\nИмя + Телефон + Тема + Сообщение\n\n👉 Подходит для фрилансеров.');
  }

  if (query.data === 'form-full') {
    await bot.sendMessage(chatId, '📊 Полная форма:\n\nИмя + Email + Телефон + Задача + Бюджет\n\n👉 Для серьёзных проектов.');
  }

  if (query.data === 'ui-buttons') {
    await bot.sendMessage(chatId, '🔘 Кнопки — стильные, адаптивные, переиспользуемые.\n\n👉 Нужны ли вам кнопки для сайта или приложения?');
  }

  if (query.data === 'ui-modal') {
    await bot.sendMessage(chatId, '📦 Модальные окна — для форм, уведомлений, диалогов.\n\n👉 Нужны ли они в ваш проект?');
  }

  if (query.data === 'ui-forms') {
    await bot.sendMessage(chatId, '📝 Формы — логин, регистрация, заявка.\n\n👉 Какие поля должны быть в форме?');
  }

  if (query.data === 'portfolio-design') {
    await bot.sendMessage(chatId, '🖼️ Дизайн — можно сделать через Canva или Figma.\n\n👉 У вас есть свои материалы?');
  }

  if (query.data === 'portfolio-ui') {
    await bot.sendMessage(chatId, '🧩 UI/UX — компоненты для сайтов и приложений.\n\n👉 Какие именно элементы вам нужны?');
  }

  if (query.data === 'portfolio-bots') {
    await bot.sendMessage(chatId, '🤖 Боты — можно создать под любую задачу.\n\n👉 Какой тип бота вам нужен?');
  }
});