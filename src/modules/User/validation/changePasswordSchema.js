const Joi = require('joi');
const changePasswordSchema = Joi.object({
  email: Joi.string().required(),
  old_password: Joi.string().required(),
  new_password: Joi.string().required(),
});
module.exports={
    changePasswordSchema:changePasswordSchema
}