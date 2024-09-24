const jwt = require("jsonwebtoken");
const secretKey = "TEST_SECRET_KEY";
const refreshTokenSecretKey = "TEST_REFRESH_SECRET_KEY";
const db = require("../../../../sequelize/models");
const bcrypt = require("bcrypt");
const crypto = require('crypto');
const { Sequelize } = require("sequelize");
const { generateRandomCode, generateRandomCodeNumber8Digit } = require("../../util/util");
const generateUUID = require("../../util/ uuidGenerator");
const sendEmail = require("../../util/sendEmail");
const saltRounds = 10;
const { Op } = require("sequelize");


async function getUserByIdService(id, userId, start = 0, pageSize = 10) {
  try {
    const user = await db.User.findByPk(userId, {
      attributes: { exclude: ['password', 'forgotLink'] },
    });

    if (!user) {
      return { message: "User not found", statusCode: 404, success: false, data: null };
    }

    // Fetch following users
    const following = await db.Follow.findAndCountAll({
      where: { followerId: userId },
      include: [{
        model: db.User,
        as: 'followed',
        attributes: ['id', 'username', 'fullName', 'profileImageUrl', 'uid'],
      }],
      limit: pageSize,
      offset: start
    });

    // Fetch followers
    const followers = await db.Follow.findAndCountAll({
      where: { followedId: userId },
      include: [{
        model: db.User,
        as: 'follower',
        attributes: ['id', 'username', 'fullName', 'profileImageUrl', 'uid'],
      }],
      limit: pageSize,
      offset: start
    });

    const isFollowing = await db.Follow.findOne({
      where: { followerId: id, followedId: userId },
    });

    const userWithFollowData = {
      ...user.toJSON(),
      following: following.rows.map(f => f.followed),
      followingCount: following.count,
      followers: followers.rows.map(f => f.follower),
      followersCount: followers.count,
      isFollowing: !!isFollowing
    };

    return { message: "User Profile Fetched Successfully", statusCode: 200, success: true, data: userWithFollowData };
  } catch (error) {
    console.error("Error fetching user:", error);
    return { message: "Internal Server Error", statusCode: 500, success: false, data: null };
  }
}

async function userLogin(email, password) {
  try {
    const user = await db.User.findOne({ where: { email } });
    if (!user) {
      return { response: "User not found", statusCode: 404, error: true, data: null };
    }
    if (user.dataValues.passwordChangeRequired) {
      return { response: "Password Change Required", statusCode: 404, error: true, data: { passwordChangeRequired: true } };
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return { response: "Incorrect password", statusCode: 401, error: true , data: null};
    }
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      uid: user.uid,
      fullName: user.fullName
    });
    const refreshToken = generateRefreshToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      uid: user.uid,
      fullName: user.fullName
    });

    return {
      response: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          fullName: user.fullName,
          accountStatus: user.accountStatus,
          stripeCustomerId: user.stripeCustomerId,
          isSubscribed: user.isSubscribed,
          role: user.role,
          uid: user.uid,
          isEmailVerified: user.isEmailVerified,
          username: user.username
        },
        token: token,
        refreshToken: refreshToken
      },
      statusCode: 200,
      error: false
    };
  } catch (error) {
    console.error("Error login user:", error);
    return { response: "Log in user failed", statusCode: 500, error: true , data: null};
  }
}

function generateToken(user) {
  return jwt.sign(user, secretKey, { expiresIn: "7d" }); // Token expires in 1 hour
}

function generateRefreshToken(payload) {
  const jti = crypto.randomBytes(16).toString('hex');
  return jwt.sign({ ...payload, jti }, refreshTokenSecretKey, { expiresIn: '50d' });
}

