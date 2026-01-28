import { HttpStatus } from './http-statuses'

type ValidationErrorOutput = {
    status: HttpStatus
    detail: string
    source: { pointer: string }
    code: string | null
    message: string
    field: string
}

export type ValidationErrorListOutput = {
    errorsMessages: ValidationErrorOutput[]
}
