const PhieuBinhChon = require("../models/PhieuBinhChon");
const HangMuc = require("../models/HangMuc");
const CuocThi = require("../models/CuocThi");
const blockchainService = require("../services/blockchainService");
const UngVien = require("../models/UngVien");

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
      return res.status(400).json({
        message: "Bạn đã bình chọn ứng viên này trong hạng mục này rồi.",
      });
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
    // === 1. XỬ LÝ THAM SỐ TỪ FRONTEND (MỚI) ===
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 0; // Nếu không truyền limit, mặc định là 0 (lấy hết)
    const skip = (page - 1) * limit;

    // Tạo bộ lọc (Nếu bạn có gửi filter từ frontend lên)
    const filter = {};
    if (req.query.contestId) filter.cuocThi = req.query.contestId;
    if (req.query.categoryId) filter.hangMuc = req.query.categoryId;
    if (req.query.candidateId) filter.ungVien = req.query.candidateId;
    if (req.query.status) filter.status = req.query.status;

    // Xử lý sắp xếp (Sort)
    let sortOption = {};
    if (req.query.sort) {
      // Ví dụ: sort=-createdAt (Frontend) -> sort: { createdAt: -1 } (Backend)
      const parts = req.query.sort.split("-");
      if (parts.length > 1) {
        sortOption[parts[1]] = -1; // Giảm dần
      } else {
        sortOption[req.query.sort] = 1; // Tăng dần
      }
    } else {
      // Mặc định: Cũ nhất trước (giống code cũ của bạn)
      // HOẶC đổi thành { createdAt: -1 } nếu muốn mặc định là Mới nhất
      sortOption = { _id: 1 };
    }

    // === 2. TRUY VẤN DATABASE (GIỮ NGUYÊN TÍNH NĂNG CŨ) ===
    // Khởi tạo query với populate y hệt code cũ của bạn
    let query = PhieuBinhChon.find(filter)
      .populate("nguoiDung", "hoTen email")
      .populate("ungVien", "hoTen")
      .populate("hangMuc", "tenHangMuc")
      .populate("cuocThi", "tenCuocThi");

    // Áp dụng sắp xếp
    query = query.sort(sortOption);

    // Áp dụng phân trang (Nếu có limit)
    if (limit > 0) {
      query = query.skip(skip).limit(limit);
    }

    // Thực thi query
    const votes = await query;

    // === 3. TRẢ VỀ KẾT QUẢ (CẢI TIẾN) ===
    // Đếm tổng số để frontend biết đường phân trang
    const total = await PhieuBinhChon.countDocuments(filter);

    // Trả về format chuẩn cho cả Admin Table và Dashboard
    res.json({
      data: votes, // Danh sách phiếu
      total: total, // Tổng số phiếu (để phân trang)
      page: page,
      limit: limit,
    });
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

// -------------------- ROUTE GET MỚI --------------------
/**
 * Lấy lịch sử bình chọn của user hiện tại
 */
exports.getMyVotesBlockchain = async (req, res, next) => {
  try {
    // Sửa: dùng req.user.id (nhất quán với các controller khác)
    const votes = await PhieuBinhChon.find({ nguoiDung: req.user.id })
      .sort({ ngayBinhChon: -1 }) // Thêm: Sắp xếp mới nhất lên đầu
      .populate("ungVien", "hoTen")
      .populate("hangMuc", "tenHangMuc")
      .populate("cuocThi", "tenCuocThi");
    res.json(votes);
  } catch (err) {
    next(err);
  }
};