async function userCreate(userData) {
  try {
    const uid = generateUUID();
    const code = generateRandomCodeNumber8Digit();
    const otpData = {
      userName: `${userData.firstName} ${userData.lastName}`,
      otp: code,
    };

    const hashedPassword = await bcrypt.hash(userData.password, saltRounds);
    const time = (new Date().getTime()).toString();
    const newUser = await db.User.create({
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      phoneNumber: userData.phoneNumber,
      password: hashedPassword,
      userType: userData.userType,
      isEmailVerified: false,
      accountStatus: "active",
      uid: uid,
      fullName: userData.fullName,
      location: userData.location,
      username: userData.username,
      profileImageUrl: userData.profileImageUrl,
      stripeCustomerId: userData.stripeCustomerId,
      userStatus: userData.userStatus,
      isSubscribed: userData.isSubscribed,
      forgotLink: code,
      passwordChangeRequired: false,
      createdAt: userData.createdAt,
      updatedAt: time,
    });

    // Remove sensitive information before returning the user data
    const userResponse = {
      id: newUser.id,
      email: newUser.email,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      phoneNumber: newUser.phoneNumber,
      userType: newUser.userType,
      isEmailVerified: newUser.isEmailVerified,
      accountStatus: newUser.accountStatus,
      uid: newUser.uid,
      fullName: newUser.fullName,
      location: newUser.location,
      username: newUser.username,
      profileImageUrl: newUser.profileImageUrl,
      stripeCustomerId: newUser.stripeCustomerId,
      userStatus: newUser.userStatus,
      isSubscribed: newUser.isSubscribed,
      createdAt: newUser.createdAt,
      updatedAt: newUser.updatedAt,
    };

    sendEmail(userData.email, 'otpTemplate', otpData);
    return { statusCode: 200, error: false, response: userResponse };
  } catch (error) {
    if (error instanceof Sequelize.UniqueConstraintError) {
      console.error("Error: email already exists:", error);
      return { response: "Email already exists", statusCode: 400, error: true };
    } else {
      console.error("Error creating user:", error);
      return { response: error.name, statusCode: 500, error: true };
    }
  }
}



async function changePasswordService(email, old_password, new_password) {
  const hashedNewPassword = await bcrypt.hash(new_password, saltRounds);
  try {
    const dbResponse = await db.User.findOne({
      where: { email: email },
    });
    if (dbResponse === null) {
      return { response: "no user found", error: true, statusCode: 400 };
    }
    const existingPassword = dbResponse.dataValues.password;
    const passwordMatched = await bcrypt.compare(
      old_password,
      existingPassword
    );
    if (passwordMatched) {
      await db.User.update(
        {
          password: hashedNewPassword,
        },
        {
          where: { email: email },
        }
      );
      return {
        response: "Password Changed Successfully",
        statusCode: 200,
        error: false,
      };
    } else {
      return {
        response: "Incorrect OldPassword entered",
        statusCode: 400,
        error: true,
      };
    }
  } catch (error) {
    return { response: error, statusCode: 400, error: true };
  }
}

