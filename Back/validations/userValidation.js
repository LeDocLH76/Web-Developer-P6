const Joi = require('joi');

function userDataValidation(body) {
    const userDataValidationSchema = Joi.object({
        email: Joi.string()
            .email()
            .required(),
        password: Joi.string()
            .pattern(new RegExp('^[a-zA-Z0-9]{5,30}$'))
            .required()
    });
    return userDataValidationSchema.validate(body)
}
module.exports = userDataValidation