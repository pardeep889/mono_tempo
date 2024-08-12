const { Review } = require("../../../../sequelize/models");
const db = require("../../../../sequelize/models");

const reviewServices = async (userId, uid, data) => {
  try {
    const explore = await db.Explore.findOne({ where: { id: data.exploreId } });

    if (!explore) {
      return { response: "Invalid exploreId", statusCode: 400, success: false };
    }

    const dbResponse = await Review.create({
      rating: data.rating,
      text: data.text,
      userId: userId,
      uid: uid,
      exploreId: data.exploreId,
    });

    if (explore) {
      explore.totalReviewsCount = Number(explore.totalReviewsCount || 0) + 1;
      await explore.save();
    }

    return { response: dbResponse.dataValues, statusCode: 200, success: true };
  } catch (error) {
    console.log(error);
    return { response: "An error occurred", statusCode: 500, success: false };
  }
};
const fetchAllReviewService = async (start, pageSize, exploreId, userId) => {
  try {
    const dbResponse = await db.Review.findAndCountAll({
      where: { exploreId: exploreId },
      offset: start,
      limit: pageSize,
      include: [
        {
          model: db.User,
          as: 'user',
          attributes: ['id', 'username', 'fullName', 'profileImageUrl', 'uid'],
        },
        {
          model: db.ReviewsReplies,
          as: 'replies',
          attributes: ['id', 'userId', 'uid', 'reviewId', 'text', 'isCreater', 'createdAt'],
          include: [
            {
              model: db.User,
              as: 'user',
              attributes: ['id', 'username', 'fullName', 'profileImageUrl', 'uid'],
            },
          ],
        },
        {
          model: db.ReviewLike,
          as: 'likes',
          attributes: ['id'],
          include: [
            {
              model: db.User,
              as: 'user',
              attributes: ['id', 'username', 'fullName', 'profileImageUrl', 'uid'],
            },
          ],
        },
      ],
    });

    const reviews = dbResponse.rows.map(review => {
      const reviewData = review.toJSON();
      reviewData.likesCount = review.likes.length;
      reviewData.isLiked = review.likes.some(like => like.userId === userId);
      return reviewData;
    });

    // Count the total number of reviews for the specified exploreId
    const reviewsCount = await db.Review.count({
      where: { exploreId: exploreId }
    });

    // Count the total number of replies for the specified exploreId
    const repliesCount = await db.ReviewsReplies.count({
      include: [{
        model: db.Review,
        as: 'review',
        where: { exploreId: exploreId }
      }]
    });

    return { response: { reviews, reviewsCount, repliesCount }, statusCode: 200, success: true };
  } catch (error) {
    console.log(error);
    return { response: "An error occurred", statusCode: 500, success: false };
  }
};




const fetchReviewByIdServices = async (reviewId) => {
  try {
    const review = await db.Review.findByPk(reviewId);
    if (!review) {
      return { response: "Review not found", statusCode: 404, success: false };
    }
    return { response: review, statusCode: 200, success: true };
  } catch (error) {
    console.log(error);
    return { response: "An error occurred", statusCode: 500, success: false };
  }
};

const fetchReviewByExploreIdServices = async (exploreId) => {
  try {
    const review = await db.Review.findAll({ where: { exploreId: exploreId } });
    if (!review) {
      return { response: "Review not found", statusCode: 404, success: false };
    }
    return { response: review, statusCode: 200, success: true };
  } catch (error) {
    console.log(error);
    return { response: "An error occurred", statusCode: 500, success: false };
  }
};

const fetchMyReviewsService = async (userId) => {
  try {
    const review = await db.Review.findAll({ where: { userId: userId } });
    if (!review) {
      return { response: "Review not found", statusCode: 404, success: false };
    }
    return { response: review, statusCode: 200, success: true };
  } catch (error) {
    console.log(error);
    return { response: "An error occurred", statusCode: 500, success: false };
  }
};

const fetchMyExploreReviewsService = async (userId, exploreId) => {
  try {
    const review = await db.Review.findAll({ where: { userId: userId, exploreId } });
    if (!review) {
      return { response: "Review not found", statusCode: 404, success: false };
    }
    return { response: review, statusCode: 200, success: true };
  } catch (error) {
    console.log(error);
    return { response: "An error occurred", statusCode: 500, success: false };
  }
};

