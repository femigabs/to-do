import * as Joi from 'joi';

export const createUserSchema = Joi.object({
    first_name: Joi.string().lowercase().min(2).required(),
    last_name: Joi.string().lowercase().min(2).required(),
    email: Joi.string().email().required(),
    password: Joi.string()
        .min(8)
        .max(32) // Optional: Limit max length
        .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$"))
        .required()
        .messages({
            "string.pattern.base": "Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character.",
            "string.min": "Password must be at least 8 characters long.",
            "string.max": "Password cannot be longer than 32 characters.",
            "any.required": "Password is required."
        }),
});

export const loginUserSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});

