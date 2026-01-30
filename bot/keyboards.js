// Главное меню
function mainMenu() {
  return {
    reply_markup: {
      inline_keyboard: [
        [{ text: '💼 Мои проекты', callback_data: 'projects' }],
        [{ text: '💰 Цены', callback_data: 'prices' }],
        [{ text: '🌐 Портфолио', url: 'https://твой-сайт.com' }],
        [{ text: '📲 Связаться', callback_data: 'contact' }]
      ]
    }
  };
}

// Меню услуг
function serviceMenu() {
  return {
    reply_markup: {
      inline_keyboard: [
        [{ text: '📝 Лендинг', callback_data: 'service_landing' }],
        [{ text: '🎨 Портфолио', callback_data: 'service_portfolio' }],
        [{ text: '📊 CRM-панель', callback_data: 'service_crm' }],
        [{ text: '🤖 Telegram-бот', callback_data: 'service_bot' }],
        [{ text: '❌ Отмена', callback_data: 'cancel' }]
      ]
    }
  };
}

// Кнопка отмены
function cancelButton() {
  return {
    reply_markup: {
      inline_keyboard: [
        [{ text: '❌ Отмена', callback_data: 'cancel' }]
      ]
    }
  };
}

// Кнопка назад
function backButton() {
  return {
    reply_markup: {
      inline_keyboard: [
        [{ text: '⬅️ Назад', callback_data: 'back_to_menu' }]
      ]
    }
  };
}

module.exports = { mainMenu, serviceMenu, cancelButton, backButton };