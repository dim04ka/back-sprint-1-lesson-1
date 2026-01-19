import { body } from 'express-validator'

export const titleValidation = body('title')
    .exists()
    .withMessage('Name is required')
    .isString()
    .withMessage('Name must be a string')
    .trim()
    .isLength({ min: 1, max: 30 })
    .withMessage('Title must be between 1 and 30 characters')

export const shortDescriptionValidation = body('shortDescription')
    .exists()
    .withMessage('Short description is required')
    .isString()
    .withMessage('Short description must be a string')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage(
        'Short description must be between 1 and 100 characters'
    )

export const contentValidation = body('content')
    .exists()
    .withMessage('Content is required')
    .isString()
    .withMessage('Content must be a string')
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage('Content must be between 1 and 1000 characters')

export const blogIdValidation = body('blogId')
    .exists()
    .withMessage('Blog ID is required')
    .isString()
    .withMessage('Blog ID must be a string')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Blog ID must not be empty')

export const createPostValidationMiddleware = [
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    blogIdValidation,
]
