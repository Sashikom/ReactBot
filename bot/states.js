// Состояния для форм
const STATES = {
  // Главное меню
  MAIN_MENU: 'main_menu',
  
  // Заказ услуги
  ORDER_SERVICE: 'order_service',
  ORDER_NAME: 'order_name',
  ORDER_EMAIL: 'order_email',
  ORDER_MESSAGE: 'order_message',
  
  // Обратная связь
  FEEDBACK: 'feedback'
};

// Хранилище состояний пользователей (в памяти)
const userStates = new Map();

function setUserState(userId, state, data = {}) {
  userStates.set(userId, { state, data, timestamp: Date.now() });
}

function getUserState(userId) {
  const state = userStates.get(userId);
  
  // Очистка старых состояний (> 1 часа)
  if (state && Date.now() - state.timestamp > 3600000) {
    userStates.delete(userId);
    return null;
  }
  
  return state;
}

function clearUserState(userId) {
  userStates.delete(userId);
}

// Проверка текущего состояния
function isState(userId, state) {
  const userState = getUserState(userId);
  return userState && userState.state === state;
}

module.exports = {
  STATES,
  setUserState,
  getUserState,
  clearUserState,
  isState
};