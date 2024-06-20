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
  const loggedInUser = req.user;
  const userId = loggedInUser.userId;
  try {
    const { response, statusCode, error } = await reviewServices(
      userId,
      loggedInUser.uid,
      req.body
    );

    if (error) {
      return res.status(statusCode || 500).json({
        message: response.errors ? response.errors[0].message : "An error occurred",
        error: true,
        success: false
      });
    }
    return res.status(statusCode || 200).json({
      message: response,
      error: false,
      success: true
    });
  } catch (error) {
    return res.status(500).json({
      message: "An error occurred",
      error: true,
      success: false
    });
  }
};

const fetchAllReview = async (req, res) => {
  let exploreId = req.query.id;
  if (!exploreId) {
    return res.status(400).json({
      message: "Please provide explore id",
      error: true,
      success: false
    });
  }

  let pageSize = req.query.pSize ? Number(req.query.pSize) : 10;
  let start = req.query.page ? pageSize * (Number(req.query.page) - 1) : 0;

  try {
    const { response, statusCode, error } = await fetchAllReviewService(
      start,
      pageSize,
      exploreId
    );
    if (error) {
      return res.status(statusCode || 500).json({
        message: "Something went wrong",
        error: true,
        success: false
      });
    }
    return res.status(statusCode || 200).json({
      message: response,
      error: false,
      success: true
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong",
      error: true,
      success: false
    });
  }
};

const fetchReviewById = async (req, res) => {
  const reviewId = req.params.reviewId;
  try {
    const { response, statusCode, error } = await fetchReviewByIdServices(reviewId);
    if (error) {
      return res.status(statusCode || 500).json({
        message: response,
        error: true,
        success: false
      });
    }
    return res.status(statusCode || 200).json({
      message: response,
      error: false,
      success: true
    });
  } catch (error) {
    console.log("Error occurred, please check", error);
    return res.status(500).json({
      message: "An error occurred",
      error: true,
      success: false
    });
  }
};

const deleteReview = async (req, res) => {
  const loggedInUser = req.user;
  const userId = loggedInUser.userId;
  const id = req.params.id;
  try {
    const { response, statusCode, error } = await deleteReviewByIdService(id, userId);
    if (error) {
      return res.status(statusCode || 500).json({
        message: response,
        error: true,
        success: false
      });
    }
    return res.status(statusCode || 200).json({
      message: response,
      error: false,
      success: true
    });
  } catch (error) {
    return res.status(500).json({
      message: "An error occurred",
      error: true,
      success: false
    });
  }
};

const updateReview = async (req, res) => {
  try {
    const loggedInUser = req.user;
    const userId = loggedInUser.userId;
    const reviewId = req.params.reviewId;
    const updatedReviewData = req.body;
    const { response, statusCode, error } = await updateReviewByIdService(
      userId,
      reviewId,
      updatedReviewData
    );

    if (error) {
      return res.status(statusCode || 500).json({
        message: response,
        error: true,
        success: false
      });
    }
    return res.status(statusCode || 200).json({
      message: response,
      error: false,
      success: true
    });
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      message: "Something went wrong",
      error: true,
      success: false
    });
  }
};

const reviewReply = async (req, res) => {
  const loggedInUser = req.user;
  const userId = loggedInUser.userId;
  const uid = loggedInUser.uid;

  const reviewId = req.params.id;
  try {
    const { response, statusCode, error } = await reviewRepliesService(userId, uid, reviewId);
    if (error) {
      return res.status(statusCode || 500).json({
        message: response,
        error: true,
        success: false
      });
    }
    return res.status(statusCode || 200).json({
      message: response,
      error: false,
      success: true
    });
  } catch (error) {
    return res.status(500).json({
      message: "An error occurred",
      error: true,
      success: false
    });
  }
};

const updateReviewReply = async (req, res) => {
  const loggedInUser = req.user;
  const userId = loggedInUser.userId;
  const reviewId = req.params.id;
  const updatedReply = req.body.text;
  try {
    const { response, statusCode, error } = await updateReviewRepliesService(
      userId,
      reviewId,
      updatedReply
    );
    if (error) {
      return res.status(statusCode || 500).json({
        message: response,
        error: true,
        success: false
      });
    }
    return res.status(statusCode || 200).json({
      message: response,
      error: false,
      success: true
    });
  } catch (error) {
    return res.status(500).json({
      message: "An error occurred",
      error: true,
      success: false
    });
  }
};

module.exports = {
  createReview,
  fetchAllReview,
  fetchReviewById,
  deleteReview,
  updateReview,
  reviewReply,
  updateReviewReply
};
