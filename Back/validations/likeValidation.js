const Joi = require('joi');

function likeDataValidation(sauceObject) {
    const likeDataValidationSchema = Joi.object({
        like: Joi.number()
            .integer()
            .min(-1)
            .max(1),  
        userId: Joi.string()
            .pattern(new RegExp('^[a-z0-9]+$'))
            .required()
    });
    return likeDataValidationSchema.validate(sauceObject)
}

module.exports = likeDataValidation