// Thêm hàm mới này
exports.getVoteByTxHash = async (req, res, next) => {
  try {
    const { txHash } = req.params;

    // Tìm phiếu bầu bằng txHash trong CSDL của bạn
    const vote = await PhieuBinhChon.findOne({ blockchainTxHash: txHash })
      .populate("nguoiDung", "hoTen email")
      .populate("ungVien", "hoTen moTa")
      .populate("hangMuc", "tenHangMuc")
      .populate("cuocThi", "tenCuocThi");

    if (!vote) {
      return res.status(404).json({ message: "Không tìm thấy phiếu bầu" });
    }

    // KIỂM TRA QUYỀN (Nếu cần)
    // Đảm bảo người xem là chủ phiếu bầu hoặc là admin
    if (
      req.user.role !== "superadmin" &&
      req.user.role !== "admin" &&
      vote.nguoiDung._id.toString() !== req.user.id
    ) {
      return res
        .status(403)
        .json({ message: "Bạn không có quyền xem phiếu này" });
    }

    res.json(vote);
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

/**
 * Lấy tất cả phiếu bình chọn
 * thuộc về các cuộc thi do admin hiện tại quản lý.
 */
exports.getMyVotesAdmin = async (req, res, next) => {
  try {
    // 1. Tìm tất cả ID các cuộc thi mà admin này sở hữu
    const myContests = await CuocThi.find({ nguoiTao: req.user.id }).select(
      "_id"
    ); // 2. Chuyển mảng đối tượng [{_id: '...'}, ...] thành mảng ID ['...', '...']

    const contestIds = myContests.map((contest) => contest._id); // 3. Tìm tất cả phiếu bình chọn có trường 'cuocThi' nằm trong mảng ID trên

    const votes = await PhieuBinhChon.find({
      cuocThi: { $in: contestIds },
    })
      .sort({ ngayBinhChon: -1 }) // Sắp xếp mới nhất lên đầu
      .populate("nguoiDung", "hoTen email") // Người đã bình chọn
      .populate("ungVien", "hoTen") // Ứng viên được bình chọn
      .populate("hangMuc", "tenHangMuc") // Hạng mục
      .populate("cuocThi", "tenCuocThi"); // Cuộc thi

    res.json(votes);
  } catch (err) {
    console.error("❌ Lỗi lấy danh sách phiếu bình chọn của tôi:", err);
    next(err);
  }
};


// --- ⭐ API ĐỐI SOÁT (AUDIT) - ĐÃ TỐI ƯU ⭐ ---
exports.auditVotes = async (req, res, next) => {
  try {
    const { contestId } = req.params;

    // 1. KIỂM TRA ĐẦU VÀO (Chống lỗi CastError)
    if (!contestId || contestId === "undefined") {
      return res.status(400).json({ message: "ID cuộc thi không hợp lệ." });
    }

    // 2. LẤY DỮ LIỆU HIỆU QUẢ (Query Relational)
    // Thay vì lấy hết rồi lọc, ta đi từ: Cuộc thi -> Hạng mục -> Ứng viên
    
    // B2.1: Lấy danh sách ID các hạng mục thuộc cuộc thi này
    // distinct('_id') trả về mảng ID luôn: ['id1', 'id2'...] gọn nhẹ
    const categoryIds = await HangMuc.find({ cuocThi: contestId }).distinct('_id');

    // B2.2: Tìm các ứng viên thuộc các hạng mục đó
    const candidates = await UngVien.find({ hangMuc: { $in: categoryIds } });

    if (candidates.length === 0) {
        return res.json({ message: "Cuộc thi chưa có ứng viên nào.", report: [] });
    }

    // 3. TÍNH TOÁN SONG SONG (Parallel Processing)
    // Sử dụng Promise.all để đếm phiếu cho tất cả ứng viên cùng lúc
    // Nhanh hơn rất nhiều so với vòng lặp for thường
    const auditList = await Promise.all(candidates.map(async (cand) => {
        // Đếm số phiếu hợp lệ (status: 1) trong MongoDB
        const count = await PhieuBinhChon.countDocuments({ 
            ungVien: cand._id, 
            status: 1 
        });

        return {
            _id: cand._id,
            hoTen: cand.hoTen,
            voteCount: count // Số liệu Web2
        };
    }));

    // 4. GỌI BLOCKCHAIN SERVICE (Web3)
    // Hàm này sẽ lấy số liệu từ Smart Contract và so sánh
    const report = await blockchainService.auditElection(auditList);

    res.json({
      message: "Hoàn tất đối soát dữ liệu.",
      contestId: contestId,
      candidateCount: candidates.length,
      report: report
    });

  } catch (err) {
    console.error("Lỗi Audit:", err);
    next(err);
  }
};