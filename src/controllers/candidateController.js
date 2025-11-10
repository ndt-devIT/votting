const UngVien = require('../models/UngVien');

exports.createCandidate = async (req, res, next) => {
  try {
    const candidate = await UngVien.create(req.body);
    res.status(201).json(candidate);
  } catch (err) { next(err); }
};

exports.getCandidates = async (req, res, next) => {
  try {
    const candidates = await UngVien.find().populate({
      path: "hangMuc",
      populate: { path: "cuocThi", model: "CuocThi" },
    });
    res.json(candidates);
  } catch (err) {
    next(err);
  }
};


exports.getCandidateById = async (req, res, next) => {
  try {
    const candidate = await UngVien.findById(req.params.id).populate('hangMuc');
    if (!candidate) return res.status(404).json({ message: 'Candidate not found' });
    res.json(candidate);
  } catch (err) { next(err); }
};

exports.updateCandidate = async (req, res, next) => {
  try {
    const candidate = await UngVien.findByIdAndUpdate(
      req.params.id,
      {
        hoTen: req.body.hoTen,
        moTa: req.body.moTa,
        url: req.body.url,
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
    if (!candidate) return res.status(404).json({ message: 'Candidate not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) { next(err); }
};
