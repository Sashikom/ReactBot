require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const logger = require('./logger');
const { addUser, addOrder } = require('./database');
const { STATES, setUserState, getUserState, clearUserState, isState } = require('./states');
const { isValidEmail, getUserName } = require('./utils');

// Проверка токена
if (!process.env.BOT_TOKEN) {
  console.error('❌ BOT_TOKEN не найден в .env!');
  process.exit(1);
}

const token = process.env.BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

logger.info('🤖 Бот запущен...');

// Главное меню
function mainMenu() {
  return {
    reply_markup: {
      inline_keyboard: [
        [{ text: '💼 Мои проекты', callback_data: 'projects' }],
        [{ text: '💰 Цены', callback_data: 'prices' }],
        [{ text: '📝 Заказать услугу', callback_data: 'order_service' }],
        [{ text: '🌐 Портфолио', url: 'https://portfolio-alex-olive.vercel.app/#projects' }],
        [{ text: '📲 Связаться', callback_data: 'contact' }]
      ]
    }
  };
}

// Меню выбора услуги
function serviceMenu() {
  return {
    reply_markup: {
      inline_keyboard: [
        [{ text: '📝 Лендинг', callback_data: 'service_landing' }],
        [{ text: '🎨 Портфолио', callback_data: 'service_portfolio' }],
        [{ text: '📊 CRM-панель', callback_data: 'service_crm' }],
        [{ text: '🤖 Telegram-бот', callback_data: 'service_bot' }],
        [{ text: '🧩 UI-компоненты', callback_data: 'service_ui' }],
        [{ text: '❌ Отмена', callback_data: 'cancel_order' }]
      ]
    }
  };
}

// Кнопка отмены
function cancelButton() {
  return {
    reply_markup: {
      inline_keyboard: [
        [{ text: '❌ Отмена', callback_data: 'cancel_order' }]
      ]
    }
  };
}

// /start — стартовое сообщение
bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  const user = msg.from;
  const args = msg.text.split(' ')[1];

  // Добавляем пользователя в БД
  addUser(user);

  // Очищаем состояние
  clearUserState(chatId);

  // Приветственное сообщение
  const welcomeMessage = `👋 Привет, ${user.first_name}!\n\nЯ — бот Александра, разработчика сайтов и ботов из Беларуси 🇧🇾\n\nЧто вас интересует?`;

  if (!args) {
    await bot.sendMessage(chatId, welcomeMessage, mainMenu());
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
    await bot.sendMessage(chatId, welcomeMessage, mainMenu());
  }
});

