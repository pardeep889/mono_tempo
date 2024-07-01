const router = require('express').Router();
const { authenticateJWT } = require('../middleware/auth');
const buyerController = require('../modules/buyers/controllers/buyers');

router.post("/create", authenticateJWT ,buyerController.createBuyer);
// router.delete("/delete/:id",buyerController.deleteBuyer);

module.exports = router;