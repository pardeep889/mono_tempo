const router = require('express').Router();
const { authenticateJWT } = require('../middleware/auth');
const notificationController = require("../modules/Notification/controllers/notificationController");

// Create a notification
router.post('/create', authenticateJWT, notificationController.createNotificationController);

// List notifications for the authenticated user
router.get('/list', authenticateJWT, notificationController.listNotificationsController);

// Mark notification as read
router.put('/read/:notificationId', authenticateJWT, notificationController.markAsReadController);

// Delete a notification
router.delete('/delete/:notificationId', authenticateJWT, notificationController.deleteNotificationController);

module.exports = router;
