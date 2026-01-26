import { body } from 'express-validator'

export const nameValidation = body('name')
    .exists()
    .withMessage('Name is required')
    .isString()
    .withMessage('Name must be a string')
    .trim()
    .isLength({ min: 1, max: 15 })
    .withMessage('Name must be between 1 and 15 characters')

export const descriptionValidation = body('description')
    .exists()
    .withMessage('Description is required')
    .isString()
    .withMessage('Description must be a string')
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage('Description must be between 1 and 500 characters')

export const websiteUrlValidation = body('websiteUrl')
    .exists()
    .withMessage('Website URL is required')
    .isString()
    .withMessage('Website URL must be a string')
    .trim()
    .matches(
        /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/
    )
    .withMessage('Website URL must be a valid URL')
    .isLength({ min: 1, max: 100 })
    .withMessage('Website URL must be between 1 and 100 characters')