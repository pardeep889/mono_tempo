const db = require("../../../../sequelize/models");
const createBuyerService =async(transactionId,exploreId,userId)=>{
    try {
        const dbResponse  = await db.Buyer.findOne({
            where:{transactionId}
        });
        if(dbResponse !==null){
            return{ response:"Transaction Id already exists!",statusCode:400,error:true}
        }else{
        await db.Buyer.create({
            transactionId:transactionId,
            exploreId:exploreId,
            userId:userId
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