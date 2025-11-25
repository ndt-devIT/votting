const HangMuc = require("../models/HangMuc");
const CuocThi = require("../models/CuocThi");
// 🔹 Lấy các cuộc thi CỦA TÔI (cho admin)
exports.getMyContests = async (req, res, next) => {
  try {
    // 1. Tạo query CỐ ĐỊNH theo ID của admin đã đăng nhập
    const query = { nguoiTao: req.user.id };

    // 2. Thực thi query
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

exports.createCategory = async (req, res, next) => {
  try {
    const category = await HangMuc.create(req.body);
    res.status(201).json(category);
  } catch (err) {
    next(err);
  }
};

// SỬA LẠI HÀM NÀY
exports.getCategories = async (req, res, next) => {
  try {
    // 1. Lấy contestId từ query string (ví dụ: ?contestId=abc)
    const { contestId } = req.query;

    // 2. Tạo một đối tượng query rỗng
    const query = {};

    // 3. Nếu frontend CÓ gửi lên contestId, thêm nó vào bộ lọc
    if (contestId) {
      // Giả sử trường trong model HangMuc của bạn tên là 'cuocThi'
      query.cuocThi = contestId;
    }

    // 4. Dùng đối tượng query này để tìm kiếm
    // - Nếu có contestId, nó sẽ là: find({ cuocThi: '...' })
    // - Nếu không có, nó sẽ là: find({}) (lấy tất cả)
    const categories = await HangMuc.find(query).populate("cuocThi");

    res.json(categories);
  } catch (err) {
    next(err);
  }
};

// 🔹 Lấy các hạng mục CỦA TÔI (theo các cuộc thi của admin)
exports.getMyCategories = async (req, res, next) => {
  try {
    // 1. Tìm tất cả ID các cuộc thi mà admin này sở hữu
    const myContests = await CuocThi.find({ nguoiTao: req.user.id }).select(
      "_id"
    );

    // 2. Chuyển mảng đối tượng [{_id: '...'}, ...] thành mảng ID ['...', '...']
    const contestIds = myContests.map((contest) => contest._id);

    // 3. Tìm tất cả hạng mục có trường 'cuocThi' nằm trong mảng ID trên
    const categories = await HangMuc.find({
      cuocThi: { $in: contestIds },
    }).populate("cuocThi", "tenCuocThi"); // Thêm: Lấy luôn tên cuộc thi để tham chiếu

    res.json(categories);
  } catch (err) {
    console.error("❌ Lỗi lấy danh sách hạng mục của tôi:", err);
    next(err);
  }
};

exports.getCategoryById = async (req, res, next) => {
  try {
    const category = await HangMuc.findById(req.params.id).populate("cuocThi");
    if (!category)
      return res.status(404).json({ message: "Category not found" });
    res.json(category);
  } catch (err) {
    next(err);
  }
};

exports.updateCategory = async (req, res, next) => {
  try {
    const category = await HangMuc.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!category)
      return res.status(404).json({ message: "Category not found" });
    res.json(category);
  } catch (err) {
    next(err);
  }
};

exports.deleteCategory = async (req, res, next) => {
  try {
    const category = await HangMuc.findByIdAndDelete(req.params.id);
    if (!category)
      return res.status(404).json({ message: "Category not found" });
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    next(err);
  }
};
