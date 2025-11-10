// const mongoose = require('mongoose');
// const dotenv = require('dotenv');

// dotenv.config();

// const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/voting-api';

// const connectDB = async () => {
//   try {
//     await mongoose.connect(MONGO_URI);
//     console.log('MongoDB connected successfully');
//   } catch (error) {
//     console.error('MongoDB connection failed:', error.message);
//     process.exit(1);
//   }
// };

// mongoose.connection.on('disconnected', () => {
//   console.warn('⚠️ MongoDB disconnected!');
// });

// module.exports = connectDB;

const mongoose = require("mongoose");

// Sử dụng biến global để cache kết nối giữa các lần gọi function (hot starts)
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  // Nếu đã có kết nối thì dùng lại ngay
  if (cached.conn) {
    return cached.conn;
  }

  // Nếu chưa có, bắt đầu kết nối mới
  if (!cached.promise) {
    const opts = {
      bufferCommands: false, // Tắt buffering để tránh lỗi timeout chờ đợi vô vọng
      serverSelectionTimeoutMS: 5000, // Giảm thời gian chờ kết nối xuống 5s (mặc định 30s là quá lâu cho serverless)
    };

    console.log("=> Creating new MongoDB connection");
    cached.promise = mongoose
      .connect(process.env.MONGO_URI, opts)
      .then((mongoose) => {
        console.log("MongoDB connected successfully");
        return mongoose;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error("MongoDB connection failed:", e.message);
    throw e;
  }

  return cached.conn;
};

module.exports = connectDB;