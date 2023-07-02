const express = require('express');
const router = express.Router();
const {
    createOrder,
    captureOrder,
    cancelPayment,
} = require('../controllers/payment');

/* Lista los items */
router.get('/create-order', createOrder);
router.get('/capture-order', captureOrder);
router.get('/cancel-payment', cancelPayment);

module.exports = router;
