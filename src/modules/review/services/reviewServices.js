const { Review } = require("../../../../sequelize/models");
const db = require("../../../../sequelize/models"); 

const { Explore } = require("../../../../sequelize/models");


const reviewServices = async (userId,data) => {
  try {
    const dbResponse = await Review.create({
      rating: data.rating,
      text: data.text,
      userId: userId,
    });
    const explore = await db.Explore.findOne({
      where: { id: data.exploreId }
    });
    if (!explore) {
      return {
        response: "Invalid exploreId",
        statusCode: 400, 
        error: true,
      };
    }
    if (explore) {
      console.log("increment", explore.totalReviewsCount)
      explore.totalReviewsCount =Number(explore.totalReviewsCount || 0) + 1;
      console.log("here bro", explore.totalReviewsCount)
      await explore.save(); 
    }
    console.log(dbResponse.dataValues);
    return {
      response: dbResponse.dataValues,
      statusCode: 200,
      error: false,
    };
  } catch (error) {
    console.log(error);
    return {
      response: error,
      statusCode: 401,
      error: true,
    };
  }
};

const fetchAllReviewService = async(start, pageSize)=>{
  try {
    const dbResponse = await db.Review.findAll({
      offset: start,
      limit: pageSize,
    });
    return { response:dbResponse,statusCode:200,error:false}
  } catch (error) {
  return { response:error,statusCode:400,error:true}
  }
};

const fetchReviewByIdServices = async (reviewId) => {
  try {
    const Review = db.Review; 
    const review = await Review.findByPk(reviewId);
    if (!review) {
      return {
        response: "Review not found",
        statusCode: 400,
        error: true,
      };
    }
    return {
      response: review,
      statusCode: 200,
      error: false,
    };
  } catch (error) {
    console.log(error);
    return {
      response: error,
      statusCode: 400,
      error: true,
    };
  }
};

const deleteReviewByIdService = async (id,userId) => {
  try {
    const result = await db.Review.destroy({where: {id,userId},});
    if (result === 0) {
      return {
        response: "Review not found or could not be deleted",
        statusCode: 400,
        error: true,
      };
    }
    return {
      response: "Review deleted successfully",
      statusCode: 200,
      error: false,
    };
  } catch (error) {
    return {
      response: error,
      statusCode: 400,
      error: true,
    };
  }
};

const updateReviewByIdService = async (userId,reviewId, updatedReviewData) => {
  try {
    const result = await db.Review.update(updatedReviewData, {
      where: {
        id: reviewId,userId:userId
      },
    });
    if (result[0] === 0) {
      return {
        response: 'Review not found',
        statusCode: 400,
        error: true,
      };
    }
    return {
      response: 'Review updated successfully',
      statusCode: 200,
      error: false,
    };
  } catch (error) {
    return {
      response: error,
      statusCode: 400,
      error: true,
    };
  }
};
const reviewRepliesService =async(userId,reviewId)=>{
  console.log("user",userId,reviewId);
  const isReviewExist = await db.Review.findOne({
    where:{id:reviewId}
  });
  if(isReviewExist === null){
    return{response:"Review not found !",statusCode:400,error:true}
  }
  try {
    const exploreDbResponse = await db.Explore.findOne({
      where:{userId:userId}
    })
    if(exploreDbResponse !== null){
      const resp = await db.ReviewsReplies.create({
        userId: userId,
        reviewId:reviewId,
        text:"This is my review reply",
        isCreater:true
      })
      console.log("exploreResp",resp.dataValues)
      return{response:"Reply post Successfully",statusCode:200,error:false}
    }
    const buyerDbResponse = await db.Buyer.findOne({
      where:{userId:4}
    })
    if(buyerDbResponse !== null){
      const resp = await db.ReviewsReplies.create({
            userId: userId,
            reviewId:reviewId,
            text:"This is my review reply",
            isCreater:false
          })
          console.log("buyerResp",resp.dataValues);
          return{response:"Reply post Successfully",statusCode:200,error:false}
    }
    return{response:"User nor buyer nor creator",statusCode:400,error:true}
  } catch (error) {
    return{response:"error",statusCode:400,error:true}
  }
};
const updateReviewRepliesService=async(userId,reviewId,updatedReply)=>{
  const reviewResponse = await db.ReviewsReplies.findOne({
    where:{id:reviewId,userId:userId}
  });
  if(reviewResponse === null){
    return {response:"Reply associated with this reply is not found!",statusCode:400,error:true}
  }
  try {
    await db.ReviewsReplies.update({
       text:updatedReply},
      {where:{userId:userId,id:reviewId}
    });
    return{response:"Review Reply updated Successfully",statusCode:200,error:false}
  } catch (error) {
  return {response:"error",statusCode:400,error:true}
  }
};

module.exports = {
  reviewServices: reviewServices,
  fetchAllReviewService: fetchAllReviewService,
  fetchReviewByIdServices: fetchReviewByIdServices,
  deleteReviewByIdService:deleteReviewByIdService,
  updateReviewByIdService: updateReviewByIdService,
  reviewRepliesService:reviewRepliesService,
  updateReviewRepliesService:updateReviewRepliesService
};
