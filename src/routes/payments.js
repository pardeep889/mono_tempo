const router = require('express').Router();
const { authenticateJWT } = require('../middleware/auth');
const paymentsController = require("../modules/payments/controllers/payments");


router.post('/create',authenticateJWT, paymentsController.createpayment)

module.exports= router;