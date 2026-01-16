import {query} from 'express-validator';
import { validate, version } from 'uuid';

const codeValidation = query('code')
.exists().withMessage('code is required')
.not().withMessage('code is required')
.custom((value: string): boolean => {
    const isValid = validate(value);
    const uuidVersion = version(value); // 1-5 или undefined
    if(!isValid || uuidVersion !== 4) {
        throw new Error(`code is invalid!`);
    }
    return true;
});
export const codeConfirmationValidation = [
    codeValidation,
]