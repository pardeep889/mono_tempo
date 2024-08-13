const { createPaymentsService} = require("../services/payments");


const createpayment = async(req,res)=>{
    const {userId,email, uid}= req.user;
    const {message,statusCode,data, success} = await createPaymentsService(userId,email,uid,req.body);
    return res.status(statusCode).send({
        message,
        data,
        success
    });

};

module.exports={
    createpayment:createpayment
};