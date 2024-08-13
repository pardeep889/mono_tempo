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

async function getUserByIdService(userId, start = 0, pageSize = 10) {
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

    const userWithFollowData = {
      ...user.toJSON(),
      following: following.rows.map(f => f.followed),
      followingCount: following.count,
      followers: followers.rows.map(f => f.follower),
      followersCount: followers.count
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
      uid: user.uid
    });
    const refreshToken = generateRefreshToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      uid: user.uid
    });

    return {
      response: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
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

async function followUserService(followerId, userId){
  try {
    await db.Follow.create({
      followerId: followerId,
      followedId: userId,
    });
    return { message: "Successfully followed the user", statusCode: 200,success: true, data: null};
  } catch (error) {
    console.error("Error following user:", error);
    return { message: "Internal Server Error", statusCode: 500, success: false, data: null};
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
  userUpdate: userUpdate
};
