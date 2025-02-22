import * as Joi from 'joi';

export const createTaskSchema = Joi.object({
    description: Joi.string().min(2).required(),
    dueDate: Joi.date().required()    
});

export const updateTaskSchema = Joi.object({
    description: Joi.string().min(2).required(),
    dueDate: Joi.date().required(),
    status: Joi.string().valid('completed')
});
