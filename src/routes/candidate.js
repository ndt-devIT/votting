const express = require('express');
const router = express.Router();
const candidateController = require('../controllers/candidateController');
const authMiddleware = require('../middlewares/authMiddleware');

// CRUD ứng viên
router.post('/', authMiddleware, candidateController.createCandidate);
router.get('/', candidateController.getCandidates);
router.get('/:id', candidateController.getCandidateById);
router.put('/:id', authMiddleware, candidateController.updateCandidate);
router.delete('/:id', authMiddleware, candidateController.deleteCandidate);

module.exports = router;
