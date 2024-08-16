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

const FetchBuyersOfExploreService = async (exploreId) => {
    try {
        const dbResponse = await db.sequelize.query(
            `SELECT 
                b."exploreId" as "exploreDocId",
                u.id as "userId",
                u.username,
                u.email,
                u.uid
             FROM "Buyers" b
             JOIN "Users" u ON b.uid = u.uid
             WHERE b."exploreId" = :exploreId`,
            {
                replacements: { exploreId },
                type: db.Sequelize.QueryTypes.SELECT
            }
        );

        if (dbResponse.length > 0) {
            return { data: dbResponse, statusCode: 200, success: true, message: "Buyers Successfully Fetched" };
        } else {
            return { message: "No buyers found for this explore", statusCode: 404, success: false, data: null };
        }
    } catch (error) {
        console.log("error", error);
        return { message: "internal server error", statusCode: 500, success: false, data: null };
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
    FetchBuyersOfExploreService: FetchBuyersOfExploreService
    // deleteBuyerService:deleteBuyerService
};