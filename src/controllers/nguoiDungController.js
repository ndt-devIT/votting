const NguoiDung = require("../models/NguoiDung");

// [GET] /api/nguoidung?status=1|0|all
exports.getAllNguoiDung = async (req, res) => {
  try {
    // Mặc định chỉ trả status = 1 (active)
    const { status = '1', q, page = 1, limit = 50 } = req.query;
    const filter = {};

    if (status !== 'all') {
      // chấp nhận '0' hoặc '1'
      filter.status = Number(status);
    }

    if (q) {
      // tìm theo tên hoặc email (tùy chọn)
      filter.$or = [
        { hoTen: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } }
      ];
    }

    const skip = (Math.max(1, Number(page)) - 1) * Number(limit);

    const [users, total] = await Promise.all([
      NguoiDung.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      NguoiDung.countDocuments(filter)
    ]);

    res.status(200).json({ data: users, total, page: Number(page), limit: Number(limit) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi server khi lấy danh sách người dùng' });
  }
};

// [PATCH] /api/nguoidung/:id/status  body: { status: 0|1 }
exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (typeof status === 'undefined') {
      return res.status(400).json({ message: 'Thiếu trường status' });
    }
    if (![0,1,'0','1'].includes(status)) {
      return res.status(400).json({ message: 'Status phải là 0 hoặc 1' });
    }

    const user = await NguoiDung.findByIdAndUpdate(id, { status: Number(status) }, { new: true });
    if (!user) return res.status(404).json({ message: 'Không tìm thấy người dùng' });

    res.status(200).json({ message: 'Cập nhật status thành công', user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi server khi cập nhật status' });
  }
};
