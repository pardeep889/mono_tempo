const { createPaymentsService} = require("../services/payments");


const createpayment = async(req,res)=>{
    const loggedInUser = JSON.parse(req.headers["x-logged-in-user"]);
    const {userId,email}= loggedInUser;
    const data = req.body;
    const {response,statusCode,error} = await createPaymentsService(userId,email,data);
    try {
        if(error) return res.status(statusCode).send(response);
        return res.status(statusCode).send(response);
    } catch (error) {
        return res.status(400).json("error");
    }
};

module.exports={
    createpayment:createpayment
};