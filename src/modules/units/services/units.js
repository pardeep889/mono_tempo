const db = require("../../../../sequelize/models");

const createUnitService = async (userId,title, description, exploreId) => {
    const dbResponse = await db.Explore.findOne({
      where:{id:exploreId,userId:userId}
    });
    if(dbResponse !== null){
      try {
        const unitCount = await db.Unit.count({
          where: { exploreId },
        });
        if (unitCount >= 5) {
          return {
            response: "Explore already has the maximum number of units (5).",
            statusCode: 400,
            error: true,
          };
        }
        const nextUnitNumber = unitCount + 1;
        const dbResponse = await db.Unit.create({
          title: title,
          description: description,
          unitNumber: nextUnitNumber,
          exploreId: exploreId,
        });
        return { response: dbResponse.dataValues, statusCode: 200, error: false };
      } catch (error) {
        return { response: error, statusCode: 400, error: true };
      }
    }else{
      return { response: "Explore with this userId is not found", statusCode: 400, error: true };

    }

    
  };
const updateUnitService = async(unitId,userId,data)=>{
  const dbResponse = await db.Explore.findOne({
    where:{id:data.exploreId,userId:userId}
  });
  if(dbResponse !== null){
  try {
    await db.Unit.update({
      title:data.title,
      description:data.description,
      },
      {where:{id:unitId}
    })
  return{response:"Unit update successfully !",statusCode:200,error:false}
  } catch (error) {
  return{response:"error",statusCode:400,error:true} 
  }}else{
    return{response:"Explore with this userId is Not found!",statusCode:400,error:true}
  }
};
const deleteUnitService = async(userId,id)=>{
  try {
    const dbResponse = await db.Unit.findOne({
      where: { id: id },
    });
    if (dbResponse == null) {
      return {
        error: true,
        response: "Unit with this id is not found",
        statusCode: 400,
      };
    } else {
        const exploreId =dbResponse.dataValues.exploreId;
        const exploreResponse =await db.Explore.findOne({
          where:{id:exploreId,userId:userId}
        });
        if(exploreResponse !== null){
      await db.Unit.destroy({
        where: { id: id },
      });
      return {
        response: "Unit Deleted SuccessFully",
        statusCode: 200,
        error: false,
      };
    }else{
      return {response:"Explore with this Userid is not found!",statusCode:400,error:true}
    }
    }
    
  } catch (error) {
    console.log("error", error);
    return { response: error, statusCode: 400, error: true };
  }
};
const createVideoService =async(userId,data)=>{
  const dbResponse = await db.Explore.findOne({
    where:{id:data.exploreId,userId:userId}
  });
  if(dbResponse !== null){
  try {
    const videoCount = await db.Video.count({
      where: { unitNumber:data.unitNumber },
    });
    if (videoCount >= 5) {
      return {
        response: "Video already has the maximum number of units (5).",
        statusCode: 400,
        error: true,
      };
    }
    const nextVideoNumber = videoCount + 1;
    const dbResponse = await db.Video.create({
      likesCount:data.likesCount,
      comments:data.comments,
      videoPath:data.videoPath,
      coverImagePath:data.coverImagePath,
      localPath:data.localPath,
      caption:data.caption,
      unitNumber:data.unitNumber,
      videoNumber:nextVideoNumber,
      title:data.title,
      totalCommentsCount:data.totalCommentsCount,
      exploreId:data.exploreId,
      likes:data.likes
    })
    return{response:dbResponse.dataValues,statusCode:200,error:false}
  } catch (error) {
    return{response:"error",statusCode:400,error:true}
  }}
  else{
    return {response:"Explore with this userId is not found!",statusCode:400,error:true}
  }
};
const updateVideoService =async(id,userId,data)=>{
  const dbResponse = await db.Video.findOne({
    where:{id}
  });
  const exploreId = dbResponse.dataValues.exploreId;
  const exploreResponse = await db.Explore.findOne({
    where:{id:exploreId,userId:userId}
  });
  if(exploreResponse!==null){
  try {
    await db.Video.update({
      caption:data.caption,
      title:data.title,
     },
      {where:{id}
    });
  return{response:"Video update successfully !",statusCode:200,error:false}
  } catch (error) {
  return{response:"error",statusCode:400,error:true} 
  }}else{
  return{response:"explore with this userId is not found!",statusCode:400,error:true} 
  }
};
const deleteVideoService=async(userId,id)=>{
  try {
    const dbResponse = await db.Video.findOne({
      where: { id: id },
    });
    if (dbResponse == null) {
      return {
        error: true,
        response: "Video with this id is not found",
        statusCode: 400,
      };
    } else {
      const exploreId =dbResponse.dataValues.exploreId;
      const exploreResponse = await db.Explore.findOne({where:{id:exploreId,userId:userId}});
      if(exploreResponse!== null){
        await db.Video.destroy({
          where: { id: id },
        });
      }else{
        return{response:"Explore with this userId is not found!",statusCode:400,error:true}
      }
      
    }
    return {
      response: "Video Deleted SuccessFully",
      statusCode: 200,
      error: false,
    };
  } catch (error) {
    console.log("error", error);
    return { response: error, statusCode: 400, error: true };
  }
};
const likeVideoService =async(videoId,userId)=>{
  const dbResponse = await db.Video.findOne({
    where:{id:videoId}
  });
  if(dbResponse === null){
    return {response:"Video not found",statusCode}
  };
  const exploreId =dbResponse.dataValues.exploreId;
  const exploreResponse = await db.Explore.findOne({where:{id:exploreId,userId:userId}});
  if(exploreResponse !== null){
  try {
    const dbResponse =await db.Video.findOne({
      where:{id:videoId}
    });
    let  currentLikes = dbResponse.dataValues.likes;
    let likesCount = dbResponse.dataValues.likes.length;

    const indexToRemove =currentLikes.indexOf(JSON.stringify(userId));
    
    let updatedArray =[];
    if(indexToRemove !== -1){
      updatedArray = currentLikes.slice(0, indexToRemove).concat(currentLikes.slice(indexToRemove + 1));
      await db.Video.update({
        likes : updatedArray,
        likesCount: Number(likesCount)-1
      },{where:{id:videoId}
      })
    }else{
      updatedArray = currentLikes.concat( JSON.stringify(userId));
     await db.Video.update({
      likes : updatedArray,
      likesCount: Number(likesCount)+1
    },{where:{id:videoId}
    })
    }
    return{response:updatedArray,statusCode:200,error:false}
  } catch (error) {
    console.log("error",error)
    return{response:'error',statusCode:400,error:true}
  }
  }else{
    return {response:"Explore with this userId is not found!",statusCode:400,error:true}
  }
};

module.exports={
    createUnitService:createUnitService,
    updateUnitService:updateUnitService,
    deleteUnitService:deleteUnitService,
    createVideoService:createVideoService,
    updateVideoService:updateVideoService,
    deleteVideoService:deleteVideoService,
    likeVideoService:likeVideoService
}





