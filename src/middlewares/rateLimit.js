const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 phút
  max: 100, // tối đa 100 request mỗi IP
  message: 'Too many requests from this IP, please try again later',
  standardHeaders: true, // gửi thông tin giới hạn trong header
  legacyHeaders: false,
});

module.exports = limiter;
