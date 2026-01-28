import { query } from 'express-validator'

export const searchNameTermValidation = query('searchNameTerm')
    .optional()
    .trim()
    .isString()
    .withMessage('searchNameTerm must be a string')
