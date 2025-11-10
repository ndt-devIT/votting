const PhieuBinhChon = require("../models/PhieuBinhChon");
const mongoose = require("mongoose");

// -------------------- USER VOTE --------------------
exports.voteCandidate = async (req, res) => {
  try {
    const { ungVienId, hangMucId, cuocThiId } = req.body;
    const nguoiDungId = req.user._id;

    // Kiểm tra user đã vote ứng viên này trong hạng mục & cuộc thi chưa
    const exists = await PhieuBinhChon.findOne({
      nguoiDung: nguoiDungId,
      ungVien: ungVienId,
      hangMuc: hangMucId,
      cuocThi: cuocThiId,
    });

    if (exists) {
      return res
        .status(400)
        .json({ message: "Bạn đã bình chọn ứng viên này trong hạng mục này rồi." });
    }

    // Tạo phiếu bình chọn mới
    const phieu = await PhieuBinhChon.create({
      nguoiDung: nguoiDungId,
      ungVien: ungVienId,
      hangMuc: hangMucId,
      cuocThi: cuocThiId,
    });

    res.status(201).json({ message: "Bình chọn thành công!", phieu });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Có lỗi xảy ra khi bình chọn." });
  }
};


// -------------------- CRUD ADMIN --------------------
exports.createVote = async (req, res, next) => {
  try {
    const vote = await PhieuBinhChon.create({
      ...req.body,
      nguoiDung: req.user._id, // từ JWT middleware
    });
    res.status(201).json(vote);
  } catch (err) {
    next(err);
  }
};

exports.getVotes = async (req, res, next) => {
  try {
    const votes = await PhieuBinhChon.find()
      .populate("nguoiDung", "hoTen email")
      .populate("ungVien", "hoTen")
      .populate("hangMuc", "tenHangMuc")
      .populate("cuocThi", "tenCuocThi");
    res.json(votes);
  } catch (err) {
    next(err);
  }
};

exports.getVoteById = async (req, res, next) => {
  try {
    // Nếu params là "me", trả về vote của user hiện tại
    if (req.params.id === "me") {
      const votes = await PhieuBinhChon.find({ nguoiDung: req.user._id })
        .populate("ungVien", "hoTen")
        .populate("hangMuc", "tenHangMuc")
        .populate("cuocThi", "tenCuocThi");
      return res.json(votes);
    }

    // Thông thường, lấy vote theo _id
    const vote = await PhieuBinhChon.findById(req.params.id)
      .populate("nguoiDung", "hoTen email")
      .populate("ungVien", "hoTen")
      .populate("hangMuc", "tenHangMuc")
      .populate("cuocThi", "tenCuocThi");

    if (!vote) return res.status(404).json({ message: "Vote not found" });
    res.json(vote);
  } catch (err) {
    next(err);
  }
};

exports.deleteVote = async (req, res, next) => {
  try {
    const vote = await PhieuBinhChon.findByIdAndDelete(req.params.id);
    if (!vote) return res.status(404).json({ message: "Vote not found" });
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    next(err);
  }
};

// -------------------- ROUTE GET MỚI --------------------
// Lấy vote của user hiện tại
exports.getMyVotes = async (req, res, next) => {
  try {
    const votes = await PhieuBinhChon.find({ nguoiDung: req.user._id })
      .populate("ungVien", "hoTen")
      .populate("hangMuc", "tenHangMuc")
      .populate("cuocThi", "tenCuocThi");
    res.json(votes);
  } catch (err) {
    next(err);
  }
};

// Lấy tất cả vote của 1 ứng viên
exports.getVotesByCandidate = async (req, res, next) => {
  try {
    const votes = await PhieuBinhChon.find({ ungVien: req.params.candidateId })
      .populate("nguoiDung", "hoTen email")
      .populate("hangMuc", "tenHangMuc")
      .populate("cuocThi", "tenCuocThi");
    res.json(votes);
  } catch (err) {
    next(err);
  }
};

// Lấy số lượt vote của 1 ứng viên
exports.getVoteCountByCandidate = async (req, res, next) => {
  try {
    const count = await PhieuBinhChon.countDocuments({
      ungVien: req.params.candidateId,
    });
    res.json({ candidateId: req.params.candidateId, votes: count });
  } catch (err) {
    next(err);
  }
};

// Lấy vote theo hạng mục
exports.getVotesByCategory = async (req, res, next) => {
  try {
    const votes = await PhieuBinhChon.find({ hangMuc: req.params.categoryId })
      .populate("nguoiDung", "hoTen email")
      .populate("ungVien", "hoTen")
      .populate("cuocThi", "tenCuocThi");
    res.json(votes);
  } catch (err) {
    next(err);
  }
};

// Lấy vote theo cuộc thi
exports.getVotesByContest = async (req, res, next) => {
  try {
    const votes = await PhieuBinhChon.find({ cuocThi: req.params.contestId })
      .populate("nguoiDung", "hoTen email")
      .populate("ungVien", "hoTen")
      .populate("hangMuc", "tenHangMuc");
    res.json(votes);
  } catch (err) {
    next(err);
  }
};
// -------------------- GET RANKING --------------------
// categoryId = "all" => tất cả hạng mục của contest
exports.getRanking = async (req, res, next) => {
  try {
    const { contestId, categoryId } = req.params;

    const matchStage = {
      cuocThi: new mongoose.Types.ObjectId(contestId),
    };
    if (categoryId && categoryId !== "all") {
      matchStage.hangMuc = new mongoose.Types.ObjectId(categoryId);
    }

    const ranking = await PhieuBinhChon.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: "$ungVien",
          voteCount: { $sum: 1 },
        },
      },
      { $sort: { voteCount: -1 } },
      {
        $lookup: {
          from: "ungviens", // tên collection của model UngVien
          localField: "_id",
          foreignField: "_id",
          as: "ungVien",
        },
      },
      { $unwind: "$ungVien" },
      {
        $project: {
          _id: "$ungVien._id",
          hoTen: "$ungVien.hoTen",
          moTa: "$ungVien.moTa",
          voteCount: 1,
        },
      },
    ]);

    res.json(ranking);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Có lỗi khi lấy bảng xếp hạng." });
  }
};