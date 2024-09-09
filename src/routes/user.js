
const router = require('express').Router();
const { verifyRefreshToken, authenticateJWT } = require('../middleware/auth');
const userController = require("../modules/User/controllers/user")
const groupController = require('../modules/User/controllers/groupController');

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
router.post('/remove-follower', authenticateJWT, userController.removeFollower); 
router.post('/unfollow', authenticateJWT, userController.unfollowUser);
router.get("/fetch-followers/:id",authenticateJWT, userController.fetchFollowersController);
router.get("/fetch-following/:id",authenticateJWT, userController.fetchFollowingController);
router.get('/search', authenticateJWT, userController.searchUsersController);
router.get('/check-username', authenticateJWT, userController.checkUsernameController);



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

// Groups Routes
router.post("/create-group", authenticateJWT, groupController.createGroupController);
router.post("/add-group-member", authenticateJWT, groupController.addGroupMemberController);
router.get("/my-groups", authenticateJWT, groupController.fetchUserGroupsController);
router.post("/groups/:groupId/invite", authenticateJWT, groupController.inviteUserToGroupController);
router.post("/groups/:groupId/accept-invite", authenticateJWT, groupController.acceptGroupInviteController);
router.post("/groups/:groupId/make-admin", authenticateJWT, groupController.makeAdminController);
router.get('/my-invites', authenticateJWT, groupController.fetchMyInvitesController);
router.put('/group/:groupId/update', authenticateJWT, groupController.updateGroupDescriptionController);
router.post('/leave-group', authenticateJWT, groupController.leaveGroupController);
router.get('/group/:groupId/users', authenticateJWT, groupController.fetchGroupUsersController);
router.delete('/:groupId/users/:userId', authenticateJWT, groupController.removeUserFromGroup);
router.get('/group/:groupId', authenticateJWT, groupController.getGroupDetailsController);
router.get('/groups/search', authenticateJWT, groupController.searchGroupsController);


// Chat Routes
router.post('/self-chat', authenticateJWT, userController.createSelfChatMessageController);
router.get('/self-chat', authenticateJWT, userController.fetchSelfChatMessagesController);

// Group Chat 
router.post('/groups/:groupId/messages', authenticateJWT, userController.sendMessageToGroupController);
router.get('/groups/:groupId/messages', authenticateJWT, userController.fetchGroupMessagesController);

// Private Chat
router.post('/send-message/:receiverId', authenticateJWT, userController.sendMessageToUserController);
router.get('/private-messages/:otherUserId', authenticateJWT, userController.fetchPrivateMessagesController);

// Fetch Chat
router.get('/chat/', authenticateJWT, userController.fetchUserChat);


module.exports = router;
