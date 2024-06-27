const {
    adminFetchCountService,
  } = require("../services/admin");
  
  const countFetch = async (req, res) => {
    try {
      const { response, statusCode, error } = await adminFetchCountService();
  
      return res.status(statusCode).json({ success: true, message: response , error: error});
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  };
  
  module.exports = {
    countFetch: countFetch
  };
  