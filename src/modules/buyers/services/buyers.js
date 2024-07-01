const db = require("../../../../sequelize/models");
const { getFormattedDate } = require("../../util/util");
const createBuyerService =async(exploreId,uid, custId)=>{
    try {
        const purchasedDate = getFormattedDate();
        const dbResponse  = await db.Buyer.findOne({
            where:{uid, exploreId}
        });
        if(dbResponse !==null){
            return{ response:"You have already purchased this explore",statusCode:400,error:true}
        }else{
        await db.Buyer.create({
            exploreId:exploreId,
            uid,
            custId,
            purchasedDate: purchasedDate
        })
        return {response:'buyer created Successfully',statusCode:200,error:false}}
    } catch (error) {
        console.log("error",error)
       return {response:"error",statusCode:400,error:true} 
    }
};
// const deleteBuyerService = async(exploreId,userId)=>{
// try {
//     const dbResponse = await db.Buyer.findOne({where:{exploreId:exploreId, userId:userId}});
//     if(dbResponse === null){
//         return {response:"Buyer with this UserId is not found",statusCode:400,error:true}
//     }else{
//     await db.Buyer.destroy({
//         where:{exploreId:exploreId}
//     })
//     return{response:"Buyer Deleted Successfully",statusCode:200,error:false}}
// } catch (error) {
//     return{response:error,statusCode:400,error:true}
// }
// };

module.exports={
    createBuyerService:createBuyerService,
    // deleteBuyerService:deleteBuyerService
};