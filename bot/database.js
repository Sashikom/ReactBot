const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, 'data.json');

// Чтение данных
function readDB() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      return { orders: [], users: [] };
    }
    const data = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Ошибка чтения БД:', error);
    return { orders: [], users: [] };
  }
}

// Запись данных
function writeDB(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error('Ошибка записи БД:', error);
  }
}

// Добавить пользователя
function addUser(user) {
  const db = readDB();
  
  // Проверка на существование
  const exists = db.users.find(u => u.id === user.id);
  if (!exists) {
    db.users.push({
      id: user.id,
      username: user.username,
      first_name: user.first_name,
      last_name: user.last_name,
      joined_at: new Date().toISOString()
    });
    writeDB(db);
  }
  
  return db.users;
}

// Добавить заказ
function addOrder(orderData) {
  const db = readDB();
  
  const order = {
    id: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
    ...orderData,
    created_at: new Date().toISOString(),
    status: 'new'
  };
  
  db.orders.push(order);
  writeDB(db);
  
  return order;
}

// Получить все заказы
function getOrders() {
  const db = readDB();
  return db.orders;
}

// Получить заказ по ID
function getOrderById(orderId) {
  const db = readDB();
  return db.orders.find(o => o.id === orderId);
}

// Обновить статус заказа
function updateOrderStatus(orderId, status) {
  const db = readDB();
  const order = db.orders.find(o => o.id === orderId);
  
  if (order) {
    order.status = status;
    order.updated_at = new Date().toISOString();
    writeDB(db);
    return order;
  }
  
  return null;
}

// Получить статистику
function getStats() {
  const db = readDB();
  const now = new Date();
  const last24h = new Date(now - 24 * 60 * 60 * 1000);
  
  return {
    total_users: db.users.length,
    total_orders: db.orders.length,
    orders_today: db.orders.filter(o => 
      new Date(o.created_at) > last24h
    ).length,
    pending_orders: db.orders.filter(o => o.status === 'new').length
  };
}

module.exports = {
  addUser,
  addOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  getStats
};