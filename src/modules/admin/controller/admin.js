const {
    adminFetchCountService,
    FetchAllUsers,
    promoteExplore,
  } = require("../services/admin");
  
  const countFetch = async (req, res) => {
    try {
      const { response, statusCode, error } = await adminFetchCountService();
      if(error){
        return res.status(statusCode).json({ success: false, message: response ,data:null});
      }
  
      return res.status(statusCode).json({ success: true, message: response ,data:null});
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  };
  const FetchUsers = async (req, res) => {
    try {
      const { start, pageSize, role } = req.query;
      const { response, statusCode, error } = await FetchAllUsers(start, pageSize, role);
      if(error){
        return res.status(statusCode).json({ success: false, message: response ,data:null});
      }
      return res.status(statusCode).json({ success: true, message: "User Fetched Successfully" , data: response});
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ success: false, message: "Internal Server Error", data : null });
    }
  };

  const promoteAExplore = async (req, res) => {
    try {
      const { id, promote } = req.body;
      const { response, statusCode, error } = await promoteExplore(id, promote);
      if(error){
        return res.status(statusCode).json({ success: false, message: response ,data:null});
      }  
      return res.status(statusCode).json({ success: true, message: response , data: null});
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ success: false, message: "Internal Server Error" , data: null});
    }
  };
  
  module.exports = {
    countFetch: countFetch,
    FetchUsers: FetchUsers,
    promoteAExplore: promoteAExplore
  };
  