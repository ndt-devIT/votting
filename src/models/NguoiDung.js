// models/NguoiDung.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const NguoiDungSchema = new mongoose.Schema(
  {
    hoTen: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    // SỬA 1: Thêm 'select: false'
    password: { type: String, select: false },

    role: {
      type: String,
      enum: ["admin", "superadmin", "user"],
      // SỬA 2: Đổi "admin" thành "user"
      default: "admin",
    },
    googleId: { type: String },
    status: { type: Number, enum: [0, 1], default: 1 }, // Phần OTP (đã đúng)

    isVerified: {
      type: Boolean,
      default: false,
    },
    otp: {
      type: String,
    },
    otpExpires: {
      type: Date,
    },
  },
  { timestamps: true }
);

// Hook 'pre' (đã đúng, không đổi)
NguoiDungSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  if (!this.password) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Method 'comparePassword' (đã đúng, không đổi)
NguoiDungSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

// 'toJSON' (đã đúng, không đổi)
NguoiDungSchema.set("toJSON", {
  transform: (doc, ret) => {
    delete ret.password;
    delete ret.otp;
    delete ret.otpExpires;
    return ret;
  },
});

module.exports = mongoose.model("NguoiDung", NguoiDungSchema);