const deleteReviewByIdService = async (id, userId) => {
  try {
    const result = await db.Review.destroy({ where: { id, userId } });
    if (result === 0) {
      return { response: "Review not found or could not be deleted", statusCode: 404, success: false };
    }
    return { response: "Review deleted successfully", statusCode: 200, success: true };
  } catch (error) {
    return { response: "An error occurred", statusCode: 500, success: false };
  }
};

const updateReviewByIdService = async (userId, reviewId, updatedReviewData) => {
  try {
    const result = await db.Review.update(updatedReviewData, {
      where: { id: reviewId, userId: userId },
    });
    if (result[0] === 0) {
      return { response: "Review not found", statusCode: 404, success: false };
    }
    return { response: "Review updated successfully", statusCode: 200, success: true };
  } catch (error) {
    console.log(error);
    return { response: "An error occurred", statusCode: 500, success: false };
  }
};

const reviewRepliesService = async (userId, uid, exploreId, reviewId, review, isCreater) => {
  console.log(userId, exploreId, reviewId, review)
  try {
    const isReviewExist = await db.Review.findOne({ where: { id: reviewId } });
    if (!isReviewExist) {
      return { message: "Review not found", statusCode: 404, success: false , data: null};
    }
    const exploreDbResponse = await db.Explore.findOne({ where: { id: exploreId } });
    if (exploreDbResponse !== null) {
      await db.ReviewsReplies.create({
        userId: userId,
        uid: uid,
        reviewId: reviewId,
        text: review,
        isCreater: isCreater,
      });
      return { message: "Reply posted successfully", statusCode: 200, success: true , data: null};
    }
    return { message: "explore not found", statusCode: 404, success: false, data: null };
  } catch (error) {
    console.error(error);
    return { message: "Internal server error", statusCode: 500, success: false , data: null};
  }
};

const updateReviewRepliesService = async (userId, reviewId, updatedReply) => {
  const reviewResponse = await db.ReviewsReplies.findOne({ where: { id: reviewId, userId: userId } });
  if (!reviewResponse) {
    return { response: "Reply associated with this review is not found", statusCode: 404, success: false };
  }
  try {
    await db.ReviewsReplies.update({ text: updatedReply }, { where: { userId: userId, id: reviewId } });
    return { response: "Review reply updated successfully", statusCode: 200, success: true };
  } catch (error) {
    return { response: "An error occurred", statusCode: 500, success: false };
  }
};
const likeReviewService = async (userId, reviewId) => {
  try {
    const review = await db.Review.findByPk(reviewId);
    if (!review) {
      return { message: "Review not found", statusCode: 404, success: false, data: null };
    }

    const like = await db.ReviewLike.findOne({ where: { userId, reviewId } });
    if (like) {
      return { message: "You have already liked this review", statusCode: 400, success: false, data: null };
    }

    await db.ReviewLike.create({ userId, reviewId });
    return { message: "Review liked successfully", statusCode: 200, success: true, data: null };
  } catch (error) {
    console.error("Error liking review:", error);
    return { message: "Internal server error", statusCode: 500, success: false, data: null };
  }
};

const dislikeReviewService = async (userId, reviewId) => {
  try {
    const review = await db.Review.findByPk(reviewId);
    if (!review) {
      return { message: "Review not found", statusCode: 404, success: false, data: null };
    }

    const like = await db.ReviewLike.findOne({ where: { userId, reviewId } });
    if (!like) {
      return { message: "You have not liked this review", statusCode: 400, success: false, data: null };
    }

    await like.destroy();
    return { message: "Review unliked successfully", statusCode: 200, success: true, data: null };
  } catch (error) {
    console.error("Error unliking review:", error);
    return { message: "Internal server error", statusCode: 500, success: false, data: null };
  }
};



module.exports = {
  reviewServices,
  fetchAllReviewService,
  fetchReviewByIdServices,
  deleteReviewByIdService,
  updateReviewByIdService,
  reviewRepliesService,
  updateReviewRepliesService,
  likeReviewService,
  dislikeReviewService,
  fetchReviewByExploreIdServices,
  fetchMyReviewsService,
  fetchMyExploreReviewsService
};
