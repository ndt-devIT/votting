const crypto = require('crypto');

/**
 * Tạo hash SHA-256 từ dữ liệu bất kỳ
 * @param {string | object} data - dữ liệu muốn hash
 * @returns {string} - hash HEX
 */
const createHash = (data) => {
  const stringData = typeof data === 'object' ? JSON.stringify(data) : String(data);
  return crypto.createHash('sha256').update(stringData).digest('hex');
};

/**
 * Kiểm tra dữ liệu có khớp với hash không
 * @param {string | object} data - dữ liệu gốc
 * @param {string} hash - hash để so sánh
 * @returns {boolean} - true nếu khớp
 */
const verifyHash = (data, hash) => {
  const dataHash = createHash(data);
  return dataHash === hash;
};

module.exports = { createHash, verifyHash };