async function forgotPasswordService(email) {
  try {
    // Find the user based on the email
    const userData = await db.User.findOne({ where: { email: email } });

    if (!userData) {
      return { response: "User not found", statusCode: 404, error: true };
    }

    // Generate a random 8-digit code
    const code = generateRandomCodeNumber8Digit();

    // Update the user's forgotLink field with the generated code
    await db.User.update(
      {
        forgotLink: code,
      },
      { where: { email: email } }
    );

    // Prepare data for the email template
    const otpData = {
      userName: `${userData.firstName} ${userData.lastName}`,
      otp: code,
    };

    // Send email with OTP data
    sendEmail(userData.email, 'forgotTemplate', otpData, "Tempospace: Your One Time Password");

    return { response: "Please check your email", statusCode: 200, error: false };
  } catch (error) {
    return { response: error.message, statusCode: 500, error: true };
  }
}
async function confirmLinkService(forgotlink) {
  try {
    // Find the user based on forgotLink
    const user = await db.User.findOne({ where: { forgotLink: forgotlink } });
    if (!user) {
    return { response: 'OTP is not valid.', statusCode: 400, error: true };
    }

    // Update the user instance
    user.isEmailVerified = true;
    user.forgotLink = null; // Assuming you want to clear the forgotLink

    // Save the updated user instance
    await user.save();

    return { response: "Email Verified...", statusCode: 200, error: false };
  } catch (error) {
    console.error('Error confirming link:', error);
    return { response: error, statusCode: 500, error: true };
  }
}
async function confirmPasswordService(email, password,forgotLink) {
  console.log("forgot",forgotLink)
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  try {
   const isForgotLinkExist= await db.User.update(
      {
        password: hashedPassword,
        passwordChangeRequired: false
      },
      {
        where: { email: email, forgotLink:forgotLink },
      }
    );
    console.log("forgot",isForgotLinkExist[0])
    if(isForgotLinkExist[0] === 1){
    await db.User.update({
      forgotLink:null},{where:{email}
    })
    return { response: "passsword changed", statusCode: 200, error: false };}
    else{
      return { response: "invalid fogotLink Provided", statusCode: 200, error: false };
    }
  } catch (error) {
    console.log(error);
    return { response: error, statusCode: 400, error: true };
  }
}
async function recoverPasswordService(email, new_password) {
  const hashedNewPassword = await bcrypt.hash(new_password, saltRounds);
  try {
    const dbResponse = await db.User.findOne({
      where: { email: email },
    });
    if (dbResponse === null) {
      return { response: "no user found", error: true, statusCode: 400 };
    }
      await db.User.update(
        {
          password: hashedNewPassword,
          passwordChangeRequired: false,
        },
        {
          where: { email: email },
        }
      );
      return {
        response: "Password Changed Successfully",
        statusCode: 200,
        error: false,
      }
    }
    catch (error) {
    return { response: error, statusCode: 400, error: true };
  }
}
async function followUserService(followerId, userId) {
  try {
    // Check if the follower already follows the user
    const existingFollow = await db.Follow.findOne({
      where: {
        followerId: followerId,
        followedId: userId,
      },
    });

    if (existingFollow) {
      return { 
        message: "User is already followed by you", 
        statusCode: 400, 
        success: false, 
        data: null 
      };
    }

    // If not followed yet, create a new follow entry
    await db.Follow.create({
      followerId: followerId,
      followedId: userId,
    });

    return { 
      message: "Successfully followed the user", 
      statusCode: 200, 
      success: true, 
      data: null 
    };
  } catch (error) {
    console.error("Error following user:", error);
    return { 
      message: "Internal Server Error", 
      statusCode: 500, 
      success: false, 
      data: null 
    };
  }
}

async function removeFollowerService(userId, followerId) {
  try {
    // Check if the follower is following the user
    const existingFollow = await db.Follow.findOne({
      where: {
        followerId: followerId,
        followedId: userId, // Note: userId is the user being followed (you)
      },
    });

    if (!existingFollow) {
      return { 
        message: "This user is not following you", 
        statusCode: 400, 
        success: false, 
        data: null 
      };
    }

    // If the follow relationship exists, remove it
    await db.Follow.destroy({
      where: {
        followerId: followerId,
        followedId: userId,
      },
    });

    return { 
      message: "Successfully removed the follower", 
      statusCode: 200, 
      success: true, 
      data: null 
    };
  } catch (error) {
    console.error("Error removing follower:", error);
    return { 
      message: "Internal Server Error", 
      statusCode: 500, 
      success: false, 
      data: null 
    };
  }
}


async function unfollowUserService(followerId, userId) {
  console.log(followerId, userId)
  try {
    await db.Follow.destroy({
      where: {
        followerId: followerId,
        followedId: userId,
      },
    });
    return { message: "Successfully unfollowed the user", statusCode: 200, success: true, data: null };
  } catch (error) {
    console.error("Error unfollowing user:", error);
    return { message: "Internal Server Error", statusCode: 500, success: false, data: null };
  }
}


