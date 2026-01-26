import { nameValidation, descriptionValidation, websiteUrlValidation } from '../validate/main'

export const blogInputDtoValidationMiddleware = [
    nameValidation,
    descriptionValidation,
    websiteUrlValidation,
]