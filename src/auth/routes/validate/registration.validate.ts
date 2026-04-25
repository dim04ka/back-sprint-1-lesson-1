import { body } from 'express-validator'

export const codeValidation = body('code')
    .isString()
    .trim()
    .isLength({ min: 1 })
    .withMessage('confirmation code is not correct')

export const loginValidation = body('login')
    .isString()
    .trim()
    .isLength({ min: 3, max: 10 })
    .withMessage('login is not correct')
    .matches(/^[a-zA-Z0-9_-]*$/)
    .withMessage('login is not correct')

export const passwordValidation = body('password')
    .isString()
    .trim()
    .isLength({ min: 6, max: 20 })
    .withMessage('password is not correct')

export const emailValidation = body('email')
    .isString()
    .trim()
    .isLength({ min: 1 })
    .isEmail()
    .withMessage('email is not correct')
    .matches(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/)
    .withMessage('email is not correct')

export const registrationValidationMiddleware = [
    emailValidation,
    loginValidation,
    passwordValidation,
]
