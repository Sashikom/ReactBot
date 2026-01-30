const { createLogger, transports, format } = require('winston');

// Создаём логгер
const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level.toUpperCase()}]: ${message}`;
    })
  ),
  transports: [
    // Вывод в консоль
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.printf(({ timestamp, level, message }) => {
          const emoji = {
            error: '❌',
            warn: '⚠️',
            info: 'ℹ️',
            debug: '🔧'
          };
          return `${emoji[level] || '📝'} ${timestamp} [${level.toUpperCase()}]: ${message}`;
        })
      )
    }),
    // Запись в файл
    new transports.File({ 
      filename: 'bot.log',
      maxsize: 5 * 1024 * 1024, // 5MB
      maxFiles: 5
    })
  ]
});

module.exports = logger;