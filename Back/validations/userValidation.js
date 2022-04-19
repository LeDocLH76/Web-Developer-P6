const Joi = require('joi');

function userDataValidation(body) {
    const userDataValidationSchema = Joi.object({
        email: Joi.string()
            .email()
            .required(),
        password: Joi.string()
        .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@$!%*?&])[a-zA-Z0-9@$!%*?&]{8,30}$'))
        .required()
    });
    // Password => Minimum eight and maximum 30 characters,
    // at least one uppercase letter, one lowercase letter,
    // one number and one special character.
    return userDataValidationSchema.validate(body)
}

module.exports = userDataValidation