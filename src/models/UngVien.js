const mongoose = require('mongoose');

const UngVienSchema = new mongoose.Schema(
  {
    hoTen: { type: String, required: true },
    moTa: { type: String },
    url: { type: String },
    hangMuc: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "HangMuc",
      required: true,
    },
    status: { type: Number, enum: [0, 1], default: 1 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('UngVien', UngVienSchema);
