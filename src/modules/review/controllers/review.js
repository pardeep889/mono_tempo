const {
  reviewServices,
  fetchReviewByIdServices,
  deleteReviewByIdService,
  updateReviewByIdService,
  fetchAllReviewService,
  reviewRepliesService,
  updateReviewRepliesService,
  likeReviewService,
  dislikeReviewService,
  fetchReviewByExploreIdServices,
  fetchMyReviewsService,
  fetchMyExploreReviewsService,
} = require("../services/reviewServices");
const db = require("../../../../sequelize/models/review");

const createReview = async (req, res) => {
  const loggedInUser = req.user;
  const userId = loggedInUser.userId;
  try {
    const { response, statusCode, success } = await reviewServices(userId, loggedInUser.uid, req.body);

    return res.status(statusCode || 500).json({
      message: response,
      success,
      data: success ? response : null,
    });
  } catch (error) {
    return res.status(500).json({
      message: "An error occurred",
      success: false,
      data: null,
    });
  }
};

const fetchAllReview = async (req, res) => {
  let exploreId = req.query.id;
  if (!exploreId) {
    return res.status(400).json({
      message: "Please provide explore id",
      success: false,
      data: null,
    });
  }

  let pageSize = req.query.pSize ? Number(req.query.pSize) : 10;
  let start = req.query.page ? pageSize * (Number(req.query.page) - 1) : 0;

  try {
    const { response, statusCode, success } = await fetchAllReviewService(start, pageSize, exploreId);

    return res.status(statusCode || 500).json({
      message: success ? "Reviews fetched successfully" : "Something went wrong",
      success,
      data: success ? response : null,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong",
      success: false,
      data: null,
    });
  }
};

const fetchReviewById = async (req, res) => {
  const reviewId = req.params.reviewId;
  try {
    const { response, statusCode, success } = await fetchReviewByIdServices(reviewId);

    return res.status(statusCode || 500).json({
      message: "Reviews fetched successfully",
      success,
      data: success ? response : null,
    });
  } catch (error) {
    console.log("Error occurred, please check", error);
    return res.status(500).json({
      message: "An error occurred",
      success: false,
      data: null,
    });
  }
};

const fetchReviewByExploreId = async (req, res) => {
  const exploreId = req.params.exploreId;
  try {
    const { response, statusCode, success } = await fetchReviewByExploreIdServices(exploreId);

    return res.status(statusCode || 500).json({
      message: "Reviews fetched successfully",
      success,
      data: success ? response : null,
    });
  } catch (error) {
    console.log("Error occurred, please check", error);
    return res.status(500).json({
      message: "An error occurred",
      success: false,
      data: null,
    });
  }
};

const fetchMyReviews = async (req, res) => {
  const userId = req.user.userId;
  try {
    const { response, statusCode, success } = await fetchMyReviewsService(userId);

    return res.status(statusCode || 500).json({
      message: "Reviews fetched successfully",
      success,
      data: success ? response : null,
    });
  } catch (error) {
    console.log("Error occurred, please check", error);
    return res.status(500).json({
      message: "An error occurred",
      success: false,
      data: null,
    });
  }
};


const fetchMyExploreReviews = async (req, res) => {
  const userId = req.user.userId;
  const exploreId = req.params.exploreId;

  try {
    const { response, statusCode, success } = await fetchMyExploreReviewsService(userId,exploreId);

    return res.status(statusCode || 500).json({
      message: "Reviews fetched successfully",
      success,
      data: success ? response : null,
    });
  } catch (error) {
    console.log("Error occurred, please check", error);
    return res.status(500).json({
      message: "An error occurred",
      success: false,
      data: null,
    });
  }
};


const deleteReview = async (req, res) => {
  const loggedInUser = req.user;
  const userId = loggedInUser.userId;
  const id = req.params.id;
  try {
    const { response, statusCode, success } = await deleteReviewByIdService(id, userId);

    return res.status(statusCode || 500).json({
      message: response,
      success,
      data: null,
    });
  } catch (error) {
    return res.status(500).json({
      message: "An error occurred",
      success: false,
      data: null,
    });
  }
};

const updateReview = async (req, res) => {
  try {
    const loggedInUser = req.user;
    const userId = loggedInUser.userId;
    const reviewId = req.params.reviewId;
    const updatedReviewData = req.body;
    const { response, statusCode, success } = await updateReviewByIdService(userId, reviewId, updatedReviewData);

    return res.status(statusCode || 500).json({
      message: response,
      success,
      data: null,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something went wrong",
      success: false,
      data: null,
    });
  }
};

const reviewReply = async (req, res) => {
  const userId = req.user.userId;
  const uid = req.user.uid;
  const {review, exploreId, reviewId, isCreater}  = req.body;
  const { message, statusCode, success, data } = await reviewRepliesService(userId, uid, exploreId, reviewId, review, isCreater);
  return res.status(statusCode).json({
    message: message,
    success,
    data: data,
  });
};

const updateReviewReply = async (req, res) => {
  const loggedInUser = req.user;
  const userId = loggedInUser.userId;
  const reviewId = req.params.id;
  const updatedReply = req.body.text;
  try {
    const { response, statusCode, success } = await updateReviewRepliesService(userId, reviewId, updatedReply);

    return res.status(statusCode || 500).json({
      message: response,
      success,
      data: null,
    });
  } catch (error) {
    return res.status(500).json({
      message: "An error occurred",
      success: false,
      data: null,
    });
  }
};

const likeReview = async (req, res) => {
  const userId = req.user.userId;
  const { reviewId } = req.params;

  const { message, statusCode, success, data } = await likeReviewService(userId, reviewId);
  return res.status(statusCode).json({
    message: message,
    success,
    data: data,
  });
};

const dislikeReview = async (req, res) => {
  const userId = req.user.userId;
  const { reviewId } = req.params;

  const { message, statusCode, success, data } = await dislikeReviewService(userId, reviewId);
  return res.status(statusCode).json({
    message: message,
    success,
    data: data,
  });
};


module.exports = {
  createReview,
  fetchAllReview,
  fetchReviewById,
  deleteReview,
  updateReview,
  reviewReply,
  updateReviewReply,
  likeReview,
  dislikeReview,
  fetchReviewByExploreId,
  fetchMyReviews,
  fetchMyExploreReviews
};
