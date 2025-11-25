const mongoose = require("mongoose");
const PhieuBinhChon = require("../src/models/PhieuBinhChon"); // Đường dẫn tới model
const { getBlockchainInstances } = require("../src/services/blockchainService"); // Đường dẫn tới service
require("dotenv").config(); // Load .env từ thư mục gốc

// --- Kết nối DB ---
const connectDB = async () => {
  try {
    // Giả sử bạn lưu URI trong .env
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB đã kết nối để di chuyển dữ liệu...");
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

// --- Hàm di chuyển ---
async function migrate() {
  await connectDB();
  const { contract } = getBlockchainInstances(); // Khởi tạo service

  // 1. Lấy tất cả phiếu bầu từ DB
  const allVotesInDB = await PhieuBinhChon.find({});
  console.log(`Tìm thấy ${allVotesInDB.length} phiếu bầu trong MongoDB.`);

  let migratedCount = 0;
  let skippedCount = 0;
  let failedCount = 0;

  for (const vote of allVotesInDB) {
    const mongoId = vote._id.toString();
    try {
      // 2. Kiểm tra xem phiếu này đã có trên chain chưa
      console.log(`Kiểm tra phiếu ${mongoId}...`);
      const exists = await contract.mongoIdExists(mongoId);

      if (exists) {
        console.log(` -> BỎ QUA (đã có trên chain).`);
        skippedCount++;
        continue;
      }

      // 3. Nếu chưa có, gửi lên chain
      console.log(` -> ĐANG DI CHUYỂN phiếu ${mongoId}...`);

      // Chúng ta phải gọi hàm recordVoteOnChain "tự chế" ở đây
      // vì hàm trong service là "fire-and-forget"
      const tx = await contract.recordVote(
        mongoId,
        vote.nguoiDung.toString(),
        vote.ungVien.toString(),
        vote.hangMuc.toString(),
        vote.cuocThi.toString()
      );

      // Chờ xác nhận (1 block) để tránh lỗi nonce (gửi quá nhanh)
      await tx.wait(1);

      console.log(`   -> THÀNH CÔNG! Tx: ${tx.hash}`);
      migratedCount++;
    } catch (error) {
      console.error(
        `   -> THẤT BẠI khi di chuyển phiếu ${mongoId}:`,
        error.message
      );
      failedCount++;
    }
  }

  console.log("--- DI CHUYỂN HOÀN TẤT ---");
  console.log(`Thành công: ${migratedCount}`);
  console.log(`Bỏ qua (đã tồn tại): ${skippedCount}`);
  console.log(`Thất bại: ${failedCount}`);
  process.exit(0);
}

// Chạy script
migrate();
