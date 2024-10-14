const { getUserNotificationSettingsService , updateUserNotificationSettingsService } = require("../services/notificationSettingsService");

const getUserNotificationSettings = async (req, res) => {
  const userId = req.user.userId;

  const { message, statusCode, success, data } =
    await getUserNotificationSettingsService(userId);

  return res.status(statusCode).json({
    success,
    message,
    data,
  });
};

const updateUserNotificationSettings = async (req, res) => {
  const userId = req.user.userId;
  const settingsToUpdate = req.body;

  const { message, statusCode, success, data } =
    await updateUserNotificationSettingsService(userId, settingsToUpdate);

  return res.status(statusCode).json({
    success,
    message,
    data,
  });
};

module.exports = {
  getUserNotificationSettings,
  updateUserNotificationSettings,
};
