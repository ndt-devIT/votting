const express = require("express");
const router = express.Router();
const voteController = require("../controllers/voteController");
const authMiddleware = require("../middlewares/authMiddleware");

// -------------------- USER VOTE --------------------
// Người dùng bình chọn ứng viên (kiểm tra 1 user chỉ vote 1 lần cho 1 ứng viên)
router.post("/", authMiddleware, voteController.voteCandidate);

// Đối soát cuộc thi (Admin/Superadmin mới được dùng)
router.get(
  "/audit/:contestId", 
  authMiddleware, 
  voteController.auditVotes
);
// -------------------- ROUTE GET MỚI --------------------
// Lấy vote của user hiện tại
router.get("/me", authMiddleware, voteController.getMyVotes);// Lấy vote của user hiện tại
router.get("/ad/me", authMiddleware, voteController.getMyVotesAdmin);
router.get("/blockchain/me", authMiddleware, voteController.getMyVotesBlockchain);
// Thêm route này (PHẢI nằm TRƯỚC route '/:id')
router.get(
  "/receipt/:txHash",
  authMiddleware, // (Hoặc bỏ auth nếu muốn link này công khai)
  voteController.getVoteByTxHash
);

// -------------------- CRUD ADMIN --------------------
// Tạo vote (admin)
router.post("/create", authMiddleware, voteController.createVote);

// Lấy tất cả vote
router.get("/", authMiddleware, voteController.getVotes);

// Lấy vote theo ID
router.get("/:id", authMiddleware, voteController.getVoteById);

// Xóa vote
router.delete("/:id", authMiddleware, voteController.deleteVote);



// Lấy tất cả vote của 1 ứng viên
router.get(
  "/candidate/:candidateId",
  authMiddleware,
  voteController.getVotesByCandidate
);

// Lấy số lượt vote của 1 ứng viên (không cần login)
router.get(
  "/candidate/:candidateId/count",
  voteController.getVoteCountByCandidate
);

// Lấy vote theo hạng mục
router.get(
  "/category/:categoryId",
  authMiddleware,
  voteController.getVotesByCategory
);

// Lấy vote theo cuộc thi
router.get(
  "/contest/:contestId",
  authMiddleware,
  voteController.getVotesByContest
);

// -------------------- RANKING --------------------
router.get("/ranking/:contestId/:categoryId", voteController.getRanking);


module.exports = router;
