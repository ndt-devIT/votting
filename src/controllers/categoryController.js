const HangMuc = require('../models/HangMuc');

exports.createCategory = async (req, res, next) => {
  try {
    const category = await HangMuc.create(req.body);
    res.status(201).json(category);
  } catch (err) { next(err); }
};

exports.getCategories = async (req, res, next) => {
  try {
    const categories = await HangMuc.find().populate('cuocThi');
    res.json(categories);
  } catch (err) { next(err); }
};

exports.getCategoryById = async (req, res, next) => {
  try {
    const category = await HangMuc.findById(req.params.id).populate('cuocThi');
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json(category);
  } catch (err) { next(err); }
};

exports.updateCategory = async (req, res, next) => {
  try {
    const category = await HangMuc.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json(category);
  } catch (err) { next(err); }
};

exports.deleteCategory = async (req, res, next) => {
  try {
    const category = await HangMuc.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) { next(err); }
};
