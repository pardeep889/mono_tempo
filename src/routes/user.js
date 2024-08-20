
const router = require('express').Router();
const { verifyRefreshToken, authenticateJWT } = require('../middleware/auth');
const userController = require("../modules/User/controllers/user")
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const secretKey = "TEST_SECRET_KEY";
const refreshTokenSecretKey = "TEST_REFRESH_SECRET_KEY";

function generateToken(payload) {
  return jwt.sign(payload, secretKey, { expiresIn: '15m' });
}

function generateRefreshToken(payload) {
  const jti = crypto.randomBytes(16).toString('hex');
  return jwt.sign({ ...payload, jti }, refreshTokenSecretKey, { expiresIn: '7d' });
}

router.post('/login',userController.logingUser);
router.post("/create", userController.createUser);
router.put("/update",authenticateJWT, userController.updateUser);

router.post("/change-password",userController.changePassword);
router.post("/forgot-password",userController.forgotPassword);
router.get("/confirm/:link", userController.confirmLink);
router.post("/confirm-password",userController.confirmPassword);
router.post("/recover-password",userController.recoverPassword);
router.get("/fetch/:id",authenticateJWT, userController.fetchUserByIdController);
router.post('/follow', authenticateJWT, userController.followUser); 
router.post('/unfollow', authenticateJWT, userController.unfollowUser);
router.get("/fetch-followers/:id",authenticateJWT, userController.fetchFollowersController);
router.get("/fetch-following/:id",authenticateJWT, userController.fetchFollowingController);


router.post('/refresh-token', verifyRefreshToken, (req, res) => {
    const { userId, email, role, uid, jti } = req.user;
    try {
        const newToken = generateToken({
            userId: userId,
            email: email,
            role: role,
            uid: uid
          });
          const newRefreshToken = generateRefreshToken({
            userId: userId,
            email: email,
            role: role,
            uid: uid
          });
        
          return res.status(200).json({
            success: true,
            message: 'Token refreshed successfully',
            data: {
            token: newToken,
            refreshToken: newRefreshToken
            }
          });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            data: null
          });
    }
    
  });

module.exports = router;
