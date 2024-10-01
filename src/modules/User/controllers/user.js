const { sendNotificationToUser } = require("../../Notification/services/notificationService");
const { fetchGroupDetailsUtilService, fetchGroupUsersUtilService } = require("../../util/util");
const {
  userLogin,
  userCreate,
  changePasswordService,
  confirmPasswordService,
  forgotPasswordService,
  confirmLinkService,
  recoverPasswordService,
  getUserByIdService,
  followUserService,
  unfollowUserService,
  userUpdate,
  fetchFollowers,
  fetchFollowing,
  removeFollowerService,
  searchUsers,
  checkUsername,
  createSelfChatMessage,
  fetchSelfChatMessages,
  sendMessageToGroup,
  sendMessageToUser,
  fetchGroupMessages,
  fetchPrivateMessages,
  fetchChatDetails,
  fetchPinnedGroupMessages,
  fetchPinnedPrivateMessages,
  fetchPinnedSelfMessages,
  deleteMessage,
  editMessage,
} = require("../services/userService");
const { changePasswordSchema } = require("../validation/changePasswordSchema");
const { verifyLinkSchema } = require("../validation/verifyLinkSchema");

const logingUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const { response, statusCode, error , data} = await userLogin(email, password);
    if (error) {
      return res.status(statusCode).json({
        success: false,
        message: response,
        data
      });
    }
    return res.status(statusCode).json({
      success: true,
      message: "Request successful",
      data: response
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      data: null
    });
  }
};

const updateUser = async (req, res) => {
  const userId = req.user.userId;
  const userData = req.body;

  const { data, statusCode, success , message} = await userUpdate(userId, userData);

  return res.status(statusCode).json({
    success: success,
    message: message || (success ? "User updated successfully" : "Error updating user"),
    data: data
  });
}

const createUser = async (req, res) => {
  try {
    const { response, statusCode, error } = await userCreate(req.body);
    if (error) {
      return res.status(statusCode).json({
        success: false,
        message: response,
        data: null
      });
    }
    return res.status(statusCode).json({
      success: true,
      message: "User created successfully!",
      data: response
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Error",
      data: null
    });
  }
};

const changePassword = async (req, res) => {
  const { error, value } = changePasswordSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: "Error",
      data: null
    });
  }
  const { email, old_password, new_password } = req.body;

  try {
    const { response, statusCode, error } = await changePasswordService(
      email,
      old_password,
      new_password
    );
    if (error) {
      return res.status(statusCode).json({
        success: false,
        message: "Error",
        data: null
      });
    }
    return res.status(statusCode).json({
      success: true,
      message: "Request successful",
      data: response
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error",
      data: null
    });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const { response, statusCode, error } = await forgotPasswordService(email);
    if (error) {
      return res.status(statusCode).json({
        success: false,
        message: "Error",
        data: null
      });
    }
    return res.status(statusCode).json({
      success: true,
      message: "Request successful",
      data: response
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error",
      data: null
    });
  }
};

const confirmLink = async (req, res) => {
  const forgotlink = req.params.link;
  try {
    const { response, statusCode, error } = await confirmLinkService(forgotlink);
    if (error) {
      return res.status(statusCode).json({
        success: false,
        message: response,
        data: null
      });
    }
    return res.status(statusCode).json({
      success: true,
      message: "Request successful",
      data: response
    });
  } catch (error) {
    console.log("error",error)
    return res.status(500).json({
      success: false,
      message: "Error",
      data: null
    });
  }
};

const confirmPassword = async (req, res) => {
  const { error, value } = verifyLinkSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: "Error",
      data: null
    });
  }
  const { email, password, forgotLink } = req.body;
  try {
    const { response, error, statusCode } = await confirmPasswordService(
      email,
      password,
      forgotLink
    );
    if (error) {
      return res.status(statusCode).json({
        success: false,
        message: "Error",
        data: null
      });
    }
    return res.status(statusCode).json({
      success: true,
      message: "Request successful",
      data: response
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error",
      data: null
    });
  }
};

const recoverPassword = async (req, res) => {
  const { email, new_password } = req.body;
  if(new_password.length < 5){
    return res.status(500).json({
      success: false,
      message: "The password must be longer than 5 characters.",
      data: null
    });
  }

  try {
    const { response, statusCode, error } = await recoverPasswordService(
      email,
      new_password
    );
    if (error) {
      return res.status(statusCode).json({
        success: false,
        message: "Error",
        data: null
      });
    }
    return res.status(statusCode).json({
      success: true,
      message: "Request successful",
      data: response
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error",
      data: null
    });
  }
};

const fetchUserByIdController = async (req, res) => {
  const { id } = req.params;
  const { start = 0, pageSize = 10 } = req.query;
  const {userId} = req.user;
  const { message, success, statusCode, data } = await getUserByIdService(userId, id, parseInt(start), parseInt(pageSize));
  return res.status(statusCode).json({
    success,
    message,
    data
  });
};

