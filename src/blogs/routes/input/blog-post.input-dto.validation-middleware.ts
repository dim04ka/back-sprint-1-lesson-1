import {
    contentValidation,
    shortDescriptionValidation,
    titleValidation,
} from '../validate/main'
import { blogIdValidation } from '../../../core/middlewares/validation'

export const createBlogPostValidationMiddleware = [
    blogIdValidation,
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
]
