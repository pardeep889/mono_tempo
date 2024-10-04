// groupController.js

const { sendNotificationToUser } = require('../../Notification/services/notificationService');
const { fetchUserDetailsUtilService, fetchGroupDetailsUtilService } = require('../../util/util');
const { createGroup, addGroupMember, fetchUserGroups, inviteUserToGroup, acceptGroupInvite, makeAdmin, fetchMyInvites, updateGroupDescription, leaveGroup, fetchGroupUsers, removeUserFromGroupService, getGroupDetails, searchGroups, togglePinMessageGroup, togglePrivatePinnedMessage, toggleSelfPinnedMessage, deleteGroupMessage, removeGroupMember, adminToMember, joinPublicGroup, requestJoinPrivateGroup, fetchGroupRequests, acceptGroupRequests, rejectGroupRequests, getUserGroupRequests, getSingleGroupRequestByGroupId } = require('../services/groupService');

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
  const { groupId, userId } = req.body;  // userId is now an array
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

  const fullName = req.user.fullName;
  const { message, success, statusCode , data} = await inviteUserToGroup(groupId, adminId, userId);

  if(success){
    const groupDetail = await fetchGroupDetailsUtilService(groupId);
    sendNotificationToUser(adminId, userId, "Group Invite", `You have been Invited in group ${groupDetail.name} by ${fullName}`,"group-invite", groupId);
  }
  
  return res.status(statusCode).json({
    success,
    message,
    data
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
  const userId = req.user.userId;

  const { message, statusCode, success, data } = await getGroupDetails(groupId, userId);

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

async function pinUnpinGroupMessage(req, res) {
  const {groupId, messageId } = req.body;
  const { userId } = req.user;

  const { message, statusCode, success, data } = await togglePinMessageGroup(groupId, messageId, userId)

  return res.status(statusCode).json({
    success,
    message,
    data
  });
}
async function pinUnpinPrivateMessage(req, res) {
  const {messageId } = req.body;
  const { userId } = req.user;

  const { message, statusCode, success, data } = await togglePrivatePinnedMessage(messageId, userId)

  return res.status(statusCode).json({
    success,
    message,
    data
  });
}

async function pinUnpinSelfMessage(req, res) {
  const {messageId } = req.body;
  const { userId } = req.user;

  const { message, statusCode, success, data } = await toggleSelfPinnedMessage(messageId, userId)

  return res.status(statusCode).json({
    success,
    message,
    data
  });
}

async function deleteGroupMessageController(req, res) {
  const { messageId, groupId } = req.body;
  const { userId } = req.user; // Assuming you have middleware that sets req.user
  if(!groupId){
    return res.status(500).json({
      success: false,
      message: "Please  provide group id",
      data: null,
    });
  }
  const result = await deleteGroupMessage(messageId, groupId, userId);

  return res.status(result.statusCode).json({
    success: result.success,
    message: result.message,
    data: result.data,
  });
}

const removeGroupMemberController = async (req, res) => {
  const { groupId, userIds } = req.body;  // userIds is an array
  const adminId = req.user.userId;

  const { message, success, statusCode, data } = await removeGroupMember(groupId, userIds, adminId);

  return res.status(statusCode).json({
    success,
    message,
    data
  });
};


const adminToMemberController = async (req, res) => {
  const { groupId, targetUserId } = req.body;  // The target user to be demoted
  const requestingUserId = req.user.userId;  // The user making the request (must be an admin)

  const { message, success, statusCode, data } = await adminToMember(groupId, targetUserId, requestingUserId);
  return res.status(statusCode).json({
    success,
    message,
    data
  });
};

const joinPublicGroupController = async (req, res) => {
  const { groupId } = req.body;  // Group ID to join
  const userId = req.user.userId;  // ID of the user trying to join

  const { message, success, statusCode, data } = await joinPublicGroup(groupId, userId);
  return res.status(statusCode).json({
    success,
    message,
    data
  });
};

const requestJoinPrivateGroupController = async (req, res) => {
  const { groupId } = req.body;
  const userId = req.user.userId;

  const { message, success, statusCode, data } = await requestJoinPrivateGroup(groupId, userId);
  return res.status(statusCode).json({
    success,
    message,
    data
  });
};

const fetchGroupRequestsController = async (req, res) => {
  const { groupId } = req.params;
  const adminId = req.user.userId;

  const { message, success, statusCode, data } = await fetchGroupRequests(groupId, adminId);
  return res.status(statusCode).json({
    success,
    message,
    data
  });
};

const acceptGroupRequestsController = async (req, res) => {
  const { groupId, userIds } = req.body;  // userIds is an array
  const adminId = req.user.userId;

  const { message, success, statusCode, data } = await acceptGroupRequests(groupId, userIds, adminId);
  return res.status(statusCode).json({
    success,
    message,
    data
  });
};


const rejectGroupRequestsController = async (req, res) => {
  const { groupId, userIds } = req.body;  // userIds is an array of users to be rejected
  const adminId = req.user.userId;

  const { message, success, statusCode, data } = await rejectGroupRequests(groupId, userIds, adminId);
  return res.status(statusCode).json({
    success,
    message,
    data
  });
};

const getUserGroupRequestsController = async (req, res) => {
  const userId = req.user.userId;  // Fetch user ID from JWT

  const { message, success, statusCode, data } = await getUserGroupRequests(userId);
  return res.status(statusCode).json({
    success,
    message,
    data
  });
};

const getGroupRequestByGroupId = async (req, res) => {
  const { groupId } = req.params;
  const userId = req.user.userId; // Assume that the userId is coming from the authentication token (JWT)

  const { message, success, statusCode, data } = await getSingleGroupRequestByGroupId(groupId, userId);

  return res.status(statusCode).json({
    success,
    message,
    data
  });
};

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
  searchGroupsController,
  pinUnpinGroupMessage,
  pinUnpinPrivateMessage,
  pinUnpinSelfMessage,
  deleteGroupMessageController,
  removeGroupMemberController,
  adminToMemberController,
  joinPublicGroupController,
  requestJoinPrivateGroupController,
  fetchGroupRequestsController,
  acceptGroupRequestsController,
  rejectGroupRequestsController,
  getUserGroupRequestsController,
  getGroupRequestByGroupId
};