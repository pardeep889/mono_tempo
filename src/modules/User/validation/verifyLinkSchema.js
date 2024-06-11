const Joi = require('joi');
const verifyLinkSchema = Joi.object({
  email: Joi.string().required(),
  forgotLink: Joi.string().required(),
  password: Joi.string().required(),
});
module.exports={
    verifyLinkSchema:verifyLinkSchema
}