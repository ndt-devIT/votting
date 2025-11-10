const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const NguoiDungSchema = new mongoose.Schema(
  {
    hoTen: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String }, // null nếu đăng nhập Google OAuth
    role: {
      type: String,
      enum: ["admin", "superadmin", "user"],
      default: "admin",
    },
    googleId: { type: String }, // dùng khi login bằng Google
    status: { type: Number, enum: [0, 1], default: 1 },
  },
  { timestamps: true }
);

// Hash password trước khi save
NguoiDungSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  if (!this.password) return next(); // nếu password null/undefined (Google login)
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

NguoiDungSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.password) return false; // không có password để so sánh
  return bcrypt.compare(candidatePassword, this.password);
};

NguoiDungSchema.set("toJSON", {
  transform: (doc, ret) => {
    delete ret.password;
    return ret;
  },
});


module.exports = mongoose.model('NguoiDung', NguoiDungSchema);
