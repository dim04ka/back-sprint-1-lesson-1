import {
    validationResult,
    ValidationError,
    FieldValidationError,
} from 'express-validator'
import { Request, Response, NextFunction } from 'express'
import { HttpStatus } from '../../types/http-statuses'

const formatErrors = (error: ValidationError) => {
    return {
        field: (error as FieldValidationError).path!, // Поле с ошибкой
        message: error.msg, // Сообщение ошибки
    }
}

export const inputValidationResultMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const errors = validationResult(req)
        .formatWith(formatErrors)
        .array({ onlyFirstError: true })

    if (errors.length) {
        return res
            .status(HttpStatus.BadRequest)
            .json({ errorMessages: errors })
    }

    next() // Если ошибок нет, передаём управление дальше
}
