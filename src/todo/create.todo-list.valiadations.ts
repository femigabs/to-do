import * as Joi from 'joi';

export const createTodoListSchema = Joi.object({
    name: Joi.string().min(2).required(),    
});