const followUser = async (req, res) => {
  const { userId } = req.body;
  const followerId = req.user.userId;
  const fullName = req.user.fullName;

  if (userId === followerId) {
    return res.status(400).json({
      success: false,
      message: "You cannot follow yourself",
      data: null
    });
  }
  if(!userId || followerId == null) {
    return res.status(400).json({
      message: "userId to follow cannot be null",
      success: false,
      data: null
    })
  }
  
  const { message, success, statusCode, data } = await followUserService(followerId, userId);
  if(success){
    sendNotificationToUser(followerId, userId, `You have a new follower` , `${fullName} followed you.` ,"follow", followerId);
  }
  return res.status(statusCode).json({
    success,
    message,
    data
  });

};


const removeFollower = async (req, res) => {
  const { userId } = req.body;
  const followerId = req.user.userId;

  if (userId === followerId) {
    return res.status(400).json({
      success: false,
      message: "You cannot remove following yourself",
      data: null
    });
  }
  if(!userId || followerId == null) {
    return res.status(400).json({
      message: "userId to follow cannot be null",
      success: false,
      data: null
    })
  }
  
  const { message, success, statusCode, data } = await removeFollowerService(followerId, userId);
  return res.status(statusCode).json({
    success,
    message,
    data
  });

};

const unfollowUser = async (req, res) => {
  const { userId } = req.body;
  const followerId = req.user.userId;

  if (userId === followerId) {
    return res.status(400).json({
      success: false,
      message: "You cannot unfollow yourself",
      data: null
    });
  }
  if (!userId || followerId == null) {
    return res.status(400).json({
      message: "userId to unfollow cannot be null",
      success: false,
      data: null
    });
  }

  const { message, success, statusCode, data } = await unfollowUserService(followerId, userId);
  return res.status(statusCode).json({
    success,
    message,
    data
  });
};

const fetchFollowersController = async (req, res) => {
  const { start = 0, pageSize = 10 } = req.query;
  const userId = req.params.id;
  const { message, success, statusCode, data } = await fetchFollowers(userId, parseInt(start), parseInt(pageSize));
  return res.status(statusCode).json({
    success,
    message,
    data
  });
};

const fetchFollowingController = async (req, res) => {
  const { start = 0, pageSize = 10 } = req.query;
  const userId = req.params.id;
  const { message, success, statusCode, data } = await fetchFollowing(userId, parseInt(start), parseInt(pageSize));
  return res.status(statusCode).json({
    success,
    message,
    data
  });
};

async function searchUsersController(req, res) {
  const { name, page = 1, limit = 10 } = req.query;

  const { message, statusCode, success, data } = await searchUsers(name, page, limit);

  return res.status(statusCode).json({
    success,
    message,
    data
  });
}

async function checkUsernameController(req, res) {
  const { username } = req.query;

  const { message, statusCode, success, data } = await checkUsername(username);

  return res.status(statusCode).json({
    success,
    message,
    data
  });
}


async function createSelfChatMessageController(req, res) {
  const { text, attachmentUrl } = req.body;
  const { userId } = req.user; 

  const { message, statusCode, success, data } = await createSelfChatMessage(userId, text, attachmentUrl);

  return res.status(statusCode).json({
    success,
    message,
    data,
  });
}

async function fetchSelfChatMessagesController(req, res) {
  const { userId } = req.user; 
  const { limit = 10 } = req.query;
  const lastMessageId = parseInt(req.query.lastMessageId); // Get page from query params, default to 1
  const type = req.query.type;  
  const { message, statusCode, success, data } = await fetchSelfChatMessages(userId, limit, lastMessageId, type);

  return res.status(statusCode).json({
    success,
    message,
    data,
  });
}

async function sendMessageToGroupController(req, res) {
  const { groupId } = req.params;
  const { text, attachmentUrl } = req.body;
  const senderId = req.user.userId;
  const fullName = req.user.fullName;

  const { message, statusCode, success, data } = await sendMessageToGroup(groupId, senderId, text, attachmentUrl, req.app.get('io'));

  if(success){
    setImmediate(async () => {
      const users = await fetchGroupUsersUtilService(groupId);
      const groupDetail = await fetchGroupDetailsUtilService(groupId);
      users.forEach(user => {
        sendNotificationToUser(senderId, user['User.id'], `New Group Message from ${fullName} in ${groupDetail.name}`, text, "group-message", groupId);
      });
    });
  }
  return res.status(statusCode).json({
    success,
    message,
    data,
  });
}

async function sendMessageToUserController(req, res) {
  const { receiverId } = req.params;  // Change groupId to receiverId
  const { text, attachmentUrl, chatId } = req.body;
  const senderId = req.user.userId;  // Sender user ID from authenticated user
  const fullName = req.user.fullName;

  sendNotificationToUser(senderId, receiverId, `New Private Message from ${fullName}` , text ,"private-message", senderId);
  // Call sendMessageToUser with the correct parameters: senderId, receiverId, text, attachmentUrl
  const { message, statusCode, success, data } = await sendMessageToUser(chatId, senderId, receiverId, text, attachmentUrl, req.app.get('io'));

  // Return the response with the correct format
  return res.status(statusCode).json({
    success,
    message,
    data,
  });
}

