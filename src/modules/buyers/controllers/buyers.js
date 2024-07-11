const {
  createBuyerService,
  deleteBuyerService,
} = require("../services/buyers");

const createBuyer = async (req, res) => {
  const { uid } = req.user;
  const { exploreId, custId } = req.body;
  try {
    const { response, statusCode, error } = await createBuyerService(
      exploreId,
      uid,
      custId
    );

    return res.status(statusCode).json({
      message: response,
      success: !error,
      data: null
    });
  } catch (error) {
    console.error("Error in createBuyer:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
      data: null
    });
  }
};

const deleteBuyer = async (req, res) => {
  const loggedInUser = req.user;
  const exploreId = req.params.id;

  if (!loggedInUser) {
    return res.status(400).json({
      message: "Only logged-in users are allowed to perform this action!",
      success: false,
      data: null
    });
  }

  const userId = loggedInUser.uid;

  try {
    const { response, statusCode, error } = await deleteBuyerService(exploreId, userId);

    if (error) {
      return res.status(statusCode).json({
        message: response,
        success: false,
        data: null
      });
    }

    return res.status(statusCode).json({
      message: response,
      success: true,
      data: null
    });
  } catch (error) {
    console.error("Error in deleteBuyer:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
      data: null
    });
  }
};

module.exports = {
  createBuyer: createBuyer,
  deleteBuyer: deleteBuyer,
};
