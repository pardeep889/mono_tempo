const db = require("../../../../sequelize/models");

const createPaymentsService =async(userId,email,data)=>{
    try {
      const dbResponse =  await db.Payments.create({
            userId:userId,
            exploreId:data.exploreId,
            email:email,
            amount:data.amount,
            priceId:data.priceId,
            status:data.status
        });
        if(dbResponse){
           await db.Buyer.create({
                transactionId:dbResponse.dataValues.id,
                exploreId:dbResponse.dataValues.exploreId,
                userId:userId
            });
        }
        return{response:"Payment created !",statusCode:200,error:false}
    } catch (error) {
        return{response:"Payment failed",statusCode:400,error:true}
      
    }
};

module.exports={
    createPaymentsService:createPaymentsService
}