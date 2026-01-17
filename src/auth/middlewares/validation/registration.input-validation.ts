import {body} from 'express-validator';

const codeValidation = body('code')
    .exists().withMessage('Code is required')
    .isString().withMessage('Code should be string')
    .trim()
    .notEmpty().withMessage('Code cannot be empty')
    .isUUID().withMessage('Code should be a valid UUID');

export const codeConfirmationValidation = [
    codeValidation,
]