const router = require('express').Router();
const paymentsController = require("../modules/payments/controllers/payments");


router.post('/create',paymentsController.createpayment)

module.exports= router;