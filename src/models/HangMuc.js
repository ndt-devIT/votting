const mongoose = require('mongoose');

const HangMucSchema = new mongoose.Schema(
  {
    tenHangMuc: { type: String, required: true },
    moTa: { type: String },
    cuocThi: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CuocThi",
      required: true,
    },
    status: { type: Number, enum: [0, 1], default: 1 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('HangMuc', HangMucSchema);
