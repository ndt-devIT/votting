const serverless = require("serverless-http");
const app = require("../src/app"); // Trỏ đúng vào file app.js của bạn

module.exports.handler = serverless(app);
