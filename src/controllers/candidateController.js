const UngVien = require("../models/UngVien");
const HangMuc = require("../models/HangMuc");
const CuocThi = require("../models/CuocThi");
// === BỔ SUNG ===
// Import model Phiếu Bình Chọn để đếm vote
const PhieuBinhChon = require("../models/PhieuBinhChon");

exports.createCandidate = async (req, res, next) => {
  try {
    const candidate = await UngVien.create(req.body);
    res.status(201).json(candidate);
  } catch (err) {
    next(err);
  }
};

// === SỬA ĐỔI QUAN TRỌNG ===
// Sửa lại hàm này để giải quyết lỗi 429
exports.getCandidates = async (req, res, next) => {
  try {
    // 1. Tạo bộ lọc
    const filter = {};
    if (req.query.categoryId) {
      filter.hangMuc = req.query.categoryId; // Lọc theo hạng mục nếu có
    }
    // (Bạn có thể thêm các filter khác ở đây, ví dụ ?cuocThiId)

    // 2. Tìm ứng viên theo bộ lọc
    const candidates = await UngVien.find(filter)
      .populate({
        path: "hangMuc",
        populate: { path: "cuocThi", model: "CuocThi" },
      })
      .lean(); // Dùng .lean() để tăng tốc độ

    // 3. (GIẢI QUYẾT LỖI 429) Backend tự đếm vote
    // Dùng Promise.all để chạy song song, tăng hiệu suất
    const candidatesWithVotes = await Promise.all(
      candidates.map(async (cand) => {
        const voteCount = await PhieuBinhChon.countDocuments({
          ungVien: cand._id,
        });
        return {
          ...cand,
          voteCount: voteCount, // Gắn voteCount vào kết quả
        };
      })
    );

    res.json(candidatesWithVotes); // Trả về data đã có voteCount
  } catch (err) {
    next(err);
  }
};

// 🔹 Lấy các Ứng viên CỦA TÔI (cũng đã sửa để thêm voteCount)
exports.getMyCandidates = async (req, res, next) => {
  try {
    // 1. Tìm ID cuộc thi
    const myContests = await CuocThi.find({ nguoiTao: req.user.id }).select(
      "_id"
    );
    const contestIds = myContests.map((contest) => contest._id);

    // 2. Tìm ID hạng mục
    const myCategories = await HangMuc.find({
      cuocThi: { $in: contestIds },
    }).select("_id");
    const categoryIds = myCategories.map((category) => category._id);

    // 3. Tìm ứng viên
    const candidates = await UngVien.find({
      hangMuc: { $in: categoryIds },
    })
      .populate({
        path: "hangMuc",
        populate: {
          path: "cuocThi",
          model: "CuocThi",
          select: "tenCuocThi",
        },
      })
      .lean(); // Dùng .lean()

    // 4. (GIẢI QUYẾT LỖI 429) Backend tự đếm vote
    const candidatesWithVotes = await Promise.all(
      candidates.map(async (cand) => {
        const voteCount = await PhieuBinhChon.countDocuments({
          ungVien: cand._id,
        });
        return {
          ...cand,
          voteCount: voteCount, // Gắn voteCount vào kết quả
        };
      })
    );

    res.json(candidatesWithVotes);
  } catch (err) {
    console.error("❌ Lỗi lấy danh sách ứng viên của tôi:", err);
    next(err);
  }
};

exports.getCandidateById = async (req, res, next) => {
  try {
    const candidate = await UngVien.findById(req.params.id).populate("hangMuc");
    if (!candidate)
      return res.status(404).json({ message: "Candidate not found" });
    res.json(candidate);
  } catch (err) {
    next(err);
  }
};

exports.updateCandidate = async (req, res, next) => {
  try {
    const candidate = await UngVien.findByIdAndUpdate(
      req.params.id,
      {
        hoTen: req.body.hoTen,
        moTa: req.body.moTa,
        url: req.body.url,
        imageUrl: req.body.imageUrl, // Thêm imageUrl nếu bạn dùng
        hangMuc: req.body.hangMuc,
        status: req.body.status,
      },
      { new: true }
    );
    if (!candidate)
      return res.status(404).json({ message: "Candidate not found" });
    res.json(candidate);
  } catch (err) {
    next(err);
  }
};

exports.deleteCandidate = async (req, res, next) => {
  try {
    const candidate = await UngVien.findByIdAndDelete(req.params.id);
    if (!candidate)
      return res.status(404).json({ message: "Candidate not found" });

    // TODO: Xóa các phiếu vote liên quan (nếu cần)
    await PhieuBinhChon.deleteMany({ ungVien: req.params.id });

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    next(err);
  }
};
