const router = require('express').Router();
const { authenticateJWT } = require('../middleware/auth');
const buyerController = require('../modules/buyers/controllers/buyers');

router.post("/create", authenticateJWT ,buyerController.createBuyer);
// router.delete("/delete/:id",buyerController.deleteBuyer);
router.get("/fetch/:exploreId", authenticateJWT ,buyerController.fetchBuyersOfAnExplore);

module.exports = router;