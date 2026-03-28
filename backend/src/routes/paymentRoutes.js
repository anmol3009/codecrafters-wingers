const router = require('express').Router();
const { processPayment } = require('../controllers/paymentController');
const authMiddleware = require('../middleware/authMiddleware');

// POST /payment
router.post('/', authMiddleware, processPayment);

module.exports = router;
