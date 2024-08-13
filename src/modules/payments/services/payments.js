const db = require("../../../../sequelize/models");

const createPaymentsService =async(userId,email,uid,data)=>{
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
                paymentId:dbResponse.dataValues.id,
                exploreId:dbResponse.dataValues.exploreId,
                userId:userId,
                uid,                
            });
        }
        return{message:"Payment created !",statusCode:200, success:true, data: null}
    } catch (error) {
        console.log(error)
        return{message:"Payment failed",statusCode:400,success:false,  data: null}
      
    }
};

module.exports={
    createPaymentsService:createPaymentsService
}