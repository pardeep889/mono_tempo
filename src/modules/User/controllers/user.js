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
      return res.status(statusCode).json({ success: false, message: response });
    }
    console.log("first", response);

    return res.status(statusCode).json({ success: true, message: response });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

const createUser = async (req, res) => {
  try {
    const { response, statusCode, error } = await userCreate(req.body);
    if (error) {
      return res.status(statusCode).json({ success: false, message: response , error: false});
    }
    return res.status(statusCode).json({ success: true, message: response, error: true });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};
const changePassword = async (req, res) => {
  const { error, value } = changePasswordSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ success: false,message: error.details[0].message });
  }
  const { email, old_password, new_password } = req.body;

  try {
    const { response, statusCode, error } = await changePasswordService(
      email,
      old_password,
      new_password
    );
    if (error) {
      return res.status(statusCode).json({ success: false, message: response });
    }
    return res.status(statusCode).json({ success: true, message: response });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const { response, statusCode, error } = await forgotPasswordService(email);
  if (error) {
    return res.status(statusCode).json({ success: false, message: response });
  }
  return res.status(statusCode).json({ success: true, message: response });
};

const confirmLink = async (req, res) => {
  const forgotlink = req.params.link;
  const { response, statusCode, error } = await confirmLinkService(forgotlink);
  if (error) {
    return res.status(statusCode).json({ success: false, message: response });
  }
  return res.status(statusCode).json({ success: true, message: response });
};

const confirmPassword = async (req, res) => {
  const { error, value } = verifyLinkSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ success: false, message: error.details[0].message });
  }
  const { email, password, forgotLink } = req.body;
  try {
    const { response, error, statusCode } = await confirmPasswordService(
      email,
      password,
      forgotLink
    );
    if (error) {
      return res.status(statusCode).json({ success: false, message: response });
    }
    return res.status(statusCode).json({ success: true, message: response });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

const recoverPassword = async (req, res) => {
  const { email, new_password } = req.body;
  if(new_password.length < 5){
    return res.status(500).json({ success: false, message: "The password must be longer than 5 characters." });
  }

  try {
    const { response, statusCode, error } = await recoverPasswordService(
      email,
      new_password
    );
    if (error) {
      return res.status(statusCode).json({ success: false, message: response });
    }
    return res.status(statusCode).json({ success: true, message: response });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};


const fetchUserByIdController = async (req, res) => {
  const userId = req.params.id;
  const { success, statusCode, error, response } = await getUserById(userId);
  if (error) {
    return res.status(statusCode).json({ error, success, response});
  }
  return res.status(statusCode).json({ error, success, response });

};
module.exports = {
  logingUser: logingUser,
  createUser: createUser,
  changePassword: changePassword,
  confirmPassword: confirmPassword,
  forgotPassword: forgotPassword,
  confirmLink: confirmLink,
  recoverPassword:recoverPassword,
  fetchUserByIdController: fetchUserByIdController
};
