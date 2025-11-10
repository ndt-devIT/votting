const mongoose = require('mongoose');

const CuocThiSchema = new mongoose.Schema(
  {
    tenCuocThi: { type: String, required: true },
    moTa: { type: String },
    ngayBatDau: { type: Date, required: true },
    ngayKetThuc: { type: Date, required: true },
    nguoiTao:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "NguoiDung",
      required: true,
    },
    status: { type: Number, enum: [0, 1], default: 1 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('CuocThi', CuocThiSchema);
