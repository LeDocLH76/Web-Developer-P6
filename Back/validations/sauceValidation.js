const Joi = require('joi');

function sauceDataValidation (sauceObject) {
    const sauceDataValidationSchema = Joi.object({
        name: Joi.string()
            .trim()
            .min(3)
            .max(80)
            .required(),
        manufacturer: Joi.string()
            .trim()
            .min(3)
            .max(80)
            .required(),
        description: Joi.string()
            .trim()
            .min(3)
            .max(500)
            .required(),
        mainPepper: Joi.string()
            .trim()
            .min(3)
            .max(80)
            .required(),
        heat: Joi.number()
            .integer()
            .min(1)
            .max(10)
            .required(),
        userId: Joi.string()
            .pattern(new RegExp('^[a-z0-9]+$'))
            .required()
    });
    return sauceDataValidationSchema.validate(sauceObject)
}
module.exports = sauceDataValidation