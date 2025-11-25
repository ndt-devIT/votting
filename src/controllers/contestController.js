const CuocThi = require("../models/CuocThi");

// 🔹 Tạo cuộc thi (tự động gán người tạo)
exports.createContest = async (req, res, next) => {
  try {
    const data = req.body;

    // Gán người tạo từ token
    data.nguoiTao = req.user._id;

    const contest = await CuocThi.create(data);
    const populatedContest = await contest.populate("nguoiTao", "hoTen email");

    res.status(201).json(populatedContest);
  } catch (err) {
    console.error("❌ Lỗi tạo cuộc thi:", err);
    next(err);
  }
};

// 🔹 Lấy tất cả cuộc thi (hiển thị luôn người tạo)
exports.getContests = async (req, res, next) => {
  try {
    const contests = await CuocThi.find().populate("nguoiTao", "hoTen email");
    res.json(contests);
  } catch (err) {
    console.error("❌ Lỗi lấy danh sách cuộc thi:", err);
    next(err);
  }
};

// 🔹 Lấy các cuộc thi CỦA TÔI (cho admin)
exports.getMyContests = async (req, res, next) => {
  try {
    // 1. Tạo query CỐ ĐỊNH theo ID của admin đã đăng nhập
    const query = { nguoiTao: req.user.id }; // 2. Thực thi query

    const contests = await CuocThi.find(query).populate(
      "nguoiTao",
      "hoTen email"
    );
    res.json(contests);
  } catch (err) {
    console.error("❌ Lỗi lấy danh sách cuộc thi của tôi:", err);
    next(err);
  }
};

// 🔹 Lấy chi tiết 1 cuộc thi
exports.getContestById = async (req, res, next) => {
  try {
    const contest = await CuocThi.findById(req.params.id).populate(
      "nguoiTao",
      "hoTen email"
    );
    if (!contest) return res.status(404).json({ message: "Contest not found" });
    res.json(contest);
  } catch (err) {
    console.error("❌ Lỗi lấy chi tiết cuộc thi:", err);
    next(err);
  }
};

// 🔹 Cập nhật cuộc thi
exports.updateContest = async (req, res, next) => {
  try {
    const contest = await CuocThi.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }).populate("nguoiTao", "hoTen email");
    if (!contest) return res.status(404).json({ message: "Contest not found" });
    res.json(contest);
  } catch (err) {
    console.error("❌ Lỗi cập nhật cuộc thi:", err);
    next(err);
  }
};

// 🔹 Xóa cuộc thi
exports.deleteContest = async (req, res, next) => {
  try {
    const contest = await CuocThi.findByIdAndDelete(req.params.id);
    if (!contest) return res.status(404).json({ message: "Contest not found" });
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error("❌ Lỗi xóa cuộc thi:", err);
    next(err);
  }
};
