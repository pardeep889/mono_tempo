const { sendNotificationToUser } = require("../../Notification/services/notificationService");
const { createPaymentsService} = require("../services/payments");


const createpayment = async(req,res)=>{
    const {userId,email, uid}= req.user;
    const {message,statusCode,data, success} = await createPaymentsService(userId,email,uid,req.body);
    if(success){
        sendNotificationToUser(userId, userId, "Payment Recieved", `Payment of amount ${req.body.amount} has been done.`, "payment", userId);
    }
    return res.status(statusCode).send({
        message,
        data,
        success
    });

};

module.exports={
    createpayment:createpayment
};