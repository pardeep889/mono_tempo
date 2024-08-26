// groupController.js

const { createGroup, addGroupMember } = require('../services/groupService');

const createGroupController = async (req, res) => {
  const { name, description,icon, type, members } = req.body;
  const creatorId = req.user.userId; // Assuming `authenticateJWT` middleware adds `user` to `req`
  const { message, success, statusCode, data } = await createGroup(creatorId, name, description, type, members, icon);
  return res.status(statusCode).json({
    success,
    message,
    data
  });
};

const addGroupMemberController = async (req, res) => {
  const { groupId, userId } = req.body;
  const { message, success, statusCode, data } = await addGroupMember(groupId, userId);
  return res.status(statusCode).json({
    success,
    message,
    data
  });
};

module.exports = {
  createGroupController,
  addGroupMemberController,
  addGroupMemberController
};

module.exports = {
  createGroupController,
};