async function fetchGroupMessagesController(req, res) {
  const { groupId } = req.params;
  const userId = req.user.userId; // Assuming the authenticated user ID is in req.user
  const lastMessageId = parseInt(req.query.lastMessageId); // Get page from query params, default to 1
  const type = req.query.type;
  const limit = parseInt(req.query.limit, 10) || 10; // Get limit from query params, default to 10

  const { message, statusCode, success, data } = await fetchGroupMessages(groupId, userId, limit, lastMessageId, type);

  return res.status(statusCode).json({
    success,
    message,
    data,
  });
}

async function fetchPrivateMessagesController(req, res) {
  const { otherUserId } = req.params; // Get the other user's ID from the request params
  const userId = req.user.userId; // Assuming the authenticated user ID is in req.user
  const lastMessageId = req.query.lastMessageId ? parseInt(req.query.lastMessageId) : null; // Get lastMessageId from query params
  const type = req.query.type || 'older'; // Get type (newer/older) from query params, default to 'older'
  const limit = parseInt(req.query.limit, 10) || 10; // Get limit from query params, default to 10

  const { message, statusCode, success, data } = await fetchPrivateMessages(userId, otherUserId, limit, lastMessageId, type);

  return res.status(statusCode).json({
    success,
    message,
    data,
  });
}

async function fetchUserChat(req, res) {
  const { userId } = req.user; // Get userId from the request params
  const { page = 1, limit = 10 } = req.query; // Get pagination parameters from the query string

  const { message, statusCode, success, data } = await fetchChatDetails(userId, parseInt(page), parseInt(limit));

  return res.status(statusCode).json({
    success,
    message,
    data,
  });
}


async function fetchPinnedGroupMessagesController(req, res) {
  const { groupId } = req.params;
  const userId = req.user.userId; // Assuming the authenticated user ID is in req.user
  const page = parseInt(req.query.page, 10) || 1; // Get page from query params, default to 1
  const limit = parseInt(req.query.limit, 10) || 10; // Get limit from query params, default to 10

  const { message, statusCode, success, data } = await fetchPinnedGroupMessages(groupId, userId, page, limit);

  return res.status(statusCode).json({
    success,
    message,
    data,
  });
}

async function fetchPinnedPrivateMessagesController(req, res) {
  const { chatId } = req.params;
  const userId = req.user.userId; // Assuming the authenticated user ID is in req.user
  const page = parseInt(req.query.page, 10) || 1; // Get page from query params, default to 1
  const limit = parseInt(req.query.limit, 10) || 10; // Get limit from query params, default to 10

  const { message, statusCode, success, data } = await fetchPinnedPrivateMessages(chatId, page, limit);

  return res.status(statusCode).json({
    success,
    message,
    data,
  });
}

async function fetchPinnedSelfMessagesController(req, res) {
  const { chatId } = req.params;
  const userId = req.user.userId; // Assuming the authenticated user ID is in req.user
  const page = parseInt(req.query.page, 10) || 1; // Get page from query params, default to 1
  const limit = parseInt(req.query.limit, 10) || 10; // Get limit from query params, default to 10

  const { message, statusCode, success, data } = await fetchPinnedSelfMessages(userId,chatId, page, limit);

  return res.status(statusCode).json({
    success,
    message,
    data,
  });
}

async function deleteMessageController(req, res) {
  const { messageId } = req.params; // messageId is passed in the URL params
  const { userId } = req.user; // Get the current logged-in user's ID from req.user

  const { message, statusCode, success, data } = await deleteMessage(userId, messageId);

  return res.status(statusCode).json({
    success,
    message,
    data,
  });
}

async function editMessageController(req, res) {
  const { messageId } = req.params; // messageId is passed in the URL params
  const { text, attachmentUrl } = req.body; // New text and attachmentUrl from the request body
  const { userId } = req.user; // Get the current logged-in user's ID from req.user

  const { message, statusCode, success, data } = await editMessage(userId, messageId, text, attachmentUrl);

  return res.status(statusCode).json({
    success,
    message,
    data,
  });
}


module.exports = {
  logingUser,
  createUser,
  changePassword,
  confirmPassword,
  forgotPassword,
  confirmLink,
  recoverPassword,
  fetchUserByIdController,
  followUser,
  unfollowUser,
  updateUser,
  fetchFollowersController,
  fetchFollowingController,
  removeFollower,
  searchUsersController,
  checkUsernameController,
  createSelfChatMessageController,
  fetchSelfChatMessagesController,
  sendMessageToGroupController,
  sendMessageToUserController,
  fetchGroupMessagesController,
  fetchPrivateMessagesController,
  fetchUserChat,
  fetchPinnedGroupMessagesController,
  fetchPinnedPrivateMessagesController,
  fetchPinnedSelfMessagesController,
  deleteMessageController,
  editMessageController
};
