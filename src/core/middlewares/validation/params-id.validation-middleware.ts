import { param } from 'express-validator'

export const idValidation = (field: string = 'id') =>
    param(field)
        .exists()
        .withMessage('ID is required')
        .isString()
        .withMessage('ID must be a string')
        .isLength({ min: 1 })
        .withMessage('ID must not be empty')
        .isMongoId()
        .withMessage('Incorrect format of ObjectId')
