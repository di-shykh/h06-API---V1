import rateLimit from 'express-rate-limit';

// Общий лимитер для всех эндпоинтов
export const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 минут
    max: 100, // 100 запросов за 15 минут с одного IP
    message: 'Слишком много запросов с этого IP, попробуйте позже',
    standardHeaders: true, // Возвращает заголовки RateLimit-*
    legacyHeaders: false, // Отключает устаревшие заголовки
});