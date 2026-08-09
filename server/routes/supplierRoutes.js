const auth = require('../middleware/auth');
const express = require('express');
const router = express.Router();
const controller = require('../controllers/supplierController');
const { body, validationResult } = require('express-validator');

const validateSupplier = [
  body('name').notEmpty().withMessage('Supplier name is required'),
  body('email').isEmail().withMessage('A valid email is required'),
  body('phone').notEmpty().withMessage('Phone number is required'),
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
router.post('/', auth, validateSupplier, checkValidation, controller.create);
router.put('/:id', auth, validateSupplier, checkValidation, controller.update);
router.delete('/:id', auth, controller.remove);

module.exports = router;