// Форматирование даты
function formatDate(date) {
  return new Date(date).toLocaleString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// Экранирование для Markdown
function escapeMarkdown(text) {
  return text.replace(/[_*[\]()~`>#+\-=|{}.!]/g, '\\$&');
}

// Валидация email
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Получение имени пользователя
function getUserName(user) {
  return user.username 
    ? `@${user.username}` 
    : user.first_name || 'Пользователь';
}

// Генерация уникального ID для заявки
function generateOrderId() {
  return `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
}

// Ограничение текста (для превью)
function truncateText(text, maxLength = 100) {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

// Проверка на админа
function isAdmin(chatId) {
  return chatId.toString() === process.env.ADMIN_CHAT_ID;
}

module.exports = {
  formatDate,
  escapeMarkdown,
  isValidEmail,
  getUserName,
  generateOrderId,
  truncateText,
  isAdmin
};