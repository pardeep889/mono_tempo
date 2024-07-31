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
  const { message, success, statusCode, data } = await getUserByIdService(id, parseInt(start), parseInt(pageSize));
  return res.status(statusCode).json({
    success,
    message,
    data
  });
};

const followUser = async (req, res) => {
  const { userId } = req.body;
  const followerId = req.user.userId;

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
  unfollowUser
};