const userUpdate = async (userId, userData) => {
  try {
    const updatedUser = await db.User.update(userData, {
      where: { id: userId },
      returning: true,
      plain: true,
    });

    if (updatedUser[1]) {
      return {
        data: updatedUser[1], // Return the updated user data
        statusCode: 200,
        success: true,
      };
    } else {
      return {
        data: null,
        statusCode: 404,
        success: false,
        message: "User not found",
      };
    }
  } catch (error) {
    return {
      data: error.message,
      statusCode: 500,
      success: false,
    };
  }
};
async function fetchFollowers(userId, start = 0, pageSize = 10) {
  console.log("Followers", userId, start, pageSize);
  try {
    // Fetch followers with pagination
    const followers = await db.Follow.findAndCountAll({
      where: { followedId: userId },
      include: [{
        model: db.User,
        as: 'follower',
        attributes: ['id', 'username', 'fullName', 'profileImageUrl', 'uid'],
      }],
      limit: pageSize,
      offset: start
    });

    // For each follower, check if the user is following them
    const followersWithIsFollowing = await Promise.all(
      followers.rows.map(async f => {
        const isFollowing = await db.Follow.findOne({
          where: {
            followerId: userId,         // You are the follower
            followedId: f.follower.id,  // The follower is the one being followed
          }
        });
        return {
          ...f.follower.get({ plain: true }), // Get plain user object
          isFollowing: !!isFollowing,          // Convert to boolean
        };
      })
    );

    // Structure the response
    const response = {
      followers: followersWithIsFollowing,
      totalFollowers: followers.count,
      currentPage: Math.floor(start / pageSize) + 1,
      pageSize: pageSize,
    };

    return { message: "Followers Fetched Successfully", statusCode: 200, success: true, data: response };
  } catch (error) {
    console.error("Error fetching followers:", error);
    return { message: "Internal Server Error", statusCode: 500, success: false, data: null };
  }
}


