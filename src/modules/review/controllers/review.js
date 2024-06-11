const {
  reviewServices,
  fetchReviewByIdServices,
  deleteReviewByIdService,
  updateReviewByIdService,
  fetchAllReviewService,
  reviewRepliesService,
  updateReviewRepliesService,
} = require("../services/reviewServices");
const db = require("../../../../sequelize/models/review");

const createReview = async (req, res) => {
  const loggedInUser = JSON.parse(req.headers["x-logged-in-user"]);
  const userId = loggedInUser.userId;
  try {
    const { response, statuscode, error } = await reviewServices(
      userId,
      req.body
    );

    if (error) {
      return res.status(statuscode || 500).json(response.errors[0].message);
    }
    return res.status(statuscode || 200).json(response);
  } catch (error) {
    return res.status(500).json("error");
  }
};
const fetchAllReview = async (req, res) => {
  let pageSize = req.query.pSize ? Number(req.query.pSize) : 10;
  let start = req.query.page ? pageSize * (Number(req.query.page) - 1) : 0;
  const { response, statusCode, error } = await fetchAllReviewService(
    start,
    pageSize
  );
  try {
    if (error) return res.status(statusCode).send(response);
    return res.status(statusCode).send(response);
  } catch (error) {
    return res.status(400).json("error");
  }
};
const fetchReviewById = async (req, res) => {
  const reviewId = req.params.reviewId;
  const { response, statusCode, error } = await fetchReviewByIdServices(
    reviewId
  );
  try {
    if (error) return res.status(statusCode).send(response);
    return res.status(statusCode).send(response);
  } catch (error) {
    console.log("error occured please check", error);
    return res.status(400).json("error");
  }
};
const deleteReview = async (req, res) => {
  const loggedInUser = JSON.parse(req.headers["x-logged-in-user"]);
  const userId = loggedInUser.userId;
  const id = req.params.id;
  const { response, statusCode, error } = await deleteReviewByIdService(
    id,
    userId
  );
  try {
    if (error) return res.status(statusCode).send(response);
    return res.status(statusCode).send(response);
  } catch (error) {
    return res.status(400).json("error");
  }
};
const updateReview = async (req, res) => {
  try {
    const loggedInUser = JSON.parse(req.headers["x-logged-in-user"]);
    const userId = loggedInUser.userId;
    const reviewId = req.params.reviewId;
    const updatedReviewData = req.body;
    const { response, statusCode, error } = await updateReviewByIdService(
      userId,
      reviewId,
      updatedReviewData
    );

    if (error) {
      return res.status(statusCode).send(response);
    }
    return res.status(statusCode).send(response);
  } catch (error) {
    return res.status(400).json("error");
  }
};
const reviewReply=async(req,res)=>{
  const loggedInUser = JSON.parse(req.headers["x-logged-in-user"]);
  const userId =loggedInUser.userId;
  const reviewId = req.params.id;
  const {response,statusCode,error} = await reviewRepliesService(userId,reviewId);
  try {
    if(error) return res.status(statusCode).send(response);
    return res.status(statusCode).send(response);
  } catch (error) {
    return res.status(400).json("error")
  }
};
const updateReviewReply =async(req,res)=>{
  const loggedInUser = JSON.parse(req.headers["x-logged-in-user"]);
  const userId=loggedInUser.userId;
  const reviewId = req.params.id;
  const updatedReply = req.body.text;
  const {response,statusCode,error} = await updateReviewRepliesService(userId,reviewId,updatedReply);
  try {
    if(error) return res.status(statusCode).send(response);
    return res.status(statusCode).send(response)  
  } catch (error) {
    return res.status(400).json("error")
  }
  
};

module.exports = {
  createReview: createReview,
  fetchAllReview: fetchAllReview,
  fetchReviewById: fetchReviewById,
  deleteReview: deleteReview,
  updateReview: updateReview,
  reviewReply:reviewReply,
  updateReviewReply:updateReviewReply
};
