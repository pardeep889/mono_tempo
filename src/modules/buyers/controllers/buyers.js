const {
  createBuyerService,
  deleteBuyerService,
} = require("../services/buyers");

const createBuyer = async (req, res) => {
  const {uid} = req.user;
    const { exploreId, custId } = req.body;
    const { response, statusCode, error } = await createBuyerService(
      exploreId,
      uid,
      custId
    );
    return res.status(statusCode).send({
      messsage: response,
      success: !error,
      error: error
    })
};
// const deleteBuyer = async (req, res) => {
//   const loggedInUser = JSON.parse(req.headers["x-logged-in-user"]);
//   const exploreId = req.params.id;
//   if (loggedInUser) {
//     const userId = loggedInUser.userId;
//     const { response, statusCode, error } = await deleteBuyerService(exploreId,userId);
//     try {
//       if (error) return res.status(statusCode).send(response);
//       return res.status(statusCode).send(response);
//     } catch (error) {
//       return res.status(statusCode).json("error");
//     }
//   } else {
//     return {
//       response: "Only loggedin users are allowed to do this action!",
//       statusCode: 4000,
//       error: true,
//     };
//   }
// };

module.exports = {
  createBuyer: createBuyer,
//   deleteBuyer: deleteBuyer,
};
