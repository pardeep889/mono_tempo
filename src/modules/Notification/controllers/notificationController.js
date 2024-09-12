const notificationService = require("../services/notificationService");

// Create a notification
async function createNotificationController(req, res) {
  const { senderId, receiverId, title, message,referenceId, type } = req.body;

  const { message: responseMessage, statusCode, success, data } = await notificationService.createNotification(senderId, receiverId, title , message, type, referenceId);

  return res.status(statusCode).json({
    success,
    message: responseMessage,
    data,
  });
}

// List notifications for the authenticated user
async function listNotificationsController(req, res) {
  const userId = req.user.userId;
  const {pSize, page}  = req.query;

  const { message, statusCode, success, data } = await notificationService.listNotifications(userId, pSize, page);

  return res.status(statusCode).json({
    success,
    message,
    data,
  });
}

// Mark notification as read
async function markAsReadController(req, res) {
  const { notificationId } = req.params;
  const userId = req.user.userId;

  const { message, statusCode, success, data } = await notificationService.markAsRead(userId, notificationId);

  return res.status(statusCode).json({
    success,
    message,
    data,
  });
}

// Delete a notification
async function deleteNotificationController(req, res) {
  const { notificationId } = req.params;
  const userId = req.user.userId;

  const { message, statusCode, success, data } = await notificationService.deleteNotification(userId, notificationId);

  return res.status(statusCode).json({
    success,
    message,
    data,
  });
}

module.exports = {
  createNotificationController,
  listNotificationsController,
  markAsReadController,
  deleteNotificationController
};
