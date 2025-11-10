require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const bcrypt = require("bcryptjs"); // nếu cần hash password
const NguoiDung = require("./models/NguoiDung");
const CuocThi = require("./models/CuocThi");
const HangMuc = require("./models/HangMuc");
const UngVien = require("./models/UngVien");

async function seed() {
  try {
    await connectDB();

    // Xóa dữ liệu cũ
    await NguoiDung.deleteMany();
    await CuocThi.deleteMany();
    await HangMuc.deleteMany();
    await UngVien.deleteMany();

    // Tạo user admin với password hash
    const hashedPassword = await bcrypt.hash("123456", 10);
    const admin = await NguoiDung.create({
      hoTen: "Admin",
      email: "admin@gmail.com",
      password: hashedPassword,
    });

    // Tạo Contest
    const cuocThi = await CuocThi.create({
      tenCuocThi: "Cuộc thi AI 2025",
      ngayBatDau: new Date("2025-11-01"),
      ngayKetThuc: new Date("2025-11-30"),
      moTa: "Mô tả cuộc thi",
    });

    // Tạo Category
    const category = await HangMuc.create({
      tenHangMuc: "Top Student",
      cuocThi: cuocThi._id, // sửa từ contest._id => cuocThi._id
    });

    // Tạo Candidate
    const candidate = await UngVien.create({
      hoTen: "Tran Van B",
      hangMuc: category._id,
    });

    console.log("✅ Seed dữ liệu thành công!");
    console.log("Admin email: admin@gmail.com, password: 123456");
    console.log("Contest ID:", cuocThi._id);
    console.log("Category ID:", category._id);
    console.log("Candidate ID:", candidate._id);

    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();
