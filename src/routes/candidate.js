const express = require("express");
const router = express.Router();
const candidateController = require("../controllers/candidateController");
const authMiddleware = require("../middlewares/authMiddleware");

// === CÁC ROUTE CỤ THỂ (PHẢI LÊN TRÊN) ===

// 1. (ĐÃ THÊM) Lấy các ứng viên CỦA TÔI (cho admin)
// Route này PHẢI nằm TRƯỚC route '/:id'
router.get(
  "/mycandidates",
  authMiddleware, // Cần xác thực
  candidateController.getMyCandidates
);

// === CÁC ROUTE CHUNG (CÔNG KHAI) ===

// 2. Lấy TẤT CẢ ứng viên (công khai)
router.get("/", candidateController.getCandidates);

// === CÁC ROUTE ĐỘNG (PHẢI NẰM SAU) ===

// 3. Lấy 1 ứng viên (công khai)
// Route động /:id PHẢI nằm SAU /my-candidates
router.get("/:id", candidateController.getCandidateById);

// === CÁC ROUTE HÀNH ĐỘNG (CẦN XÁC THỰC) ===

// 4. Tạo ứng viên mới
router.post("/", authMiddleware, candidateController.createCandidate);

// 5. Cập nhật ứng viên
router.put("/:id", authMiddleware, candidateController.updateCandidate);

// 6. Xóa ứng viên
router.delete("/:id", authMiddleware, candidateController.deleteCandidate);

module.exports = router;
