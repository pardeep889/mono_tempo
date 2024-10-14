const db = require("../../../../sequelize/models");

const getUserNotificationSettingsService = async (userId) => {
  try {
    const notificationSettings = await db.UserNotificationSettings.findOne({
      where: { userId },
    });

    if (!notificationSettings) {
      return {
        message: "Notification settings not found",
        statusCode: 404,
        success: false,
        data: null,
      };
    }

    return {
      message: "Notification settings fetched successfully",
      statusCode: 200,
      success: true,
      data: notificationSettings,
    };
  } catch (error) {
    console.error("Error fetching notification settings:", error);
    return {
      message: "Internal server error",
      statusCode: 500,
      success: false,
      data: null,
    };
  }
};

const updateUserNotificationSettingsService = async (
  userId,
  settingsToUpdate
) => {
  try {
    let notificationSettings = await db.UserNotificationSettings.findOne({
      where: { userId },
    });

    if (!notificationSettings) {
      notificationSettings = await db.UserNotificationSettings.create({
        userId,
        ...settingsToUpdate,
      });

      return {
        message: "Notification settings created successfully",
        statusCode: 201,
        success: true,
        data: notificationSettings,
      };
    }

    await notificationSettings.update(settingsToUpdate);

    return {
      message: "Notification settings updated successfully",
      statusCode: 200,
      success: true,
      data: notificationSettings,
    };
  } catch (error) {
    console.error("Error updating notification settings:", error);
    return {
      message: "Internal server error",
      statusCode: 500,
      success: false,
      data: null,
    };
  }
};

module.exports = {
  getUserNotificationSettingsService,
  updateUserNotificationSettingsService,
};
