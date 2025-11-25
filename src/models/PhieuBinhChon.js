const mongoose = require("mongoose");
const blockchainService = require("../services/blockchainService"); // Đảm bảo đường dẫn đúng

const PhieuBinhChonSchema = new mongoose.Schema(
  {
    nguoiDung: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "NguoiDung",
      required: true,
    },
    ungVien: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UngVien",
      required: true,
    },
    hangMuc: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "HangMuc",
      required: true,
    },
    cuocThi: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CuocThi",
      required: true,
    },
    ngayBinhChon: { type: Date, default: Date.now },
    status: { type: Number, enum: [0, 1], default: 1 },

    // Trường lưu Hash
    blockchainTxHash: {
      type: String,
      default: null,
      index: true,
    },
  },
  { timestamps: true }
);

// -----------------------------------------------------------------
// ⚡ HOOK: Gửi lên Blockchain chạy ngầm (Non-blocking) ⚡
// -----------------------------------------------------------------
PhieuBinhChonSchema.post("save", function (doc, next) {
  // Chỉ chạy khi tạo mới (createdAt == updatedAt hoặc logic tương tự)
  // Với create() thì nó luôn chạy post save

  // Dùng IIFE để chạy async mà không block 'next()'
  (async () => {
    try {
      // Kiểm tra nếu đã có hash rồi thì thôi (tránh lặp vô tận nếu có update sau này)
      if (doc.blockchainTxHash) return;

      console.log(
        `[Hook] ⏳ Phiếu bầu mới (ID: ${doc._id}). Đang gửi lên blockchain...`
      );

      // 1. Gọi service
      // Lưu ý: Service trả về STRING hash (ví dụ: "0x123...")
      const txHash = await blockchainService.recordVoteOnChain(
        doc._id,
        doc.nguoiDung,
        doc.ungVien,
        doc.hangMuc,
        doc.cuocThi
      );

      // 2. Kiểm tra kết quả
      if (txHash) {
        console.log(
          `[Hook] 🚀 Gửi thành công. Hash: ${txHash}. Đang cập nhật DB...`
        );

        // 3. CẬP NHẬT DB
        // Dùng updateOne trực tiếp vào collection để không kích hoạt lại hook 'save'
        await mongoose
          .model("PhieuBinhChon")
          .updateOne({ _id: doc._id }, { $set: { blockchainTxHash: txHash } });

        console.log(`[Hook] ✅ Đã lưu Hash vào phiếu ${doc._id}.`);
      } else {
        console.error(`[Hook] ❌ Không nhận được Hash từ Blockchain Service.`);
      }
    } catch (error) {
      console.error(`[Hook] ⚠️ LỖI NGẦM:`, error.message);
    }
  })();

  // Gọi next() ngay lập tức để trả response cho User
  next();
});

module.exports = mongoose.model("PhieuBinhChon", PhieuBinhChonSchema);
