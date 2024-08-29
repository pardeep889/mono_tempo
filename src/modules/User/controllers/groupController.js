// groupController.js

const { createGroup, addGroupMember, fetchUserGroups, inviteUserToGroup, acceptGroupInvite, makeAdmin, fetchMyInvites, updateGroupDescription, leaveGroup, fetchGroupUsers, removeUserFromGroupService, getGroupDetails, searchGroups } = require('../services/groupService');

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
  const adminId = req.user.userId;
  
  const { message, success, statusCode, data } = await addGroupMember(groupId, userId, adminId);
  return res.status(statusCode).json({
    success,
    message,
    data
  });
};


const fetchUserGroupsController = async (req, res) => {
  const userId = req.user.userId; // Assuming `authenticateJWT` middleware adds `user` to `req`
  const { message, success, statusCode, data } = await fetchUserGroups(userId);
  return res.status(statusCode).json({
    success,
    message,
    data
  });
};

const inviteUserToGroupController = async (req, res) => {
  const { groupId } = req.params;
  const { userId } = req.body; // ID of the user to invite
  const adminId = req.user.userId; // ID of the current user (admin)
  
  const { message, success, statusCode } = await inviteUserToGroup(groupId, adminId, userId);
  
  return res.status(statusCode).json({
    success,
    message
  });
};

const acceptGroupInviteController = async (req, res) => {
  const { groupId } = req.params;
  const userId = req.user.userId; // ID of the current user

  const { message, success, statusCode } = await acceptGroupInvite(groupId, userId);

  return res.status(statusCode).json({
    success,
    message
  });
};

const makeAdminController = async (req, res) => {
  const { groupId } = req.params;
  const { userId } = req.body; // ID of the user to promote to admin
  const adminId = req.user.userId; // ID of the current user (admin)
  
  const { message, success, statusCode } = await makeAdmin(groupId, adminId, userId);
  
  return res.status(statusCode).json({
    success,
    message
  });
};

async function fetchMyInvitesController(req, res) {
  const userId = req.user.userId; // Assuming you have user authentication and req.user contains the logged-in user's data

  const { message, success, statusCode , data} = await fetchMyInvites(userId);

  return res.status(statusCode).json({
    success,
    message,
    data
  });
}

async function updateGroupDescriptionController(req, res) {
  const userId = req.user.userId; // Assuming you have user authentication and req.user contains the logged-in user's data
  const { groupId } = req.params;
  const { name, description, icon } = req.body;

  const { message, success, statusCode, data } = await updateGroupDescription(groupId, userId, name, description, icon);

  return res.status(statusCode).json({
    success,
    message,
    data
  });
}

async function leaveGroupController(req, res) {
  const userId = req.user.userId; // Assuming req.user contains the logged-in user's data
  const { groupId } = req.body;

  const { message, success, statusCode, data } = await leaveGroup(userId, groupId);

  return res.status(statusCode).json({
    success,
    message,
    data
  });
}

async function fetchGroupUsersController(req, res) {
  const { groupId } = req.params;
  const { page = 1, limit = 10 } = req.query; // Default to page 1, limit 10 per page

  const { message, success, statusCode, data } = await fetchGroupUsers(groupId, page, limit);

  return res.status(statusCode).json({
    success,
    message,
    data
  });
}


async function removeUserFromGroup(req, res) {
  const { groupId, userId } = req.params;
  const { userId: adminId } = req.user; // Assuming `req.user` contains the authenticated user's ID

  const { message, success, statusCode, data } = await removeUserFromGroupService(groupId, userId, adminId);

  return res.status(statusCode).json({
    success,
    message,
    data
  });
}

async function getGroupDetailsController(req, res) {
  const { groupId } = req.params;

  const { message, statusCode, success, data } = await getGroupDetails(groupId);

  return res.status(statusCode).json({
    success,
    message,
    data
  });
}

async function searchGroupsController(req, res) {
  const { name, page = 1, limit = 10 } = req.query;

  const { message, statusCode, success, data } = await searchGroups(name, page, limit);

  return res.status(statusCode).json({
    success,
    message,
    data
  });
}


module.exports = {
  createGroupController,
  addGroupMemberController,
  fetchUserGroupsController,
  inviteUserToGroupController,
  acceptGroupInviteController,
  makeAdminController,
  fetchMyInvitesController,
  updateGroupDescriptionController,
  leaveGroupController,
  fetchGroupUsersController,
  removeUserFromGroup,
  getGroupDetailsController,
  searchGroupsController
};