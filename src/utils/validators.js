const Joi = require("joi");

// user registration schema
const validateRegister = (body) => {
    const schema = Joi.object({
        first_name: Joi.string().lowercase().trim().min(3).required(),
        last_name: Joi.string().lowercase().min(3).trim().required(),
        email: Joi.string().lowercase().email().min(3).trim().required(),
        password: Joi.string().min(6).required(),
        created_at: Joi.date().timestamp().default(new Date()),
        modified: Joi.date().timestamp()
    });
    return schema.validate(body);
};

// user login schema
const validateLogin = (body) => {
    const schema = Joi.object({
        email: Joi.string().email().lowercase().min(3).trim().required(),
        password: Joi.string().required()
    });
    return schema.validate(body);
};

// update user schema
const validateUpdateUser = (body) => {
    const schema = Joi.object({
        first_name: Joi.string().lowercase().trim().min(3),
        last_name: Joi.string().lowercase().min(3).trim(),
        email: Joi.string().lowercase().email().min(3).trim(),
        password: Joi.string().min(6),
        phone_no: Joi.number(),
        avatar: Joi.string(),
        country: Joi.string(),
        modified: Joi.date().timestamp()
    });
    return schema.validate(body);
};

// event validation
const validateNewEvent = (body) => {
    const schema = Joi.object({
        name: Joi.string().lowercase().required(),
        category: Joi.string()
            .valid("wedding", "birthday", "funeral", "naming")
            .lowercase()
            .required(),
        venue: Joi.string().lowercase().required(),
        description: Joi.string().lowercase(),
        created_at: Joi.date().timestamp().default(new Date()),
        modified: Joi.date().timestamp()
    });
    return schema.validate(body);
};

module.exports = {
    validateRegister,
    validateLogin,
    validateUpdateUser,
    validateNewEvent
};
