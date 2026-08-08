const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const express = require('express');
const router = express.Router();
const controller = require('../controllers/productController');
const { body, validationResult } = require('express-validator');

const validateProduct = [
  body('name').notEmpty().withMessage('Product name is required'),
  body('sku').notEmpty().withMessage('SKU is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('quantity').isInt({ min: 0 }).withMessage('Quantity must be zero or more'),
  body('supplierId').isInt().withMessage('A valid supplier must be selected'),
];

function checkValidation(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}

router.get('/', controller.getAll);
router.get('/:id', controller.getOne);
router.post('/', auth, upload.single('image'), (req, res, next) => {
  if (req.file) req.body.imageUrl = `/uploads/${req.file.filename}`;
  next();
}, validateProduct, checkValidation, controller.create);
router.put('/:id', auth, validateProduct, checkValidation, controller.update);
router.delete('/:id', auth, controller.remove);

module.exports = router;