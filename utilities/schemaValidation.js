const Joi = require('joi').defaults((schema) => schema.options({ allowUnknown: true }));

const validateResponseSchema = (json) => {
    const questionSchema = Joi.object({
            id: Joi.string().required(),
            type: Joi.string().required(),
            name: Joi.string().required(),
            value: Joi.alternatives().match('one').try(Joi.string(), Joi.number()).required().allow(null),
    });
    const responseSchema = Joi.object({
        responses: Joi.array()
        .items({
            questions: Joi.array()
            .items(questionSchema).min(1).required(),
        }).min(1).required(),
        totalResponses: Joi.number().required(),
        pageCount: Joi.number().required(),
    });
    const {error, value} = responseSchema.validate(json, {abortEarly: false});
    if (error) throw error;
    return true;
}

const validateFilterSchema = (json) => {
    const filterSchema = Joi.array().items(
        Joi.object({
            id: Joi.string().required(),
            condition: Joi.string().valid('equals', 'does_not_equal', 'greater_than', 'less_than').required(),
            value: Joi.alternatives().match('one').try(Joi.string(), Joi.number()).allow(null).required(),
        })
    );
    const {error, value} = filterSchema.validate(json, {abortEarly: false});
    if (error) throw error;
    return true;
}

module.exports = { validateResponseSchema, validateFilterSchema }