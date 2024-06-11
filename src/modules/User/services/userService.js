const jwt = require("jsonwebtoken");
const secretKey = "TEST_SECRET_KEY";
const db = require("../../../../sequelize/models");
const bcrypt = require("bcrypt");
const { Sequelize } = require("sequelize");
const { generateRandomCode } = require("../../util/awsHelper");
const saltRounds = 10;

async function getUserById(userId) {
  try {
    const user = await db.User.findByPk(userId,
      {
        attributes: { exclude: ['password', 'forgotLink'] }
      });
    if (!user) {
      return { response: "User not found", statusCode: 404, error: true, success: false };
    }
    return { response: user, statusCode: 200, error: false, success: true };
  } catch (error) {
    console.error("Error fetching user:", error);
    return { response: "Error fetching user", statusCode: 500, error: true , success: false};
  }
}
async function userLogin(email, password) {
  console.log("body",email,password)
  try {

    const user = await db.User.findOne({ where: { email } });
    if (!user) {
      return { response: "User not found", statusCode: 404, error: true };
    }
    if(user.dataValues.passwordChangeRequired){
      return { response: "Password Change Required", statusCode: 404, error: true };
    }
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return { response: "Incorrect password", statusCode: 401, error: true };
    }
    const token = generateToken({
      userId: user.id,
      email: user.email,
    });
    
    return { response: {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        accountStatus: user.accountStatus,
        stripeCustomerId: user.stripeCustomerId,
        isSubscribed: user.isSubscribed
      },
      token: token
    }, statusCode: 200, error: false };
  } catch (error) {
    console.error("Error login user:", error);
    return { response: "Log in user failed", statusCode: 500, error: true };
  }
}

function generateToken(user) {
  return jwt.sign(user, secretKey, { expiresIn: "1h" }); // Token expires in 1 hour
}

async function userCreate(userData) {
  try {
    const hashedPassword = await bcrypt.hash(userData.password, saltRounds);
    const time = (new Date().getTime()).toString();
    await db.User.create({
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      phoneNumber: userData.phoneNumber,
      password: hashedPassword,
      userType: userData.userType,
      isEmailVerified: false,
      accountStatus: "active",
      uid: userData.uid,
      fullName: userData.fullName,
      location: userData.location,
      username: userData.username,
      profileImageUrl: userData.profileImageUrl,
      stripeCustomerId: userData.stripeCustomerId,
      userStatus: userData.userStatus,
      isSubscribed: userData.isSubscribed,
      createdAt: userData.createdAt,
      updatedAt: time
    });

    return { response:"user created successfully!", statusCode: 200, error: false };
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
  const code = generateRandomCode(8);
  try {
    db.User.update(
      {
        forgotLink: code,
      },
      { where: { email: email } }
    );
    return { response: code, statusCode: 200, error: false };
  } catch (error) {
    return { response: error, statusCode: 400, error: true };
  }
}
async function confirmLinkService(forgotlink) {
  try {
    const dbResponse = await db.User.findOne({
      where: { forgotLink: forgotlink },
    });
    return {
      response: {
        email: dbResponse.dataValues.email,
        fistName: dbResponse.dataValues.firstName,
        forgotLink: dbResponse.dataValues.forgotLink,
      },
      statusCode: 200,
      error: false,
    };
  } catch (error) {
    return { response: error, statusCode: 400, error: true };
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

module.exports = {
  userLogin: userLogin,
  userCreate: userCreate,
  changePasswordService: changePasswordService,
  forgotPasswordService: forgotPasswordService,
  confirmLinkService: confirmLinkService,
  confirmPasswordService:confirmPasswordService,
  recoverPasswordService:recoverPasswordService,
  getUserById:getUserById,
  
};
