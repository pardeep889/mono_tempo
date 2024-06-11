const { createUnitService, updateUnitService, deleteUnitService, createVideoService, updateVideoService, deleteVideoService, likeVideoService } = require("../services/units");

const createUnit = async(req,res)=>{
    const loggedInUser = JSON.parse(req.headers["x-logged-in-user"]);
    const userId = loggedInUser.userId;
    const {title,description,exploreId}=req.body;
    const {response,statusCode,error} = await createUnitService(userId,title,description,exploreId);
    try {
        if (error) return res.status(statusCode).send(response);
        return res.status(statusCode).send(response);
      } catch (error) {
        return res.status(400).json("error")
      } 
};
const updateUnit = async(req,res)=>{
  const loggedInUser = JSON.parse(req.headers["x-logged-in-user"]);
  const userId = loggedInUser.userId;
  const unitId = req.params.id;
  const {response,statusCode,error} = await updateUnitService(unitId,userId,req.body);
  try {
    if (error) return res.status(statusCode).send(response);
    return res.status(statusCode).send(response);
  } catch (error) {
    return res.status(400).json("error")
  } 
};

const deleteUnit = async(req,res)=>{
  const loggedInUser = JSON.parse(req.headers["x-logged-in-user"]);
  const userId = loggedInUser.userId;
  const id = req.params.id;
  const {response,statusCode,error} = await deleteUnitService(userId,id);
  try {
    if (error) return res.status(statusCode).send(response);
    return res.status(statusCode).send(response);
  } catch (error) {
    return res.status(400).json("error")
  } 
};
const createVideo = async(req,res)=>{
  const loggedInUser = JSON.parse(req.headers["x-logged-in-user"]);
  const userId = loggedInUser.userId;
  const {response,statusCode,error} = await createVideoService(userId,req.body);
  try {
    if (error) return res.status(statusCode).send(response);
    return res.status(statusCode).send(response);
  } catch (error) {
    return res.status(400).json("error")
  } 
};
const updateVideo = async(req,res)=>{
  const loggedInUser = JSON.parse(req.headers["x-logged-in-user"]);
  const userId = loggedInUser.userId;
  const id = req.params.id;
  const {response,statusCode,error} = await updateVideoService(id,userId,req.body);
  try {
    if (error) return res.status(statusCode).send(response);
    return res.status(statusCode).send(response);
  } catch (error) {
    return res.status(400).json("error")
  } 
};
const deleteVideo = async(req,res)=>{
  const loggedInUser = JSON.parse(req.headers["x-logged-in-user"]);
  const userId = loggedInUser.userId;
  const id = req.params.id;
  const {response,statusCode,error} = await deleteVideoService(userId,id);
  try {
    if (error) return res.status(statusCode).send(response);
    return res.status(statusCode).send(response);
  } catch (error) {
    return res.status(400).json("error")
  } 
};
const likeVideo=async(req,res)=>{
  const videoId = req.params.id;
  const loggedInUser = JSON.parse(req.headers["x-logged-in-user"]);
  const userId = loggedInUser.userId;
  const {response,statusCode,error} = await likeVideoService(videoId,userId);
  try {
    if (error) return res.status(statusCode).send(response);
    return res.status(statusCode).send(response);
  } catch (error) {
    return res.status(400).json("error")
  } 
};

module.exports={
    createUnit:createUnit,
    updateUnit:updateUnit,
    deleteUnit:deleteUnit,
    createVideo:createVideo,
    updateVideo:updateVideo,
    deleteVideo:deleteVideo,
    likeVideo:likeVideo
}