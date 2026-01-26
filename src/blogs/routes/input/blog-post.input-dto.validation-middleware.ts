import {
    contentValidation,
    shortDescriptionValidation,
    titleValidation,
} from '../validate/main'
import { idValidation } from '../../../core/middlewares/validation'

export const createBlogPostValidationMiddleware = [
    idValidation('blogId'),
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
]
