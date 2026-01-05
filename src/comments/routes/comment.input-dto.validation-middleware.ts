import {body} from 'express-validator';

const contentValidation = body('content')
    .exists().withMessage('content is required')
    .isString().withMessage('content must be a string')
    .trim()
    .notEmpty().withMessage('content is required')
    .isLength({min: 20, max: 300}).withMessage('content must be at least 20 characters and max 300')
export const commentCreateValidation = [
    contentValidation,
]