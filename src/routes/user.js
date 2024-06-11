
const router = require('express').Router();
const userController = require("../modules/User/controllers/user")

router.post('/login',userController.logingUser);
router.post("/create", userController.createUser);
router.post("/change-password",userController.changePassword);
router.post("/forgot-password",userController.forgotPassword);
router.get("/confirm/:link", userController.confirmLink);
router.post("/confirm-password",userController.confirmPassword);
router.post("/recover-password",userController.recoverPassword);
router.get("/fetch/:id",userController.fetchUserByIdController);



module.exports = router;