async function fetchFollowing(userId, start = 0, pageSize = 10) {
  console.log("Following", userId, start, pageSize)

  try {
    // Fetch following users with pagination
    const following = await db.Follow.findAndCountAll({
      where: { followerId: userId },
      include: [{
        model: db.User,
        as: 'followed',
        attributes: ['id', 'username', 'fullName', 'profileImageUrl', 'uid'],
      }],
      limit: pageSize,
      offset: start
    });

    // Structure the response
    const response = {
      following: following.rows.map(f => f.followed),
      totalFollowing: following.count,
      currentPage: Math.floor(start / pageSize) + 1,
      pageSize: pageSize,
    };

    return { message: "Following Fetched Successfully", statusCode: 200, success: true, data: response };
  } catch (error) {
    console.error("Error fetching following:", error);
    return { message: "Internal Server Error", statusCode: 500, success: false, data: null };
  }
}
async function searchUsers(name, page = 1, limit = 10) {
  try {
    const offset = (page - 1) * limit;
    const searchTerms = name.split(" ").map(term => `%${term}%`);

    // Build the search conditions for each term
    const searchConditions = searchTerms.map(term => ({
      [Op.or]: [
        { firstName: { [Op.iLike]: term } },
        { lastName: { [Op.iLike]: term } },
        { username: { [Op.iLike]: term } }
      ]
    }));

    // Combine the conditions using Sequelize's Op.and
    const { count, rows } = await db.User.findAndCountAll({
      where: {
        [Op.and]: searchConditions
      },
      attributes: ['id', 'username', 'profileImageUrl', 'fullName'],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    const totalPages = Math.ceil(count / limit);

    return {
      message: "Users fetched successfully",
      statusCode: 200,
      success: true,
      data: {
        users: rows,
        currentPage: parseInt(page),
        totalPages
      }
    };
  } catch (error) {
    console.error("Error searching users:", error);
    return { message: "Internal Server Error", statusCode: 500, success: false, data: null };
  }
}

async function checkUsername(username) {
  try {
    const user = await db.User.findOne({
      where: {
        username: username
      }
    });

    if (user) {
      return {
        message: "Username already exists",
        statusCode: 200,
        success: true,
        data: { exists: true }
      };
    } else {
      return {
        message: "Username is available",
        statusCode: 200,
        success: true,
        data: { exists: false }
      };
    }
  } catch (error) {
    console.error("Error checking username:", error);
    return {
      message: "Internal Server Error",
      statusCode: 500,
      success: false,
      data: null
    };
  }
}
async function createSelfChatMessage(userId, text, attachmentUrl) {
  try {
    // Find or create a self-chat for the user
    let chat = await db.Chat.findOne({ where: { userId, type: 'SELF' } });
    if (!chat) {
      // Create a new chat if not found
      chat = await db.Chat.create({ userId, type: 'SELF' });
    } else {
      chat.count = chat.count + 1; // Or any other minor field you can update
      await chat.save();
    }

    // Create a self-chat message
    const message = await db.Message.create({
      text,
      attachmentUrl,
      senderId: userId,
      isSelfChat: true,
      chatId: chat.id
    });

    return {
      message: 'Self-chat message created successfully',
      statusCode: 201,
      success: true,
      data: { message },
    };
  } catch (error) {
    console.error('Error creating self-chat message:', error);
    return { message: 'Internal Server Error', statusCode: 500, success: false, data: null };
  }
}

// Service function to fetch self-chat messages
async function fetchSelfChatMessages(userId, limit = 10, lastMessageId = null, type = 'older') {
  try {
    // Base query condition to fetch self-chat messages
    const whereCondition = {
      senderId: userId,
      isSelfChat: true,
    };

    // If lastMessageId is provided, adjust the query based on 'type'
    if (lastMessageId) {
      const lastMessage = await db.Message.findByPk(lastMessageId);
      if (!lastMessage) {
        return { message: 'Last message not found', statusCode: 404, success: false, data: null };
      }

      if (type === 'older') {
        // Fetch older messages before the provided message
        whereCondition.createdAt = { [db.Sequelize.Op.lt]: lastMessage.createdAt };
      } else if (type === 'newer') {
        // Fetch newer messages after the provided message
        whereCondition.createdAt = { [db.Sequelize.Op.gt]: lastMessage.createdAt };
      } else {
        return { message: 'Invalid type parameter', statusCode: 400, success: false, data: null };
      }
    }

    // Fetch messages with the conditions and pagination
    const messages = await db.Message.findAll({
      where: whereCondition,
      order: [['createdAt', 'DESC']],
      limit,
    });

    return {
      message: 'Self-chat messages fetched successfully',
      statusCode: 200,
      success: true,
      data: { messages },
    };
  } catch (error) {
    console.error('Error fetching self-chat messages:', error);
    return { message: 'Internal Server Error', statusCode: 500, success: false, data: null };
  }
}


async function sendMessageToGroup(groupId, senderId, text, attachmentUrl, io) {
  try {

    // check chat
    let chat = await db.Chat.findOne({ where: { groupId, type: 'GROUP' } });
    if (!chat) {
      chat = await db.Chat.create({ userId: senderId, groupId, type: 'GROUP' });
    }
    else {
      chat.count = chat.count + 1; // Or any other minor field you can update
      await chat.save();
    }

    // Check if the group exists
    const group = await db.Group.findByPk(groupId);
    if (!group) {
      return { message: "Group not found", statusCode: 404, success: false, data: null };
    }

    // Create the message
    const message = await db.Message.create({
      text,
      attachmentUrl,
      senderId,
      groupId,
      isSelfChat: false,
      chatId: chat.id
    });

    // Broadcast the message to all members of the group
    io.to(groupId).emit('newMessage', message);

    return {
      message: "Message sent successfully",
      statusCode: 201,
      success: true,
      data: { message },
    };
  } catch (error) {
    console.error("Error sending message to group:", error);
    return { message: "Internal Server Error", statusCode: 500, success: false, data: null };
  }
}

async function sendMessageToUser(senderId, receiverId, text, attachmentUrl, io) {
  try {
    

        // check chat
    let chat = await db.Chat.findOne({ where: { receiverId, type: 'PRIVATE' } });
    if (!chat) {
      chat = await db.Chat.create({userId: senderId, receiverId, type: 'PRIVATE' });
    }else {
      chat.count = chat.count + 1;
      await chat.save();
    }


        
    // Check if the receiver exists
    const receiver = await db.User.findByPk(receiverId);
    if (!receiver) {
      return { message: "User not found", statusCode: 404, success: false, data: null };
    }

    // Create the direct message
    const message = await db.Message.create({
      text,
      attachmentUrl,
      senderId,
      receiverId,
      isSelfChat: false,
      chatId: chat.id
    });

    // Broadcast the message to the receiver
    io.to(receiverId).emit('newMessage', message);

    return {
      message: "Message sent successfully",
      statusCode: 201,
      success: true,
      data: { message },
    };
  } catch (error) {
    console.error("Error sending message to user:", error);
    return { message: "Internal Server Error", statusCode: 500, success: false, data: null };
  }
}
async function fetchGroupMessages(groupId, userId, limit = 10, lastMessageId = null, type = 'older') {
  console.log("lastMessageId", lastMessageId, "type", type);
  try {
    // Check if the group exists
    const group = await db.Group.findByPk(groupId);
    if (!group) {
      return { message: "Group not found", statusCode: 404, success: false, data: null };
    }

    // Base query conditions
    const whereCondition = { groupId };

    // If lastMessageId is provided, adjust query based on 'type'
    if (lastMessageId) {
      const lastMessage = await db.Message.findByPk(lastMessageId);
      if (!lastMessage) {
        return { message: "Last message not found", statusCode: 404, success: false, data: null };
      }

      if (type === 'older') {
        // Fetch older messages before the provided message
        whereCondition.createdAt = { [db.Sequelize.Op.lt]: lastMessage.createdAt };
      } else if (type === 'newer') {
        // Fetch newer messages after the provided message
        whereCondition.createdAt = { [db.Sequelize.Op.gt]: lastMessage.createdAt };
      } else {
        return { message: "Invalid type parameter", statusCode: 400, success: false, data: null };
      }
    }

    // Fetch messages with the conditions and pagination
    const messages = await db.Message.findAll({
      where: whereCondition,
      include: [
        {
          model: db.User,
          as: 'Sender',
          attributes: ['id', 'fullName', 'email', 'profileImageUrl'],
        }
      ],
      order: [['createdAt', 'DESC']], // Order by createdAt in descending order
      limit,
    });

    return {
      message: "Messages fetched successfully",
      statusCode: 200,
      success: true,
      data: { messages },
    };
  } catch (error) {
    console.error("Error fetching group messages:", error);
    return { message: "Internal Server Error", statusCode: 500, success: false, data: null };
  }
}


async function fetchPrivateMessages(userId, otherUserId, limit = 10, lastMessageId = null, type = 'older') {
  try {
    // Base query condition to fetch private messages
    const whereCondition = {
      [Op.or]: [
        { senderId: userId, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: userId },
      ],
    };

    // If lastMessageId is provided, adjust the query based on 'type'
    if (lastMessageId) {
      const lastMessage = await db.Message.findByPk(lastMessageId);
      if (!lastMessage) {
        return { message: 'Last message not found', statusCode: 404, success: false, data: null };
      }

      if (type === 'older') {
        // Fetch older messages before the provided message's createdAt timestamp
        whereCondition.createdAt = { [db.Sequelize.Op.lt]: lastMessage.createdAt };
      } else if (type === 'newer') {
        // Fetch newer messages after the provided message's createdAt timestamp
        whereCondition.createdAt = { [db.Sequelize.Op.gt]: lastMessage.createdAt };
      } else {
        return { message: 'Invalid type parameter', statusCode: 400, success: false, data: null };
      }
    }

    // Fetch messages with the conditions and pagination
    const messages = await db.Message.findAll({
      where: whereCondition,
      include: [
        {
          model: db.User,
          as: 'Sender',
          attributes: ['id', 'fullName', 'email'],
        },
        {
          model: db.User,
          as: 'Receiver',
          attributes: ['id', 'fullName', 'email'],
        },
      ],
      order: [['createdAt', 'DESC']], // Order by createdAt in descending order
      limit,
    });

    return {
      message: "Messages fetched successfully",
      statusCode: 200,
      success: true,
      data: { messages },
    };
  } catch (error) {
    console.error("Error fetching private messages:", error);
    return { message: "Internal Server Error", statusCode: 500, success: false, data: null };
  }
}

async function fetchChatDetails(userId, page, limit) {
  try {
    const offset = (page - 1) * limit; // Calculate the offset for pagination

    // Fetch group IDs where the user is a member or an admin
    const userGroupMemberships = await db.GroupMembership.findAll({
      where: {
        userId: userId,
        role: {
          [Op.in]: ["ADMIN", "MEMBER"], // The user must be an admin or a member
        },
      },
      attributes: ['groupId'],
    });

    const userGroupIds = userGroupMemberships.map(membership => membership.groupId); // Extract group IDs

    // Fetch chat records for the provided userId (including group chats)
    const chats = await db.Chat.findAll({
      where: {
        [Op.or]: [
          // One-on-one chats
          { userId: userId },
          { receiverId: userId },
          // Group chats where the user is a member or an admin
          { groupId: { [Op.in]: userGroupIds } },
        ],
      },
      order: [['updatedAt', 'DESC']], // Latest chats first based on updatedAt
      limit: limit,
      offset: offset,
      include: [
        {
          model: db.Group,
          as: 'group', // Ensure this matches the alias in Chat.associate
          attributes: ['id', 'name', 'icon'], // Select group details you want to include
          where: { id: { [Op.ne]: null } }, // Include only if groupId exists
          required: false, // Do not filter out chats without a group
        },
        {
          model: db.User,
          as: 'sender', // Include the sender details
          attributes: ['id', 'fullName', 'email', 'profileImageUrl'], // Use existing fields in User model
          required: false, // Do not filter out chats without a sender
        },
        {
          model: db.User,
          as: 'receiver', // Correct alias (case-sensitive)
          attributes: ['id', 'fullName', 'email', 'profileImageUrl'], // Use existing fields in User model
          required: false, // Do not filter out chats without a receiver
        },
        {
          model: db.Message,
          as: 'latestMessage', // Fetch the latest message for each chat
          attributes: ['text', 'senderId'], // Include the fields you need
          order: [['createdAt', 'DESC']], // Ensure it's the latest message
          limit: 1, // Only fetch the latest message
          required: false, // Do not filter out chats without messages
        }
      ],
    });

    // Get total count for pagination metadata
    const totalChats = await db.Chat.count({
      where: {
        [Op.or]: [
          // One-on-one chats
          { userId: userId },
          { receiverId: userId },
          // Group chats where the user is a member or an admin
          { groupId: { [Op.in]: userGroupIds } },
        ],
      },
    });

    const totalPages = Math.ceil(totalChats / limit); // Calculate total pages

    return {
      message: "Chat records fetched successfully",
      statusCode: 200,
      success: true,
      data: {
        chats,
        pagination: {
          currentPage: page,
          totalPages: totalPages,
          totalChats: totalChats,
        },
      },
    };
  } catch (error) {
    console.error("Error fetching chat details:", error);
    return { message: "Internal Server Error", statusCode: 500, success: false, data: null };
  }
}


async function fetchPinnedGroupMessages(groupId, userId, page = 1, limit = 10) {
  try {
    // Check if the group exists
    const group = await db.Group.findByPk(groupId);
    if (!group) {
      return { message: "Group not found", statusCode: 404, success: false, data: null };
    }

    // Fetch all messages from the group with pagination and reversed order
    const messages = await db.Message.findAll({
      where: { groupId, isPinned: true },
      include: [
        {
          model: db.User,
          as: 'Sender',
          attributes: ['id', 'fullName', 'email', 'profileImageUrl'],
        }
      ],
      order: [['createdAt', 'DESC']], // Order by createdAt in descending order
      limit,
      offset: (page - 1) * limit,
    });

    return {
      message: "Messages fetched successfully",
      statusCode: 200,
      success: true,
      data: { messages },
    };
  } catch (error) {
    console.error("Error fetching group messages:", error);
    return { message: "Internal Server Error", statusCode: 500, success: false, data: null };
  }
}



async function fetchPinnedPrivateMessages(chatId, page = 1, limit = 10) {
  try {
    // Fetch all messages from the group with pagination and reversed order
    const messages = await db.Message.findAll({
      where: { chatId, isPinned: true },
      include: [
        {
          model: db.User,
          as: 'Sender',
          attributes: ['id', 'fullName', 'email', 'profileImageUrl'],
        }
      ],
      order: [['createdAt', 'DESC']], // Order by createdAt in descending order
      limit,
      offset: (page - 1) * limit,
    });

    return {
      message: "Messages fetched successfully",
      statusCode: 200,
      success: true,
      data: { messages },
    };
  } catch (error) {
    console.error("Error fetching group messages:", error);
    return { message: "Internal Server Error", statusCode: 500, success: false, data: null };
  }
}



async function fetchPinnedSelfMessages(userId,chatId, page = 1, limit = 10) {
  try {
    // Fetch all messages from the group with pagination and reversed order
    const messages = await db.Message.findAll({
      where: { chatId, senderId: userId, isPinned: true , isSelfChat: true},
      include: [
        {
          model: db.User,
          as: 'Sender',
          attributes: ['id', 'fullName', 'email', 'profileImageUrl'],
        }
      ],
      order: [['createdAt', 'DESC']], // Order by createdAt in descending order
      limit,
      offset: (page - 1) * limit,
    });

    return {
      message: "Messages fetched successfully",
      statusCode: 200,
      success: true,
      data: { messages },
    };
  } catch (error) {
    console.error("Error fetching group messages:", error);
    return { message: "Internal Server Error", statusCode: 500, success: false, data: null };
  }
}

module.exports = {
  userLogin: userLogin,
  userCreate: userCreate,
  changePasswordService: changePasswordService,
  forgotPasswordService: forgotPasswordService,
  confirmLinkService: confirmLinkService,
  confirmPasswordService:confirmPasswordService,
  recoverPasswordService:recoverPasswordService,
  getUserByIdService:getUserByIdService,
  followUserService: followUserService,
  unfollowUserService: unfollowUserService,
  userUpdate: userUpdate,
  fetchFollowers: fetchFollowers,
  fetchFollowing: fetchFollowing,
  removeFollowerService: removeFollowerService,
  searchUsers: searchUsers,
  checkUsername: checkUsername,
  fetchSelfChatMessages: fetchSelfChatMessages,
  createSelfChatMessage: createSelfChatMessage,
  sendMessageToGroup: sendMessageToGroup,
  sendMessageToUser: sendMessageToUser,
  fetchGroupMessages: fetchGroupMessages,
  fetchPrivateMessages: fetchPrivateMessages,
  fetchChatDetails: fetchChatDetails,
  fetchPinnedGroupMessages: fetchPinnedGroupMessages,
  fetchPinnedPrivateMessages: fetchPinnedPrivateMessages,
  fetchPinnedSelfMessages: fetchPinnedSelfMessages
};
