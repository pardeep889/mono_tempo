// privacyController.js
const {
  getUserPrivacySettingsService,
  updateUserPrivacySettingsService,
  blockUserService,
  unblockUserService,
  restrictUserService,
  unrestrictUserService,
  fetchBlockedUsersService,
  fetchRestrictedUsersService,
  hideStoryFromUsersService,
  notHideStoryFromUsersService,
  fetchHideStoryFromUsersService,
} = require("../services/privacyService");

const getUserPrivacySettings = async (req, res) => {
  const userId = req.user.userId; // Extracting the user ID from JWT

  const { message, statusCode, success, data } =
    await getUserPrivacySettingsService(userId);

  return res.status(statusCode).json({
    success,
    message,
    data,
  });
};

const updateUserPrivacySettings = async (req, res) => {
  const userId = req.user.userId; // Extracting the user ID from JWT
  const settingsToUpdate = req.body; // The privacy settings to update from the request body

  const { message, statusCode, success, data } =
    await updateUserPrivacySettingsService(userId, settingsToUpdate);

  return res.status(statusCode).json({
    success,
    message,
    data,
  });
};

const blockUser = async (req, res) => {
  const userId = req.user.userId;
  const { blockUserId } = req.body; // ID of the user to block

  if(!blockUserId){
    return res.status(200).json({
      success: false,
      message: "blockUserId is not provided",
      data: null,
    });
  }

  const { message, statusCode, success, data } = await blockUserService(
    userId,
    blockUserId
  );

  return res.status(statusCode).json({
    success,
    message,
    data,
  });
};

const unblockUser = async (req, res) => {
  const userId = req.user.userId;
  const { unblockUserId } = req.body; // ID of the user to unblock
  if(!unblockUserId){
    return res.status(200).json({
      success: false,
      message: "unblockUserId is not provided",
      data: null,
    });
  }

  const { message, statusCode, success, data } = await unblockUserService(
    userId,
    unblockUserId
  );

  return res.status(statusCode).json({
    success,
    message,
    data,
  });
};

const restrictUser = async (req, res) => {
  const userId = req.user.userId;
  const { restrictUserId } = req.body; // ID of the user to restrict

  if(!restrictUserId){
    return res.status(200).json({
      success: false,
      message: "restrictUserId is not provided",
      data: null,
    });
  }

  const { message, statusCode, success, data } = await restrictUserService(
    userId,
    restrictUserId
  );

  return res.status(statusCode).json({
    success,
    message,
    data,
  });
};

const unrestrictUser = async (req, res) => {
  const userId = req.user.userId;
  const { unrestrictUserId } = req.body; // ID of the user to unrestrict

  if(!unrestrictUserId){
    return res.status(200).json({
      success: false,
      message: "unrestrictUserId is not provided",
      data: null,
    });
  }

  const { message, statusCode, success, data } = await unrestrictUserService(
    userId,
    unrestrictUserId
  );

  return res.status(statusCode).json({
    success,
    message,
    data,
  });
};
const fetchBlockedUsers = async (req, res) => {
  const userId = req.user.userId; // Assuming you're using middleware to set req.user
  const { page, limit } = req.query;

  const response = await fetchBlockedUsersService(userId, Number(page), Number(limit));
  return res.status(response.statusCode).json(response);
};

const fetchRestrictedUsers = async (req, res) => {
  const userId = req.user.userId; // Assuming you're using middleware to set req.user
  const { page, limit } = req.query;

  const response = await fetchRestrictedUsersService(userId, Number(page), Number(limit));
  return res.status(response.statusCode).json(response);
};

const hideStoryFromUsers = async (req, res) => {
  const userId = req.user.userId; // Assuming you're using middleware to set req.user
  const userToHide = req.body.userToHide; // ID of the user to hide
  if(!userToHide){
    return res.status(200).json({
      success: false,
      message: "userToHide is not provided",
      data: null,
    });
  }
  const response = await hideStoryFromUsersService(userId, userToHide);
  return res.status(response.statusCode).json(response);
};

const notHideStoryFromUsers = async (req, res) => {
  const userId = req.user.userId; // Assuming you're using middleware to set req.user
  const userToUnhide = req.body.userToUnhide; // ID of the user to unhide
  if(!userToUnhide){
    return res.status(200).json({
      success: false,
      message: "userToUnhide is not provided",
      data: null,
    });
  }
  const response = await notHideStoryFromUsersService(userId, userToUnhide);
  return res.status(response.statusCode).json(response);
};

const fetchHideStoryFromUsers = async (req, res) => {
  const userId = req.user.userId; // Assuming you're using middleware to set req.user
  const { page, limit } = req.query;

  const response = await fetchHideStoryFromUsersService(userId, Number(page), Number(limit));
  return res.status(response.statusCode).json(response);
};

module.exports = {
  getUserPrivacySettings,
  updateUserPrivacySettings,
  blockUser,
  unblockUser,
  restrictUser,
  unrestrictUser,
  fetchBlockedUsers,
  fetchRestrictedUsers,
  hideStoryFromUsers,
  notHideStoryFromUsers,
  fetchHideStoryFromUsers,
};
