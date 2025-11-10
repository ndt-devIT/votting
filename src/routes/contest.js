const express = require("express");
const router = express.Router();
const contestController = require("../controllers/contestController");
const authMiddleware = require("../middlewares/authMiddleware");

// CRUD cuộc thi
router.post("/", authMiddleware, contestController.createContest);
router.get("/", contestController.getContests);
router.get("/:id", contestController.getContestById);
router.put("/:id", authMiddleware, contestController.updateContest);
router.delete("/:id", authMiddleware, contestController.deleteContest);

module.exports = router;
