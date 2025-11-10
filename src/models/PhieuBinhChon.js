const mongoose = require('mongoose');

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
  },
  { timestamps: true }
);

module.exports = mongoose.model('PhieuBinhChon', PhieuBinhChonSchema);