// Обработка нажатия на кнопки
bot.on('callback_query', async (query) => {
  const chatId = query.message.chat.id;
  const messageId = query.message.message_id;
  const user = query.from;

  // Подтверждаем нажатие
  await bot.answerCallbackQuery(query.id);

  // Обработка заказа услуги
  if (query.data === 'order_service') {
    await bot.editMessageText('💼 Отлично! Давайте оформим заявку.\n\nВыберите услугу:', {
      chat_id: chatId,
      message_id: messageId,
      ...serviceMenu()
    });
    setUserState(chatId, STATES.ORDER_SERVICE);
    return;
  }

  // Выбор конкретной услуги
  if (query.data.startsWith('service_')) {
    const serviceId = query.data.replace('service_', '');
    const services = {
      landing: { title: '📝 Лендинг', price: 'от $50', desc: 'Одностраничный сайт для презентации продукта' },
      portfolio: { title: '🎨 Портфолио', price: 'от $100', desc: 'Сайт для демонстрации ваших работ' },
      crm: { title: '📊 CRM-панель', price: 'от $150', desc: 'Система управления клиентами и заказами' },
      bot: { title: '🤖 Telegram-бот', price: 'от $70', desc: 'Автоматизация общения с клиентами' },
      ui: { title: '🧩 UI-компоненты', price: 'от $30', desc: 'Кнопки, формы, модальные окна' }
    };

    const service = services[serviceId];
    if (service) {
      setUserState(chatId, STATES.ORDER_NAME, { service });
      await bot.sendMessage(
        chatId,
        `✅ Вы выбрали: ${service.title}\n💰 Цена: ${service.price}\n📝 Описание: ${service.desc}\n\nКак вас зовут?`,
        cancelButton()
      );
    }
    return;
  }

  // Отмена заказа
  if (query.data === 'cancel_order') {
    clearUserState(chatId);
    await bot.sendMessage(chatId, '❌ Заказ отменён. Возвращаюсь в меню', mainMenu());
    return;
  }

  // Обработка остальных кнопок
  if (query.data === 'projects') {
    await bot.editMessageText(`📌 Вот мои проекты:\n\n1. Vite + React сайт — современный интерфейс\n2. CRM-панель — управление клиентами`, {
      chat_id: chatId,
      message_id: messageId,
      ...mainMenu()
    });
  }

  if (query.data === 'prices') {
    await bot.editMessageText(`💰 Примерные цены:\n\n- Лендинг: от $50-150 💸\n- Сайт-портфолио: от $100-300 🎨\n- Telegram-бот: от $70-200 🤖\n- CRM-панель: от $150-500 📊\n- UI-компоненты: от $30-100 🧩\n\n⚠️ Точная цена зависит от сложности задачи.`, {
      chat_id: chatId,
      message_id: messageId,
      ...mainMenu()
    });
  }

  if (query.data === 'contact') {
    await bot.editMessageText(
      `📲 Свяжись со мной напрямую:\n\n` +
      `🌐 Портфолио: [Посмотреть работы](https://portfolio-alex-olive.vercel.app/#projects)` +
      `Telegram: [@maksahbot](https://t.me/maksahbot)\n` +
      `Email: [makalaleksandr@gmail.com](mailto:makalaleksandr@gmail.com)`,
      {
        chat_id: chatId,
        message_id: messageId,
        parse_mode: 'Markdown',
        ...mainMenu()
      }
    );
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

// Обработка текстовых сообщений (форма заказа)
bot.on('message', async (msg) => {
  // Игнорируем команды и не-текстовые сообщения
  if (!msg.text || msg.text.startsWith('/')) return;

  const chatId = msg.chat.id;
  const text = msg.text.trim();
  const userState = getUserState(chatId);

  // --- Обработка формы заказа ---

  // 1. Имя
  if (isState(chatId, STATES.ORDER_NAME)) {
    if (text.length < 2) {
      await bot.sendMessage(chatId, '❌ Имя слишком короткое. Попробуйте снова:', cancelButton());
      return;
    }

    setUserState(chatId, STATES.ORDER_EMAIL, {
      ...userState.data,
      name: text
    });

    await bot.sendMessage(chatId, '📧 Отлично! Теперь введите ваш email:', cancelButton());
    return;
  }

  // 2. Email
  if (isState(chatId, STATES.ORDER_EMAIL)) {
    if (!isValidEmail(text)) {
      await bot.sendMessage(chatId, '❌ Неверный формат email. Попробуйте снова:', cancelButton());
      return;
    }

    setUserState(chatId, STATES.ORDER_MESSAGE, {
      ...userState.data,
      email: text
    });

    await bot.sendMessage(chatId, '📝 Отлично! Теперь опишите вашу задачу подробно:', cancelButton());
    return;
  }

  // 3. Сообщение
  if (isState(chatId, STATES.ORDER_MESSAGE)) {
    if (text.length < 10) {
      await bot.sendMessage(chatId, '❌ Слишком короткое сообщение. Опишите подробнее:', cancelButton());
      return;
    }

    // Сохраняем заказ
    const order = addOrder({
      service: userState.data.service,
      name: userState.data.name,
      email: userState.data.email,
      message: text,
      userId: chatId,
      username: msg.from.username
    });

    // Отправляем админу
    if (process.env.ADMIN_CHAT_ID) {
      try {
        await bot.sendMessage(
          process.env.ADMIN_CHAT_ID,
          `📩 <b>Новая заявка!</b>\n\n` +
          `🆔 ID: ${order.id}\n` +
          `💼 Услуга: ${order.service.title}\n` +
          `👤 Имя: ${order.name}\n` +
          `📧 Email: ${order.email}\n` +
          `📝 Задача: ${order.message}\n` +
          `👤 Пользователь: @${order.username || 'не указан'}\n` +
          `⏰ Дата: ${new Date(order.created_at).toLocaleString('ru-RU')}`,
          { parse_mode: 'HTML' }
        );
      } catch (error) {
        logger.error(`Ошибка отправки админу: ${error.message}`);
      }
    }

    // Отправляем пользователю подтверждение
    await bot.sendMessage(
      chatId,
      `✅ <b>Отлично! Ваша заявка принята.</b>\n\n` +
      `🆔 <b>Номер заявки:</b> ${order.id}\n` +
      `💼 <b>Услуга:</b> ${order.service.title}\n` +
      `📧 <b>Email:</b> ${order.email}\n\n` +
      `💬 Я свяжусь с вами в ближайшее время!\n` +
      `Если срочно — пишите в личные сообщения: @maksahbot`,
      {
        parse_mode: 'HTML',
        ...mainMenu()
      }
    );

    logger.info(`Заявка ${order.id} от ${chatId} сохранена`);
    clearUserState(chatId);
    return;
  }

  // --- Обычные сообщения ---

  // Обработка "назад"
  if (text.toLowerCase() === 'назад' || text === '❌ Отмена') {
    clearUserState(chatId);
    await bot.sendMessage(chatId, 'Возвращаюсь в меню', mainMenu());
    return;
  }

  // Отправляем админу
  if (process.env.ADMIN_CHAT_ID && chatId != process.env.ADMIN_CHAT_ID) {
    try {
      await bot.sendMessage(
        process.env.ADMIN_CHAT_ID,
        `📩 Сообщение от ${getUserName(msg.from)} (${chatId}):\n\n${text}`
      );
    } catch (error) {
      logger.error(`Ошибка отправки админу: ${error.message}`);
    }
  }

  // Отправляем пользователю подтверждение
  await bot.sendMessage(
    chatId,
    '✅ Ваше сообщение получено! Я отвечу в ближайшее время.',
    mainMenu()
  );
});

// Обработка ошибок бота
bot.on('polling_error', (error) => {
  logger.error(`❌ Ошибка опроса: ${error.message}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  logger.info('🛑 Бот останавливается...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  logger.info('🛑 Бот останавливается...');
  process.exit(0);
});