import { body } from 'express-validator'
import { Resolution } from '../../../videos/dto'

const titleValidation = body('title')
    .isString()
    .withMessage('Title should be string')
    .trim()
    .isLength({ min: 1, max: 40 })
    .withMessage('Title must be between 1 and 40 characters')

const authorValidation = body('author')
    .isString()
    .withMessage('Author should be string')
    .trim()
    .isLength({ min: 1, max: 20 })
    .withMessage('Author must be between 1 and 20 characters')

const availableResolutionsValidation = body('availableResolutions')
    .isArray()
    .withMessage('Available resolutions should be array')
    .custom((value) => {
        return value.every((item: Resolution) =>
            Object.values(Resolution).includes(item)
        )
    })
    .withMessage('Available resolutions should be array of strings')

export const createVideoValidationMiddleware = [
    titleValidation,
    authorValidation,
    availableResolutionsValidation,
]
