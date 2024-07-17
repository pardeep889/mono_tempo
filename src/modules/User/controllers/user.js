const {
  userLogin,
  userCreate,
  changePasswordService,
  confirmPasswordService,
  forgotPasswordService,
  confirmLinkService,
  recoverPasswordService,
  getUserById,
} = require("../services/userService");
const { changePasswordSchema } = require("../validation/changePasswordSchema");
const { verifyLinkSchema } = require("../validation/verifyLinkSchema");

const logingUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const { response, statusCode, error } = await userLogin(email, password);
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
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Error",
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
  const userId = req.params.id;
  try {
    const { success, statusCode, error, response } = await getUserById(userId);
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

module.exports = {
  logingUser,
  createUser,
  changePassword,
  confirmPassword,
  forgotPassword,
  confirmLink,
  recoverPassword,
  fetchUserByIdController,
};
