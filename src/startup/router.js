const router = require("express").Router();
const exploreRoute = require("../routes/explore");
const unitsRoute = require("../routes/unit");
const buyerRoute = require("../routes/buyers");
const categoryRoute = require("../routes/category");
const reviewRoute = require("../routes/review");
const paymentsRoute = require("../routes/payments");
const userRoute = require("../routes/user");
const adminRoute = require("../routes/admin")
const notificationRoute = require("../routes/notification");
const uploadRoute = require("../routes/upload");

// user authentication Routes
router.use("/user", userRoute);


router.use("/explore", exploreRoute);
router.use("/unit",unitsRoute);
router.use("/buyer",buyerRoute);
router.use("/category",categoryRoute);
// router.use("/category",categoryRoute); 
router.use("/review", reviewRoute);
router.use("/review", reviewRoute);
router.use("/payment",paymentsRoute)
router.use("/admin",adminRoute)
router.use("/notification",notificationRoute)
router.use("/upload", uploadRoute);




router.use("/", (req, res) => {
  res.status(200).send("Tempospace is running.");
});

module.exports = router;
